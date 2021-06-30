# Validation
We make use of [class-validator](https://github.com/typestack/class-validator) package to execute validation. To define validation for an API endpoint you need to create a DTO class which will define the rules for each field in the request.Each module should have a dto folder that contains.

## Contents
* [Assigning Validation to a Route](#assigning-validation-to-a-route)
* [Whitelisting](#whitelisting)
* [Resources](#resources)

## Assigning Validation to a Route
To assign validation to a route simply typehint the validator class as to the request body parameter as shown below.

```
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Req() request: Request, @Body() userData: CreateUserDto): Promise<UserRO> {
    return await this.userService.create(userData);
  }
}
```
The `CreateUserDto` typehint will cause the request body to be applied to that DTO and the ValidationPipe middleware will execute the validation and strip any unwhitelisted fields.

## Whitelisting
The appliction is set up to only allow whitelisted fields through to the controller. In order to whitelist a field you have to implement at least one validation on that field or the `@Allow()` decorator.

```
import { ApiModelProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ExampleDto {
  @ApiModelProperty() // Used just for swagger
  @IsEmail()
  readonly email: string; // Pased Through

  @IsNotEmpty()
  @MaxLength(60)
  @MinLength(6)
  readonly password: string; // Passed through

  @Allow()
  readonly first_name: string; // Passed through

  @ApiModelProperty()
  readonly last_name: string; // Not passed through
}
```

## Resources
* [Nest Docmentation](https://docs.nestjs.com/techniques/validation)
* [Class Validator Documentation](https://github.com/typestack/class-validator)
