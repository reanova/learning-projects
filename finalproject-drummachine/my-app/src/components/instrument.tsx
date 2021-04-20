/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import * as React from "react";
import { Transport, Time } from "tone";
import { Clap } from "../engines/clap";
import { Instruments } from "./instrument-hack";
import { Slider } from "./slider";
import { HiHat } from "../engines/hat";
import { Kick } from "../engines/kick";
import { Snare } from "../engines/snare";

// import * as Tone from "tone";

export interface InstrumentProps {
    engine: string;
    steps?: boolean[];
    handleClick?: (engine: string, steps: boolean[]) => void;
    selected?: boolean;
}

export class Instrument extends React.Component<InstrumentProps, any> {
    private ctx: AudioContext;
    private sound: any;
    private loopId!: number;

    constructor(props: any) {
        super(props);
        this.ctx = new AudioContext();
        switch (props.engine) {
            case "Kick":
                this.sound = new Kick(this.ctx);
                break;
            case "Snare":
                this.sound = new Snare(this.ctx);
                break;
            case "HiHat":
                this.sound = new HiHat(this.ctx);
                break;
            case "Clap":
                this.sound = new Clap(this.ctx);
                break;
        }
        this.state = {
            steps: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ],
            volume: 1,
            tone: 130,
            fxAmount: 0,
        };
        this.loopId = 0;
        Transport.bpm.value = 120;
    }

    // Tone.Transport.bpm.value = 120;
    // Tone.Transport.schedule(this.startLoop, "0");

    // Tone.Transport.loop = true;
    // Tone.Transport.loopEnd = "1m";

    componentDidUpdate() {
        if (this.props.steps && !areEqual(this.props.steps, this.state.steps)) {
            this.setState({
                steps: this.props.steps.slice(0),
            });
            this.createLoop();
        }
    }

    // public startLoop = (time: number) => {
    //     console.log("start loop", time);
    //     this.kick.trigger(time);
    //     this.kick.trigger(time + 0.5);
    //     this.kick.trigger(time + 1);
    //     this.kick.trigger(time + 1.5);
    // }

    createLoop = () => {
        if (!this.props.steps) {
            return;
        }
        Transport.clear(this.loopId);
        const loop = (time: number) => {
            this.state.steps.forEach((s, i) => {
                if (s) {
                    this.sound.trigger(time + i * Time("16n").toSeconds());
                }
            });
        };
        this.loopId = Transport.schedule(loop, "0");
    };

    handleClick = () => {
        // this.ctx.resume();
        // if (this.ctx.state === "running") {
        //     this.ctx.suspend();
        // } else if (this.ctx.state === "suspended") {
        //     this.ctx.resume();
        // }
        // Transport.start();
        if (this.props.handleClick)
            this.props.handleClick(
                this.props.engine,
                this.state.steps.slice(0)
            );
    };

    handleVolume = (volume: number) => {
        this.sound.setVolume(volume);
        this.setState({ volume });
    };

    handleTone = (tone: number) => {
        this.sound.setTone(tone);
        this.setState({ tone });
    };

    handleFX = (fxAmount: number) => {
        this.sound.setFXAmount(fxAmount);
        this.setState({ fxAmount });
    };

    render() {
        const InstrumentStyle = {
            height: "3.5em",
            // margin: "0.2em",
            borderRadius: 10,
            padding: 5,
            backgroundColor: this.props.selected ? "#2AC7DC" : "#3C3D3C",
            color: "white",
            border: "10px outset rgba(155,158,163,0.48)",
        };
        return (
            <div
                style={{
                    display: "inline-block",
                    width: "10em",
                    alignContent: "center",
                    padding: "2em",
                    backgroundColor: "#6F7D7A",
                    border: "#57615F 1px solid",
                }}
            >
                <div>
                    <Slider
                        label={this.props.engine + " Tone"}
                        onValueChange={this.handleTone}
                        value={this.state.tone}
                        min={10}
                        max={1000}
                    />
                </div>
                <div>
                    <Slider
                        label={this.props.engine + " Volume"}
                        onValueChange={this.handleVolume}
                        value={this.state.volume}
                        min={0}
                        max={1}
                        step={0.05}
                    />
                </div>
                <div>
                    <Slider
                        label={this.props.engine + " FX"}
                        onValueChange={this.handleFX}
                        value={this.state.fxAmount}
                        min={0}
                        max={100}
                    />
                </div>

                <div style={InstrumentStyle} onClick={this.handleClick}>
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                        {this.props.engine}
                    </p>
                </div>
            </div>
        );
    }
}

export const areEqual = (ar1, ar2) => {
    if (ar1.length !== ar2.length) return false;
    let equal = true;
    ar1.forEach((el, idx) => {
        if (el !== ar2[idx]) equal = false;
    });
    return equal;
};
