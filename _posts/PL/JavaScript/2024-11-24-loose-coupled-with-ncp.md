---
title: "느슨한 결합과 테스트 용이성을 위한 모듈화 방법"
excerpt: "NestJS로 NCP 이미지 업로드 기능을 구현하며 느슨한 결합을 위한 모듈 분리 방법을 알아보자"

categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, Loose Coupling]

date: 2024-11-24
last_modified_at: 2024-11-24

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

최근에 프로젝트를 진행하며 NCP의 Object Storage로 이미지 업로드 API를 구현할 일이 생겼는데, 이 과정에서 그간 고민하던 '테스트 하기 쉬운 구조'에 대한 나만의 답을 약간이나마 찾은 것 같아서 정리해보려고 한다. 그동안 느슨한 결합(Loose Coupling)이라는 말을 계속해서 들어왔지만 제대로 이해하지 못한 상태였는데, 직접 구현하며 얻은 깨달음을 기록해두려고 한다.
NCP의 Object Storage로 이미지 업로드하는 그 구현 방법 자체가 궁금한 사람은 이 글이 크게 도움되지 않을 것 같다. 의존성 주입(Dependency Injection)과 느슨한 결합이라는 단어를 들어는 봤지만 잘 이해가 되지 않았다면 이 글을 읽어보는 것도 좋을 것 같다.

> NCP의 Object Storage는 AWS의 S3와 비슷한 서비스로, SDK가 호환된다. 이 글의 예시는 `aws-sdk`를 사용하였으며, 실제 메서드가 아닌 pseudo-code 형태로 작성하였다.

## Express의 콜백 기반 라우터 핸들러

Express는 콜백 함수 기반의 라우터 핸들러를 사용하여 특정 엔드포인트로 들어오는 요청을 처리하도록 한다. 이러한 특성 때문에 콜백 지옥에 빠지기 쉽고, 테스트 하기 어려운 구조를 만들기 쉽다. 예시를 들어보면 아래와 같다.

```typescript
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

app.post('/upload', (req, res) => {
  s3.upload(
    {
      Bucket: 'example-bucket',
      Key: req.file.filename,
      Body: req.file.buffer,
    },
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    }
  );
});
```

어느 정도 잘 동작할 것 같이 생겼다. 기능 상 문제는 없어보인다. 하지만 이 코드는 유지보수와 테스트 측면에서 문제가 있다. 

### 뭐가 문제일까?

위 기능에 대해 테스트 코드를 작성한다고 가정해보자. `s3.upload()` 메서드는 실제 AWS 서비스를 호출하기 때문에 단위 테스트를 수행하기 어렵다. 또한, 테스트시 실제 서비스를 호출하게 되어 비용이 발생할 수 있다. 환경 변수 또한 적절히 설정해줘야 하는 점도 문제가 될 수 있다.

Express의 콜백 기반 라우터 핸들러는 비동기 흐름을 체계적으로 관리하기 어렵게 만들며, 이는 코드의 가독성을 떨어뜨리고 유지보수성을 낮추는 원인이 된다. 이런 구조에서는 에러 처리가 일관되지 않거나 중첩된 콜백으로 인해 코드의 복잡도가 증가하는 문제가 발생하기 쉽다. 

## 레이어드 아키텍처와 NestJS의 의존성 주입

### 레이어드 아키텍처란?

Express 구조에서는 라우터, 비즈니스 로직, 데이터 접근 코드가 한 곳에 혼재되기 쉽다. 이러한 단일 책임 원칙(Single Responsibility Principle; SRP)의 위반은 테스트가 어렵고, 코드가 비대해질수록 유지보수가 힘들어지는 문제를 초래한다. 이를 해결하기 위해 레이어드 아키텍처(Layered Architecture) 접근을 도입할 수 있다. 각 레이어는 특정 역할에만 집중하며, 이를 통해 코드의 모듈화와 재사용성을 높일 수 있다.

Express에서도 레이어드 아키텍처를 적용할 수 있다. NestJS를 사용하지 않고, Express 상에서 직접 레이어드 아키텍처를 구현해보면, 새로운 문제에 봉착할 수 있다. 레이어드 아키텍처에서는 각 계층끼리의 의존이 강할 수 밖에 없다. 이를 해결하기 위해선 의존성 주입(Dependency Injection) 메커니즘을 도입하여 각 계층에서 생성자 기반으로 의존성을 관리하도록 해야 한다. 

### 의존성 주입(Dependency Injection)과 제어 역전(Inversion of Control)을 직접 구현해보기

실제로 이전 프로젝트에서 아래와 같은 간단한 DI 컨테이너를 구현하여 사용한 적이 있다.

