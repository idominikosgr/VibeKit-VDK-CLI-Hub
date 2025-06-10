'use client'

import { useState } from 'react'
import { SerializedEditorState } from 'lexical'
import { Editor } from '@/components/blocks/editor-00'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Sparkles, Code, List, Link, Type, Undo, Redo } from 'lucide-react'

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '🚀 Welcome to the Enhanced Documentation Editor',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'heading',
        tag: 'h1',
        version: 1,
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'This editor includes comprehensive features for creating beautiful documentation:',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
      {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Rich Text Formatting',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' - Bold, italic, and other text styles',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            listType: 'bullet',
            value: 1,
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Multiple Heading Levels',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' - H1 through H6 support',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            listType: 'bullet',
            value: 2,
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Lists & Checklists',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' - Bulleted, numbered, and task lists',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            listType: 'bullet',
            value: 3,
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Markdown Shortcuts',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' - Type # for headings, * for lists, etc.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            listType: 'bullet',
            value: 4,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'list',
        listType: 'bullet',
        start: 1,
        version: 1,
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Try the toolbar above or use markdown shortcuts to format your text!',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState

export default function EditorDemoPage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue)

  const features = [
    {
      icon: Type,
      title: "Rich Text Formatting",
      description: "Bold, italic, underline, and more text formatting options"
    },
    {
      icon: FileText,
      title: "Multiple Heading Levels",
      description: "H1 through H6 headings for proper document structure"
    },
    {
      icon: List,
      title: "Lists & Checklists",
      description: "Bulleted lists, numbered lists, and interactive task lists"
    },
    {
      icon: Link,
      title: "Smart Links",
      description: "Automatic link detection and clickable links"
    },
    {
      icon: Code,
      title: "Markdown Shortcuts",
      description: "Type markdown syntax for instant formatting"
    },
    {
      icon: Undo,
      title: "History & Undo",
      description: "Full undo/redo support with keyboard shortcuts"
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-primary/70" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Enhanced Documentation Editor</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A powerful, feature-rich editor built with Lexical and shadcn/ui components for creating beautiful documentation.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <FileText className="w-3 h-3 mr-1" />
              Rich Text
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <Code className="w-3 h-3 mr-1" />
              Markdown
            </Badge>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <List className="w-3 h-3 mr-1" />
              Lists
            </Badge>
            <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
              <Link className="w-3 h-3 mr-1" />
              Links
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary/70" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editor Demo */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Live Editor Demo
                </CardTitle>
                <CardDescription>
                  Try out all the features in the editor below
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditorState(initialValue)}
                className="hover:bg-primary/5 hover:text-primary hover:border-primary/30"
              >
                <Undo className="w-4 h-4 mr-2" />
                Reset Content
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Editor
              editorSerializedState={editorState}
              onSerializedChange={(value: SerializedEditorState) => setEditorState(value)}
              placeholder="Start writing your documentation..."
              className="border-0 shadow-none"
            />
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8 bg-linear-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Markdown Shortcuts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-muted px-1 rounded"># </code> for H1 heading</li>
                  <li><code className="bg-muted px-1 rounded">## </code> for H2 heading</li>
                  <li><code className="bg-muted px-1 rounded">* </code> for bullet list</li>
                  <li><code className="bg-muted px-1 rounded">1. </code> for numbered list</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Keyboard Shortcuts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-muted px-1 rounded">Ctrl+Z</code> to undo</li>
                  <li><code className="bg-muted px-1 rounded">Ctrl+Y</code> to redo</li>
                  <li><code className="bg-muted px-1 rounded">Ctrl+B</code> for bold</li>
                  <li><code className="bg-muted px-1 rounded">Ctrl+I</code> for italic</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

