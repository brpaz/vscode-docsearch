import { Docset } from '../docsets/docset';
import { SearchProvider, SearchResult } from './providers/providers';

/**
 * The DocSearch class is responsible for searching documentation.
 */
export class DocSearch {
  /**
   * Creates an instance of DocSearch.
   */
  constructor(private docsets: Docset[], private providers: SearchProvider[]) {}

  /**
   * Retrieve a Docset object by its id.
   * @param {string} id - The id of the Docset to retrieve.
   * @returns {(Docset|undefined)} Returns the Docset object if found, otherwise returns undefined.
   */
  fincDocsetById(id: string): Docset | undefined {
    return this.docsets.find((docset) => docset.id === id);
  }

  // Returns a list of enabled Docsets
  getDocsets(): Docset[] {
    return this.docsets.sort((a, b) => a.name.localeCompare(b.name));
  }

  getProviders(): SearchProvider[] {
    return this.providers;
  }

  async search(docsetId: string, query: string): Promise<SearchResult[]> {
    console.log(`Searching for ${query} in ${docsetId}`);

    const docset = this.fincDocsetById(docsetId);

    if (!docset) {
      throw new Error(`Docset with id "${docsetId}" not found`);
    }

    const provider = this.providers.find((p) => p.getKey() === docset.provider);

    if (!provider) {
      throw new Error(`No provider found for ${docset.provider}`);
    }

    return await provider.search(docset, query);
  }
}
