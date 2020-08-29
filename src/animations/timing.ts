import {
  cond,
  sub,
  divide,
  multiply,
  add,
  block,
  set,
  greaterOrEq,
  proc,
} from '../base';
import {
  TimingState,
  TimingConfig,
  AnimatedClock,
  AnimatedValue,
} from '../types';

const internalTiming = proc(function(
  clock: AnimatedClock,
  time: AnimatedValue<number>,
  frameTime: AnimatedValue<number>,
  position: AnimatedValue<number>,
  finished: AnimatedValue<number>,
  toValue: AnimatedValue<number>,
  duration: AnimatedValue<number>,
  nextProgress: AnimatedValue<number>,
  progress: AnimatedValue<number>,
  newFrameTime: AnimatedValue<number>
) {
  const state = {
    time,
    finished,
    frameTime,
    position,
  };

  const config = {
    duration,
    toValue,
  };

  const distanceLeft = sub(config.toValue, state.position);
  const fullDistance = divide(distanceLeft, sub(1, progress));
  const startPosition = sub(config.toValue, fullDistance);
  const nextPosition = add(startPosition, multiply(fullDistance, nextProgress));

  return block([
    cond(
      greaterOrEq(newFrameTime, config.duration),
      [set(state.position, config.toValue), set(state.finished, 1)],
      set(state.position, nextPosition)
    ),
    set(state.frameTime, newFrameTime),
    set(state.time, clock),
  ]);
});

export default function(
  clock: AnimatedClock,
  state: TimingState,
  config: TimingConfig
) {
  if (config.duration === 0) {
    // when duration is zero we end the timing immediately
    return block([set(state.position, config.toValue), set(state.finished, 1)]);
  }
  const lastTime = cond(state.time, state.time, clock);
  const newFrameTime = add(state.frameTime, sub(clock, lastTime));
  const nextProgress = config.easing(divide(newFrameTime, config.duration));
  const progress = config.easing(divide(state.frameTime, config.duration));
  return internalTiming(
    clock,
    state.time,
    state.frameTime,
    state.position,
    state.finished,
    config.toValue,
    config.duration,
    nextProgress,
    progress,
    newFrameTime
  );
}
