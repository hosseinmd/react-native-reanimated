import invariant from 'fbjs/lib/invariant';
import { adapt } from '../core/AnimatedBlock';
import AnimatedNode from './AnimatedNode';
import { val } from '../val';
import { Adaptable, Value } from '../types';

export class AnimatedConcat extends AnimatedNode {
  private _input: Adaptable<Value>[];
  constructor(input: Adaptable<Value>[]) {
    invariant(
      input.every(
        (el: any) =>
          el instanceof AnimatedNode ||
          typeof el === 'number' ||
          typeof el === 'string'
      ),
      `Reanimated: Animated.concat node arguments should be of type AnimatedNode or String or Number. One or more of them are not of that type. Node: ${input}`
    );
    super({ type: 'concat', input }, input);
    this._input = input;
  }

  __onEvaluate() {
    return this._input.reduce((prev, current) => prev + val(current), '');
  }

  toString() {
    return `AnimatedConcat, id: ${this.__nodeID}`;
  }
}

export function createAnimatedConcat(
  ...args: (
    | string
    | number
    | AnimatedNode<number>
    | readonly (
        | number
        | AnimatedNode<number>
        | readonly (number | AnimatedNode<number>)[])[])[]
) {
  return new AnimatedConcat(args.map(adapt)) as AnimatedNode<string>;
}
