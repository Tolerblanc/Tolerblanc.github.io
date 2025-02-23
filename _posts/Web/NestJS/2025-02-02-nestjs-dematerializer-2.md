---
title: NestJS 해체분석기 2 - 동적 모듈(Dynamic Module)과 프로바이더 스코프(Provider Scope)
excerpt: NestJS의 확장성과 유연성을 책임지는 두 키워드에 대해
categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, DynamicModule, Provider, Scope]

date: 2025-02-02
last_modified_at: 2025-02-02

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

지난 [1편](https://tolerblanc.github.io/javascript/nestjs-demeterializer-1/)에서는 NestJS가 어떤 철학과 배경을 가지고 만들어졌는지, 그리고 모듈 시스템과 DI(의존성 주입)가 어떻게 돌아가는지를 살펴보았다. 이번에는 한 걸음 더 깊이 들어가서, NNestJS의 확장성과 유연성을 책임지는 두 가지 핵심 개념인 **동적 모듈(Dynamic Module)**과 **프로바이더 스코프(Provider Scope)**에 대해 구체적으로 알아볼 것이다. 동적 모듈은 환경별로 다른 설정이 필요하거나 테스트를 위해 특정 기능을 모킹(Mocking)해야 할 때 유용하다. 프로바이더 스코프는 인스턴스의 생명주기를 세밀하게 제어할 수 있게 해주어, 메모리 관리나 요청별 상태 관리에 있어 큰 도움이 된다.

## 동적 모듈(Dynamic Module) 살펴보기

### 동적 모듈이 왜 필요할까?

NestJS 모듈은 기본적으로 정적이다. `@Module()` 데코레이터에 `controllers`, `providers`, `imports`, `exports` 등을 지정해 고정된 구성으로 사용한다. 즉, 모듈이 어떤 컨트롤러와 프로바이더를 가질지가 코드 작성 시점에 이미 결정된다. 그런데 상황에 따라 “앱을 부트스트랩할 때 옵션을 다르게 주고 싶다”거나 “환경 변수 또는 외부 설정값에 따라 내부 의존성을 바꾸고 싶다” 같은 요구사항이 생길 수 있다.

예컨대, 개발 환경(dev)에서는 콘솔에 로깅만 하고, 프로덕션(prod) 환경에서는 외부 로깅 서비스(예: Datadog, Logstash 등)를 연동하는 식으로 말이다. 이런 식의 유연한 설정을 쉽게 해주는 것이 바로 동적 모듈(Dynamic Module)이다. 보통 다음과 같은 상황에 자주 쓰인다:

1. **환경별로 다른 설정이 필요한 경우**
    - 개발/스테이징/운영 환경마다 다른 DB 연결 정보
    - 테스트 환경에서는 실제 외부 API 대신 Mock 서버 사용
2. **런타임에 설정을 주입해야 하는 경우**
    - 서버 시작 시 환경 변수나 설정 파일에서 값을 읽어와야 함
    - 다른 서비스의 응답을 받아 설정을 동적으로 구성해야 함
3. **같은 모듈을 다른 설정으로 여러 번 사용하는 경우**
    - 여러 DB에 동시 연결이 필요한 상황
    - 다른 옵션을 가진 같은 기능을 여러 곳에서 사용

### forRoot() 패턴

가장 흔하게 볼 수 있는 형태는 `forRoot()`라는 정적 메서드(static method)를 통해 모듈을 반환하는 것이다. 간단한 예시로 LoggerModule을 만들어보자.

```typescript
// logger.module.ts
import { DynamicModule, Module } from "@nestjs/common";

@Module({})
export class LoggerModule {
    static forRoot(env: "dev" | "prod"): DynamicModule {
        const providers =
            env === "dev"
                ? [{ provide: "LOGGER", useClass: ConsoleLogger }]
                : [{ provide: "LOGGER", useClass: ExternalLogger }];

        return {
            module: LoggerModule,
            providers,
            exports: providers,
        };
    }
}
```

-   `forRoot()` 메서드는 환경별로 다른 설정을 받아 모듈을 동적으로 구성한다.
-   `providers` 배열은 모듈에서 사용할 프로바이더를 정의한다.
-   `exports` 배열은 다른 모듈에서 사용할 수 있도록 노출할 프로바이더를 정의한다.
-   이 예시에서는 `env` 인자를 받아, 환경에 따라 다른 로깅 방식을 사용한다.
-   LoggerModule 내부에서 `forRoot(env)` 라는 함수를 만들고, 반환 타입을 `DynamicModule`로 지정한다.
-   이 함수 안에서 `providers` 배열을 동적으로 구성하고, 최종적으로 `{ module, providers, exports }` 객체를 반환한다.
-   이제 AppModule 등에서 `LoggerModule.forRoot(process.env.NODE_ENV)` 처럼 환경 변수나 설정값을 넣어 모듈을 가져올 수 있다.

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { LoggerModule } from "./logger.module";

@Module({
    imports: [
        LoggerModule.forRoot(
            process.env.NODE_ENV === "production" ? "prod" : "dev"
        ),
    ],
})
export class AppModule {}
```

이렇게 하면 애플리케이션 실행 시점에 NODE_ENV 값을 기준으로 내부 로깅 방식을 간단히 스위칭할 수 있다.

### forRootAsync() 패턴

조금 더 고급 사례로, 외부 API나 비동기 로직을 통해 설정값을 받아야 할 때는 `forRootAsync()` 패턴이 유용하다. 예를 들어 이런 경우를 위해 `forRootAsync()` 패턴을 사용한다:

-   설정 서버에서 값을 받아와야 할 때
-   환경 변수나 설정 파일을 비동기적으로 로드할 때
-   다른 서비스의 초기화가 필요할 때

```typescript
// database.module.ts
@Module({})
export class DatabaseModule {
    static forRootAsync(options: DatabaseAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: "DATABASE_OPTIONS",
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                DatabaseService,
            ],
            exports: [DatabaseService],
        };
    }
}