```javascript
export default class DIContainer {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
    }

    register(name, definition, dependencies = [], singleton = true) {
        this.services.set(name, { definition, dependencies, singleton });
    }

    get(name) {
        const target = this.services.get(name);

        if (!target) {
            throw new Error(`Service ${name} not found`);
        }

        if (!target.singleton) {
            return this.createInstance(target.definition, target.dependencies);
        }

        if (!this.singletons.has(name)) {
            this.singletons.set(
                name,
                this.createInstance(target.definition, target.dependencies)
            );
        }
        return this.singletons.get(name);
    }

    createInstance(definition, dependencies) {
        const resolvedDependencies = dependencies.map((dep) => this.get(dep));
        return new definition(...resolvedDependencies);
    }
}
```

'의존성'이라는 개념이 잘 와닿지 않을 수 있는데, 쉽게 말하면 "A가 B를 필요로 하는" 관계를 의미한다. 휴대폰과 충전기의 관계를 생각해보면 쉽다.

- 휴대폰은 충전을 하기 위해 충전기가 필요하다.
- 따라서 "휴대폰은 충전기에 의존한다"고 말할 수 있다.
- 이때 충전기가 휴대폰의 "의존성"이다.

위 코드는 싱글톤으로 객체를 관리할 수 있는 간단한 형태의 DI 컨테이너이다. 하지만 이것 조차도 문제가 있다. 실제로 사용할 때에는 아래와 같이 초기화하는 코드가 필연적이다.

```javascript
const diContainer = new DIContainer();
diContainer.register("userRepository", UserRepository);
diContainer.register("cardRepository", CardRepository);
diContainer.register("boardRepository", BoardRepository);
diContainer.register("columnRepository", ColumnRepository);
diContainer.register("historyRepository", HistoryRepository);
// HistoryService는 historyRepository를 필요로 한다.
diContainer.register("historyService", HistoryService, ["historyRepository"]);
// BoardService는 boardRepository를 필요로 한다.
diContainer.register("boardService", BoardService, ["boardRepository"]);
// ColumnService는 columnRepository를 필요로 한다.
diContainer.register("columnService", ColumnService, ["columnRepository"]);
// CardService는 cardRepository, historyService, columnService를 필요로 한다.
diContainer.register("cardService", CardService, [
    "cardRepository",
    "historyService",
    "columnService",
]);
// CardController는 cardService를 필요로 한다.
diContainer.register("cardController", CardController, ["cardService"]);
// AuthController는 authService를 필요로 한다.
diContainer.register("historyController", HistoryController, [
    "historyService",
]);
// AuthService는 userRepository, boardService, columnService를 필요로 한다.
diContainer.register("authService", AuthService, [
    "userRepository",
    "boardService",
    "columnService",
]);
```

이러한 초기화 코드는 매우 번거롭고, 코드의 가독성을 떨어뜨리는 요소이다. DI 컨테이너를 직접 구현함으로써 객체의 제어 역전 중 생명주기 관리 책임을 위임했지만, 여전히 객체 생성과 주입에 대한 책임은 개발자에게 남아있다. 이를 해결하기 위해 NestJS에서는 데코레이터 기반 의존성 주입과 제어 역전(Inversion of Control; IoC)을 제공한다.

## 느슨한 결합을 위한 NestJS 적용 사례

### 의존성 주입(Dependency Injection)과 제어 역전(Inversion of Control)

의존성 주입과 제어 역전은 객체 지향 프로그래밍에서 핵심적인 디자인 패턴이다. 의존성 주입은 한 객체가 다른 객체를 직접 생성하는 대신, 외부에서 필요한 객체를 주입받는 방식을 말한다. 이는 마치 레고 블록처럼 필요한 부품을 외부에서 조립하는 것과 비슷하다. 

제어 역전은 이러한 객체 생성과 생명주기 관리의 책임을 프레임워크나 컨테이너에 위임하는 것을 의미한다. 전통적인 프로그래밍에서는 프로그래머가 직접 객체의 생성과 소멸을 관리했지만, 제어 역전 패턴에서는 이러한 제어권을 프레임워크에 넘긴다. 이는 마치 식당에서 주방장이 요리에만 집중할 수 있도록, 재료 준비와 설거지는 다른 스태프들이 담당하는 것과 비슷하다.

NestJS는 이러한 메커니즘을 데코레이터를 통해 우아하게 구현한다. `@Injectable()` 데코레이터가 붙은 클래스는 NestJS의 IoC 컨테이너에 의해 자동으로 관리된다. 개발자는 더 이상 객체의 생성과 주입을 직접 신경 쓸 필요가 없으며, 비즈니스 로직 구현에만 집중할 수 있다. 이는 앞서 보았던 DIContainer를 직접 구현하고 관리하는 번거로움을 완전히 제거해준다.

### 느슨한 결합(Loose Coupling)

