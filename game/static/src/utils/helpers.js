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

    ctx.fillText(text, CTX.trX(x), CTX.trY(y));

    ctx.strokeStyle = 'black';
    ctx.strokeText(text, CTX.trX(x), CTX.trY(y));

    return CTX.trX(ctx.measureText(text).width);
}

function drawHpStripe(ctx, maxHp, cHp, x, y, width, height, showText = false) {

    if (cHp < 0)
        cHp = 0

    ctx.fillStyle = '#FF8989';
    CTX.drawRect(x, y, width, height);

    ctx.fillStyle = '#ADF7A5';
    let widthG = cHp * width / maxHp;
    CTX.drawRect(x, y, widthG, height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    CTX.strokeRect(x, y, width, height);

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
