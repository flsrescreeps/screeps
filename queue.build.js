let queueBuild = {

    run: function (currentRoom) {
        console.log('queue.build: ' + currentRoom.name);
        for (let source in currentRoom.memory.sources) {
            let path = currentRoom.findPath(
                new RoomPosition(
                    currentRoom.memory.sources[source].x,
                    currentRoom.memory.sources[source].y,
                    currentRoom.name),
                new RoomPosition(
                    currentRoom.memory.spawns[0].x,
                    currentRoom.memory.spawns[0].y,
                    currentRoom.name),
                {ignoreCreeps: true, ignoreRoads: true}
            );
            let openTiles = 0;
            let containerBuilt = false;
            for (let step in path) {
                let pos = new RoomPosition(path[step].x, path[step].y, currentRoom.name);
                if (path[step].terrain !== "wall") {
                    openTiles += 1;
                }
                if (!containerBuilt && openTiles >= 2) {
                    let result = currentRoom.createConstructionSite(pos, STRUCTURE_CONTAINER);
                    if (result !== -7) {
                        containerBuilt = true
                    }
                } else if (containerBuilt) {
                    currentRoom.createConstructionSite(pos, STRUCTURE_ROAD)
                }
            }
        }
    }
};

module.exports = queueBuild;