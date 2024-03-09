import fs from 'fs/promises';
import path from 'path';
import { normaliseIdentifier } from './utils';
import { DATA_BASE_PATH } from './utils/constants';

const lintChecksums = async (dataPath: string) => {
  const chainIds = await fs.readdir(dataPath);

  await Promise.all(
    chainIds.map(async (chainId) => {
      const chainPath = path.join(dataPath, chainId);
      const files = await fs.readdir(chainPath);

      await Promise.all(
        files.map(async (file) => {
          const identifier = file.replace('.json', '');
          const normalisedIdentifier = normaliseIdentifier(identifier);

          await fs.rename(path.join(chainPath, file), path.join(chainPath, `${normalisedIdentifier}.json`));
        }),
      );
    }),
  );
};

console.log('Linting checksums');
lintChecksums(path.join(DATA_BASE_PATH, 'manual', 'spenders'));
lintChecksums(path.join(DATA_BASE_PATH, 'manual', 'tokens'));
lintChecksums(path.join(DATA_BASE_PATH, 'generated', 'spenders'));
lintChecksums(path.join(DATA_BASE_PATH, 'generated', 'tokens'));
