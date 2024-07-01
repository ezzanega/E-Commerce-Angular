import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/Models/product.model';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private productService: ProductService,private modalService: NgbModal) { }

  products: Product[] = [];
  errorMessage: string ='';
  currentPage: number = 1;
  totalPages: any ;
  totalProducts: any;
  itemsPerPage: number = 10;

  SuccessMessage : string = '';

  productIdToDelete: any;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>; // ViewChild to get the modal template





  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts(page).subscribe(
      (data) => {
        this.products = data.data;
        this.totalPages = data.last_page;
        this.currentPage = data.current_page;
        this.totalProducts = data.total;
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error fetching products', error);
      }
    );
  }

  getShowingRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalProducts);
    return `Showing ${start}–${end} of ${this.totalProducts} results`;
  }

  openDeleteModal(productId: number): void {
    this.productIdToDelete = productId;
    this.modalService.open(this.deleteModal).result.then((result) => {
      if (result === 'Ok click') {
        this.deleteProduct();
      }
    }, (reason) => {
      // Handle dismiss
    });
  }

  confirmDelete(): void {
    this.deleteProduct();
  }

  deleteProduct(): void {
    this.productService.deleteProduct(this.productIdToDelete).subscribe(
      () => {
        this.products = this.products.filter(product => product.id !== this.productIdToDelete);
        console.log('Product deleted successfully');
        this.SuccessMessage = 'Product deleted successfully';
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error deleting product', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
  }

}
