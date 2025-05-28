'use client'

import { useState, useEffect, useCallback } from 'react'
import { SerializedEditorState, EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'

import { ParagraphNode, TextNode } from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'

import { cn } from '@/lib/utils'
import { editorTheme } from './themes/editor-theme'
import { ContentEditable } from './editor-ui/content-editable'
import { ToolbarPlugin } from './plugins/toolbar/toolbar-plugin'
import { HistoryToolbarPlugin } from './plugins/toolbar/history-toolbar-plugin'
import { BlockFormatDropDown } from './plugins/toolbar/block-format-toolbar-plugin'
import { FormatParagraph } from './plugins/toolbar/block-format/format-paragraph'
import { FormatHeading } from './plugins/toolbar/block-format/format-heading'
import { FormatBulletedList } from './plugins/toolbar/block-format/format-bulleted-list'
import { FormatNumberedList } from './plugins/toolbar/block-format/format-numbered-list'
import { FormatQuote } from './plugins/toolbar/block-format/format-quote'

const editorConfig = {
  namespace: 'NotionEditor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError: (error: Error) => {
    console.error('Editor error:', error)
  },
}

// Auto-save hook
function AutoSavePlugin({ 
  onSave,
  interval = 2000 
}: { 
  onSave: (content: SerializedEditorState) => void
  interval?: number 
}) {
  const [editor] = useLexicalComposerContext()
  const [lastSaved, setLastSaved] = useState<string>('')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleSave = () => {
      editor.read(() => {
        const editorState = editor.getEditorState()
        const content = editorState.toJSON()
        const contentString = JSON.stringify(content)
        
        if (contentString !== lastSaved) {
          onSave(content)
          setLastSaved(contentString)
        }
      })
    }

    const resetTimer = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleSave, interval)
    }

    const unregister = editor.registerUpdateListener(() => {
      resetTimer()
    })

    return () => {
      clearTimeout(timeoutId)
      unregister()
    }
  }, [editor, onSave, interval, lastSaved])

  return null
}

interface NotionEditorProps {
  content?: SerializedEditorState
  placeholder?: string
  editable?: boolean
  className?: string
  onChange?: (content: SerializedEditorState) => void
  onSave?: (content: SerializedEditorState) => void
  autoSave?: boolean
  autoSaveInterval?: number
}

export function NotionEditor({
  content,
  placeholder = 'Start writing...',
  editable = true,
  className,
  onChange,
  onSave,
  autoSave = false,
  autoSaveInterval = 2000,
}: NotionEditorProps) {
  const [isEditable, setIsEditable] = useState(editable)
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  const onRef = useCallback((elem: HTMLDivElement) => {
    if (elem !== null) {
      setFloatingAnchorElem(elem)
    }
  }, [])

  const handleChange = useCallback((editorState: EditorState) => {
    const serializedState = editorState.toJSON()
    onChange?.(serializedState)
  }, [onChange])

  const handleSave = useCallback((content: SerializedEditorState) => {
    onSave?.(content)
  }, [onSave])

  const initialConfig = {
    ...editorConfig,
    editable: isEditable,
    ...(content ? { editorState: JSON.stringify(content) } : {}),
  }

  return (
    <div className={cn("w-full", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative bg-white rounded-lg border border-gray-200 focus-within:border-blue-500 transition-colors">
          {/* Toolbar - only show when editable */}
          {isEditable && (
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50">
                  <HistoryToolbarPlugin />
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={['h1', 'h2', 'h3']} />
                    <FormatBulletedList />
                    <FormatNumberedList />
                    <FormatQuote />
                  </BlockFormatDropDown>
                </div>
              )}
            </ToolbarPlugin>
          )}

          {/* Editor Content */}
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <div className="relative">
                  <div ref={onRef}>
                    <ContentEditable
                      placeholder={placeholder}
                      className={cn(
                        "min-h-[200px] px-6 py-4 outline-none resize-none overflow-auto",
                        "prose prose-slate max-w-none",
                        "prose-headings:font-semibold prose-headings:tracking-tight",
                        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
                        "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3",
                        "prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2",
                        "prose-p:my-2 prose-p:leading-relaxed",
                        "prose-ul:my-2 prose-ol:my-2",
                        "prose-li:my-1",
                        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300",
                        "prose-blockquote:pl-4 prose-blockquote:italic",
                        !isEditable && "cursor-default"
                      )}
                    />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* Plugins */}
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ClickableLinkPlugin />
            
            {/* Auto-save plugin */}
            {autoSave && onSave && (
              <AutoSavePlugin onSave={handleSave} interval={autoSaveInterval} />
            )}
            
            {/* Change handler */}
            {onChange && (
              <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
            )}
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
} 