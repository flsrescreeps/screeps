var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (!('source' in creep.memory) || creep.memory.source === null) {
                creep.memory.source = Math.floor(Math.random()*sources.length)
            }
            if (creep.harvest(sources[creep.memory.source]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            if ('source' in creep.memory) {
                creep.memory.source = null;
            }
            var primaryTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity);
                    
                }
            });
            var secondaryTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER &&
                    structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    
                }
            });
            if (primaryTargets.length) {
                if (creep.transfer(primaryTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(primaryTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (secondaryTargets.length) {
                if (creep.transfer(secondaryTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(secondaryTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
    }
};

module.exports = roleHarvester;
