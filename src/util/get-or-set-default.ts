/**
 * Get a property of an object, defining it if it doesn't yet exist.
 * @param target - The object to get a property from
 * @param key - The property to access
 * @param def - A factory for default values
 * @internal
 */
export function getOrSetDefault(target: any, key: string | symbol, def: () => any) {
  return target[key] ?? (target[key] = def());
}
