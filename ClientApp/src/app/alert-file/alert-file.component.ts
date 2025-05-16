import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-file',
  templateUrl: './alert-file.component.html',
  styleUrls: ['./alert-file.component.css'],
})
export class AlertFileComponent {
  htmlExcel: string = '';

  constructor(
    public dialogRef: MatDialogRef<AlertFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @ViewChild('iframeRef') iframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild('divRef') div!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit(): void {
    const width = window.innerWidth - 40 - 350;
    const height = window.innerHeight - 300 - 40;

    this.iframe.nativeElement.width = `${width}px`;
    this.iframe.nativeElement.height = `${height}px`;

    this.div.nativeElement.style.width = `${width}px`;
    this.div.nativeElement.style.height = `${height}px`;

    const { data, mimeType } = this.data;

    const isExcel =
      mimeType === 'application/vnd.ms-excel' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (!isExcel) {
      const src = `data:${mimeType};base64,${data}`;
      this.iframe.nativeElement.src = src;
      this.div.nativeElement.style.display = 'none';
    } else {
      this.iframe.nativeElement.style.display = 'none';
      this.htmlExcel = this.handleExcel(data);
    }
  }

  handleExcel(base64: string): string {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const workbook = XLSX.read(bytes, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const html = XLSX.utils.sheet_to_html(sheet);

      return html;
    } catch (error) {
      console.error('Erro ao processar base64:', error);
      return `<p style="color:red;">Erro ao exibir o Excel</p>`;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
