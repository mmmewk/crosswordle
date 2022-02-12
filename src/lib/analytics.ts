export const trackShare = (index: number, isGameWon: boolean, isGameLost: boolean, totalGuesses: number) => {
  let category = 'game_in_progress';
  if (isGameWon) category = 'game_won';
  if (isGameLost) category = 'game_lost';
  gtag('event', 'share', {
    event_category: category,
    event_label: `crosswordle_${index}`,
    value: totalGuesses,
  });
};

export const trackGameEnd = (index: number, category: 'game_won' | 'game_lost', totalGuesses: number) => {
  gtag('event', 'game_end', {
    event_category: category,
    event_label: `crosswordle_${index}`,
    value: totalGuesses,
  });
}

export const trackGuess = (index: number, guess: string) => {
  gtag('event', 'guess', {
    event_category: 'game_in_progress',
    event_label: `crosswordle_${index}`,
    value: guess,
  })
}

export const trackGameProgress = (index: number, percentComplete: string) => {
  gtag('event', 'progress', {
    event_category: 'game_in_progress',
    event_label: `crosswordle_${index}`,
    value: percentComplete,
  })
}
