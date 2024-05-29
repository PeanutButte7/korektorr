import React from "react";

import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_STRIKETHROUGH, MARK_UNDERLINE } from "@udecode/plate-basic-marks";
import { useEditorReadOnly } from "@udecode/plate-common";

import { MarkToolbarButton } from "./mark-toolbar-button";

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
            B
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
            I
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_UNDERLINE} tooltip="Underline (⌘+U)">
            U
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_STRIKETHROUGH} tooltip="Strikethrough (⌘+⇧+M)">
            S
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_CODE} tooltip="Code (⌘+E)">
            C
          </MarkToolbarButton>
        </>
      )}
    </>
  );
}