// config.service.ts
@Injectable()
export class ConfigService {
    async getDatabaseConfig(): Promise<DatabaseOptions> {
        // 설정 서버나 환경 변수에서 값을 비동기적으로 로드
        return {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
        };
    }
}

// app.module.ts
@Module({
    imports: [
        DatabaseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return await configService.getDatabaseConfig();
            },
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
```

이 패턴의 핵심은 `useFactory()` 함수다. 이 함수는:

1. 비동기적으로 실행될 수 있고 (`async/await` 지원)
2. 다른 프로바이더를 주입받아 사용할 수 있으며 (`inject` 배열)
3. 동적으로 설정값을 생성해 반환할 수 있다

providers에서 `useFactory`를 활용하면, NestJS DI 컨테이너가 해당 프로바이더를 초기화할 때 자동으로 이 팩토리 함수를 실행하고 결과를 주입한다.

### 내부적으로 무슨 일이 일어나고 있는건가요?

NestJS가 애플리케이션을 부트스트랩할 때, 동적 모듈은 다음과 같은 과정을 거친다:

1. **모듈 스캔 단계**

    - `AppModule`부터 시작해 `imports` 배열을 재귀적으로 순회
    - 동적 모듈 메서드(`forRoot`/`forRootAsync`)를 만나면 실행하여 `DynamicModule` 객체를 얻음

2. **의존성 해결 단계**

    - `imports` 배열에 명시된 모듈들을 먼저 초기화
    - `providers` 배열의 `useFactory` 함수들을 실행하여 실제 값을 얻음
    - 이 과정에서 `inject` 배열에 명시된 의존성들이 주입됨

3. **인스턴스 생성 단계**
    - 모든 설정값이 해결되면, 프로바이더 인스턴스들을 생성
    - 생성된 인스턴스는 모듈의 컨텍스트에 저장되어 이후 주입 시 재사용

```typescript
// 실제 NestJS 코드 (간략화)
export interface DynamicModule extends ModuleMetadata {
    module: Type<any>;
    global?: boolean;
}

export interface ModuleMetadata {
    imports?: Array<
        Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    controllers?: Type<any>[];
    providers?: Provider[];
    exports?: Array<
        | DynamicModule
        | Promise<DynamicModule>
        | string
        | symbol
        | Provider
        | ForwardReference
        | Abstract<any>
    >;
}
```

정리하자면, 동적 모듈은 “NestJS 모듈을 원하는 대로 ‘조립’해서 반환할 수 있는 패턴”이며, 흔히 `forRoot(), forRootAsync()` 형태로 사용한다. 이를 활용하면 앱 환경이나 비즈니스 요구사항에 따라 유연한 구성(의존성, 옵션, 프로바이더 등록 등)을 할 수 있다.

## 프로바이더 스코프(Provider Scope) 살펴보기

프로바이더 스코프는 NestJS가 프로바이더 인스턴스를 어떻게 생성하고 공유할지를 결정하는 설정이다. 이전 글에서 “NestJS는 기본적으로 프로바이더를 싱글톤으로 관리한다”고 언급했지만, 실제로는 서비스마다 다른 스코프를 지정할 수도 있다. NestJS에서는 다음 세 가지 스코프가 존재한다:

1. **DEFAULT (싱글톤)**

    - 기본값
    - 전체 애플리케이션에서 하나의 인스턴스만 생성되어 공유
    - 메모리 효율적이며 상태 공유가 필요할 때 유용

2. **REQUEST**

    - 각 요청마다 새로운 인스턴스가 생성
    - 요청별로 독립된 상태를 유지해야 할 때 사용
    - 예: 트랜잭션 관리, 요청별 로깅

3. **TRANSIENT**
    - 주입될 때마다 새로운 인스턴스 생성
    - 프로바이더를 주입받는 각 컴포넌트가 독립된 인스턴스를 가짐
    - 메모리 사용량이 증가할 수 있으므로 신중히 사용

```typescript
// singleton.service.ts (기본값)
@Injectable()
export class SingletonService {
    private count = 0;

    increment() {
        return ++this.count;
    }
}

// request.service.ts
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
    constructor(
        @Inject(REQUEST) private request: Request // 현재 요청 객체 주입
    ) {}

    getRequestId() {
        return this.request.id;
    }
}

// transient.service.ts
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
    private readonly instanceId = Math.random();

    getInstanceId() {
        return this.instanceId;
    }
}

