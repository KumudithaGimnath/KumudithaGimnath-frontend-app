import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AdalService } from 'adal-angular4';
import { HttpClient } from '@angular/common/http';
import {HomeService} from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading: boolean = true;
  user: any;
  profile: any;

  displayedColunms: string[] = ['id', 'name'];
  data = [];
  resource = null;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  files = [];

  constructor(private adalService: AdalService, protected http: HttpClient, protected homeService: HomeService) { }

  ngOnInit() {
    this.user = this.adalService.userInfo;
    this.user.token = this.user.token.substring(0, 10) + '...';
    this.loadStudentInformation();
  }

  // public getProfile() {
  //   console.log('Get Profile called');
  //   return this.http.get("https://graph.microsoft.com/v1.0/me");
  // }

  // public profileClicked() {
  //   this.getProfile().subscribe({
  //     next: result => {
  //       console.log('Profile Response Received');
  //       this.profile = result;
  //     }
  //   });
  // }


studentGet() {
  return this.http.get('https://kg-web-app.azurewebsites.net/users');
}

loadStudentInformation() {
  this.studentGet().subscribe({
    next: result => {
      console.log(result);
      this.data = result['data'];
      this.resource = result['source'];
      //this.isLoading = false;
    }
  });
}

uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file.data);
  this.homeService.upload(formData).subscribe({
    next: result => {
      if (result['statusCode'] === 200) {
        this.resource = 'Image uploaded successfully';
      } else {
        this.resource = 'Image upload failed!';
      }
    }
  });
}

private uploadFiles() {
  this.fileUpload.nativeElement.value = '';
  this.uploadFile(this.files[0]);
}

onClick() {
  const fileUpload = this.fileUpload.nativeElement;
  fileUpload.onchange = () => {
    for (let index = 0; index < fileUpload.files.length; index++) {
      const file = fileUpload.files[index];
      this.files.push({data: file, inProgress: false, progress: 0});
    }
    this.uploadFiles();
  };
  fileUpload.click();
}
}
