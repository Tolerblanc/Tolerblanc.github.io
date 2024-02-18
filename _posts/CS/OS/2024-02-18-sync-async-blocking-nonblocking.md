---
title: "동기와 비동기, 블로킹과 논블로킹"
excerpt: ""

categories:
    - OS
tags:
    - [OS, UNIX, IO_multiplexing]

date: 2024-02-18
last_modified_at: 2024-02-18

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>


## Summary

- 동기(Synchronous), 비동기(Asynchronous), 블로킹(Blocking), 논블로킹(Non-blocking) 모두 I/O 작업에서 흔히 볼 수 있는 용어이다.
- I/O 작업은 user space에서 직접 수행할 수 없기 때문에, 유저 프로세스가 커널에 I/O 작업을 요청하고 응답을 받는 구조이다.
- 응답을 어떤 순서로 받는지에 따라 동기/비동기로 나뉘고, 어떤 타이밍에 받는지에 따라 블로킹/넌블로킹으로 나뉜다.

![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1bd70d34-3e9a-4e67-8689-6028699bd381)
[이미지 출처](https://black7375.tistory.com/90?fbclid=IwAR0s7vbA0G3tC42sIl0ocq2oAHWELXblgWEyyXsI2zhaNwibMe3UzdPbaLY_aem_AUj7xGIBeJWM1Wa1xUy899IlN_A6numNnfCU95poLpFxylCrkhMPWh4vNPUMVnVd8YU)

## Synchronous vs. Asynchronous

- 동기(Synchoronous; 이하 `Sync`로 표기)와 비동기(Asynchronous; 이하 `Async`로 표기)는 기술적으로 구분되지 않으며, 행위에 대한 이야기(=추상적인 구분)이다.
    - `Sync`/`Async`는 연산 결과의 반환 시점(결과 반환이 순차적인지 / 연산이 병렬적이라 결과 반환이 제각각인지)에 대한 이야기이다.
- 요청한 작업에 대해 완료 여부를 신경 써서, 작업을 순차적으로 수행할 지 아닌지에 대한 관점이다. → 작업 완료를 누가 확인하는가?
- `Sync` : 작업 시간을 함께 맞추어 실행하는 것 ⇒ 요청한 작업에 대해 완료 여부를 따져가며 순차적으로 처리
- `Async` : `Sync`와 반대로 요청한 작업에 대해 완료 여부를 따지지 않고 다음 작업을 그대로 수행
- 즉 `Sync`는 작업 순서가 지켜지지만, `Async`는 작업 순서가 지켜지지 않는다.

<img width="823" alt="Untitled 1" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4aa67e61-f994-4637-a632-d1271460f1e0">
[이미지 출처](https://scoutapm.com/blog/async-javascript)

- 멀티 쓰레드가 `Async`의 대표적인 예시라고 할 수 있다. → 즉, `Async`는 동시성 문제를 해결해야 한다.
- 하지만 `Async`는 위 사진에서 볼 수 있다시피, 성능상 이점을 가져온다.
- 흔히 콜백 함수( _Callback_ Function)를 `Async` 구현과 동치로 여기는 경우가 많은데, 이는 오개념이다.
    - 특정 조건에 따라 _Callback_ 을 호출하고 `Async`로 돌아가는 경우도 있지만,  _Callback_ 을 단순 연속 실행으로 함수의 맨 마지막줄에서 호출하는 경우도 있기 때문이다.

## Blocking vs. Non-blocking

- 블로킹(`Blocking`)과 넌블로킹(`Non-blocking`)은 기술적으로 명확히 구분된다.
    - `Blocking`은 작업 자체가 중단되기 때문에 `Blocking`/`Non-blocking`은 기술적으로 구분할 수 있다.
    - `Blocking`/`Non-blocking` 은 결과를 기다리는 동안 호출자가 어떻게 행동하는지에 대한 구분이다.
    - ⇒ 현재 작업이 block 되느냐 아니냐에 따라 다른 작업을 수행할 수 있는지에 대한 관점이다.
- `Sync`/`Async`가 전체적인 작업에 대한 순차적인 흐름 유무라면, `Blocking`/`Non-blocking`은 전체적인 작업의 흐름 자체를 막느냐의 여부로 볼 수 있다. → 제어권이 어디에 있는가?
    - `제어권`은 해당 함수의 동작 권리 정도로 생각하자.
- 호출된 함수가 자신이 할 일을 모두 마칠 때까지 제어권을 계속 가지고서 호출한 함수에게 바로 return 하지 않으면 `Blocking`이다.

    ![Untitled 3](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/6c2f32f0-ee99-438d-b24f-4c3093cda444)

    - B 함수가 호출되면서 A 함수에 대한 제어권을 가져간다.
	- 제어권이 없는 A 함수는 어떤 동작도 할 수 없다.
	- B 함수가 완료되어야 A 함수에 대한 제어권을 다시 A 함수로 돌려준다.
	- 제어권을 돌려받은 A 함수는 그제서야 동작할 수 있다.

- 호출된 함수가 자신이 할 일을 마치지 않았더라도 바로 제어권을 바로 return하여 호출한 함수가 다른 일을 진행할 수 있도록 하면 `Non-blocking`이다.

    ![Untitled 4](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/08f51fd8-f9d5-4c3c-a73f-888362972738)
    
	- B 함수가 호출되지만, A 함수에 대한 제어권은 넘어가지 않음
	- 제어권이 있는 A 함수는 자신의 다른 동작을 실행 가능
	- A 함수가 B 함수의 실행 완료를 어떻게 확인 하느냐에 따라 `Sync`/`Async` 로 갈림.
		- A 함수가 직접 B 함수의 리턴값을 확인하면 `Sync`
		- B 함수가 콜백 함수 등의 메커니즘으로 실행 완료를 A 함수에게 알려주면 `Async`
	- `Non-blocking` 컨셉 자체는 A 함수의 제어권이 다른 함수로 넘어가지 않고, 자신의 동작을 지속할 수 있다는 것이다.


## Synchronous Blocking

- 호출한 함수가 직접 리턴 여부를 지속적으로 확인 (`Sync`) + 호출한 함수가 제어권을 넘겨서, 자신의 동작이 멈춤 (`Blocking`)

<img width="555" alt="Untitled 5" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/fdaf2462-9e30-49d3-ac69-17de1c9de66e">

## Synchronous Non-blocking

- 호출한 함수가 직접 리턴 여부를 지속적으로 확인 (`Sync`) + 호출한 함수가 제어권을 넘기지 않고, 자신의 동작이 지속됨 (`Non-blocking`)

<img width="556" alt="Untitled 6" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d1f5038d-c5e7-4ec7-9d3b-ac4a654a88b4">

## Asynchronous Blocking

- 호출된 함수가 리턴 여부를 확인시켜줌 (`Async`) + 호출한 함수가 제어권을 넘겨서, 자신의 동작이 멈춤 (`Blocking`)

<img width="369" alt="Untitled 7" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b335d9ad-f914-4641-897a-8e7397e85018">


## Asynchronous Non-blocking

- 호출된 함수가 리턴 여부를 확인시켜줌 (`Async`) + 호출한 함수가 제어권을 넘기지 않고, 자신의 동작이 지속됨 (`Non-blocking`)

<img width="390" alt="Untitled 8" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/09dbd425-4f0d-48ea-8dda-8de7cc9d6ae4">

## Reference

[](https://inpa.tistory.com/entry/%F0%9F%91%A9%E2%80%8D%F0%9F%92%BB-%EB%8F%99%EA%B8%B0%EB%B9%84%EB%8F%99%EA%B8%B0-%EB%B8%94%EB%A1%9C%ED%82%B9%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC)

[블로킹 Vs. 논블로킹, 동기 Vs. 비동기](https://velog.io/@nittre/%EB%B8%94%EB%A1%9C%ED%82%B9-Vs.-%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9-%EB%8F%99%EA%B8%B0-Vs.-%EB%B9%84%EB%8F%99%EA%B8%B0)

[[OS] (동기/비동기) 와 (블럭/논블록의) 차이](https://dkswnkk.tistory.com/488)

[동시성, 병렬, 비동기, 논블럭킹과 컨셉들](https://black7375.tistory.com/90?fbclid=IwAR0s7vbA0G3tC42sIl0ocq2oAHWELXblgWEyyXsI2zhaNwibMe3UzdPbaLY_aem_AUj7xGIBeJWM1Wa1xUy899IlN_A6numNnfCU95poLpFxylCrkhMPWh4vNPUMVnVd8YU)

[[네이버클라우드 기술&경험] IO Multiplexing (IO 멀티플렉싱) 기본 개념부터 심화까지 -1부-](https://blog.naver.com/n_cloudplatform/222189669084)

[I/O model](https://medium.com/@devAsterisk/i-o-model-1b3851f6a816)