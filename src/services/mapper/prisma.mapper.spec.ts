import { AlgoliaProviderConfig, Docset, DocsetProvider } from '../../models';
import { PrismaMapper } from './prisma.mapper';

describe('PrismaMapper', () => {
  let mapper: PrismaMapper;
  const docset: Docset = {
    siteUrl: 'https://prisma.io/docs',
    id: 'vercel',
    name: 'Vercel',
    provider: DocsetProvider.Algolia,
    enabled: true,
    searchConfig: {} as AlgoliaProviderConfig,
  };

  beforeEach(() => {
    mapper = new PrismaMapper();
  });

  it('should map PrismaResult to SearchResult array', () => {
    const data = {
      hits: [
        {
          title: 'Prisma Introduction',
          heading: 'Getting started',
          content: 'Prisma is a modern database toolkit',
          path: '/introduction',
        },
        {
          title: 'Prisma Client',
          heading: 'Working with data',
          content: 'Prisma Client is a database client for Node.js',
          path: '/prisma-client',
        },
      ],
    };

    const result = mapper.map(docset, data);

    expect(result).toEqual([
      {
        title: 'Prisma Introduction',
        url: 'https://prisma.io/docs/introduction',
        description: 'Prisma is a modern database toolkit',
        category: 'Getting started',
      },
      {
        title: 'Prisma Client',
        url: 'https://prisma.io/docs/prisma-client',
        description: 'Prisma Client is a database client for Node.js',
        category: 'Working with data',
      },
    ]);
  });
});
