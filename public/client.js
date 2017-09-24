'use strict';

var JAR_Client_ctor = function () {
    var self = this;
    self.chkclientstatuses = document.getElementsByClassName('chkclientstatus');
    self.chkclientCTS = document.getElementById('chkclientCTS');
    self.chkclientFLP = document.getElementById('chkclientFLP');
    self.chkclientTTLY = document.getElementById('chkclientTTLY');
    self.chkclientSWC = document.getElementById('chkclientSWC');
    self.chkclientR = document.getElementById('chkclientR');
    self.uncheckallstatuses = function () {
        for (var index = 0; index < self.chkclientstatuses.length; index++) {
            var element = self.chkclientstatuses[index];
            self.SetNo(element);
        }
    };
    self.SetNo = function(itag){
        itag.innerText = 'check_box_outline_blank';
    };
    self.SetMaybe = function(itag){
        itag.innerText = 'indeterminate_check_box';
    };
    self.SetYes = function(itag){
        itag.innerText = 'check_box';
    };
    self.Reset = function (){
        self.uncheckallstatuses();
    };
    self.ws = null;
    self.Connect = function (){
        self.Reset();
        var wsurl = ('https:'==document.location.protocol?'wss:':'ws:')+'//'+ document.location.host + '/ws/';
        self.ws = new WebSocket(wsurl);
        self.ws.addEventListener('open',self.wsopen);
        self.ws.addEventListener('message',self.wsmessage);
        self.ws.addEventListener('close',self.wsclose);
        self.ws.addEventListener('error',self.wserror);
    };

    self.wsopen=function wsopen(ev){
        self.SetYes(self.chkclientCTS);
        
    };
    self.wsmessage=function wsopen(ev){
        
    };
    self.wsclose=function wsopen(ev){
        self.SetNo(self.chkclientCTS);
    };
    self.wserror=function wsopen(ev){
        
    };
};

var JAR_Client = new JAR_Client_ctor();