//scope-test.controller.ts
@Controller("scope-test")
export class ScopeTestController {
    constructor(
        private readonly singletonService: SingletonService,
        private readonly requestService: RequestScopedService,
        private readonly transient1: TransientService,
        private readonly transient2: TransientService
    ) {}

    @Get()
    test() {
        return {
            // 모든 요청에서 같은 값이 증가
            singletonCount: this.singletonService.increment(),
            // 각 요청마다 고유한 ID
            requestId: this.requestService.getRequestId(),
            // 같은 컨트롤러 안에서도 다른 인스턴스
            transient1Id: this.transient1.getInstanceId(),
            transient2Id: this.transient2.getInstanceId(),
        };
    }
}
```

위 예시 코드의 컨트롤러를 테스트 해본다면, 매 요청마다 얻어지는 값을 토대로 각 스코프의 동작 방식을 확인할 수 있다. 대부분의 비즈니스 로직은 싱글톤 스코프만으로도 충분하지만, “요청마다 달라지는 상태를 저장해야 하는” 특정 기능에는 요청 스코프가 꽤 편리하다. 트랜지언트 스코프는 상대적으로 드문 편이지만, 필요하다면 DI 설정만 바꿔서 쉽게 적용할 수 있다. 실제로 사용될 만한 예시를 다음 목차에서 살펴보자.

### 실제 사용 예시

1. **트랜잭션 관리 (REQUEST 스코프)**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class TransactionService {
    private queryRunner: QueryRunner;

    constructor(
        private connection: Connection,
        @Inject(REQUEST) private request: Request // 요청 객체 주입: 요청별 고유 컨텍스트 활용
    ) {
        // 각 인스턴스는 새로운 QueryRunner를 생성하여, 다른 요청과 분리된 트랜잭션 환경을 보장한다.
        this.queryRunner = this.connection.createQueryRunner();
    }

    // withTransaction 메서드는 전달받은 callback 내에서 실행되는 데이터베이스 작업을 트랜잭션으로 감싼다.
    // 실행 순서는 다음과 같다:
    // 1) QueryRunner와의 연결 후 트랜잭션 시작
    // 2) callback 실행 후 성공 시 커밋, 실패 시 롤백 수행
    // 3) 마지막에 QueryRunner 리소스를 해제하여 메모리 누수 방지
    async withTransaction<T>(
        callback: (queryRunner: QueryRunner) => Promise<T>
    ): Promise<T> {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        try {
            const result = await callback(this.queryRunner);
            await this.queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await this.queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await this.queryRunner.release();
        }
    }
}

// 아래 처럼 사용할 수 있다.
await transactionService.withTransaction(async (queryRunner) => {
    await queryRunner.manager.save(user);
    await queryRunner.manager.save(order);
});
```

