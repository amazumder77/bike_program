export default class EnvironmentService {
  private readonly env: string;

  constructor(env = '') {
    this.env = env;
  }

  get isDevelopment(): boolean {
    return this.env === 'development';
  }

  get isTest(): boolean {
    return this.env === 'test';
  }
}

export function environmentServiceFactory(): EnvironmentService {
  return new EnvironmentService(process.env.NODE_ENV);
}
