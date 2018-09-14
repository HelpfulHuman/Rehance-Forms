import { EventEmitter } from "events";
import { BaseContext } from "./ScopeContext";
import { randomRange } from "./utils";

const events = new EventEmitter();
events.setMaxListeners(Infinity);

export type EventBusSubscriber = (ev: FormEvent) => void;

export enum FormEventSignal {
  SubmitForm,
  ScopeUpdate,
  FieldCreated,
  FieldUpdate,
  FieldDestroyed,
}

export type FormEvent = {
  signal: FormEventSignal;
  scope: BaseContext;
  field?: string;
};

export class EventBus {

  private _id: string = `eventbus_${randomRange(100000000, 999999999)}`;

  /**
   * Trigger the bus using the given event context.
   */
  public trigger = (ev: FormEvent) => {
    events.emit(this._id, ev);
  }

  /**
   * Add a subscriber to the event bus, the returned function will automatically remove
   * the given subscriber.
   */
  public listen = (subscriber: EventBusSubscriber) => {
    events.addListener(this._id, subscriber);
    return () => {
      events.removeListener(this._id, subscriber);
    };
  }

}