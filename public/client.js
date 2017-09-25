'use strict';

var JAR_Client_ctor = function () {
    var self = this;
    self.chkclientstatuses = document.getElementsByClassName('chkclientstatus');
    self.chkclientFWD = document.getElementById('chkclientFWD');
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
    self.SetNo = function (itag) {
        itag.innerText = 'check_box_outline_blank';
    };
    self.SetMaybe = function (itag) {
        itag.innerText = 'indeterminate_check_box';
    };
    self.SetYes = function (itag) {
        itag.innerText = 'check_box';
    };
    self.Reset = function () {
        self.uncheckallstatuses();
    };
    self.ws = null;
    self.Connect = function () {
        self.Reset();
        self.xhr = new XMLHttpRequest();
        self.xhr.open('GET', 'api', true);
        self.SetMaybe(self.chkclientFWD);
        self.xhr.responseType = 'json';
        self.xhr.onload = function (sender, ev) {
            if (self.xhr.status == 200) {
                self.SetYes(self.chkclientFWD);
                var jresp = self.xhr.response;

                var wsurl = ('https:' == document.location.protocol ? 'wss:' : 'ws:') + '//' + document.location.host + '/ws/?room=' + jresp.room;
                if (typeof (self.ws) == 'object' && self.ws != null)
                    self.ws.close();
                self.ws = new WebSocket(wsurl);
                self.ws.addEventListener('open', self.wsopen);
                self.ws.addEventListener('message', self.wsmessage);
                self.ws.addEventListener('close', self.wsclose);
                self.ws.addEventListener('error', self.wserror);
            }
        };
        self.xhr.send();

    };

    self.wsopen = function wsopen(ev) {
        self.SetYes(self.chkclientCTS);
        self.ws.send(JSON.stringify({
            action: 'query',
            query:'clientconnected'
        }));
    };
    self.wsmessage = function wsopen(ev) {
        var jmsg = JSON.parse(ev.data);
        switch (jmsg.action) {
        case 'notice':
            switch (jmsg.notice) {
            case 'clientconnected':
                self.SetYes(self.chkclientSWC);
                break;

            default:
                break;
            }
            break;

        default:
            break;
        }
    };
    self.wsclose = function wsopen(ev) {
        self.SetNo(self.chkclientCTS);
    };
    self.wserror = function wsopen(ev) {

    };
};

var JAR_Client = new JAR_Client_ctor();