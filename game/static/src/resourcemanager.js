class ResourceManager {
    #audio;
    #images;
    #text;
    #ready;

    constructor() {
        this.#ready = false;
        this.#audio = {};
        this.#images = {};
        this.#text = {};

        this.loadResourcesList();
    }

    loadResourcesList() {
        var client = new XMLHttpRequest();
        client.open('GET', '/resources/resources_list.txt');
        client.onreadystatechange = function () {
            this.parseResourceList(client.responseText);
        }.bind(this);
        client.send();
    }

    parseResourceList(data) {
        data = data.replaceAll("\r", "");
        var arr = data.split("\n");

        for (var i = 0; i < arr.length; ++i) {
            try {
                var fullFileName = arr[i];
                var fileName = fullFileName.split(".")[0];
                var ext = fullFileName.split(".")[1];

                switch (ext) {
                    case "png":
                        this.loadPngFile(fullFileName, fileName);
                        this.#images[fileName] = null;
                        break;
                    case "wav":
                        this.loadWavFile(fullFileName, fileName);
                        this.#audio[fileName] = null;
                        break;
                    case "txt":
                        this.loadTextFile(fullFileName, fileName);
                        this.#text[fileName] = null;
                        break;
                    default:
                        console.log("ResourceManager: Not suppoted extension");
                }

            } catch (e) {
                console.log("ResourceManager: Invalid file name: " + fullFileName);
            }
        }

        if (arr.length > 0)
            this.#ready = true;
    }

    loadPngFile(fullFileName, fileName) {
        var img = new Image();
        img.onload = function () {
            this.addImage(fileName, img);
        }.bind(this);

        img.src = "resources/images/" + fullFileName;
    }

    addImage(fileName, img) {
        this.#images[fileName] = img;
    }

    isReady() {
        for (const [key, value] of Object.entries(this.#images)) {
            if (!value)
                return false;
        }

        for (const [key, value] of Object.entries(this.#audio)) {
            if (!value)
                return false;
        }

        for (const [key, value] of Object.entries(this.#text)) {
            if (!value)
                return false;
        }

        return this.#ready;
    }

    getImageResource(name) {
        return this.#images[name];
    }

    getAudioResource(name) {
        return this.#audio[name];
    }

    getTextResource(name) {
        return this.#text[name];
    }
}

ResourceManager.instance = new ResourceManager();