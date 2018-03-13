import Uploader from '@/components/Uploader.vue'
import {shallow} from '@vue/test-utils'
// import MockAdapter from 'axios-mock-adapter'

describe('Multi file uploader', () => {
  let wrapper
  // let mock
  beforeEach(() => {
    wrapper = shallow(Uploader, {
      propsData: {
        endPoint: 'localhost',
        multiple: true
      }
    })
    // mock = new MockAdapter(wrapper.vm.$http)
  })

  it('should render a list of files to be uploaded', () => {
    const file1 = new Blob(['foobar'], {type: 'text/plain'})
    const file2 = new Blob(['foobar'], {type: 'text/plain'})
    file1.name = 'file1'
    file2.name = 'file2'
    wrapper.vm.addFiles([file1, file2])
    expect(wrapper.find('.vuejs-uploader__queue')).toBeDefined()
    wrapper.update()
    expect(wrapper.findAll('.vuejs-uploader__file')).toHaveLength(2)
  })

  it('should clear the file list', () => {
    const file1 = new Blob(['foobar'], {type: 'text/plain'})
    const file2 = new Blob(['foobar'], {type: 'text/plain'})
    file1.name = 'file1'
    file2.name = 'file2'
    wrapper.vm.addFiles([file1, file2])
    expect(wrapper.find('.vuejs-uploader__queue')).toBeDefined()
    wrapper.vm.clear()
    wrapper.update()
    expect(wrapper.findAll('.vuejs-uploader__file')).toHaveLength(0)
  })

  it('should set a message when more than files than maxUploads are added to the filelist', () => {
    wrapper.setProps({
      maxUploads: 2
    })
    expect(wrapper.vm.errorMessage).toBeFalsy()
    wrapper.vm.addFiles([{name: 'abc.jpg'}, {name: 'def.jpg'}, {name: 'ghi.jpg'}])
    expect(wrapper.vm.errorMessage).toBeTruthy()
  })
})
