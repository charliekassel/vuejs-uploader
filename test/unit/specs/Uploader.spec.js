import Vue from 'vue'
import Uploader from '@/components/Uploader.vue'

describe('Uploader.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Uploader)
    const vm = new Constructor({
      propsData: {
        endPoint: 'http://localhost'
      }
    }).$mount()
    expect(vm.$el.querySelector('input'))
      .to.be.defined
  })
})
