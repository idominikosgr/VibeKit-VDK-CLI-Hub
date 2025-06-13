import { useState } from 'react';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

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

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';

import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  Code,
  Link,
  Image,
  Table,
  PaintBrush,
  TextT,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
} from '@phosphor-icons/react';

export function Plugins({
  placeholder = "Start writing your documentation...",
  editable = true,
}: {
  placeholder?: string
  editable?: boolean
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* Enhanced Toolbar - only show when editable */}
      {editable && (
        <ToolbarPlugin>
          {({ blockType }) => (
            <div className="sticky top-0 z-10 flex gap-1 overflow-auto border-b p-2 bg-background/95 backdrop-blur-sm">
              {/* History */}
              <HistoryToolbarPlugin />
              <Separator orientation="vertical" className="h-8 mx-1" />
              
              {/* Block Format */}
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatCheckList />
                <FormatQuote />
              </BlockFormatDropDown>
              
              <Separator orientation="vertical" className="h-8 mx-1" />
              
              {/* Text Formatting */}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TextB className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TextItalic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TextUnderline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TextStrikethrough className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8 mx-1" />
              
              {/* Insert Elements */}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Link">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Image">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Table">
                  <Table className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8 mx-1" />
              
              {/* Alignment */}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Left">
                  <TextAlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Center">
                  <TextAlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Right">
                  <TextAlignRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-8 mx-1" />
              
              {/* Advanced Formatting */}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
                  <PaintBrush className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Font Style">
                  <TextT className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </ToolbarPlugin>
      )}

      {/* PencilSimpleor content */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <div className="" ref={onRef}>
                <ContentEditable 
                  placeholder={placeholder}
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
        
        {/* Table support */}
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        
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
