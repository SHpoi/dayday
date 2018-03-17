import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Events} from 'ionic-angular';
import * as $ from 'jquery';
import {TaskListComponent} from "../../components/task-list/task-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  date:string;
  @ViewChild('timepicker')
  timepicker: ElementRef;

  @ViewChild('tasklist')
  tasklist: TaskListComponent;

  constructor(
    public navCtrl: NavController,
    public event:Events) {
  }

  ionViewDidLoad(){
    this.caculatePadding();
    this.event.subscribe('pan',()=>{
      setTimeout(()=>{
        this.caculatePadding();
      },100)

    })
  }



  caculatePadding(){
    var list=$('task-list ion-list');
    var pickerHeight=$('timepicker').height();
    list.animate({'marginTop':pickerHeight+'px'},100,'linear');
    list.height(($('html').height()-pickerHeight)+'px');
  }

  getChoicedDate(e){
    this.date=e;
    this.tasklist.loadList();
  }




}
