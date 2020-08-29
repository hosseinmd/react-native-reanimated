import { createAnimatedSet as set } from '../core/AnimatedSet';
import interpolate from '../derived/interpolate';
import InternalAnimatedValue from './InternalAnimatedValue';
import { Platform } from 'react-native';
import { evaluateOnce } from '../derived/evaluateOnce';
import ReanimatedModule from '../ReanimatedModule';
import { val } from '../val';
import { Value } from '../types';

// Animated value wrapped with extra methods for omit cycle of dependencies
export default class AnimatedValue<
  T extends Value
> extends InternalAnimatedValue<T> {
  setValue(value) {
    this.__detachAnimation(this._animation);
    if (
      Platform.OS === 'web' ||
      Platform.OS === 'windows' ||
      Platform.OS === 'macos'
    ) {
      this._updateValue(val(value));
    } else {
      if (ReanimatedModule.setValue && typeof value === 'number') {
        // FIXME Remove it after some time
        // For OTA-safety
        // FIXME handle setting value with a node
        ReanimatedModule.setValue(this.__nodeID, value);
      } else {
        evaluateOnce(set(this as any, value), this as any);
      }
    }
  }

  toString() {
    return `AnimatedValue, id: ${this.__nodeID}`;
  }

  interpolate(config) {
    return interpolate(this, config);
  }
}
