var mongoose = require('mongoose');
var RoomSchema = new mongoose.Schema({
    id: String,
    sessionid: String,
    btoken: String,
    ctoken: String,
    browserConnections: [String],
    clientConnection: String
});
RoomSchema.methods.ConnectionExists = function (wsid) {
    return this.BrowserConnectionExists(wsid) || this.ClientConnectionExists(wsid);
};
RoomSchema.methods.BrowserConnectionExists = function (wsid) {
    return this.browserConnections.includes(wsid);
};
RoomSchema.methods.ClientConnectionExists = function (wsid) {
    return this.clientConnection == wsid;
};
module.exports = mongoose.model('Room', RoomSchema);