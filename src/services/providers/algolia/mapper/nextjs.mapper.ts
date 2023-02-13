import { Docset } from '../../../../docsets/docset';
import { SearchResult } from '../../providers';
import { ResultMapper } from './mapper';

interface Results {
  hits: Array<Hit>;
}
interface Hit {
  title: string;
  content: string;
  path: string;
  section: string;
}

export default class NextjsMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as Results;

    return result.hits.map((hit: Hit) => {
      return {
        title: hit.title,
        url: `${docset.siteUrl}${hit.path}`,
        category: hit.section,
        description: '',
      };
    });
  }
}
