import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocsMeta {
  title: string;
  description?: string;
  order?: number;
  category?: string;
}

export interface DocsPage {
  slug: string;
  meta: DocsMeta;
  content: string;
  path: string;
}

const docsDirectory = path.join(process.cwd(), 'docs');

export function getDocsPage(slug: string): DocsPage | null {
  try {
    // Handle different file paths
    let filePath: string;
    
    if (slug === 'index' || slug === '') {
      filePath = path.join(docsDirectory, 'README.md');
    } else {
      // Try different variations of the slug
      const possiblePaths = [
        path.join(docsDirectory, `${slug}.md`),
        path.join(docsDirectory, slug, 'README.md'),
        path.join(docsDirectory, `${slug}/index.md`),
      ];

      // Check for nested paths (e.g., user-guides/creating-qr-codes)
      if (slug.includes('/')) {
        possiblePaths.push(path.join(docsDirectory, `${slug}.md`));
      }

      filePath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      meta: {
        title: data.title || extractTitleFromContent(content),
        description: data.description,
        order: data.order,
        category: data.category,
      },
      content,
      path: filePath,
    };
  } catch (error) {
    console.error(`Error reading docs page ${slug}:`, error);
    return null;
  }
}

export function getAllDocsPages(): DocsPage[] {
  const pages: DocsPage[] = [];

  function walkDirectory(dir: string, basePath = '') {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath, path.join(basePath, file));
      } else if (file.endsWith('.md')) {
        const slug = basePath 
          ? `${basePath}/${file.replace('.md', '')}`
          : file.replace('.md', '');
        
        // Skip README files in subdirectories for now
        if (file === 'README.md' && basePath) continue;
        
        const page = getDocsPage(slug === 'README' ? 'index' : slug);
        if (page) {
          pages.push(page);
        }
      }
    }
  }

  walkDirectory(docsDirectory);
  return pages.sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999));
}

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/[📚🚀📋🏗️📖🔧🤝📞]/g, '').trim() : 'Documentation';
}

export const docsNavigation = [
  {
    title: '🚀 Getting Started',
    items: [
      { title: 'Overview', href: '/docs/index' },
      { title: 'Quick Start Guide', href: '/docs/getting-started' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Environment Setup', href: '/docs/environment' },
    ],
  },
  {
    title: '🏗️ Development',
    items: [
      { title: 'Contributing Guide', href: '/docs/contributing' },
      { title: 'Development Workflow', href: '/docs/development' },
      { title: 'Architecture Overview', href: '/docs/architecture' },
      { title: 'Database Schema', href: '/docs/database' },
    ],
  },
  {
    title: '📖 User Guides',
    items: [
      { title: 'Creating QR Codes', href: '/docs/user-guides/creating-qr-codes' },
    ],
  },
  {
    title: '🚀 Deployment',
    items: [
      { title: 'Vercel Deployment', href: '/docs/deployment/vercel' },
    ],
  },
  {
    title: '🔧 Technical',
    items: [
      { title: 'Tech Stack', href: '/docs/technical/tech-stack' },
    ],
  },
]; 