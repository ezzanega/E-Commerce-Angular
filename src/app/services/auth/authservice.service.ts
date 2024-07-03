import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthResponse } from 'src/app/Models/auth-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private authStatusListener = new BehaviorSubject<boolean>(this.isAuthenticated());


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


  googleSignUp(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, { token });
  }

  googleLogin(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/google`, { token });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update/${id}`, userData);
  }

}
