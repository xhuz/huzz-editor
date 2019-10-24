import './css/index.css';
import {Utils} from './utils';
import {Emoji} from './emoji';

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
      draft: '',
      format: ''
    };
    this.emoji = Emoji.getInstance();
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
      <div class="h-editor-toolbar clear-fix" style="border-top: 1px solid #ccc;">
        <div class="h-editor-emoji"><img src="./src/images/smile.png" alt=""></div>
        <div class="h-editor-image"><img src="./src/images/image.png" alt=""></div>
        <div class="h-editor-file"><img src="./src/images/folder-open.png" alt=""></div>
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
    imageEle.append(imageUpload);
    fileEle.append(fileUpload);
    this.toolbar.element = toolbar;
    this.toolbar.emoji.element = emojiEle;
    this.toolbar.image.element = imageEle;
    this.toolbar.file.element = fileEle;
    this.toolbar.image.upload = imageUpload;
    this.toolbar.file.upload = fileUpload;
    this.toolbar.send.element = sendBtnEle;
    this.body.element = body;
    this.element.append(editorEle);
  }

  _bindEvents() {
    const {emoji, image, file} = this.toolbar;
    const body = this.body;
    emoji.element.addEventListener('click', e => {
      e.stopPropagation();
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
        console.log(e);
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
      let pasteDate = clipboardData.getData("Text");
      pasteDate = pasteDate.replace(/</g, '&lt;');
      pasteDate = pasteDate.replace(/>/g, '&gt;');
      pasteDate = pasteDate.replace(/\n/g, '<br>');
      pasteDate = pasteDate.replace(/ /g, '&nbsp;');
      Utils.insertAtCursor(body.element, pasteDate, false);
    }, false);

    document.body.addEventListener('click', (e) => {
      let target = e.target;
      const isChild = this.emoji.element.contains(target);
      if (!isChild && this.emoji.isShow) {
        this.emoji.hide();
      }
    }, false);
  }

  _createUpload(id) {
    const element = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    element.style.display = 'none';
    label.setAttribute('for', `${id}-${HEditor.id}`);
    input.id = `${id}-${HEditor.id}`;
    input.type = 'file';
    element.append(label);
    element.append(input);
    return element;
  }

  _listenUploadEvent(inputElement, callback) {
    inputElement.addEventListener('change', () => {
      const files = inputElement.files.length > 0 ? inputElement.files : null;
      const f = [...files];
      inputElement.value = null;
      callback(f);
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
      default:
        throw new Error('event is not valid');
    }
  }

  getContent() {
    return this.body.format;
  }

  clearContent() {
    this.body.format = '';
    this.body.draft = '';
  }

}

HEditor.id = 0;
