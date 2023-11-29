import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, GlobalMessageConfig, GlobalMessageService, GlobalMessageType, HttpErrorHandler, HttpResponseStatus, OccEndpointsService, Priority } from '@spartacus/core';
@Injectable({
  providedIn: 'root'
})
export class CustomGlobalMessageService extends HttpErrorHandler {
  responseStatus = HttpResponseStatus.FORBIDDEN;

  handleError(request: HttpRequest<any>) {
    if (
      request.url.endsWith(
        this.occEndpoints.buildUrl('user', {
          urlParams: { userId: 'current' },
        })
      )
    ) {
      this.authService.logout();
    }
    this.globalMessageService.add(
      'Please login again. If you continue to experience access issues, then please contact your customer services representative.',
      GlobalMessageType.MSG_TYPE_ERROR
    );
  }

  getPriority(): Priority {
    return Priority.LOW;
  }

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected authService: AuthService,
    protected occEndpoints: OccEndpointsService
  ) {
    super(globalMessageService);
  }
}
