import './GuideLines.css';

import React from 'react';

import { COLORS } from '../../util/constants';

class GuideLines extends React.PureComponent {
  render() {
    const guideLines = this.props.lines.map((line, index) => (
      <div
        key={index}
        className="GuideLine"
        style={{ left: line.x, backgroundColor: COLORS[line.key] }}
      />
    ));
    return <div>{guideLines}</div>;
  }
}

export default GuideLines;
