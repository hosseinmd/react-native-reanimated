/* global _WORKLET _measure _scrollTo */
import { findNodeHandle } from 'react-native';

export function getTag(view) {
  return findNodeHandle(view);
}

/**
 * fields that can be accessed:
 *  x
 *  y
 *  width
 *  height
 *  pageX
 *  pageY
 */
export function measure(animatedRef) {
  'worklet';
  //@ts-ignore
  if (!_WORKLET) {
    throw new Error('(measure) method cannot be used on RN side!');
  }
  const viewTag = animatedRef();
  //@ts-ignore
  const result = _measure(viewTag);
  if (result.x === -1234567) {
    throw new Error(`The view with tag ${viewTag} could not be measured`);
  }
  return result;
}

export function scrollTo(animatedRef, x, y, animated) {
  'worklet';
  //@ts-ignore
  if (!_WORKLET) {
    return;
  }
  const viewTag = animatedRef();
  //@ts-ignore
  _scrollTo(viewTag, x, y, animated);
}
