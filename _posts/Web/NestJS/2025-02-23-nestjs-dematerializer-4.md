---
title: NestJS 해체분석기 4 - 예외처리 필터(Exception Filter)와 파이프(Pipe)
excerpt: NestJS가 예외 처리와 입력값 검증을 우아하게 다루는 방법
categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, Exception, Filter, Pipe]

date: 2025-02-23
last_modified_at: 2025-02-23

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

지난 [3편](https://tolerblanc.github.io/javascript/nestjs-dematerializer-3/)에서는 NestJS의 실행 흐름을 제어하는 미들웨어, 가드, 인터셉터에 대해 알아보았다. 
이번에는 NestJS에서 예외를 처리하고 입력값을 검증하는 두 가지 핵심 기능인 **예외 필터(Exception Filter)**와 **파이프(Pipe)**를 살펴보려고 한다. 
예외 필터는 애플리케이션에서 발생하는 다양한 에러를 일관된 형식으로 처리할 수 있게 해주며, 파이프는 들어오는 요청 데이터를 검증하고 변환하는 역할을 담당한다.
이 두 기능은 NestJS 애플리케이션의 품질과 안정성을 크게 좌우하므로, 어떻게 설계하고 확장할지 이해하는 것이 중요하다.

## 예외 필터(Exception Filter)의 동작 원리

NestJS의 예외 필터는 애플리케이션에서 발생하는 모든 예외를 잡아내는 캐치 메커니즘이다. 예외가 발생하면 실행 컨텍스트(`ExecutionContext`)를 통해 현재 실행 중인 요청/응답 객체에 접근할 수 있으며, 이를 통해 클라이언트에게 일관된 형식의 에러 응답을 전달할 수 있다.

우선, 실행 순서부터 알아보자:

1. 애플리케이션의 어느 지점에서든 예외가 throw됨
2. NestJS의 예외 레이어가 예외를 감지
3. 해당 예외 타입에 맞춰 등록된 필터가 있는지 확인 
4. 필터의 `catch()` 메소드 실행
5. 응답 전송

만약 특정 예외 필터가 등록되어 있지 않다면, NestJS는 내부적으로 제공하는 기본 예외 필터(`BaseExceptionFilter`)를 사용한다.

가장 많이 사용하는 시나리오는 HTTP 계층에서 발생하는 예외(HttpException)를 처리하는 경우다. 아래 예시는 기본적인 로깅 기능과 함께, 예외 정보를 일관된 JSON 형태로 반환한다:

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // 에러 로깅
    this.logger.error(
      `${request.method} ${request.url} - ${status}`,
      exception.stack
    );

    // 응답 전송
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code: errorResponse['code'] || 'UNKNOWN_ERROR',
        message: errorResponse['message'] || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? exception.stack : undefined
      }
    });
  }
}
```

여기서 확인할 점은 다음과 같다.

- 로깅: 예외 발생 시 로깅을 남김으로써 서버 운영 중 발생한 문제를 빠르게 파악 가능
- 응답 구조: `statusCode`, `timestamp`, `path`, `error` 등 클라이언트가 에러 상황을 정확히 인지할 수 있도록 필요한 정보를 구조화
- 개발 환경 분기 처리: `NODE_ENV`에 따라 예외의 스택 트레이스(stack trace)를 포함할지 결정

하지만, 실제 애플리케이션에서는 `HttpException`만으로 에러 상황을 모두 처리하기 어렵다. 예를 들어, 사용자 정보가 존재하지 않는다면 `UserNotFoundException`과 같은 구체적인 예외를 만들어 관리하는 것이 좋다. 도메인(업무 로직)마다 예외를 분리하면 유지보수와 디버깅이 훨씬 수월해진다. 아래 예시를 보자:

```typescript
// business.exception.ts
export class BusinessException extends HttpException {
  constructor(
    private readonly code: string,
    message: string,
    private readonly details?: Record<string, any>,
    status: number = 400
  ) {
    super(
      {
        code,
        message,
        details,
        status
      },
      status
    );
  }

