import * as React from "react";
import "./bpm.style.css";

export interface BPMProps {
    handleChange: (value: number) => void;
    value: number;
}

export class BPM extends React.Component<BPMProps> {
    handleChange = (e) => {
        const val = e.target.value;

        this.props.handleChange(val);
        if (val > 30 && val < 300) {
        }
    };
    render() {
        return (
            <>
                <label htmlFor="bpm">BPM:</label>
                <input
                    value={this.props.value}
                    onInput={this.handleChange}
                    onFocus={(e) => (e.target.placeholder = "")}
                    className="bpm"
                    placeholder="120"
                />
            </>
        );
    }
}
