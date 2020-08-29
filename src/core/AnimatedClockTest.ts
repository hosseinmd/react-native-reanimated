import InternalAnimatedNode from './AnimatedNode';
import AnimatedClock from './AnimatedClock';
import { AnimatedNode } from '../types';

class AnimatedClockTest extends InternalAnimatedNode {
  _clockNode;

  constructor(clockNode) {
    super({ type: 'clockTest', clock: clockNode });
    this._clockNode = clockNode;
  }

  toString() {
    return `AnimatedClockTest, id: ${this.__nodeID}`;
  }

  __onEvaluate() {
    return this._clockNode.isStarted() ? 1 : 0;
  }
}

export function createAnimatedClockTest(clock: AnimatedClock) {
  return (new AnimatedClockTest(clock) as unknown) as AnimatedNode<number>;
}
