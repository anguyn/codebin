import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const languages = await prisma.language.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
        _count: {
          select: {
            snippets: {
              where: {
                // isPublic: true,
              },
            },
          },
        },
      },
      orderBy: {
        popularity: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 },
    );
  }
}
