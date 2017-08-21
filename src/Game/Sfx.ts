namespace Game {

    export class Sfx {

        static ctx: AudioContext;
        static master: GainNode;
        buffer: AudioBuffer;
        mixer: GainNode;

        constructor(config: number[]) {
            const data = jsfxr(config);
            if (!Sfx.ctx) {
                Sfx.ctx = new AudioContext();
                Sfx.master = Sfx.ctx.createGain();
                Sfx.master.connect(Sfx.ctx.destination);
            }
            Sfx.ctx.decodeAudioData(data, (buffer) => {
                this.buffer = buffer;
            });
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