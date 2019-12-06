import './css/index.css';
import {Utils, Observer} from './utils';
import {Emoji} from './emoji';
import {PreviewImage} from './preview-image';
import folderIcon from './images/folder-open.png';
import imageIcon from './images/image.png';
import smileIcon from './images/smile.png';
import {At} from './at';


export default class HEditor {
  constructor(element, options) {
    HEditor.id += 1;
    const settings = {
      width: '100%',
      height: '100px',
      emoji: true,
      image: true,
      file: true
    };
    this.element = element;
    this.options = options ? Object.assign({}, settings, options) : settings;
    this.toolbar = {
      element: null,
      emoji: {},
      image: {},
      file: {},
      send: {}
    };
    this.body = {
      element: null,
      focusToLast: false,
      draft: '',
      format: ''
    };
    this.emoji = Emoji.getInstance();
    this.preview = PreviewImage.getInstance();
    this.pasteImage = null;
    this.at = new At();
    this._init();
    this._bindEvents();
  }

  _init() {
    if (this.element.tagName !== 'DIV') {
      throw new Error('please use div element init it!');
    }
    const options = this.options;
    const editorEle = document.createElement('div');
    const content = `
      <div class="h-editor-body" contenteditable></div>
      <div class="h-editor-toolbar clear-fix">
        <div class="h-editor-emoji"><img src="${smileIcon}" alt=""></div>
        <div class="h-editor-image"><img src="${imageIcon}" alt=""></div>
        <div class="h-editor-file"><img src="${folderIcon}" alt=""></div>
        <div class="h-editor-send">发送</div>
      </div>`;
    editorEle.className = 'h-editor';
    editorEle.innerHTML = content;
    const [body, toolbar] = editorEle.children;
    const [emojiEle, imageEle, fileEle, sendBtnEle] = toolbar.children;
    const {emoji, image, file} = options;
    const imageUpload = this._createUpload('h-editor-image-upload');
    const fileUpload = this._createUpload('h-editor-file-upload');
    !emoji && toolbar.removeChild(emojiEle);
    !image && toolbar.removeChild(imageEle);
    !file && toolbar.removeChild(fileEle);
    imageEle.appendChild(imageUpload);
    fileEle.appendChild(fileUpload);
    this.toolbar.element = toolbar;
    this.toolbar.emoji.element = emojiEle;
    this.toolbar.image.element = imageEle;
    this.toolbar.file.element = fileEle;
    this.toolbar.image.upload = imageUpload;
    this.toolbar.file.upload = fileUpload;
    this.toolbar.send.element = sendBtnEle;
    this.body.element = body;
    this.element.appendChild(editorEle);
  }

