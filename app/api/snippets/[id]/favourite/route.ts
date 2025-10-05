import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/server/auth';

// POST - Thêm favorite
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        snippetId: params.id,
      },
    });

    return NextResponse.json(favorite);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 });
    }
    console.error('Favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to favorite snippet' },
      { status: 500 },
    );
  }
}

// DELETE - Xóa favorite
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.favorite.delete({
      where: {
        userId_snippetId: {
          userId: session.user.id,
          snippetId: params.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unfavorite error:', error);
    return NextResponse.json(
      { error: 'Failed to unfavorite snippet' },
      { status: 500 },
    );
  }
}
