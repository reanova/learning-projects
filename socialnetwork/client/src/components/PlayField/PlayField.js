import './PlayField.css';

import React from 'react';

import GuideLines from '../GuideLines/GuideLines';
import VolumeField from '../VolumeField/VolumeField';

class PlayField extends React.PureComponent {
  render() {
    return (
      <div
        className="PlayField"
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onMouseMove={this.props.onMouseMove}
      >
        <GuideLines lines={this.props.lines} />
        <VolumeField height={this.props.height} />
      </div>
    );
  }
}

export default PlayField;
