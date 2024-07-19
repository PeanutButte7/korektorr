import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
});

const splitIntoSentences = (text: string) => {
  return text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim());
};

export const fetchOpenAi = async (
  text: string
): Promise<{
  correctedText: string;
  usage: { completion_tokens: number; prompt_tokens: number };
}> => {
  // return {
  //   correctedText:
  //     '{"text":"Tomáš {{byl}} jeden z nejlepších žáků{{,}} který kdy žil. Často jezdili domů{{,}} když byla tma. Pepa šel{{,}} ale domů."}',
  //   usage: { completion_tokens: 0, prompt_tokens: 0 },
  // };

  // console.log(editorValue);
  // const sentences = splitIntoSentences(editorValue);
  const thread = await openai.beta.threads.create();
  let usage = { completion_tokens: 0, prompt_tokens: 0 };

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: text,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "asst_cMcBDiuP2Abuouav2qRh2zOT",
  });

  if (run.status === "completed") {
    const currentRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (currentRun.usage) {
      usage.completion_tokens += currentRun.usage.completion_tokens;
      usage.prompt_tokens += currentRun.usage.prompt_tokens;
    }
  } else {
    throw new Error("Run not completed");
  }

  const messages = await openai.beta.threads.messages.list(thread.id);
  const reversedAssistantMessages = messages.data.reverse().filter(({ role }) => role === "assistant");
  console.log(reversedAssistantMessages);

  // @ts-ignore
  const correctedText = reversedAssistantMessages[0].content[0].text.value;
  console.log(correctedText);

  return {
    correctedText,
    usage,
  };
};
