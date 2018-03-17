import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ComponentsModule } from '../components/components.module';
import { DateServiceProvider } from '../providers/date-service/date-service';
import {NewTaskPage} from "../pages/new-task/new-task";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewTaskPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp,
    //   {
    //   iconMode: 'ios',
    //   mode: 'ios'
    // }
  ),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewTaskPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DateServiceProvider,
  ]
})
export class AppModule {}
