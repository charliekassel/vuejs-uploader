import Vue from 'vue'
import Uploader from '@/components/Uploader.vue'

function getVM (propsData = {}) {
  const Constructor = Vue.extend(Uploader)
  if (!propsData.endPoint) {
    propsData = {
      ...propsData,
      endPoint: 'http://localhost'
    }
  }
  return new Constructor({propsData: propsData}).$mount()
}

describe('Uploader.vue', () => {
  describe('default state', () => {
    const vm = getVM()
    it('should start with an empty file list', () => {
      expect(vm.getFiles.length).to.equal(0)
    })
    it('should start with upload button disabled', () => {
      expect(vm.isDisabled).to.be.true
    })
    it('should be single file upload by default', () => {
      expect(vm.isSingleFileUpload).to.be.true
      expect(vm.isMultipleFileUpload).to.be.false
    })
  })
  describe('default render', () => {
    describe('single file', () => {
      it('should render correct contents', () => {
        const vm = getVM()
        expect(vm.$el.querySelector('input')).to.be.defined
      })
    })
  })
})
