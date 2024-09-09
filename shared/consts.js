var CONSTS = {
    BLOCKOUT: true,
    DEBUG: false,
    SHOW_GRID_SERVER_OUTPUT: true,
    SHOW_GRID_CLIENT: true,
    GFX: {
        ASPECT_RATIO: 16 / 9,
        ABS_WIDTH: 3840,
        ABS_HEIGHT: 2160,
        TILE_SIZE: 60,
    },
    BULLET: {
        VELOCITY: 12,
        RADIUS: 7,
    },
    SOLDIER: {
        RADIUS: 60,
        FIGHTER: {
            ATTACK_DISTANCE: 460,
            FIRE_POWER: 10,
            SHOT_FREQUENCY: 1000,
            HP: 30,
            SALVAGE: 10,
            VELOCITY: 7,
        },
        TANK: {
            ATTACK_DISTANCE: 360,
            FIRE_POWER: 10,
            SHOT_FREQUENCY: 2000,
            HP: 90,
            SALVAGE: 20,
            VELOCITY: 3,
        }
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
        //SPAWN_FREQUENCY: 6000,
        HP: 700,
        WIDTH: 120,
        HEIGHT: 300,
        A_POS_X: 90,
        A_POS_Y: 1080,
        A_SPAWN_X: 200,
        A_SPAWN_Y: 1080,
        B_POS_X: 3750,
        B_POS_Y: 1080,
        B_SPAWN_X: 3579,
        B_SPAWN_Y: 1080,
    },
    SPAWN: {
        HP: 500,
        WIDTH: 120,
        HEIGHT: 300,
        SOLDIER_LIMIT: 15,
        FIGHTER: {
            SPAWN_FREQUENCY: 8000,
            A_POS_X: 168,
            A_POS_Y: 150,
            A_ANGLE: 45,
            A_SPAWN_X: 326,
            A_SPAWN_Y: 206,
            B_POS_X: 3679,
            B_POS_Y: 2010,
            B_ANGLE: 315,
            B_SPAWN_X: 3508,
            B_SPAWN_Y: 2010,
        },
        TANK: {
            SPAWN_FREQUENCY: 16000,
            A_POS_X: 168,
            A_POS_Y: 2010,
            A_ANGLE: 90,
            A_SPAWN_X: 341,
            A_SPAWN_Y: 1901,
            B_POS_X: 3679,
            B_POS_Y: 150,
            B_ANGLE: 225,
            B_SPAWN_X: 3508,
            B_SPAWN_Y: 226,
        }
    },
    WALL: {
        HORIZONTAL: {
            WIDTH: 300,
            HEIGHT: 60,
        },
        VERTICAL: {
            WIDTH: 60,
            HEIGHT: 300,
        },
        COST: 1,
        BUILDING_DISTANCE: 800,
        SALVAGE: 30
    },
    //SYNC_TIMEOUT: 60,
    //FRAME_RATE: 20,
    FRAME_RATE: 16.7,
    SYNC_TIMEOUT: 50,
    UPGRADE_SPAWN_SPEED_COOLDOWN: 100,
    UPGRADE_SPAWN_SPEED_COST: 100,
    BLACK_HOLE_COST: 35
}

try {
    module.exports.CONSTS = CONSTS;
} catch (e) { }