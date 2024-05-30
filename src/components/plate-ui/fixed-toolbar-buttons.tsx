import React from "react";

import { MARK_BOLD, MARK_ITALIC, MARK_STRIKETHROUGH, MARK_UNDERLINE } from "@udecode/plate-basic-marks";

import { MarkToolbarButton } from "./mark-toolbar-button";
import { IconBold, IconItalic, IconStrikethrough, IconUnderline } from "@tabler/icons-react";

export function FixedToolbarButtons() {
  return (
    <div className="flex">
      <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
        <IconBold />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
        <IconItalic />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_UNDERLINE} tooltip="Underline (⌘+U)">
        <IconUnderline />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_STRIKETHROUGH} tooltip="Strikethrough (⌘+⇧+M)">
        <IconStrikethrough />
      </MarkToolbarButton>
    </div>
  );
}
