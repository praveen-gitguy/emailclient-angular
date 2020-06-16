import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


interface UsernameAvailableResponse { available: boolean; }
interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}
interface SignupResponse { username: string; }

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}
interface SigninCredentials {
  username: String;
  password: String;
}
interface SigninResponse {
  username: string
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  rootUrl = 'https://api.angular-email.com';
  signedin$ = new BehaviorSubject(null);
  username = '';

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string) {
    return this.http.post<UsernameAvailableResponse>
      (
        `${this.rootUrl}/auth/username`,
        {
          username
        }
      );
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<SignupResponse>(
      `${this.rootUrl}/auth/signup`, credentials).pipe(
        tap(({ username }) => {
          this.username = username;
          this.signedin$.next(true);

        })
      );
  }

  checkAuth() {
    return this.http.get<SignedinResponse>(`${this.rootUrl}/auth/signedin`).pipe(
      tap(({ authenticated }) => {
        this.signedin$.next(authenticated)
      })
    );
  }

  signout() {
    return this.http.post(`${this.rootUrl}/auth/signout`, {})
      .pipe(
        tap(() => {
          this.signedin$.next(false);
        })
      )
  }

  signIn(credentials: SigninCredentials) {
    return this.http.post<SigninResponse>(`${this.rootUrl}/auth/signin`, credentials)
      .pipe(
        tap(({ username }) => {
          this.username = username;
          this.signedin$.next(true);
        })
      )
  }


}
