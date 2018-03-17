import {Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {trigger, state, style, animate, transition,group} from '@angular/animations';
import * as moment from 'moment';
import {Events } from 'ionic-angular';
import {Platform, MenuController} from 'ionic-angular';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DateServiceProvider} from "../../providers/date-service/date-service";
import * as $ from 'jquery';
export const TIME_PICKER_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimepickerComponent),
  multi: true
};

@Component({
  selector: 'timepicker',
  templateUrl: 'timepicker.html',
  providers: [TIME_PICKER_ACCESSOR],
  animations: [
    trigger('animateState', [
      state('void', style({transform: 'translateX(0)'})),
      state('goRight', style({transform: 'translateX(100%)'})),
      state('goLeft', style({transform: 'translateX(-100%)'})),
      transition('void => goRight', animate('300ms ease-in')),
      transition('void => goLeft', animate('300ms ease-in')),
      transition('* => void', animate('0ms')),

    ]),
    trigger('pop',[
      state('pop', style({transform: 'scale(1)'})),
      state('void', style({transform: 'scale(.3)'})),
      transition('void => pop', [
        animate('100ms ease-in')]
      ),
    ]),
  ]
})



export class TimepickerComponent implements ControlValueAccessor{
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  @Output()
  dateChange: EventEmitter<string> = new EventEmitter();

  state:string='void';
  popSate:string='void';
  flexState:string='complete';
  year:number;
  month: number;
  days:any;
  p_days:any;
  n_days:any;
  activatedTimeStamp:any;
  constructor(
    public dateService:DateServiceProvider,
    public event:Events
  ) {
    let dateObj=this.dateService.getMonthDay();
    this.year=dateObj.year;
    this.month=dateObj.month;
    this.days=dateObj.days;
    this.p_days=this.dateService.getMonthDay(this.year,this.month-1).days
    this.n_days=this.dateService.getMonthDay(this.year,this.month+1).days
  }

  ngAfterContentInit(){
    this.jumpNow();
  }

  //跳到今天
  jumpNow(){
    let date=this.dateService.getNow();
    this.setActivatedDay(date);
  }

  setActivatedDay(date){
    this.popSate='void';
    var self=this;
    //判断当前月
    if(this.month!==(date.getMonth()+1)){
      //跳面板
      let dateObj=this.dateService.getMonthDay(date.getFullYear(),date.getMonth()+1);
      this.year=dateObj.year;
      this.month=dateObj.month;
      this.days=dateObj.days;
    }

    this.activatedTimeStamp=date;
    this.days.forEach(i=>{
      i.forEach(d=>{
        d.active=false;
        if(moment(self.activatedTimeStamp).format('YYYY-MM-DD') == moment(d.timeStamp).format('YYYY-MM-DD')){
          d.active=true;
        }
      })
    })
    //发射date
    this.dateChange.emit(moment(this.activatedTimeStamp).format('YYYY-MM-DD'))

    setTimeout(()=>{
      this.popSate='pop';
    },0)
  }

  swipe(e){
    if(e.deltaX<=0){
      this.jumpNext()
    }else{
      this.jumpPrev();
    }
  }

  pan(e){
    if(e.additionalEvent=='pandown'){
      this.flexState='complete'
    }else if(e.additionalEvent=='panup'){
      this.flexState='mini'
    }
    this.event.publish('pan');
  }

  jumpPrev(){
    this.state='goRight';
  }

  jumpNext(){
    this.state='goLeft';
  }

  animationDone(e){
    setTimeout(()=>{
      if(this.state=='goRight'){
        this.setActivatedDay(new Date(+this.activatedTimeStamp-this.dateService.monthDate(this.year,this.month)*24*60*60*1000));
      }else if(this.state=='goLeft'){
        this.setActivatedDay(new Date(+this.activatedTimeStamp+this.dateService.monthDate(this.year,this.month)*24*60*60*1000));
      }
      this.event.publish('pan');
      this.state="void";
      //开始pop
      this.popSate='pop';
      this.p_days=this.dateService.getMonthDay('','',new Date(+this.activatedTimeStamp-this.dateService.monthDate(this.year,this.month)*24*60*60*1000)).days;
      this.n_days=this.dateService.getMonthDay('','',new Date(+this.activatedTimeStamp+this.dateService.monthDate(this.year,this.month)*24*60*60*1000)).days;
    },100)
  }

  popDown(){
    this.popSate='void';
  }

  isHasActiveDay(week){
    for(let i=0;i<week.length;i++){
      if(week[i].active==true){
        return true;
      }
    }
    return false;
  }




}


