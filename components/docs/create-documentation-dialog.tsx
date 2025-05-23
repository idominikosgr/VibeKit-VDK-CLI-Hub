'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { 
  Plus, 
  FileText, 
  Folder, 
  Tag, 
  Palette, 
  Layout, 
  BookOpen,
  Code,
  HelpCircle,
  Lightbulb,
  Wrench,
  X,
  Eye,
  EyeOff,
  Globe,
  Users,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentationTag, DocumentationTemplate, DocumentationPageWithRelations } from '@/types/documentation';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().optional(),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  icon: z.string().optional(),
  cover_image: z.string().url('Invalid URL').optional().or(z.literal('')),
  parent_id: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  content_type: z.enum(['markdown', 'rich_text', 'template']).default('rich_text'),
  template_id: z.string().optional(),
  visibility: z.enum(['public', 'private', 'team']).default('public'),
  status: z.enum(['draft', 'published']).default('draft'),
  tag_ids: z.array(z.string()).default([]),
  content: z.string().min(1, 'Content is required'),
  metadata: z.record(z.any()).default({}),
});

type FormData = z.infer<typeof formSchema>;

interface CreateDocumentationDialogProps {
  onCreatePage: (data: FormData) => Promise<DocumentationPageWithRelations>;
  tags?: DocumentationTag[];
  templates?: DocumentationTemplate[];
  parentPages?: Array<{ id: string; title: string; path: string }>;
  categories?: Array<{ id: string; name: string; subcategories?: Array<{ id: string; name: string }> }>;
  isAdmin?: boolean;
}

const ICON_OPTIONS = [
  { value: '📚', label: 'Books' },
  { value: '📖', label: 'Book' },
  { value: '📝', label: 'Note' },
  { value: '🚀', label: 'Rocket' },
  { value: '⚡', label: 'Lightning' },
  { value: '🔧', label: 'Wrench' },
  { value: '🎯', label: 'Target' },
  { value: '💡', label: 'Lightbulb' },
  { value: '🔥', label: 'Fire' },
  { value: '✨', label: 'Sparkles' },
  { value: '🎨', label: 'Art' },
  { value: '🏗️', label: 'Construction' },
  { value: '🧩', label: 'Puzzle' },
  { value: '🎓', label: 'Graduate' },
  { value: '🔍', label: 'Search' },
];

const TEMPLATE_TYPES = [
  { 
    type: 'guide', 
    icon: <BookOpen className="h-5 w-5" />, 
    title: 'Guide',
    description: 'Step-by-step instructions and tutorials'
  },
  { 
    type: 'api_reference', 
    icon: <Code className="h-5 w-5" />, 
    title: 'API Reference',
    description: 'Technical API documentation'
  },
  { 
    type: 'concept', 
    icon: <Lightbulb className="h-5 w-5" />, 
    title: 'Concept',
    description: 'Explanatory content and theory'
  },
  { 
    type: 'troubleshooting', 
    icon: <Wrench className="h-5 w-5" />, 
    title: 'Troubleshooting',
    description: 'Problem-solving and FAQ content'
  },
];

export function CreateDocumentationDialog({
  onCreatePage,
  tags = [],
  templates = [],
  parentPages = [],
  categories = [],
  isAdmin = false,
}: CreateDocumentationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentationTemplate | null>(null);
  const [contentPreview, setContentPreview] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      icon: '',
      cover_image: '',
      content_type: 'rich_text',
      visibility: 'public',
      status: 'draft',
      tag_ids: [],
      content: '',
      metadata: {},
    },
  });

  const { watch, setValue, getValues } = form;
  const watchTitle = watch('title');
  const watchContentType = watch('content_type');
  const watchVisibility = watch('visibility');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, setValue]);

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      setValue('tag_ids', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue('tag_ids', updatedTags);
  };

  const selectTemplate = (template: DocumentationTemplate) => {
    setSelectedTemplate(template);
    setValue('template_id', template.id);
    setValue('content_type', 'template');
    setValue('content', template.content_template);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await onCreatePage(data);
      setOpen(false);
      form.reset();
      setSelectedTags([]);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Page
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Documentation Page
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="styling">Styling</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter page title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="auto-generated-slug" {...field} />
                        </FormControl>
                        <FormDescription>Auto-generated from title</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the page..." 
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Optional summary that appears in listings</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Content Type</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContentPreview(!contentPreview)}
                      >
                        {contentPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {contentPreview ? 'Edit' : 'Preview'}
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="content_type"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rich_text">Rich Text Editor</SelectItem>
                            <SelectItem value="markdown">Markdown</SelectItem>
                            <SelectItem value="template">Template-based</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchContentType === 'template' && (
                    <div className="space-y-4">
                      <Label>Choose Template</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                          <Card 
                            key={template.id} 
                            className={cn(
                              "cursor-pointer transition-colors hover:bg-gray-50",
                              selectedTemplate?.id === template.id && "border-blue-500 bg-blue-50"
                            )}
                            onClick={() => selectTemplate(template)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                {TEMPLATE_TYPES.find(t => t.type === template.template_type)?.icon}
                                <CardTitle className="text-sm">{template.name}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          {watchContentType === 'rich_text' ? (
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              isAdmin={true}
                              className="min-h-[300px]"
                            />
                          ) : (
                            <Textarea 
                              placeholder="Enter your content here..." 
                              className="min-h-[300px] font-mono text-sm"
                              {...field} 
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Organization Tab */}
              <TabsContent value="organization" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Page</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent page (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No parent (root level)</SelectItem>
                            {parentPages.map((page) => (
                              <SelectItem key={page.id} value={page.id}>
                                {page.path} - {page.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose a parent to create hierarchy</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          if (!selectedTags.includes(tag.name)) {
                            const updatedTags = [...selectedTags, tag.name];
                            setSelectedTags(updatedTags);
                            setValue('tag_ids', updatedTags);
                          }
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Styling Tab */}
              <TabsContent value="styling" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Icon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No icon</SelectItem>
                            {ICON_OPTIONS.map((icon) => (
                              <SelectItem key={icon.value} value={icon.value}>
                                <span className="flex items-center gap-2">
                                  <span className="text-lg">{icon.value}</span>
                                  {icon.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>Optional cover image for the page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Public - Anyone can view
                              </div>
                            </SelectItem>
                            <SelectItem value="team">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Team - Team members only
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Private - Admins only
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft - Not published</SelectItem>
                            <SelectItem value="published">Published - Live on site</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {watch('icon') && <span className="text-lg">{watch('icon')}</span>}
                        <span className="font-medium">{watch('title') || 'Untitled Page'}</span>
                        <Badge variant={watch('status') === 'published' ? 'default' : 'secondary'}>
                          {watch('status')}
                        </Badge>
                      </div>
                      {watch('excerpt') && (
                        <p className="text-gray-600 text-xs">{watch('excerpt')}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {watchVisibility === 'public' && <Globe className="h-3 w-3" />}
                        {watchVisibility === 'team' && <Users className="h-3 w-3" />}
                        {watchVisibility === 'private' && <Lock className="h-3 w-3" />}
                        <span className="capitalize">{watchVisibility}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Page
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 