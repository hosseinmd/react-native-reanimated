import { Adaptable, Value } from './types';

export default {
  async disconnectNodeFromView(nodeID: number, viewTag: number) {
    // noop
  },
  async attachEvent(viewTag: number, eventName: string, nodeID: any) {
    // noop
  },
  async detachEvent(viewTag: number, eventName: string, nodeID: any) {
    // noop
  },
  async createNode(nodeID: any, config: any) {
    // noop
  },
  async dropNode(nodeID: any) {
    // noop
  },
  async configureProps(keys1: any[], keys2: any) {
    // noop
  },
  async disconnectNodes(nodeID: number, nodeID2: number) {
    // noop
  },
  async animateNextTransition(
    viewTag: number,
    config: {
      transitions: any[];
    }
  ) {
    console.warn(
      'Reanimated: animateNextTransition is unimplemented on current platform'
    );
  },
  async getValue(nodeID: number, callback: (val: any) => void) {
    // noop
  },
  async connectNodes(nodeID: number, nodeID2: number) {
    // noop
  },
  async connectNodeToView(nodeID: number, viewTag: number) {
    // noop
  },
  async setValue(nodeID: number, value: Adaptable<Value>) {
    // noop
  },
};
