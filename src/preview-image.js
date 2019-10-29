import './css/preview-image.css';
import {Utils} from './utils';
import {EventEmitter, Observer} from './utils';

// 图片预览类，单例
export class PreviewImage {
  constructor() {
    this.element = null; // 整个模块的dom元素
    this.image = null;  // 显示图片的img标签
    this.buttons = {
      close: null,
      save: null
    }
    this.events = new EventEmitter();
    this._init();
    this._bindEvents();
  }

  static getInstance() {
    if (!PreviewImage.instance) {
      PreviewImage.instance = new PreviewImage();
    }
    return PreviewImage.instance;
  }

  _init() {
    const preview = this.element = document.createElement('div');
    const image = this.image = document.createElement('img');
    const close = this.buttons.close = document.createElement('button');
    const save = this.buttons.save = document.createElement('button');
    const buttons = document.createElement('div');
    preview.className = 'h-editor-preview-panel';
    image.className = 'h-editor-preview-image';
    close.className = 'h-editor-preview-close';
    save.className = 'h-editor-preview-save';
    buttons.className = 'h-editor-preview-buttons'
    close.innerHTML = '关闭';
    save.innerHTML = '上传';
    image.src = '';
    buttons.append(close);
    buttons.append(save);
    preview.append(image);
    preview.append(buttons);


  }


  _bindEvents() {
    const observer = new Observer(this.events);
    observer.subscribe('close', () => {
      this.buttons.close.addEventListener('click', () => {
        this._hide();
      });
    });

    observer.subscribe('confirm', () => {
      this.buttons.save.addEventListener('click', e => {
        this.events.emit('pasteImage');
        this._hide();
      });
    });
  }

  _hide() {
    this.element.parentElement.removeChild(this.element);
    this.image.src = '';
  }

  show(element, file) {
    element.append(this.element);
    Utils.previewImage(this.image, file);
  }

}

PreviewImage.instance = null;
