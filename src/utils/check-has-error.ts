import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

export const checkHasError = (node: KorektorrRichText) => {
  if (!node.errors) return false;

  return Object.keys(node.errors).some((key) => {
    const errorDetail = node.errors?.[key as keyof typeof node.errors];
    return errorDetail !== undefined;
  });
};
