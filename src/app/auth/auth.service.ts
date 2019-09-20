import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError} from 'rxjs';

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOdDE4McTpZvZG6ZvEmM16B_m-6JuIKn0',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(catchError(this.handleError));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBOdDE4McTpZvZG6ZvEmM16B_m-6JuIKn0',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(catchError(this.handleError));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
    
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;

            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
        }
        return throwError(errorMessage);
    }
}