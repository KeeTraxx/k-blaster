import { range } from "d3";
import type { IMidiChannel, Input, InputEvents } from "webmidi";

const allEvents:Array<string> = ["activesensing" , "channelaftertouch" , "channelmode" , "clock" , "continue" , "controlchange" , "keyaftertouch" , "midimessage" , "noteoff" , "noteon" , "pitchbend" , "programchange" , "reset" , "songposition" , "songselect" , "start" , "stop" , "sysex" , "timecode" , "tuningrequest" , "unknownsystemmessage"]

export class MidiReceiver implements Input {

  private listeners: Record<string, Set<(event: InputEvents) => void>>;

  constructor() {
    this.listeners = {};
  }

  addListener<T extends "activesensing" | "channelaftertouch" | "channelmode" | "clock" | "continue" | "controlchange" | "keyaftertouch" | "midimessage" | "noteoff" | "noteon" | "pitchbend" | "programchange" | "reset" | "songposition" | "songselect" | "start" | "stop" | "sysex" | "timecode" | "tuningrequest" | "unknownsystemmessage">(type: T, channel: number | number[] | "all" | undefined, listener: (event: InputEvents[T]) => void): Input {
    if (listener === undefined) {
      return this;
    }
    const channels = Array.isArray(channel) ? channel : channel === "all" ? range(1,16): [channel];
    channels.forEach(c => {
      this.listeners[type+c] = this.listeners[type+c] || new Set();
      // @ts-ignore
      this.listeners[type+c].add(listener);
    });
    return this;
  }
  on<T extends "activesensing" | "channelaftertouch" | "channelmode" | "clock" | "continue" | "controlchange" | "keyaftertouch" | "midimessage" | "noteoff" | "noteon" | "pitchbend" | "programchange" | "reset" | "songposition" | "songselect" | "start" | "stop" | "sysex" | "timecode" | "tuningrequest" | "unknownsystemmessage">(type: T, channel: number | number[] | "all" | undefined, listener: (event: InputEvents[T]) => void): Input {
    return this.addListener(type, channel, listener );
  }
  getCcNameByNumber(number: number): string | undefined {
    throw new Error("Method not implemented.");
  }
  getChannelModeByNumber(number: number): string | undefined {
    throw new Error("Method not implemented.");
  }
  
  hasListener<T extends "activesensing" | "channelaftertouch" | "channelmode" | "clock" | "continue" | "controlchange" | "keyaftertouch" | "midimessage" | "noteoff" | "noteon" | "pitchbend" | "programchange" | "reset" | "songposition" | "songselect" | "start" | "stop" | "sysex" | "timecode" | "tuningrequest" | "unknownsystemmessage">(type: T, channel: IMidiChannel, listener: (event: InputEvents[T]) => void): boolean {
    throw new Error("Method not implemented.");
  }

  

  removeListener<T extends "activesensing" | "channelaftertouch" | "channelmode" | "clock" | "continue" | "controlchange" | "keyaftertouch" | "midimessage" | "noteoff" | "noteon" | "pitchbend" | "programchange" | "reset" | "songposition" | "songselect" | "start" | "stop" | "sysex" | "timecode" | "tuningrequest" | "unknownsystemmessage">(type?: T, channel?: IMidiChannel, listener?: (event: InputEvents[T]) => void): Input {
    if (listener === undefined) {
      return this;
    }
    const channels = Array.isArray(channel) ? channel : channel === "all" ? range(1,16): [channel];
    const types:Array<string> = type ? [type] : (allEvents);
    channels
    .flatMap(c => types.map(t => t+c))
    .forEach(tc => {
      // @ts-ignore
      this.listeners[tc] && this.listeners[tc].delete(listener)}
    );
    return this;
  }
  connection: "pending" | "open" | "closed" = "open";
  id: string = "k-blaster internal id";
  manufacturer: string = "k-blaster";
  name: string = "k-blaster name";
  state: "connected" | "disconnected" = "connected";
  type: "input" = "input";

  
  
}