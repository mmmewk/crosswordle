// Code to get crossword data from crosshare
// TODO: convert grid data to crossword data

const grid = document.querySelector('[aria-label="grid"]');
const gridData = [[],[],[],[],[]];
Array.from(grid.childNodes).forEach((node) => {
    const cellElement = node.children[0];
    const [row, col] = cellElement.getAttribute('aria-label').replace('cell', '').split('x');
    const number = cellElement.children[0]?.textContent;
    const letter = cellElement.children[1]?.textContent;
    gridData[row][col] = { row, col, number, letter };
});
