import './css/at.css';
import '../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import {EventEmitter, Observer} from './utils';
import PerfectScrollbar from 'perfect-scrollbar';

export class At {
  constructor(element, options) {
    const defaults = {
      at: '@',
      data: [
        {id: 1, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''},
        {id: 2, nickname: 'huzz', avatar: ''}
      ]
    }
    this.options = options ? Object.assign({}, defaults, options) : defaults;
    this.element = null;
    this.events = new EventEmitter();
    this.activeItem = 0;
    this.isShow = false;
    this._init();
    this._bindEvents();
  }

  _init() {
    const element = this.element = document.createElement('div');
    let html = '';
    for (const item of this.options.data) {
      if (item.avatar) {
        html += `
        <div class="h-editor-at-item clear-fix">
          <div class="h-editor-at-avatar">
            <img src="${item.avatar}">
          </div>
          <div class="h-editor-at-nickname">
            ${item.nickname}
          </div>
        </div>`;
      } else {
        html += `<div class="h-editor-at-item">${item.nickname}</div>`;
      }
    }
    element.className = 'h-editor-at';
    element.innerHTML = html;

    const childrenEle = element.children;
    if (childrenEle.length > 0) {
      childrenEle[0].classList.add('h-editor-at-item-active');
    }
    new PerfectScrollbar(element);
  }

  _bindEvents() {
    this.element.addEventListener('mouseover', e => {
      const items = this.element.children;
      let target = e.target;
      while (target && !target.classList.contains('h-editor-at-item')) {

        target = target.parentElement;
        if (target === this.element) {
          target = null;
          break;
        }
      }

      if(target) {
        Array.prototype.forEach.call(items, (ele, index) => {
          if (ele.classList.contains('h-editor-at-item-active')) {
            ele.classList.remove('h-editor-at-item-active');
          }

          if (ele === target) {
            this.activeItem = index;
          }
        });
      }

    }, false);
    this.element.addEventListener('mouseout', e => {
      let target = e.target;
      if (target)
      while (target && !target.classList.contains('h-editor-at-item')) {

        target = target.parentElement;
        if (target === this.element) {
          target = null;
          break;
        }
      }

      if (target) {
        target.classList.add('h-editor-at-item-active');
      }
    }, false);

    document.addEventListener('keydown', e => {
      if (!this.isShow) {
        return;
      }
      e.stopPropagation();
      console.log(e);
    }, false);

    // const observer = new Observer(this.events);
    // observer.subscribe('show', element => {
    //   this._show(element);
    // });
    // observer.subscribe('close', () => {
    //   this._hide();
    // });
  }

  show(element) {
    this.isShow = true;
    element.appendChild(this.element);
  }

  hide() {
    this.isShow = false;
    this.element.parentElement.removeChild(this.element);
  }

}
