import { KorektorrEditor, KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Editor, Location, Range, Text, Transforms } from "slate";

export type Suggestion = {
  wordIndex: number;
  nodePath: number[];
  punctuationSuggestion: string;
};

export type Suggestions = Suggestion[];

// const test: Suggestions = [
//   {
//     nodePath: [0, 2],
//     charPath: [0, 6],
//     punctuationSuggestion: ", které",
//   },
//   {
//     nodePath: [0, 2],
//     charPath: [15, 19],
//     punctuationSuggestion: ", ale",
//   },
// ];

function sanitizeWord(word: string) {
  return word.replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, "");
}

function getIndicesOf(searchStr: string, str: string) {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0,
    index,
    indices = [];

  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

// Word with the number of times it has been used.
const sanitizedWords = new Map<string, number>();

export const setPunctuationErrors = (editor: KorektorrEditor, suggestions: Suggestions) => {
  if (Editor.isEditor(editor)) {
    let plusIndex = 0;
    let currentNode = suggestions[0].nodePath[1];

    suggestions.forEach((suggestion) => {
      const oldChildrenLength = editor.children[0].children.length;
      const text = editor.children[0].children[suggestion.nodePath[1] + plusIndex].text;
      const sanitizedWord = sanitizeWord(suggestion.punctuationSuggestion);

      if (sanitizedWords.has(sanitizedWord)) {
        sanitizedWords.set(sanitizedWord, suggestion.wordIndex);
      } else {
        sanitizedWords.set(sanitizedWord, suggestion.wordIndex);
      }

      const trueWordIndex = (sanitizedWords.get(sanitizedWord) as number) - 1;

      const wordIndices = getIndicesOf(sanitizedWord, text);

      const charStartIndex = wordIndices[trueWordIndex] - 1; // Includes space
      const charEndIndex = charStartIndex + sanitizedWord.length + 1;
      console.log("text", text);
      console.log("wordIndeces", wordIndices);

      const location: Range = {
        anchor: {
          path: [suggestion.nodePath[0], suggestion.nodePath[1] + plusIndex],
          offset: charStartIndex,
        },
        focus: {
          path: [suggestion.nodePath[0], suggestion.nodePath[1] + plusIndex],
          offset: charEndIndex,
        },
      };

      console.log("checkWord", sanitizedWord, "at", location);

      Transforms.setNodes<KorektorrRichText>(
        editor,
        {
          punctuationError: true,
          punctuationSuggestion: suggestion.punctuationSuggestion,
        },
        {
          split: true,
          at: location,
          match: Text.isText,
        }
      );

      const newChildrenLength = editor.children[0].children.length;
      const diff = newChildrenLength - oldChildrenLength;
      console.log("diff", diff);

      plusIndex += diff;
    });
  }
};
