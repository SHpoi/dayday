import { Injectable } from '@angular/core';

/*
  Generated class for the DateServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DateServiceProvider {

  constructor() {
    console.log('Hello DateServiceProvider Provider');
  }

  getNow(){
    return new Date();
  }

  /**
   * 根据年月获取
   * @param year
   * @param month
   * @returns {{year: any; month: any; days: Array}}
   */
  getMonthDay(year?,month?,dateObj?:any){
    let ret=[];
    let today;
    if(!year||!month){
      if(dateObj){
        today= new Date(dateObj.setHours(0,0,0,0));
      }else{
        today=new Date();
      }
      year=today.getFullYear();
      month=today.getMonth()+1;
    }
    let firstDay=new Date(year,month-1,1);
    let firDayWeekDay=firstDay.getDay();//获取当月1号的星期0~6

    year=firstDay.getFullYear();
    month=firstDay.getMonth()+1;

    let lastDayOfLastMonth=new Date(year,month-1,0);//上个月的最后一天
    let lastDateOfLastMonth=lastDayOfLastMonth.getDate();//上月最后一天日期1~31
    let preMonthDayCount=firDayWeekDay;
    let lastDay=new Date(year,month,0);//本月最后一天
    let lastDate=lastDay.getDate();//本月最后一天日期1~31

    for(let i=0;i<7*6;i++){
      let date=i+1-preMonthDayCount;
      let showDate=date;
      let thisMonth=month;
      let thisYear=year;
      let prevMonth=false;
      let nextMonth=false;
      //上一个月
      if(date<=0){
        thisMonth=month-1;
        showDate=lastDateOfLastMonth+date;
        prevMonth=true;
      }else if(date>lastDate){
        //    下一个月
        thisMonth=month+1;
        showDate=showDate-lastDate;
        nextMonth=true;
      }
      if(thisMonth==0){
        thisMonth=12;
        thisYear-=1;
      }
      if(thisMonth==13){
        thisMonth=1;
        thisYear+=1;
      }
      ret.push({
        year:thisYear,
        month:thisMonth,
        active:+new Date(thisYear,thisMonth-1,date)==+today,
        date:date,
        timeStamp:new Date(thisYear,thisMonth-1,date),
        showDate:showDate,
        nextMonth:nextMonth,
        prevMonth:prevMonth
      });
    }
    let weekArr=[];
    let century=Math.ceil(ret.length/7);
    for(let i=0;i<century;i++){
      let weekItem=[];
      for(let j=0;j<ret.length;j++){
        if(Math.floor(j/7)==i){
          weekItem.push(ret[j])
        }
      }
      weekArr.push(weekItem);
    }
    return {
      year:year,
      month:month,
      days:weekArr
    };
  }

  /**
   * 拿到月份有多少天
   * @param year
   * @param month (month是加1后的)
   * @returns {number}
   */
  monthDate(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
  }
}
