export class StorageError extends Error {
  constructor(
    message: string,
    public status = 503,
  ) {
    super(message);
  }
}
export type Receipt = { id: string; mode: "local" | "live" };
