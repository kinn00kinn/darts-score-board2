// src/components/Dartboard.jsx
import React from 'react';
import './components.css';

const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const CENTER = 250;
const RADII = {
  doubleBull: 10,
  singleBull: 25,
  innerTriple: 130,
  outerTriple: 145,
  innerDouble: 215,
  outerDouble: 230,
  board: 250,
};

const getCoords = (angle, radius) => {
  const rad = (angle - 90) * Math.PI / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
};

// ダーツボードの1セグメント（例: 20のエリア全体）を描画するコンポーネント
const Segment = ({ number, index }) => {
  const angle = 18 * index;
  const startAngle = angle - 9;
  const endAngle = angle + 9;
  const color = index % 2 === 0 ? '#eee' : '#222';

  // **ここからが修正箇所です**
  // 正しいSVG Arc Pathを生成します
  const singlePath1 = `
    M ${getCoords(startAngle, RADII.singleBull).x} ${getCoords(startAngle, RADII.singleBull).y}
    A ${RADII.singleBull} ${RADII.singleBull} 0 0 1 ${getCoords(endAngle, RADII.singleBull).x} ${getCoords(endAngle, RADII.singleBull).y}
    L ${getCoords(endAngle, RADII.innerTriple).x} ${getCoords(endAngle, RADII.innerTriple).y}
    A ${RADII.innerTriple} ${RADII.innerTriple} 0 0 0 ${getCoords(startAngle, RADII.innerTriple).x} ${getCoords(startAngle, RADII.innerTriple).y}
    Z
  `;
  const singlePath2 = `
    M ${getCoords(startAngle, RADII.outerTriple).x} ${getCoords(startAngle, RADII.outerTriple).y}
    A ${RADII.outerTriple} ${RADII.outerTriple} 0 0 1 ${getCoords(endAngle, RADII.outerTriple).x} ${getCoords(endAngle, RADII.outerTriple).y}
    L ${getCoords(endAngle, RADII.innerDouble).x} ${getCoords(endAngle, RADII.innerDouble).y}
    A ${RADII.innerDouble} ${RADII.innerDouble} 0 0 0 ${getCoords(startAngle, RADII.innerDouble).x} ${getCoords(startAngle, RADII.innerDouble).y}
    Z
  `;
  const triplePath = `
    M ${getCoords(startAngle, RADII.innerTriple).x} ${getCoords(startAngle, RADII.innerTriple).y}
    A ${RADII.innerTriple} ${RADII.innerTriple} 0 0 1 ${getCoords(endAngle, RADII.innerTriple).x} ${getCoords(endAngle, RADII.innerTriple).y}
    L ${getCoords(endAngle, RADII.outerTriple).x} ${getCoords(endAngle, RADII.outerTriple).y}
    A ${RADII.outerTriple} ${RADII.outerTriple} 0 0 0 ${getCoords(startAngle, RADII.outerTriple).x} ${getCoords(startAngle, RADII.outerTriple).y}
    Z
  `;
  const doublePath = `
    M ${getCoords(startAngle, RADII.innerDouble).x} ${getCoords(startAngle, RADII.innerDouble).y}
    A ${RADII.innerDouble} ${RADII.innerDouble} 0 0 1 ${getCoords(endAngle, RADII.innerDouble).x} ${getCoords(endAngle, RADII.innerDouble).y}
    L ${getCoords(endAngle, RADII.outerDouble).x} ${getCoords(endAngle, RADII.outerDouble).y}
    A ${RADII.outerDouble} ${RADII.outerDouble} 0 0 0 ${getCoords(startAngle, RADII.outerDouble).x} ${getCoords(startAngle, RADII.outerDouble).y}
    Z
  `;
  // **修正箇所はここまで**

  const tripleColor = index % 2 === 0 ? '#070' : '#c00';
  const doubleColor = index % 2 === 0 ? '#070' : '#c00';

  return (
    <g>
      <path d={singlePath1} fill={color} data-area={`S${number}`} />
      <path d={singlePath2} fill={color} data-area={`S${number}`} />
      <path d={triplePath} fill={tripleColor} data-area={`T${number}`} />
      <path d={doublePath} fill={doubleColor} data-area={`D${number}`} />
    </g>
  );
};


const Dartboard = ({ onHit, onHover }) => {
  const handleEvent = (e) => {
    const area = e.target.dataset.area;
    if (!area) {
      if (onHover) onHover(null);
      return;
    }
    if (e.type === 'click' && onHit) onHit(area);
    if (e.type === 'mouseover' && onHover) onHover(area);
    if (e.type === 'mouseout' && onHover) onHover(null);
  };

  return (
    <div className="dartboard-container">
      <svg
        viewBox="0 0 500 500"
        onClick={handleEvent}
        onMouseOver={handleEvent}
        onMouseOut={handleEvent}
        className="dartboard-svg"
      >
        <circle cx={CENTER} cy={CENTER} r={RADII.board} fill="#000" />
        {DART_NUMBERS.map((num, i) => <Segment key={num} number={num} index={i} />)}
        <circle cx={CENTER} cy={CENTER} r={RADII.singleBull} fill="#070" data-area="BULL" />
        <circle cx={CENTER} cy={CENTER} r={RADII.doubleBull} fill="#c00" data-area="DBULL" />
      </svg>
    </div>
  );
};

export default Dartboard;