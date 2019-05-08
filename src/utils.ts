/**
 * Returns true if the given value is a function.
 */
export function isFunc(val: any): boolean {
  return (typeof val === "function");
}

/**
 * Returns true if the given value is a function.
 */
export function isPromise(val: any): boolean {
  return (!!val && typeof val.then === "function");
}

/**
 * Capitalize the first letter of the given string and return it.
 */
export function capitalize(str: string): string {
  return (str.charAt(0).toUpperCase() + str.slice(1));
}

/**
 * Generate and return a random value between the 2 numbers.
 */
export function randomRange(min: number, max: number): number {
  return min + Math.round(Math.random() * (max - min));
}

/**
 * Wraps the given handler function with a memoization/cache layer that enables a function
 * to only be bound once for the given key.
 */
export function memoize<T extends (...args: any[]) => any>(func: T) {
  let cache: { [key: string]: () => void } = {};

  return function (key: string, ...args: Parameters<T>) {
    if (!cache[key]) {
      cache[key] = () => func(...args);
    }

    return cache[key];
  };
}

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

export function equal(a: unknown, b: unknown): boolean {
  if (a === b) { return true; }

  if (a && b && typeof a == "object" && typeof b == "object") {
    let arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = (a as unknown[]).length;
      if (length != (b as unknown[]).length) { return false; }
      for (i = length; i-- !== 0;) {
        if (!equal((a as unknown[])[i], (b as unknown[])[i])) { return false; }
      }
      return true;
    }

    if (arrA != arrB) { return false; }

    let dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) { return false; }
    if (dateA && dateB) { return (a as Date).getTime() == (b as Date).getTime(); }

    let regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) { return false; }
    if (regexpA && regexpB) { return a.toString() == b.toString(); }

    let keys = keyList(a as object);
    length = keys.length;

    if (length !== keyList(b as object).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) { return false; }
    }

    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!equal((a as object)[key], (b as object)[key])) { return false; }
    }

    return true;
  }

  return a !== a && b !== b;
}
