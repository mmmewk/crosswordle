import { useCallback, useState } from "react";
import { default as GraphemeSplitter } from 'grapheme-splitter'

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const useLazyLoadedValidWords = () => {
  const [validWords, setValidWords] = useState<string[] | null>(null);

  const loadWords = useCallback(async () => {
    const response = await fetch(process.env.PUBLIC_URL + '/validWords.json');
    const words = await response.json();

    setValidWords(words);
    return words;
  }, []);

  return [validWords, loadWords] as const;
}
