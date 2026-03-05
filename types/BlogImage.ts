export default class BlogImage {
  url: string = '';
  fileName: string = 'image.jpg';
  
  private blob?: Blob;

  constructor(image: Blob | string) {
    if (image instanceof Blob && image.size > 0) {
      this.url = URL.createObjectURL(image);
      if (image instanceof File)
        this.fileName = image.name;
      this.blob = image;
    }
    else if (typeof image === 'string') {
      this.url = image;
      this.fileName = this.extractFilenameFromUrl(this.url);
    }
  }
  
  public getFileList(): FileList | null {
    if (!this.blob) return null;
    const file = new File([this.blob], this.fileName, { 
      type: this.blob.type,
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  }

  private extractFilenameFromUrl(url: string): string {
    if (url === '') return '';
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || '';
    
    // Remove Vercel Blob hash pattern: -[alphanumeric] before extension
    const match = filename.match(/^(.+)-[A-Za-z0-9]+(\.[^.]+)$/);
    
    return match ? match[1] + match[2] : filename;
  }
}