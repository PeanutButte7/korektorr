import { handleErrorResponse } from "@/utils/api/handleErrorResponse";
import { createServerClient } from "@/utils/supabase/server";
import { fetchOpenAi } from "@/app/api/sentence-analysis/fetchOpenAi";

export async function POST(request: Request) {
  const supabase = createServerClient();

  // Attempt to retrieve the user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return handleErrorResponse(userError, "Error retrieving user data", 500);
  }

  const user = userData?.user;
  if (!user) {
    return handleErrorResponse(null, "User is not logged in", 401);
  }

  // Attempt to parse the request JSON
  const { editorValue } = await request.json();
  if (!editorValue) {
    return handleErrorResponse(null, "Editor value is missing", 400);
  }

  // Call OpenAI
  const openAiRes = await fetchOpenAi(editorValue);

  if (!openAiRes.suggestions) {
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
    const json = JSON.parse(openAiRes.suggestions);
    return Response.json(json, { status: 200 });
  } catch (parseError) {
    return handleErrorResponse(parseError, "Error parsing generated content", 500);
  }
}
