var CONSTS = {
    BULLET_VELOCITY: 6,
    SOLDIER_VELOCITY: 4,
    TOWER_COOLDOWN: 7,
    SYNC_TIMEOUT: 100,
    FRAME_RATE: 16.7,
}

try {
    module.exports.CONSTS = CONSTS;
} catch (e) { }