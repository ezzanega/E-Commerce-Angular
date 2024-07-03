import { Image } from './../../Models/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/products/product.service';


interface Product {
  nom: string;
  prix: number | null;
  old_price: number | null;
  sku: string;
  categorie_id: number | null;
  tags: number[];
  color: string;
  image_initiale: File | null;
  description: string;
  images: File[];
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {

  product: Product = {
    nom: '',
    prix: null,
    old_price: null,
    sku: '',
    categorie_id: null,
    tags: [],
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



  onFileChange(event: any, field: string): void {
    const files = event.target.files;
    if (field === 'image_initiale') {
      this.product.image_initiale = files[0];
    } else if (field === 'images') {
      this.product.images = Array.from(files);
    }
  }



  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const formData = new FormData();

    (Object.keys(this.product) as Array<keyof Product>).forEach((key) => {
      if (this.product[key]) {
        if (key === 'images') {
          this.product.images.forEach((image: File) => {
            formData.append('images[]', image);
          });
        } else if (key === 'tags') {
          this.product.tags.forEach((tag: number) => {
            formData.append('tags[]', tag.toString());
          });
        } else if (key === 'image_initiale') {
          formData.append('image_initiale', this.product[key] as File);
        } else {
          formData.append(key, this.product[key] as string | Blob);
        }
      }
    });

    this.productService.addProduct(formData).subscribe(
      (response) => {
        console.log('Product created successfully', response);
     //   this.toastr.success('Product created successfully');
        this.router.navigate(['/all-products']); 
      },
      (error) => {
        this.errorMessage = error.error;
        console.error('Error creating product', error);
      //  this.toastr.error('Error creating product');
      }
    );
  }

}
