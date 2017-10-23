var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(creep.room.memory.miner.length,creep.body.length);
        if (creep.room.memory.miner && (creep.room.memory.miner.length <= creep.body.length) && creep.room.memory.miner.length < 6)
        {   
            creep.room.memory.miner.push(WORK);
        }
        
        if (creep.carry.energy == 0)
        {
            if (creep.memory.spwan)
            {
                creep.memory.spawn='';
            }
            creep.memory.harvest = true;
            creep.say('mine');
        }
        else if (creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.harvest = false;
            creep.say('full');
        }
        if (creep.memory.harvest)
        {
            if (!(creep.pos.x == creep.memory.minePos[0] && creep.pos.y == creep.memory.minePos[1] && creep.pos.roomName == creep.room.name))
            {
                creep.moveTo(creep.memory.minePos[0],creep.memory.minePos[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else
            {
                creep.harvest(Game.getObjectById(creep.memory.source));
            }
        }
        else
        {
            // No harvest 
            //console.log('containerPos',creep.memory.containerPos);
            if ((creep.room.memory.minerCnt < creep.room.memory.minerMax) || creep.memory.containerPos == undefined)
            {
                // Return to spawn, build miners
                console.log('Need More Miners');
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < (.90 * structure.energyCapacity);
                        }
                });
                if(targets.length > 0) {
                    creep.say('hstructure');
                   // creep.memory.target = targets[1].name;
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            else
            {   
                // Enough miners 
                // Look at containers
                var container;
                var pos = creep.room.lookAt(creep.memory.containerPos[0],creep.memory.containerPos[1]);
                for (var lookAt in pos)
                {
                    console.log(lookAt,JSON.stringify(pos[lookAt]));
                    if (pos[lookAt].type=='constructionSite')
                    {
                        container = pos[lookAt]['constructionSite'];
                        console.log('constructionSite');
                        creep.memory.buildContainer = true;
                        break;
                    }
                    else if (pos[lookAt].type=='structure')
                    {
                        console.log('container')
                        container = pos[lookAt]['structure'];
                        creep.memory.container=container.id;
                        creep.memory.buildContainer = false;
                        break;
                    }
                  else
                    {
                        console.log(creep.name,'has problem with',JSON.stringify(creep.memory.containerPos));
                    }
                }
                // Do we build?
                if (creep.memory.buildContainer)
                {
                    // build container
                    if(creep.build(container) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                // Lets fill it
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                    }  
                }
            // End else for spwan miners
            }
        // End else for harvest
        }
    // End Function
    }
// End var
};

module.exports = roleMiner;
