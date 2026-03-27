/**
 * 小程序端时间展示：后端多为 ISO-8601（含 Z、微秒），禁止用 ruoyi 旧版仅去 3 位小数的写法，否则会 Invalid Date → 0-0-0。
 * 全站展示时间请优先使用 formatDateTimeDisplay。
 */

import { parseTime as ruoyiParseTime } from '@/utils/ruoyi'

/**
 * @param {*} v 时间（字符串/数字/Date）
 * @param {string} [pattern] ruoyi 模板，默认含秒（与小程序常见展示一致）
 * @returns {string}
 */
export function formatDateTimeDisplay(v, pattern) {
  if (v == null || v === '') return ''
  const fmt = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  if (typeof v === 'object' && v !== null && typeof v.getTime === 'function') {
    return ruoyiParseTime(v, fmt) || ''
  }
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return ''
    // ISO-8601：直接交给 Date，避免 replace 破坏微秒与 Z
    if (/^\d{4}-\d{2}-\d{2}T/.test(s) || /^\d{4}-\d{2}-\d{2} /.test(s)) {
      const d = new Date(s)
      if (!Number.isNaN(d.getTime())) {
        return ruoyiParseTime(d, fmt) || s
      }
    }
  }
  const fallback = ruoyiParseTime(v, fmt)
  return fallback == null ? String(v) : fallback
}
