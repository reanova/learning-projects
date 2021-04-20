import * as React from "react";

export type Instruments = "Kick" | "Snare" | "HiHat" | "Clap";

export interface InstrumentHackProps {
    steps: boolean[];
    selectedInstrument: Instruments;
}

export class InstrumentHack extends React.Component<any> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        console.log("the selected si ", this.props.selectedInstrument);
        const childrenWithProps = React.Children.map(
            this.props.children,
            (child) => {
                if (
                    typeof child === "object" &&
                    child !== null &&
                    child.hasOwnProperty("key")
                ) {
                    //@ts-ignore
                    if (child.key === this.props.selectedInstrument) {
                        //@ts-ignore
                        return React.cloneElement(child, {
                            steps: this.props.steps,
                            selected: true,
                        });
                    } else {
                        //@ts-ignore
                        return React.cloneElement(child, {
                            steps: null,
                            selected: false,
                        });
                    }
                }
                return child;
            }
        );

        return (
            <div
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#525B5A",
                    padding: "1em",
                    border: "11px outset rgba(69,76,75,0.82)",
                    borderBottom: "5px solid rgba(69,76,75,0.82)",
                    borderTop: "5px solid rgba(69,76,75,0.82)",
                    width: "70%",
                    marginLeft: "15%",
                    marginRight: "15%",
                }}
            >
                {childrenWithProps}
            </div>
        );
    }
}
