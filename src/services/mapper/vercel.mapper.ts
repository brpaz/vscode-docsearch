import { Docset } from '../../models';
import { SearchResult } from '../providers/providers';
import { ResultMapper } from './mapper';

interface VercelResult {
  hits: Array<VercelHit>;
}
interface VercelHit {
  title: string;
  section: string;
  content: string;
  url: string;
  tags?: Array<string>;
}

export class VercelMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as VercelResult;

    return result.hits.map((hit: VercelHit) => {
      return {
        title: hit.title,
        url: `${docset.siteUrl}/${hit.url}`,
        description: '',
        category: hit.section,
      };
    });
  }
}
