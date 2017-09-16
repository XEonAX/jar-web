/* jshint browser: true */
'use strict';

var JAR_Client_ctor = function () {
    var self = this;
    self.chkclientstatuses = document.getElementsByClassName('chkclientstatus');
    
    self.uncheckallstatuses = function () {
        for (var index = 0; index < self.chkclientstatuses.length; index++) {
            var element = self.chkclientstatuses[index];
            element.innerText = 'check_box_outline_blank';
        }
    };

    self.Reset = function (){
        self.uncheckallstatuses();
    };
    self.ws = null;
    self.Connect = function (){
        self.Reset();
        var wsurl = ('https:'==document.location.protocol?'wss:':'ws:')+'//'+ document.location.host + '/ws/';
        var ws = new WebSocket(wsurl);
        ws.addEventListener('open',self.wsopen);
        ws.addEventListener('message',self.wsmessage);
        ws.addEventListener('close',self.wsclose);
        ws.addEventListener('error',self.wserror);
        
    };
};


var JAR_Client = new JAR_Client_ctor();