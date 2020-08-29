import invariant from 'fbjs/lib/invariant';
import { adapt } from '../core/AnimatedBlock';
import { val } from '../val';
import InternalAnimatedNode from './AnimatedNode';
import { Adaptable, Value, AnimatedNode } from '../types';

class AnimatedCond extends InternalAnimatedNode {
  _condition;
  _ifBlock;
  _elseBlock;

  constructor(condition, ifBlock, elseBlock) {
    invariant(
      condition instanceof InternalAnimatedNode,
      `Reanimated: Animated.cond node first argument should be of type AnimatedNode but got ${condition}`
    );
    invariant(
      ifBlock instanceof InternalAnimatedNode,
      `Reanimated: Animated.cond node second argument should be of type AnimatedNode but got ${ifBlock}`
    );
    invariant(
      elseBlock instanceof InternalAnimatedNode || elseBlock === undefined,
      `Reanimated: Animated.cond node third argument should be of type AnimatedNode or should be undefined but got ${elseBlock}`
    );
    super(
      {
        type: 'cond',
        cond: condition,
        ifBlock,
        elseBlock,
      },
      [condition, ifBlock, elseBlock]
    );
    this._condition = condition;
    this._ifBlock = ifBlock;
    this._elseBlock = elseBlock;
  }

  toString() {
    return `AnimatedCond, id: ${this.__nodeID}`;
  }

  __onEvaluate() {
    if (val(this._condition)) {
      return val(this._ifBlock);
    } else {
      return this._elseBlock !== undefined ? val(this._elseBlock) : undefined;
    }
  }
}

export function createAnimatedCond<
  T1 extends Value = number,
  T2 extends Value = number
>(
  cond: Adaptable<number>,
  ifBlock: Adaptable<T1>,
  elseBlock?: Adaptable<T2>
): AnimatedNode<T1 | T2> {
  return new AnimatedCond(
    adapt(cond),
    adapt(ifBlock),
    elseBlock === undefined ? undefined : adapt(elseBlock)
  ) as any;
}
