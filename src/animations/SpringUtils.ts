import {
  cond,
  sub,
  divide,
  multiply,
  add,
  pow,
  lessOrEq,
  and,
  greaterThan,
} from './../base';
import InternalAnimatedValue from './../core/InternalAnimatedValue';
import { AnimatedNode, AnimatedValue } from '../types';

function stiffnessFromOrigamiValue(oValue: number) {
  return (oValue - 30) * 3.62 + 194;
}

function dampingFromOrigamiValue(oValue: number) {
  return (oValue - 8) * 3 + 25;
}

function stiffnessFromOrigamiNode(oValue: AnimatedNode<number>) {
  return add(multiply(sub(oValue, 30), 3.62), 194);
}

function dampingFromOrigamiNode(oValue: AnimatedNode<number>) {
  return add(multiply(sub(oValue, 8), 3), 25);
}

function makeConfigFromOrigamiTensionAndFriction(prevConfig: {
  [x: string]: any;
  tension: any;
  friction: any;
}) {
  const { tension, friction, ...rest } = prevConfig;
  return {
    ...rest,
    stiffness:
      typeof tension === 'number'
        ? stiffnessFromOrigamiValue(tension)
        : stiffnessFromOrigamiNode(tension),
    damping:
      typeof friction === 'number'
        ? dampingFromOrigamiValue(friction)
        : dampingFromOrigamiNode(friction),
  };
}

function makeConfigFromBouncinessAndSpeed(prevConfig: {
  [x: string]: any;
  bounciness: any;
  speed: any;
}) {
  const { bounciness, speed, ...rest } = prevConfig;
  if (typeof bounciness === 'number' && typeof speed === 'number') {
    return fromBouncinessAndSpeedNumbers(bounciness, speed, rest);
  }
  return fromBouncinessAndSpeedNodes(bounciness, speed, rest);
}

function fromBouncinessAndSpeedNodes(
  bounciness: any,
  speed: any,
  rest: { [x: string]: any }
) {
  function normalize(
    value: AnimatedNode<number>,
    startValue: number,
    endValue: number
  ) {
    return divide(sub(value, startValue), sub(endValue, startValue));
  }

  function projectNormal(n: AnimatedNode<number>, start: number, end: number) {
    return add(start, multiply(n, sub(end, start)));
  }

  function linearInterpolation(
    t: AnimatedNode<number>,
    start: AnimatedNode<number>,
    end: number
  ) {
    return add(multiply(t, end), multiply(sub(1, t), start));
  }

  function quadraticOutInterpolation(
    t: AnimatedNode<number>,
    start: AnimatedNode<number>,
    end: number
  ) {
    return linearInterpolation(sub(multiply(2, t), multiply(t, t)), start, end);
  }

  function b3Friction1(x: AnimatedNode<number>) {
    return add(
      sub(multiply(0.0007, pow(x, 3)), multiply(0.031, pow(x, 2))),
      multiply(0.64, x),
      1.28
    );
  }

  function b3Friction2(x: AnimatedNode<number>) {
    return add(
      sub(multiply(0.000044, pow(x, 3)), multiply(0.006, pow(x, 2))),
      multiply(0.36, x),
      2
    );
  }

  function b3Friction3(x: AnimatedNode<number>) {
    return add(
      sub(multiply(0.00000045, pow(x, 3)), multiply(0.000332, pow(x, 2))),
      multiply(0.1078, x),
      5.84
    );
  }

  function b3Nobounce(tension: AnimatedNode<number>) {
    return cond(
      lessOrEq(tension, 18),
      b3Friction1(tension),
      cond(
        and(greaterThan(tension, 18), lessOrEq(tension, 44)),
        b3Friction2(tension),
        b3Friction3(tension)
      )
    );
  }

  let b = normalize(divide(bounciness, 1.7), 0, 20);
  b = projectNormal(b, 0, 0.8);
  const s = normalize(divide(speed, 1.7), 0, 20);
  const bouncyTension = projectNormal(s, 0.5, 200);
  const bouncyFriction = quadraticOutInterpolation(
    b,
    b3Nobounce(bouncyTension),
    0.01
  );
  return {
    ...rest,
    stiffness: stiffnessFromOrigamiNode(bouncyTension),
    damping: dampingFromOrigamiNode(bouncyFriction),
  };
}

function fromBouncinessAndSpeedNumbers(
  bounciness: number,
  speed: number,
  rest: { [x: string]: any }
) {
  function normalize(value, startValue, endValue) {
    return (value - startValue) / (endValue - startValue);
  }

  function projectNormal(n: number, start: number, end: number) {
    return start + n * (end - start);
  }

  function linearInterpolation(t: number, start: number, end: number) {
    return t * end + (1 - t) * start;
  }

  function quadraticOutInterpolation(t: number, start: number, end: number) {
    return linearInterpolation(2 * t - t * t, start, end);
  }

  function b3Friction1(x: number) {
    return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
  }

  function b3Friction2(x: number) {
    return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2;
  }

  function b3Friction3(x: number) {
    return (
      0.00000045 * Math.pow(x, 3) -
      0.000332 * Math.pow(x, 2) +
      0.1078 * x +
      5.84
    );
  }

  function b3Nobounce(tension: number) {
    if (tension <= 18) {
      return b3Friction1(tension);
    } else if (tension > 18 && tension <= 44) {
      return b3Friction2(tension);
    } else {
      return b3Friction3(tension);
    }
  }

  let b = normalize(bounciness / 1.7, 0, 20);
  b = projectNormal(b, 0, 0.8);
  const s = normalize(speed / 1.7, 0, 20);
  const bouncyTension = projectNormal(s, 0.5, 200);
  const bouncyFriction = quadraticOutInterpolation(
    b,
    b3Nobounce(bouncyTension),
    0.01
  );

  return {
    ...rest,
    stiffness: stiffnessFromOrigamiValue(bouncyTension),
    damping: dampingFromOrigamiValue(bouncyFriction),
  };
}

export interface MakeDefaultConfigResponse {
  stiffness: AnimatedValue<number>;
  mass: AnimatedValue<number>;
  damping: AnimatedValue<number>;
  overshootClamping: false;
  restSpeedThreshold: 0.001;
  restDisplacementThreshold: 0.001;
  toValue: AnimatedValue<number>;
}

function makeDefaultConfig(): MakeDefaultConfigResponse {
  return {
    stiffness: new InternalAnimatedValue(100),
    mass: new InternalAnimatedValue(1),
    damping: new InternalAnimatedValue(10),
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new InternalAnimatedValue(0),
  } as any;
}

export default {
  makeDefaultConfig,
  makeConfigFromBouncinessAndSpeed,
  makeConfigFromOrigamiTensionAndFriction,
};
