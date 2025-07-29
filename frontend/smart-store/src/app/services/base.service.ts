import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService {

    protected handleError = (error: HttpErrorResponse): Observable<never> => {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            // Server-side error
            switch (error.status) {
                case 0:
                    errorMessage = 'Cannot connect to the server';
                    break;
                case 404:
                    errorMessage = 'Resource not found';
                    break;
                case 500:
                    errorMessage = 'Internal server error';
                    break;
                default:
                    errorMessage = `Server Error: ${error.status} - ${error.message}`;
            }
        }
        
        console.error('Service Error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }

    protected logError(serviceName: string, operation: string, error: any): void {
        console.error(`${serviceName} - ${operation} failed:`, error);
    }
}
