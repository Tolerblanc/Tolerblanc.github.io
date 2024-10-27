---
title: "[Node.js] 비동기(Asynchronous)와 이벤트 루프(Event Loop)"
excerpt: "Node.js의 핵심 메커니즘인 비동기와 이벤트 루프의 구현을 뜯어보자"

categories:
    - JavaScript
tags:
    - [NodeJS, Asynchronous, EventLoop]

date: 2024-10-27
last_modified_at: 2024-10-27

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

이 글은 Node.js의 핵심 메커니즘인 비동기와 이벤트 루프, 그 `Under the hood`가 궁금한 사람들을 독자로 가정하고 작성하였다. 비동기 코드를 작성해본 경험이 있고, 자료구조에 대한 이해가 있다면 좀 더 쉽게 읽을 수 있을 것이라고 생각한다.

최근 프로젝트를 하다가 Node.js의 내장 모듈인 `fs` 를 사용할 일이 있었고, 간편하고 빠르게 작성하려다보니 동기(Synchronous) API를 활용했다. 그러나 이 부분이 Node.js의 강점을 살리지 못하는 부분이라고 피드백을 받았고, 비동기(Asynchronous) API를 사용하는게 어떻겠냐는 제안을 받았다. 피드백을 받아들이긴 했지만, 내가 작성한 코드로는 여전히 비동기의 장점을 확인할 수는 없었다. 그래서 간단한 서버 코드를 작성한 후, `sleep` 역할을 할 수 있는 간단한 함수를 이용하여 실험을 통해 비동기의 강점을 눈으로 확인하고자 했다. 요청을 처리하는 시점에 `sleep` 해버리면, 다음 요청을 처리할 수 없을 것 같다는 생각이 들었다. 그 때 작성한 함수는 아래와 같다.

```ts
// ms 이후 resolve되는 Promise를 반환
function sleep(ms: number) { 
    return new Promise((resolve) => setTimeout(resolve, ms)); 
} 


/* Request Handler 처리 */
await sleep(10000); // 그 다음 10초 sleep
// 그러면 다음 요청은 10초 후에 처리할 수 있지 않을까?
```

자바스크립트에 대해 잘 아는 사람은 이 코드가 실험을 진행하기에 부적합하다는 사실을 쉽게 알 수 있을 것이다. 위 `sleep` 구현은 요청에 대한 응답을 10초 후에 처리하여 정말 `sleep` 하는 것 처럼 보이지만, 실제로는 해당 요청에 대한 응답만 10초 후에 처리할 뿐 다른 요청을 받아 처리할 수 있는 상태이다. 이것이 Node.js가 제공하는 강력함 중 하나인 비동기이다. **이벤트 루프(Event Loop)** 라는 메커니즘을 통해 각종 비동기 작업을 처리한다. 이 때문에 실제로 코드 흐름을 관제하는 메인 스레드(Thread)는 1개이지만, 여러 작업을 동시에 처리하는 것 처럼 보인다. 안에서 도대체 무슨 일이 일어나기에 하나의 메인 스레드로도 동시성을 제공할 수 있는걸까? 이 글에서는 이벤트 루프에 대해 자세히 파고들어 내부 동작 원리를 파헤쳐보며, 다양한 오해를 타파하고자 한다.

참고로, 위 `sleep`을 실험의 의도대로 작동되게 하려면 아래와 같은 코드를 사용하면 된다.

```ts
function sleepSync(ms) { 
    const end = Date.now() + ms; 
    while (Date.now() < end) { 
        // Busy-wait 은 이벤트 루프를 막는다. 
    } 
}

/* Request Handler 처리 */
sleepSync(10000); // 그 다음 10초 sleep
// 서버는 10초 동안 아무 일도 하지 않는다.
```

이 글을 읽고난 후에는 두 `sleep` 구현에 무슨 차이가 있는지, 어떤 원리로 동작에 차이가 생기는 것인지 알 수 있을 것이다.

## Node.js의 강점과 구성요소

먼저, 자바스크립트 설계 철학에 대해 간단히 짚고 넘어가자. 기본적으로 자바스크립트는 브라우저에서 실행되기 위한 스크립트 언어이다. 웹서핑을 한다고 생각해보자. 어떤 악성 웹사이트가 처리가 엄청 오래걸리는 자바스크립트 코드를 실행시킴으로 인해 프리징이 걸리고, 그 때문에 다른 작업을 아무것도 할 수 없다면 굉장히 짜증나지 않겠는가? 때문에 자바스크립트는 렌더링이 일어나는 메인 스레드에서 블로킹(Blocking) 되지 않도록 설계되었다. 