  getCode(): string {
    return this.code;
  }

  getDetails(): Record<string, any> | undefined {
    return this.details;
  }
}

// user.exceptions.ts
export class UserNotFoundException extends BusinessException {
  constructor(userId: string | number) {
    super(
      'USER_NOT_FOUND',
      `User with id ${userId} not found`,
      { userId },
      404
    );
  }
}

export class DuplicateEmailException extends BusinessException {
  constructor(email: string) {
    super(
      'DUPLICATE_EMAIL',
      'Email already exists',
      { email },
      409
    );
  }
}
```

이러한 계층화된 예외 구조를 구축하면 다음과 같은 이점이 있다.

- 유지보수성: 예외를 명확히 구분해두면, 나중에 비슷한 에러 상황이 발생했을 때 재활용하거나 확장하기 쉬움
- 가독성: `throw new UserNotFoundException(123)` 같은 형태로 예외가 발생하면, 코드만 봐도 예외의 의미를 직관적으로 파악할 수 있음
- 코드 재사용: 공통 에러 포맷(`BusinessException`)을 확장하여 도메인 전반에 걸쳐 일관된 예외 처리 가능

예외 필터를 전역적으로 적용하지 않고, 특정 컨트롤러나 라우트 핸들러 단위로도 적용할 수 있다. 아래와 같이 `@UseFilters()` 데코레이터를 사용하면 된다:

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {
  // ...
}
```

그 외, 글로벌 레벨에서 적용할 수도 있다:

```typescript
//main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  // ...
  await app.listen(3000);
}
```

## 파이프(Pipe)의 동작 원리와 활용

파이프는 Pipe는 NestJS에서 요청 객체를 가공하거나(변환) 유효성 검증을 수행하기 위한 기능이다. `@Body()`, `@Param()`, `@Query()` 등의 데코레이터로 추출된 파라미터에 대해 `transform()` 메서드를 통해 전처리 과정을 거친 뒤, 컨트롤러나 서비스로 전달된다. 아래와 같은 동작 흐름을 가진다:

1.	라우트 핸들러에 요청이 들어옴
2.	NestJS는 파이프를 순차적으로 실행하며, 파이프는 `transform(inputValue, metadata)` 메서드를 통해 값 검증 또는 변환 로직을 수행
3.	파이프가 예외를 던지지 않으면 변환된(혹은 그대로인) 값을 핸들러에 전달

NestJS에서는 `class-transformer`와 `class-validator`를 사용하는 `ValidationPipe`를 활용해 DTO 단에서 편리하게 유효성 검사를 수행할 수 있다.

```typescript
// validation.pipe.ts
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly options: ValidationPipeOptions = {}) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // 값이 없으면 에러 처리
    if (!value) {
      if (this.options.skipMissingProperties) {
        return value;
      }
      throw new BadRequestException('No data submitted');
    }

    // plainToClass를 이용해 DTO 인스턴스로 변환
    const object = plainToClass(metadata.metatype, value);

    // 유효성 검사 수행
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      ...this.options
    });

    // 유효성 검사 실패 시 예외 처리
    if (errors.length > 0) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: this.formatErrors(errors)
      });
    }

    return value;
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}
```

- `whitelist: true` 옵션은 DTO에 정의되지 않은 속성은 자동으로 제거한다.
- `forbidNonWhitelisted: true` 옵션은 DTO에 정의되지 않은 속성이 포함된 경우 예외를 발생시킨다.
- `skipMissingProperties`와 같은 옵션을 사용해 필수 필드가 누락되었을 때의 처리 방식 등을 유연하게 제어할 수 있다.

실제 DTO에서 각 필드마다 다양한 데코레이터를 사용하여 선언적으로 검증하는 예시도 살펴보자:

```typescript
// user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value.toLowerCase()) // 이메일을 항상 소문자로 변환
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;
}
```

