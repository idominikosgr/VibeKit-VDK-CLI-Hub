import { useState } from 'react';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { LinkPlugin } from "@/components/editor/plugins/link-plugin";

import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";

import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* Toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="sticky top-0 z-10 flex gap-2 overflow-auto border-b p-2 bg-background/95 backdrop-blur-sm">
            <HistoryToolbarPlugin />
            <div className="w-px h-6 bg-border mx-1" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
          </div>
        )}
      </ToolbarPlugin>

      {/* Editor content */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <div className="" ref={onRef}>
                <ContentEditable 
                  placeholder="Start writing your documentation..." 
                  className="ContentEditable__root relative block min-h-72 overflow-auto px-8 py-6 focus:outline-none prose prose-slate dark:prose-invert max-w-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        
        {/* Core editing plugins */}
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ClickableLinkPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
        
        {/* Markdown support */}
        <MarkdownShortcutPlugin
          transformers={[
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
      </div>
    </div>
  );
}
