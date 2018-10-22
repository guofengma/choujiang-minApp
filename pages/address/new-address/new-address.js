let { Tool, RequestFactory, Event } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    line:true,
    disabled:false,
    content:'', // 所在区域拼接结果
    navbar:['新增地址','修改地址'],
    addressType:0, // 1新建地址 2修改地址
    region:[],// 省市区的数组
    isChoose:false, // 是否选择为默认地址
    door:1, // 1常规 2 朵地址
    hidden:false // 解决层级问题
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    wx.setNavigationBarTitle({
      title: this.data.navbar[options.type-1]
    })
    if (options.address){
      this.getEditAddressList(JSON.parse(options.address))
    }
    this.setData({
      addressType: options.type || '',
      door: options.door || '',
    })
  },
  getEditAddressList(address){
    let region = []
    region[0] = { name: address.province_code}
    region[1] = { name: address.area_code }
    region[2] = { name: address.city_code, }
    this.setData({
      content: address.province_code + address.area_code + address.city_code,
      address: address,
      region: region
    })
  },
  pickerClicked(e) {
    let region = e.detail.result
    let content = []
    if (region.length>0){
      content = region[0].name + region[1].name + region[2].name
    }
    this.setData({ 
      content: content,
      region: region,
      hidden: e.detail.hidden
    })
    if (e.detail.btnType == 2) {
      // this.updateDealerRegion(e)
    }
  },
  formSubmit(e){
    let params = e.detail.value
    if (!Tool.checkName(params.receiver)) {
      Tool.showAlert("收货人姓名长度需在2-16位之间");
      return
    }
    if (!Tool.checkPhone(params.recevicePhone)) {
      Tool.showAlert("请输入正确的电话号码");
      return
    }
    if (this.data.region.length == 0) {
      Tool.showAlert("请选择你所在的省市区");
      return
    } else{
      if (this.data.region[0]) {
        params.provinceCode = this.data.region[0].name;
      }
      if (this.data.region[1]) {
        params.cityCode = this.data.region[1].name;
      }
      if (this.data.region[2]) {
        params.areaCode = this.data.region[2].name;
      }
    }
    if (Tool.isEmptyStr(params.address)) {
      Tool.showAlert("请输入详细地址");
      return
    }
   
    if (this.data.addressType==1){
      params.defaultStatus = this.data.isChoose ? 1 : 2
    } else if (this.data.addressType == 2){
      params.id = this.data.address.id
    }
    this.requestAddUserAddress(params)
  },
  requestAddUserAddress(params) {
    let r =''
    if (this.data.addressType == 1) {
      r = RequestFactory.addUserAddress(params);
    } else if (this.data.addressType == 2) {
      r = RequestFactory.updateUserAddress(params);
    }
    this.setData({
      disabled:true
    })
    r.finishBlock = (req) => {
      //跳转到地址列表页面
      this.successCallBack("添加成功")

    };
    // r.completeBlock = (req) => {
    //   this.setData({
    //     disabled: false
    //   })
    // };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  deleteAddress(e) {
    let callBack = () => {
      let r = RequestFactory.deleteUserAddress({ id: this.data.address.id });
      r.finishBlock = (req) => {
        this.successCallBack("删除成功")
        Event.emit('updateAdressList')
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    Tool.showComfirm('确认删除该地址吗?', callBack)
  },
  chooseClicked(){
    this.setData({
      isChoose: !this.data.isChoose
    })
  },
  successCallBack(title) {
    Event.emit('updateAdressList');//发出通知
    let callBack = () => {
      Tool.navigationPop()
    }
    Tool.showSuccessToast(title, callBack)
  }  
})