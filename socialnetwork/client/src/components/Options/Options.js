import "./Options.css";

import React from "react";

import { KEYS, SCALES } from "../../util/constants";
import CheckRow from "/Users/reanova/Desktop/fennel-socialnetwork/client/src/Options/components/CheckRow";
import Radio from "/Users/reanova/Desktop/fennel-socialnetwork/client/src/Options/components/Radio";
import RadioGroup from "/Users/reanova/Desktop/fennel-socialnetwork/client/src/Options/components/RadioGroup";

class Options extends React.PureComponent {
    toggleOption(e) {
        this.props.theremin.options[e.target.value] = e.target.checked;
    }

    render() {
        return (
            <div
                className="Options"
                style={{ display: this.props.hidden ? "none" : "initial" }}
            >
                <h1>Playfield</h1>
                <div className="option-row">Frequency Range</div>
                <div className="option-row flex">
                    <span>Scaling (in hz)</span>
                    <span className="flex-item-right">
                        <RadioGroup
                            name="rate"
                            defaultSelectedValue="logarithmic"
                            onChange={(value) =>
                                this.props.onLineChange("hzScale", value)
                            }
                        >
                            <Radio value="linear" label="Linear" />
                            <Radio value="logarithmic" label="Logarithmic" />
                        </RadioGroup>
                    </span>
                </div>
                <CheckRow
                    label="Invert volume axis"
                    value="invertVolumeAxis"
                    onChange={this.toggleOption}
                />
                <CheckRow
                    label="Invert pitch axis"
                    onChange={(e) =>
                        this.props.onLineChange(
                            "invertPitchAxis",
                            e.target.checked
                        )
                    }
                />
                <h1>Synth</h1>
                <SliderWithInput
                    label="Max volume"
                    onAfterChange={(value) =>
                        (this.props.theremin.options.maxVolume = value)
                    }
                    min={1}
                    max={100}
                    defaultValue={100}
                />
                <div className="option-row flex">
                    <span>Waveform</span>
                    <span className="flex-item-right">
                        <RadioGroup
                            name="waveform"
                            defaultSelectedValue="sine"
                            onChange={(value) =>
                                (this.props.theremin.oscillator.type = value)
                            }
                        >
                            <Radio value="sine" label="Sine" />
                            <Radio value="triangle" label="Triangle" />
                            <Radio value="square" label="Square" />
                            <Radio value="sawtooth" label="Sawtooth" />
                        </RadioGroup>
                    </span>
                </div>
                <SliderWithInput
                    label="Filter"
                    onAfterChange={(value) =>
                        (this.props.theremin.biquadFilter.frequency.value = value)
                    }
                    min={20}
                    max={20000}
                    defaultValue={20000}
                />
                <h1>Guidelines</h1>
                <div className="option-row flex">
                    <span>Key</span>
                    <select
                        className="flex-item-right"
                        onChange={(e) =>
                            this.props.onLineChange("key", e.target.value)
                        }
                    >
                        {KEYS.map((key, index) => (
                            <option key={index} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="option-row flex">
                    <span>Scale</span>
                    <select
                        className="flex-item-right"
                        onChange={(e) =>
                            this.props.onLineChange("scale", e.target.value)
                        }
                    >
                        {Object.keys(SCALES).map((scale, index) => (
                            <option key={index} value={scale}>
                                {scale}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }
}

export default Options;
