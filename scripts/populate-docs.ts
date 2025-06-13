import { createClient } from '@supabase/supabase-js';
import { SerializedEditorState } from 'lexical';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

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
          
          // Handle text formatting
          const textNodes = parseFormattedText(text);
          
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
      const textNodes = parseFormattedText(line);
      
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

// Helper function to parse formatted text (bold, code, etc.)
function parseFormattedText(text: string): any[] {
  const textNodes: any[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`([^`]+)`/g;
  
  // Find all formatting matches
  const allMatches: Array<{index: number, length: number, text: string, format: number}> = [];
  
  // Find bold matches
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    allMatches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      format: 1 // Bold
    });
  }
  
  // Find code matches
  const codeRegexReset = /`([^`]+)`/g;
  while ((match = codeRegexReset.exec(text)) !== null) {
    allMatches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      format: 16 // Code
    });
  }
  
  // Sort matches by index
  allMatches.sort((a, b) => a.index - b.index);
  
  let lastIndex = 0;
  for (const formatMatch of allMatches) {
    // Add text before formatted text
    if (formatMatch.index > lastIndex) {
      const beforeText = text.slice(lastIndex, formatMatch.index);
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
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
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
      text,
      type: 'text',
      version: 1,
    });
  }
  
  return textNodes;
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

async function main() {
  try {
    console.log('🚀 Starting documentation population...');
    
    const documentationDir = path.join(process.cwd(), 'documentation');
    
    // First, get or create a dummy profile for author_id
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }
    
    let authorId: string | null;
    if (profiles && profiles.length > 0) {
      authorId = profiles[0].id;
      console.log(`📝 Using author ID: ${authorId}`);
    } else {
      // If no profiles exist, use null (allowed by schema)
      authorId = null;
      console.log('📝 Using null author ID (no profiles found)');
    }

    const results = [];
    
    // Clear existing documentation pages first
    console.log('🧹 Clearing existing documentation pages...');
    const { error: clearError } = await supabase
      .from('documentation_pages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (clearError) {
      console.warn('Warning clearing existing docs:', clearError);
    }

    for (const docPage of documentationPages) {
      try {
        console.log(`📄 Processing: ${docPage.title}`);
        
        const filePath = path.join(documentationDir, docPage.filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️  File not found: ${filePath}`);
          continue;
        }

        // Read markdown content
        const markdownContent = fs.readFileSync(filePath, 'utf-8');
        
        // Convert to Lexical format
        const lexicalContent = markdownToLexical(markdownContent);
        
        // Generate unique slug
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
            author_id: authorId,
            last_edited_by: authorId,
            path: `/docs/${slug}`,
          })
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Error inserting ${docPage.title}:`, insertError);
          results.push({
            title: docPage.title,
            success: false,
            error: insertError.message,
          });
        } else {
          console.log(`✅ Created: ${docPage.title} (slug: ${slug})`);
          results.push({
            title: docPage.title,
            slug,
            id: insertedPage.id,
            success: true,
          });
        }
      } catch (fileError) {
        console.error(`❌ Error processing ${docPage.filename}:`, fileError);
        results.push({
          title: docPage.title,
          success: false,
          error: `File processing error: ${fileError}`,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully created: ${successCount} pages`);
    console.log(`❌ Failed: ${errorCount} pages`);
    
    if (errorCount > 0) {
      console.log('\n❌ Errors:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.title}: ${result.error}`);
      });
    }
    
    console.log('\n🎉 Documentation population completed!');

  } catch (error) {
    console.error('💥 Error populating documentation:', error);
    process.exit(1);
  }
}

main(); 