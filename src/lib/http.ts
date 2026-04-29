export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function httpJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) throw new ApiError('API base URL is not configured.', 500)

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new ApiError(
      `Request failed with ${response.status}`,
      response.status,
      await response.text(),
    )
  }

  return response.json() as Promise<T>
}
