import { MainLayout } from '@/components/layouts/main-layout';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getTranslate, setStaticParamsLocale } from '@/i18n/server';
import { CreateSnippetBlock } from '@/components/blocks/pages/snippets/create/render';
import { PageProps } from '@/types/global';
import { Metadata } from 'next';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale } = await props.params;

  setStaticParamsLocale(locale);
  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

  return {
    title: t.snippets.createTitle,
    description: t.snippets.createDescription,
    openGraph: {
      title: t.snippets.createTitle,
      description: t.snippets.createDescription || undefined,
      type: 'article',
    },
  };
}

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

  const { translate } = await getTranslate();

  const dictionaries = {
    en: (await import('@/translations/dictionaries/en.json')).default,
    vi: (await import('@/translations/dictionaries/vi.json')).default,
  };

  const t = await translate(dictionaries);

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

  const snippetTranslations = {
    title: t.snippets.createTitle,
    description: t.snippets.createDescription,
  };

  // if (languages.length === 0) {
  //   return (
  //     <MainLayout locale={locale}>
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="mx-auto">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>No Languages Available</CardTitle>
  //               <CardDescription>
  //                 Please contact the administrator to add programming languages
  //                 to the system.
  //               </CardDescription>
  //             </CardHeader>
  //           </Card>
  //         </div>
  //       </div>
  //     </MainLayout>
  //   );
  // }

  return (
    <MainLayout locale={locale}>
      <CreateSnippetBlock
        locale={locale}
        languages={languages}
        translations={snippetTranslations}
      />
    </MainLayout>
  );
}
