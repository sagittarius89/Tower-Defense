function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mesaureStrokedText(ctx, text, textSize = 29) {
    ctx.font = `${textSize}px Menlo, monospace`;
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;

    return ctx.measureText(text).width;
}


function drawStrokedText(ctx, text, x, y, textSize = 29) {
    ctx.font = `${textSize}px Menlo, monospace`;
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;

    ctx.fillText(text, x, y);

    ctx.strokeStyle = 'black';
    ctx.strokeText(text, x, y);

    return ctx.measureText(text).width;
}

function drawHpStripe(ctx, maxHp, cHp, x, y, width, height, showText = false) {

    ctx.fillStyle = '#FF8989';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#ADF7A5';
    let widthG = cHp * width / maxHp;
    ctx.fillRect(x, y, widthG, height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    if (showText)
        drawStrokedText(ctx, `${cHp}\\${maxHp}`, x, y - 5, 18);
}


function geImagetName(image) {
    let filename = '';
    if (image instanceof Image) {
        let fullPath = image.src;
        filename = fullPath.replace(/^.*[\\\/]/, '').split(".")[0];
    } else if (image instanceof String) {
        return image;
    }

    return filename;
}
