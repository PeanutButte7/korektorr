import { createServerClient } from "@/utils/supabase/server";
import { fetchOpenAi } from "@/app/api/smart-correction/fetchOpenAi";

export async function POST(req: Request) {
  const supabase = createServerClient();

  // Attempt to retrieve the user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return Response.json({ error: "Error retrieving user data" }, { status: 500 });
  }

  const user = userData?.user;
  if (!user) {
    return Response.json({ error: "User is not logged in" }, { status: 401 });
  }

  // Attempt to parse the request JSON
  const { text } = await req.json();
  if (!text) {
    return Response.json({ error: "Text is missing" }, { status: 400 });
  }

  // Call OpenAI
  const openAiRes = await fetchOpenAi(text);

  if (!openAiRes.correctedText) {
    return Response.json({ error: "AI did not generate any content" }, { status: 502 });
  }

  if (!openAiRes.usage) {
    return Response.json({ error: "AI usage information is missing" }, { status: 502 });
  }

  const completionTokens = openAiRes.usage.completion_tokens;
  const promptTokens = openAiRes.usage.prompt_tokens;

  // Insert request stats into database
  const { data, error } = await supabase
    .from("sentence_check_requests")
    .insert([{ user_id: user.id, completion_tokens: completionTokens, prompt_tokens: promptTokens }])
    .select();

  if (error) {
    console.error("Database insert error:", error);
    return Response.json(
      { error: "Error inserting request stats into database", details: error.message },
      { status: 500 }
    );
  }

  // Parse generated content and return it
  try {
    return Response.json(
      {
        correctedText: JSON.parse(openAiRes.correctedText).text,
        originalText: text,
      },
      { status: 200 }
    );
  } catch (parseError) {
    return Response.json({ error: "Error parsing generated content" }, { status: 500 });
  }
}