브라우저와 자바스크립트 간 의존성을 분리하려는 프로젝트가 바로 Node.js 이다. 자바스크립트의 설계 철학에 맞게, Node.js 또한 메인 스레드가 블로킹 되지 않도록 설계되었다. 필자는 Node.js의 가장 큰 장점이 이 지점이라고 생각한다. 프론트엔드와 백엔드의 언어 통합으로 인한 생산성 증대와 풍부한 생태계 등 여러 장점이 있겠지만, 이벤트 루프를 통해 I/O 작업을 블로킹 없이 처리하고 대규모 동시 연결을 다른 서버 모델에 비해 비교적 효율적으로 처리할 수 있는 점이 Node.js의 매력인 것 같다. (멀티 프로세싱을 이용하여 동시 연결을 처리하는 포크 모델과, 멀티 쓰레딩을 이용하여 동시 연결을 처리하는 스레드 모델에 비해 자원을 적게 소모한다. 서버 모델은 이 글의 본 관심사가 아니므로 자세한 설명은 생략한다.)

최근 브라우저 점유율을 찾아보자. 대부분 구글이 개발한 크롬의 오픈소스 버전인 Chromium 기반의 브라우저이다. 램을 많이 먹는다는 평가가 많지만, 이렇게 까지 사랑받는 이유는 아마도 자바스크립트 실행 엔진인 **V8** 덕분이라고 생각한다. (V8 엔진 또한 구글에서 개발했다.) Node.js 또한 자바스크립트 실행 엔진으로 **V8**을 사용한다. JIT(Just-In-Time) 컴파일과 각각 용도가 다른 여러 컴파일러를 혼합하여 사용하는 방식으로 성능을 최적화한다. [Firing up the Ignition interpreter · V8](https://v8.dev/blog/ignition-interpreter)을 참고해보자.

![image](https://github.com/user-attachments/assets/ad7cb1e2-58c9-419c-904d-f4f359ed70e6)

`libuv`라고, Node.js의 핵심인 비동기와 이벤트 루프 구조를 구현하기 위한 라이브러리도 구성 요소 중 하나이다. [공식문서: Design overview - libuv documentation](https://docs.libuv.org/en/stable/design.html)를 참고하면 Event-driven 비동기 I/O를 크로스 플랫폼으로 지원하기 위한 라이브러리 라고 한다. 실제로 Node.js 이벤트 루프는 `libuv`에서 제공하는 이벤트 루프 구현을 기반으로, 자체적으로 추가적인 메커니즘과 추상화 계층을 제공한다. (`libuv`에서 제공하는 이벤트 루프는 thread-safe 하지 않다. 애초에 Node.js 내부에서 쓰일 것을 상정하고 설계되었고, Node.js의 메인 스레드는 어차피 1개이기 때문에 스레드 안정성을 고려할 필요가 없기 때문)

위에서 소개된 V8과 libuv 외에도, 내장 모듈들과 C++로 작성된 API를 바인딩하는 계층 등 다양한 요소가 존재하지만, 글의 핵심 요지를 벗어나기에 나머지 설명은 생략한다.

## 이벤트 루프의 흐름

공식문서에선 이벤트 루프를 아래와 같이 6개의 페이즈로 설명한다. 실제로는 추가적인 실행 단계가 있지만, 우선 이 6단계부터 상세히 알아보자.

> timers: `setTimeout()` and `setInterval()`로 스케줄된 콜백을 실행
> 
> pending callbacks: 다음 루프 반복으로 연기된 I/O 콜백을 실행
> 
> idle, prepare: 내부적으로만 사용됨
> 
> poll: 새 I/O 이벤트를 찾고, I/O와 연관된 콜백들을 실행. 기본적으로 이 단계에서 대기
> 
> check: `setImmediate()` 콜백들이 여기서 실행됨
> 
> close callbacks: `socket.on('close', ...)`과 같이 `close` 이벤트와 관련된 콜백들이 실행됨
> 
> [Node.js — The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) - Phases Overview 번역

[libuv의 실제 이벤트 루프 실행 함수](https://github.com/nodejs/node/blob/c35cbcde4b7c8821587ad96d0e69942c01ace23d/deps/uv/src/unix/core.c#L425)를 보면, 설명과 매칭되는 것을 알 수 있다.

```cpp
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int can_sleep;

  r = uv__loop_alive(loop);
  if (!r)
      uv__update_time(loop);
  /* Maintain backwards compatibility by processing timers before entering the
   * while loop for UV_RUN_DEFAULT. Otherwise timers only need to be executed
   * once, which should be done after polling in order to maintain proper
   * execution order of the conceptual event loop. */
  if (mode == UV_RUN_DEFAULT && r != 0 && loop->stop_flag == 0) {
      uv__update_time(loop);
      uv__run_timers(loop);
  } // #1. Timers
  while (r != 0 && loop->stop_flag == 0) {
      can_sleep =
              uv__queue_empty(&loop->pending_queue) &&
              uv__queue_empty(&loop->idle_handles);
      uv__run_pending(loop); // #2. Pending
      uv__run_idle(loop); // #3. Idle
      uv__run_prepare(loop); // #3. Prepare
      timeout = 0;
      if ((mode == UV_RUN_ONCE && can_sleep) || mode == UV_RUN_DEFAULT)
          timeout = uv__backend_timeout(loop);
      uv__metrics_inc_loop_count(loop);
      uv__io_poll(loop, timeout); // #4. Poll
      /* Process immediate callbacks (e.g. write_cb) a small fixed number of
       * times to avoid loop starvation.*/
      for (r = 0; r < 8 && !uv__queue_empty(&loop->pending_queue); r++)
          uv__run_pending(loop);
      /* Run one final update on the provider_idle_time in case uv__io_poll
       * returned because the timeout expired, but no events were received. This
       * call will be ignored if the provider_entry_time was either never set (if
       * the timeout == 0) or was already updated b/c an event was received.
       */
      uv__metrics_update_idle_time(loop);
      uv__run_check(loop); // #5. Check
      uv__run_closing_handles(loop); // #6. Close callbacks
      uv__update_time(loop);
      uv__run_timers(loop); // #1. Timers...
      r = uv__loop_alive(loop);
      if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
          break;
  }
```

각 페이즈는 독립적인 큐로 태스크를 관리한다. 이벤트 루프가 하나의 큐로 관리된다는 서술은 명백히 틀렸다. 이에 대한 구현은 [libuv 구현체 헤더](https://github.com/nodejs/node/blob/c35cbcde4b7c8821587ad96d0e69942c01ace23d/deps/uv/include/uv/unix.h#L220-L251)를 보면 알 수 있다. 각 페이즈에 대한 구현 코드를 보면서, 어떤 일이 일어나는지 알아보자.

### Timers

타이머 페이즈는 `setTimeout()`과 `setInterval()`로 등록된 콜백들을 실행하는 단계이다. 실제 구현은 자바스크립트 코드로 작성된 부분도 있고, C++ 코드를 바인딩해서 호출하는 부분도 있고, `libuv`의 API에 의존하는 부분도 있다. [구현체 코드의 주석](https://github.com/nodejs/node/blob/main/lib/internal/timers.js)을 보면 성능을 위해 이렇게 복잡한 구조를 가진다는 것을 알 수 있다.

```text
// 타이머 구현이 왜 이렇게 동작하는지와 그 방법.
//
// 타이머는 Node.js에 매우 중요합니다. 내부적으로, 모든 TCP I/O 연결은
// 연결 시간 초과를 처리하기 위해 타이머를 생성합니다. 또한, 많은 사용자
// 라이브러리와 애플리케이션도 타이머를 사용합니다. 따라서, 언제든지
// 상당히 많은 타임아웃이 스케줄될 수 있습니다.
// 그러므로, 타이머 구현이 성능이 좋고 효율적인 것이 매우 중요합니다.
//
// 참고: 타이머는 lib/internal/linkedlist.js의 링크드 리스트 구현에 크게
// 의존하므로, 먼저 해당 파일을 읽어보는 것을 권장합니다. 처음에는 약간
// 직관적이지 않을 수 있는데, 실제로 클래스가 아니기 때문입니다. 대신,
// 기존 객체에서 작동하는 도우미 함수들의 집합입니다.
//
// 가능한 한 성능을 높이기 위해, 아키텍처와 데이터 구조는 다음의 사용 사례를
// 가능한 한 효율적으로 처리하도록 설계되었습니다:

// - 새로운 타이머 추가. (삽입)
// - 기존 타이머 제거. (제거)
// - 타이머의 시간 초과 처리. (타임아웃)
//
// 가능한 한 이러한 연산들의 복잡도를 상수 시간에 가깝게 유지하려고 합니다.
// (스케줄된 타이머의 수에 의해 성능이 영향을 받지 않도록)
//
// 밀리초 단위의 지속 시간을 키로 하는 링크드 리스트를 포함하는 객체 맵을 유지합니다.
//
/* eslint-disable node-core/non-ascii-character */
//
// ╔════ > 객체 맵
// ║
// ╠══
// ║ lists: { '40': { }, '320': { ... } } (밀리초 단위의 지속 시간 키)
// ╚══          ┌────┘
//              │
// ╔══          │
// ║ TimersList { _idleNext: { }, _idlePrev: (자기 자신) }
// ║         ┌────────────────┘
// ║    ╔══  │                              ^
// ║    ║    { _idleNext: { },  _idlePrev: { }, _onTimeout: (콜백) }
// ║    ║      ┌───────────┘
// ║    ║      │                                  ^
// ║    ║      { _idleNext: { ... },  _idlePrev: { }, _onTimeout: (콜백) }
// ╠══  ╠══
// ║    ║
// ║    ╚════ > 실제 JavaScript 타임아웃들
// ║
// ╚════ > 링크드 리스트
//
//
// 이를 통해 JavaScript 레이어에서 사실상 상수 시간의 삽입(추가), 제거, 타임아웃 처리가 가능합니다.
// 하나의 타이머 리스트는 해당 리스트에 단순히 추가하여 정렬될 수 있는데,
// 그 안의 모든 타이머가 동일한 지속 시간을 공유하기 때문입니다.
// 따라서 나중에 추가된 타이머는 항상 나중에 타임아웃되도록 스케줄되므로,
// 단순히 추가만 하면 됩니다.
// 객체 속성 링크드 리스트에서의 제거도 lib/internal/linkedlist.js 구현에서 볼 수 있듯이
// 사실상 상수 시간입니다.
// 타임아웃은 현재 만료될 예정인 타이머만 처리하면 되며, 이는 위에서 언급한 이유로 항상
// 리스트의 시작 부분에 있습니다. 아직 타임아웃될 필요가 없는 첫 번째 타이머 이후의
// 타이머들도 항상 나중에 타임아웃될 예정입니다.
//
// 따라서 상수 시간보다 긴 연산은 두 곳에 포함됩니다:
// 우선순위 큐 — 모든 연산을 최악의 경우 O(log n) 시간에 수행하는 효율적인
// 이진 힙 구현 — 는 만료될 타임아웃 리스트의 순서를 관리하고,
// 특정 지속 시간의 타이머가 포함된 특정 리스트를 객체 맵에서 조회하거나
// (또는 새 리스트를 생성) 합니다. 그러나 이러한 연산들은 다른 타이머 아키텍처에 비해
// 사소한 것으로 나타났습니다.

```

자바스크립트 코드로 구현된 타이머는 이벤트 루프 외에도 다양한 타임아웃 이벤트 처리를 위해 사용된다. 이벤트 루프를 위한 부분에 좀 더 집중해보자. `libuv`의 [타이머 구현체](https://github.com/nodejs/node/blob/main/deps/uv/src/timer.c)를 보면, 최소 이진 힙으로 스케줄링 하는 것을 알 수 있다. 타이머 페이즈에 도달할 때마다 도달한 시각을 기록하고, 힙 루트를 보고, 타이머 페이즈에 도달한 시각 이전 작업들을 모두 꺼내어 실행한다고 보면 된다. 이러한 이유로, `setTimeout(()=>{}, 1000)`은 1초 이후 실행을 보장할 뿐, 정확히 1초 후에 실행됨을 보장할 수 없다. 

### Pending

Pending Phase는 이전에 발생한 일부 시스템 작업에 대한 콜백을 처리하는 단계이다. 특히 특정 종류의 TCP 오류와 같은 시스템 작업에 대한 콜백이 이 단계에서 실행된다. 예를 들어, TCP 소켓이 `ECONNREFUSED` 오류를 받았을 때, 일부 유닉스 시스템에서는 이 오류를 보고하기 전에 잠시 대기해야 할 수 있다. 이러한 경우 해당 오류가 Pending Phase에서 처리된다. 이 단계에서 처리되는 작업들은 Poll 단계에서 즉시 처리되지 못한, 또는 지연되어야 했던 시스템 작업들의 콜백이다. 이로 인해 Pending Phase는 시스템 수준에서 연기된 작업들을 다시 실행 대기 상태로 만들어주는 중요한 역할을 한다. libuv의 `uv__run_pending` 함수 코드를 보면, `pending_queue`에 있는 작업들을 하나씩 꺼내서 실행하는 것을 볼 수 있다. 이 단계는 파일 시스템 접근이나 네트워크 통신 중 오류가 발생한 경우에도 처리될 수 있다.

```cpp
static void uv__run_pending(uv_loop_t* loop) {
  struct uv__queue* q;
  struct uv__queue pq;
  uv__io_t* w;
  
  uv__queue_move(&loop->pending_queue, &pq);
  while (!uv__queue_empty(&pq)) {
    q = uv__queue_head(&pq);
    uv__queue_remove(q);
    uv__queue_init(q);
    w = uv__queue_data(q, uv__io_t, pending_queue);
    w->cb(loop, w, POLLOUT);
  }
}
```

### Idle, Prepare

공식 문서에선 이 페이즈에 대한 설명이 없다. 이 단계에서는 이벤트 루프 내부에서 특정 작업이 준비될 수 있도록 하는 작업들이 수행된다. 일반적으로 사용자 코드에서 직접 이 단계를 활용하거나 관련된 작업을 수행할 일은 없지만, libuv를 사용하는 다른 프로그램에서는 사용될 수 있는 내부적인 준비 단계를 말한다.

이거 찾느라 너무 힘들었다... 매크로 기능으로 동적으로 정의된다. 

```c
#define UV_LOOP_WATCHER_DEFINE(name, type)                                    \
  int uv_##name##_init(uv_loop_t* loop, uv_##name##_t* handle) {              \
    uv__handle_init(loop, (uv_handle_t*)handle, UV_##type);                   \
    handle->name##_cb = NULL;                                                 \
    return 0;                                                                 \
  }                                                                           \
                                                                              \
  int uv_##name##_start(uv_##name##_t* handle, uv_##name##_cb cb) {           \
    if (uv__is_active(handle)) return 0;                                      \
    if (cb == NULL) return UV_EINVAL;                                         \
    uv__queue_insert_head(&handle->loop->name##_handles, &handle->queue);     \
    handle->name##_cb = cb;                                                   \
    uv__handle_start(handle);                                                 \
    return 0;                                                                 \
  }                                                                           \
                                                                              \
  int uv_##name##_stop(uv_##name##_t* handle) {                               \
    if (!uv__is_active(handle)) return 0;                                     \
    uv__queue_remove(&handle->queue);                                         \
    uv__handle_stop(handle);                                                  \
    return 0;                                                                 \
  }                                                                           \
                                                                              \
  void uv__run_##name(uv_loop_t* loop) {                                      \
    uv_##name##_t* h;                                                         \
    struct uv__queue queue;                                                   \
    struct uv__queue* q;                                                      \
    uv__queue_move(&loop->name##_handles, &queue);                            \
    while (!uv__queue_empty(&queue)) {                                        \
      q = uv__queue_head(&queue);                                             \
      h = uv__queue_data(q, uv_##name##_t, queue);                            \
      uv__queue_remove(q);                                                    \
      uv__queue_insert_tail(&loop->name##_handles, q);                        \
      h->name##_cb(h);                                                        \
    }                                                                         \
  }                                                                           \
                                                                              \
  void uv__##name##_close(uv_##name##_t* handle) {                            \
    uv_##name##_stop(handle);                                                 \
  }

UV_LOOP_WATCHER_DEFINE(prepare, PREPARE)
UV_LOOP_WATCHER_DEFINE(check, CHECK)
UV_LOOP_WATCHER_DEFINE(idle, IDLE)
```

마지막 3줄을 잘 보면, *Prepare*, *Idle*, *Check* 의 구현은 위 매크로에 의존하고 있는 것을 알 수 있으며, 각 구현은 그저 각 단계의 큐를 확인하여 처리하는 작업일 뿐이다.

### Poll

Poll 단계는 이벤트 루프의 가장 중요한 페이즈 중 하나이다. 이 단계에서 이벤트 루프는 새로운 I/O 이벤트를 기다린다. 만약 대기 중인 I/O 작업이 있다면 해당 작업이 완료될 때까지 대기하고, 완료된 작업에 대한 콜백을 실행한다. 이 단계에서 이벤트 루프는 특정 타임아웃 동안 새로운 이벤트를 기다리며, 이 타임아웃 내에 이벤트가 발생하지 않으면 다음 단계로 넘어간다. 이러한 Poll 단계가 바로 Node.js가 효율적으로 많은 요청을 처리할 수 있게 하는 이유 중 하나이다. 이 단계에서 대기 시간이 적절히 조정되면 많은 양의 동시 요청을 효율적으로 처리할 수 있게 된다.

이 부분은 운영체제에 따라 세부 구현이 많이 다르다. 궁금하다면 아래 파일들을 직접 참고하자. Windows 구현은 `deps/uv/src/windows/poll.c` 에 있다.

![image](https://github.com/user-attachments/assets/4e5e352c-73b9-42cc-8c17-fdc2c94fdca1)

### Check

Check 단계에서는 `setImmediate()`로 등록된 콜백들이 실행된다. 이 콜백들은 Poll 페이즈가 끝나고 나서 바로 실행되기 때문에 매우 빠른 응답성을 필요로 하는 경우 유용하게 사용될 수 있다. `setImmediate()`와 `setTimeout()`의 차이점은 바로 이 이벤트 루프 단계에서의 처리 순서 차이이다. `setImmediate()`는 이벤트 루프의 Check 페이즈에서 처리되고, `setTimeout()`은 Timers 페이즈에서 처리된다. 

[실제 구현]( https://github.com/nodejs/node/blob/c35cbcde4b7c8821587ad96d0e69942c01ace23d/lib/internal/timers.js#L292)을 보면, `setImmediate()`는 아예 따로 관리함을 알 수 있다.

위 서술을 보고 `setTimeout(()=>{}, 0)` 과 `setImmediate(()=>{})` 의 실행 순서를 비교할 때 항상 전자가 항상 빠르다고 하는 서술이 있는데, 이는 틀린 서술이다. 아래 코드를 반복해서 실행해보면, 로그 순서가 매번 뒤바뀌는 것을 알 수 있다.

```js
setTimeout(() => {
     console.log('setTimeout');
 }, 0);
setImmediate(() => {
    console.log('setImmediate');
});
```

![image](https://github.com/user-attachments/assets/f1e3c2d3-0b1b-4683-9851-ce9cc00794df)

이는 실행되는 컨텍스트가 메인 모듈이기 때문인데, 메인 모듈이 실행되고 나서 이벤트 루프가 Timer 페이즈에 도달할 때 `setTimeout`으로 스케줄된 타이머를 찾지 못할 수도 있다. `setTimeout`이 호출되는 순간 타이머를 메모리에 올리는 과정에서 OS의 스케줄링 등 다양한 인터럽트가 걸릴 수 있기 때문이다. 

하지만 위 코드를 I/O 작업의 콜백으로 넣어주면, 실행 순서가 보장된다. I/O 작업의 콜백은 Pending 페이즈에서 처리된다. Pending 페이즈에서 `setTimeout` 과 `setImmediate` 를 실행하여 타이머를 등록한 후 계속 이벤트 루프를 진행하다 보면, 반드시 Timers 페이즈보다 Check 페이즈에 먼저 도달하게 되기 때문에 `setImmediate`의 콜백 실행이 먼저 이뤄진다고 순서를 보장할 수 있다.

### Close callbacks 

마지막으로 Close 콜백 페이즈에서는 `close`, `destroy` 이벤트와 관련된 작업들이 실행된다. 예를 들어 소켓이 닫히는 상황에서 이와 관련된 클린업 작업을 수행하는 경우가 해당된다. 소켓이나 핸들이 닫히면서 추가적인 자원 해제 작업이 필요할 때 이 단계가 실행되며, 이를 통해 자원 누수 없이 클린업을 완료할 수 있다.

```cpp
static void uv__run_closing_handles(uv_loop_t* loop) {
  uv_handle_t* p;
  uv_handle_t* q;
  p = loop->closing_handles;
  loop->closing_handles = NULL;
  
  while (p) {
    q = p->next_closing;
    uv__finish_close(p);
    p = q;
  }
}
```
## nextTickQueue 와 microTaskQueue

위 6개의 페이즈에 대해 이해했다면, 하나의 의문이 들 수 있다. 대체 `Promise`의 콜백은 어디서 처리되는 걸까?
이 부분은 Node.js 이벤트 루프의 다른 실행 컨텍스트에서 발생한다. 이러한 작업들은 바로 **microTaskQueue**와 **nextTickQueue**에서 처리된다. 이 두 가지 큐는 이벤트 루프의 일반적인 흐름과는 독립적으로 작동하여, 특정 작업을 우선적으로 처리하는 데 중요한 역할을 한다. 위에서 설명한 이벤트 루프의 각 페이즈를 지날 때마다 두 개의 큐를 보고 작업을 처리한다. [구현체 코드](https://github.com/nodejs/node/blob/c35cbcde4b7c8821587ad96d0e69942c01ace23d/lib/internal/process/task_queues.js#L72)를 살펴보자.

```js
function processTicksAndRejections() {
  let tock;
  do {
    while ((tock = queue.shift()) !== null) {
      const priorContextFrame =
        AsyncContextFrame.exchange(tock[async_context_frame]);

      const asyncId = tock[async_id_symbol];
      emitBefore(asyncId, tock[trigger_async_id_symbol], tock);

      try {
        const callback = tock.callback;
        if (tock.args === undefined) {
          callback();
        } else {
          const args = tock.args;
          switch (args.length) {
            case 1: callback(args[0]); break;
            case 2: callback(args[0], args[1]); break;
            case 3: callback(args[0], args[1], args[2]); break;
            case 4: callback(args[0], args[1], args[2], args[3]); break;
            default: callback(...args);
          }
        }
      } finally {
        if (destroyHooksExist())
          emitDestroy(asyncId);
      }

      emitAfter(asyncId);

      AsyncContextFrame.set(priorContextFrame);
    }
    runMicrotasks();
  } while (!queue.isEmpty() || processPromiseRejections());
  setHasTickScheduled(false);
  setHasRejectionToWarn(false);
}
```

`do-while` 문 내부 while-loop 부분이 **nextTickQueue** 에 들어간 작업들을 처리하는 부분이고, `runMicrotasks()`가 **nextTickQueue**에 들어간 작업들을 처리하는 함수이다.

### V8의 microTaskQueue

자바스크립트의 비동기 작업 중, **Promise**와 같은 비동기 작업은 **microtasks**로 분류된다. 이러한 microtasks는 **V8 엔진**이 관리하는 **microTaskQueue**에 저장되며, 이벤트 루프의 각 페이즈가 종료될 때마다 실행된다. 즉, 이벤트 루프의 각 단계에서 발생한 작업들이 마무리되기 전에, 해당 단계에서 발생한 microtask들이 모두 처리되는 방식이며, **V8** 엔진이 관리하는 부분이기 때문에 위 코드 스니펫에서는 함수 호출 형태로 작성되어 있다.

예를 들어, `Promise.resolve().then(() => { ... })`와 같은 코드는 이벤트 루프의 다음 단계로 넘어가기 전에 **microTaskQueue**에 쌓인 모든 작업이 완료될 때까지 실행된다. 이는 일반적인 이벤트 루프의 페이즈보다 높은 우선순위를 가지기 때문에, 비동기 작업이 매우 빠르게 실행될 수 있게 한다.

### Node.js의 nextTickQueue (`process.nextTick()`)

Node.js는 브라우저와는 별도로, **nextTick queue**라는 별도의 큐를 가지고 있다. 이 큐는 이벤트 루프가 다음 단계로 넘어가기 전에 처리해야 할 작업들을 저장하는 데 사용된다. `process.nextTick()`은 이를 통해 특정 작업을 **즉시 처리**할 수 있는 메커니즘을 제공한다.

`process.nextTick()`은 이벤트 루프의 각 페이즈가 완료되기 전에 항상 우선적으로 실행된다. 이는 일반적인 microtask보다도 우선 순위가 높아, 자바스크립트 코드에서 **가장 먼저 실행**되어야 하는 작업을 스케줄링할 때 사용된다. 이로 인해 이벤트 루프의 페이즈가 진행되기 전에, `nextTick`으로 스케줄된 모든 작업이 완료된다. 아래 코드를 살펴보자.

```js
process.nextTick(() => {
  console.log('nextTick');
});
Promise.resolve().then(() => {
  console.log('Promise');
});
console.log('main');
```

출력 순서는 *main* -> *nextTick* -> *Promise* 이다. `process.nextTick`의 콜백 함수를 `nextTickQueue`에 등록하고, Promise의 resolve 콜백을 `microTaskQueue`에 등록한다. 그런 다음 *main*이 출력되고, 처리 우선순위에 따라 `nextTickQueue`가 먼저 소비된다.  `process.nextTick()`은 이벤트 루프의 각 페이즈가 완료되기 전에 실행되므로, 항상 `Promise`보다 우선하여 된다. 따라서, 이 메커니즘을 사용할 때는 주의가 필요하다. `nextTick`을 과도하게 사용하면 이벤트 루프의 다음 페이즈로 넘어가지 못하고, 계속해서 `nextTick` 큐에 쌓인 작업들을 처리하게 되어 **무한 루프**에 빠질 수 있다.

구현체 코드는 [여기](https://github.com/nodejs/node/blob/c35cbcde4b7c8821587ad96d0e69942c01ace23d/lib/internal/process/task_queues.js#L113)에서 찾을 수 있다.

```js
function nextTick(callback) {
  validateFunction(callback, 'callback');

  if (process._exiting)
    return;

  let args;
  switch (arguments.length) {
    case 1: break;
    case 2: args = [arguments[1]]; break;
    case 3: args = [arguments[1], arguments[2]]; break;
    case 4: args = [arguments[1], arguments[2], arguments[3]]; break;
    default:
      args = new Array(arguments.length - 1);
      for (let i = 1; i < arguments.length; i++)
        args[i - 1] = arguments[i];
  }

  if (queue.isEmpty())
    setHasTickScheduled(true);
  const asyncId = newAsyncId();
  const triggerAsyncId = getDefaultTriggerAsyncId();
  const tickObject = {
    [async_id_symbol]: asyncId,
    [trigger_async_id_symbol]: triggerAsyncId,
    [async_context_frame]: AsyncContextFrame.current(),
    callback,
    args,
  };
  if (initHooksExist())
    emitInit(asyncId, 'TickObject', triggerAsyncId, tickObject);
  queue.push(tickObject);
}
```

## Summary

[Introduction](#Introduction)에서 보았던 `sleep`과 `sleepSync`가 어떤 차이가 있는지 알 수 있게 되었길 바란다. `sleep`은 철저히 이벤트 루프의 관리를 받는 함수이고, `sleepSync`는 이벤트 루프의 동작을 막아버리는, *CPU-intensive* 한 작업을 묘사하는 함수이다. 실제로 Node.js를 사용할 때에는 이러한 작업으로 인해 이벤트 루프를 막지 않도록, `worker-thread`등으로 작업 흐름 자체를 분리해주어야 강점을 살릴 수 있다.

Node.js의 가장 큰 강점 중 하나는 단일 스레드로도 높은 동시성을 제공할 수 있는 이벤트 루프이다. 이 이벤트 루프는 크게 6개의 주요 페이즈(Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close Callbacks)로 나뉘며, 각 페이즈는 비동기 작업의 다양한 유형을 처리한다. 각 페이즈에서 무슨 일이 일어나는지 구현체 코드와 함께 살펴보았다. 또한, 이벤트 루프와 별도로 `nextTickQueue`와 `microTaskQueue`가 존재하여 작업의 우선 순위를 조정한다. 이러한 구조 덕분에 Node.js는 효율적인 I/O 처리가 가능하며, 대규모의 동시 연결을 상대적으로 적은 자원으로 관리할 수 있다. 나처럼 추상화된 계층의 세부 동작이 궁금했던 사람들에게 도움이 되었길 바란다.

## References

[nodejs/node: Node.js JavaScript runtime ✨🐢🚀✨](https://github.com/nodejs/node)

[Node.js — Asynchronous flow control](https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control)

[Node.js — Overview of Blocking vs Non-Blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking#concurrency-and-throughput)

[Node.js — The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

[Firing up the Ignition interpreter · V8](https://v8.dev/blog/ignition-interpreter)

[Node.js — Don't Block the Event Loop (or the Worker Pool)](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop#should-you-read-this-guide)

[이벤트 루프와 매크로태스크, 마이크로태스크](https://ko.javascript.info/event-loop#ref-785)

[로우 레벨로 살펴보는 Node.js 이벤트 루프](https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/#%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A3%A8%ED%94%84%EB%8A%94-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%97%94%EC%A7%84-%EB%82%B4%EB%B6%80%EC%97%90-%EC%9E%88%EB%8B%A4)

[Design overview - libuv documentation](https://docs.libuv.org/en/stable/design.html)
