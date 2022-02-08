// Code to get crossword data from crosshare
// TODO: convert grid data to crossword data

const grid = document.querySelector('[aria-label="grid"]');
const gridData = [[],[],[],[],[]];
Array.from(grid.childNodes).forEach((node) => {
    const cellElement = node.children[0];
    const [row, col] = cellElement.getAttribute('aria-label').replace('cell', '').split('x').map(Number);
    const number = cellElement.children[0]?.textContent;
    const letter = cellElement.children[1]?.textContent;
    gridData[row][col] = { row, col, number, letter };
});

const crosswordData = {
  across: {},
  down: {},
};

gridData.forEach((row) => {
  row.forEach((cell) => {
    addAcross(cell, crosswordData);
    addDown(cell, crosswordData);
  });
});

function isDownStart(data, cell) {
  return Boolean(cell.number && hasLetter(data, cell.row + 1, cell.col) && !hasLetter(data, cell.row - 1, cell.col));
}

function isAcrossStart(data, cell) {
  return Boolean(cell.number && hasLetter(data, cell.row, cell.col + 1) && !hasLetter(data, cell.row, cell.col - 1));
}

function hasLetter(data, row, col) {
  if (!data[row]) return false;
  const cell = data[row][col];
  return Boolean(cell && cell.letter !== '' && cell.letter !== undefined);
}

function addDown (cell, crosswordData) {
  if (!isDownStart(gridData, cell)) return;

  answer = '';
  for (row = cell.row; hasLetter(gridData, row, cell.col); row++) {
    answer += gridData[row][cell.col].letter;
  }
  crosswordData.down[cell.number] = { answer, row: cell.row, col: cell.col };
}

function addAcross (cell, crosswordData) {
  if (!isAcrossStart(gridData, cell)) return;

  answer = '';
  for (col = cell.col; hasLetter(gridData, cell.row, col); col++) {
    answer += gridData[cell.row][col].letter;
  }
  crosswordData.across[cell.number] = { answer, row: cell.row, col: cell.col };
}

copy(crosswordData);
