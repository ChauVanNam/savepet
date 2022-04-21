export default class DateAndTimeUtil {
  static pad = (unit) => {
    return (unit + "").padStart(2, "0")
  }
  static getHour = (date = new Date(), pad = true) => {
    return pad ? DateAndTimeUtil.pad(date.getHours()) : date.getHours()
  }
  static getMin = (date = new Date(), pad = true) => {
    return pad ? DateAndTimeUtil.pad(date.getMinutes()) : date.getMinutes()
  }
  static getSec = (date = new Date(), pad = true) => {
    return pad ? DateAndTimeUtil.pad(date.getMinutes()) : date.getSeconds()
  }

  /**
   *
   * @param {*} date
   * @param {*} separator
   * @param {*} pad
   * @param {*} withSec
   * @returns hh[:]mm[:][ss]
   */

  static getTime = (
    date = new Date(),
    separator = ":",
    pad = true,
    withSec = false
  ) => {
    if (!date instanceof Date) date = new Date(date)

    const hour = DateAndTimeUtil.getHour(date, pad)
    const min = DateAndTimeUtil.getMin(date, pad)

    if (withSec) {
      const sec = DateAndTimeUtil.getSec(date, pad)

      return `${hour}${separator}${min}${separator}${sec}`
    }

    return `${hour}${separator}${min}`
  }

  // https://stackblitz.com/edit/date-fns-playground-ruwgbp?file=index.ts
  static getDate = (date = new Date(), format = "EEEEEE, dd/MM/yyyy") => {
    // prettier-ignore
    switch (format) {
        case "EEEEEE, dd/MM/yyyy":
          return `${DateAndTimeUtil.getDate(date, "EEEEEE")}, ${DateAndTimeUtil.getDate(date, "dd/MM/yyyy")}`
        case "E":
          return ["CN", "2", "3", "4", "5", "6", "7"][date.getDay()]
        case "EE":
          return ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"][date.getDay()]
        case "EEE":
          return `${date.getDay() > 0 ? 'Thứ ' : ''}${DateAndTimeUtil.getDate(date, "E")}`
        case "EEEEEE":
          return `${date.getDay() ? 'Th ' : ''}${DateAndTimeUtil.getDate(date, "E")}`
        case "dd":
          return DateAndTimeUtil.pad(date.getDate())
        case "MM":
          return DateAndTimeUtil.pad(date.getMonth() + 1)
        case "yyyy":
          return date.getFullYear()
        case "dd/MM/yyyy":
          return `${DateAndTimeUtil.getDate(date, "dd")}/${DateAndTimeUtil.getDate(date, "MM")}/${DateAndTimeUtil.getDate(date, "yyyy")}`
        default:
      }
  }

  static roundUpTime(date = new Date()) {
    if (date === null) return null
    if (!(date instanceof Date)) date = new Date(date)
    const mins = date.getMinutes()
    const lastNumber = mins % 10
    const mod = 5
    date.setMinutes(mins + ((mod - lastNumber + mod) % mod))
    return date
  }

  static veryPowerfulRoundUpTime(date = new Date(), minsRoundUp = 15) {
    if (!(date instanceof Date)) date = new Date(date)
    const mins = date.getMinutes()
    const lastNumber = mins
    const mod = minsRoundUp
    date.setMinutes(mins + ((mod - lastNumber + 60 * mod) % mod))
    return date
  }
}
