export interface InstrumentEngine {
    tone: number;
    decay: number;
    volume: number;
    setup: () => void;
    trigger: (time: number) => void;
    setTone: (tone: number) => void;
    setVolume: (tone: number) => void;
}
