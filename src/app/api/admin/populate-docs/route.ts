import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/admin-auth';
import { SerializedEditorState } from 'lexical';
import fs from 'fs';
import path from 'path';

// Markdown to Lexical converter utility
function markdownToLexical(markdown: string): SerializedEditorState {
  const lines = markdown.split('\n');
  const children: any[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (!line) {
      i++;
      continue;
    }
    
    // Headers
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0]?.length || 1;
      const text = line.replace(/^#+\s*/, '');
      const tag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      
      children.push({
        children: [{
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text,
          type: 'text',
          version: 1,
        }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'heading',
        tag,
        version: 1,
      });
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const language = line.replace('```', '').trim();
      i++;
      const codeLines: string[] = [];
      
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      children.push({
        children: [{
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: codeLines.join('\n'),
          type: 'text',
          version: 1,
        }],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'code',
        language: language || 'text',
        version: 1,
      });
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      const isOrdered = /^\d+\.\s/.test(line);
      const listItems: any[] = [];
      
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (!currentLine) {
          i++;
          continue;
        }
        
        if ((isOrdered && /^\d+\.\s/.test(currentLine)) || 
            (!isOrdered && (currentLine.startsWith('- ') || currentLine.startsWith('* ')))) {
          const text = currentLine.replace(/^(?:\d+\.\s|[-*]\s)/, '');
          
          // Check for bold formatting **text**
          const textNodes: any[] = [];
          const boldRegex = /\*\*(.*?)\*\*/g;
          let lastIndex = 0;
          let match;
          
          while ((match = boldRegex.exec(text)) !== null) {
            // Add text before bold
            if (match.index > lastIndex) {
              textNodes.push({
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: text.slice(lastIndex, match.index),
                type: 'text',
                version: 1,
              });
            }
            
            // Add bold text
            textNodes.push({
              detail: 0,
              format: 1, // Bold format
              mode: 'normal',
              style: '',
              text: match[1],
              type: 'text',
              version: 1,
            });
            
            lastIndex = match.index + match[0].length;
          }
          
          // Add remaining text
          if (lastIndex < text.length) {
            textNodes.push({
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text.slice(lastIndex),
              type: 'text',
              version: 1,
            });
          }
          
          // If no formatting found, add simple text
          if (textNodes.length === 0) {
            textNodes.push({
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            });
          }
          
          listItems.push({
            children: textNodes,
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'listitem',
            listType: isOrdered ? 'number' : 'bullet',
            value: listItems.length + 1,
            version: 1,
          });
        } else {
          break;
        }
        i++;
      }
      
      if (listItems.length > 0) {
        children.push({
          children: listItems,
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'list',
          listType: isOrdered ? 'number' : 'bullet',
          start: 1,
          version: 1,
        });
      }
      continue;
    }
    // Regular paragraphs
    else {
      // Handle text with formatting
      const textNodes: any[] = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      const codeRegex = /`([^`]+)`/g;
      
      let processedText = line;
      let lastIndex = 0;
      
      // Process bold and code formatting
      const allMatches: Array<{index: number, length: number, text: string, format: number}> = [];
      
      // Find bold matches
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          text: match[1],
          format: 1 // Bold
        });
      }
      
      // Find code matches
      const codeRegexReset = /`([^`]+)`/g;
      while ((match = codeRegexReset.exec(line)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          text: match[1],
          format: 16 // Code
        });
      }
      
      // Sort matches by index
      allMatches.sort((a, b) => a.index - b.index);
      
      lastIndex = 0;
      for (const formatMatch of allMatches) {
        // Add text before formatted text
        if (formatMatch.index > lastIndex) {
          const beforeText = line.slice(lastIndex, formatMatch.index);
          if (beforeText) {
            textNodes.push({
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: beforeText,
              type: 'text',
              version: 1,
            });
          }
        }
        
        // Add formatted text
        textNodes.push({
          detail: 0,
          format: formatMatch.format,
          mode: 'normal',
          style: '',
          text: formatMatch.text,
          type: 'text',
          version: 1,
        });
        
        lastIndex = formatMatch.index + formatMatch.length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        const remainingText = line.slice(lastIndex);
        if (remainingText) {
          textNodes.push({
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: remainingText,
            type: 'text',
            version: 1,
          });
        }
      }
      
      // If no formatting found, add simple text
      if (textNodes.length === 0) {
        textNodes.push({
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: line,
          type: 'text',
          version: 1,
        });
      }
      
      children.push({
        children: textNodes,
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      });
    }
    
    i++;
  }
  
  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };
}

