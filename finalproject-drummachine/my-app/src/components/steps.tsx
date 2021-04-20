/* eslint-disable @typescript-eslint/no-useless-constructor */
import * as React from "react";
import { Step } from "./step";

export class Steps extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "#6B7775",
                    padding: "1em",
                    border: "11px outset rgba(69,76,75,0.82)",
                    borderTop: "5px",
                    borderRadius: "0px 0px 10px 10px",
                    width: "70%",
                    marginLeft: "15%",
                    marginRight: "15%",
                }}
            >
                {this.props.steps.map((step, idx) => {
                    return (
                        <Step
                            on={step}
                            onClick={this.props.handleStepChange}
                            key={idx}
                            id={idx}
                        />
                    );
                })}
            </div>
        );
    }
}
