import { fetch as envkeyFetch } from 'envkey/loader';
import { readdirSync, readFileSync } from 'fs';
import * as _ from 'lodash';
import { join } from 'path';

const envVars = envkeyFetch({ dotEnvFile: `./${process.env.NODE_ENV}.env` });

const DEFAULT_FILE_NAME = 'default.json';
const ENV_SPECIFIC_FILE_NAME = `${process.env.NODE_ENV}.json`;
const JSON_FILE_FORMAT = '.json';
const UTF8_ENCODING = 'utf8';
const LANGUAGES_FOLDER_PATH = '/languages';

class ConfigLoader {
  /**
   * This function loads all .json files within the target directory, recursively.
   * It builds a config JSON object based on the target directory's structure.
   * In each directory, it will:
   *   1. Look for and load `default.json`
   *   2. Look for and load `{$process.env.NODE_ENV} + .json`
   *   3. overwrite default values with env specific ones
   *   4. recursively search all subdirectories
   */
  loadConfig(dir: string): Record<string, unknown> {
    const fullDirName = join(__dirname, dir);

    let result: Record<string, unknown> = {};
    const contents: Array<string> = readdirSync(fullDirName);
    if (contents.length > 0) {
      const defaultConfig = ConfigLoader.readFile(contents, DEFAULT_FILE_NAME, fullDirName);
      const envConfig = ConfigLoader.readFile(contents, ENV_SPECIFIC_FILE_NAME, fullDirName);

      result = _.merge(defaultConfig, envConfig);

      // grab subdirectories, and then recursively search them for config files
      const subdirectories = _.filter(contents, (content: string) => !content.includes(JSON_FILE_FORMAT));
      for (const obj of subdirectories) {
        result[obj] = this.loadConfig(`${dir}/${obj}`);
      }
    }
    return result;
  }

  private static readFile(contents: Array<string>, fileName: string, fullDirName: string): Record<string, unknown> {
    return _.includes(contents, fileName) ? JSON.parse(readFileSync(`${fullDirName}/${fileName}`, UTF8_ENCODING)) : {};
  }
}

const configLoader = new ConfigLoader();
const defaultLanguageValues = configLoader.loadConfig(LANGUAGES_FOLDER_PATH);

const finalResult = _.merge(defaultLanguageValues, envVars);

export default finalResult;
