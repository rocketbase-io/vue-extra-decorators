export function isThenable(it: any): it is PromiseLike<any> {
  return typeof it === "object" && "then" in it && typeof it.then === "function";
}

export function isPromiseLike(it: any): it is Promise<any> {
  return (
    typeof it === "object" &&
    "then" in it &&
    typeof it.then === "function" &&
    "catch" in it &&
    typeof it.catch === "function"
  );
}
