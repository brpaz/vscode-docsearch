import { Docset } from '../../models';
import { SearchResult } from '../providers/providers';
import { ResultMapper } from './mapper';

interface PrismaResult {
  hits: Array<PrismaHit>;
}
interface PrismaHit {
  title: string;
  heading: string;
  content: string;
  path: string;
}

export class PrismaMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as PrismaResult;

    return result.hits.map((hit: PrismaHit) => {
      return {
        title: hit.title,
        url: `${docset.siteUrl}${hit.path}`,
        description: hit.content,
        category: hit.heading,
      };
    });
  }
}
