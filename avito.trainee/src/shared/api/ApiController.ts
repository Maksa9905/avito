import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

export class ApiController {
  private static readonly fallbackBaseUrl = 'http://localhost:8080'

  private static client: AxiosInstance | null = null

  static getBaseUrl(): string {
    return import.meta.env.VITE_API_URL ?? ApiController.fallbackBaseUrl
  }

  private static getClient(): AxiosInstance {
    if (ApiController.client) {
      return ApiController.client
    }

    const instance = axios.create({
      baseURL: ApiController.getBaseUrl(),
      headers: { 'Content-Type': 'application/json' },
    })

    instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (!isAxiosError(error)) {
          return Promise.reject(error)
        }
        const status = error.response?.status ?? 0
        const body = error.response?.data
        let message = error.message
        if (
          typeof body === 'object' &&
          body !== null &&
          'error' in body &&
          typeof (body as { error: unknown }).error === 'string'
        ) {
          message = (body as { error: string }).error
        }
        return Promise.reject(new ApiRequestError(status, message, body))
      },
    )

    ApiController.client = instance
    return instance
  }

  static async send<T>(config: AxiosRequestConfig): Promise<T> {
    const { data } = await ApiController.getClient().request<T>(config)
    return data
  }
}
