import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  // Agregar headers comunes
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifique su conexión.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.error?.message || 'Error en la solicitud';
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor. Intente más tarde.';
      }

      // Mostrar mensaje de error al usuario
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });

      return throwError(() => error);
    })
  );
};
