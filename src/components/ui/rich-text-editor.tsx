'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Highlighter,
  Palette,
  Undo,
  Redo,
  CheckSquare
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isAdmin?: boolean;
  editable?: boolean;
  className?: string;
  onSave?: () => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  isAdmin = false,
  editable = true,
  className,
  onSave,
  autoSave = false,
  autoSaveInterval = 5000,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-sm font-medium',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border text-sm font-mono',
        },
      }),
    ],
    content,
    editable: editable && isAdmin,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none',
          'focus:outline-none min-h-[200px] p-4',
          !isAdmin && 'pointer-events-none',
          className
        ),
      },
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave || !editor) return;

    const interval = setInterval(() => {
      if (editor.getHTML() !== content) {
        onSave();
        setLastSaved(new Date());
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, onSave, autoSaveInterval, editor, content]);

  const addLink = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkOpen(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageOpen(false);
    }
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return <div className="h-32 bg-gray-50 animate-pulse rounded-lg" />;
  }

  if (!isAdmin) {
    return (
      <div className={cn("prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none", className)}>
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-200' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Quote and Code Block */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={editor.isActive('link') ? 'bg-gray-200' : ''}
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <div className="flex gap-2">
                <Button onClick={addLink} size="sm">Add Link</Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setIsLinkOpen(false);
                  }}
                >
                  Remove Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <Button onClick={addImage} size="sm">Add Image</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Table */}
        <Button variant="ghost" size="sm" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Highlight */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'bg-gray-200' : ''}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Save Status */}
        {autoSave && lastSaved && (
          <div className="ml-auto text-xs text-gray-500">
            Saved {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
} 