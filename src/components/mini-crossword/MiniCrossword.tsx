import { CellData, CluesInputOriginal, GridData } from "react-crossword-v2/dist/types"

type Props = {
  gridData: GridData;
}

export const MiniCrossword : React.FC<Props> = ({ gridData }) => {
  const squareSize = 20;
  const borderSize = 0.125;
  const numberOffset = 0.5;

  return (
    <svg viewBox="0 0 100 100">
      <rect x={0} y={0} width={100} height={100} fill="black" />
      {gridData.flat().map((cell: CellData) => {
        if (!cell.used) return;
        return (
          <g key={`${cell.row}_${cell.col}`}>
            <rect
              x={cell.col * squareSize + borderSize}
              y={cell.row * squareSize + borderSize}
              width={squareSize - 2 * borderSize}
              height={squareSize - 2 * borderSize}
              fill='white'
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
}