  _bindEvents() {
    const {emoji, image, file} = this.toolbar;
    const body = this.body;
    emoji.element.addEventListener('click', e => {
      e.stopPropagation();
      if (this.body.focusToLast) {
        this.focusToLast();
      } else {
        this.focus();
      }
      if (this.emoji.isShow) {
        this.emoji.hide();
      } else {
        const position = {
          x: e.clientX,
          y: e.clientY
        }
        this.emoji.show(this.toolbar.element, position);
      }
    }, false);
    image.element.addEventListener('click', e => {
      const {upload} = image;
      const [ele] = upload.children;
      ele.click();
    }, false);
    file.element.addEventListener('click', e => {
      const {upload} = file;
      const [ele] = upload.children;
      ele.click();
    }, false);
    body.element.addEventListener('input', e => {
      if (e.data === '@') {
        this.at.show(this.element);
      }
      this.body.draft = this.body.element.innerHTML;
      let draft = this.body.draft;
      draft = draft.replace(/^(<br>){1,}$/g, '');
      draft = draft.replace(/&nbsp;/g, ' ');
      draft = draft.replace(/<br>/g, '\n');
      this.body.format = draft;
    }, false);
    body.element.addEventListener('keydown', e => {
      if (e.keyCode === 13 && e.ctrlKey) {
        const {element} = body;
        let insertHtml = '<br>';
        if (window.getSelection) {
          let next = window.getSelection().focusNode.nextSibling;
          do {
            if (!next || next.nodeValue || 'BR' === next.tagName) {
              break;
            }
          } while (next = next.nextSibling);
          next || (insertHtml += insertHtml);
          if (next && next.nodeName === '#text' && insertHtml !== '<br><br>' &&
            e.target.innerHTML && !e.target.innerHTML.match(/<br>$/ig)) {
            insertHtml += insertHtml;
          }
          if (!e.target.innerHTML) {
            insertHtml += insertHtml;
          }
          Utils.insertAtCursor(element, insertHtml, false);
        } else {
          throw new Error('this browser not support selection, please change browser');
        }
      } else if (e.keyCode === 13) {
        e.preventDefault();
        const {send} = this.toolbar;
        send.element.click();
      }
    }, false);
    body.element.addEventListener('paste', e => {
      e.preventDefault();
      const clipboardData = e.clipboardData;
      const {items, files} = clipboardData;
      let item = null;
      if (files && files.length) {
        this.pasteImage = files[0];
        this.preview.show(this.element, files[0]);
      } else if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind === 'file' && items[i].type.match(/^image\//i)) {
            this.pasteImage = item = items[i];
            break;
          }
        }
      }
      if (item) {
        this.preview.show(this.element, item);
      }
      let pasteDate = clipboardData.getData("Text");
      pasteDate = pasteDate.replace(/</g, '&lt;');
      pasteDate = pasteDate.replace(/>/g, '&gt;');
      pasteDate = pasteDate.replace(/\n/g, '<br>');
      pasteDate = pasteDate.replace(/ /g, '&nbsp;');
      Utils.insertAtCursor(body.element, pasteDate, false);
    }, false);
    body.element.addEventListener('click', e => {
      e.stopPropagation();
      this.body.focusToLast = false;
    }, false);
    document.addEventListener('click', (e) => {
      let target = e.target;
      // const isChild = this.emoji.element.contains(target);
      // if (!isChild) {
      //   this.body.focusToLast = true;
      //   if (this.emoji.isShow) {
      //     this.emoji.hide();
      //   }
      // }

      // if (this.at.isShow) {
      //   console.log(1);
      //   this.at.events.emit('close');
      // }
      this._hideModule(this.emoji, target);
      this._hideModule(this.at, target);
    }, false);

    this.emoji.selected(e => {
      Utils.insertAtCursor(this.body.element, e, false);
    });

    this.preview.events.emit('close');
    this.preview.events.emit('confirm');
  }

  _hideModule(element, target) {
    console.log(element)
    // const isChild = element.contains(target);
    // console.log(isChild);
    // if (!isChild) {
    //   this.body.focusToLast = true;
    //   if (element.isShow) {
    //     console.log(element);
    //     element.hide();
    //   }
    // }
  }

  _createUpload(id) {
    const element = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    element.style.display = 'none';
    label.setAttribute('for', `${id}-${HEditor.id}`);
    input.id = `${id}-${HEditor.id}`;
    input.type = 'file';
    element.appendChild(label);
    element.appendChild(input);
    return element;
  }

  _listenUploadEvent(inputElement, callback) {
    inputElement.addEventListener('change', () => {
      const files = inputElement.files.length > 0 ? inputElement.files : [];
      const f = [...files];
      inputElement.value = null;
      callback(f[0]);
    }, false);
  }

  listen(type, callback = null) {
    switch (type) {
      case 'image': {
        const [, input] = this.toolbar.image.upload.children;
        this._listenUploadEvent(input, callback);
        break;
      }
      case 'file': {
        const [, input] = this.toolbar.file.upload.children;
        this._listenUploadEvent(input, callback);
        break;
      }
      case 'emoji': {
        break;
      }
      case 'send': {
        const {send} = this.toolbar;
        send.element.addEventListener('click', () => {
          callback(this.body.format);
        });
        break;
      }
      case 'contentChange': {
        const body = this.body;
        body.element.addEventListener('input', () => {
          callback(this.body.format);
        });
        break;
      }
      case 'pasteImage': {
        const observer = new Observer(this.preview.events);
        observer.subscribe('pasteImage', () => {
          callback(this.pasteImage);
        });
        break;
      }
      default:
        throw new Error('event is not valid');
    }
  }

  focus() {
    this.body.element.focus();
  }

  focusToLast() {
    const element = this.body.element;
    if (window.getSelection) {
      const range = window.getSelection();
      range.selectAllChildren(element);
      range.collapse(element, element.childNodes.length);
    }
  }

  getContent() {
    return this.body.format;
  }

  clearContent() {
    this.body.format = '';
    this.body.draft = '';
    this.body.element.innerHTML = '';
  }

}

HEditor.id = 0;
