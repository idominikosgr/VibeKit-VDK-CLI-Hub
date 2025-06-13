'use client'

import { useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LockIcon, LockOpenIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function EditModeTogglePlugin() {
  const [editor] = useLexicalComposerContext()
  const [isEditable, setIsPencilSimpleable] = useState(() => editor.isEditable())

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={'ghost'}
          onClick={() => {
            editor.setEditable(!editor.isEditable())
            setIsPencilSimpleable(editor.isEditable())
          }}
          title="Read-Only Mode"
          aria-label={`${!isEditable ? 'Unlock' : 'Lock'} read-only mode`}
          size={'sm'}
          className="p-2"
        >
          {isEditable ? (
            <LockIcon className="size-4" />
          ) : (
            <LockOpenIcon className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isEditable ? 'View Only Mode' : 'PencilSimple Mode'}
      </TooltipContent>
    </Tooltip>
  )
}
