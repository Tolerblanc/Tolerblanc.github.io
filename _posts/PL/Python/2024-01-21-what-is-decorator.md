---
title: "[Python] 데코레이터(Decorator)란 무엇일까?"
excerpt: "일급 함수와 클로저, 데코레이터에 대하여"

categories:
    - Python
tags:
    - [Python, ]

date: 2024-01-21
last_modified_at: 2024-01-21

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

파이썬에서 함수를 사용할 때 함수 위에 `@`가 붙어 있는 것을 심심치 않게 볼 수 있다. 또는, NestJS나 Angular 같이 디자인패턴이 적용된 자바스크립트 프레임워크에서 클래스를 사용할 때 클래스나 메서드, 함수 위에서도 `@`를 볼 수 있다. 쓰다보면 대충 어떻게 동작하는 지 감을 잡을 수 있지만, 나에게 **기술 부채**로 자리 잡은 것 같아서 관련 개념에 대해 한 번 정리하고자 한다. 이 글에서는 파이썬을 통해 일급 함수와 클로저의 개념 및 데코레이터에 대해 알아본다.

## 데코레이터(Decorator)란?

데코레이터(Decorator)는 '장식자' 라는 사전적인 의미를 가진다. 프로그래밍에서도  비슷한 의미로 통하며, 래퍼(Warpper)라고도 한다. 함수나 메소드의 동작을 수정하거나 확장할 수 있는 수단을 제공하며, 코드의 유연성을 크게 향상시키고, 재사용성을 높이며, 크로스커팅 관심사(Cross-cutting concerns)를 효과적으로 관리할 수 있는 강력한 도구이다.

### 파이썬 데코레이터의 기본 개념

파이썬의 데코레이터는 주로 `@` 기호를 통해 함수나 메서드 위에 적용된다.  이것은 데코레이터 함수가 또 다른 함수를 인자로 받아 그 함수에 어떤 처리를 추가하고, 새로운 함수를 반환하는 고차 함수(Higher-order Function)임을 의미한다. 다음 예시를 보자.

```python
def simple_decorator(func):
    def wrapper():
        print("함수 실행 준비!")
        func()
        print("함수 실행 완료!")
    return wrapper

@simple_decorator
def say_hello():
    print("Hello!")

say_hello()

# 함수 실행 준비!
# Hello!
# 함수 실행 완료!
# 가 차례대로 출력된다.
```

데코레이터를 통해 `say_hello` 함수를 직접적으로 수정하지 않고 기능을 추가하였다. 지금은 단순히 함수 호출 앞뒤로 다른 출력을 찍을 뿐이지만, 원리를 알면 이보다 훨씬 복잡하고 유용한 데코레이터를 작성하고 사용할 수 있다.

일단은 간단하게 이해해보자. 데코레이터의 동작을 쉽게 표현하면 **함수를 감염** 시키는 것이다. 기존 함수는 본래의 형태를 유지하지만, 데코레이터에 의해 감염되어 변경된 동작을 수행한다. 이 변경된 동작은 위 예시처럼 단순히 기존 함수를 '감싸는' 형태일 수 있고, 새로운 기능을 수행하는 등의 확장된 동작일 수 있다.

### 자바스크립트/타입스크립트 데코레이터의 기본 개념

자바스크립트에서의 데코레이터는 현재 실험적인 기능이지만, 타입스크립트에서는 일반적으로 사용된다. 클래스, 메소드, 접근자, 프로퍼티, 파라미터 등에 사용되어 구조와 동작을 정의하는 데 도움을 준다. 특히, Angular나 NestJS같이 디자인패턴이 적용되는 타입스크립트 기반 프레임워크들은 의존성 주입, 컴포넌트 정의, 라우팅 등을 구현하는데 사용한다.

예를 들어, NestJS에서는 다음과 같이 클래스를 서비스로 정의한다.

```typescript
@Injectable()
class UserService {
    // 서비스 로직
}
```

이 경우, `@Injectable()` 데코레이터는 `UserService` 클래스가 의존성 주입 시스템에 의해 관리될 수 있도록 한다.

정리하면, 파이썬과 타입스크립트 모두 데코레이터는 기존 코드의 수정 없이 코드의 유연성을 크게 증가시키고, 재사용성을 높이는 도구이다. 다만 파이썬에서는 주로 함수의 동작을 확장하는 데 사용되며, 타입스크립트에서는 클래스의 동작을 정의하고 수정하는 데 주로 사용된다.

## 일급 함수(First-class Function)와 고위 함수(Higher-order Function)

### 일급 함수(First-class Function)

일급 함수(First-class Function)는 프로그래밍 언어에서 함수를 "일급 시민(first-class citizen)"으로 취급하는 개념이다. 이는 함수를 다른 객체와 마찬가지로 사용할 수 있음을 의미한다. 구체적으로, 다음의 특징을 가진다.

