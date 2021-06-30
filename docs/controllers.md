# Controllers
Controllers are responsible for setting up routing, assigning [validation](validation.md), applying controller specific [guards](https://docs.nestjs.com/guards), [middleware](https://docs.nestjs.com/middleware), [interceptors](https://docs.nestjs.com/interceptors), [pipes](https://docs.nestjs.com/pipes) and assigning [swagger documentation](https://docs.nestjs.com/recipes/swagger).

## Contents
* [Routing](#routing)
* [Responses](#responses)
* [Return Objects](#return-objects)
* [Authentication](#authentication)
* [Swagger Documentation](#swagger-documentation)
* [Resources](#resources)

## Routing
To apply routes to a method make use of the `@Get`,`@Post`, `@Put`, `@Delete`

## Responses
To send a response for the request just return the values from the controller method.

***Note: Do not use the `@Response` parameter decorator or it will bypass the middleware***

## Return Objects
Return objects define the expected structure of a request response. Return objects are, simply, interfaces that define the object structure. This allows use to have a better idea what form the data should be and create a contract with the service classes the controllers use.

***Not: Any route that returns model data should typehint the returned data.***
```
@Get(':id')
  async find(@Req() request: Request, @Param('id') id: number): Promise<UserRO> {
    return await this.userService.find(id);
  }
```

## Authentication
To apply authentication, apply the following decorator to either the Controller Class or a specific method.
```
// Applied to the whole class
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt')) // Applied to this method
  @Get()
  async findAll(@Req() request: Request): Promise<UserRO[]> {
    return await this.userService.findAll();
  }
}
```
## Swagger Documentation
Nest comes with a [swagger integration](https://docs.nestjs.com/recipes/swagger) that provides decorators for controllers and validation. Make sure to Provide swagger documentation for your routes.

_TODO: Add more instruction._

## Resources
* [Nest Documentation](https://docs.nestjs.com/controllers)
* [Swagger Documentation](https://docs.nestjs.com/recipes/swagger)
* [Guards](https://docs.nestjs.com/guards)
* [Middleware](https://docs.nestjs.com/middleware)
* [Interceptors](https://docs.nestjs.com/interceptors)
* [Pipes](https://docs.nestjs.com/pipes)
