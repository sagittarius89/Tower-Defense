function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isPointInSquare(point, x, y, width, height) {
    const withinX = point.x >= x && point.x <= x + width;
    const withinY = point.y >= y && point.y <= y + height;
    return withinX && withinY;
}

function serializePath(path) {
    return path.map(node => ({ x: node.x, y: node.y }));
}

const Orientation = {
    VERTICAL: "VERTICAL",
    HORIZONTAL: "HORIZONTAL"
}



try {
    module.exports = {
        serializePath,
        isPointInSquare,
        UUID,
        Orientation
    }
} catch (e) { }