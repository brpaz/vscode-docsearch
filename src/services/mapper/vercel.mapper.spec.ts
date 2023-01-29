import { AlgoliaProviderConfig, DocsetProvider, Docset } from '../../models';
import { VercelMapper } from './vercel.mapper';

describe('vercelMapper', () => {
  let vercelMapper: VercelMapper;
  const docset: Docset = {
    siteUrl: 'https://docs.vercel.com',
    id: 'vercel',
    name: 'Vercel',
    provider: DocsetProvider.Algolia,
    enabled: true,
    searchConfig: {} as AlgoliaProviderConfig,
  };

  beforeEach(() => {
    vercelMapper = new VercelMapper();
  });

  it('should map VercelResult to SearchResult array', () => {
    const vercelResult = {
      hits: [
        {
          title: 'How to deploy a Next.js app to Vercel',
          section: 'Next.js',
          content: 'Learn how to deploy a Next.js app to Vercel',
          url: 'nextjs/deploy',
        },
        {
          title: 'How to set up environment variables in Vercel',
          section: 'Vercel',
          content: 'Learn how to set up environment variables in Vercel',
          url: 'vercel/environment-variables',
        },
      ],
    };

    const mappedResult = vercelMapper.map(docset, vercelResult);
    expect(mappedResult).toEqual([
      {
        title: 'How to deploy a Next.js app to Vercel',
        url: 'https://docs.vercel.com/nextjs/deploy',
        description: '',
        category: 'Next.js',
      },
      {
        title: 'How to set up environment variables in Vercel',
        url: 'https://docs.vercel.com/vercel/environment-variables',
        description: '',
        category: 'Vercel',
      },
    ]);
  });
});
