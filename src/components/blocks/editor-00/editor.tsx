'use client'

import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { EditorState, SerializedEditorState } from 'lexical'

import { editorTheme } from '@/components/editor/themes/editor-theme'
import { TooltipProvider } from '@/components/ui/tooltip'

import { nodes } from './nodes'
import { Plugins } from './plugins'

const editorConfig: InitialConfigType = {
  namespace: 'ShadcnEditor',
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error('Editor error:', error)
  },
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  placeholder = "Start writing...",
  className = "",
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`overflow-hidden rounded-xl border bg-card shadow-sm ${className}`}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
