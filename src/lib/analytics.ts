export const trackEvent = (name: string, params?: Gtag.CustomParams | Gtag.ControlParams | Gtag.EventParams) => {
  if (process.env.NODE_ENV === 'development') return;

  gtag('event', name, params);
}

export const trackShare = (index: number, isGameWon: boolean, isGameLost: boolean, totalGuesses: number) => {
  let category = 'game_in_progress';
  if (isGameWon) category = 'game_won';
  if (isGameLost) category = 'game_lost';
  trackEvent('share', {
    event_category: category,
    event_label: `crosswordle_${index}`,
    value: totalGuesses,
  });
};

export const trackGameEnd = (index: number, category: 'game_won' | 'game_lost', totalGuesses: number) => {
  trackEvent('game_end', {
    event_category: category,
    event_label: `crosswordle_${index}`,
    value: totalGuesses,
  });
}

export const trackGuess = (index: number, guess: string) => {
  trackEvent('guess', {
    event_category: 'game_in_progress',
    event_label: `crosswordle_${index}`,
    value: guess,
  })
}
