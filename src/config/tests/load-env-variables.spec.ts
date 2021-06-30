import { config } from 'dotenv';
import loadEnvVariables from '../load-env-variables';

jest.mock('dotenv');

describe('loadEnvVariables', () => {
  const configMock = config as jest.Mock;

  beforeEach(() => {
    configMock.mockReset();
  });

  it('should load env file using dotenv if file name passed', () => {
    loadEnvVariables('env-file-name', false);

    expect(configMock).toHaveBeenCalledTimes(1);
    expect(configMock).toHaveBeenCalledWith({ path: 'env-file-name' });
  });
});
