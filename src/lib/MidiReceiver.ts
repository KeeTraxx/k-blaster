import Events from 'events';

interface MidiReceiverEvents {
  midimessage: WebMidi.MIDIMessageEvent
}

export default class MidiReceiver implements Emitter<MidiReceiverEvents> {
  addEventListener<K extends 'midimessage'>(eventName: K, fn: EventReceiver<MidiReceiverEvents[K]>): void {
    this.emitter.on(eventName, fn);
  }

  removeEventListener<K extends 'midimessage'>(eventName: K, fn: EventReceiver<MidiReceiverEvents[K]>): void {
    this.emitter.off(eventName, fn);
  }

  private emitter = new Events.EventEmitter();

  on<K extends 'midimessage'>(eventName: K, fn: EventReceiver<MidiReceiverEvents[K]>): void {
    this.emitter.on(eventName, fn);
  }

  off<K extends 'midimessage'>(eventName: K, fn: EventReceiver<MidiReceiverEvents[K]>): void {
    this.emitter.off(eventName, fn);
  }

  emit<K extends 'midimessage'>(eventName: K, params: MidiReceiverEvents[K]): void {
    this.emitter.emit(eventName, params);
  }
}

type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
  addEventListener<K extends EventKey<T>>
  (eventName: K, fn: EventReceiver<T[K]>): void;

  removeEventListener<K extends EventKey<T>>
  (eventName: K, fn: EventReceiver<T[K]>): void;

  on<K extends EventKey<T>>
  (eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>
  (eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>
  (eventName: K, params: T[K]): void;
}
