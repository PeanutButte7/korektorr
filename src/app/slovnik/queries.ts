import { TypedSupabaseClient } from "@/utils/supabase/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/utils/get-session";

export const dictionaryKey = "dictionary";

export interface DictionaryWord {
  id: number;
  word: string;
}

const getUserDictionary = async (client: TypedSupabaseClient): Promise<DictionaryWord[]> => {
  const session = await getSession(client);
  const { data, error } = await client
    .from("dictionary")
    .select("id, word")
    .eq("user_id", session.user.id)
    .order("created_at");

  if (error) throw new Error(error.message);
  return data;
};

export const useGetUserDictionary = (client: TypedSupabaseClient, enabled: boolean) =>
  useQuery({
    queryKey: [dictionaryKey],
    queryFn: () => getUserDictionary(client),
    enabled,
  });

const insertDictionaryWord = async (client: TypedSupabaseClient, word: string) => {
  const session = await getSession(client);
  const { error } = await client.from("dictionary").insert([{ word, user_id: session.user.id }]);

  if (error) throw new Error(error.message);
  return getUserDictionary(client); // Re-fetch the dictionary
};

export const useInsertDictionaryWord = (client: TypedSupabaseClient) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: string) => insertDictionaryWord(client, word),
    onSuccess: (data) => {
      queryClient.setQueryData([dictionaryKey], data);
    },
  });
};

const deleteDictionaryWord = async (client: TypedSupabaseClient, wordId: number) => {
  const session = await getSession(client);
  const { error } = await client.from("dictionary").delete().eq("user_id", session.user.id).eq("id", wordId);

  if (error) throw new Error(error.message);
  return getUserDictionary(client); // Re-fetch the dictionary
};

export const useDeleteDictionaryWord = (client: TypedSupabaseClient) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wordId: number) => deleteDictionaryWord(client, wordId),
    onSuccess: (data) => {
      queryClient.setQueryData([dictionaryKey], data);
    },
  });
};