// Documentation pages configuration
const documentationPages = [
  {
    filename: 'getting-started-guide.md',
    title: 'Getting Started Guide',
    slug: 'getting-started',
    excerpt: 'Learn how to set up and start using Vibe Coding Rules Hub for your AI-powered development workflow.',
    icon: '🚀',
    order: 0,
  },
  {
    filename: 'installation-setup.md',
    title: 'Installation & Setup',
    slug: 'installation-setup',
    excerpt: 'Complete guide to installing and configuring Vibe Coding Rules Hub for development and production.',
    icon: '⚙️',
    order: 1,
  },
  {
    filename: 'user-guide.md',
    title: 'User Guide',
    slug: 'user-guide',
    excerpt: 'Comprehensive guide covering all features and workflows in Vibe Coding Rules Hub.',
    icon: '📚',
    order: 2,
  },
  {
    filename: 'system-architecture.md',
    title: 'System Architecture',
    slug: 'system-architecture',
    excerpt: 'Technical overview of the modern, scalable architecture with AI-first principles.',
    icon: '🏗️',
    order: 3,
  },
  {
    filename: 'agentic-ai-development.md',
    title: 'Agentic AI Development',
    slug: 'agentic-ai-development',
    excerpt: 'Guide to building autonomous AI systems that demonstrate agency and proactive behavior.',
    icon: '🤖',
    order: 4,
  },
  {
    filename: 'ai-agent-integration.md',
    title: 'AI Agent Integration',
    slug: 'ai-agent-integration',
    excerpt: 'Integrate AI agents with Vibe Coding Rules Hub for enhanced development workflows.',
    icon: '🔗',
    order: 5,
  },
  {
    filename: 'knowledge-graphs.md',
    title: 'Knowledge Graphs',
    slug: 'knowledge-graphs',
    excerpt: 'Design and implement knowledge graphs for AI systems to maintain rich contextual understanding.',
    icon: '🧠',
    order: 6,
  },
  {
    filename: 'sequential-reasoning.md',
    title: 'Sequential Reasoning',
    slug: 'sequential-reasoning',
    excerpt: 'Patterns and techniques for implementing sequential reasoning in AI systems.',
    icon: '🔄',
    order: 7,
  },
];

export async function POST(request: NextRequest) {
  try {
    // Check admin permissions
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: adminCheck.error || 'Admin access required' 
      }, { status: adminCheck.error === 'Authentication required' ? 401 : 403 });
    }

    const supabase = await createDatabaseSupabaseClient();
    const documentationDir = path.join(process.cwd(), '..', 'documentation');

    // Get user for author_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const results = [];
    
    // Clear existing documentation pages first
    const { error: clearError } = await supabase
      .from('documentation_pages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (clearError) {
      console.warn('Warning clearing existing docs:', clearError);
    }

    for (const docPage of documentationPages) {
      try {
        const filePath = path.join(documentationDir, docPage.filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.warn(`File not found: ${filePath}`);
          continue;
        }

        // Read markdown content
        const markdownContent = fs.readFileSync(filePath, 'utf-8');
        
        // Convert to Lexical format
        const lexicalContent = markdownToLexical(markdownContent);
        
        // Generate slug uniqueness
        let slug = docPage.slug;
        let counter = 1;
        while (true) {
          const { data: existingPage } = await supabase
            .from('documentation_pages')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
          
          if (!existingPage) {
            break;
          }
          
          slug = `${docPage.slug}-${counter}`;
          counter++;
        }

        // Insert into database
        const { data: insertedPage, error: insertError } = await supabase
          .from('documentation_pages')
          .insert({
            title: docPage.title,
            slug,
            content: JSON.stringify(lexicalContent),
            excerpt: docPage.excerpt,
            icon: docPage.icon,
            order_index: docPage.order,
            status: 'published',
            visibility: 'public',
            content_type: 'rich_text',
            metadata: {
              source: 'markdown_import',
              original_filename: docPage.filename,
              imported_at: new Date().toISOString(),
            },
            author_id: user.id,
            last_edited_by: user.id,
            path: `/docs/${slug}`,
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Error inserting ${docPage.title}:`, insertError);
          results.push({
            title: docPage.title,
            success: false,
            error: insertError.message,
          });
        } else {
          results.push({
            title: docPage.title,
            slug,
            id: insertedPage.id,
            success: true,
          });
        }
      } catch (fileError) {
        console.error(`Error processing ${docPage.filename}:`, fileError);
        results.push({
          title: docPage.title,
          success: false,
          error: `File processing error: ${fileError}`,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({ 
      success: true,
      message: `Documentation populated successfully. ${successCount} pages created, ${errorCount} errors.`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
      }
    });

  } catch (error) {
    console.error('Error populating documentation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to populate documentation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 