---
title: "NestJS 해체분석기 1 - NestJS의 철학과 모듈성"
excerpt: "NestJS는 어떤 문제를 해결하기 위해 등장했고, 무슨 원리가 숨어있을까?"

categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, IoC, DI]

date: 2025-01-19
last_modified_at: 2025-01-19

toc: true
toc_sticky: true
related: true
---

## Introduction

실무에서 NestJS를 주로 쓰게 되면서, 그동안 내가 얼마나 근본 없이 프레임워크를 사용해왔는지 깨닫게 되었다. 왜 이런 구조를 쓰는지, 내부적으로 어떻게 동작하는지 모르고 ‘일단 만들어본다’는 식이었으니까. 하지만 스케일이 커지면, ‘몰라도 일단 돌아가게 만드는 방식’만으로는 한계가 온다. 그래서 남는 시간에 틈틈이 NestJS 공식문서를 꼼꼼하게 읽으면서, 관련된 내용과 내가 잘 몰랐던 부분을 정리하고 이를 시리즈로 연재해보려고 한다. 개인 공부를 위함도 있지만, NestJS 관련하여 찾아보면 깔끔한 아티클이 그리 많지 않아서, 이 시리즈가 참고서 정도는 됐으면 좋겠다는 마음에 작성하려고 한다. 이 글은 그 시리즈의 1편이다. 1편에서는 가볍게 NestJS라는 프레임워크가 등장하게 된 배경과 프레임워크가 가지는 철학에 대해 알아보고, NestJS의 핵심이라고 볼 수 있는 모듈 개념과 DI에 대해 정리한다.

## NestJS의 탄생과 철학

### Node.js로 대규모 프로젝트를 하고 싶어요

Node.js는 자바스크립트를 브라우저 밖에서도 실행할 수 있게 하면서, 서버 사이드 개발의 문법 장벽을 크게 낮췄다. 많은 개발자가 Express를 이용해 빠르게 REST API를 만들기 시작했고, "Node.js 웹 프레임워크 = Express"라는 공식이 자연스럽게 자리 잡았다. Express는 다음과 같은 장점을 가진다.
- 러닝 커브가 완만하다.
- 필요한 만큼만 가져다 쓸 수 있다. (기본적인 웹 애플리케이션 기능으로 구성된 얇은 계층만을 제공하기 때문에 커스텀이 용이하다.)
- 자유도가 높고, 미들웨어 기반의 구조로 확장성 있는 구조를 가져가기 좋다.

하지만 서비스 규모가 커질수록, 높은 자유도가 오히려 발목을 잡는 순간이 필연적으로 온다.
- 팀마다 폴더 구조가 다 달라서, 새로운 팀원은 코드를 찾기부터 헷갈린다.
- 서비스가 커지니 의존성(예: DB 연결, 인증, 로깅 등)을 직접 주입해 주는 게 귀찮아진다.
- 각 기능이 서로 어떻게 연결되는지, 어디까지가 책임 범위인지 애매하다.

NestJS는 위와 같은 Express의 단점을 해결하기위해 등장했다. Express의 장점인 자유도와 그 친숙함은 유지하면서, 엔터프라이즈급 애플리케이션에 필요한 구조적 일관성과 모듈성을 더해주는 것이다.

### Angular에서 영감을 받았다고?

NestJS의 공식 문서를 보면, 다음과 같은 문구가 적혀있다. 이 문구 외에도 다양한 지점에서 Angular에게 영감을 받았다는 문장이 자주 등장한다.

> Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.
> 
>Nest는 개발자와 팀이 고도로 테스트 가능하고 확장 가능하며 느슨하게 결합되고 쉽게 유지 관리할 수 있는 애플리케이션을 만들 수 있는 기본 애플리케이션 아키텍처를 제공합니다. 이 아키텍처는 Angular에서 많은 영감을 받았습니다.

실제로 둘은 다음과 같은 공통점이 있다.

