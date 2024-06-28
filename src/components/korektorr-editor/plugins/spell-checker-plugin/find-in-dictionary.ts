import { DictionaryWord } from "@/app/slovnik/queries";

export const findInDictionary = (word: string, dictionary: DictionaryWord[]) => {
  const wordLowerCase = word.toLowerCase();

  return dictionary.find((w) => w.word === wordLowerCase);
};
