import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GetProduct } from '../DTO/Getproduct';
import { ProductService } from '../../../services/productService/product.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CreateProduct } from '../DTO/CreateProduct';
@Component({
  selector: 'app-products-list',
  imports: [TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    Toast,
    ConfirmDialog,
    InputTextModule,

  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{
  products : GetProduct[] = [];
  deleteProductVisibility: boolean = false;
  subscription: Subscription[] = [];
  CreateDialogVisibility = false;

  constructor(private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,

  )
  {  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() : void{
    const sb1 = this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (err) =>{
        console.log(err);
      }
    })
    this.subscription.push(sb1);
  }

  addProduct(): void{
    this.router.navigateByUrl('admin/products/create-product');
  }

  updateProduct(id: string){
    this.router.navigate(['admin/products/updateProduct',id]);
  }

  listItems(){

  }

  deleteProduct(product: GetProduct ,event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete ${product.name}`,
      header: 'Deleting Product',
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
        const sb2 = this.productService.deleteProduct(product.id).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000})
            this.loadProducts();
            this.subscription.push(sb2);
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured', life: 3000})
          }
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
  });

  this.deleteProductVisibility = false;;
  }
}
