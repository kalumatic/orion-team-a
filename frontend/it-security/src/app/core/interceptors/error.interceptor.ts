import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0)        message = 'Cannot reach the server';
      else if (error.status === 400) message = error.error?.message || 'Invalid request';
      else if (error.status === 403) message = 'Access denied';
      else if (error.status === 404) message = 'Resource not found';
      else if (error.status === 409) message = error.error?.message || 'Conflict error';
      else if (error.status === 500) message = 'Server error, try again later';

      toastr.error(message, 'Error');

      return throwError(() => ({ status: error.status, message }));
    })
  );
};