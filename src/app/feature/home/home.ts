import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { ThemeService } from '../../shared/services/theme.service';
import * as UrlConstants from '../../shared/Url-Constants';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SharedModule } from 'primeng/api';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map, startWith, tap, finalize } from 'rxjs/operators';
import { FileItem, SortOption } from '../../shared/models/app.models';


@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, GalleriaModule, SharedModule, DatePickerModule, SelectModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private router = inject(Router);
  private httpService = inject(HttpService);
  private cdr = inject(ChangeDetectorRef);
  public themeService = inject(ThemeService);

  // Reactive Controls
  searchControl = new FormControl('');
  sortControl = new FormControl('createdAt');
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);
  
  // State Signals/Subjects
  private refresh$ = new BehaviorSubject<void>(void 0);
  
  // Data Streams
  files$: Observable<FileItem[]>;
  loading$ = new BehaviorSubject<boolean>(false);
  isUploading = false; // Kept as simple boolean for now, or could be reactive

  // User & UI State
  user: any = null;
  showUserPopover = false;
  showDeleteModal = false;
  fileToDeleteId: any = null;
  
  // Gallery State
  selectedImageIndex: number = 0;
  displayGalleria: boolean = false;
  
  // Options
  sortOptions: SortOption[] = [
    { label: 'Newest First', value: 'createdAt' },
    { label: 'Oldest First', value: 'oldest' }, // Handling mapped manually if backend supports order param
    { label: 'Name (A-Z)', value: 'originalName' }
  ];

  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  constructor() {
    // Setup the main data stream
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(300),
      distinctUntilChanged()
    );

    const sort$ = this.sortControl.valueChanges.pipe(
      startWith(this.sortControl.value)
    );

    const startDate$ = this.startDateControl.valueChanges.pipe(
      startWith(this.startDateControl.value)
    );

    const endDate$ = this.endDateControl.valueChanges.pipe(
      startWith(this.endDateControl.value)
    );

    this.files$ = combineLatest([search$, sort$, startDate$, endDate$, this.refresh$]).pipe(
      tap(() => this.loading$.next(true)),
      switchMap(([search, sortBy, startDate, endDate]) => {
        let order = 'desc';
        let sortField = sortBy;
        
        // Custom logic to handle 'oldest' mapping if backend expects field + order
        if (sortBy === 'oldest') {
            sortField = 'createdAt';
            order = 'asc';
        }

        const payload = {
          search: search || "",
          sortBy: sortField,
          order: order,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null
        };

        return this.httpService.post(UrlConstants.fileListUrl, {}, payload).pipe(
          map((res: any) => {
            let list: FileItem[] = [];
            if (Array.isArray(res)) list = res;
            else if (res && Array.isArray(res.content)) list = res.content;
            else if (res && Array.isArray(res.data)) list = res.data;
            return list;
          }),
          catchError(err => {
            console.error('Error loading files:', err);
            return of([]);
          }),
          finalize(() => this.loading$.next(false))
        );
      })
    );
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            this.user = JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data', e);
        }
    }
  }

  toggleUserPopover(event: Event) {
    event.stopPropagation();
    this.showUserPopover = !this.showUserPopover;
  }
  
  closeUserPopover() {
    this.showUserPopover = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showUserPopover) {
      this.closeUserPopover();
    }
  }

  // Refreshes the list (used after upload/delete)
  refreshList() {
    this.refresh$.next();
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
        this.refreshList(); // Trigger refresh
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
    this.displayGalleria = true;
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
        this.refreshList(); // Trigger refresh
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
  
  onActiveIndexChange(index: number) {
    this.selectedImageIndex = index;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
