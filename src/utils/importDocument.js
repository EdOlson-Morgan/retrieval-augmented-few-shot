import * as fs from 'node:fs';
import * as path from 'node:path';

export default function importDocument(location) {
    try {
      const filePath = path.resolve(location);
      const contents = fs.readFileSync(filePath, { encoding: 'utf8' });
      return contents;
    } catch (err) {
      console.error(err.message);
    }
}