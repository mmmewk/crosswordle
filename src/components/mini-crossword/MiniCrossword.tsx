import React from "react";
import { CellData, GridData } from "react-crossword-v2/dist/types"

export type CellColors = { [position: string]: string };

type Props = {
  gridData: GridData;
  cellColors?: CellColors;
}

export const MiniCrossword = React.forwardRef<SVGSVGElement, Props>(({ gridData, cellColors = {} }, ref) => {
  const svgSize = 200;
  const margin = 10;
  const crosswordSize = svgSize - 2 * margin;
  const gridSize = gridData.length;
  const squareSize = crosswordSize / gridSize;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width={svgSize} height={svgSize} ref={ref}>
      <rect x={0} y={0} width={svgSize} height={svgSize} fill="white" />
      <rect x={margin} y={margin} width={crosswordSize} height={crosswordSize} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        return (
          <g key={key}>
            <rect
              x={cell.col * squareSize + borderSize + margin}
              y={cell.row * squareSize + borderSize + margin}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill={cellColors[key] || 'white'}
              stroke='black'
              strokeWidth={0.4}
            />
            {cell.number && (
              <text
                x={cell.col * squareSize + numberOffset + margin}
                y={cell.row * squareSize + numberOffset + margin}
                textAnchor="start"
                dominantBaseline="hanging"
                style={{ fontSize: '50%', fill: 'rgba(0, 0, 0, 0.25)'}}
              >{cell.number}</text>
            )}
          </g>
        );
      })}
    </svg>
  )
});