- `@IsEmail` 데코레이터를 이용해 이메일 형식을 자동 검사
- `@Transform` 데코레이터를 통해 값 변환(여기서는 이메일을 항상 소문자로)
- `@IsOptional()`을 사용해 해당 필드가 존재하지 않아도 에러가 발생하지 않도록 설정

위에서 구현한 ValidationPipe와 DTO를 컨트롤러에 적용하면 아래와 같은 형태가 된다:

```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      // 예: DB에 같은 이메일이 존재할 경우 에러 핸들링
      if (error instanceof QueryFailedError && error.message.includes('duplicate key')) {
        throw new DuplicateEmailException(createUserDto.email);
      }
      throw error;
    }
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }
}
```

- `@Param('id', ParseIntPipe)`로 파라미터를 정수로 변환. 변환이 실패하면 NestJS의 내장 예외(BadRequestException)가 발생
- `@Body(new ValidationPipe())`로 요청 바디를 DTO에 맞춰 검사. 유효성 검증에 실패하면 예외 발생
- 발생한 예외(`DuplicateEmailException`, `UserNotFoundException`)는 `HttpExceptionFilter`에서 일관된 포맷으로 처리

파이프 또한 전역적으로 등록하여 사용이 가능하다. 이 경우에는 모든 요청에서 자동으로 유효성 검사가 이뤄지므로, 사용을 지양하는게 좋다고 생각한다. 생각치 못한 사이드 이펙트가 발생할 수 있기 때문이다. 물론 전역 파이프가 등록되어 있더라도, 특정 라우트에 별도로 파이프를 적용하여 세밀한 커스터마이징이 가능하다.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...
  // 글로벌 파이프 등록
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //...
  // 글로벌 예외 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  //...
  await app.listen(3000);
}
```

## 어떻게 사용하는게 좋을까?

1.	도메인 기반 예외 계층화
    - 비즈니스 로직에서 발생할 수 있는 예외를 체계적으로 구분해 `BusinessException` 등으로 추상화해두면, 확장과 유지보수가 용이하다.
2.	글로벌 vs 로컬(메서드/컨트롤러) 적용 전략
    - 모든 로직에 공통 적용이 필요한 부분(로그 포맷, 기본 유효성 검사 등)은 글로벌을 활용하고, 도메인/요건 별로 세밀한 커스터마이징이 필요한 부분은 컨트롤러 수준에서 `@UseFilters()`, `@UsePipes()`를 사용한다.
3.	`ValidationPipe` 옵션
    - `whitelist`, `forbidNonWhitelisted`, `transform` 등을 적절히 설정해 보안성과 개발 편의성을 높인다.
    - skipMissingProperties 같은 옵션을 활용해 PATCH 메서드나 부분 업데이트 시에도 DTO 유효성 검증을 유연하게 적용할 수 있다.
4.	에러 코드 및 메시지 표준화
    - 에러 응답 구조를 일관되게 설계하면, 클라이언트에서 에러를 처리할 때 예측 가능하고 디버깅이 쉬워진다.
    - 예: `{"code": "USER_NOT_FOUND", "message": "User with id 123 not found", "details": { "userId": "123" }}` 등
5.	로깅과 모니터링
    - 예외가 발생할 때마다 로깅을 남기는 것은 필수다.
    - 운영 중에는 모니터링 툴과 연동하여 예외 발생 빈도를 추적하고, 에러의 심각도를 분류해 빠르게 대응할 수 있도록 한다.


## 결론 및 요약, 다음편 예고

3줄로 요약하자면,

- Exception Filter는 NestJS 애플리케이션에서 발생하는 모든 예외를 잡아내고 일관된 처리 방식을 제공한다.
- Pipe는 들어오는 요청 파라미터를 검증하고 필요하다면 변환까지 수행하여, 애플리케이션이 기대하는 형식과 범위를 보장한다.
- 예외와 검증 로직을 애플리케이션 핵심 로직과 분리함으로써 코드의 가독성, 유지보수성, 안정성을 크게 향상시킬 수 있다.

다음 편에서는 커스텀 데코레이터와 `reflect-metadata`에 대해 다룰 것이다.
