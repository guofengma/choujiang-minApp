var yang_date = {
    //iyear年份
    //iMonth月份
    //that
    //iyear年份
  bulidCal: function (iYear, iMonth, that, signday, weekdays, hadWinCount, maxSign) {
    //console.log(iYear, iMonth)
    let getToday = new Date();
    let todayDate = getToday.getDate();
    let todayMonths = getToday.getMonth();
    let todayMonth = (todayMonths + 1);
    let todayYear = getToday.getFullYear();
    let todayss = getToday.getDate();
    let nowTime = todayYear + "-" + todayMonth + "-" + todayss
    let showTime = iYear + "-" + iMonth + "-"
    // console.log(nowTime)
    var that =that;
    var aMonth = new Array();
    // console.log(iMonth, todayMonth)
    aMonth[0] = new Array(7);
    aMonth[1] = new Array(7);
    aMonth[2] = new Array(7);
    aMonth[3] = new Array(7);
    aMonth[4] = new Array(7);
    aMonth[5] = new Array(7);
    var dCalDate = new Date(iYear, iMonth - 1, 1);
    var iDayOfFirst = dCalDate.getDay();
    //判断当前月份第一天周几
    var curMonthDays = new Date(dCalDate.getFullYear(), (dCalDate.getMonth()+1), 0).getDate();
    //判断当前月份有多少天
    // console.log("本月共有 "+ curMonthDays +" 天");
    // console.log("本月第一天周 "+ iDayOfFirst);
    var iDaysInMonth = (iMonth, iYear);
    var iVarDate = 1;
    var d, w;
    for (d = iDayOfFirst; d < 7; d++) {
        if(signday.indexOf(iVarDate)>-1){
            aMonth[0][d] = {
                signday:"is",
                normalday:iVarDate,
                className: 'footer-c'
            };
          if (weekdays.length>0){
              if (hadWinCount.indexOf(iVarDate) > -1) {
                aMonth[0][d].className = 'continuity-sign'
                let index = hadWinCount.indexOf(iVarDate)
                aMonth[0][d].day = maxSign[index]
                let day = maxSign[index]
                if (day == 1) {
                  aMonth[0][d].num = 1
                  aMonth[0][d].title = '首次签到'
                } else if (day == 3) {
                  aMonth[0][d].num = 2
                  aMonth[0][d].title = '连续签到3天'
                } else if (day == 7) {
                  aMonth[0][d].num = 3
                  aMonth[0][d].title = '连续签到7天'
                }
                // } else if (day ==30) {
                //   aMonth[0][d].num = 7
                //   aMonth[0][d].title = '连续签到30天'
                // } else if (day>30){
                //   aMonth[0][d].num = 7
                //   aMonth[0][d].title = '连续签到30天以上'
                // }
                // if (showTime + iVarDate == nowTime) {
                //   aMonth[0][d].className = 'haha2'
                // }
              }


            }
        }else{
            //console.log(22);
            aMonth[0][d] = {
                signday:"nois",
                normalday:iVarDate,
                className: ''
            };
          if (showTime + iVarDate == nowTime) {
            aMonth[0][d].className = 'no-qian-dao'
          }
          if (weekdays.length > 0) {
            // console.log(showTime + iVarDate, nowTime)
            if (iVarDate >= weekdays[0].date && iVarDate <= weekdays[weekdays.length - 1].date) {
              aMonth[0][d].className = 'no-footer'
            }
            if (iMonth == todayMonth) {
              // 当月漏签
              if (iVarDate > weekdays[weekdays.length - 1].date && iVarDate < todayss) {
                aMonth[0][d].className = 'no-footer'
              }
            }
            if (iMonth < todayMonth){
              //上月漏签
              if (iVarDate > weekdays[weekdays.length - 1].date) {
                aMonth[0][d].className = 'no-footer'
              }
            }
            if (showTime + iVarDate == nowTime){
              aMonth[0][d].className = 'no-qian-dao'
            }
          }
        
        }
        iVarDate++;
    }
    //处理每月第一天出现位置
    for (w = 1; w < 6; w++) {
        for (d = 0; d < 7; d++) {
            if (iVarDate <= iDaysInMonth) {
                if(signday.indexOf(iVarDate)>-1){
                    aMonth[w][d] = {
                        signday:"is",
                        normalday:iVarDate,
                          className:'footer-c'
                    };
                  if (weekdays.length > 0) {
                    if (hadWinCount.indexOf(iVarDate) > -1) {
                      aMonth[w][d].className = 'continuity-sign'
                      let index = hadWinCount.indexOf(iVarDate)
                      aMonth[w][d].day = maxSign[index]
                      let day = maxSign[index]
                      if (day == 1) {
                        aMonth[w][d].num = 1
                        aMonth[w][d].title = '首次签到'
                      } else if (day == 3) {
                        aMonth[w][d].num = 2
                        aMonth[w][d].title = '连续签到3天'
                      } else if (day == 7) {
                        aMonth[w][d].num = 3
                        aMonth[w][d].title = '连续签到7天'
                      } 
                      // else if (day==30) {
                      //   aMonth[w][d].num = 7
                      //   aMonth[w][d].title = '连续签到30天'
                      // } else if (day > 30) {
                      //   aMonth[w][d].num = 7
                      //   aMonth[w][d].title = '连续签到30天以上'
                      // }
                      
                    }
                  }
                    
                }else{
                    //console.log(22);
                    aMonth[w][d] = {
                        signday:"nois",
                        normalday:iVarDate,
                        className:''
                    };
                  if (showTime + iVarDate == nowTime) {
                    aMonth[w][d].className = 'no-qian-dao'
                  }
                  if (weekdays.length>0){
                    // 漏签
                    if (iVarDate >= weekdays[0].date && iVarDate <= weekdays[weekdays.length - 1].date) {
                      aMonth[w][d].className = 'no-footer'
                    }
                    if (iMonth == todayMonth){
                      // 当月漏签
                      if (iVarDate > weekdays[weekdays.length - 1].date && iVarDate < todayss) {
                        aMonth[w][d].className = 'no-footer'
                      }
                    }
                    if (iMonth < todayMonth) {
                      //上月漏签
                      if (iVarDate > weekdays[weekdays.length - 1].date) {
                        aMonth[w][d].className = 'no-footer'
                      }
                    }
                    //今日未签到
                    // console.log(showTime + iVarDate, nowTime)
                    if (showTime + iVarDate == nowTime) {
                      aMonth[w][d].className = 'no-qian-dao'
                    }
                  }
                  
                }
                if(iVarDate==curMonthDays){
                    that.setData({
                        signDays:aMonth,
                    });
                    return aMonth;
                }else{
                    iVarDate++;
                }
            }
        }
    }
    //处理每月其他天位置
    return aMonth;
  },
    //日历签到完成
};
module.exports = {
    yang_date: yang_date
}
