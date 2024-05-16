import { Router } from '@angular/router';
import { Products } from 'src/app/interfaces/products';
import { Component } from '@angular/core';
import { ProductsService } from 'src/app/Servises/products.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
})
export class AddproductComponent {
  constructor(private sell: ProductsService, private Router: Router) {}
  id: string = '';
  sellerId: string = '';
  rating: number = 0;
  categoryName: string = '';
  description: string = '';
  price: number = 0;
  title: string = '';
  imageCover: string = '';
  location: string = '';
  isSold: boolean = false;

  sellForm: FormGroup = new FormGroup({
    categoryName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    description: new FormControl(null, [Validators.required]),
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    price: new FormControl(null, [Validators.required]),
    imageCover: new FormControl(null, [Validators.required]),
    location: new FormControl(null, [Validators.required]),
  });

  productObj: Products = {
    id: '',
    sellerId: '',
    categoryName: '',
    description: '',
    price: 0,
    rating: 0,
    title: '',
    imageCover: '',
    location: '',
    isSold: false,
  };

  reset() {
    this.sellForm.reset();
  }

  sellproduct() {
    console.log('sellproduct method called');
    if (this.sellForm.valid) {
      this.productObj.sellerId = '';
      this.productObj.id = '';
      this.productObj.categoryName = this.sellForm.get('categoryName')?.value;
      this.productObj.description = this.sellForm.get('description')?.value;
      this.productObj.price = this.sellForm.get('price')?.value;
      this.productObj.rating = 0;
      this.productObj.title = this.sellForm.get('title')?.value;
      this.productObj.imageCover = "https://res.cloudinary.com/dnem3okap/image/upload/v1715689505/zypczeemmmzs9mtcnyny.jpg"
      this.productObj.location = this.sellForm.get('location')?.value;
      this.productObj.isSold = false;

      this.sell
        .addProducts(this.productObj)
        .then(() => {
          this.reset();
          this.Router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Error adding product:', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
