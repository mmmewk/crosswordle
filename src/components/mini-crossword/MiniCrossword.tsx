import React from "react";
import { CellData, GridData } from "react-crossword-v2/dist/types"

export type CellColors = { [position: string]: string };

type Props = {
  gridData: GridData;
  cellColors?: CellColors;
}

export const MiniCrossword = React.forwardRef<SVGSVGElement, Props>(({ gridData, cellColors = {} }, ref) => {
  const squareSize = 20;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  return (
    <svg viewBox="0 0 100 100" width={100} height={100} ref={ref}>
      <rect x={0} y={0} width={100} height={100} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        return (
          <g key={key}>
            <rect
              x={cell.col * squareSize + borderSize}
              y={cell.row * squareSize + borderSize}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill={cellColors[key] || 'white'}
              stroke='black'
              strokeWidth={0.4}
            />
            {cell.number && (
              <text
                x={cell.col * squareSize + numberOffset}
                y={cell.row * squareSize + numberOffset}
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
