let roomInit = {

    run: function (currentRoom) {
        if (currentRoom.memory.init === true) {
            return
        }
        console.log('room.init: ' + currentRoom.name);

        // Exits Data
        let exitNames = Game.map.describeExits(currentRoom.name);
        let sides = {
            top: [1, 0, 2, 0, 47],
            right: [3, 2, 49, 47, 49],
            bottom: [5, 49, 2, 49, 47],
            left: [7, 2, 0, 47, 0]
        };
        let exits = {top: {}, right: {}, bottom: {}, left: {}};
        for (let side in sides) {
            let terrainData = _.filter(currentRoom.lookForAtArea(LOOK_TERRAIN,
                sides[side][1], sides[side][2], sides[side][3], sides[side][4], true),
                function (tile) {
                    return tile.terrain !== 'wall';
                });

            for (let tile in terrainData) {
                delete terrainData[tile]['type'];
                delete terrainData[tile]['terrain'];
            }
            exits[side] = {name: exitNames[sides[side][0]], tiles: terrainData};
        }
        currentRoom.memory.exits = exits;

        // Sources Data (+ creeps.miners)
        let sourcesData = currentRoom.lookForAtArea(LOOK_SOURCES, 0, 0, 49, 49, true);
        let sources = [];
        let creeps = {miners: {max: 0, count: 0}};
        for (let source in sourcesData) {
            let terrainData = _.filter(currentRoom.lookForAtArea(LOOK_TERRAIN,
                sourcesData[source].y - 1, sourcesData[source].x - 1,
                sourcesData[source].y + 1, sourcesData[source].x + 1, true),
                function (tile) {
                    return tile.terrain !== 'wall';
                });
            for (let tile in terrainData) {
                delete terrainData[tile]['type'];
                delete terrainData[tile]['terrain'];
            }
            sources.push({
                x: sourcesData[source].x,
                y: sourcesData[source].y,
                energyCapacity: sourcesData[source].energyCapacity,
                adjacent: terrainData
            });
            creeps['miners']['max'] += terrainData.length
        }
        currentRoom.memory.creeps = creeps;
        currentRoom.memory.sources = sources;

        // Structures Data
        let structuresData = currentRoom.lookForAtArea(LOOK_STRUCTURES, 0, 0, 49, 49, true);
        for (let structure in structuresData) {
            if (structuresData[structure].structure.structureType === 'controller') {
                currentRoom.memory.controller = {
                    x: structuresData[structure].x,
                    y: structuresData[structure].y,
                    level: structuresData[structure].structure.level
                };
            } else if (structuresData[structure].structure.structureType === 'spawn') {
                currentRoom.memory.spawns = [{x: structuresData[structure].x, y: structuresData[structure].y}];
            }
        }
        currentRoom.memory.init = true
    }
};

module.exports = roomInit;