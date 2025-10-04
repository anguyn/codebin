'use client';

import { useState } from 'react';
import { Textarea } from '@/components/common/textarea';
import { Button } from '@/components/common/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Eye } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  placeholder = 'Enter your code here...',
}: CodeEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Code</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? (
            <>
              <Code className="mr-2 h-4 w-4" />
              Edit
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      {isPreview ? (
        <div className="code-block rounded-lg border">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
            }}
            showLineNumbers
          >
            {value || '// No code yet'}
          </SyntaxHighlighter>
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] resize-y font-mono"
        />
      )}
    </div>
  );
}