1. **TypeScript 중심 개발**
- 큰 규모의 프로젝트에서 타입 안정성(type-safety)은 생각보다 중요하다. NestJS는 Angular처럼 TypeScript를 적극 활용해, 컴파일 타임에 에러를 잡고 IDE 지원(자동 완성, 리팩토링)을 극대화한다.

2. **모듈(Module) 구조**

- Angular가 `@NgModule`로 기능을 묶듯, NestJS도 `@Module()` 데코레이터로 하나의 기능(도메인)을 모듈 단위로 캡슐화한다. 이렇게 나누면 ‘어디서 어떤 기능을 제공하는지’가 한눈에 보이니, 구조적 일관성이 올라간다.

3. **의존성 주입(Dependency Injection) 시스템**
- Angular가 내부 DI 컨테이너로 컴포넌트 사이 의존성을 관리하듯, NestJS도 DI 컨테이너를 내장해 클래스 간 결합도를 낮춰준다. 덕분에 테스트할 때, 목(Mock) 객체를 손쉽게 주입하기도 쉽다.

4. **데코레이터(Decorator) 기반 선언적 프로그래밍**
- `@Controller`, `@Injectable`, `@Module` 등의 데코레이터는 클래스를 “이건 컨트롤러야”, “이건 프로바이더야”라고 명확히 표시한다. 코드만 봐도 각 클래스가 어떤 역할인지 한눈에 보여 협업과 유지보수에 유리하다.

### 다양한 패러다임을 지닌 NestJS

NestJS는 구조적으로 **OOP(객체 지향)**, **FP(함수형)**, 그리고 **FRP(반응형 프로그래밍)** 까지 다양한 패러다임을 자유롭게 섞어 쓸 수 있도록 디자인되었다. 각 패러다임에 대한 짧은 요약과 어떻게 적용할 수 있는지에 대한 예시를 아래에서 확인할 수 있다. 여기서는 간단한 예시만 살펴보고, 추후에 조금 더 깊이 다뤄볼 예정이다.

#### Object Oriented Programming (객체 지향 프로그래밍)

**개념 요약**
- **클래스**를 통해 캡슐화, 상속, 다형성 같은 개념을 활용하여 코드를 구조화한다.
- 상태와 행위를 객체로 묶어 책임을 명확히 할 수 있다.

**예시**
```ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findUserById(id: number) {
    return this.userRepository.findById(id);
  }
}
```
- `UserService`라는 클래스를 정의하고, **생성자 주입**을 통해 다른 클래스(UserRepository)에 의존한다.
- 메서드를 통해 로직을 캡슐화하고, 필요한 상태(데이터)와 행위(메서드)를 한 곳에서 관리한다.

#### Functional Programming (함수형 프로그래밍)

**개념 요약**
- **순수 함수**(pure function)와 **함수 합성**(function composition)을 중요시하며, 불변성을 지향한다.
- 부작용(side effect)을 최소화해, 예측 가능성과 테스트 용이성을 높인다.

**예시**
```ts
// 순수 함수로서의 데이터 변환
function transformUserData(rawData: any): User {
  return {
    id: rawData.id,
    name: rawData.name.trim(),
    isActive: Boolean(rawData.isActive),
  };
}

// Service에서도 FP 기법 적용 가능
@Injectable()
export class UserService {
  transformAndSave(rawData: any): User {
    const user = transformUserData(rawData); // 순수 함수 사용
    // 이후 DB 저장 로직
    return this.userRepository.save(user);
  }
}
```

- `transformUserData()`는 입력을 받아 출력만을 반환하며, 외부 상태를 변경하지 않는 순수 함수다.
- 불변성을 지키며 데이터를 처리해 로직의 가독성과 유지보수성을 높인다.

#### Functional Reactive Programming (반응형 프로그래밍)

**개념 요약**
- 시간에 따라 변하는 데이터를 **스트림**(Stream)으로 보고, 데이터 흐름에 반응(react)하면서 연산을 수행한다.
- RxJS 같은 라이브러리를 통해 **Observable** 방식으로 비동기 처리를 선언적으로 다룰 수 있다. -> Pub-Sub 패턴과 밀접한 연관이 있다.

