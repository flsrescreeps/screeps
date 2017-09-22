var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    if(harvesters.length < 8) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    if(builders.length < harvesters.length * 0.5) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    if(upgraders.length < harvesters.length * 0.75) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }
    console.log('Builders: ' + builders.length + ', Harvesters: ' + harvesters.length + ', Upgraders: ' + upgraders.length);

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }

    for (var spawn in Game.spawns) {
        var spawnRoom = Game.spawns[spawn].room;
        if (!spawnRoom.memory.roadBuilt === true) {
            var energySources = spawnRoom.find(FIND_SOURCES);
            var roomController = spawnRoom.controller;
            var closestEnergyToController = null;
            var closestEnergyToControllerSteps = 1000;
            for (var source in energySources) {
                var energyToController = spawnRoom.findPath(roomController.pos, energySources[source].pos, {ignoreCreeps: true, ignoreRoads: true})
                if (energyToController.length < closestEnergyToControllerSteps) {
                    closestEnergyToControllerSteps = energyToController.length;
                    closestEnergyToController = energySources[source]
                }
                var path = spawnRoom.findPath(Game.spawns[spawn].pos, energySources[source].pos, {ignoreCreeps: true, ignoreRoads: true});
                for (var step in path) {
                    var pos = new RoomPosition(path[step].x, path[step].y, spawnRoom.name);
                    spawnRoom.createConstructionSite(pos, STRUCTURE_ROAD);
                }
                var adjacentTerrains = spawnRoom.lookForAtArea(LOOK_TERRAIN,
                    energySources[source].pos.y-1,
                    energySources[source].pos.x-1,
                    energySources[source].pos.y+1,
                    energySources[source].pos.x+1,
                    true
                );
                for (var i in adjacentTerrains) {
                    console.log(adjacentTerrains[i]);
                    var pos = new RoomPosition(adjacentTerrains[i].x, adjacentTerrains[i].y, spawnRoom.name);
                    spawnRoom.createConstructionSite(pos, STRUCTURE_ROAD);
                }

            }
            if (closestEnergyToController) {
                var path = spawnRoom.findPath(closestEnergyToController.pos, roomController.pos, {ignoreCreeps: true, ignoreRoads: true});
                for (var step in path) {
                    var pos = new RoomPosition(path[step].x, path[step].y, spawnRoom.name);
                    spawnRoom.createConstructionSite(pos, STRUCTURE_ROAD);
                }
            }
            // console.log(spawnRoom.name);
            // var exits = Game.map.describeExits(spawnRoom.name);
            // // console.log(JSON.stringify(Object.keys(exits)));
            // // var space = spawnRoom.find(Object.keys(exits))
            // // console.log(JSON.stringify(space));
            // for (var exitSide in spawnRoom.find(Object.keys(exits))) {
            //     console.log(JSON.stringify(exitSide));
            //     var exitPos = Game.spawns[spawn].pos.findClosestByPath(exitSide);
            //     // console.log(exitPos);
            //     var path = spawnRoom.findPath(Game.spawns[spawn].pos, exitPos, {ignoreCreeps: true, ignoreRoads: true});
            //     for (var step in path) {
            //         var pos = new RoomPosition(path[step].x, path[step].y, spawnRoom.name);
            //         spawnRoom.createConstructionSite(pos, STRUCTURE_ROAD);
            //     }
            // }
            spawnRoom.memory.roadBuilt = true;
        }
    }
};
