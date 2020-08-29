import { Adaptable, Value } from './types';
import InternalAnimatedNode from './core/AnimatedNode';

export function val(v?: Adaptable<Value>) {
  //just for use InternalAnimatedNode type
  const value = (v as unknown) as InternalAnimatedNode;
  return v && value.__getValue ? value.__getValue() : v || 0;
}
