import { AlgoliaProviderConfig } from '..';
import { Docset } from '../../../../docsets/docset';
import { DocsetProvider } from '../../providers';
import TerraformMapper from './terraform.mapper';

describe('TerraformMapper', () => {
  let mapper: TerraformMapper;
  const docset: Docset = {
    id: 'terraform',
    name: 'Terraform',
    provider: DocsetProvider.Algolia,
    enabled: true,
    searchConfig: {} as AlgoliaProviderConfig,
    siteUrl: 'https://www.terraform.io',
  };

  beforeEach(() => {
    mapper = new TerraformMapper();
  });

  it('maps terraform result to search result correctly', () => {
    const terraformResult = {
      hits: [
        {
          id: '1',
          page_title: 'Page Title 1',
          description: 'Description 1',
          slug: 'slug-1',
          tags: ['tag1', 'tag2'],
        },
        {
          id: '2',
          page_title: 'Page Title 2',
          description: 'Description 2',
          slug: 'slug-2',
          tags: ['tag3'],
        },
      ],
    };
    const expectedResult = [
      {
        title: 'Page Title 1',
        url: 'https://www.terraform.io/slug-1',
        description: 'Description 1',
        category: 'tag1, tag2',
      },
      {
        title: 'Page Title 2',
        url: 'https://www.terraform.io/slug-2',
        description: 'Description 2',
        category: 'tag3',
      },
    ];

    expect(mapper.map(docset, terraformResult)).toEqual(expectedResult);
  });
});
