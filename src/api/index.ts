import { IFetchMethod, IErrorHandler, IDownloadMonitor, IRequestHook } from "@/contracts"

export abstract class BaseApi {
  protected method!: IFetchMethod
  protected headers: HeadersInit = {}
  protected fetchOptions: RequestInit = {}
  protected hooks?: IRequestHook
  protected errorHandler?: IErrorHandler
  protected monitor?: IDownloadMonitor
  protected baseUrl: string = ''

  public setMethod(method: IFetchMethod): this {
    this.method = method
    return this
  }

  public setHeaders(headers: HeadersInit): this {
    this.headers = headers
    return this
  }

  public setOptions(options: RequestInit): this {
    this.fetchOptions = options
    return this
  }

  public setHooks(hooks: IRequestHook): this {
    this.hooks = hooks
    return this
  }

  public setMonitor(monitor: IDownloadMonitor): this {
    this.monitor = monitor
    return this
  }

  public setErrorHandler(handler: IErrorHandler): this {
    this.errorHandler = handler
    return this
  }

  public setBaseUrl(url: string): this {
    this.baseUrl = url
    return this
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