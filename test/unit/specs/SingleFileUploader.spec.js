import Uploader from '@/components/Uploader.vue'
import {shallow} from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import FileUpload from '@/FileUpload'

describe('Single file uploader', () => {
  let wrapper
  let mock
  const file = new Blob(['foobar'], {type: 'text/plain'})
  file.isUploading = false
  beforeEach(() => {
    wrapper = shallow(Uploader, {
      propsData: {
        endPoint: 'localhost'
      }
    })
    mock = new MockAdapter(wrapper.vm.$http)
  })

  it('should start with an empty file list', () => {
    expect(wrapper.vm.getFiles.length).toEqual(0)
    expect(wrapper.vm.hasFiles).toBeFalsy()
  })

  it('should be single file upload by default', () => {
    expect(wrapper.vm.isSingleFileUpload).toEqual(true)
    expect(wrapper.vm.isMultipleFileUpload).toEqual(false)
  })

  it('should render correct contents', () => {
    expect(wrapper.find('input')).toBeDefined()
  })

  it('should upload a file', () => {
    mock.onPost('localhost').reply(200, {})
    wrapper.vm.addFiles([file])
    expect(wrapper.emitted().startUpload).toBeTruthy()
  })

  it('should emit fileUploaded', async () => {
    mock.onPost('localhost').reply(200, {})
    await wrapper.vm.uploadFile(new FileUpload(file)).then(() => {
      expect(wrapper.emitted().fileUploaded).toBeTruthy()
    })
  })

  it('should emit an error', async () => {
    mock.onPost('localhost').reply(500, {})
    await wrapper.vm.uploadFile(new FileUpload(file)).then(() => {
      expect(wrapper.emitted().error).toBeTruthy()
    })
  })

  it('does not upload when the uploader is disabled', () => {
    expect(wrapper.vm.upload()).toBe(false)
  })
})
