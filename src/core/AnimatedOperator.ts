import InternalAnimatedNode from './AnimatedNode';
import { val } from '../val';

import invariant from 'fbjs/lib/invariant';
import { adapt } from '../core/AnimatedBlock';
import { Adaptable, Value, AnimatedNode } from '../types';

function reduce(fn: (a: any, b: any) => number) {
  return (input: any[]) => input.reduce((a: any, b: any) => fn(val(a), val(b)));
}

function reduceFrom(fn: (a: any, b: any) => any, initialValue: boolean) {
  return (input: any[]) =>
    input.reduce((a: any, b: any) => fn(val(a), val(b)), initialValue);
}

function infix(fn: (a: any, b: any) => boolean) {
  return (input: any[]) => fn(val(input[0]), val(input[1]));
}

function single(fn: (a: any) => number | boolean) {
  return (input: any[]) => fn(val(input[0]));
}

const OPERATIONS = {
  // arithmetic
  add: reduce((a: any, b: any) => a + b),
  sub: reduce((a: number, b: number) => a - b),
  multiply: reduce((a: number, b: number) => a * b),
  divide: reduce((a: number, b: number) => a / b),
  pow: reduce((a: number, b: number) => Math.pow(a, b)),
  modulo: reduce((a: number, b: number) => ((a % b) + b) % b),
  sqrt: single((a: number) => Math.sqrt(a)),
  log: single((a: number) => Math.log(a)),
  sin: single((a: number) => Math.sin(a)),
  cos: single((a: number) => Math.cos(a)),
  tan: single((a: number) => Math.tan(a)),
  acos: single((a: number) => Math.acos(a)),
  asin: single((a: number) => Math.asin(a)),
  atan: single((a: number) => Math.atan(a)),
  exp: single((a: number) => Math.exp(a)),
  round: single((a: number) => Math.round(a)),
  abs: single((a: number) => Math.abs(a)),
  ceil: single((a: number) => Math.ceil(a)),
  floor: single((a: number) => Math.floor(a)),
  max: reduce((a: number, b: number) => Math.max(a, b)),
  min: reduce((a: number, b: number) => Math.min(a, b)),

  // logical
  and: reduceFrom((a: any, b: any) => a && b, true),
  or: reduceFrom((a: any, b: any) => a || b, false),
  not: single((a: any) => !a),
  defined: single((a: any) => a !== null && a !== undefined && !isNaN(a)),

  // comparing
  lessThan: infix((a: number, b: number) => a < b),
  /* eslint-disable-next-line eqeqeq */
  eq: infix((a: any, b: any) => a == b),
  greaterThan: infix((a: number, b: number) => a > b),
  lessOrEq: infix((a: number, b: number) => a <= b),
  greaterOrEq: infix((a: number, b: number) => a >= b),
  /* eslint-disable-next-line eqeqeq */
  neq: infix((a: any, b: any) => a != b),
};

class AnimatedOperator extends InternalAnimatedNode {
  _input: any;
  _op: string | number;
  _operation: (arg0: any) => any;

  constructor(operator: any, input: Adaptable<Value>[]) {
    invariant(
      typeof operator === 'string',
      `Reanimated: Animated.operator node first argument should be of type String, but got: ${operator}`
    );
    invariant(
      input.every(
        (el: any) =>
          el instanceof InternalAnimatedNode ||
          typeof el === 'string' ||
          typeof el === 'number'
      ),
      `Reanimated: Animated.operator node second argument should be one or more of type AnimatedNode, String or Number but got ${input}`
    );
    super({ type: 'op', op: operator, input }, input);
    this._op = operator;
    this._input = input;
  }

  toString() {
    return `AnimatedOperator, id: ${this.__nodeID}`;
  }

  __onEvaluate() {
    if (!this._operation) {
      this._operation = OPERATIONS[this._op];
      invariant(this._operation, `Illegal operator '%s'`, this._op);
    }
    return this._operation(this._input);
  }
}

export function createAnimatedOperator(name: any) {
  return (...args: Adaptable<Value>[]) =>
    (new AnimatedOperator(name, args.map(adapt)) as unknown) as AnimatedNode<
      number
    >;
}
