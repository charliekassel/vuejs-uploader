export default {
  /**
   * Formats bytes to human string
   * @see https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable#answer-20463021
   * @param  {Number} a
   * @param  {[type]} b
   * @param  {[type]} c
   * @param  {[type]} d
   * @param  {[type]} e
   * @return {String}
   */
  fileSize (a, b, c, d, e) {
    const size = (b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) +
      ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
    return size
  },

  /**
   * Extract the extension from a filename
   *
   * @param  {String} filename
   * @return {String}
   */
  fileExtension (filename) {
    return filename ? filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2) : ''
  }
}
