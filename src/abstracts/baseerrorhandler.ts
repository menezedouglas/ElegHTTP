import { IErrorHandler } from "../contracts";

export abstract class BaseErrorHandler implements IErrorHandler {
  abstract handleError(error: any): void
  abstract handleHttpError(response: Response): void
}