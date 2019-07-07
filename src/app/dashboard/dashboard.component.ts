import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

declare var $:any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  @ViewChild('currTemp') tmpLabel;
  @ViewChild('currHum') humLabel;
  @ViewChild('imageViewer') image;
  @ViewChild('time') time;
  @ViewChild('person') person;
  @ViewChild('objects') objects;
  private serverUrl = 'http://192.168.1.105:8080/websocket'
  private title = 'WebSockets chat';
  private stompClient;
  private dataHumidityAndTemperature;
  private dataBrightness;

   buttonClick(){
        console.log(this.dataBrightness);
        new Chartist.Line('#chartHours', this.dataBrightness);
        var optionsSales = {
          low: 0,
          high: 100,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', this.dataBrightness, optionsSales, responsiveSales);



  }

  addTemperature(){

    //this.data.series[0].push(800);
    console.log("tmp radi")
    var options = {
      seriesBarDistance: 10,
      axisX: {
          showGrid: false
      },
      height: "245px"
  };

  var responsiveOptions: any[] = [
    ['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }]
  ];

  new Chartist.Line('#chartActivity', this.dataHumidityAndTemperature, options, responsiveOptions);
  }

  addHumidity(){
    //this.data.series[1].push(500);
    console.log("hmd radi")
    var options = {
      seriesBarDistance: 10,
      axisX: {
          showGrid: false
      },
      height: "245px"
  };

  var responsiveOptions: any[] = [
    ['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }]
  ];

  new Chartist.Line('#chartActivity', this.dataHumidityAndTemperature, options, responsiveOptions);
  }
  
    ngOnInit(){
        this.dataBrightness = {
          labels: ['01h',  '02h', '03h',  '04h',  '05h',  '06h', '07h',  '08h', '09h',  '10h',  '11h', '12h', '13h', '14h', '15h', '16h',  '17h', '18h', '19h','20h','21h','22h','23h'],
          series: [
            [0]
          ]
            
          
        };

        var optionsSales = {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false,
        };

        var responsiveSales: any[] = [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartHours', this.dataBrightness, optionsSales, responsiveSales);


         this.dataHumidityAndTemperature = {
          labels: ['01h',  '02h', '03h',  '04h',  '05h',  '06h', '07h',  '08h', '09h',  '10h',  '11h', '12h', '13h', '14h', '15h', '16h',  '17h', '18h', '19h','20h','21h','22h','23h'],
          series: [
            [0],
            [0],


          ]
          
        };
       
        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

        new Chartist.Line('#chartActivity', this.dataHumidityAndTemperature, options, responsiveOptions);

      
    }

    
    constructor(){
      this.initializeWebSocketConnection();
    }

    initializeWebSocketConnection(){
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect({}, function(frame) {
        
        that.stompClient.subscribe("/topic/messages", (message) => {
          console.log(JSON.parse(message.body), "sdsad");

          if(message.body) {
            

            that.updateData(JSON.parse(message.body));
          }
        });
        
        var message = {"data":{"motors":{"motor1":1,"motor2":null,
        "motor3":null,"motor4":null,"motor5":null,"motor6":null},"speed":5}}
        //this.send("/app/chat" , {}, JSON.stringify(message));

      });

      
    }
  
    updateData(newData){

      console.log("update", newData);
      
      if(newData.data.currentTemperature != null){

        this.tmpLabel.nativeElement.innerText="Current temperature: " + newData.data.currentTemperature;

      }

      if(newData.data.currentHumidity != null){

        this.humLabel.nativeElement.innerText="Current humidity: " + newData.data.currentHumidity;

      }
      if(newData.data.image != null){

        var date = new Date();
        this.image.nativeElement.src = newData.data.image;
        this.time.nativeElement.innerText = "Current time " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

      }
      if(newData.data.person != null){

        this.person.nativeElement.innerText = newData.data.person;

      }

      if(newData.data.objects != null){

        this.objects.nativeElement.innerText = newData.data.objects;

      }
      if(newData.data.temperatureAndHumidity != null){
        this.dataHumidityAndTemperature.series[0]=newData.data.temperatureAndHumidity[0];
        this.dataHumidityAndTemperature.series[1]=newData.data.temperatureAndHumidity[1];

        console.log("temp");

        this.addHumidity();
        this.addTemperature();

      }
      
      if(newData.data.brightness != null){
        this.dataBrightness.series[0]=newData.data.brightness;

        this.buttonClick();

        console.log("bright");

      }

    }

    sendMessage(message){
      this.stompClient.send("/app/chat" , {}, message);
    }

}
