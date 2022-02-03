import { Cell } from './Cell'

type Props = {
  solution: string;
  size?: 'sm' | 'lg';
}

export const EmptyRow : React.FC<Props>= ({ solution, size = 'lg' }) => {
  const emptyCells = Array.from(Array(solution.length))

  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => (
        <Cell key={i} size={size} />
      ))}
    </div>
  )
}
