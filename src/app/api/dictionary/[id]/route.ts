import { handleErrorResponse } from "@/utils/api/handleErrorResponse";
import { createServerClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return handleErrorResponse(null, "ID is missing", 400);
  }

  // Delete the word from the database
  const { data, error } = await supabase.from("words").delete().eq("id", id).select();

  if (error) {
    console.error("Database delete error:", error);
    return Response.json({ error: "Error deleting word from database", details: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 200 });
}
