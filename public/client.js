'use strict';

var JAR_Client_ctor = function () {
    var self = this;
    self.chkclientstatuses = document.getElementsByClassName('chkclientstatus');
    self.chkclientFCD = document.getElementById('chkclientFCD');
    self.chkclientCTS = document.getElementById('chkclientCTS');
    self.chkclientTTLC = document.getElementById('chkclientTTLC');
    self.chkclientSWC = document.getElementById('chkclientSWC');
    self.ClientLauncher = document.getElementById('ClientLauncher');
    self.identidiv = document.getElementById('identidiv');
    self.identiCard = document.getElementById('identiCard');
    self.ConnectedSections = document.getElementById('ConnectedSections');
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
    self.IsYes = function (itag) {
        return itag.innerText == 'check_box';
    };
    self.Reset = function () {
        self.uncheckallstatuses();
    };
    self.ws = null;
    self.LaunchClient = function () {
        var protoUrl = self.jresp.protocol + '//' + ('https:' == document.location.protocol ? 'wss:' : 'ws:') + '//' + document.location.host + '/' + self.jresp.ctoken;

        try {
            self.SetMaybe(self.chkclientTTLC);
            self.ClientLauncher.contentWindow.location.href = protoUrl;
            self.SetYes(self.chkclientTTLC);
        } catch (error) {

        }
    };
    self.Connect = function () {
        self.Reset();
        self.xhr = new XMLHttpRequest();
        self.xhr.open('GET', 'api/' + encodeURIComponent(('https:' == document.location.protocol ? 'wss:' : 'ws:') + '//' + document.location.host + '/'), true);
        self.SetMaybe(self.chkclientFCD);
        self.xhr.responseType = 'json';
        self.xhr.onload = function (sender, ev) {
            if (self.xhr.status == 200) {
                self.SetYes(self.chkclientFCD);
                self.jresp = self.xhr.response;
                // self.identidiv.style.background = "url('data:image/svg+xml;base64," + self.jresp.identicon + "') center/cover";
                self.identidiv.innerHTML = self.jresp.identicon;
                self.identiCard.style.display = 'inline';
                var wsurl = ('https:' == document.location.protocol ? 'wss:' : 'ws:') + '//' + document.location.host + '/ws/?room=' + self.jresp.room;
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
            query: 'clientconnected'
        }));
    };
    self.wsmessage = function wsopen(ev) {
        console.log(ev.data);
        var jmsg = JSON.parse(ev.data);
        switch (jmsg.action) {
        case 'notice':
            switch (jmsg.notice) {
            case 'clientconnected':
                self.SetYes(self.chkclientSWC);
                self.ConnectedSections.style.display = 'inline';
                break;
            case 'clientnotconnected':
                if (!self.IsYes(self.chkclientTTLC))
                    self.LaunchClient();
                break;
            case 'clientdisconnected':
                self.SetNo(self.chkclientSWC);
                break;
            default:
                break;
            }
            break;
        case 'performancetick':
            if (AddTick)
                AddTick(jmsg);
            break;
        default:
            break;
        }
    };
    self.wsclose = function wsopen(ev) {
        self.SetNo(self.chkclientCTS);
        self.SetNo(self.chkclientSWC);
    };
    self.wserror = function wsopen(ev) {
        self.SetNo(self.chkclientCTS);
        self.SetNo(self.chkclientSWC);
    };
};

var JAR_Client = new JAR_Client_ctor();