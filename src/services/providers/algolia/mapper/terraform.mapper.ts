import { Docset } from '../../../../docsets/docset';
import { SearchResult } from '../../providers';
import { ResultMapper } from './mapper';

interface TerraformResult {
  hits: Array<TerraformHit>;
}
interface TerraformHit {
  id: string;
  page_title: string;
  description: string;
  slug: string;
  tags?: Array<string>;
}

export default class TerraformMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as TerraformResult;

    return result.hits.map((hit: TerraformHit) => {
      return {
        title: hit.page_title,
        url: `${docset.siteUrl}/${hit.slug}`,
        description: hit.description,
        category: hit.tags ? hit.tags.join(', ') : '',
      };
    });
  }
}