느슨한 결합이란 서로 다른 컴포넌트 간의 의존성을 최소화하는 설계 원칙이다. 이는 마치 도시의 전력 시스템과 같다. 우리는 콘센트에 전자기기를 꽂기만 하면 되지, 발전소가 어떻게 전기를 생산하는지 알 필요가 없다. 발전 방식이 화력에서 태양광으로 바뀌어도 우리의 전자기기는 여전히 잘 작동한다.

의존성 주입과 제어 역전은 이러한 느슨한 결합을 달성하는 핵심 메커니즘이 된다. 컴포넌트가 자신이 필요로 하는 의존성을 직접 생성하지 않고 외부에서 주입받음으로써, 실제 구현체와의 결합도가 낮아진다. 이는 마치 자동차 부품을 모듈화하여, 필요할 때 다른 제조사의 부품으로 교체할 수 있게 만드는 것과 같다.

NestJS의 의존성 주입 메커니즘을 활용하여, 엔드포인트 코드(대게 `Controller`로 작성)와 비즈니스 로직(대게 `Service`로 작성) 간 느슨한 결합을 달성할 수 있다. 아래는 맨 처음 작성했던 Express 코드를 NestJS로 작성한 예시이다.

```typescript
@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Buffer, key: string) {
    return this.s3Client.upload({
      Bucket: 'example-bucket',
      Key: key,
      Body: file,
    });
  }
}
```

라우터는 상위 계층인 `Controller`에서 작성되고, 해당 `Controller`는 `Service`에 의존성을 가진다. 또한 현재의 `UploadService`는 외부에서 `ConfigService`를 주입받아, 환경변수를 통해 필요한 값을 가져온다. 이러한 방식으로 작성하면, 실제 구현체와의 결합도가 낮아지며, 테스트 코드 작성 또한 용이해진다.

### 문제점 발견하기

앞서 작성한 `UploadService`는 의존성 주입을 활용하고 있지만, 여전히 개선의 여지가 있다. S3Client를 서비스 내부에서 직접 생성하는 것은 마치 식당 주방장이 식재료를 직접 재배하는 것과 같다. 이는 주방장의 본질적인 역할인 요리에 집중하지 못하게 만든다.

이러한 구조는 테스트 작성을 어렵게 만든다. S3Client를 가짜 객체로 대체할 수 없기 때문에, 실제 AWS 서비스에 의존적인 테스트를 작성할 수밖에 없다. 또한 설정 변경이 필요할 때마다 서비스 코드를 수정해야 하며, 다른 스토리지 서비스로의 전환도 큰 작업이 된다.

### 다시 개선하기

```typescript
export const s3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  },
  inject: [ConfigService],
};

@Injectable()
export class UploadService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Buffer, key: string) {
    return this.s3Client.upload({
      Bucket: 'example-bucket',
      Key: key,
      Body: file,
    });
  }
}

```

NestJS의 Provider 패턴은 이러한 문제를 우아하게 해결할 수 있는 방법을 제공한다. Provider는 의존성을 정의하고 관리하는 특별한 객체로, NestJS의 IoC 컨테이너에 의해 관리된다. `useFactory`를 통해 동적으로 의존성을 생성할 수 있으며, 이는 설정값에 따라 다른 구현체를 제공해야 할 때 특히 유용하다.

개선된 코드에서는 S3Client의 생성 책임을 Provider로 완전히 분리했다. 이제 `UploadService`는 마치 요리사가 식재료를 받아서 요리하는 것처럼, 주입받은 클라이언트를 사용하여 파일 업로드라는 본연의 책임에만 집중할 수 있다. 설정이 변경되거나 다른 스토리지 서비스로 전환해야 할 때도 Provider만 수정하면 되므로, 변경의 영향 범위가 최소화된다.


## 마치며

느슨한 결합을 통한 테스트 가능한 코드 작성은 단순히 의존성 주입을 사용하는 것 이상의 깊은 고민이 필요하다. 각 컴포넌트의 책임을 명확히 분리하고, 적절한 추상화 계층을 두어 변경의 영향을 최소화하는 것이 중요하다.

NestJS가 제공하는 도구들을 적절히 활용하면, 테스트하기 쉽고 유지보수가 용이한 코드를 작성할 수 있다. 특히 Provider 패턴을 통한 의존성 관리는 실제 서비스와의 결합도를 낮추고, 테스트 용이성을 크게 향상시킨다.

이러한 패턴들은 처음에는 과도한 추상화처럼 느껴질 수 있다. 하지만 프로젝트가 커지고 복잡해질수록, 그리고 팀의 규모가 커질수록 이러한 설계의 진가가 드러난다. 테스트 작성과 유지보수의 용이성은 단순한 개발 편의성을 넘어, 프로젝트의 지속가능성과 직결되는 중요한 가치이기 때문이다. 또한 실제 프로젝트에서 이러한 설계를 적용한 경험을 통해 유지보수성과 코드 품질을 높이는 데 기여할 수 있었다.
