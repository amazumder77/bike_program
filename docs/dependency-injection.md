# Dependency Injection
Nest uses dependency inject to resolve any dependencies for and objects being instantiated. The way it does this is through decorators. Classes that can be injected use the `@Injectable` decorator to register its injection token and classes that have dependencies use the `@Inject` decorator to use injection tokens to retrieve dependencies.

## Contents
* [Providers](#providers)
  * [Custom Providers](#custom-providers)
* [Injection Tokens](#injection-tokens)

## Providers
Providers are classes that are `@Injectable`. They can be defined a couple ways.

The first way is to use the `@Injectable` decorator on the class and then register it in a [Module](https://docs.nestjs.com/modules) like so.
```
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
}

@Module({
    imports: [],
    providers: [
        UserService,
    ],
    exports: [
    ],
})
export class UserModule {}
```
The module now knows to register the `UserService` in the IOC Container using the `UserService` injection token.

### Custom Providers
Some times you want to use a [custom provider](https://docs.nestjs.com/fundamentals/custom-providers) if you need to override default implementations, use contant values. To define a custom provider use the following code as an example.
```
@Module({
    imports: [],
    providers: [
        {
          provide: 'UserService', // injection token
          useClass: UserService
        },
    ],
    exports: [
    ],
})
```
Just be sure that the injection token you use is what any code that depends on it is expecting.

### Injection Tokens
Nest uses Injection Tokens to reference any dependencies. Any `@Injectable` class usually uses the class name as the injection token. You can also override this value by doing `@Injectable('custom-token')`.
