import React, { Component } from "react";

import Options from "./components/Options/Options";
import PlayField from "./components/PlayField/PlayField";
import Theremin from "./util/Theremin";

class Create extends Component {
    constructor(props) {
        super(props);

        this.theremin = new Theremin();

        this.state = {
            optionsVisible: false,
            height: this.theremin.options.volumeArea,
            lines: this.theremin.getNotePositions(),
        };
    }

    toggleOptions() {
        this.setState({ optionsVisible: !this.state.optionsVisible });
    }

    handleMouseMove(e) {
        this.theremin.setPitch(e.pageX);
        this.theremin.setVolume(e.pageY);
    }

    handleHeightChange(value) {
        this.theremin.options.volumeArea = value;
        this.setState({
            height: value,
        });
    }

    handleLineChange(key, value) {
        this.theremin.options[key] = value;
        this.updateLines();
    }

    updateLines() {
        this.setState({
            lines: this.theremin.getNotePositions(),
        });
    }

    componentDidMount() {
        // rerender guidelines on resize
        window.addEventListener("resize", this.updateLines);
        // toggle options view on 'o' keypress
        window.addEventListener("keypress", (e) => {
            e.key === "o" && this.toggleOptions();
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    render() {
        return (
            <div>
                <div style={{ position: "absolute", zIndex: 999 }}>
                    Press `o` to view/hide options
                </div>
                <PlayField
                    lines={this.state.lines}
                    height={this.state.height}
                    onMouseEnter={this.theremin.playSound}
                    onMouseLeave={this.theremin.stopSound}
                    onMouseMove={this.handleMouseMove}
                />
                <Options
                    hidden={!this.state.optionsVisible}
                    theremin={this.theremin}
                    onHeightChange={this.handleHeightChange}
                    onLineChange={this.handleLineChange}
                />
            </div>
        );
    }
}

export default Create;
