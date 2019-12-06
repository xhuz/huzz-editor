import './css/emoji.css';

export class Emoji {
  constructor() {
    this.element = null;
    this.isShow = false;
    this._init();
  }

  static getInstance() {
    if (!Emoji.instance) {
      Emoji.instance = new Emoji();
    }
    return Emoji.instance;
  }

  _init() {
    const col = 15;
    const container = this.element = document.createElement('table');
    const emojiMap = Emoji.emoji.split(' ');
    const row = Math.ceil(emojiMap.length / col);
    let html = '';
    for (let i = 0; i < row; i ++) {
      let tr = '<tr>';
      const tmp = emojiMap.slice(i * col, col * (i + 1));
      for (const t of tmp) {
        tr += `<td>${t}</td>`;
      }
      tr += '</tr>';
      html += tr;
    }
    container.innerHTML = html;
    container.className = 'h-editor-emoji-panel';
  }

  selected(callback) {
    const td = this.element.querySelectorAll('td');
    td.forEach(ele => {
      ele.addEventListener('click', e => {
        callback(e.target.innerHTML);
        this.hide();
      });
    });
  }

  show(filed, position) {
    const winH = window.innerHeight;
    this.isShow = true;
    filed.appendChild(this.element);
    if (position.y > winH / 2) {
      this.element.style.top = 'auto';
      this.element.style.bottom = '50px';
      this.element.classList.add('h-editor-emoji-panel-arrow-bottom');
    } else {
      this.element.style.top = '50px';
      this.element.classList.add('h-editor-emoji-panel-arrow-top');
    }

  }

  hide() {
    this.isShow = false;
    this.element.parentElement.removeChild(this.element);
  }
}

Emoji.emoji = '😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 🥰 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 🥵 🥶 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🥳 🥴 🥺 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🦝 🐻 🐼 🦘 🦡 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐶'
Emoji.instance = null;
