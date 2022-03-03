# Crosswordle

Crossword + Wordle

Play the game [here](https://crosswordle.mekoppe.com)

- Go play the real Wordle [here](https://www.nytimes.com/games/wordle/index.html)
- Go play the crossword mini [here](https://www.nytimes.com/crosswords/game/mini)
- Read the story behind the wordle [here](https://www.nytimes.com/2022/01/03/technology/wordle-word-game-creator.html)

Initially cloned the project from https://github.com/cwackerfuss/react-wordle

## Puzzle catalog

Puzzles are all hand written using [crosshare](https://crosshare.org)

If you would like to submit a puzzle email me at [crosswordle.submissions@gmail.com](mailto:crosswordle.submissions@gmail.com).
Puzzles should contain only words in the english dictionary, and be ~90% commonly known words.
Try to minimize the number of 2 letter words and letters only connected to a single word, as both of those add a larger element of luck into the puzzle.
Include your name and I will give you credit as the author of the puzzle!

## Bug Reporting

use [Github Issues](https://github.com/mmmewk/crosswordle/issues) to submit bug reports. Include any relevant information like what device you are playing on, which puzzle the bug occured on and steps to reproduce.

## Contributing

Contributions are strongly encouraged! Just submit a PR and I will take the time to look at it!

## TODO

Heres the next features that I'm thinking of working on. Feel free to submit a PR for any of these!

- [ ] Add streaks and statistics (to the share modal? Or have another modal for statistics?)
- [ ] Add archive (Allow users to play any puzzles in the past, and see how well they did on each one, allow filtering by author)
- [ ] Add pencil feature where users can write letters in the corners of the crossword squares (where users can write directly in the crossword shows as gray shadow text in the wordle)
- [ ] Update partially grayed keys to include all edge cases (Given solution "bends" and guess "seedy" mark all e's except the 2nd index as partially gray)
- [ ] Add timed mode for those who care about speed rather than # of guesses 
- [ ] Update layout to use full screen height on tall narrow screens
- [ ] Support a language dropdown, different set of puzzles per language. We need a puzzle master and/or generator for each language to keep daily puzzles coming at high quality
- [ ] Add dictionary feature to make it easy to look up words and expand your vocabulary
- [ ] Support different size crosswordles
