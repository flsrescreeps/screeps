let format = require('format');

let roomRefresh = {

    run: function (currentRoom) {
        if (!currentRoom.memory.refresh) {
            currentRoom.memory.refresh = Game.time;
        } else if (Game.time < currentRoom.memory.refresh + 10) {
            return
        } else {
            currentRoom.memory.refresh = Game.time;
        }
        format.log(`room.refresh: refresh @ (${currentRoom.name})`, 1);

        // Update flex creep max
        currentRoom.memory.creeps.flex.max = currentRoom.controller.level + 5;
    }
};

module.exports = roomRefresh;