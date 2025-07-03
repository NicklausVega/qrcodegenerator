'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { docsNavigation } from '@/lib/docs-navigation';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function DocsNavigation() {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col w-full max-w-xs">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white">Documentation</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-6">
          {docsNavigation.map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-semibold text-white/70 px-2">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className="block">
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left h-auto py-2 px-3 font-normal",
                            "text-white/80 hover:text-white hover:bg-white/10",
                            "transition-all duration-200",
                            isActive && "bg-white/15 text-white border border-white/20"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <ChevronRight className={cn(
                              "w-3 h-3 transition-transform duration-200",
                              isActive && "rotate-90"
                            )} />
                            {item.title}
                          </span>
                        </Button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {index < docsNavigation.length - 1 && (
                <Separator className="bg-white/10 my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/50 text-center">
          <p>Need help?</p>
          <Link 
            href="https://github.com/NicklausVega/qr-generator/discussions" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask in Discussions
          </Link>
        </div>
      </div>
    </div>
  );
} 