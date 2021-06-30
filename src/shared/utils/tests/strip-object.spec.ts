import stripObject from '../strip-object';

describe('strip-object', () => {
  const blacklist = new Set(['password', 'other_bad_field', 'passwords', 'passwordObject']);
  const target = {
    username: 'test_user',
    password: 'PASSWORD123',
    passwords: ['password', 'password2'],
    passwordObject: {
      hello: 'world',
    },
    context: {
      other_property: 'yes',
      num_property: 123,
      password: 'PASSWORDXYZ',
      other_bad_field: 'DESTROY ME',
      context: {
        other_property: 'yes',
        num_property: 123,
        password: 'PASSWORDXYZ',
        other_bad_field: 'DESTROY ME',
      },
    },
  };

  it('should return the property if not an object', () => {
    const result = stripObject(1, blacklist);
    expect(result).toBe(1);
  });

  it('should strip out blacklisted field', () => {
    const result = stripObject(target, blacklist);
    expect(result.password).toBe('*****');
    expect(result.passwords).toBe('*****');
    expect(result.passwordObject).toBe('*****');
    expect(result.context.password).toBe('*****');
    expect(result.context.context.password).toBe('*****');
    expect(result.context.other_bad_field).toBe('*****');
    expect(result.username).toBe('test_user');
    expect(result.context.other_property).toBe('yes');
    expect(result.context.num_property).toBe(123);
  });

  it('should handle circular objects', () => {
    const circularTarget: any = target;
    circularTarget.circular = circularTarget;
    const result = stripObject(circularTarget, blacklist);
    expect(result.circular.password).toBe('*****');
  });
});
