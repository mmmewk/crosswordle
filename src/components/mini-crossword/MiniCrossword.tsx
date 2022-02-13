import React from "react";
import { crosswordIndex } from "../../lib/utils";
import { CellData, GridData } from "../../types";

export type CellColors = { [position: string]: string };

export const SVG_WIDTH = 200;
export const SVG_HEADER_SIZE = 30;

type Props = {
  gridData: GridData;
  showLetters?: boolean;
  cellColors?: CellColors;
  totalGuesses: number;
}

export const MiniCrossword = React.forwardRef<SVGSVGElement, Props>(({ gridData, showLetters = false, cellColors = {}, totalGuesses }, ref) => {
  const svgHeight = SVG_WIDTH + SVG_HEADER_SIZE;
  const margin = 20;
  const crosswordSize = SVG_WIDTH - 2 * margin;
  const gridSize = gridData.length;
  const squareSize = crosswordSize / gridSize;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`} width={SVG_WIDTH} height={svgHeight} ref={ref}>
      <rect x={0} y={0} width={SVG_WIDTH} height={svgHeight} fill="white" />
      <text x={SVG_WIDTH / 2} y={SVG_HEADER_SIZE / 2} textAnchor="middle" dominantBaseline='hanging' fontSize={14}>
        Crosswordle #{crosswordIndex + 1} - {totalGuesses} guesses
      </text>
      <rect x={margin} y={margin + SVG_HEADER_SIZE} width={crosswordSize} height={crosswordSize} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return null;
        const key = `${cell.row}_${cell.col}`;

        return (
          <g key={key}>
            <rect
              x={cell.col * squareSize + borderSize + margin}
              y={cell.row * squareSize + borderSize + margin + SVG_HEADER_SIZE}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill={cellColors[key] || 'white'}
              stroke='black'
              strokeWidth={0.4}
            />
            {cell.number && (
              <text
                x={cell.col * squareSize + numberOffset + margin}
                y={cell.row * squareSize + numberOffset + margin + SVG_HEADER_SIZE}
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
          </g>
        );
      })}
    </svg>
  )
});
