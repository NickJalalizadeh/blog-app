
// A class which handles image files which are being processed or prepared for usage by Vercel Blob Storage
export default class BlobImage {
  url: string = '';
  fileName: string = 'image.jpg';
  
  private file?: File;

  constructor(image: File | string) {
    if (image instanceof File && image.size > 0) {
      this.url = URL.createObjectURL(image);
      this.fileName = image.name;
      this.file = image;
    }
    else if (typeof image === 'string') {
      this.url = image;
      this.fileName = this.extractFilenameFromUrl(this.url);
    }
  }
  
  // The file list is needed to insert the image into a file picker element
  public getFileList(fileName = this.fileName): FileList | null {
    if (!this.file) return null;
    const file = new File([this.file], fileName, { 
      type: this.file.type,
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  }

  // Extracts file name from Vercel Blob urls
  private extractFilenameFromUrl(url: string): string {
    if (url === '') return '';
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || '';
    
    // Remove Vercel Blob hash pattern: -[alphanumeric] before extension
    const match = filename.match(/^(.+)-[A-Za-z0-9]+(\.[^.]+)$/);
    
    return match ? match[1] + match[2] : filename;
  }
}