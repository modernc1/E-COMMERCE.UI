import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../../../services/categoryService/category.service';
import { GetCategory } from '../DTO/GetCategory';
import { CategoryRequest } from '../DTO/categoryRequest';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { GetGender } from '../DTO/GetGenders';
import { SelectModule } from 'primeng/select';
import { FileUpload, FileUploadEvent, UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-categories-list',
  imports: [TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    Dialog,
    ConfirmDialog,
    InputTextModule,
    FormsModule,
    Toast,
    SelectModule,
    FileUpload

  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  categories : GetCategory[] | undefined;
  genders: GetGender[] = [];
  addCategoryDialogVisiblety = false;
  newCategory : CategoryRequest = {name: '', genderId: '', };
  imagePreview: string = '';
  chosenCategoryId?: string;
  updateCategoryDialogVisibility: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(
    private CategoryService: CategoryService,
    private MessageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() : void{
    const sb1 = this.CategoryService.getAllCategories().subscribe({
      next: response => {
        this.categories = response
      }
    })

    this.subscriptions.push(sb1);
  }

  showAddCategory(): void{
    this.addCategoryDialogVisiblety = true;
    //rest models
    this.newCategory = {name: '', genderId: '', image: undefined}
    this.imagePreview = ''
    const sb4 = this.CategoryService.getGenders(false).subscribe({
      next: response => {
        this.genders = response;
      }
    })
    this.subscriptions.push(sb4);
  }

  onUpload(event: FileUploadEvent){
    const img = event.files[0]
    if(!img){
      return;
    }
    this.newCategory.image = img;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(img);
  }

  onFormSubmit(categoryId?: string){
    if(categoryId){
      const sb5 = this.CategoryService.updateCategory(this.newCategory, categoryId).subscribe({
        next: response => {
          this.MessageService.add({ severity: 'success', summary: "Updated", detail: response.message})
          this.updateCategoryDialogVisibility = false;
          this.loadCategories();
        },
        error: err =>{
          this.MessageService.add({severity: 'error', summary: "Error", detail: 'Error Occured'})
          console.log(err);
        }
      })
      this.subscriptions.push(sb5);

    }
    else{
      const sb2 = this.CategoryService.CreateCategory(this.newCategory).subscribe({
        next: (response) => {
          this.MessageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000})
          this.loadCategories();
          this.newCategory = {name: '', genderId: '', image: undefined}
        },
        error: (err) => {
          this.MessageService.add(
            { severity: 'error', summary: 'Error', detail: 'Error Occured', life: 3000})
          console.log(err);
          console.log(categoryId);
        }
      });

      this.subscriptions.push(sb2);
      this.addCategoryDialogVisiblety = false;
    }

  }

  deleteCategory(category: GetCategory, event: Event){
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: `Are you sure you want to delete ${category.name}`,
          header: 'Deleting Category',
          icon: 'pi pi-info-circle',
          rejectLabel: 'Cancel',
          rejectButtonProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true,
          },
          acceptButtonProps: {
              label: 'Delete',
              severity: 'danger',
          },

          accept: () => {
            const sb3 = this.CategoryService.deleteCategory(category.id).subscribe({
              next: (response) => {
                this.MessageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000})
                this.loadCategories();
                this.subscriptions.push(sb3);
              },
              error: (err) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured', life: 3000})
              }
            });
          },
          reject: () => {
              this.MessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          },
      });

    this.addCategoryDialogVisiblety = false;;
  }

  updateCategory(category: GetCategory, id: string, imgUrl: string){
    const sb4 = this.CategoryService.getGenders(false).subscribe({
      next: response => {
        this.genders = response;
      },
      error: err => {
        console.log(err)
      }
    })

    this.newCategory.name = category.name
    this.newCategory.genderId = category.genderId;
    this.updateCategoryDialogVisibility = true
    this.imagePreview = imgUrl
    this.chosenCategoryId = id

    this.subscriptions.push(sb4);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
