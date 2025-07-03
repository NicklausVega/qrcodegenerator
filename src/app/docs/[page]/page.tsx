import { notFound } from 'next/navigation';
import { getDocsPage } from '@/lib/docs';
import DocsContent from '@/components/docs/DocsContent';
import DocsNavigation from '@/components/docs/DocsNavigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Edit3 } from 'lucide-react';
import Link from 'next/link';

interface DocsPageProps {
  params: Promise<{ page: string }>;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { page } = await params;
  const docsPage = getDocsPage(page);

  if (!docsPage) {
    notFound();
  }

  // Generate breadcrumbs
  const breadcrumbs = [];
  const pathParts = page.split('/');
  
  breadcrumbs.push({ name: 'Documentation', href: '/docs/index' });
  
  if (page !== 'index') {
    let currentPath = '';
    pathParts.forEach((part, index) => {
      currentPath += (index === 0 ? '' : '/') + part;
      const isLast = index === pathParts.length - 1;
      breadcrumbs.push({
        name: part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        href: isLast ? undefined : `/docs/${currentPath}`,
      });
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <DocsNavigation />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to App
                  </Button>
                </Link>
                
                {/* Breadcrumbs */}
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && <BreadcrumbSeparator className="text-white/40" />}
                        <BreadcrumbItem>
                          {breadcrumb.href ? (
                            <BreadcrumbLink 
                              href={breadcrumb.href}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              {breadcrumb.name}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-white font-medium">
                              {breadcrumb.name}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`https://github.com/NicklausVega/qr-generator/edit/main/docs/${page === 'index' ? 'README.md' : page + '.md'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="text-white/70 hover:text-white border-white/20 hover:bg-white/10">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Page
                  </Button>
                </Link>
                <Link 
                  href="https://github.com/NicklausVega/qr-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="text-white/70 hover:text-white border-white/20 hover:bg-white/10">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-8 lg:px-12 lg:py-12">
            <DocsContent content={docsPage.content} title={docsPage.meta.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Generate static params for known docs pages
  return [
    { page: 'index' },
    { page: 'getting-started' },
    { page: 'installation' },
    { page: 'environment' },
    { page: 'contributing' },
    { page: 'development' },
    { page: 'architecture' },
    { page: 'database' },
    { page: 'user-guides/creating-qr-codes' },
    { page: 'deployment/vercel' },
    { page: 'technical/tech-stack' },
  ];
}
