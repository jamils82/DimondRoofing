import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CmsService } from "@spartacus/core";
@Component({
  selector: "app-custom-file-upload",
  templateUrl: "./custom-file-upload.component.html",
  styleUrls: ["./custom-file-upload.component.scss"],
})
export class CustomFileUploadComponent implements OnInit, OnChanges {
  notCorrectFormat: boolean = false;
  isFileUploaded: boolean = false;
  maxFileSize: boolean = false;
  fileUploadSection: boolean = true;
  url: any = "";
  fileSize: any;
  fileType: string = "";
  fileName: string = "";
  UploadCustomDesignContent: any;
  SpecifyDetailsAddtoCartContent: any;
  @Output() updatedFileData = new EventEmitter<any>();
  @Input() resetFileUpload: any;
  @ViewChild("fileUploader") fileUploader: any;
  constructor(public cmsService: CmsService, public cd: ChangeDetectorRef, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.cmsService
      .getComponentData("UploadCustomDesignContent")
      .subscribe((data: any) => {
        if (data) {
          this.UploadCustomDesignContent = data?.content;
        }
      });

    this.cmsService
      .getComponentData("SpecifyDetailsAddtoCartContent")
      .subscribe((data: any) => {
        if (data) {
          this.SpecifyDetailsAddtoCartContent = data?.content;
        }
      });

    if (this.resetFileUpload) {
      this.removeClicked();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.resetFileUpload) {
      this.removeClicked();
    }
  }

  uploadButtonCLick(): void {
    this.fileUploader.nativeElement.click();
  }

  handleFileInput(event: any): void {
    this.uploadFile(event.target.files[0]);
  }

  droppedFiles(allFiles: File[]): void {
    this.uploadFile(allFiles[0]);
  }

  removeClicked(): void {
    this.url = "";
    this.fileUploader.nativeElement.value = '';
    this.isFileUploaded = false;
    this.fileUploadSection = true;
    this.maxFileSize = false;
    this.notCorrectFormat = false;
    this.updatedFileData.emit(null);
  }

  replaceClicked(): void {
    this.url = "";
    this.fileUploader.nativeElement.value = '';
    this.isFileUploaded = false;
    this.fileUploadSection = true;
    this.maxFileSize = false;
    this.notCorrectFormat = false;
    this.uploadButtonCLick();
    this.updatedFileData.emit(null);
  }

  uploadFile(file: any): void {
    this.fileType = file?.type;
    this.fileName = file?.name;
    this.fileSize = file?.size / 1000000;
    var reader = new FileReader();
    if (
      file.type == "image/png" ||
      file.type == "image/jpeg" ||
      file.type == "application/pdf"
    ) {
      this.isFileUploaded = false;
      this.fileUploadSection = false;
      if (file.size > 5000000) {
        this.maxFileSize = true;
        return;
      }
      this.isFileUploaded = true;
      this.fileName = file.name;
      reader.onerror = (error) => {
      };
      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
        if (file.type == "application/pdf") {
          setTimeout(() => {
            var blob = new Blob([file], { type: this.fileType });
            // Create Blog URL 
            this.url = window.URL.createObjectURL(blob);
            this.url = this.sanitizer.bypassSecurityTrustUrl(this.url);
            this.cd.detectChanges();
          }, 1000);
        }
        this.cd.markForCheck();
        this.updatedFileData.emit(this.url);
      };
      reader.readAsDataURL(file); // read file as data url 
    } else {
      this.isFileUploaded = false;
      this.fileUploadSection = false;
      this.notCorrectFormat = true;
    }
  }

}
