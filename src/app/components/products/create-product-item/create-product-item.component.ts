
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProduct } from '../DTO/CreateProduct';
import { CreateProductVariation } from '../DTO/productItem/productVariation/CreateProductVariation';
import { GetColor } from '../../../shared/DTO/GetColor';
import { GetSizeOption } from '../../../shared/DTO/GetSizeOption';
import { GetCategory } from '../../categories/DTO/GetCategory';
import { ProductService } from '../../../services/productService/product.service';
import { CategoryService } from '../../../services/categoryService/category.service';
import { Subscription } from 'rxjs';
import { ImagePreview } from '../DTO/ImagePreview';
import { ErrorComponent } from '../../../shared/ErrorHandling/error-component';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { GetGender } from '../../categories/DTO/GetGenders';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product-item',
  imports: [ReactiveFormsModule, FormsModule,CommonModule, ErrorComponent, Toast],
  templateUrl: './create-product-item.component.html',
  styleUrl: './create-product-item.component.css'
})
export class CreateProductItemComponent implements OnInit, OnDestroy {

  productForm: FormGroup = new FormGroup({});
  model: CreateProduct ={
    name: '',
    description: '',
    categoryId: '',
    mainImage: null,
    materials: '',
    createProductItems: []
  }

  genders: GetGender[] = [];
  selectedGender: string = '';

  categories?: GetCategory[];
  colors: GetColor[] = [];
  sizeOptions: GetSizeOption[] = [];
  mainImagePreview: string = '';
  imagesPreview: [ImagePreview[]] = [[]];
  productItemsImages: [File[]] = [[]]
  /**
   *
   */

  selectedColor: any = null;
  isDropdownOpen = false;


  subscriptions: Subscription[] = []
  backendErrors: any;

  constructor(private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,

  ){}

  ngOnInit(): void {
    this.buildForm()

    const sb1 = this.categoryService.getGenders(true).subscribe({
      next: response => {
        this.genders = response;
      },
      error: err => {
        console.log(err)
      }
    })

    const sb2 = this.productService.getColors().subscribe({
      next: response => this.colors = response,
      error: err => console.log(err)
    })

    const sb3 = this.productService.getSizeOptions().subscribe({
      next: response => this.sizeOptions = response,
      error: err => console.log(err)
    })
    this.subscriptions.push(sb1)
    this.subscriptions.push(sb2)
    this.subscriptions.push(sb3)
  }

  onGenderSelect(){

    const sb1 = this.categoryService.getAllCategories().subscribe({
      next: (response) => this.categories = response.filter( c => c.genderId === this.productForm.get('genderId')?.value),
      error: (err) => {
        console.log(err)
      }
    })
    this.subscriptions.push(sb1)
  }


