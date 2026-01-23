import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import * as UrlConstants from '../../shared/Url-Constants';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, GalleriaModule, SharedModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private router = inject(Router);
  private httpService = inject(HttpService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  files: any[] = [];
  uploadForm: FormGroup;
  isUploading = false;
  searchControl: any;

  // Modal State
  showDeleteModal = false;
  fileToDeleteId: any = null;

  // Gallery State
  selectedImageIndex: number = 0;
  displayCustom: boolean = false;

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];

  constructor() {
    this.uploadForm = this.fb.group({
      // We don't strictly bind file input to form control for file objects usually, 
      // but we can use it to reset or track validity if needed.
    });
  }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles() {
    const payload = {
      search: "",
      sortBy: "createdAt", 
      order: "desc"
    };
    
    this.httpService.post(UrlConstants.fileListUrl, {}, payload).subscribe({
      next: (res: any) => {
        console.log('Files API Response:', res);
        
        if (Array.isArray(res)) {
            this.files = res;
        } else if (res && Array.isArray(res.content)) {
            this.files = res.content;
        } else if (res && Array.isArray(res.data)) {
            this.files = res.data;
        } else {
             this.files = [];
             console.warn('Unexpected response format:', res);
        }
        
        console.log('Mapped Files:', this.files);
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('Error loading files:', err);
      }
    });
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.uploadFiles(fileList);
    }
  }

  uploadFiles(fileList: FileList) {
    this.isUploading = true;
    const formData = new FormData();
    
    // "files" key as requested
    for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i]);
    }

    this.httpService.post(UrlConstants.fileUploadUrl, {}, formData).subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        this.isUploading = false;
        this.cdr.detectChanges(); // Force UI update
        this.loadFiles(); // Refresh list
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading = false;
        this.cdr.detectChanges(); // Force UI update
        alert('Upload failed!');
      }
    });
  }

  openGallery(index: number) {
    this.selectedImageIndex = index;
    this.displayCustom = true;
  }

  onActiveIndexChange(event: number) {
      this.selectedImageIndex = event;
      this.cdr.detectChanges();
  }

  deleteFile(fileId: any, event: Event) {
    event.stopPropagation(); 
    this.fileToDeleteId = fileId;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.fileToDeleteId) return;

    const url = UrlConstants.fileDeleteUrl + this.fileToDeleteId;
    this.httpService.delete(url, {}).subscribe({
      next: (res) => {
        console.log('Delete success:', res);
        this.files = this.files.filter(f => f.id !== this.fileToDeleteId);
        this.cancelDelete(); // Close modal
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Delete failed!');
        this.cancelDelete();
      }
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.fileToDeleteId = null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
