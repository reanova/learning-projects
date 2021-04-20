/* eslint-disable @typescript-eslint/no-useless-constructor */
import * as React from "react";
import { Instrument } from "./instrument";
import { Steps } from "./steps";
import { InstrumentHack } from "./instrument-hack";
import { Transport } from "tone";
import { BPM } from "./bpm-component";
import * as Tone from "tone";
import { PlayPause } from "./play";

export class TransportComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);
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
            selected: null,
        };
        Transport.loop = true;
        Transport.loopEnd = "1m";
    }

    pause = () => {
        Transport.stop();
    };

    play = () => {
        Tone.context.resume();
        Transport.start();
    };

    private handleStepChange = (id: number) => {
        const s = this.state.steps;
        s[id] = !s[id];
        this.setState({
            steps: s,
        });
    };

    private selectInstrument = (selected: string, steps: boolean[]) => {
        if (this.state.selected === selected) {
            this.setState({
                selected: null,
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
            });
        } else {
            this.setState({ selected, steps });
        }
    };

    handleBPMChange = (bpm: number) => {
        Transport.bpm.value = bpm;
        this.setState({ bpm });
    };

    render() {
        return (
            <div>
                <img
                    src={process.env.PUBLIC_URL + "/DrumCode.gif"}
                    alt="logo"
                />
                <h3
                    style={{
                        width: "70%",
                        marginLeft: "15%",
                        marginRight: "15%",
                    }}
                >
                    Create coded beats on your browser!
                </h3>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#6B7775",
                        padding: "1em",
                        border: "11px outset rgba(69,76,75,0.82)",
                        borderBottom: "5px",
                        borderRadius: "10px 10px 0px 0px",
                        width: "70%",
                        marginLeft: "15%",
                        marginRight: "15%",
                    }}
                >
                    <BPM
                        handleChange={this.handleBPMChange}
                        value={this.state.bpm}
                    />
                    <PlayPause play={this.play} pause={this.pause} />
                </div>
                <InstrumentHack
                    steps={this.state.steps}
                    selectedInstrument={this.state.selected}
                >
                    <Instrument
                        key="Kick"
                        engine="Kick"
                        handleClick={this.selectInstrument}
                    />
                    <Instrument
                        key="Snare"
                        engine="Snare"
                        handleClick={this.selectInstrument}
                    />
                    <Instrument
                        key="Clap"
                        engine="Clap"
                        handleClick={this.selectInstrument}
                    />
                    <Instrument
                        key="HiHat"
                        engine="HiHat"
                        handleClick={this.selectInstrument}
                    />
                </InstrumentHack>
                <Steps
                    handleStepChange={this.handleStepChange}
                    steps={this.state.steps}
                />
                <br />
            </div>
        );
    }
}
