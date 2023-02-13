import { AlgoliaProviderConfig } from '..';
import { Docset } from '../../../../docsets/docset';
import { DocsetProvider } from '../../providers';
import DefaultMapper from './default.mapper';

describe('DefaultMapper', () => {
  let mapper: DefaultMapper;
  const docset: Docset = {
    id: 'react',
    name: 'React',
    provider: DocsetProvider.Algolia,
    enabled: true,
    searchConfig: {} as AlgoliaProviderConfig,
    siteUrl: 'https://www.reactjs.com',
  };

  beforeEach(() => {
    mapper = new DefaultMapper();
  });

  it('maps data to SearchResult array', () => {
    const data = {
      hits: [
        {
          url: 'https://example.com',
          content: 'Example content',
          hierarchy: {
            lvl0: 'Lvl0',
            lvl1: 'Lvl1',
            lvl2: 'Lvl2',
          },
        },
        {
          url: 'https://example2.com',
          hierarchy: {
            lvl0: 'Lvl0',
            lvl1: 'Lvl1',
            lvl2: null,
            lvl3: 'Lvl3',
          },
        },
      ],
    };
    const result = mapper.map(docset, data);
    expect(result).toEqual([
      {
        title: 'Lvl2',
        url: 'https://example.com',
        category: 'Lvl1',
        description: 'Example content',
      },
      {
        title: 'Lvl3',
        url: 'https://example2.com',
        category: 'Lvl1',
        description: '',
      },
    ]);
  });
});