이 TransactionService는 요청 스코프를 적용하여, 각 HTTP 요청마다 별도의 트랜잭션 인스턴스를 제공함으로써 데이터 일관성을 유지하고, 동시에 여러 요청의 트랜잭션 작업이 서로 영향을 미치지 않도록 보장하는 용도로 사용된다.

2. **로깅 컨텍스트 (REQUEST 스코프)**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {
    private context: any = {};

    constructor(@Inject(REQUEST) private request: Request) {
        this.context.requestId = request.id;
        this.context.timestamp = new Date();
    }

    log(message: string) {
        console.log({
            message,
            ...this.context,
        });
    }
}
```

이 로거는 요청 스코프를 적용하여, 각 HTTP 요청마다 고유한 로깅 컨텍스트를 제공한다. 이렇게 하면 각 요청에서 독립적인 로깅 인스턴스를 유지할 수 있으며, 요청별로 다른 정보를 추가할 수 있다.

3. **이메일 발송 서비스 (TRANSIENT 스코프)**

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class EmailService {
    private config: EmailConfig;

    constructor() {
        this.config = {}; // 기본 설정 초기화
    }

    setConfig(config: EmailConfig) {
        this.config = config;
    }

    async send(email: Email) {
        // 이메일 발송 로직
        console.log(`Sending email to ${email.to} with config:`, this.config);
    }
}

@Controller("emails")
export class EmailController {
    constructor(
        @Inject(EmailService)
        private readonly emailServiceFactory: () => EmailService
    ) {}

    @Post("send")
    async sendEmail(@Body() emailDto: EmailDto) {
        const emailService = this.emailServiceFactory();
        emailService.setConfig({
            template: "welcome",
            sender: "no-reply@example.com",
        });
        await emailService.send(emailDto);
    }
}
```

이 예시에서는 트랜지언트 스코프를 사용하여, 각 요청마다 새로운 이메일 서비스 인스턴스를 생성한다. 이렇게 하면 각 요청에서 독립적인 이메일 설정을 유지할 수 있으며, 요청별로 다른 이메일 발송 로직을 적용할 수 있다.

### 주의사항과 성능 고려사항

사실 위 예시에서 제시했던 것들은 대부분 싱글톤 스코프로도 충분히 구현할 수 있다. 프로바이더 스코프에 대한 이해를 위해 억지로 작성한 예시에 가깝다. 프로바이더 스코프를 적절히 활용한다면 유용하겠지만, 주의해야 할 점들이 많다.

1. **메모리 사용량**

    - REQUEST와 TRANSIENT 스코프는 새로운 인스턴스를 계속 생성하므로 메모리 사용량이 증가할 수 있음
    - 특히 TRANSIENT는 신중하게 사용해야 함

2. **순환 참조 주의**

    - 다른 스코프를 가진 프로바이더 간의 순환 참조는 예상치 못한 동작을 일으킬 수 있음
    - 가능하면 같은 스코프를 가진 프로바이더끼리 참조하도록 설계

3. **스코프 결합 시 고려사항**
    - DEFAULT 스코프 프로바이더가 REQUEST 스코프 프로바이더를 주입받으면 에러 발생
    - 이런 경우 `REQUEST_CONTEXT` 토큰을 사용해 현재 요청 컨텍스트에 접근해야 함

## 결론 및 요약, 다음편 예고

이번 글에서는 NestJS의 두 가지 핵심 기능인 동적 모듈과 프로바이더 스코프에 대해 알아보았다.

**동적 모듈**은:

-   런타임에 모듈 설정을 결정할 수 있게 해주는 강력한 기능
-   `forRoot()`와 `forRootAsync()` 패턴으로 유연한 설정 주입 가능
-   환경별 설정, 테스트용 모킹 등에 매우 유용

**프로바이더 스코프**는:

-   인스턴스의 생명주기를 세밀하게 제어
-   DEFAULT(싱글톤), REQUEST, TRANSIENT 세 가지 옵션 제공
-   각각 용도에 맞게 적절히 선택해서 사용해야 함

다음 글에서는 NestJS의 실행 흐름을 제어하는 미들웨어(Middleware), 가드(Guard), 인터셉터(Interceptor)에 대해 자세히 알아볼 예정이다. 이들은 NestJS의 또 다른 핵심 기능으로, AOP(관점 지향 프로그래밍) 구현의 근간이 된다.
