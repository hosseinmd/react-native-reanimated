import React from 'react';
import AnimatedValue from './core/AnimatedValue';
import { Value } from './types';

export default function useValue(initialValue: Value) {
  const ref = React.useRef(null);
  if (ref.current === null) {
    ref.current = new AnimatedValue(initialValue);
  }
  return ref.current;
}
