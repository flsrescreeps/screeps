let format = require('format');

let creepCensus = {

    room: function (currentRoom) {
        if (!currentRoom.memory.census) {
            currentRoom.memory.census = Game.time;
        } else if (Game.time < currentRoom.memory.census + 5) {
            return
        } else {
            currentRoom.memory.census = Game.time;
        }
        format.log(`creep.census: census @ (${currentRoom.name})`, 1);
        for (let role in currentRoom.memory.creeps) {
            let roleCreeps = _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === currentRoom.name);
            format.log(JSON.stringify(roleCreeps));
        }
    }
};

module.exports = creepCensus;