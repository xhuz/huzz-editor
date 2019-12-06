import './css/scrollbar.css';

export class ScrollBar {
  constructor(element) {
    this.wrap = element;
    this.scrollbar = null;
    this._init();
    this._bindEvents();
    this._updateThumb();
  }

  _init() {
    const scrollbar = this.scrollbar = document.createElement('div');
    const thumb = document.createElement('div');
    scrollbar.className = 'h-scrollbar-bar';
    thumb.className = 'h-scrollbar-thumb';
    scrollbar.appendChild(thumb);
    const gutter = this._getScrollbarWidth();
    if (gutter) {
      this.wrap.style.marginRight = `-${gutter}px`;
    }

    this.wrap.classList.add('h-scrollbar');
  }

  _bindEvents() {
    this.wrap.addEventListener('scroll', e => {
      const moveY = this.wrap.scrollTop * 100 / this.wrap.clientHeight;
      const [thumb] = this.scrollbar.children;
      thumb.style.transform = `translateY(" + ${moveY} + "%)`;
    });

    this.scrollbar.addEventListener('click', e => {
      const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY);
      const thumbHalf = thumb.offsetHeight / 2;
      const thumbPositionPercentage = (offset - thumbHalf) * 100 / wrap.offsetHeight;
      this.wrap.scrollTop = (thumbPositionPercentage * wrap.scrollHeight / 100);
    });
  }

  _getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.width = '100px';
    outer.style.visibility = 'hidden';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";

    const inner = document.createElement('div');
    inner.style.width = '100px';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentElement.removeChild(outer);
    return widthNoScroll - widthWithScroll;

  }

  _updateThumb() {
    const [thumb] = this.scrollbar.children;
    const heightPercentage = (this.wrap.clientHeight * 100 / this.wrap.scrollHeight);
    thumb.style.height = heightPercentage + "%";
  }
}
