import { config } from 'dotenv';
import { load as envkeyLoad } from 'envkey/loader';

export default function loadEnvVariables(envFile: string | undefined, envKeyPassed: boolean): void {
  if (envFile) {
    config({
      path: envFile,
    });
    if (envKeyPassed) {
      envkeyLoad();
    }
  } else {
    envkeyLoad();
  }
}
