class Hide {
  constructor (el, rows = 3, addedStr = '...那是真的牛批') {
    el = typeof el === 'string' ? document.querySelector(el) : el
    if (!el ||
      el.childNodes.length !== 1 ||
      el.firstChild.nodeType !== 3 ||
      rows < 1
    ) return
    this.el = el
    this.rows = rows
    this.addedStr = addedStr
    this.oneRowHeight =
    this.height =
    this.cacheText =
    this.maxRows =
    this.lens =
    this.simDom = null
    this.getSimDom()
    this.getSimDomHeight()
    this.targetLen = this.getRightLength()
    this.removeSimDom()
    this.addedHandleTag()
  }
  addedHandleTag (len) {
    const { el, targetLen, addedStr } = this
    el.textContent = this.cacheText.slice(0, targetLen)
    const tag = document.createElement('a')
    tag.textContent = addedStr
    el.appendChild(tag)
  }
  getSimDom (el = this.el) {
    const simDom = this.simDom = el.cloneNode(true)
    const width = this.getStyle(el, 'width')
    console.log('width:', width)
    simDom.style.width = width + 'px'
    simDom.style.display = 'block'
    simDom.style.position = 'absolute'
    simDom.style.top = '-9999px'
    el.insertAdjacentElement('beforebegin', simDom)
    return simDom
  }
  removeSimDom () {
    const {simDom} = this
    if (simDom.parentElement) {
      simDom.parentElement.removeChild(simDom)
    }
  }
  getSimDomHeight () {
    if (!this.simDom) this.simDom = this.getSimDom()
    const {simDom} = this
    const cacheText = this.cacheText = simDom.textContent
    this.lens = cacheText.length
    this.height = parseFloat(this.getStyle(simDom))
    simDom.textContent = 'a'
    this.oneRowHeight = parseFloat(this.getStyle(simDom))
    this.maxRows = ~~(this.height / this.oneRowHeight)
    simDom.textContent = cacheText
  }

  getStyle (el, styleName = 'height') {
    try {
      return el.getBoundingClientRect()[styleName] || window.getComputedStyle(el)[styleName]
    } catch (error) {
      return el.style[styleName]
    }
  }

  getRightLength () {
    const ceil = Math.ceil
    const {maxRows, rows, lens} = this
    let start = ~~((rows - 1) / maxRows * lens)
    let end = ceil((rows + 1) / maxRows * lens)
    let mid = ceil(end / 2 + start / 2)
    let tempStartStr = this.insertTextsAndGetRows(mid)
    let tempEndStr = this.insertTextsAndGetRows(mid + 1)
    while (
      tempStartStr === tempEndStr
    ) {
      if (tempStartStr <= rows) {
        start = mid
      } else {
        end = mid
      }
      mid = ceil(end / 2 + start / 2)
      tempStartStr = this.insertTextsAndGetRows(mid)
      tempEndStr = this.insertTextsAndGetRows(mid + 1)
    }
    return mid
  }

  insertTextsAndGetRows (len) {
    const {simDom, cacheText, oneRowHeight} = this
    simDom.textContent = cacheText.slice(0, len) + this.addedStr
    return ~~(this.getStyle(simDom) / oneRowHeight)
  }
}

// const a = new Hide('.niupi', 1)
// console.log(a)
