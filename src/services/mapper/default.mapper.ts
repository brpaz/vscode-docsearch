import { Docset } from '../../models';
import { SearchResult } from '../providers/providers';
import { ResultMapper } from './mapper';

interface Result {
  hits: Array<Hit>;
}

interface Hit {
  url: string;
  content?: string;
  hierarchy: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
    lvl6?: string;
  };
}

type Hierarchy = { [key: string]: string };

export class DefaultMapper implements ResultMapper {
  map(docset: Docset, data: unknown): SearchResult[] {
    const result = data as Result;
    return result.hits.map((hit: Hit) => {
      const [title, category] = this.parseHitHierarchy(hit.hierarchy);
      return {
        title: title,
        url: hit.url,
        category: category,
        description: hit.content || '',
      };
    });
  }

  private parseHitHierarchy(hierarchy: Hierarchy): Array<string> {
    const lastTwoNotNull = [];
    for (let i = Object.keys(hierarchy).length - 1; i >= 0; i--) {
      const key = `lvl${i}`;
      if (hierarchy[key] !== null) {
        lastTwoNotNull.push(hierarchy[key]);
        if (lastTwoNotNull.length === 2) {
          break;
        }
      }
    }

    return lastTwoNotNull;
  }
}
