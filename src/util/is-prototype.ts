/**
 * Checks if a given object is a prototype of a class or an instance
 * @param obj
 */
export function isPrototype(obj: any) {
  return obj && obj.constructor && obj.constructor.prototype === obj;
}
