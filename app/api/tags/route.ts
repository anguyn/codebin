import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            snippets: true,
          },
        },
      },
      orderBy: {
        snippets: {
          _count: 'desc',
        },
      },
      take: 50,
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 },
    );
  }
}
