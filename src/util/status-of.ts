export function statusOf(obj: any): number | undefined {
  if (!obj) return;
  if (typeof obj === "number") return obj;
  if (typeof obj !== "object") return;
  if ("response" in obj && typeof obj.response === "object") return statusOf(obj.response);
  if ("status" in obj && typeof obj.status === "number") return obj.status;
}
