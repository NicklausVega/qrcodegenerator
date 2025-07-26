'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface DocsContentProps {
  content: string;
  title?: string;
}

export default function DocsContent({ content, title }: DocsContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <div className="flex-1 max-w-none">
      {title && (
        <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
          {title}
        </h1>
      )}
      <div className="prose prose-invert prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headers
            h1: ({ children }) => (
              <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/20 pb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-semibold text-white mt-6 mb-3">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl font-medium text-white mt-4 mb-2">
                {children}
              </h4>
            ),
            
            // Paragraphs and text
            p: ({ children }) => (
              <p className="text-white/80 leading-relaxed mb-4">
                {children}
              </p>
            ),
            
            // Lists
            ul: ({ children }) => (
              <ul className="text-white/80 space-y-2 mb-4 ml-6">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="text-white/80 space-y-2 mb-4 ml-6">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="list-disc text-white/80">
                {children}
              </li>
            ),
            
            // Links
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http');
              const isInternal = href?.startsWith('./');
              
              let finalHref = href;
              if (isInternal) {
                finalHref = href?.replace('./', '/docs/').replace('.md', '');
              }
              
              return (
                <Link
                  href={finalHref || '#'}
                  className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300/50 inline-flex items-center gap-1"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {children}
                  {isExternal && <ExternalLink className="w-3 h-3" />}
                </Link>
              );
            },
            
            // Code blocks
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code: (props: any) => {
              const { inline, className, children } = props;
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language) {
                return (
                  <div className="relative group">
                    <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border border-white/10">
                      <span className="text-sm text-white/60 font-mono">
                        {language}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                      >
                        {copiedCode === String(children).replace(/\n$/, '') ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      className="!mt-0 !rounded-t-none border border-t-0 border-white/10"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0 0 0.5rem 0.5rem',
                        background: '#1e293b',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              
              return (
                <code className="bg-slate-800 text-blue-300 px-2 py-1 rounded text-sm font-mono border border-white/10">
                  {children}
                </code>
              );
            },
            
            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 bg-slate-800/50 backdrop-blur-sm pl-6 py-4 my-6 rounded-r-lg">
                <div className="text-white/80 italic">
                  {children}
                </div>
              </blockquote>
            ),
            
            // Tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full border border-white/20 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-800">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="bg-slate-900/50">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-white/10">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-white font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-white/80">
                {children}
              </td>
            ),
            
            // Horizontal rule
            hr: () => (
              <hr className="border-white/20 my-8" />
            ),
            
            // Strong/Bold
            strong: ({ children }) => (
              <strong className="text-white font-semibold">
                {children}
              </strong>
            ),
            
            // Emphasis/Italic
            em: ({ children }) => (
              <em className="text-white/90 italic">
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
} 