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
  View as ReactNativeView,
  Text as ReactNativeText,
  Image as ReactNativeImage,
  ScrollView as ReactNativeScrollView,
} from 'react-native';
import AnimatedNode from './core/AnimatedNode';
import { Extrapolate } from './derived';

export type EasingNodeFunction = (
  value: Adaptable<number>
) => AnimatedNode<number>;

export type Value = string | number | boolean;

interface InterpolationConfig {
  inputRange: ReadonlyArray<Adaptable<number>>;
  outputRange: ReadonlyArray<Adaptable<number>>;
  extrapolate?: Extrapolate;
  extrapolateLeft?: Extrapolate;
  extrapolateRight?: Extrapolate;
}

class AnimatedValue<T extends Value> extends AnimatedNode<T> {
  setValue: (value: Adaptable<T>) => void;

  interpolate: (config: InterpolationConfig) => AnimatedNode<number>;
}

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

export type TransformStyleTypes = TransformsStyle['transform'] extends (
  | readonly (infer T)[]
  | undefined)
  ? T
  : never;

export type Adaptable<T extends Value = Value> =
  | T
  | AnimatedNode<T>
  | ReadonlyArray<T | AnimatedNode<T> | ReadonlyArray<T | AnimatedNode<T>>>;

export type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P] extends string ? (string | number) : Value>;
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
                Value
              >);
};

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
