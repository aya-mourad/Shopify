import { Products } from 'src/app/interfaces/products';
import { Component } from '@angular/core';
import { ProductsService } from 'src/app/Servises/products.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {

  constructor(private sell:ProductsService){}
  id:string=''
  sellerId: string = ''
  categoryName: string = ''
  description: string = ''
  price: number = 0
  rating: number = 0
  title: string = ''
  imageCover: string = ''
  location: string = ''

  sellForm: FormGroup = new FormGroup({
    categoryName: new FormControl(null, [Validators.required,Validators.minLength(2)]),
    description: new FormControl(null, [Validators.required]),
    title: new FormControl(null, [Validators.required,Validators.minLength(2)]),
    price: new FormControl(null, [Validators.required]),
    imageCover: new FormControl(null, [Validators.required]),
    location: new FormControl(null, [Validators.required]),
  })
  
  productObj: Products = {
    id:'',
    sellerId: '',
    categoryName: '',
    description: '',
    price: 0,
    rating: 0,
    title: '',
    imageCover: '',
    location: '',
  }
  reset() {
    this.categoryName = ''
    this.description = ''
    this.price = 0
    this.rating = 0
    this.title = ''
    this.imageCover = ''
    this.location = ''
  }


  sellproduct(form:FormGroup) {
    if(this.sellForm.valid){
    this.productObj.sellerId=''
    this.productObj.id=''
    this.productObj.categoryName=this.categoryName
    this.productObj.description=this.description
    this.productObj.price=this.price
    this.productObj.rating=0
    this.productObj.title=this.title
    this.productObj.imageCover=this.imageCover
    this.productObj.location=this.location
    this.sell.addProducts(this.productObj)
    }
    this.reset();
}
}
