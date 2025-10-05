import { MainLayout } from '@/components/layouts/main-layout';
import { SnippetForm } from '@/components/blocks/snippet-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create New Snippet',
  description: 'Share your code with the developer community',
};

export default async function NewSnippetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/snippets/new`);
  }

  // Fetch active languages ordered by popularity
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: { popularity: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
    },
  });

  // If no languages exist, show error message
  if (languages.length === 0) {
    return (
      <MainLayout locale={locale}>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>No Languages Available</CardTitle>
                <CardDescription>
                  Please contact the administrator to add programming languages
                  to the system.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout locale={locale}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Create New Snippet</CardTitle>
              <CardDescription>
                Share your code with the developer community. Add tags and get
                automatic complexity analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SnippetForm locale={locale} mode="create" languages={languages} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}