import GraphemeSplitter from 'grapheme-splitter'

export type CharStatus = 'absent' | 'present' | 'correct' | 'known';

export type CharValue =
'அ'| 'ஆ'| 'இ'| 'ஈ'|'உ'| 'ஊ'| 'எ'| 'ஏ'|'ஐ'| 'ஒ'| 'ஓ'| 'ஔ'| 'ஃ'|
'க'|'கா'|'கி'|'கீ'|'கு'|'கூ'|'கெ'|'கே'|'கை'|'கொ'|'கோ'|'கௌ'|'க்'|
'ச'|'சா'|'சி'|'சீ'|'சு'|'சூ'|'செ'|'சே'|'சை'|'சொ'|'சோ'|'சௌ'|'ச்'|
'ட'|'டா'|'டி'|'டீ'|'டு'|'டூ'|'டெ'|'டே'|'டை'|'டொ'|'டோ'|'டௌ'|'ட்'|
'த'|'தா'|'தி'|'தீ'|'து'|'தூ'|'தெ'|'தே'|'தை'|'தொ'|'தோ'|'தௌ'|'த்'|
'ப'|'பா'|'பி'|'பீ'|'பு'|'பூ'|'பெ'|'பே'|'பை'|'பொ'|'போ'|'பௌ'|'ப்'|
'ற'|'றா'|'றி'|'றீ'|'று'|'றூ'|'றெ'|'றே'|'றை'|'றொ'|'றோ'|'றௌ'|'ற்'|
'ங'|'ஙா'|'ஙி'|'ஙீ'|'ஙு'|'ஙூ'|'ஙெ'|'ஙே'|'ஙை'|'ஙொ'|'ஙோ'|'ஙௌ'|'ங்'|
'ஞ'|'ஞா'|'ஞி'|'ஞீ'|'ஞு'|'ஞூ'|'ஞெ'|'ஞே'|'ஞை'|'ஞொ'|'ஞோ'|'ஞௌ'|'ஞ்'|
'ண'|'ணா'|'ணி'|'ணீ'|'ணு'|'ணூ'|'ணெ'|'ணே'|'ணை'|'ணொ'|'ணோ'|'ணௌ'|'ண்'|
'ந'|'நா'|'நி'|'நீ'|'நு'|'நூ'|'நெ'|'நே'|'நை'|'நொ'|'நோ'|'நௌ'|'ந்'|
'ம'|'மா'|'மி'|'மீ'|'மு'|'மூ'|'மெ'|'மே'|'மை'|'மொ'|'மோ'|'மௌ'|'ம்'|
'ன'|'னா'|'னி'|'னீ'|'னு'|'னூ'|'னெ'|'னே'|'னை'|'னொ'|'னோ'|'னௌ'|'ன்'|
'ய'|'யா'|'யி'|'யீ'|'யு'|'யூ'|'யெ'|'யே'|'யை'|'யொ'|'யோ'|'யௌ'|'ய்'|
'ர'|'ரா'|'ரி'|'ரீ'|'ரு'|'ரூ'|'ரெ'|'ரே'|'ரை'|'ரொ'|'ரோ'|'ரௌ'|'ர்'|
'ல'|'லா'|'லி'|'லீ'|'லு'|'லூ'|'லெ'|'லே'|'லை'|'லொ'|'லோ'|'லௌ'|'ல்'|
'வ'|'வா'|'வி'|'வீ'|'வு'|'வூ'|'வெ'|'வே'|'வை'|'வொ'|'வோ'|'வௌ'|'வ்'|
'ழ'|'ழா'|'ழி'|'ழீ'|'ழு'|'ழூ'|'ழெ'|'ழே'|'ழை'|'ழொ'|'ழோ'|'ழௌ'|'ழ்'|
'ள'|'ளா'|'ளி'|'ளீ'|'ளு'|'ளூ'|'ளெ'|'ளே'|'ளை'|'ளொ'|'ளோ'|'ளௌ'|'ள்'|
'ா'| 'ி'| 'ீ'| 'ு'| 'ூ'| 'ெ'| 'ே'| 'ை'| 'ொ'|'ோ'|'ௌ'|'்'|''

const splitter = new GraphemeSplitter()

export const getStatuses = (
  solution: string,
  guesses: string[],
  knownChars?: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}
  const splitSolution = splitter.splitGraphemes(solution)

  guesses.forEach((word) => {
    splitter.splitGraphemes(word).forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {

        // make status absent
        return (charObj[letter] = 'absent')
      }

      if (letter === splitSolution[i]) {

        //make status correct
        return (charObj[letter] = 'correct')
      }

      if (charObj[letter] !== 'correct') {
        //make status present
        return (charObj[letter] = 'present')
      }
    })
  })

  knownChars?.forEach((letter) => {
    if (charObj[letter] !== 'correct') charObj[letter] = 'known'
  });

  return charObj
}

export const getGuessStatuses = (solution: string, guess: string): CharStatus[] => {
  const splitSolution = splitter.splitGraphemes(solution)
   const splitGuess = splitter.splitGraphemes(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent'
      return
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = 'absent'
      return
    }
  })

  return statuses
}
