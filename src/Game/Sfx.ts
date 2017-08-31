namespace Game {

    export class Sfx {

        static ctx: AudioContext;
        static master: GainNode;
        static load: number = 0;
        static loaded: number = 0;
        buffer: AudioBuffer;
        mixer: GainNode;

        constructor(config: number[]) {
            Sfx.load++;
            const data = jsfxr(config);
            if (!Sfx.ctx) {
                Sfx.ctx = new AudioContext();
                Sfx.master = Sfx.ctx.createGain();
                Sfx.master.connect(Sfx.ctx.destination);
            }
            Sfx.ctx.decodeAudioData(data, (buffer) => {
                this.buffer = buffer;
                Sfx.loaded++;
            });
        }

        static ready() {
            return Sfx.load == Sfx.loaded;
        }

        play(volume: number = 1, loop: boolean = false): AudioBufferSourceNode {
            const mixer = Sfx.ctx.createGain();
            const source = Sfx.ctx.createBufferSource();
            mixer.connect(Sfx.master);
            mixer.gain.value = volume;
            source.loop = loop;
            source.buffer = this.buffer;
            source.connect(mixer);
            source.start(Sfx.ctx.currentTime);
            return source;
        }
    }

}