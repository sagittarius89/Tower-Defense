const sizeOf = require('image-size');
const path = require('path');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ResourceManager {
    #dimensions;

    constructor() {
        this.#dimensions = {};
    }

    lazyLoad(name) {
        let fullPath = path.join(__dirname, '..', 'game', 'static', 'resources',
            'images', name + '.png');

        let dim = null;

        try {
            dim = sizeOf(fullPath);
        } catch (e) { }


        if (!dim) {
            fullPath = path.join(__dirname, '..', 'game', 'static', 'resources',
                'images', name + '.gif');

            dim = sizeOf(fullPath);
        }

        return {
            width: dim.width,
            height: dim.height
        }
    }

    getImageResource(name) {
        let dim = this.#dimensions[name];
        if (!dim) {
            dim = this.lazyLoad(name);

            this.#dimensions[name] = dim;
        }

        return dim;
    }
}

ResourceManager.instance = new ResourceManager();


module.exports.ResourceManager = ResourceManager;