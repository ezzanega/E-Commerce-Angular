import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from 'src/app/Models/product.model';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }


  getTags(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags`).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }


  getProducts(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products?page=${page}`).pipe(
      map(response => response), // No need to flatten the array since pagination is handled differently
      catchError(this.handleError)
    );
  }


  addProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-product`, productData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products-details/${productId}`).pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
