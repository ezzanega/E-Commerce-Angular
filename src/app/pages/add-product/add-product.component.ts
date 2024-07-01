import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  product: any = {
    nom: '',
    prix: '',
    old_price: '',
    sku: '',
    categorie_id: '',
    tag_id: '',
    color: '',
    image_initiale: null,
    description: '',
    images: []
  };

  tags: any[] = [];
  categories: any[] = [];

  errorMessage:any = ''

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getTags().subscribe(
      (data) => this.tags = data,
      (error) => console.error('Error fetching tags', error)
    );

    this.productService.getCategories().subscribe(
      (data) => this.categories = data,
      (error) => console.error('Error fetching categories', error)
    );
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const formData = new FormData();
    for (const key in this.product) {
      if (this.product[key]) {
        if (key === 'image_initiale' || key === 'images') {
          for (let i = 0; i < this.product[key].length; i++) {
            formData.append(key, this.product[key][i]);
          }
        } else {
          formData.append(key, this.product[key]);
        }
      }
    }

    this.productService.addProduct(formData).subscribe(
      (response) => {
        console.log('Product created successfully', response);
      //  this.router.navigate(['/all-products']); // Navigate to products list page
      },
      (error) => {
        this.errorMessage = error.error.message
        console.error('Error creating product', error);
      }
    );
  }

  onFileChange(event :any, fieldName: string): void {
    if (event.target.files.length > 0) {
      this.product[fieldName] = event.target.files;
    }
  }
}
