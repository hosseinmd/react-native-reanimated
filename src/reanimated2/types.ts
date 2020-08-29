import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  TransformsStyle,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';

export interface WithSpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restSpeedThreshold?: number;
  restDisplacementThreshold?: number;
  velocity?: number;
}

export interface WithTimingConfig {
  duration?: number;
  easing?: EasingFunction;
}

export interface WithDecayConfig {
  deceleration?: number;
  velocity?: number;
  clamp?: [number, number];
}

export type EasingFunction = (value: number) => number;

export type AnimatedStyle = StyleProp<
  AnimateStyle<ViewStyle | ImageStyle | TextStyle>
>;

export class AnimatedNode<T> {
  constructor(
    nodeConfig: object,
    inputNodes?: ReadonlyArray<AnimatedNode<any>>
  ) {}
  isNativelyInitialized: () => boolean;
  /**
   * ' __value' is not available at runtime on AnimatedNode<T>. It is
   * necessary to have some discriminating property on a type to know that
   * an AnimatedNode<number> and AnimatedNode<string> are not compatible types.
   */
  ' __value': T;
}

export type Adaptable<T> =
  | T
  | AnimatedNode<T>
  | ReadonlyArray<T | AnimatedNode<T> | ReadonlyArray<T | AnimatedNode<T>>>;

export type Context = Record<string, unknown>;

export type RawSharedValue = number | string | boolean | object;

export type SharedValueType = RawSharedValue | RawSharedValue[];

export type SharedValue<T extends SharedValueType> = {
  value: T;
};

export type ScrollHandler<TContext extends Context> = (
  event: NativeScrollEvent,
  context: TContext
) => void;

export interface ScrollHandlers<TContext extends Context> {
  onScroll?: ScrollHandler<TContext>;
  onBeginDrag?: ScrollHandler<TContext>;
  onEndDrag?: ScrollHandler<TContext>;
  onMomentumBegin?: ScrollHandler<TContext>;
  onMomentumEnd?: ScrollHandler<TContext>;
}

export type OnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

export type TransformStyleTypes = TransformsStyle['transform'] extends (
  | readonly (infer T)[]
  | undefined)
  ? T
  : never;
export type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P] extends string ? number | string : T[P]>;
};
export type AnimatedTransform = (AdaptTransforms<TransformStyleTypes>)[];

export type AnimateStyle<S extends object> = {
  [K in keyof S]: K extends 'transform'
    ? AnimatedTransform
    : (S[K] extends ReadonlyArray<any>
        ? ReadonlyArray<AnimateStyle<S[K][0]>>
        : S[K] extends object
        ? AnimateStyle<S[K]>
        :
            | S[K]
            | AnimatedNode<
                // allow `number` where `string` normally is to support colors
                S[K] extends (string | undefined) ? S[K] | number : S[K]
              >);
};
