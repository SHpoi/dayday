import { Component, Input} from '@angular/core';
import {AlertController, ModalController, ToastController} from "ionic-angular";
import {NewTaskPage} from "../../pages/new-task/new-task";
import { Storage } from '@ionic/storage';
import {BaseUI} from "../../common/baseUI";



/**
 * Generated class for the TaskListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'task-list',
  templateUrl: 'task-list.html'
})
export class TaskListComponent extends BaseUI{
  @Input('date')
  date:string;
  taskList:any;
  filterSuccess:boolean=true;
  constructor(
    public modalCtrl: ModalController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtl: ToastController,
  ) {
    super();
    this.loadList();
  }

  newTask(){
    let modal = this.modalCtrl.create(NewTaskPage,{curDate:this.date});
    modal.onDidDismiss(()=>{
      this.loadList();
    })
    modal.present();
  }

  loadList(){
    this.storage.get('taskList').then((list)=>{
      console.log(list);
      let curTimeStamp=+new Date(this.date);
      if(list==null) {
        this.taskList=[];
        return;
      }
      this.taskList=list.filter(i=>{
        if(+new Date(i.startDate)<=curTimeStamp && (+new Date(i.endDate)+24*60*60*1000)>curTimeStamp){
          return true;
        }else{
          return false;
        }
      }).sort((a,b)=>{
        return +new Date(a.startDate+' '+a.time) >= + new Date(b.startDate+' '+b.time);
      })
    })
  }

  swipe(e,item){
    if(e.deltaX<=0){
      //删除
      this.presentDelConfirm(item);
    }else{
      //完成
      this.completeTask(item);
    }
  }


  presentDelConfirm(item) {
    let alert = this.alertCtrl.create({
      title: '警告',
      message: '确定删除 '+item.name+' 这条任务吗?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: '确定',
          handler: () => {
            this.storage.get('taskList').then((list)=>{
              for(let i=0;i<list.length;i++){
                if(list[i].id==item.id){
                  list.splice(i,1)
                }
              }
              this.storage.set('taskList',list).then(()=>{
                this.showToast(this.toastCtl,'删除任务成功',{
                  cssClass: 'urgent-delete',
                });
                this.loadList();
              })
            })
          }
        }
      ]
    });
    alert.present();
  }

  completeTask(item){
    this.storage.get('taskList').then((list)=>{
      for(let i=0;i<list.length;i++){
        if(list[i].id==item.id){
          list[i].status='success';
        }
      }
      //保存任务列表
      this.storage.set('taskList',list).then(()=>{
        this.showToast(this.toastCtl,'完成任务 '+item.name,{
          cssClass: 'urgent-success',
        });
        this.loadList();
      })
    })
  }



}
