import { Docset } from '../../../../docsets/docset';
import { SearchResult } from '../../providers';
import { ResultMapper } from './mapper';

interface WebDevResponse {
  hits: Array<WebDevHit>;
}

interface WebDevHit {
  url: string;
  title: string;
}

export default class WebDevMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as WebDevResponse;

    return result.hits.map((hit: WebDevHit) => {
      return {
        title: hit.title,
        url: `${docset.siteUrl}/${hit.url}`,
        description: '',
        category: '',
      };
    });
  }
}
