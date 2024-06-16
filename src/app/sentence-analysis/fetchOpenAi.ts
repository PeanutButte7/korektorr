import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
});

export const fetchOpenAi = async (editorValue: string) => {
  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: editorValue,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "asst_3xQQFx4XJB5lxUfQM34erubz",
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    const currentRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // @ts-ignore
    const suggestions: string = messages.data[0].content[0].text.value;

    return {
      suggestions,
      usage: currentRun.usage,
    };
  } else {
    throw new Error("Run not completed");
  }
};
