let roomInit = require('room.init');
let queueBuild = require('queue.build');

module.exports.loop = function () {

    for (let roomName in Game.rooms) {
        let currentRoom = Game.rooms[roomName];
        roomInit.run(currentRoom);
    }
};