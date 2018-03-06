import Uploader from '@/components/Uploader.vue'
import {shallow} from '@vue/test-utils'

describe('Single file uploader', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Uploader, {
      propsData: {
        endPoint: 'localhost'
      }
    })
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
    const file = new Blob(['foobar'], {type: 'text/plain'})
    wrapper.vm.addFiles([file])
    expect(wrapper.emitted().startUpload).toBeTruthy()
  })
})
