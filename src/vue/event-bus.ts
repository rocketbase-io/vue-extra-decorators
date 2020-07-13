import { Options, Vue } from "vue-class-component";
import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createListenerDecorator } from "src/vue/handler";

@Options({})
export class EventBus extends Vue {
  On(...events: string[]) {
    return createListenerDecorator(events, () => this);
  }
  on(this: Vue, events: string[] | string, handler: AnyFunction) {
    this.$on(events, handler);
    return this;
  }
  off(this: Vue, events: string[] | string, handler: AnyFunction) {
    this.$off(events, handler);
    return this;
  }
  once(this: Vue, events: string[] | string, handler: AnyFunction) {
    this.$once(events, handler);
    return this;
  }
  emit(this: Vue, event: string, ...args: any[]) {
    this.$emit(event, ...args);
    return this;
  }
}

const busses: Record<string, EventBus> = {};

export interface BusFactory {
  (instance?: string): EventBus;
  On(...events: string[]): TypedPropertyDecorator<AnyFunction>;
  on(events: string[] | string, handler: AnyFunction): EventBus;
  once(events: string[] | string, handler: AnyFunction): EventBus;
  off(events: string[] | string, handler: AnyFunction): EventBus;
  emit(event: string, ...args: any[]): EventBus;
}

export const Bus: BusFactory = ((instance = "") =>
  busses[instance] ?? (busses[instance] = new EventBus())) as BusFactory;

(() => {
  const defaultBus: EventBus = Bus();
  const { On, on, off, once, emit } = defaultBus;
  Bus.On = On.bind(defaultBus);
  Bus.on = on.bind(defaultBus) as any;
  Bus.off = off.bind(defaultBus) as any;
  Bus.once = once.bind(defaultBus) as any;
  Bus.emit = emit.bind(defaultBus) as any;
})();
