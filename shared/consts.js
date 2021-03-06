var CONSTS = {
    BULLET_VELOCITY: 6,
    SOLDIER_VELOCITY: 4,
    SOLDIER_ATTACK_DISTANCE: 260,
    SOLDIER_SHOT_FREQUENCY: 1000,
    SOLDIER_HP: 30,
    SOLDIER_SALVAGE: 10,
    TOWER_COOLDOWN: 0,
    TOWER_ATTACK_DISTANCE: 400,
    TOWER_SHOT_FREQUENCY: 900,
    TOWER_HP: 200,
    TOWER_COST: 60,
    TOWER_BUILDING_DISTANCE: 400,
    TOWE_SALVAGE: 30,
    COMMAND_CENTER_SPAWN_FREQUENCY: 2000,
    COMMAND_CENTER_SOLDIER_LIMIT: 15,
    COMMAND_CENTER_HP: 700,
    SYNC_TIMEOUT: 100,
    FRAME_RATE: 16.7,
    UPGRADE_SPAWN_SPEED_COOLDOWN: 100,
    UPGRADE_SPAWN_SPEED_COST: 100,
    BLACK_HOLE_COST: 35
}

try {
    module.exports.CONSTS = CONSTS;
} catch (e) { }