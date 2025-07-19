export interface IErrorHandler {
  handleError(error: Error): Promise<void> | void;
  handleHttpError(response: Response): Promise<void> | void;
}