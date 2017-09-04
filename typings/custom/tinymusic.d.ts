declare namespace TinyMusic {

    export class Note {
        constructor(str: string);
        getFrequency(name: string): number;
        getDurration(symbol: string): number;
    }

    export class Sequence {
        constructor(ac: AudioContext, tempo: number, arr: string[]);
        loop: boolean;
        smoothing: number;
        staccato: number;
        gain: GainNode;
        bass: BiquadFilterNode;
        mid: BiquadFilterNode;
        treble: BiquadFilterNode;
        waveType: string;
        createCustomWave(real: number[], imaginary?: number[]): void;
        play(when?: number): Sequence;
        stop(): Sequence;
    }
    
}