  buildForm() : void{
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      genderId: [''],
      categoryId: ['', Validators.required],
      materials: [''],
      mainImage: [''],
      createProductItems: this.formBuilder.array([])//dynamic Form To be Added
    })
  }

  get createProductItems() {  //name of the dynamic form ^^
    return this.productForm.get('createProductItems') as FormArray;
  }

  createProductItem(createProductItems: any = {}): FormGroup {
    return this.formBuilder.group({
      colorId: [createProductItems.colorId || '', Validators.required],
      originalPrice: [createProductItems.originalPrice || '', Validators.required],
      salePrice: [createProductItems.salePrice || '', Validators.required],
      productCode: [createProductItems.productCode || ''],
      images: [[]],
      productVariations: this.formBuilder.array(
        (createProductItems?.productVariations ?? []).map((v: CreateProductVariation) => this.createProductVariation(v))
      )});
  }

  // ✅ Add New Product Item
  addProductItem() {
    this.createProductItems.push(this.createProductItem());
    this.productItemsImages.push([]);
    this.imagesPreview.push([]);
  }

  // ✅ Remove Product Item
  removeProductItem(index: number) {
    this.createProductItems.removeAt(index);
  }

  onMainImgSelected(event: Event){
    const files = event.currentTarget as HTMLInputElement;
    const img = files.files?.[0];

    if(img){
      //to store it in the form

      this.productForm.patchValue({mainImage: img})
      console.log(this.productForm.value)
      //to preview image on scrren
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      }

      reader.readAsDataURL(img);

    }
  }

  // getProductImages(productItem: any) : FormArray{
  //   return productItem.get('images') as FormArray
  // }

  // createProductImages() : FormGroup {
  //   return this.formBuilder.group({
  //     images: [[]]
  //   })
  // }

  // addProductImages(productItem: any){
  //   return this.getProductImages(productItem).push(this.createProductImages())
  // }

  onProductItemsImgSelected(event: Event , productItemIndex: number){
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const images = Array.from(input.files!);
    this.productItemsImages[productItemIndex] = images;

    const cpi = this.productForm.get('createProductItems') as FormArray;
    cpi.at(productItemIndex).patchValue({ images: images})
    // console.log(this.productForm.value)
    // console.log(cpi.value);

    let itemImg: ImagePreview[] = [];
    images.forEach((img) => {
      // to preview images
      if (!this.imagesPreview[productItemIndex].some(imgp => imgp.name === img.name)) {
        const reader = new FileReader();
        reader.onload = () => {
          itemImg.push({
            name: img.name,
            size: img.size,
            imageAsString: reader.result as string
          });
        };
        reader.readAsDataURL(img);
      }
    })

    this.imagesPreview[productItemIndex] = itemImg;

    console.log(this.imagesPreview)
  }

  getProductVariations(createProductItems: any) {
    return createProductItems.get('productVariations') as FormArray;
  }

  createProductVariation(variation: any = {}): FormGroup {
    return this.formBuilder.group({
      sizeOptionId: [variation.sizeOptionId || '', Validators.required],
      quantityInStock: [variation.quantityInStock || 0, Validators.required]
    });
  }

  // ✅ Add New Product Variation
  addProductVariation(productItem: any) {
    this.getProductVariations(productItem).push(this.createProductVariation());
  }

  // ✅ Remove Product Variation
  removeProductVariation(productItem: any, index: number) {
    this.getProductVariations(productItem).removeAt(index);
  }


    // ✅ Submit Form
  onSubmit() {
    this.backendErrors = '';
    if(this.productForm.invalid){
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.value; // Get the form values

  // Create the request object
    const request: CreateProduct = {
      name: formValue.name,
      description: formValue.description,
      categoryId: formValue.categoryId,
      mainImage: formValue.mainImage, // Extract main image file
      materials: formValue.materials,
      createProductItems: formValue.createProductItems.map((productItem: any) => ({
        colorId: productItem.colorId,
        originalPrice: productItem.originalPrice,
        salePrice: productItem.salePrice,
        productCode: productItem.productCode ? productItem.productCode : null,
        images: productItem.images ? productItem.images : [], // Extract array of files
        productVariations: productItem.productVariations.map((productVatiation: any) => ({
          sizeOptionId: productVatiation.sizeOptionId,
          quantityInStock: productVatiation.quantityInStock
        }))
      }))
    };

    if(request.createProductItems.length < 1){
      this.backendErrors = 'Must add at least 1 item'
      this.messageService.add({ severity: 'error', summary: 'Invalid', detail: this.backendErrors });

      return;
    }

    request.createProductItems.forEach(item => {
      if(item.productVariations.length < 1){
        this.backendErrors = 'Must add at least 1 variation for each item'
        this.messageService.add({ severity: 'error', summary: 'Invalid', detail: this.backendErrors });

        return
      }
    })

  // Call the API function
  this.productService.CreateProduct(request).subscribe({
    next: (response) => {
      if(response.success){
        this.messageService.add({severity: 'success', summary: 'Added', detail: response.message, life: 3000})
        this.router.navigateByUrl('/admin/products')
      }
      else{
        this.messageService.add({severity: 'error', summary: 'Error', detail: response.message})
      }
    },
    error: (err: HttpErrorResponse) => {

    }
  });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => {
      sb.unsubscribe();
    })
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectColor(color: any, productItem: any) {
    this.selectedColor = color;
    productItem.get('colorId')?.setValue(color.id); // Update FormControl
    this.isDropdownOpen = false;
  }
}
