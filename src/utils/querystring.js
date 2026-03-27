/**
 * 小程序路由 query 可能已解码或仍为 % 编码，统一安全解码。
 * @param {string|null|undefined} s
 * @returns {string}
 */
export function safeDecodeURIComponent(s) {
  if (s == null || s === '') return ''
  const t = String(s).trim()
  if (!t) return ''
  try {
    return decodeURIComponent(t.replace(/\+/g, ' '))
  } catch (_) {
    return t
  }
}
