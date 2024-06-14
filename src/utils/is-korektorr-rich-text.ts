import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Text } from "slate";

export const isKorektorrRichText = (node: any): node is KorektorrRichText => {
  if (!Text.isText(node)) return false;

  return "errors" in node;
};
