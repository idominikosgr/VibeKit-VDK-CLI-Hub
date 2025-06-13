import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'

import { useToolbarContext } from '@/components/editor/context/toolbar-context'
import { SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CaretDownIcon, TextTIcon } from '@phosphor-icons/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { blockTypeToBlockName } from '@/components/editor/plugins/toolbar/block-format/block-format-data'

export function FormatHeading({ levels = [] }: { levels: HeadingTagType[] }) {
  const { activeEditor, blockType } = useToolbarContext()

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      })
    }
  }

  const HeadingIcon = ({ level }: { level: string }) => {
    const blockConfig = blockTypeToBlockName[level]
    
    // Safety check to prevent undefined access
    if (!blockConfig) {
      console.warn(`Block type '${level}' not found in blockTypeToBlockName`)
      return <TextTIcon className="size-4" /> // Default fallback icon
    }
    
    return <>{blockConfig.icon}</>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <HeadingIcon level={blockType} />
          <CaretDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {levels.map((level) => {
          const blockConfig = blockTypeToBlockName[level]
          
          // Safety check here too
          if (!blockConfig) {
            return null
          }
          
          return (
            <DropdownMenuItem
              key={level}
              onClick={() => formatHeading(level)}
              className="flex items-center gap-2"
            >
              {blockConfig.icon}
              <span>{blockConfig.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
