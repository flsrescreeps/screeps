let format = require('format');

const ROLE_CONFIGS = {
    miner: {
        move: [1, 1, 0],
        work: [1, 45, 10],
        carry: [1, 4, 1]
    },
    flex: {
        move: [1, 15, 3],
        work: [1, 20, 4],
        carry: [1, 15, 3]
    },
    mover: {
        move: [1, 25, 1],
        carry: [1, 25, 1]
    }
};

let creepConfigure = {

    run: function (maxEnergy, creepRole) {

        let minCost = 0;
        let weightedCost = 0;
        let spawnBuild = [];
        let spawnCost = 0;

        for (let bodyPart in ROLE_CONFIGS[creepRole]) {
            minCost += ROLE_CONFIGS[creepRole][bodyPart][0] * BODYPART_COST[bodyPart];
            weightedCost += ROLE_CONFIGS[creepRole][bodyPart][2] * BODYPART_COST[bodyPart];
        }
        if (minCost > maxEnergy) {
            return [spawnBuild, spawnCost]
        }
        for (let bodyPart in ROLE_CONFIGS[creepRole]) {
            let insertions = Math.floor((((ROLE_CONFIGS[creepRole][bodyPart][2] * BODYPART_COST[bodyPart]) / weightedCost) * maxEnergy) / BODYPART_COST[bodyPart]);
            if (insertions < ROLE_CONFIGS[creepRole][bodyPart][0]) {
                insertions = ROLE_CONFIGS[creepRole][bodyPart][0];
            } else if (insertions > ROLE_CONFIGS[creepRole][bodyPart][1]) {
                insertions = ROLE_CONFIGS[creepRole][bodyPart][1]
            }
            for (let i = 0; i < insertions; i++) {
                spawnCost += BODYPART_COST[bodyPart];
                spawnBuild.push(bodyPart);
            }
        }
        return [spawnBuild, spawnCost]
    }
};

module.exports = creepConfigure;