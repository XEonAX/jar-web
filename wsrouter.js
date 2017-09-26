var crypto = require('crypto');
var Room = require('./models/room');
var Cookie = require('cookie');
module.exports = function (wss) {
    Room.remove({}); //Delete all rooms on server startup.
    wss.on('connection', function (ws, req) {
        ws.upgradeReq = req;
        ws.id = crypto.randomBytes(16).toString('hex');
        console.log('WSM:Open:New WS connection at:' + ws.upgradeReq.url);
        console.log('WSM:Open:New WS connection ID:' + ws.id);
        var wsReqUrl = {
            QueryString: function (item) {
                var svalue = ws.upgradeReq.url.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
                return svalue ? svalue[1] : svalue;
            }
        };
        var ClientMode = null;
        var wscookies = {};
        if (ws.upgradeReq.headers.cookie != undefined) {
            wscookies = Cookie.parse(ws.upgradeReq.headers.cookie);
            if (wscookies.btoken != undefined)
                ClientMode = 'browser';
            else
                ClientMode = 'client';
        }
        console.log('WSM:Open:ClientMode:' + ClientMode);
        if (ClientMode == 'browser') {
            Room.findOne({
                btoken: wscookies.btoken
            }, function (err, room) {
                if (room != null) {
                    console.log('WSM:Open:Room Found:' + room.toString());
                    room.browserConnections.push(ws.id);
                    room.save();
                    console.log('WSM:Open:Room Saved:' + room.toString());
                    if (room.clientConnection != undefined)
                        wss.clients.forEach(function (wsconn) {
                            if (room.clientConnection == wsconn.id) {
                                console.log('WSM:Open:Notify Client on:' + wsconn.id);
                                wsconn.send(JSON.stringify({
                                    action: 'notice',
                                    notice: 'browserconnected',
                                    browsercount: room.browserConnections.length
                                }));
                            }
                        }, this);
                    ws.source = 'browser';
                    ws.btoken = room.btoken;
                } else {
                    console.log('WSM:Open:Room Not Found for btoken:' + wscookies.btoken);
                    ws.close(1000, 'Invalid data');
                }
            });
        } else {
            ws.source = 'client';
        }

        ws.on('message', function (data, flags) {
            var jmsg = JSON.parse(data);
            console.log('WSM:Message:source:' + ws.source);
            console.log('WSM:Message:action:' + jmsg.action);
            switch (jmsg.action) {
                case 'subscribe':
                    if (ws.source == 'client') {
                        Room.findOne({
                            ctoken: jmsg.ctoken
                        }, function (err, room) {
                            if (room != null && room.clientConnection == undefined) {
                                console.log('WSM:Message:Subscribe:Unoccupied Room Found:' + room.toString());
                                room.clientConnection = ws.id;
                                room.save();
                                console.log('WSM:Message:Subscribe:Room Occupied:' + room.toString());
                                wss.clients.forEach(function (wsconn) {
                                    if (room.BrowserConnectionExists(wsconn.id)) {
                                        console.log('WSM:Message:Subscribe:Notify Browser ClientConnected to:' + wsconn.id);
                                        wsconn.send(JSON.stringify({
                                            action: 'notice',
                                            notice: 'clientconnected'
                                        }));
                                    }
                                }, this);
                                ws.send(JSON.stringify({
                                    action: 'notice',
                                    notice: 'subscribed',
                                    browsercount: room.browserConnections.length,
                                    sessionid: room.sessionid,
                                }));
                            } else {

                                console.log('WSM:Message:Subscribe:Room Not Found to suscribe with ctoken:' + jmsg.ctoken);
                                jmsg.error = 'Invalid Data';
                                ws.send(JSON.stringify(jmsg));
                            }
                        });
                    }
                    break;
                case 'query':
                    console.log('WSM:Message:query:' + jmsg.query);
                    switch (jmsg.query) {
                        case 'clientconnected':
                            if (ws.source == 'browser') {
                                Room.findOne({
                                    browserConnections: ws.id
                                }, function (err, room) {
                                    if (room != null) {
                                        console.log('WSM:Message:Query:clientconnected:Room Found:' + room.toString());
                                        if (room.clientConnection != undefined) {
                                            wss.clients.forEach(function (wsconn) {
                                                if (room.clientConnection == wsconn.id) {
                                                    ws.send(JSON.stringify({
                                                        action: 'notice',
                                                        notice: 'clientconnected'
                                                    }));
                                                }
                                            }, this);
                                        }
                                    }
                                });
                            }
                            break;

                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        });

        ws.on('close', function (ev) {
            console.log('WSM:Close:source:' + ws.source);
            if (ws.source == 'browser') {
                Room.findOne({
                    browserConnections: ws.id
                }, function (err, room) {
                    if (room != null) {
                        console.log('WSM:Close:Room Found:' + room.toString());
                        room.browserConnections.splice(room.browserConnections.indexOf(ws.id));
                        if (room.clientConnection != undefined) {
                            wss.clients.forEach(function (wsconn) {
                                if (room.clientConnection === wsconn.id) {
                                    wsconn.send(JSON.stringify({
                                        action: 'notice',
                                        notice: 'browserdisconnected'
                                    }));
                                }
                            }, this);
                        }
                        room.save();
                        console.log('WSM:Close:Room Updated:' + room.toString());
                    }
                });
            } else if (ws.source == 'client') {
                Room.findOne({
                    clientConnection: ws.id
                }, function (err, room) {
                    if (room != null) {
                        console.log('WSM:Close:Room Found:' + room.toString());
                        room.browserConnections.splice(room.browserConnections.indexOf(ws.id));
                        if (room.browserConnections.length == 0) {
                            if (room.clientConnection != undefined) {
                                wss.clients.forEach(function (wsconn) {
                                    if (room.clientConnection == wsconn.id) {
                                        wsconn.send(JSON.stringify({
                                            action: 'notice',
                                            notice: 'browserdisconnected'
                                        }));
                                    }
                                }, this);
                                room.clientConnection = undefined;
                                room.save();
                            }
                        }
                        room.save();
                        console.log('WSM:Close:Room updated:' + room.toString());
                    }
                });
            }
        });
    });
    wss.logout = function (sessionid) {
        Room.findOne({
            sessionid: sessionid
        }, function (err, room) {
            if (room != null) {
                console.log('WSM:Logout:room found :' + room.toString());
                if (room.browserConnections.length > 0 || room.clientConnection != undefined) {
                    wss.clients.forEach(function (wsconn) {
                        if (room.clientConnection == wsconn.id) {
                            wsconn.send(JSON.stringify({
                                action: 'notice',
                                notice: 'sessionlogout',
                                sessionid: room.sessionid
                            }));
                            room.clientConnection = undefined;
                            room.save();
                        } else {
                            if (room.browserConnections.includes(wsconn.id)) {
                                room.browserConnections.splice(room.browserConnections.indexOf(wsconn.id));
                                wsconn.close(1000, 'logout');
                                room.save();
                            }
                        }
                    }, this);
                }
            }
        });
    };
    return wss;
};