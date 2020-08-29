import React, { Component, FC, ReactNode } from 'react';
import { View, findNodeHandle, ViewProps } from 'react-native';
import ReanimatedModule from './ReanimatedModule';

export interface TransitionProps {
  delayMs?: number;
  durationMs?: number;
  interpolation?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  propagation?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TransitionInOutProps extends TransitionProps {
  type?:
    | 'fade'
    | 'scale'
    | 'slide-top'
    | 'slide-bottom'
    | 'slide-right'
    | 'slide-left';
}

const TransitioningContext = React.createContext<any>(undefined);

function configFromProps(type: string, props: TransitionInOutProps) {
  const config = { type } as TransitionInOutProps & { animation?: string };
  if ('durationMs' in props) {
    config.durationMs = props.durationMs;
  }
  if ('interpolation' in props) {
    config.interpolation = props.interpolation;
  }
  if ('type' in props) {
    config.animation = props.type;
  }
  if ('delayMs' in props) {
    config.delayMs = props.delayMs;
  }
  if ('propagation' in props) {
    config.propagation = props.propagation;
  }
  return config;
}

class In extends React.Component<any> {
  componentDidMount() {
    this.props.context.push(configFromProps('in', this.props as any));
  }

  render() {
    return this.props.children || null;
  }
}

class Change extends React.Component<any> {
  componentDidMount() {
    this.props.context.push(configFromProps('change', this.props as any));
  }

  render() {
    return this.props.children || null;
  }
}

class Out extends React.Component<any> {
  componentDidMount() {
    this.props.context.push(configFromProps('out', this.props as any));
  }

  render() {
    return this.props.children || null;
  }
}

class Together extends React.Component<any> {
  transitions = [];
  componentDidMount() {
    const config = configFromProps('group', this.props as any) as any;
    config.transitions = this.transitions;
    this.props.context.push(config);
  }

  render() {
    return (
      <TransitioningContext.Provider value={this.transitions}>
        {this.props.children}
      </TransitioningContext.Provider>
    );
  }
}

class Sequence extends React.Component<any> {
  transitions = [];
  componentDidMount() {
    const config = configFromProps('group', this.props as any) as any;
    config.sequence = true;
    config.transitions = this.transitions;
    (this.props as any).context.push(config);
  }

  render() {
    return (
      <TransitioningContext.Provider value={this.transitions}>
        {this.props.children}
      </TransitioningContext.Provider>
    );
  }
}

interface TransitioningViewProps extends ViewProps {
  transition: ReactNode;
}

function createTransitioningComponent<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & TransitioningViewProps> {
  class Wrapped extends React.Component<P & TransitioningViewProps> {
    propTypes = Component.propTypes;
    transitions = [];
    viewRef = React.createRef<any>();

    componentDidMount() {
      if ((this.props as any).animateMount) {
        this.animateNextTransition();
      }
    }

    setNativeProps(props) {
      this.viewRef.current.setNativeProps(props);
    }

    animateNextTransition() {
      const viewTag = findNodeHandle(this.viewRef.current);
      ReanimatedModule.animateNextTransition(viewTag, {
        transitions: this.transitions,
      });
    }

    render() {
      const { transition, ...rest } = this.props as any;
      return (
        <React.Fragment>
          <TransitioningContext.Provider value={this.transitions}>
            {transition}
          </TransitioningContext.Provider>
          <Component {...rest} ref={this.viewRef} collapsable={false} />
        </React.Fragment>
      );
    }
  }

  return Wrapped;
}

/**
 * The below wrapper is used to support legacy context API with Context.Consumer
 * render prop. We need it as we want to access `context` from within
 * `componentDidMount` callback. If we decided to drop support for older
 * react native we could rewrite it using hooks or `static contextType` API.
 */
function wrapTransitioningContext(Comp: any) {
  return (props: TransitionProps) => {
    return (
      <TransitioningContext.Consumer>
        {(context) => <Comp context={context} {...props} />}
      </TransitioningContext.Consumer>
    );
  };
}

const Transitioning = {
  View: createTransitioningComponent<ViewProps>(View),
};

const Transition = {
  Sequence: wrapTransitioningContext(Sequence),
  Together: wrapTransitioningContext(Together),
  In: wrapTransitioningContext(In),
  Out: wrapTransitioningContext(Out),
  Change: wrapTransitioningContext(Change),
};

export { Transitioning, Transition, createTransitioningComponent };
