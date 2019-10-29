export class Utils {

  /**
   * contenteditable输入框插入内容（表情、粘贴文本等）
   * @param {Element} field - dom element
   * @param {string} value - 需要插入的内容
   * @param {boolean} selectPastedContent - 选中内容还是开始点和结束点一致
   */
  static insertAtCursor(field, value, selectPastedContent) {
    let sel;
    let range;
    field.focus();
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        let el = document.createElement('div');
        el.innerHTML = value;
        let frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        let firstNode = frag.firstChild;
        range.insertNode(frag);
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          if (selectPastedContent) {
            range.setStartBefore(firstNode);
          } else {
            range.collapse(true);
          }
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  static previewImage(field, file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      field.src = e.target.result;
    }
  }
}


export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  addListener(type, callback) {
    this._listeners.has(type) || this._listeners.set(type, []);
    this._listeners.get(type).push(callback);
    return this;
  }

  removeListener(type, callback) {
    const listeners = this._listeners.get(type);
    const index = listeners.findIndex((listener) => {
      return listener === callback;
    });

    if (index > -1) {
      listeners.splice(index, 1);
    }

    return this;
  }

  emit(type, ...args) {
    const listeners = this._listeners.get(type);
    if (listeners && listeners.length) {
      listeners.forEach(listener => {
        listener(...args);
      });
    }
    return this;
  }
}

export class Observer {
  constructor(subject) {
    this.subject = subject;
  }

  subscribe(type, callback) {
    this.subject.addListener(type, callback);
  }
}
