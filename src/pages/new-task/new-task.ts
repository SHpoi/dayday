import { Component } from '@angular/core';
import {
  ActionSheetController, ModalController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventTypeList} from "../../static/EventTypeList";
import {BaseUI} from "../../common/baseUI";
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import * as moment from 'moment';

/**
 * Generated class for the NewTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-task',
  templateUrl: 'new-task.html',
})
export class NewTaskPage extends BaseUI{
  eventType:any=EventTypeList[0];
  name:string='';
  startDate:string;
  endDate:string;
  typeInfo:any;
  eventTypeIcon:string=EventTypeList[0].icon;
  eventTypeIconName:string=EventTypeList[0].name;
  formModel: FormGroup;
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public actionSheetCtrl: ActionSheetController,
              public toastCtl: ToastController,
              public navParams: NavParams,
              public storage: Storage) {
    super();
    this.startDate=moment(new Date(this.navParams.get('curDate'))).format('YYYY-MM-DD');
    this.endDate=moment(+new Date(this.navParams.get('curDate'))+7*24*60*60*1000).format('YYYY-MM-DD');
    let fb = new FormBuilder();
    this.formModel = fb.group({
      name: ['', Validators.required],
      startDate: [this.startDate],
      endDate: [this.endDate],
      time: ['09:00'],
      mark: [''],
    });
  }

  ionViewDidLoad() {

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  submit(){
    if(this.formModel.valid){
      this.storage.get('taskList').then(list=>{
        // list=[];
        if(!list){
          //表示一开始任务列表没有定义
          list=[];
        }
        list.push({
          id:+new Date(),
          type:this.eventType,
          name:this.formModel.get('name').value,
          mark:this.formModel.get('mark').value,
          startDate:this.formModel.get('startDate').value,
          endDate:this.formModel.get('endDate').value,
          time:this.formModel.get('time').value,
          status:'doing'
        })
        this.storage.set('taskList',list).then(()=>{
          this.viewCtrl.dismiss();
        })
      })
    }else{
      //因为目前只有一个校验，所以可以写死
      super.showToast(this.toastCtl,'必须填写事件名称')
    }


  }


  presentActionSheet() {
    var self=this;
    this.typeInfo=EventTypeList.map((i)=>{
      return {
        text:i.name,
        icon:i.icon,
        cssClass:'event-icon-'+i.flag,
        handler:()=>{
          self.choiceEventType(i);
        }
      }
    })
    let actionSheet = this.actionSheetCtrl.create({
      cssClass:'action-sheet-md',
      title: '选择类型',
      buttons: this.typeInfo
    });
    actionSheet.present();
    //关于动画的部分都有一点的延迟
    setTimeout(()=>{
      $('html ion-action-sheet').removeClass('action-sheet-ios');
    },0)
  }

  choiceEventType(item){
    this.eventTypeIcon=item.icon;
    this.eventTypeIconName=item.name;
    this.eventType=item;
  }

}
