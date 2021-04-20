import React from "react";
import classNames from "classnames";

class Radio extends React.Component {
    handleChange() {
        this.props.onChange(this.props.value);
    }

    render() {
        return (
            <label className={classNames({ selected: this.props.checked })}>
                {this.props.label}
                <input
                    type="radio"
                    name={this.props.name}
                    value={this.props.value}
                    checked={this.props.checked}
                    onChange={this.handleChange}
                />
            </label>
        );
    }
}

export default Radio;
