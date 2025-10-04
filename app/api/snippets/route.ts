import { NextResponse } from 'next/server';
import { auth } from '@/lib/server/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

// GET - Lấy danh sách snippets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const tag = searchParams.get('tag');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { isPublic: true };

    if (language) {
      where.language = language;
    }

    if (userId) {
      where.userId = userId;
      delete where.isPublic; // Show all snippets for user's profile
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.snippet.count({ where }),
    ]);

    return NextResponse.json({
      snippets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get snippets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

// POST - Tạo snippet mới
export async function POST(request: Request) {
  try {
    const session = await auth(); // Sử dụng auth() thay vì getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, code, language, tags, isPublic, complexity } = body;

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    let slugExists = await prisma.snippet.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      slugExists = await prisma.snippet.findUnique({ where: { slug } });
      counter++;
    }

    // Process tags
    const tagConnections = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        
        let tag = await prisma.tag.findUnique({
          where: { slug: tagSlug },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagSlug,
              type: 'TOPIC',
            },
          });
        }

        tagConnections.push({
          tag: {
            connect: { id: tag.id },
          },
        });
      }
    }

    // Add language as a tag
    const languageSlug = slugify(language, { lower: true, strict: true });
    let languageTag = await prisma.tag.findUnique({
      where: { slug: languageSlug },
    });

    if (!languageTag) {
      languageTag = await prisma.tag.create({
        data: {
          name: language,
          slug: languageSlug,
          type: 'LANGUAGE',
        },
      });
    }

    tagConnections.push({
      tag: {
        connect: { id: languageTag.id },
      },
    });

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description,
        code,
        language,
        complexity,
        isPublic: isPublic !== false,
        slug,
        userId: session.user.id,
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

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error('Create snippet error:', error);
    return NextResponse.json(
      { error: 'Failed to create snippet' },
      { status: 500 }
    );
  }
}