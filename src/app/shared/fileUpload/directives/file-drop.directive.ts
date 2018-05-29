import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { FileItem } from '../providers/file-item';
import { FileLikeObject } from '../providers/file-like-object';
import { FileUploader, FileUploaderOptions } from '../providers/file-uploader';


@Directive({ selector: '[btFileDrop]' })
export class FileDropDirective implements OnInit {
  @Input() public uploader: FileUploader;
  @Input() public multiple = false;
  @Output() public fileOver: EventEmitter<any> = new EventEmitter();
  @Output() public fileDrop: EventEmitter<FileItem[]> = new EventEmitter<FileItem[]>();

  protected element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnInit() {
    this.uploader.onAfterAddingAll = (fileItems) => {
      this.fileDrop.emit(fileItems);
    };
    this.uploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
      console.log('onWhenAddingFileFailed');
    };
  }

  public getOptions(): FileUploaderOptions {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    const transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    this._preventAndStop(event);

    const options = this.getOptions();
    const filters = this.getFilters();
    if (!this.multiple && this.uploader.queue.length > 0) {
      this.uploader.removeFromQueue(this.uploader.queue[0]);
    }
    this.uploader.addToQueue(transfer.files, options, filters);
    this.fileOver.emit(false);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any): void {
    const transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    this._preventAndStop(event);
    transfer.dropEffect = 'copy';
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): any {
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  protected _getTransfer(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event: any): any {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types: any): any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }
}
