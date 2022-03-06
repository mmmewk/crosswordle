import { Cell } from './Cell'
import GraphemeSplitter from 'grapheme-splitter'

type Props = {
  solution: string;
  size?: 'sm' | 'lg';
}

const splitter = new GraphemeSplitter()

export const EmptyRow : React.FC<Props>= ({ solution, size = 'lg' }) => {
  const splitSolution = splitter.splitGraphemes(solution)
  const emptyCells = Array.from(Array(splitSolution.length))


  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => (
        <Cell key={i} size={size} />
      ))}
    </div>
  )
}
