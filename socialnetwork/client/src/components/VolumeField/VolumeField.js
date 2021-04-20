import './VolumeField.css';

import React from 'react';

class VolumeField extends React.PureComponent {
  render() {
    return (
      <div
        className="VolumeField"
        style={{
          height: `${this.props.height}vh`
        }}
      />
    );
  }
}

export default VolumeField;
