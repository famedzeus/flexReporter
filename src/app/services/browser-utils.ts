
export const isIEandLT11 = ('ActiveXObject' in window)

export const invokeNonIE = (fn) => {
  if (!isIEandLT11) {
    fn()
  }
}

export const triggerResize = () => {
  const event = window.document.createEvent('UIEvents')
  event.initUIEvent('resize', true, false, window, 0)
  window.dispatchEvent(event)
}

export const triggerAsyncResize = (ms = 0) => setTimeout(triggerResize, ms)

/**
 * Get bound offset of an element in reference to target element regexp
 * @param target
 * @param targetRegEx
 * @param first
 */
export const getBoundOffset = (target, targetRegEx: RegExp, first = null): { x: number, y: number } => {
  if (first === null) {
    return getBoundOffset(target.offsetParent, targetRegEx, target.getBoundingClientRect())
  }

  if (target.tagName.match(targetRegEx) || target.offsetParent === null) {
    const rect = target.getBoundingClientRect()
    return {
      x: first.left - rect.left,
      y: first.top - rect.top
    }
  }

  return getBoundOffset(target.offsetParent, targetRegEx, first)
}
