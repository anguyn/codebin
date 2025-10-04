'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/common/input';
import { Textarea } from '@/components/common/textarea';
import { CodeEditor } from '@/components/blocks/code-editor';
import { Badge } from '@/components/common/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { toast } from 'sonner';
import { Loader2, X, Zap } from 'lucide-react';
import { Snippet } from '@/types';

const snippetSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  isPublic: z.boolean().default(true),
  complexity: z.string().optional(),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

interface SnippetFormProps {
  locale: string;
  snippet?: Snippet;
  mode: 'create' | 'edit';
}

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'ruby',
  'go',
  'rust',
  'php',
  'swift',
  'kotlin',
  'html',
  'css',
  'sql',
];

export function SnippetForm({ locale, snippet, mode }: SnippetFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    snippet?.tags.filter(t => t.tag.type === 'TOPIC').map(t => t.tag.name) ||
      [],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema) as unknown as Resolver<
      SnippetFormData,
      object
    >,
    defaultValues: {
      title: snippet?.title || '',
      description: snippet?.description || '',
      code: snippet?.code || '',
      language: snippet?.language || 'javascript',
      tags: selectedTags,
      isPublic: snippet?.isPublic ?? true,
      complexity: snippet?.complexity || '',
    },
  });

  const watchedCode = watch('code');
  const watchedLanguage = watch('language');

  useEffect(() => {
    setValue('tags', selectedTags);
  }, [selectedTags, setValue]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAnalyzeComplexity = async () => {
    if (!watchedCode) {
      toast.error('Please enter some code first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: watchedCode,
          language: watchedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze complexity');
      }

      const data = await response.json();
      setValue('complexity', data.complexity);
      toast.success(`Complexity detected: ${data.complexity}`);
    } catch (error) {
      toast.error('Failed to analyze complexity');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit: SubmitHandler<SnippetFormData> = async data => {
    setIsLoading(true);

    try {
      const url =
        mode === 'create' ? '/api/snippets' : `/api/snippets/${snippet?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save snippet');
      }

      const savedSnippet = await response.json();

      toast.success(
        mode === 'create'
          ? 'Snippet created successfully!'
          : 'Snippet updated successfully!',
      );

      router.push(`/${locale}/snippets/${savedSnippet.slug}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          placeholder="e.g., Binary Search Implementation"
          disabled={isLoading}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-[var(--color-destructive)]">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Brief description of what this code does..."
          rows={3}
          disabled={isLoading}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-[var(--color-destructive)]">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          Language *
        </label>
        <select
          id="language"
          className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          {...register('language')}
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="text-sm text-[var(--color-destructive)]">
            {errors.language.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <CodeEditor
              value={field.value}
              onChange={field.onChange}
              language={watchedLanguage}
              placeholder="Paste your code here..."
            />
          )}
        />
        {errors.code && (
          <p className="text-sm text-[var(--color-destructive)]">
            {errors.code.message}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Time Complexity (Optional)
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAnalyzeComplexity}
              disabled={isAnalyzing || !watchedCode}
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="complexity"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="e.g., O(n), O(log n), O(n²)"
                {...field}
                disabled={isLoading}
              />
            )}
          />
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            Click "Analyze" to automatically detect time complexity or enter
            manually
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags (Max 5)</label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            disabled={isLoading || selectedTags.length >= 5}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTag}
            disabled={isLoading || selectedTags.length >= 5}
          >
            Add
          </Button>
        </div>
        {selectedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-[var(--color-destructive)]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {errors.tags && (
          <p className="text-sm text-[var(--color-destructive)]">
            {errors.tags.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          className="h-4 w-4 rounded border-[var(--color-input)]"
          {...register('isPublic')}
          disabled={isLoading}
        />
        <label
          htmlFor="isPublic"
          className="cursor-pointer text-sm font-medium"
        >
          Make this snippet public
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Snippet' : 'Update Snippet'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
