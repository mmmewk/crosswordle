import React from "react";
import { CellData, GridData } from "../../types";

export type CellColors = { [position: string]: string };

export const SVG_WIDTH = 200;
export const SVG_HEADER_SIZE = 30;

type Props = {
  title?: string; 
  gridData: GridData;
  showLetters?: boolean;
  cellColors?: CellColors;
  margin?: number;
}

export const MiniCrossword = React.forwardRef<SVGSVGElement, Props>(({ title, gridData, showLetters = false, cellColors = {}, margin = 20 }, ref) => {
  const headerSize = title ? SVG_HEADER_SIZE : 0;
  const svgHeight = SVG_WIDTH + headerSize;
  const crosswordSize = SVG_WIDTH - 2 * margin;
  const gridSize = gridData.length;
  const squareSize = crosswordSize / gridSize;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`} width={SVG_WIDTH} height={svgHeight} ref={ref}>
      <rect x={0} y={0} width={SVG_WIDTH} height={svgHeight} fill="white" />
      {title && (
        <text x={SVG_WIDTH / 2} y={SVG_HEADER_SIZE / 2} textAnchor="middle" dominantBaseline='hanging' fontSize={14}>
          {title}
        </text>
      )}
      <rect x={margin} y={margin + headerSize} width={crosswordSize} height={crosswordSize} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        return (
          <g key={key}>
            <rect
              x={cell.col * squareSize + borderSize + margin}
              y={cell.row * squareSize + borderSize + margin + headerSize}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill={cellColors[key] || 'white'}
              stroke='black'
              strokeWidth={0.4}
            />
            {cell.number && (
              <text
                x={cell.col * squareSize + numberOffset + margin}
                y={cell.row * squareSize + numberOffset + margin + headerSize}
                textAnchor="start"
                dominantBaseline="hanging"
                style={{ fontSize: '50%', fill: 'rgba(0, 0, 0, 0.25)'}}
              >{cell.number}</text>
            )}
            {cell.guess && showLetters && (
              <text
                x={(cell.col + 0.5) * squareSize + margin}
                y={(cell.row + 0.5) * squareSize + margin}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fill: 'rgba(0, 0, 0)', userSelect: 'none', fontSize: '25px' }}
              >{cell.guess}</text>
            )}
            {cell.circle && (
              <circle
                cx={(cell.col + 0.5) * squareSize + margin}
                cy={(cell.row + 0.5) * squareSize + margin + headerSize}
                r={squareSize / 2}
                fill='transparent'
                stroke='rgba(0,0,0,0.5)'
                strokeWidth={0.5}
              />
            )}
          </g>
        );
      })}
    </svg>
  )
});
