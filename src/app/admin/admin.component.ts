import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  allimages: any = []
  uploadForm: any

  imagePath = this.adminService.imageBasePath;
  formData: any;
  constructor(public fb: FormBuilder, public adminService: AdminService, public router: Router) { }

  async ngOnInit() {
    this.adminService.getAllProducts().subscribe(res => {
      this.allimages = res
    })
    this.uploadForm = this.fb.group({
      size: [24, [Validators.required]],
      color: ['#000000', [Validators.required]],
      font: ['arial', [Validators.required]],
      image: ['', [Validators.required]]
    })
  }

  onFileChange(event: any) {
    let file: File;
    file = event.target.files[0];
    this.formData = new FormData();
    this.formData.append("file", file, file.name);
  }

  async submitForm() {
    if (this.uploadForm.valid) {
      if (this.formData) {
        let hitImageUploadApi: any = await this.uploadImage(this.formData);
        let imageName: string = hitImageUploadApi.image;
        if (hitImageUploadApi.success) {
          let body = {
            fontColor: this.uploadForm.value['color'],
            fontSize: this.uploadForm.value['size'],
            fontFamily: this.uploadForm.value['font'],
            xAxis: 0,
            yAxis: 0,
            image: imageName,
          }
          let insertDataApiHit: any = await this.insertData(body);
          if (insertDataApiHit) {
            this.ngOnInit();
          }
        }
      }
    }
  }

  delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete card',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteProduct(id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.ngOnInit();
            }
          },
          error: (err) => {
             this.adminService.handlerMessage(err.code)
          }
        })
      }
    });
  }

  addText(id: any) {
    this.router.navigateByUrl("/page2?id=" + id + '&isAdmin=true')
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      this.adminService.getAllProducts().subscribe({
        next: (response: any) => {
          resolve(response)
        },
        error: (err: any) => {
          reject(err);
          // this.api.handlerMessage(err.code)
        }
      })
    })
  }

  uploadImage(formData: any) {
    return new Promise((resolve, reject) => {
      this.adminService.DocUpload(formData).subscribe({
        next: (response: any) => {
          resolve(response)
        },
        error: (err: any) => {
          reject(err);
          this.adminService.handlerMessage(err.code)
        }
      })
    })
  }

  insertData(body: object) {
    return new Promise((resolve, reject) => {
      this.adminService.createProduct(body).subscribe({
        next: (response: any) => {
          resolve(response)
        },
        error: (err: any) => {
          reject(err);
          this.adminService.handlerMessage(err.code)
        }
      })
    })
  }
}
