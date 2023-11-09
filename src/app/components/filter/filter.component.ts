import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit,OnDestroy{
  @Output() showCategory = new EventEmitter<string>();
  categoriesSubscription:Subscription |undefined;
 categories : Array<string> | undefined;
  constructor(private storeService :StoreService){}
  onShowCategory(category : string):void{
    this.showCategory.emit(category)
  }
  ngOnInit(): void {
      this.categoriesSubscription = this.storeService.getAllCategories().subscribe((res) =>{
        this.categories = res
      })
  }
  ngOnDestroy(): void {
    if(this.categoriesSubscription){
        this.categoriesSubscription.unsubscribe();
    }
  }
}
