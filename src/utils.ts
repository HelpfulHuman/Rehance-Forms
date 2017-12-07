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
  return ( !!val && typeof val.then === "function" );
}

/**
 * Capitalize the first letter of the given string and return it.
 */
export function capitalize(str: string): string {
  return (str.charAt(0).toUpperCase() + str.slice(1));
}