1. 함수를 변수에 할당할 수 있다.
2. 함수를 다른 함수의 인자로 전달할 수 있다.
3. 함수에서 다른 함수를 반환할 수 있다.

파이썬에서 모든 함수는 일급 함수이다. 예시를 보자.

```python
>>> input
<built-in function input>
>>> input.__doc__
'Read a string from standard input. ...'
>>> import sys
>>> input = sys.stdin.readline
>>> input
<built-in method readline of _io.TextIOWrapper object at 0x102910d40>
>>> input.__doc__
# sys.stdin.readline()은 docstring이 없음
>>> map(int, input().split())
1 2 3
<map object at 0x1029c12d0>
```

`input()`은 _stdin_ 으로 부터 입력을 받는 빌트인 함수이다. `input` 변수에 `sys.stdin.readline` 함수를 할당한 후 출력해보면, 그 내용이 바뀐 것을 확인할 수 있다. 또한 `map()`의 경우, 다른 함수 (`int`)를 인자로 전달 받아 결과를 내놓는다. 

### 고위 함수(Higher-order Function)

고위 함수(Higher-order Function)는 다른 함수를 인자로 받거나 함수를 결과로 반환하는 함수를 말한다. 고위 함수는 일급 함수의 개념을 활용하여 더 복잡한 함수의 조작이 가능하게 한다. 예제를 보자.

```python
>>> numbers = ['1', '2', '3', '10']
>>> sorted(numbers)
['1', '10', '2', '3']
>>> sorted(numbers, key=int)
['1', '2', '3', '10']
```

`numbers` 는 숫자가 문자열로 표현된 리스트이다. 이를 단순히 정렬하면 사전순으로 1 -> 10 -> 2 -> 3 의 결과가 나오지만, `key` 파라미터에 `int` 함수를 전달하면 일반적인 수의 순서로 결과가 나온다. 따라서 `sorted()` 내장 함수는 고위 함수이다. 일반적으로 이러한 고위 함수를 간단히 사용하기 위해 람다 함수(Lambda Function)를 사용한다. 다음 예제는 람다 함수를 통해 문자열 리스트를 길이 순으로 정렬하는 예제이다.

```python
>>> fruits = ['apple', 'banana', 'kiwi', 'strawberry']
>>> sorted(fruits, key=lambda x: -len(x))
['strawberry', 'banana', 'apple', 'kiwi']
>>> sorted(fruits, key=len, reverse=True)
['strawberry', 'banana', 'apple', 'kiwi']
```

데코레이터의 구현에는 이러한 고위 함수 개념이 적용된다. 다른 함수를 인자로 받아, 그 함수에 추가적인 기능을 부여하거나 수정한 새로운 함수를 반환하기 때문이다. 그러나 이것 만으로는 충분하지 않다. 데코레이터의 또 다른 핵심 요소인 클로저에 대해 알아보자.

## 클로저(Closure)란?

클로저(Closure)는 함수형 프로그램의 중요 개념 중 하나이다. 함수 안에 함수를 선언할 수 있으며(각각 외부 함수, 내부 함수 라고 한다.), 외부 함수의 지역 변수를 접근할 수 있는 내부 함수를 클로저 라고 한다. 이는 외부 함수의 실행 컨텍스트가 종료된 후에도 해당 함수의 로컬 변수에 접근할 수 있게 하여, 데이터를 은닉하고 상태를 유지하는 데 유용함을 제공한다. 예시를 보자.

```python
def square(x: int | float) -> int | float:
    return x * x


def outer(x: int | float, function) -> object:
    count = 0

    def inner() -> float:
        nonlocal count, x
        count += 1
        print(f'{function.__name__}의 {count}번째 호출')
        x = function(x)
        return x
    return inner


my_square = outer(3, square)
print(my_square())
print(my_square())
print(my_square())
print(my_square())
```

위 코드의 실행 결과는 어떻게 될까? 대충 `my_square`가 호출될 때마다 3씩 곱해지니까 9, 27, 81, 243이 나온다고 생각할 수 있다. ~~이렇게 나왔다면 이 글을 적지 않았을 것이다.(ㅠㅠ)~~ 실행 결과를 보자.
```python
>>> python3 my_square.py
square의 1번째 호출
9
square의 2번째 호출
81
square의 3번째 호출
6561
square의 4번째 호출
43046721
```

오잉? 예상과는 너무나 다른 결과가 나왔다. 왜 그런지 알아보자. 
`square`라는 함수를 `outer`라는 함수에 인자로 넘기고 있고, `outer`라는 함수는 `inner`라는 함수를 반환하고 있다. `inner`함수는 자기 스코프 바깥에 있는 `function`을 끌어와 호출하고 있으며, `nonlocal` 키워드를 통해 가장 가까운 스코프에 있는 `count`와 `x` 변수를 접근하고 있다. 