**예시**
```ts
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getEvents(): Observable<Event[]> {
    return this.eventsService.observeEvents(); // Observable<Event[]>
  }
}

@Injectable()
export class EventsService {
  private events$: Subject<Event[]> = new BehaviorSubject<Event[]>([]);

  observeEvents(): Observable<Event[]> {
    return this.events$.asObservable();
  }

  addEvent(newEvent: Event) {
    const current = this.events$.getValue();
    this.events$.next([...current, newEvent]);
  }
}
```
- `BehaviorSubject`를 사용해 이벤트 목록을 스트림(Observable)으로 관리한다.
- `EventsController`에서 `this.eventsService.observeEvents()`를 반환하면, 구독(subscribe)하는 쪽에서 이벤트 스트림을 실시간으로 받는다.
- 데이터의 변화를 시간 흐름에 맞춰 반응형으로 처리할 수 있다.

## NestJS 모듈의 기초 개념

NestJS에서 개발하는 코드는 **모듈(Module)** 을 중심으로 조직된다. 흔히 **AppModule**이라는 루트(최상위) 모듈에서 시작해, 사용자 기능(UserModule), 상품 기능(ProductModule) 등 도메인별로 세분화하여 구성하게 된다.

###  **모듈, 컨트롤러, 프로바이더**

- **모듈(Module)**: Nest 애플리케이션을 구성하는 ‘덩어리’ 단위. `@Module()` 데코레이터로 선언하며, 내부에 어떤 컨트롤러/프로바이더가 들어가는지 지정한다.
- **컨트롤러(Controller)**: HTTP 요청을 수신하고, 응답을 반환하는 역할. `@Controller('경로')` 데코레이터로 선언하며, Express의 router 개념과 비슷하다.
- **프로바이더(Provider)**: 서비스, 리포지토리, 헬퍼 등 “비즈니스 로직이나 데이터 처리를 담당하는 클래스”를 통칭한다. 보통 `@Injectable()` 데코레이터를 붙여, NestJS DI 컨테이너에 의해 자동 주입될 수 있도록 만든다.

간단한 `UserModule` 예시를 들어보자.
```ts
// user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}

// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }
}

// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll() {
    return this.userRepository.findAll();
  }
}
```

