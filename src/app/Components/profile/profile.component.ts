import { Component,Input } from '@angular/core';
import { UserService } from 'src/app/Servises/user.service';
import { ProductsService } from '../../Servises/products.service';
import { Observable } from 'rxjs';
import { user } from '../../interfaces/user';
import { Products } from '../../interfaces/products';
import { ProductWithFeedbackRating } from '../../interfaces/ProductWithFeedbackRating.ts';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
userD: Observable<user | undefined>;
 products: Products[] = [];
// @Input() product!: Products;
productsWithFeedbackRating$: Observable<ProductWithFeedbackRating[]>;

constructor(private details: UserService,private ps:ProductsService){
this.userD = this.details.getUserById();

this.productsWithFeedbackRating$ = this.details.getProductsByUserId();
this.productsWithFeedbackRating$.subscribe(products => {
  console.log('Products with feedback and rating:', products);
 
});


this.fetchProductList();

}
// this.details.getProductsByUserId().subscribe(products => {
//   this.products = products;
//   console.log(this.products); 
// });
// getRatingForFeedback(feedbackId: string): number | undefined {
//   const feedback = Array.isArray(this.product?.ratings) 
//     ? this.product.ratings.find(rating => rating.id === feedbackId) 
//     : undefined;

//   return feedback ? feedback.rating : undefined;
// }

productList: Products[] = [];

fetchProductList() {
  this.ps.getAllProducts().subscribe(products => {
    this.productList = products;
  });
}

removeProductFromProfile(productId: string) {
  if (!confirm("Are you sure you want to remove this product?")) {
    return; 
  }
  this.details.removeProduct(productId).then(() => {
    console.log('Product removed successfully');

    this.productList = this.productList.filter(product => product.id !== productId);
  
  }).catch(error => {
    console.error('Error removing product:', error);
  });
}


updateIsSoldFromProfile(productId: string) {
  if (!confirm("Are you sure you want to mark this product as sold?")) {
    return; 
  }
  this.details.updateIsSold(productId).then(() => {
    console.log('Product removed successfully');

    this.productList = this.productList.filter(product => product.id !== productId);
  
  }).catch(error => {
    console.error('Error removing product:', error);
  });
}



}
