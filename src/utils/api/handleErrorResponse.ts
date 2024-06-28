export const handleErrorResponse = (error: unknown, message: string, statusCode: number) => {
  console.error(message, error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return Response.json({ error: message, details: errorMessage }, { status: statusCode });
};