위 예시와 같이 `UserModule` 안에 `UserController`, `UserService`, `UserRepository`를 묶어보면, 코드를 처음 보는 사람도 '아 여기서 사용자 관련 로직을 전부 관리하는구나' 라고 생각할 수 있는, 구조적 일관성이 생긴다. 자연스럽게 데코레이터들(클래스 위에 붙는 `@`)을 사용하고 있는데, 세부 구현을 몰라도 선언형으로 가져다 쓸 수 있는 물건이다. 데코레이터의 원리 자체는 [이 글](https://tolerblanc.github.io/python/what-is-decorator/)을 참고해보자. Python으로 적었지만, 큰 맥락에서 원리는 비슷하다고 볼 수 있다. 오히려 TypeScript의 데코레이터가 확장성이 더 좋아보이기도 한다. 이것도 따로 글을 적어 볼 것 이지만, 지금은 TypeScript 리플렉션(`Reflect.metadata`)을 통해 클래스/메서드/프로퍼티 정보를 읽고, NestJS 내부에서 이를 IoC 컨테이너에 등록한다는 원리만 알고있어도 문제없다. 즉, TypeScript의 데코레이터는 Python에서 제시하는 함수 합성의 개념보다는 Java에서의 어노테이션에 좀 더 가깝다.

### **Singleton, Global, Dynamic Module**

모듈 자체도 다양한 종류가 있다. 맛보기로 각 모듈이 어떤 특징을 가지고 어떤곳에 쓰이는지 알아보자.

-  **싱글톤(Singleton) 모듈/프로바이더**
	- 기본적으로 NestJS에서 프로바이더는 **애플리케이션 생명주기 동안 하나의 인스턴스**만 생성되는 싱글톤 패턴을 따른다.
	- `@Injectable({ scope: Scope.DEFAULT })`가 바로 싱글톤이며, 대부분의 서비스가 이 스코프로 동작한다.
- **글로벌(Global) 모듈**
	- 여러 모듈에서 공통으로 쓰이는 서비스를 따로 모듈로 빼놓고, `@Global()` 데코레이터를 붙이면 어디서든지 불러 쓸 수 있다.
	- 예: 로깅, 인증 관련 모듈 등.
- **다이나믹(Dynamic) 모듈**
	- `forRoot()`나 `forRootAsync()` 같은 패턴으로, **외부 설정(환경 변수 등)에 따라 모듈 생성 로직을 커스터마이징**할 수 있다.
	- 예: DB 연결 정보를 다른 서버에서 받아온다거나, 실행 시점에 옵션을 주입받아 모듈 내부 구성을 바꾼다.

## NestJS는 어떻게 의존성을 관리하는가?

NestJS에서 가장 돋보이는 기능 중 하나가 **의존성 주입(DI)** 이다. 규모가 커질수록, “이 클래스가 저 클래스를 생성해야 한다”는 식의 직접적인 의존 관계가 늘어나면 코드가 점점 복잡해진다. NestJS는 이를 DI 컨테이너가 대신 처리해주므로, 개발자가 일일이 객체를 새로 만들 필요가 없다. 왜 필요한지는 [여기](https://tolerblanc.github.io/javascript/loose-coupled-with-ncp/)를 참고하면 좋다. 이걸 개발자가 직접 처리하려면, 수많은 클래스의 의존관계를 전부 파악하고 있어야 하며, 관계에 따라 적절히 코드로 작성해줘야 한다.

### 의존성 주입(DI)이란 무엇일까?

- **전통적인 OOP**에서는 UserService가 UserRepository를 직접 생성(new UserRepository())해 사용한다. 이렇게 하면 UserService와 UserRepository가 강하게 묶이게 되어, 테스트나 교체가 어려워진다.
- **DI(Dependency Injection)** 는 "필요한 의존성(Dependency)을 직접 만들지 말고, **외부에서 주입(Injection)** 받아 쓰자"는 개념이다.
- 이 방식은 **제어의 역전(Inversion of Control, IoC)** 원리를 따른다. 즉, 객체 간 생성·수명 관리를 애플리케이션 전체 흐름(IoC 컨테이너)이 맡고, 각 객체는 자기 로직만 신경 쓴다. (제어권이 개발자에서 프레임워크로 역전되었다는 뜻)

### NestJS DI Container

NestJS는 `@Injectable()`로 등록된 클래스들을 내부 DI 컨테이너에 보관하고 있다가, 누군가가 필요로 하면 자동으로 인스턴스를 주입해준다.

- 모듈이 로드될 때, 해당 모듈이 의존하는 컨트롤러와 프로바이더들을 스캔한다.
- 프로바이더 간 **의존 관계 그래프**를 분석해, 싱글톤/요청/트랜지언트 등 스코프에 맞춰 자동 인스턴스를 만든다.
- 컨트롤러나 다른 서비스에서 생성자 매개변수로 요청하면, 이미 만들어둔(또는 필요 시 생성한) 인스턴스를 주입한다.

```ts
@Controller('users')
export class UserController {
  // DI 컨테이너가 알아서 UserService를 주입
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }
}
```

위 코드에서 우리가 직접 `new UserService()` 하지 않아도, NestJS가 알아서 `UserService` 인스턴스를 넣어준다. 테스트 시에는 컨트롤러를 유닛 테스트할 때 `UserService`를 목 객체로 교체하기도 쉽다. DI 컨테이너 덕분에 결합도가 낮아지니, 유지보수와 확장성이 그만큼 올라간다.

세세한 내부 구현은 [공식 레포의 packages/core/injector 디렉터리](https://github.com/nestjs/nest/tree/master/packages/core/injector)에서 확인할 수 있다. 코드까지 끌어와서 설명하면 글이 너무 무겁고 복잡해질 것 같으니, 1편에서는 핵심 파일을 추려보고 그 역할에 대해서 요약만 하려고 한다.

1. `container.ts`
- 각 모듈(Module)과 그 안에 등록된 프로바이더(Provider)·컨트롤러(Controller)를 트리(tree) 구조로 관리하는 핵심 컨테이너 로직
- NestJS가 애플리케이션을 실행하면서 모듈 간 imports/exports 관계를 어떻게 연결하는지, 프로바이더를 어디서 가져와야 하는지를 정의
2. `instance-loader.ts`
- 말 그대로 "인스턴스를 로드"해주는 역할을 담당
- 모든 모듈에 선언된 프로바이더(서비스, 리포지토리 등)를 순회하며, "아직 생성되지 않은" 프로바이더 인스턴스를 만들어 DI 컨테이너에 등록
- `Injector`나 `ModuleRef`를 사용해 의존 관계를 추적하면서, 필요한 의존성을 재귀적으로 주입해주는 식으로 동작
3. `module-ref.ts`
- `ModuleRef` 클래스는 코드 상에서 "특정 모듈 내부"에 접근할 때 사용
- 예: 어떤 프로바이더가 같은 모듈 안에 있는 다른 프로바이더를 가져올 때 또는, 전역/공유 모듈에서 프로바이더를 꺼낼 때 `ModuleRef`가 핵심 역할을 수행
4. `injector.ts`, `module.ts`
- `injector.ts`: 프로바이더(또는 컨트롤러) 인스턴스를 생성하고, 생성자 파라미터로 주입되어야 할 의존성을 찾아내는 로직이 들어 있음
- `module.ts`: 모듈 단위로 프로바이더(Injectables), 컨트롤러, exports를 정리해서 보관하는 역할

마지막으로, NestJS 애플리케이션을 실행할 때, 부트스트래핑 과정을 정리하려고 한다.
1. **모듈 메타데이터 스캔**: AppModule부터 시작해 imports 배열을 순회하면서 모든 모듈을 찾고, 각 모듈의 providers, controllers, imports, exports 정보를 읽어 Container 내부에 구성해둔다.
2. **인스턴스 로더(InstanceLoader)가 순회**:  InstanceLoader는 Container가 보유한 모든 모듈을 차례로 훑으며 모듈에 등록된 프로바이더를 확인하고, 아직 생성되지 않은 프로바이더가 있다면, `injector.ts` 내부 로직을 사용해 인스턴스를 생성한다.
3. **생성자 의존 관계 확인 & 재귀 주입**:  프로바이더 클래스를 인스턴스화할 때, 그 클래스의 생성자 파라미터(의존 대상)를 추적한다. 파라미터에 매칭되는 프로바이더가 이미 있으면 그 인스턴스를 가져오고, 없으면 새로 만들어서 등록한다. (단, 스코프에 따라 생성 로직이 달라질 수 있다. 이 과정을 재귀적으로 반복하면서 전체 의존성 그래프를 해소한다.

## 결론 및 요약, 다음편 예고

여기까지 정리하자면,
- **NestJS의 등장 배경**: Express.js의 자유도는 유지하되, 대규모 프로젝트에 필요한 구조와 컨벤션을 제공하기 위함.
- **철학**: TypeScript, 모듈성, DI, 데코레이터 기반 등 Angular에서 영감을 받아, **확장성과 일관성**을 동시에 추구한다.
- **모듈 시스템**: 기능별로 컨트롤러와 프로바이더를 그룹화해, 서비스 구조를 한눈에 알 수 있도록 한다. 다이나믹 모듈 같은 고급 기능으로 유연성도 챙긴다.
- **DI(의존성 주입)**: NestJS의 DI 컨테이너가 객체 생성과 의존 관계를 자동 관리해주므로, 개발자가 로직만 신경 쓰면 된다.

**다음 편**에서는 forRoot(), forRootAsync() 등 **동적 모듈(Dynamic Module)** 의 구체적인 사용법과, **프로바이더 스코프(싱글톤, 트랜지언트, 요청 스코프)**, 그리고 NestJS에서 컨트롤러 외에 자주 쓰이는 **미들웨어, 가드, 인터셉터** 같은 구조에도 본격적으로 파고들 계획이다.
