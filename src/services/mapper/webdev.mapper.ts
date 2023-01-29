import { Docset } from '../../models';
import { SearchResult } from '../providers/providers';
import { ResultMapper } from './mapper';

interface WebDevResponse {
  hits: Array<WebDevHit>;
}

interface WebDevHit {
  url: string;
  title: string;
}

export class WebDevMapper implements ResultMapper {
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
