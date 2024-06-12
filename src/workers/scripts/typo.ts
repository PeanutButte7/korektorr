importScripts("https://cdn.jsdelivr.net/npm/typo-js@1.1.0/typo.js");

let typo: unknown = null;

initializeDictionary();

onmessage = (event) => {
  const message = event.data;

  switch (message.type) {
    case "check_word":
      if (!typo) {
        dictionaryNotInitialized();
        return;
      }

      // @ts-ignore
      const isCorrect = typo.check(message.word);
      let spellSuggestions: string[] = [];

      if (!isCorrect) {
        // @ts-ignore
        spellSuggestions = typo.suggest(message.word);
      }

      postMessage({ type: "word_checked", word: message.word, isCorrect, spellSuggestions });
      break;
    case "suggest_word":
      if (!typo) {
        dictionaryNotInitialized();
        return;
      }

      // @ts-ignore
      const suggestions = typo.suggest(message.word);
      postMessage({ type: "word_suggested", word: message.word, suggestions });
      break;
    default:
      break;
  }
};

async function initializeDictionary() {
  try {
    const [affResponse, dicResponse] = await Promise.all([
      fetch("/dictionaries/cs_CZ.aff"),
      fetch("/dictionaries/cs_CZ.dic"),
    ]);

    if (!affResponse.ok || !dicResponse.ok) {
      throw new Error("Failed to load dictionary files");
    }

    const affData = await affResponse.text();
    const dicData = await dicResponse.text();

    // @ts-ignore
    typo = new Typo("cs_CZ", affData, dicData);
    postMessage({ type: "dictionary_ready" });
  } catch (error) {
    postMessage({ type: "error", message: "Failed to initialize dictionary" });
  }
}

function dictionaryNotInitialized() {
  console.warn("Dictionary not initialized");
  postMessage({ type: "error", message: "Dictionary not initialized" });
}
