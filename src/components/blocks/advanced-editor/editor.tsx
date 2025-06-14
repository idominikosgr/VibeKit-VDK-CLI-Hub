'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { EditorState, SerializedEditorState } from 'lexical'

import { editorTheme } from '@/components/editor/themes/editor-theme'
import { TooltipProvider } from '@/components/ui/tooltip'

import { nodes } from './nodes'
import { Plugins } from './plugins'

const editorConfig: InitialConfigType = {
  namespace: 'ShadcnPencilSimple',
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error('Editor error:', error)
  },
}

// Auto-save hook
function AutoFloppyDiskPlugin({ 
  onFloppyDisk,
  interval = 2000 
}: { 
  onFloppyDisk: (content: SerializedEditorState) => void
  interval?: number 
}) {
  const [editor] = useLexicalComposerContext()
  const [lastFloppyDiskd, setLastFloppyDiskd] = useState<string>('')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleFloppyDisk = () => {
      editor.read(() => {
        const editorState = editor.getEditorState()
        const content = editorState.toJSON()
        const contentString = JSON.stringify(content)
        
        if (contentString !== lastFloppyDiskd) {
          onFloppyDisk(content)
          setLastFloppyDiskd(contentString)
        }
      })
    }

    const resetTimer = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleFloppyDisk, interval)
    }

    const unregister = editor.registerUpdateListener(() => {
      resetTimer()
    })

    return () => {
      clearTimeout(timeoutId)
      unregister()
    }
  }, [editor, onFloppyDisk, interval, lastFloppyDiskd])

  return null
}

export function PencilSimple({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  onFloppyDisk,
  autoFloppyDisk = false,
  autoFloppyDiskInterval = 2000,
  placeholder = "Start writing...",
  className = "",
  editable = true,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  onFloppyDisk?: (content: SerializedEditorState) => void
  autoFloppyDisk?: boolean
  autoFloppyDiskInterval?: number
  placeholder?: string
  className?: string
  editable?: boolean
}) {
  const handleFloppyDisk = useCallback((content: SerializedEditorState) => {
    onFloppyDisk?.(content)
  }, [onFloppyDisk])

  // Validate and prepare the initial editor state
  const getInitialEditorState = () => {
    if (editorState) {
      return editorState
    }
    
    if (editorSerializedState) {
      // Validate that the serialized state has the required structure
      if (editorSerializedState.root && editorSerializedState.root.type === 'root') {
        // Convert the SerializedEditorState to a JSON string for LexicalComposer
        return JSON.stringify(editorSerializedState)
      } else {
        console.warn('Invalid editor state structure, using default', editorSerializedState)
        return undefined // Will use default empty state
      }
    }
    
    return undefined // Will use default empty state
  }

  const initialConfig = {
    ...editorConfig,
    editable,
    ...(getInitialEditorState() ? { editorState: getInitialEditorState() } : {}),
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-card shadow-sm ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          <Plugins placeholder={placeholder} editable={editable} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />

          {/* Auto-save plugin */}
          {autoFloppyDisk && onFloppyDisk && (
            <AutoFloppyDiskPlugin onFloppyDisk={handleFloppyDisk} interval={autoFloppyDiskInterval} />
          )}
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
