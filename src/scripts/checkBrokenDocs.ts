/**
 * Script that looks for invalid docset configurations like wrong Algolia settings.
 */

import { DocSearch } from '../services/docsearch';
import { AlgoliaSearchProvider } from '../services/providers/algolia';
import { MkDocsSearchProvider } from '../services/providers/mkdocs';
import defaultDocsets from '../config/defaultDocsets';
import * as chalk from 'chalk';
import { MapperFactory } from '../services/mapper/mapper.factory';
const log = console.log;

async function run() {
  const docSearch = new DocSearch(defaultDocsets, [
    new AlgoliaSearchProvider(new MapperFactory()),
    new MkDocsSearchProvider(),
  ]);
  let hasErrors = false;

  const promises = defaultDocsets.map((docset) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        log(chalk.yellow(`Validating docset ${docset.id}...`));
        await docSearch.search(docset.id, 'test');
      } catch (e: any) {
        log(chalk.red(`Error validating docset ${docset.id}: ${e.message}`));
        hasErrors = true;
      } finally {
        resolve(true);
      }
    });
  });

  await Promise.all(promises);

  if (hasErrors) {
    process.exit(1);
  } else {
    log(chalk.green(`No errors found`));
  }
}

run();
