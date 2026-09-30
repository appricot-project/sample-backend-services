export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ProblemDetails {
  title?: string;
  detail?: string;
}

const UNAVAILABLE_MESSAGE = 'Server is unavailable. Check that the API is running.';

// The proxy in front of the API (nginx / Vite dev server) answers with these when the API is down.
const PROXY_ERROR_STATUSES = [502, 503, 504];

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(UNAVAILABLE_MESSAGE, 0);
  }

  if (PROXY_ERROR_STATUSES.includes(response.status)) {
    throw new ApiError(UNAVAILABLE_MESSAGE, response.status);
  }

  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as ProblemDetails | null;
    throw new ApiError(
      problem?.detail ?? problem?.title ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
