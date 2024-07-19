import { Suggestions, setPunctuationErrors } from "@/components/korektorr-editor/utils/set-punctuation-errors";
import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { useMutation } from "@tanstack/react-query";
import { iterateEditorChildren } from "@/utils/iterate-editor-children";
import { Editor, Transforms, Text } from "slate";
import { useKorektorr } from "@/app/korektorr-context";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { useWorker } from "@/app/worker-context";
import { DictionaryWord } from "@/app/slovnik/queries";

export const useSmartCorrection = (editor: KorektorrEditor, dictionary: DictionaryWord[]) => {
  const { setAiAnalyzing, setErrorLeafs } = useKorektorr();
  const { worker } = useWorker();

  return useMutation({
    mutationFn: async (editor: KorektorrEditor) => {
      if (!Editor.isEditor(editor)) throw new Error("Editor is not an editor");

      // Disable editor while smart correction is running
      setAiAnalyzing(true);

      // TODO: Figure out more blocks
      // Merge all same block nodes in editor
      iterateEditorChildren(
        editor,
        (node, path) => {
          Transforms.mergeNodes(editor, { at: path });
        },
        true
      );

      // Reset error leafs
      setErrorLeafs([]);

      // Get text from editor
      let text: string = "";
      iterateEditorChildren(editor, (node, path) => {
        if (Text.isText(node)) {
          text += node.text;
        }
      });

      const res = await fetch("/api/smart-correction", {
        method: "POST",
        body: JSON.stringify({
          text,
        }),
      });
      return await res.json();
    },
    onSuccess: (data: { correctedText: string; originalText: string }) => {
      if (!Editor.isEditor(editor)) throw new Error("Editor is not an editor");
      const { correctedText, originalText } = data;
      console.log(correctedText);
      console.log(originalText);

      setAiAnalyzing(false);

      const correctedWords = findCorrectedWords(correctedText, originalText);
      console.log(correctedWords);

      let path = [0, 0];
      correctedWords.forEach((word) => {
        const { startIndex, endIndex, correctedWord, isComma } = word;
        const newNode: KorektorrRichText = {
          text: correctedWord,
          aiSet: true,
          errors: isComma
            ? { punctuationError: { prioritySuggestion: correctedWord } }
            : { spellError: { prioritySuggestion: correctedWord } },
        };

        setErrorLeafs((prev) => [...prev, newNode]);

        Transforms.setNodes(
          editor,
          {
            aiSet: true,
            errors: isComma
              ? { punctuationError: { prioritySuggestion: correctedWord } }
              : { spellError: { prioritySuggestion: correctedWord } },
          } as Partial<KorektorrRichText>,
          {
            at: { anchor: { path, offset: startIndex }, focus: { path, offset: endIndex } },
            split: true,
            match: Text.isText,
          }
        );

        path = [path[0], path[1] + 2];
      });

      checkSpellingNormalize(editor, worker, setErrorLeafs, dictionary);
    },
  });
};

function findCorrectedWords(text: string, originalText: string) {
  const result = [];
  const regex = /{{(.*?)}}/g;
  let match;
  let previousEndIndex = 0;
  let originalTextOffset = 0;

  while ((match = regex.exec(text)) !== null) {
    const correctedWord = match[1];
    const isComma = correctedWord === ",";

    let fullCorrectedWord = correctedWord;

    if (isComma) {
      // Find the next word after the comma
      const restOfSentence = text.slice(match.index + match[0].length);
      const nextWordMatch = /^\s*([^\s]+)/.exec(restOfSentence);

      if (nextWordMatch) {
        const nextWord = nextWordMatch[1];
        fullCorrectedWord = `${correctedWord} ${nextWord}`;
      }
    }

    // Original for checking against original text. Expand range to be sure
    let startIndex = match.index - originalTextOffset - 6;
    let endIndex = startIndex + fullCorrectedWord.length + 12;
    // startIndex = isComma ? startIndex + 1 : startIndex;
    // endIndex = isComma ? endIndex - 1 : endIndex;

    // Offset for slate
    let offsetStartIndex = match.index - previousEndIndex - 1;
    let offsetEndIndex = offsetStartIndex + fullCorrectedWord.length;
    offsetStartIndex = isComma ? offsetStartIndex + 1 : offsetStartIndex;

    const originalTextWithWord = originalText.slice(startIndex, endIndex);
    console.log(
      `Original word: "${originalTextWithWord}", corrected word: "${fullCorrectedWord}" offsetStartIndex: ${offsetStartIndex}, offsetEndIndex: ${offsetEndIndex}`
    );

    originalTextOffset = originalTextOffset + 4 + correctedWord.length;

    // Check if the original text contains the corrected word
    if (originalTextWithWord.includes(fullCorrectedWord)) {
      console.log("Same words");
      previousEndIndex = previousEndIndex + 4;
      continue;
    }

    result.push({
      startIndex: offsetStartIndex,
      endIndex: offsetEndIndex,
      correctedWord: fullCorrectedWord,
      isComma,
    });

    previousEndIndex = isComma ? previousEndIndex + 1 : previousEndIndex;
    previousEndIndex = previousEndIndex + offsetEndIndex + 4;
  }

  return result;
}

function removeBraces(text: string) {
  return text.replace(/[{}]/g, "");
}

const findFirstDiff = function (str1: string, str2: string): { diff: string | undefined; diffIndex: number } {
  const index = [...str1].findIndex(function (el, index) {
    return el !== str2[index];
  });

  return {
    diff: str2[index],
    diffIndex: index,
  };
};

const getWordAtIndex = function (text: string, index: number): { word: string; start: number; end: number } {
  if (index < 0 || index >= text.length) return { word: "", start: -1, end: -1 };

  const left = text.slice(0, index + 1).search(/\S+$/);
  const right = text.slice(index).search(/\s/);
  const start = left;
  const end = right === -1 ? text.length : index + right;

  const word = text.slice(start, end);

  return { word, start, end };
};