첫 호출 때는 3 * 3 을 계산하여 반환한다는 것을 쉽게 알 수 있다. 문제는 그 다음 호출 부터인데, `x = function(x)`를 통해 `outer`의 `x` 변수에 호출의 결과가 저장되며 이 상태가 클로저를 통해 보존된다. 그래서 3 * 9가 아닌 9 * 9가 계산되어 반환된다. 그 다음 호출도 단순히 3이 곱해지는 것이 아닌, 이전 결과인 81을 제곱한 값이 반환된다.

클로저에 고위 함수 개념이 적용되고, 이 클로저는 다시 데코레이터에 적용된다.  데코레이터는 고위 함수로서 다른 함수를 감싸며, 이 고위 함수는 클로저를 사용하여 감싸진 함수에 대한 정보를 "보존"한다. 클로저는 데코레이터가 상태를 관리하고, 감싸진 함수의 행동을 조정하는 데 필요한 메커니즘을 제공한다.


## 다시, 데코레이터란?

앞서 일급 함수와 고위 함수, 클로저의 개념에 대해 알아보았다. 데코레이터는 이러한 개념들을 모두 활용하여, 함수나 메소드에 추가적인 기능을 동적으로 부여하는 방법으로, 코드의 재사용성과 유지보수성을 크게 향상시킨다. 

데코레이터는 기본적으로 고위 함수이며, 이를 통해 기존 함수의 동작을 변경하거나 수정한다. 예를 들어, 함수 호출의 로깅, 실행 시간 측정, 인자의 유효성 검사 등 다양한 기능을 추가할 수 있다. 이러한 기능을 추가하면서 상태를 보존해야할 상황이 생길 때 클로저 개념이 사용된다.

함수 호출 수를 제한할 수 있는 `callLimit` 데코레이터를 직접 만들어보며 흐름을 정리해보자.

```python
def callLimit(limit: int):
    count = 0

    def callLimiter(function):
        def limit_function(*args, **kwargs):
            nonlocal count, limit
            count += 1
            if count <= limit:
                return function(*args, **kwargs)
            else:
                print(f'Error: {function} call too many times')
                return None
        return limit_function

    return callLimiter
```

이 데코레이터는 `callLimiter`, `limit_function` 두 개의 중첩된 함수로 구성된다.

1. 외부 함수 `callLimit`:

    이 함수는 호출 제한 횟수 `limit`을 인자로 받는다.
    `count` 변수를 0으로 초기화하여, 함수가 몇 번 호출되었는지 추적한다.
    `callLimiter` 클로저를 반환한다.

2.  중첩된 함수 `callLimiter`:

    `callLimiter`는 실제로 감싸질 함수 `function`을 인자로 받는다.
    이 함수 내부에서 `limit_function`이 정의되며, 이를 클로저로 반환한다.

3. 중첩된 함수 `limit_function`:

    `limit_function`은 `function`의 인자`(*args, **kwargs)`를 그대로 받는다.
    `nonlocal` 키워드를 사용하여 `count`와 `limit`에 접근하며, 이를 통해 `count`는 `callLimit`의 지역 변수를 참조하고 업데이트한다.
    함수가 호출될 때마다 `count`가 1씩 증가한다.
    `count`가 `limit` 이하인 경우, 원래의 함수 `function`의 결과를 반환한다.
    `count`가 `limit`을 초과하면, 오류 메시지를 출력하고 `None`을 반환한다.

위 데코레이터를 아래와 같이 사용하면, 4번째 호출은 오류 메시지가 출력된다.

```python
@callLimit(3)
def my_function():
    print("Function called")

my_function()
my_function()
my_function()
my_function()  # 이 호출은 제한을 초과하여 오류 메시지 출력
```

### functools의 유용한 내장 데코레이터

파이썬 표준 라이브러리인 `functools` 에서 다양한 데코레이터를 지원한다. 이 문단에서는 몇 가지 알아두면 유용한 내장 데코레이터에 대해 소개한다.

#### @functools.wraps

`@functools.wraps` 데코레이터는 데코레이터를 작성할 때 내부 함수에 적용하여, 원래 함수의 이름, 문서 문자열(docstring), 그리고 다른 메타데이터를 유지한다. 이는 디버깅과 문서화에 유용하다.

```python
>>> from callLimit import f, g
>>> f
<function callLimit.<locals>.callLimiter.<locals>.limit_function at 0x104c67be0>
>>> g
<function callLimit.<locals>.callLimiter.<locals>.limit_function at 0x104c67d00>
```

