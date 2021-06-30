import './node-config-dir-env-variable';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as config from 'config';

import loadEnvVariables from './load-env-variables';
import { LocaleEnum } from '../shared/enums/locales.enum';
import { standardizeLocale } from '../shared/utils/locale-utils';

loadEnvVariables(process.env.ENV_FILE, !!process.env.ENVKEY);

@Injectable()
export default class ConfigService {
  private readonly defaultLocale: string = LocaleEnum.en_US;

  /**
   * Find configuration by key, including uppercase and default locale: key, KEY, en_US.key, en_US.KEY.
   * Returns null if no config was found.
   */
  get(key: string): string | null {
    const prefix = this.getConfigPrefix();

    if (process.env[key]) {
      return process.env[key];
    }
    if (process.env[key.toUpperCase()]) {
      return process.env[key.toUpperCase()];
    }

    return (
      this.getConfigByKeyOrUpperCaseKey(prefix, key) ??
      this.getConfigByKeyOrUpperCaseKey(`${prefix + this.defaultLocale}.`, key) ??
      null
    );
  }

  private getConfigByKeyOrUpperCaseKey(prefix: string, key: string): string | null {
    if (config.has(prefix + key)) {
      return config.get(prefix + key);
    }
    if (config.has(prefix + key.toUpperCase())) {
      return config.get(prefix + key.toUpperCase());
    }
    return null;
  }

  private getConfigPrefix(): string {
    // work around for a bug in the `config` module regarding default exports
    return config.has('default') ? 'default.' : '';
  }

  safeGet(key: string): string {
    const result = this.get(key);
    if (!result) {
      throw new InternalServerErrorException(
        `Invalid service configuration: ${key} environment variable is not specified`,
      );
    }

    return result;
  }

  /**
   * Injects templateVariables into a templated string
   */
  getTemplated(key: string, templateVariables: Record<string, unknown>): string | null {
    const templateString = this.get(key);
    if (!templateString) {
      return null;
    }

    const keys = Object.keys(templateVariables);
    const values = Object.values(templateVariables);
    // TODO Fix eslint
    // eslint-disable-next-line no-new-func
    const templateFunction = new Function(...keys, `return \`${templateString}\`;`);

    return templateFunction(...values);
  }

  resolveLocale(locale?: string): LocaleEnum {
    return LocaleEnum[standardizeLocale(locale)] ?? LocaleEnum.en_US;
  }

  getNumber(key: string): number | undefined {
    const value = this.get(key);

    return value ? parseInt(value, 10) : undefined;
  }

  get PORT(): number {
    return this.getNumber('PORT') ?? 3000;
  }

  get DB_PORT(): number | undefined {
    return this.getNumber('DB_PORT');
  }

  get DB_HOST(): string | undefined {
    return this.get('DB_HOST');
  }

  get DB_USER(): string | undefined {
    return this.get('DB_USER');
  }

  get DB_PASSWORD(): string | undefined {
    return this.get('DB_PASSWORD');
  }

  get DB_NAME(): string | undefined {
    return this.get('DB_NAME');
  }
}
