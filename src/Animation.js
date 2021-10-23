



export default class Animation {
    constructor(props) {
        this.frameWidth = props.frameWidth;
        this.frameHeight = props.frameHeight;
        this.imageWidth = props.imageWidth;
        this.imageHeight = props.imageHeight;
        this.xPos = props.xPos;
        this.yPos = props.yPos;
        this.fps = props.fps;
        this.frames = props.frames;
        this.src = props.src;
        this.count = 0;
        this.frameIndex = 0;
        this.finished = false;
    }

    animate() {
        this.count++;
        if (this.count > this.fps) {
            this.frameIndex++
            this.count = 0;
        }

        if (this.frameIndex > this.frames - 1) {
            this.finished = true;
            this.frameIndex = 0;
        }

        this.xPos = -1 * this.frameIndex * this.frameWidth;
    }

    isFinished() {
        return this.finished;
    }

    reset() {
        this.finished = false;
    }

    getFrameIndex() {
        return this.frameIndex;
    }
}