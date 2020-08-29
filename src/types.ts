import { Component } from 'react';
import {
  ViewProps,
  TextProps,
  ImageProps,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TransformsStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View as ReactNativeView,
  Text as ReactNativeText,
  Image as ReactNativeImage,
  ScrollView as ReactNativeScrollView,
} from 'react-native';
import { Extrapolate } from './derived';

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

export class AnimatedClock extends AnimatedNode<number> {
  //@ts-ignore
  constructor() {}
}

export type Value = string | number | boolean;

interface InterpolationConfig {
  inputRange: ReadonlyArray<Adaptable<number>>;
  outputRange: ReadonlyArray<Adaptable<number>>;
  extrapolate?: Extrapolate;
  extrapolateLeft?: Extrapolate;
  extrapolateRight?: Extrapolate;
}

export class AnimatedValue<T extends Value> extends AnimatedNode<T> {
  constructor(value?: T) {
    //@ts-ignore
    super();
  }

  setValue: (value: Adaptable<T>) => void;

  interpolate: (config: InterpolationConfig) => AnimatedNode<number>;
}

export type EasingNodeFunction = (
  value: Adaptable<number>
) => AnimatedNode<number>;

export interface AnimationState {
  finished: AnimatedValue<number>;
  position: AnimatedValue<number>;
  prevPosition?: AnimatedValue<number>;
  time: AnimatedValue<number>;
}

export interface PhysicsAnimationState extends AnimationState {
  velocity: AnimatedValue<number>;
}

export interface TimingState extends AnimationState {
  frameTime: AnimatedValue<number>;
}
export interface TimingConfig {
  toValue: Adaptable<number>;
  duration: Adaptable<number>;
  easing: EasingNodeFunction;
}

export type SpringState = PhysicsAnimationState;
export interface SpringConfig {
  damping: Adaptable<number>;
  mass: Adaptable<number>;
  stiffness: Adaptable<number>;
  overshootClamping: Adaptable<number> | boolean;
  restSpeedThreshold: Adaptable<number>;
  restDisplacementThreshold: Adaptable<number>;
  toValue: Adaptable<number>;
}

export type DecayState = PhysicsAnimationState;
export interface DecayConfig {
  deceleration: Adaptable<number>;
}

export type AnimateProps<
  S extends object,
  P extends {
    style?: StyleProp<S>;
  }
> = {
  [K in keyof P]: K extends 'style'
    ? StyleProp<AnimateStyle<S>>
    : P[K] | AnimatedNode<(P[K]) extends string ? string : string>;
};

// components
export class AnimatedView extends Component<
  AnimateProps<ViewStyle, ViewProps>
> {
  getNode: () => ReactNativeView;
}
export class AnimatedText extends Component<
  AnimateProps<TextStyle, TextProps>
> {
  getNode: () => ReactNativeText;
}
export class AnimatedImage extends Component<
  AnimateProps<ImageStyle, ImageProps>
> {
  getNode: () => ReactNativeImage;
}
export class AnimatedScrollView extends Component<
  AnimateProps<ViewStyle, ScrollViewProps>
> {
  getNode: () => ReactNativeScrollView;
}

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
