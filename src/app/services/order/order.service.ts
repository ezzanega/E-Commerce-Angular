import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Models/order.modem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-order`, orderData);
  }

  // getAllOrders(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/admin/orders`);
  // }

  getAllOrders(page: number, perPage: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<any>(`${this.apiUrl}/admin/orders`, { params });
  }

  getOrderCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/order-counts`);
  }
}
