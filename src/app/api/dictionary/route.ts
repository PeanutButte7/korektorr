import { handleErrorResponse } from "@/utils/api/handleErrorResponse";
import { createServerClient } from "@/utils/supabase/server";

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
  const { word } = await request.json();
  if (!word) {
    return handleErrorResponse(null, "Word is missing", 400);
  }

  // Insert the new word into the database
  const { data, error } = await supabase
    .from("words")
    .insert([{ word, user_id: user.id }])
    .select();

  if (error) {
    console.error("Database insert error:", error);
    return Response.json({ error: "Error inserting word into database", details: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function GET() {
  const supabase = createServerClient();

  // Retrieve the list of words
  const { data, error } = await supabase.from("dictionary").select("id, word").order("created_at");

  if (error) {
    console.error("Database read error:", error);
    return handleErrorResponse(error, "Error retrieving words from database", 500);
  }

  return Response.json(data, { status: 200 });
}
