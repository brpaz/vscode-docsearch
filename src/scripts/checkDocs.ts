/**
 * Script that looks for invalid docset configurations like wrong Algolia settings.
 */

import { DocSearch } from '../services/docsearch';
import { AlgoliaSearchProvider } from '../services/providers/algolia';
import defaultDocsets from '../docsets/defaultDocsets';
import * as chalk from 'chalk';
import MapperFactory from '../services/providers/algolia/mapper/factory';
import { DocsetProvider } from '../services/providers/providers';
const log = console.log;

async function run() {
  const docSearch = new DocSearch(defaultDocsets, [new AlgoliaSearchProvider(new MapperFactory())]);
  let hasErrors = false;

  const promises = defaultDocsets.map((docset) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        if (docset.provider !== DocsetProvider.Algolia) {
          resolve(true);
          return;
        }

        log(chalk.yellow(`Validating docset ${docset.id}...`));
        await docSearch.search(docset.id, 'test');
      } catch (e: unknown) {
        const error = e as Error;
        log(chalk.red(`Error validating docset ${docset.id}: ${error.message}`));
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
