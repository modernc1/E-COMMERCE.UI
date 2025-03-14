import { Component } from '@angular/core';
import { GetGender } from '../../categories/DTO/GetGenders';
import { CategoryService } from '../../../services/categoryService/category.service';
import { GetCategory } from '../../categories/DTO/GetCategory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-child-nav',
  imports: [CommonModule],
  templateUrl: './child-nav.component.html',
  styleUrl: './child-nav.component.css'
})
export class ChildNavComponent {
  genders: GetGender[] = [];
  ImagePreview: string = '';
  malCategories: GetCategory[] = [];
  femaleCategories: GetCategory[] = [];
  constructor(private categoryService: CategoryService){}
  ngOnInit() {
    this.categoryService.getGenders(true).subscribe({
      next: response => {
        this.genders = response;
        this.malCategories = this.genders[0].categories;
        this.femaleCategories = this.genders[1].categories;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  hoverCategory(category: GetCategory){
    this.ImagePreview = category.imageUrl
  }

  ngOnDestroy(): void {

  }
}
