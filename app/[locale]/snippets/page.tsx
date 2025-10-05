import { MainLayout } from '@/components/layouts/main-layout';
import { Sidebar } from '@/components/layouts/sidebar';
import { SnippetCard } from '@/components/blocks/snippet-card';
import { LoadingCard } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Snippet, PaginationMeta } from '@/types';
import { Suspense } from 'react';

async function getSnippets(searchParams: {
  page?: string;
  language?: string;
  tag?: string;
  search?: string;
}): Promise<{ snippets: Snippet[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams();
    if (searchParams.page) params.set('page', searchParams.page);
    if (searchParams.language) params.set('language', searchParams.language);
    if (searchParams.tag) params.set('tag', searchParams.tag);
    if (searchParams.search) params.set('search', searchParams.search);

    console.log(
      'Log ra URL: ',
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?${params.toString()}`,
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/snippets?${params.toString()}`,
      { cache: 'no-store' },
    );

    if (!res.ok) {
      return {
        snippets: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch snippets:', error);
    return {
      snippets: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }
}

export const metadata = {
  title: 'Browse Code Snippets',
  description: 'Discover and explore code snippets from developers worldwide',
};

export default async function SnippetsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    language?: string;
    tag?: string;
    search?: string;
  }>;
}) {
  // Await both params and searchParams
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const { snippets, pagination } = await getSnippets(resolvedSearchParams);
  const currentPage = pagination.page;

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <Sidebar locale={locale} />

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {resolvedSearchParams.search
                    ? 'Search Results'
                    : 'All Snippets'}
                </h1>
                <p className="mt-1 text-[var(--color-muted-foreground)]">
                  {pagination.total} snippet{pagination.total !== 1 ? 's' : ''}{' '}
                  found
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-4 py-2 text-sm">
                  <option>Most Recent</option>
                  <option>Most Viewed</option>
                  <option>Most Liked</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(resolvedSearchParams.language ||
              resolvedSearchParams.tag ||
              resolvedSearchParams.search) && (
              <div className="flex flex-wrap gap-2">
                {resolvedSearchParams.language && (
                  <div className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-sm">
                    Language: {resolvedSearchParams.language}
                    <button className="hover:text-[var(--color-destructive)]">
                      ×
                    </button>
                  </div>
                )}
                {resolvedSearchParams.tag && (
                  <div className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-sm">
                    Tag: {resolvedSearchParams.tag}
                    <button className="hover:text-[var(--color-destructive)]">
                      ×
                    </button>
                  </div>
                )}
                {resolvedSearchParams.search && (
                  <div className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-sm">
                    Search: {resolvedSearchParams.search}
                    <button className="hover:text-[var(--color-destructive)]">
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Snippets Grid */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              }
            >
              {snippets.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {snippets.map(snippet => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      locale={locale}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-lg text-[var(--color-muted-foreground)]">
                    No snippets found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  asChild={currentPage !== 1}
                >
                  {currentPage === 1 ? (
                    <span>Previous</span>
                  ) : (
                    <a href={`?page=${currentPage - 1}`}>Previous</a>
                  )}
                </Button>

                <div className="flex gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? 'default' : 'outline'
                          }
                          asChild={currentPage !== pageNum}
                        >
                          {currentPage === pageNum ? (
                            <span>{pageNum}</span>
                          ) : (
                            <a href={`?page=${pageNum}`}>{pageNum}</a>
                          )}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  asChild={currentPage !== pagination.totalPages}
                >
                  {currentPage === pagination.totalPages ? (
                    <span>Next</span>
                  ) : (
                    <a href={`?page=${currentPage + 1}`}>Next</a>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
