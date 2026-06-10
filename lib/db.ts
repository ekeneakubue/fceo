const CONNECTION_ERROR_CODES = new Set(["P1001", "P1002", "P1017"]);

export function isDatabaseConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string };
  if (err?.code && CONNECTION_ERROR_CODES.has(err.code)) return true;
  return /can't reach database server|connection terminated|connection timed out/i.test(
    err?.message || ""
  );
}

export async function withDatabaseRetry<T>(
  operation: () => Promise<T>,
  attempts = 3,
  delayMs = 2000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isDatabaseConnectionError(error) || attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw lastError;
}