데코레이터를 사용한 함수를 보면, 위와 같이 기존 형태를 유지하지 않는 모습을 볼 수 있다. 초반에 **감염됐다** 고 표현한 것이 이런 맥락이다. 하지만 `@functools.wraps` 데코레이터를 사용하면, 기존 함수의 메타데이터를 유지할 수 있다. 적용한 예시는 아래와 같다.

```python
import functools


def callLimit(limit: int):
    count = 0

    def callLimiter(function):
        @functools.wraps(function) ### warps 데코레이터 적용
        def limit_function(*args, **kwargs):
            nonlocal count, limit
            count += 1
            if count <= limit:
                return function(*args, **kwargs)
            else:
                print(f'Error: {function} call too many times')
                return None
        return limit_function

    return callLimiter


@callLimit(3)
def f():
    print("f()")


@callLimit(1)
def g():
    print("g()")

print(f)
print(g)

>>> python3 callLimit.py
<function f at 0x104f57be0>
<function g at 0x104f57be0>
```

#### @functools.total_ordering

`@functools.total_ordering` 데코레이터는 클래스에 두 개의 기본 비교 매직 메소드(__lt__, __eq__ 등)를 구현하면, 나머지 비교 매직 메소드를 자동으로 추가한다. 이를 통해 클래스 비교 관련 코드를 간소화할 수 있다.

```python
import functools

@functools.total_ordering
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __eq__(self, other):
        return self.age == other.age

    def __lt__(self, other):
        return self.age < other.age

person1 = Person("Alice", 30)
person2 = Person("Bob", 25)

print(person1 == person2)  # False
print(person1 < person2)   # False
# 아래는 @functools.total_ordering에 의해 자동으로 추가 구현됨.
print(person1 <= person2)  # False
print(person1 > person2)   # True
```

#### @functools.singledispatch

데코레이터는 함수 오버로딩을 구현하는 데 사용된다. 하나의 함수 이름으로 여러 타입의 인자를 다르게 처리할 수 있게 해준다. 이를 통해 제네릭을 구현할 수 있다.
[함수 오버로딩](https://tolerblanc.github.io/cpp/cpp98-ref-06/)과 [제네릭](https://tolerblanc.github.io/cpp/cpp98-ref-07/#%ED%85%9C%ED%94%8C%EB%A6%BF-template)에 관해서는 이전에 C++ 포스팅에 적어뒀으므로, 참고하면 좋다.

```python
from functools import singledispatch

@singledispatch
def process(data):
    print(f"Original: {data}")

@process.register(str) # 문자열의 경우 아래의 함수 적용
def _(text):
    print(f"Text: {text}")

@process.register(int) # 숫자의 경우 아래의 함수 적용
def _(number):
    print(f"Number: {number}")

process("Hello")
process(123)
process([])

>>> python3 example.py
Text: Hello
Number: 123
Original: []
```

#### @functools.lru_cache()

`@functools.lru_cache()` 데코레이터는 함수의 결과를 캐싱하여, 같은 인자로 여러 번 호출되는 함수의 성능을 향상시킨다. 한마디로, 메모이제이션(Memorization)을 구현할 수 있다. 이름 앞에 붙은 LRU는 'Least Recently Used'의 약자로, 오랫동안 사용하지 않은 항목을 버림으로써 캐시가 무한정 커지지 않게 한다.

피보나치 함수에 이 데코레이터를 적용한 예제를 보자.

```python
from functools import lru_cache


def timer(function):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = function(*args, **kwargs)
        end = time.time()
        print(
            f'[{end - start:.8f}s] {function.__name__}({args[0]}) -> {result}')
        return result
    return wrapper


@timer
@lru_cache(maxsize=32)
def cache_fibo(n):
    if n < 2:
        return n
    return cache_fibo(n - 1) + cache_fibo(n - 2)


@timer
def fibo(n):
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)


print(cache_fibo(6))
print(fibo(6))
```

위 예제를 실행시키면 아래와 같은 결과를 얻을 수 있다. 출력 크기의 압박으로 6번째 항 까지만 계산했지만, 숫자를 늘려보면 상당히 드라마틱한 결과를 얻을 수 있다.

![캐시 피보](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/9e22c8a0-5710-4c4f-b5c2-97cd9c1b60f2)


## Reference

[전문가를 위한 파이썬 (Fluent Python)](https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/)

<https://en.wikipedia.org/wiki/First-class_function>

<https://en.wikipedia.org/wiki/Closure_(computer_programming)>

<https://dojang.io/mod/page/view.php?id=2366>

<https://developer.mozilla.org/ko/docs/Glossary/First-class_Function>

<https://whitepro.tistory.com/641>

<https://docs.python.org/ko/3.10/library/functools.html?highlight=functools#module-functools>