import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/prisma';
import { getTranslate } from '@/i18n/server';
import { createTagConnections, generateUniqueSlug } from '@/lib/server/utils';

function canAccessSnippet(
  snippet: { isPublic: boolean; userId: string },
  session: Session | null,
): boolean {
  if (snippet.isPublic) return true;
  return session?.user?.id === snippet.userId;
}

function isSnippetOwner(
  snippet: { userId: string },
  session: Session | null,
): boolean {
  return session?.user?.id === snippet.userId;
}

// GET - Lấy snippet theo ID hoặc slug
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  try {
    const { translate } = await getTranslate();
    const dictionaries = {
      en: (await import('@/translations/dictionaries/en.json')).default,
      vi: (await import('@/translations/dictionaries/vi.json')).default,
    };
    const t = (await translate(dictionaries)).api.snippet;

    const session = await auth();

    const snippet = await prisma.snippet.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json({ error: t.notFound }, { status: 404 });
    }

    if (!canAccessSnippet(snippet, session)) {
      return NextResponse.json({ error: t.forbidden }, { status: 403 });
    }

    await prisma.snippet.update({
      where: { id: snippet.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Get snippet error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 },
    );
  }
}

// PUT - Cập nhật snippet
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  try {
    const { translate } = await getTranslate();
    const dictionaries = {
      en: (await import('@/translations/dictionaries/en.json')).default,
      vi: (await import('@/translations/dictionaries/vi.json')).default,
    };
    const t = (await translate(dictionaries)).api.snippet;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: t.unauthorized }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!snippet) {
      return NextResponse.json({ error: t.notFound }, { status: 404 });
    }

    if (!isSnippetOwner(snippet, session)) {
      return NextResponse.json({ error: t.forbiddenEdit }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, code, language, tags, isPublic, complexity } =
      body;

    let slug = snippet.slug;
    if (title && title !== snippet.title) {
      slug = await generateUniqueSlug(title, params.id);
    }

    await prisma.snippetOnTag.deleteMany({
      where: { snippetId: params.id },
    });

    const tagConnections = await createTagConnections(tags || [], language);

    const updatedSnippet = await prisma.snippet.update({
      where: { id: params.id },
      data: {
        title,
        description,
        code,
        language,
        complexity,
        isPublic,
        slug,
        tags: {
          create: tagConnections,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error('Update snippet error:', error);
    return NextResponse.json(
      { error: 'Failed to update snippet' },
      { status: 500 },
    );
  }
}

// DELETE - Xóa snippet
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  try {
    const { translate } = await getTranslate();
    const dictionaries = {
      en: (await import('@/translations/dictionaries/en.json')).default,
      vi: (await import('@/translations/dictionaries/vi.json')).default,
    };
    const t = (await translate(dictionaries)).api.snippet;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: t.unauthorized }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!snippet) {
      return NextResponse.json({ error: t.notFound }, { status: 404 });
    }

    if (!isSnippetOwner(snippet, session)) {
      return NextResponse.json({ error: t.forbiddenDelete }, { status: 403 });
    }

    await prisma.snippet.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete snippet error:', error);
    return NextResponse.json(
      { error: 'Failed to delete snippet' },
      { status: 500 },
    );
  }
}
