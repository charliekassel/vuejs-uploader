import FileUpload from './FileUpload'
export default class ImageUpload extends FileUpload {
  constructor (file) {
    super(file)
    this.image = null
  }
}
