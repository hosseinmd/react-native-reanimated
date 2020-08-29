import { cond, defined, set, add, min, max } from '../base';
import InternalAnimatedValue from '../core/InternalAnimatedValue';
import diff from './diff';
import { Adaptable, AnimatedNode, AnimatedValue } from '../types';

export default function diffClamp(
  a: Adaptable<number>,
  minVal: Adaptable<number>,
  maxVal: Adaptable<number>
): AnimatedNode<number> {
  const value = (new InternalAnimatedValue() as unknown) as AnimatedValue<
    number
  >;
  return set(
    value,
    min(max(add(cond(defined(value), value, a), diff(a)), minVal), maxVal)
  ) as AnimatedNode<number>;
}
