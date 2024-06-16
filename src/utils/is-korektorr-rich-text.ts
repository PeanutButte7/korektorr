import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Text } from "slate";

export const isKorektorrRichText = (node: any): node is KorektorrRichText => {
  return Text.isText(node);
};
