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
    container.id = 'h-editor-emoji';
  }

  show(filed, position) {
    const winH = window.innerHeight;
    this.isShow = true;
    filed.append(this.element);
    if (position.y > winH / 2) {

    } else {
      this.element.style.top = '20px';
    }

  }

  hide() {
    this.isShow = false;
    this.element.parentElement.removeChild(this.element);
  }
}

Emoji.emoji = '😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 🥰 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 🥵 🥶 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🥳 🥴 🥺 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🦝 🐻 🐼 🦘 🦡 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐶'
Emoji.instance = null;
