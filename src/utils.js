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
}
