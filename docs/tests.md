# Tests
We use [Jest](https://jestjs.io/) as our test framework. This doc will go over how our tests are structured and any best practices we are enforcing.

# Dependencies
To create a test, we want to setup any dependencies the test will use. Nest provides a way to create [testing modules](https://docs.nestjs.com/fundamentals/unit-testing) so that we can take advantage of the IOC Container.

Here is an example where We setup a test for a controller the requires the `UserService` which requires the `UserRepository`.

```
module = await Test.createTestingModule({
      imports: [],
      controllers: [
        UserController,
      ],
      providers: [
        UserService,
        {
          provide: 'UserRepositoryRepository', // The injection token created from @InjectRepository(UserRepository) in the UserService
          useClass: UserRepository,
        },
      ],
      exports: [],
    }).compile();
```

The providers a registered so that any class in this module can use those classes. Now we can retrieve the classes from the container like this.

```
controller = module.get<UserController>(UserController);
```

***Note: `module.get<T>(Token)` above uses `T` as the type to be returned and `Token` as the injection token to look for.***

# Mocking
We don't want to make any calls to the database on these tests. We just want to make sure that methods behave as expected. To do this we need to mock dependencies so that we are only testing One method at a time.

Say we want to test if the `UserService.find()` method behaved properly we can set it up like this.
```
// User Service

async find(id: number): Promise<UserRO> {
    return await this.userRepository.findOneOrFail(id);
  }
```

```
// Test

describe('find', () => {
    it('should return a User', async () => {
      const users = [new User()];
      const mock = jest.spyOn(userRepository, 'findOneOrFail');
      mock.mockImplementationOnce((id) => users[id]);

      expect(await service.find(0)).toBe(users[0]);
      expect(mock).toHaveBeenCalled();
      expect(mock).toHaveBeenCalledWith(0);
    });
  });
```

Here we are overriding `findOneOrFail` on the `UserRepository` so that it does not make any database calls. We tell it to return a value that we defined. That we we can check that `UserService.find()` uses the repository the way we expect by checking that it calls the expected method, and that it passes that parameters that we expect.

***Note: Mocking a class will cause all moethods in that class to be `undefined`. You have to re-implement any methods that will be used.***

# Integration Tests (e2e)
Nest refers to integration tests as e2e and we use that syntax throughout our codebase.

## Globals
There are a few globals provided in `/test/@types/node.d.ts` such as the Nest instance, user, and a superagent request.

The global user is prebuilt to be HqO staff at building 1 and is generated per test case.
**Accessing global.user in beforeAll() will return undefined**

## Authentication
Authentication headers (bearer token/building) is provided as a superagent plugin. You must attach this per request like so:
``` js
  global.request
    .get('/api/users/4766')
    .use(auth)
    .expect(200);
```

## Custom users
A user builder is provided at `/test/data/user/userBuilder.ts`. Use this to generate users with custom roles, building, and properties. For example, to create a Member user in building 1 and 3 with custom description:
``` js
  const user = await new UserBuilder()
    .data({ description: 'hi :)' })
    .role([Roles.MEMBER])
    .building(1, 3)
    .build();
```
