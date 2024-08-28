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

// Helper function to check if two line segments intersect
function lineIntersects(lineStart1, lineEnd1, lineStart2, lineEnd2) {
    const d1 = lineEnd1.subtract(lineStart1);
    const d2 = lineEnd2.subtract(lineStart2);

    const determinant = d1.x * d2.y - d1.y * d2.x;
    if (determinant === 0) {
        return false; // Lines are parallel
    }

    const t1 = (lineStart2.x * d2.y - lineStart2.y * d2.x + lineEnd1.y * d2.x - lineEnd1.x * d2.y) / determinant;
    const t2 = (lineStart2.x * d1.y - lineStart2.y * d1.x + lineStart1.y * d1.x - lineStart1.x * d1.y) / determinant;

    return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
}



try {
    module.exports = {
        serializePath,
        isPointInSquare,
        UUID,
        Orientation,
        lineIntersects
    }
} catch (e) { }