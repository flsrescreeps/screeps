let format = require('format');
let roomInit = require('room.init');
let roomRefresh = require('room.refresh');
let creepCensus = require('creep.census');

module.exports.loop = function () {

    for (let roomName in Game.rooms) {
        let currentRoom = Game.rooms[roomName];
        roomInit.run(currentRoom);
    }
    for (let roomName in Memory.rooms) {
        if (!Game.rooms[roomName]) {
            format.log(`main: deleting memory.rooms['${roomName}']`, 3);
            delete Memory.rooms[roomName];
            continue
        }
        let currentRoom = Game.rooms[roomName];
        roomRefresh.run(currentRoom);
        creepCensus.room(currentRoom);
    }
};