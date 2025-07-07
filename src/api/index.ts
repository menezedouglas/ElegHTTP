import { IFetchMethod, IErrorHandler, IDownloadMonitor, IRequestHook } from "../contracts"

export abstract class BaseApi {
  public headers: HeadersInit = {}
  public fetchOptions: RequestInit = {}
  public baseUrl: string = ''
  protected method!: IFetchMethod
  protected hooks?: IRequestHook | undefined
  protected errorHandler?: IErrorHandler |undefined
  protected monitor?: IDownloadMonitor | undefined

  constructor(params: {
    method: IFetchMethod,
    hooks?: IRequestHook | undefined,
    monitor?: IDownloadMonitor | undefined,
    errorHandler?: IErrorHandler | undefined
  }) {
    this.method = params.method
    this.hooks = params.hooks
    this.monitor = params.monitor
    this.errorHandler = params.errorHandler
  }

  protected async fetchWithProgress(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(url, options)

    if (!response.body || !this.monitor) return response

    const reader = response.body.getReader()
    const contentLength = +response.headers.get('Content-Length')!
    let received = 0

    const stream = new ReadableStream({
      start: async (controller) => {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          received += value?.length || 0
          this.monitor?.onDownloadProgress?.(received, contentLength)
          controller.enqueue(value)
        }
        controller.close()
      },
    })

    return new Response(stream, response)
  }

  protected buildUrl(path: string): string {
    if (!this.baseUrl) return path
    return this.baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
  }

  public async download(path: string, options: RequestInit = {}): Promise<Blob> {
    const url = this.buildUrl(path)
    const response = await this.fetchWithProgress(url, { ...options, headers: { ...this.headers, ...(options.headers || {}) } })
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`)
    return await response.blob()
  }

  public async execute(): Promise<any> {
    if (!this.method) throw new Error('Método HTTP não definido.')

    const url = this.baseUrl ? this.buildUrl(this.method.getUri()) : this.method.getUri()
    const method = this.method.getMethod()
    const data = this.method.getData()

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
      ...this.fetchOptions,
    }

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.body = JSON.stringify(data)
    }

    try {
      await this.hooks?.beforeRequest?.()

      const response = await this.fetchWithProgress(url, options)

      await this.hooks?.afterRequest?.(response)

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`)

      return response.json()
    } catch (error) {
      this.errorHandler?.handleError?.(error)
      throw error
    }
  }
}