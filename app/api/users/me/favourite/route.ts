import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/server/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          snippet: {
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
              _count: {
                select: {
                  favorites: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.favorite.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      favorites: favorites.map(f => f.snippet),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 },
    );
  }
}
