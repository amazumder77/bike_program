import EnvironmentService from '../environment.service';

describe('EnvironmentService', () => {
  describe('isDevelopment', () => {
    it('should return true', () => {
      expect(new EnvironmentService('development').isDevelopment).toBe(true);
    });

    it('should return false', () => {
      expect(new EnvironmentService().isDevelopment).toBe(false);
      expect(new EnvironmentService('test').isDevelopment).toBe(false);
    });
  });

  describe('isTest', () => {
    it('should return true', () => {
      expect(new EnvironmentService('test').isTest).toBe(true);
    });

    it('should return false', () => {
      expect(new EnvironmentService('development').isTest).toBe(false);
      expect(new EnvironmentService().isTest).toBe(false);
    });
  });
});
