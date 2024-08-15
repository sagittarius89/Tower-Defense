var CONSTS = {
    BLOCKOUT: true,
    DEBUG: true,
    SHOW_GRID_SERVER_OUTPUT: false,
    SHOW_GRID_CLIENT: true,
    GFX: {
        ASPECT_RATIO: 16 / 9,
        ABS_WIDTH: 3840,
        ABS_HEIGHT: 2160,
        TILE_SIZE: 100,
    },
    BULLET: {
        VELOCITY: 7,
        RADIUS: 7,
    },
    SOLDIER_VELOCITY: 5,
    SOLDIER: {
        RADIUS: 60,
        ATTACK_DISTANCE: 460,
        SHOT_FREQUENCY: 1000,
        HP: 30,
        SALVAGE: 10,

    },
    TOWER: {
        COOLDOWN: 0,
        ATTACK_DISTANCE: 900,
        SHOT_FREQUENCY: 900,
        HP: 200,
        COST: 1,
        BUILDING_DISTANCE: 800,
        SALVAGE: 30,
        RADIUS: 100,
    },
    COMMAND_CENTER: {
        SPAWN_FREQUENCY: 6000,
        SOLDIER_LIMIT: 15,
        HP: 700,
        WIDTH: 100,
        HEIGHT: 250,
        A_POS_X: 27,
        A_POS_Y: 1079,
        A_SPAWN_X: 200,
        A_SPAWN_Y: 1079,
        B_POS_X: 3806,
        B_POS_Y: 1079,
        B_SPAWN_X: 3579,
        B_SPAWN_Y: 1079,
    },
    SYNC_TIMEOUT: 50,
    FRAME_RATE: 16.7,
    //SYNC_TIMEOUT: 50,
    //FRAME_RATE: 120,
    UPGRADE_SPAWN_SPEED_COOLDOWN: 100,
    UPGRADE_SPAWN_SPEED_COST: 100,
    BLACK_HOLE_COST: 35
}

try {
    module.exports.CONSTS = CONSTS;
} catch (e) { }