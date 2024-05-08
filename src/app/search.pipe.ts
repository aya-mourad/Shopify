import { Pipe, PipeTransform } from '@angular/core';
import { Products } from './interfaces/products';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
// any=product interface
  transform(products: Products[],searchWord:string): Products[] {
    return products.filter((product)=>{return product.title.includes(searchWord)|| product.categoryName.includes(searchWord)});
  }

}
