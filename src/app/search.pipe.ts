// import { Pipe, PipeTransform } from '@angular/core';
// import { Products } from './interfaces/products';

// @Pipe({
//   name: 'search'
// })
// export class SearchPipe implements PipeTransform {
// // any=product interface
//   transform(products: Products[],searchWord:string): Products[] {
//     return products.filter((product)=>{return product.title.includes(searchWord)|| product.categoryName.includes(searchWord)|| product.location.includes(searchWord)});
//   }

// }

import { Pipe, PipeTransform } from '@angular/core';
import { Products } from './interfaces/products';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(
    products: Products[] | null,
    searchWord: string
  ): Products[] | null {
    if (!products) {
      return null;
    }
    if (!searchWord) {
      return products;
    }
    searchWord = searchWord.toLowerCase();
    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchWord) ||
        product.categoryName.toLowerCase().includes(searchWord) ||
        product.location.toLowerCase().includes(searchWord)
        
      );
    });
  }
}
