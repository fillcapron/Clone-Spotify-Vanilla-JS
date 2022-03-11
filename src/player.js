export class Player {
    constructor() {
        this.tracks = [];
        this.trackIndex = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.audio = null;
    }

    addTrack(track) {
        this.tracks.push(track);
    }

    get track() {
        return this.currentTrack;
    }

    set track(trackName) {
        const track = this.tracks.find((item, i) => {
            if (item.name === trackName) {
                this.trackIndex = i;
                return true;
            }
            return false;
        });
        this.currentTrack = track;
        this.audio = new Audio(track.preview_url);
    }

    play() {
        if (!this.isPlaying && this.audio) {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
}