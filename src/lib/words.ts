import { useCallback, useState } from "react";

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
