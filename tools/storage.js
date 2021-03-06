/**
 * Created by weiwei on 11/6/18.
 */
import Tool from './tool';

/**
 * 存储类
 */
let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Storage {

    constructor() {
        if (__instance()) return __instance();

        //init

        __instance(this);
    }

    static sharedInstance() {
        return new Storage();
    }

    static getterFor(key) {
        if (Storage.sharedInstance()['_' + key] === undefined) {
            try {
                let value = wx.getStorageSync(key);
                if (value) {
                    Storage.sharedInstance()['_' + key] = value;
                }
            } catch (e) {
                Storage.sharedInstance()['_' + key] = undefined;
            }
        }
        return Storage.sharedInstance()['_' + key];
    }

    static setterFor(key, value) {
        Storage.sharedInstance()['_' + key] = undefined;
        wx.setStorageSync(key, value);
    }

    /**
     * 微信用户信息
     * @returns {undefined|*|void}
     */
    static wxUserInfo() {
        return this.getterFor('wxUserInfo');
    }

    static setWxUserInfo(wxUserInfo) {
        this.setterFor('wxUserInfo', wxUserInfo);
    }

    static currentMember(){
        return this.getterFor('currentMember');
    }

    static setCurrentMember(currentMember){
        this.setterFor('currentMember',currentMember);
    }

    //登陆标记
    static didAuthorize() {
      return this.getterFor('authorize');
    }

    static setAuthorize(didLogin) {
      this.setterFor('authorize', didLogin);
    }

    //当前登录用户Id
    static memberId() {
        return this.getterFor('memberId');
    }

    static setMemberId(memberId) {
        this.setterFor('memberId', memberId);
    }

    //系统信息
    static sysInfo() {
        return this.getterFor('sysInfo');
    }

    static setSysInfo(sysInfo) {
        this.setterFor('sysInfo', sysInfo);
    }

    // 获取 openId
    static setWxOpenid(Openid){
      this.setterFor('openid', Openid)
    }

    static getWxOpenid() {
      return this.getterFor('openid');
    }

    // 用户账号信息

    static setUserAccountInfo(info) {
      this.setterFor('userAccountInfo', info)
    }

    static getUserAccountInfo() {
      return this.getterFor('userAccountInfo');
    }

    // 存cookie

    static setUserCookie(info) {
      this.setterFor('userCookie', info)
    }
   
    static getUserCookie() {
      return this.getterFor('userCookie');
    }

    // 订单确认页面地址

    static setOrderAddress(info) {
      this.setterFor('OrderAddress', info)
    }

    static getOrderAddress() {
      return this.getterFor('OrderAddress');
    }

    // 存活动ID

    static setActivityId(info) {
      this.setterFor('activityId', info)
    }

    static getActivityId() {
      return this.getterFor('activityId');
    }

    // 存活动code

    static setActivityCode(info) {
      this.setterFor('activityCode', info)
    }

    static getActivityCode() {
      return this.getterFor('activityCode');
    }

    // orderList

    static setOrderList(info) {
      this.setterFor('orderList', info)
    }

    static getOrderList() {
      return this.getterFor('orderList');
    }

    // 存储地理定位
    
    static setLocation(info) {
      this.setterFor('userLocation', info)
    }

    static getLocation() {
      return this.getterFor('userLocation');
    }

    // 是否显示过公告了 

    static setIsShowNotice(info) {
      return this.setterFor('isShowNotice', info)
    }

    static getIsShowNotice() {
      return this.getterFor('isShowNotice')
    }
    
    // 红包数量是否大于0 

    static setRedPackageNum(info) {
      return this.setterFor('RedPackageNum', info)
    }

    static getRedPackageNum(day) {
      return this.getterFor('RedPackageNum')
    }

    // 今日弹出日历签到

    static setTodaySign(info) {
      return this.setterFor('todaySigin', info)
    }

    static getTodaySign(day) {
      return this.getterFor('todaySigin')
    }

    // 今日弹出日历签到

    static setActivityDetail(info) {
      return this.setterFor('activityDetail', info)
    }

    static getActivityDetail(day) {
      return this.getterFor('activityDetail')
    }
}