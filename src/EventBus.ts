import { BaseContext } from "./ScopeContext";

const asyncTrigger = ("requestAnimationFrame" in window ? requestAnimationFrame : (fn: Function) => setTimeout(fn, 0));

export type EventBusSubscriber = (ev: FormEvent) => void;

export enum FormEventSignal {
  SubmitForm,
  FieldUpdate,
}

export type FormEvent = {
  signal: FormEventSignal;
  scope: BaseContext;
  field?: string;
};

export class EventBus {

  private _subscribers: EventBusSubscriber[] = [];

  /**
   * Trigger the bus using the given event context.
   */
  public trigger = (ev: FormEvent) => {
    let subs = this._subscribers.slice(0);
    const triggerNext = () => {
      let sub = subs.shift();
      if (sub) {
        sub(ev);
        asyncTrigger(triggerNext);
      }
    }

    triggerNext();
  }

  /**
   * Add a subscriber to the event bus, the returned function will automatically remove
   * the given subscriber.
   */
  public listen = (subscriber: EventBusSubscriber) => {
    if (this._subscribers.indexOf(subscriber) === -1) {
      this._subscribers.push(subscriber);
    }
    return () => {
      let i = this._subscribers.indexOf(subscriber);
      if (i !== -1) {
        this._subscribers.splice(i, 1);
      }
    };
  }

}