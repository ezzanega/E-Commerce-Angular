import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/Models/product.model';
import { ProductService } from 'src/app/services/products/product.service';
import Swiper, { Navigation, Pagination } from 'swiper';


Swiper.use([Navigation, Pagination]);
@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {
  product: Product = {} as Product;
  selectedImage: string;
  images: string[] = [];
  errorMessage: string = '';
  swiper: Swiper | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.selectedImage = ''; // Initialize selectedImage
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const productId = +id;
      this.getProductDetails(productId);
    } else {
      this.errorMessage = 'Product ID is null';
    }
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.swiper-container', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  getProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.product = data;
        this.selectedImage = this.product.image_initiale; // Set the initial image as the selected image
        this.prepareImages(); // Prepare the images array
        if (this.swiper) {
          this.swiper.update();
        }
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error fetching product details', error);
      }
    );
  }

  prepareImages(): void {
    if (this.product) {
      this.images = [this.product.image_initiale, ...this.product.images.map(img => img.image)];
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

}
