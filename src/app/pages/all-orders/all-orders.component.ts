import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Models/order.modem';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderCounts: any = { all: 0, pending: 0, sent: 0, canceled: 0 };
  errorMessage: string = '';
  isLoading: boolean = false;

    // Pagination properties
    currentPage: number = 1;
    perPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;


  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderCounts();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders(this.currentPage, this.perPage).subscribe(
      (response) => {
        this.orders = response.data;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.perPage);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load orders';
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    );
  }

  loadOrderCounts(): void {
    this.orderService.getOrderCounts().subscribe(
      (counts) => {
        this.orderCounts = counts;
      },
      (error) => {
        console.error('Error loading order counts:', error);
      }
    );
  }


  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  getBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge bg-warning-light ';
      case 'approved':
        return 'badge bg-success-light ';
      case 'on hold':
        return 'badge bg-secondary';
      case 'canceled':
        return 'badge bg-danger-light';
      default:
        return 'badge bg-primary';
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}
