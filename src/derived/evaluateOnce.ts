import InternalAnimatedValue from '../core/InternalAnimatedValue';
import { createAnimatedSet as set } from '../core/AnimatedSet';
import { createAnimatedCall as call } from '../core/AnimatedCall';
import { createAnimatedAlways as always } from '../core/AnimatedAlways';
import { createAnimatedCond as cond } from '../core/AnimatedCond';
import { AnimatedValue, Value, AnimatedNode } from '../types';

/**
 * evaluate given node and notify children
 * @param node - node to be evaluated
 * @param input - nodes (or one node) representing values which states input for node.
 * @param callback - after callback
 */

export function evaluateOnce(
  node: AnimatedNode<Value>,
  input: AnimatedNode<Value>[] | AnimatedNode<Value> = [],
  callback?: () => void
) {
  if (!Array.isArray(input)) {
    input = [input];
  }
  const done = (new InternalAnimatedValue<number>(
    0
  ) as unknown) as AnimatedValue<number>;
  const evalNode = cond(
    done,
    0,
    call([node, set(done, 1)], () => {
      callback && callback();
      for (let i = 0; i < (input as AnimatedNode<Value>[]).length; i++) {
        input[i].__removeChild(alwaysNode);
        alwaysNode.__detach();
      }
    })
  );
  const alwaysNode = always(evalNode);
  for (let i = 0; i < input.length; i++) {
    (input[i] as any).__addChild(alwaysNode);
    alwaysNode.__attach();
  }
}
