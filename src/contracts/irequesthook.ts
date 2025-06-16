export interface IRequestHook {
  beforeRequest?(): Promise<void> | void
  afterRequest?(response: Response): Promise<void> | void
}
