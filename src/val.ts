import type { Adaptable, Value } from "./types";
import AnimatedNode from "./core/AnimatedNode";

export function val(v?: Adaptable<Value>) {
  return v && (v as AnimatedNode).__getValue ? (v as AnimatedNode).__getValue() : v || 0;
}
