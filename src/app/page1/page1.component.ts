import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  allimages: any = []
  uploadForm: any;
  
  imagePath = this.adminService.imageBasePath;
  
  constructor(public fb: FormBuilder, public adminService: AdminService, public router: Router) { }

  ngOnInit(): void {
    this.adminService.getAllProducts().subscribe(res => {
      this.allimages = res
    })

  }








  addText(id: any) {
    console.log("/page2/" + id)
    this.router.navigateByUrl("/page2?id=" + id)
  }

}
