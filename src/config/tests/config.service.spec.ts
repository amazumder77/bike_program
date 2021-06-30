import ConfigService from '../config.service';
import { LocaleEnum } from '../../shared/enums/locales.enum';

describe('Config Service', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
  });

  describe('get', () => {
    beforeEach(() => {
      process.env.TEST_VAR = 'test-value';
      process.env.TEST_NUMBER = '1234';
    });

    afterEach(() => {
      delete process.env.TEST_VAR;
      delete process.env.TEST_NUMBER;
    });

    it('should return value of env variable', async () => {
      expect(configService.get('TEST_VAR')).toBe('test-value');
      expect(configService.get('TEST_NUMBER')).toBe('1234');
      expect(configService.get('TEST_NUMBER1')).toBe(null);
    });

    it('should return numeric value of env variable', async () => {
      expect(configService.getNumber('TEST_NUMBER')).toBe(1234);
      expect(configService.getNumber('TEST_VAR')).toBe(NaN);
      expect(configService.getNumber('TEST_NUMBER1')).toBe(undefined);
    });

    it('should return language value with default en_US', async () => {
      expect(configService.get('default_test_value')).toEqual('default en_US test val');
    });

    it('should return language value', async () => {
      expect(configService.get('en_US.default_test_value')).toEqual('default en_US test val');
      expect(configService.get('de_DE.default_test_value')).toEqual('default de_DE test val');
    });

    it('should return overridden language value to specific env', async () => {
      expect(configService.get('default_env_test_value')).toEqual('default TESTING en_US test val');
      expect(configService.get('en_US.default_env_test_value')).toEqual('default TESTING en_US test val');
    });

    it('should return testing env value', async () => {
      expect(configService.get('test_value')).toEqual('TESTING test value');
    });
  });

  describe('PORT', () => {
    it('should return default port', () => {
      expect(configService.PORT).toBe(3000);
    });

    it('should return custom port', () => {
      process.env.PORT = '3001';
      expect(configService.PORT).toBe(3001);
    });
  });

  describe('getTemplated', () => {
    it('should return language value with variable', async () => {
      const templateVars = {
        testName: 'name_123',
      };
      expect(configService.getTemplated('en_US.test_value_with_variable', templateVars)).toEqual('test name_123');
    });
  });

  describe('resolveLocale', () => {
    it('should convert to LocaleEnum', async () => {
      expect(configService.resolveLocale('en_US')).toEqual(LocaleEnum.en_US);
      expect(configService.resolveLocale('DE_DE')).toEqual(LocaleEnum.de_DE);
      expect(configService.resolveLocale('default')).toEqual(LocaleEnum.en_US);
    });
  });
});
