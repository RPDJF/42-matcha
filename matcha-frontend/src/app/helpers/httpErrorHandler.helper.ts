import { HttpErrorResponse } from '@angular/common/http';

export class HttpErrorHandler {
  static retrieveErrorDetails(httpError: HttpErrorResponse) {
    return this.retriveErrorResponse(httpError)?.details;
  }

  static retrieveErrorCode(httpError: HttpErrorResponse) {
    return this.retriveErrorResponse(httpError)?.code;
  }

  static retriveErrorResponse(
    httpError: HttpErrorResponse,
  ): Partial<{ code: string; details: string }> {
    return httpError.error?.error;
  }
}
