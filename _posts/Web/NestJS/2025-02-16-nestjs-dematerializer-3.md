---
title: NestJS 해체분석기 3 -  미들웨어(Middleware), 가드(Guard), 인터셉터(Interceptor)
excerpt: NestJS가 제공하는 관점 지향 프로그래밍(AOP) 구현의 핵심
categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, Middleware, Guard, Interceptor]

date: 2025-02-16
last_modified_at: 2025-02-16

toc: true
toc_sticky: true
related: true
---

## Introduction

지난 [2편](https://tolerblanc.github.io/javascript/nestjs-dematerializer-2/)에서는 동적 모듈과 프로바이더 스코프에 대해 알아보았다. 이번에는 NestJS의 실행 흐름을 제어하는 세 가지 핵심 구성 요소인 미들웨어(Middleware), 가드(Guard), **인터셉터(Interceptor)**를 살펴보려고 한다. Express를 써보셨다면 미들웨어라는 개념이 어색하지 않을 텐데, NestJS는 여기서 한 발 더 나아가 가드와 인터셉터라는 개념을 제공한다. 이들은 각각 다른 시점에서 요청/응답을 가로채고 처리할 수 있게 해주는데, 이런 구조는 관점 지향 프로그래밍(AOP, Aspect-Oriented Programming)을 가능하게 하여, 대규모 애플리케이션에서 중복 로직 최소화, 단일 책임 분리에 큰 도움을 준다.

## 실행 순서부터 제대로 이해하기

<img width="1920" alt="Image" src="https://github.com/user-attachments/assets/30768a2d-85b7-43fb-87f5-095b316737fa" />

| 출처: [(1) 우형의 새로운 백엔드 개발 표준 #우아콘2023 #우아한형제들](https://www.youtube.com/watch?v=Z0d7ZrxY-i0)

NestJS에 하나의 HTTP 요청이 들어오면, 다음과 같은 순서로 처리된다:

1. **미들웨어 (Middleware)**
2. **가드 (Guard)**
3. **인터셉터 - 전처리 (Interceptor - Pre-processing)**
4. **파이프 (Pipe)**
5. **컨트롤러 (Controller)**
6. **서비스 (Service)**
7. **인터셉터 - 후처리 (Interceptor - Post-processing)**
8. **예외 필터 (Exception Filter) - 에러 발생 시**

각 단계가 서로 다른 책임을 지닌다. 주로 다음과 같은 역할로 구분할 수 있다.

-   미들웨어: 가장 앞단에서 공통적으로 필요한 전처리를 수행 (예: 로깅, CORS 설정, Request Body 파싱 등)
-   가드: 인증/인가(Authorization)나 접근 권한 같은 “조건 충족 여부”를 검사해, 특정 라우트 실행을 막거나 통과시키는 관문
-   인터셉터: 요청/응답을 변형(Transform)하거나 추가 로직(예: 캐싱, 로깅, 성능 측정 등)을 주입
-   파이프: 컨트롤러에 도달하기 직전, 입력 데이터(Parameters, Body 등) 검증/변환을 담당
-   예외 필터: 처리 과정에서 에러가 발생하면, 해당 에러를 가로채 적절히 변환해 응답

이번 글에서는 특히 미들웨어, 가드, 인터셉터에 집중하여 어떻게 NestJS에서 이 개념들을 구현하고, 실제로 어떻게 활용할 수 있는지 자세히 살펴보겠다.

## 미들웨어(Middleware): Express와는 어떻게 다를까?

NestJS 미들웨어는 기본적으로 Express 미들웨어 개념과 유사하다. Express처럼 `req`, `res`, `next`를 인자로 받아서, 요청과 응답 사이에 로직을 끼워넣는다. 차이점이 있다면, NestJS에서는 클래스 기반으로 미들웨어를 정의하고, DI(Dependency Injection) 기능을 활용할 수 있다는 점이다.

다음은 간단한 Logger 미들웨어 예시다:

```ts
// logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const env = this.configService.get("ENV");
        console.log(`[${env}] ${req.method} ${req.path}`);
        next();
    }
}
```

`LoggerMiddleware` 클래스가 `NestMiddleware` 인터페이스를 구현하고 있는 형태이며, `use()` 메서드가 Express 미들웨어처럼 동작한다.
DI를 통해 `ConfigService`를 생성자 주입 받아 사용하고 있는 형태이며, `console.log()`로 간단히 로그를 찍은 뒤 `next()`를 호출해 다음 단계로 넘어간다.
이 미들웨어를 실제로 사용하기 위해서는, 해당 미들웨어를 NestJS 애플리케이션에 등록해야 한다. `AppModule`에서 `configure()` 메서드를 구현하는 방법이 대표적이다.

```ts
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";

@Module({
    imports: [],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware) // 하나 이상의 미들웨어 클래스
            .forRoutes("*"); // 특정 라우트(경로)에 한정 가능
    }
}
```

`NestModule` 인터페이스의 `configure()` 메서드를 사용한다. `MiddlewareConsumer`의 `apply()` 메서드에 등록할 미들웨어를 넣고, `forRoutes()` 메서드로 적용할 라우트를 지정한다.
'\*'로 지정하면 모든 요청에 대해 LoggerMiddleware를 실행한다. 특정 라우트(예: 'users'), 특정 메서드(예: { path: 'users', method: RequestMethod.GET }) 등으로 더 세밀하게 제한할 수도 있다.

Express처럼 main.ts에서 `app.use()`를 써도 되긴 하지만, NestJS는 미들웨어 등록 방식을 공식적으로 `MiddlewareConsumer`를 통해 권장한다. 필요에 따라 글로벌로 등록해 전역적으로 적용할 수도 있고, 모듈 단위로 적용해 해당 모듈 내부 라우트에만 작동하게 할 수도 있다.

미들웨어는 보통 간단한 로깅, CORS 설정, Body-parser, Cookie-parser 등 공통 전처리 로직에 사용된다. 가끔은 JWT 토큰 파싱같은 인증 관련 로직도 미들웨어에서 처리하지만, NestJS에서는 인증 로직을 **가드(Guard)**로 넣는 패턴이 훨씬 깔끔하고 권장되는 방안이다.

## 가드(Guard): 진입점을 지키는 문지기

가드는 NestJS에서 인증/인가, 혹은 **"이 요청을 진행해도 되는가?"**를 결정해야 할 때 사용하는 구조이다. 예컨대, “관리자 권한이 있는 사용자만 이 API에 접근할 수 있다” 같은 로직은 Guard를 이용해 구현하면 깔끔해진다.

`CanActivate` 인터페이스를 사용하여, `canActivate()` 메서드에서 `true`/`false`를 반환한다.

```ts
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // JWT 파싱 결과, 혹은 세션에서 가져온 사용자 정보
        // 예: 로그인 여부 확인
        return !!user;
    }
}
```

`ExecutionContext`는 현재 실행되고 있는 컨텍스트 정보를 담는다. HTTP 요청이면 `switchToHttp().getRequest()`로 Express의 `req` 객체에 접근할 수 있다.
Guard는 Boolean을 반환해야 하며, `true`면 라우트에 진입을 허용, `false`면 403(Forbidden) 에러를 발생시킨다.
더 복잡한 로직(예: 역할(Role) 검사, 토큰 검증, DB 조회 등)도 `canActivate()` 내부에서 처리할 수 있다.
가드를 적용시키는 방법은 크게 3가지가 있다.

1.  메서드 혹은 클래스 단위 데코레이터

    ```ts
    @UseGuards(AuthGuard)
    @Controller("admin")
    export class AdminController {
        @Get()
        getAdminData() {
            return "Welcome, admin!";
        }
    }
    ```

    위 예시코드와 같이, 컨트롤러 클래스나 특정 라우트 핸들러 위에 `@UseGuards(AuthGuard)`를 붙여 적용한다.

2.  글로벌 가드(Global Guard)

    ```ts
    // main.ts
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(new AuthGuard());
    await app.listen(3000);
    ```

    이렇게 등록하면, 전체 라우트에 대해 Guard가 적용된다. 글로벌로 쓰면 “로그인이 안 된 사용자에게는 모든 API를 막는다” 같은 패턴을 일관성 있게 구현하기 좋다. 그러나 예상치 못한 사이드 이펙트를 방지하기 위해서라도 지양하는 편이 좋다.

3.  커스텀 메타데이터 + Reflector

    가드 내부에서 Reflector를 이용하면 특정 라우트에만 따로 정보를 부여할 수도 있다. 예: `@Roles('admin')` 데코레이터를 달고, 가드에서 `@Roles` 정보를 검사.

역할(Role)에 따라 접근을 제어하는 예시를 간단히 살펴보자. `@Roles()` 데코레이터로 필요한 권한을 명시하고, Guard에서 이 정보를 읽어와 검사한다.

```ts
// roles.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true; // 데코레이터 없으면 통과
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return requiredRoles.some((role) => user.roles?.includes(role));
    }
}

// admin.controller.ts
@UseGuards(RolesGuard)
@Controller("admin")
export class AdminController {
    @Roles("admin") // admin 권한 필요
    @Get()
    findAll() {
        return "admin data!";
    }
}
```

`@Roles('admin')`로 "이 메서드는 admin 권한이 필요하다"고 선언한다.
`RolesGuard`가 실행되면서, Reflector를 통해 필요한 권한(`'admin'`)을 읽어온 뒤, `request.user`가 가진 `roles` 배열에 `'admin'`이 있는지 검사하고, 일치하지 않으면 Guard가 false를 반환해 접근이 거부된다.
이렇게 Guard는 “조건을 만족해야 통과할 수 있는 관문” 역할을 수행하며, 인증/인가를 구조적으로 분리해 코드 가독성을 높인다.

## 인터셉터(Interceptor): 요청/응답을 바꾸어드립니다

인터셉터는 요청을 가로채 전처리를 수행하거나, 컨트롤러/서비스가 반환한 응답을 가로채 후처리를 하는 기능을 제공한다. "Interceptor"라는 이름 그대로, HTTP 요청-응답을 가로채는 미들웨어와 유사해 보이지만, Guard가 끝난 뒤, Controller로 진입하기 전/후라는 특정 지점에서 동작한다는 점이 다르다.

NestJS 공식 문서에서 인터셉터의 역할을 이렇게 소개하고 있다.

-   변환(Transformation): 응답 객체를 다른 형태로 변환하거나, 요청 객체를 수정할 수 있음
-   바운딩(Atomicity): 하나의 로직(트랜잭션 처리 등)을 시작 전과 후로 감쌀 수 있음
-   에러/예외 처리: try-catch를 통해 예외 발생 시 로깅/메트릭 수집
-   추가 로직 주입: 성능 측정(타이머)나 캐싱 로직 등

인터셉터는 `callHandler.handle()`을 이용해 실제 컨트롤러 로직을 실행하기 전후에 전처리 또는 후처리 작업을 구현할 수 있다. 예시를 보자:

```ts
// logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log("Before handler...");

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => console.log(`After handler... ${Date.now() - now}ms`))
            );
    }
}
```

`intercept()` 안에서 `console.log("Before handler...")`가 실행 → 전처리
`next.handle()`로 컨트롤러/서비스 로직을 실행하고, 반환된 Observable 스트림에 `tap()` 연산자를 붙여 후처리 로직을 추가 (성능 측정 예시)
즉, `intercept()` 메서드 전반부에 전처리 로직을 작성할 수 있고, `return next.handle().pipe(...)` 이후로는 후처리 로직을 작성할 수 있다.

가드와 마찬가지로, 인터셉터는 `@UseInterceptors()` 데코레이터를 사용해서 클래스나 메서드 단위로 적용할 수 있고, 글로벌 인터셉터로 등록하여 전역에서 모든 라우트에 대해 전처리/후처리를 적용할 수도 있다.

```ts
@Controller("cats")
@UseInterceptors(LoggingInterceptor)
export class CatsController {
    @Get()
    findAll() {
        return [{ name: "Tom" }, { name: "Kitty" }];
    }
}

// 또는 main.ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
await app.listen(3000);
```

## 실제로 어떻게 활용할 수 있을까?

지금까지 살펴본 미들웨어, 가드, 인터셉터는 NestJS의 요청 처리 파이프라인 중 서로 다른 역할을 담당한다. 실제로는 다음과 같은 시나리오에서 유용하게 사용될 수 있다.

-   미들웨어로 JWT 토큰 파싱

    JWT가 `Authorization` 헤더에 실려온다고 가정할 때, 미들웨어에서 토큰을 파싱해 `req.user`에 넣어둘 수 있다.
    이렇게 하면 이후 Guard나 Controller가 더 편리하게 `req.user`를 참조할 수 있다.

-   가드로 인증/인가 로직 처리

    "이 API는 admin 역할을 가진 사용자만 접근 가능" 같은 로직을 Guard에서 단일 책임으로 처리. 컨트롤러나 서비스는 본연의 로직에만 집중하게 된다.

-   인터셉터로 API 응답 포맷 일관성 보장

    후처리 과정에서 API 응답을 `{ data, status, message }` 형태로 감싸거나, SnakeCase ↔ CamelCase 변환을 수행할 수 있다. 전처리 과정에서 요청 본문에 대한 추가 변환이나, DB 트랜잭션 시작/종료 타이밍을 잡을 수도 있다.

-   글로벌 로그/성능 측정

    LoggingInterceptor를 글로벌로 등록해 모든 요청에 대해 응답 시간, 응답 상태 코드를 측정 & 로깅하는 등의 작업을 수행할 수 있다. 운영 관점에서 시스템 성능을 모니터링하는 데 큰 도움이 된다.

요약하자면, 각 구조가 특정 시점에 특화된 책임을 갖게 됨으로써, 중복 코드 없이 AOP(관점 지향)적인 로직을 깔끔하게 분리할 수 있다.

<!-- 사례 추가하기 -->

## 결론 및 요약, 다음편 예고

이번 글에서는 NestJS의 실행 흐름을 제어하는 세 가지 핵심 구성 요소, 미들웨어, 가드, 인터셉터를 살펴보았다.

-   미들웨어: Express 스타일의 전처리 로직을 NestJS의 DI와 결합해 객체 지향적으로 작성 가능
-   가드(Guard): “진입 허용 여부”를 결정하는 관문 (주로 인증/인가 로직 담당)
-   인터셉터(Interceptor): 요청/응답을 전처리·후처리하여 변형/로깅/캐싱 등 다채로운 기능을 구현

다음 편에서는 **예외 처리(필터, Exception Filter)와 파이프(Pipe)**를 본격적으로 다룰 예정이다.

-   예외 필터: 컨트롤러나 서비스에서 발생하는 에러를 어떻게 잡아 응답할지를 제어
-   파이프: 요청으로 들어오는 입력값(Body, Params 등)을 검증 및 변환하는 기법
