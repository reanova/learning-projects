/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import { InstrumentEngine } from "./engines";
// import { Time } from "tone";

export class HiHat implements InstrumentEngine {
    private ctx: AudioContext;
    private ratios: number[];
    public tone: number;
    public decay: number;
    private oscEnvelope!: GainNode;
    private bndPass!: BiquadFilterNode;
    private hipass!: BiquadFilterNode;
    public volume: number;
    public fxAmount: number;
    private panner!: StereoPannerNode;

    constructor(ctx) {
        this.ctx = ctx;
        this.ratios = [1, 1.342, 1.2312, 1.6532, 1.9523, 2.1523];
        this.tone = 130.81;
        this.decay = 0.5;
        this.volume = 1;
        this.fxAmount = 0;
    }

    setup() {
        const k = this.fxAmount / 100;
        this.oscEnvelope = this.ctx.createGain();
        this.bndPass = this.ctx.createBiquadFilter();
        this.bndPass.type = "bandpass";
        this.bndPass.frequency.value = 20000;
        this.bndPass.Q.value = 0.2;
        this.hipass = this.ctx.createBiquadFilter();
        this.hipass.type = "highpass";
        this.hipass.frequency.value = 5000;
        this.panner = this.ctx.createStereoPanner();

        this.bndPass.connect(this.hipass);
        this.hipass.connect(this.oscEnvelope);
        this.oscEnvelope.connect(this.panner);
        this.panner.connect(this.ctx.destination);
    }

    trigger(time) {
        if (this.volume == 0) {
            return;
        }
        this.setup();
        const cos = [
            1,
            0.9950041652780257,
            0.9800665778412416,
            0.955336489125606,
            0.9210609940028851,
            0.8775825618903728,
            0.8253356149096783,
            0.7648421872844885,
            0.6967067093471655,
            0.6216099682706645,
            0.5403023058681398,
            0.4535961214255775,
            0.3623577544766736,
            0.26749882862458735,
            0.16996714290024081,
            0.07073720166770268,
            -0.029199522301289037,
            -0.12884449429552508,
            -0.22720209469308753,
            -0.32328956686350396,
            -0.4161468365471428,
            -0.5048461045998579,
            -0.5885011172553463,
            -0.6662760212798248,
            -0.7373937155412461,
            -0.8011436155469343,
            -0.8568887533689478,
            -0.9040721420170617,
            -0.9422223406686585,
            -0.9709581651495908,
            -0.9899924966004456,
            -0.9991351502732795,
            -0.998294775794753,
            -0.9874797699088647,
            -0.9667981925794605,
            -0.9364566872907957,
            -0.8967584163341462,
            -0.8481000317104072,
            -0.7909677119144155,
            -0.7259323042001387,
            -0.6536436208636106,
            -0.5748239465332677,
            -0.49026082134069865,
            -0.4007991720799746,
            -0.30733286997841935,
            -0.2107957994307797,
            -0.11215252693505487,
            -0.012388663462891447,
            0.08749898343944551,
            0.18651236942257401,
            0.2836621854632246,
            0.37797774271297857,
            0.4685166713003748,
            0.5543743361791585,
            0.6346928759426319,
            0.7086697742912575,
            0.7755658785102473,
            0.8347127848391573,
            0.8855195169413168,
            0.9274784307440339,
            0.9601702866503645,
            0.9832684384425836,
            0.9965420970232169,
        ];

        this.panner.pan.value = (Math.cos(time * 4) * this.fxAmount) / 100;
        this.ratios.forEach((ratio) => {
            var osc = this.ctx.createOscillator();
            osc.type = "square";
            osc.frequency.value = this.tone * ratio;
            osc.connect(this.bndPass);
            osc.start(time);
            osc.stop(time + this.decay);
        });
        this.oscEnvelope.gain.setValueAtTime(0.00001 * this.volume, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(
            1 * this.volume,
            time + 0.067 * this.decay
        );
        this.oscEnvelope.gain.exponentialRampToValueAtTime(
            0.3 * this.volume,
            time + 0.1 * this.decay
        );
        this.oscEnvelope.gain.exponentialRampToValueAtTime(
            0.00001 * this.volume,
            time + this.decay
        );
    }

    setTone = (tone: number) => {
        this.tone = tone;
    };
    setVolume = (vol: number) => {
        this.volume = vol;
    };

    setFXAmount = (amount: number) => {
        this.fxAmount = amount;
    };
}
