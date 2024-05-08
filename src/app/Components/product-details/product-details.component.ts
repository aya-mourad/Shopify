import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/Servises/products.service';
import { Products } from 'src/app/interfaces/products';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  
  productD: Observable<Products| undefined>;
  constructor(private _activated: ActivatedRoute, private details: ProductsService) {
    let proID = _activated.snapshot.params['productId']
    this.productD = this.details.getProductById(proID)
  }
}
