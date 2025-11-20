import { Component } from '@angular/core';

@Component({
  selector: 'app-reportaboutfound',
  standalone: true,
  imports: [],
  templateUrl: './reportaboutfound.html',
  styleUrl: './reportaboutfound.css',
})

export class Reportaboutfound {
  
  previewUrl: string | ArrayBuffer | null = null;

  // دالة لعرض الصورة عند اختيارها
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result!;
      };
      reader.readAsDataURL(file);
    }
  }

  // محاكاة الضغط على Input عند الضغط على الديف
  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}