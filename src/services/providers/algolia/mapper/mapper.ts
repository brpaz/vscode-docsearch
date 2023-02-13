import { Docset } from '../../../../docsets/docset';
import { SearchResult } from '../../providers';

export interface ResultMapper {
  map: (docset: Docset, data: unknown) => SearchResult[];
}
