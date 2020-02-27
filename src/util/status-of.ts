export function statusOf(obj: any): number | undefined {
  if (typeof obj === "number") return obj;
  if (!obj || typeof obj !== "object") return;
  if ("response" in obj && typeof obj.response === "object") return statusOf(obj.response);
  if ("status" in obj && typeof obj.status === "number") return obj.status;
}
