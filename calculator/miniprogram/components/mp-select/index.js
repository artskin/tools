Component({
  properties: {
    value: {
      type: Array,
      value: []
    },
    range: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: 'select'
    },
    require: {
      type: Boolean,
      value: false
    }
  },
  data: {
    curValue: [],
    curRange: [],
  },
  ready() {
    this.setData({
      curValue: this.properties.value
    })

    const curRange = this.properties.range

    this.changeSelected(curRange)

    // 单选必填默认值
    if (this.properties.type !== 'multiple' && this.properties.require && (!this.properties.value || this.properties.value.length === 0 || !this.properties.value[0])) {
      const initValue = {}
      initValue.value = this.properties.range[0].value
      this.selectItem(null, initValue)
    }
  },
  methods: {
    selectItem(e, scrollValue) {
      const {value} = e ? e.currentTarget.dataset : scrollValue
      let {curValue} = this.data

      if (this.properties.type === 'multiple') {
        if (curValue.indexOf(value) >= 0) {
          curValue.splice(curValue.indexOf(value), 1)
        } else {
          curValue.push(value)
        }
      } else {
        curValue = [value]
      }

      this.setData({
        curValue
      })

      this.changeSelected()
    },
    changeSelected(range) {
      const curRange = range || this.data.curRange
      const {curValue} = this.data

      curRange.map(item => {
        if (curValue.indexOf(item.value) >= 0) {
          item.selected = true
        } else {
          item.selected = false
        }
        return item
      })

      this.setData({
        curRange
      })
    },
    save() {
      this.triggerEvent('saveevent', {
        value: this.data.curValue
      })
    },
    cancel() {
      this.triggerEvent('cancelevent', {
      })
    },
    bindChange(e) {
      if (this.properties.type === 'checkbox') {
        this.setData({
          curValue: e.detail.value
        })
        this.changeSelected()
      } else if (this.properties.type !== 'multiple') {
        const scrollValue = {}
        scrollValue.value = this.properties.range[e.detail.value[0]].value
        this.selectItem(null, scrollValue)
      }
    }
  }
})
