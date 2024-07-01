import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private authStatusListener = new BehaviorSubject<boolean>(this.isAuthenticated());


  googleSignUp(auth0Token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google`, { token: auth0Token })
      .pipe(
        catchError(this.handleError)
      );
  }

  login(credentials:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  logout() {
    this.cookieService.delete('token');
    this.authStatusListener.next(false); // Notify about logout
  }


  saveToken(token: string, expiresIn: number) {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
    this.cookieService.set('token', token, { expires: expiryDate });
    this.authStatusListener.next(true);
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  getUserId(): any {
    const token = this.getToken();
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.sub;
    }
    return null;
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user?id=${id}`);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }


  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }


  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }


}
