import React from "react";

class RadioGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.defaultSelectedValue,
        };
    }

    selectRadio(value) {
        this.setState({ selected: value });
        this.props.onChange(value);
    }

    render() {
        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, (child) =>
            React.cloneElement(child, {
                name: this.props.name,
                checked: this.state.selected === child.props.value,
                onChange: this.selectRadio,
            })
        );

        return <div className="RadioGroup">{childrenWithProps}</div>;
    }
}

export default RadioGroup;
