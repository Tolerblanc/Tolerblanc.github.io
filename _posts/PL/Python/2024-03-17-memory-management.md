---
title: "[Python] 안쓰는 메모리 다 삽니다"
excerpt: "동일성과 동등성, 레퍼런스 카운팅과 gc, 인터닝에 대해"

categories:
    - Python
tags:
    - [Python, OS]

date: 2024-03-17
last_modified_at: 2024-03-29

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

~~이제 진짜 스프링 공부 해야지~~

## Introduction

코드를 짜다가 도저히 동작이 납득이 가지 않는 부분이 있어서, 호기심을 풀고자 공부했던 부분을 정리하기 위해 이 글을 작성했다. 설명하는 능력이 부족해서 글로 담아낸 부분은 그리 많지 않지만, 평소 궁금했던 부분을 많이 해결할 수 있는 좋은 계기였다. 또, 어디서 봤던 것 같은게 계속 튀어나오는 걸 보니 역시 중요한 건 언어가 아닌 Fundamental 이라는 것을 다시 한 번 깨닫게 되었다. 이 글에서는 Python이 어떻게 사용하지 않는 메모리를 수거하는지, 객체 비교에 있어서 **동일성(Identity)**과 **동등성(Equality)**에 대해 다룬다.

## Problem Statement

Python과 Django에 대한 미니 프로젝트를 진행하던 도중, 다음과 같은 클래스를 작성할 일이 생겼다.

```python 
class Intern(): 
	__slots__ = ['Name'] 
	
	def __init__(self, name="My name? I’m nobody, an intern, I have no name."):
		self.Name = name 
		
	def __str__(self): 
		return self.Name 
	
	class Coffee(): 
		def __str__(self): 
			return "This is the worst coffee you ever tasted." 
			
	def work(self): 
		raise Exception("I’m just an intern, I can’t do that...") 
	
	def make_coffee(self):
		return self.Coffee()
```

할 줄 아는 것은 커피 타는 것 밖에 없지만, 그 마저도 정말 맛이 없는, 그런 안타까운 클래스이다... ~~(나를 보는 듯 하군)~~ 간단히 클래스를 작성한 후, 정상 동작을 하는지 체크해보기 위해 테스트 코드를 작성하고 돌려보았다. 중첩된 클래스를 직접 작성해보기는 처음이라서, 해당 부분을 위주로 테스트를 해보려고 했다. 내 상식 선에서는 서로 다른 두 인스턴스가 만든 중첩 클래스의 인스턴스는 아예 다른 객체여야 했는데, 테스트 결과를 보니 그렇지 않았다.

```python
>>> import intern 
>>> a = intern.Intern() 
>>> b = intern.Intern() 
>>> a == b # 1
False 
>>> a is b # 2
False 
>>> id(a.make_coffee()) == id(b.make_coffee()) # 3
True 
>>> id(a.make_coffee()) is id(b.make_coffee()) # 4
False 
>>> a.make_coffee() == b.make_coffee() # 5
False 
>>> a.make_coffee() is b.make_coffee() # 6
False 
>>> str(id(a.make_coffee())) == str(id(b.make_coffee())) # 7
True
>>> str(id(a.make_coffee())) is str(id(b.make_coffee())) # 8
False 
```

`id()`는 CPython에서 객체의 메모리 주소를 가져오는 내장 함수이다. 10진수의 비트 단위 주소로 표기되기 때문에 `int` 클래스로 가져와진다. 1, 2의 경우 당연하게 False일 것이다. 아예 다른 인스턴스이기 때문이다. 근데 3은 왜 True일까? `a` 와 `b`가 만든 커피 인스턴스는 분명히 서로 다른 것이고, 그렇다면 두 인스턴스의 주소도 달라야 한다. 5, 6번 결과처럼 말이다. 하지만 7번에서 볼 수 있다시피, 분명히 같은 주소값을 가진다. 이게 어떻게 된 일일까??

결론부터 말하자면 다음과 같다.
1. Python이 사용자에게 제공하는 추상화 계층이 두텁다. 특히 메모리 측면에서는 아예 신경쓰지 않아도 될 정도이다.
2. Python의 메모리 관리 로직을 잘 이해하지 못했다.
3. 위 사항들을 간과하고, 이상한 테스트 코드를 작성했다.

#3 번 표현식에서 어떤일이 일어나 True라는 결과가 나왔는지, 나머지 표현식들은 왜 저런 결과가 나오는지에 대해, 그 밑에 숨은 원리들을 파헤치며 알아보자.

## `is` vs. `==`
  
우선, 두 연산자의 차이에서 오는 표현식 결과의 차이를 알아보자. 다들 알겠지만, 두 연산은 엄연히 다른 연산이다. Java 에서의 `equals()`와 `==`의 차이와 비슷하다고 볼 수 있다. Python에서 `is`연산은 두 객체가 같은 메모리를 가리키는지, 식별자를 통해 **동일성(Identity)** 에 대해 검사한다. 이는 오버로딩 될 수 없다. 반면 `==` 연산은 두 객체의 **동등성(Equality)** 에 대해 검사한다. 이는 객체의 매직 메서드인 `__eq__`를 호출하며, 오버로딩 될 수 있다. 일반적으로 두 객체가 같은 값을 가지는지 평가한다.

```python
>>> a = str(12341234)
>>> b = str(12341234)
>>> a is b
False
>>> a == b
True
```

위 코드 스니펫이 이해되는가? '12341234'를 문자열로 만들었을 때, `a`와 `b`는 같은 값을 가지지만, 동일한 메모리 공간을 참조하지는 않는다. 문제 정의 부분의 #7 과 #8 의 결과는 문자열의 동일성과 동등성에 대해 검사하기 때문에, 해당 결과가 나오는 것이 이해는 된다. 하지만 문자열에 대해 동일성과 동등성을 검사한다고 항상 이런 결과가 나올까? 다음 예시를 보자.

```python
>>> a = str('hello')
>>> b = str('hello')
>>> a == b
True
>>> a is b
True
```

엥? 갑자기 두 문자열이 같은 메모리를 참조하기 시작했다. 이에 대해서는 좀 이따 알아보도록 하고, 우선은 우리의 인턴들이 왜 똑같은 커피를 만들어냈는지 알아보자.

## Automatic Garbage Collection

놀랍게도, 다른 두 인스턴스가 똑같은 객체를 만들어 낸 것은 Python의 자동 가비지 컬렉션(Automatic Garbage Collection) 덕분이다. Python은 명시적인 수거자를 가지지 않으며, 할당한 메모리를 해제하는 방식은 대부분 참조 카운팅(Reference Counting)이다. 이에 대해 먼저 알아보고, 왜 테스트 코드의 결과가 이상하게 나왔는지 알아보자.

### Reference Counting

참조 카운팅(Reference Counting)은 Python에만 존재하는 개념은 아니지만, Python 가비지 컬렉션의 핵심 메커니즘이다. 모든 Python 객체는 연관된 참조 카운트가 있으며, 이 카운트는 객체에 대한 새로운 참조가 있을 때마다 증가하고 참조가 범위를 벗어나면 감소한다. 객체의 참조 수가 0이 되면, Python은 참조 수가 0이된 객체의 메모리를 수거한다. 간단하지 않은가? 간단하지만 즉발적이라 상당히 파워풀하다. 위의 예시를 다시 보자.

```python
>>> import intern 
>>> a = intern.Intern() 
>>> b = intern.Intern() 
>>> id(a.make_coffee()) == id(b.make_coffee()) # 3
True 
>>> id(a.make_coffee()) is id(b.make_coffee()) # 4
False 
```

문제로 삼았던 #3 을 자세히 살펴보자.
1. `a.make_coffee()`는 `Coffee` 클래스의 새 인스턴스를 생성한다.
2. 왼쪽의 `id()`는 1에서 생성한 인스턴스의 메모리 주소를 가져온다.
3. `a.make_coffee()`에 의해 생성된 `Coffee` 인스턴스는 어떤 변수에 의해 참조되지 않으므로 참조 카운트 수가 0이다. 따라서 2의 `id()`가 평가된 직후 가비지 컬렉션에 사용되어 메모리가 수거될 수 있다.
4. `b.make_coffee()` 가 호출되면 `Coffee` 클래스의 또 다른 인스턴스가 생성된다.
5. 3에서 이전 `Coffee` 인스턴스가 가비지 컬렉터에 의해 이미 수거되었을 수 있다. Python의 메모리 할당자는 4번 과정에서 3번에서 수거된 동일한 메모리 주소를 재사용할 수 있다. 

이 동작은 Python의 구현체(CPython, Pypy, Jython 등)마다, 버전마다 동작이 다를 수 있다. 적어도 내 환경(Python 3.10.13 [Clang 14.0.6]) 에서는 항상 동일하게 동작했다. 4번의 경우도 동일하게 동작하지만, `id()`로 인해 생긴 두 임시 객체는 동일성(Identity)이 다르므로 False로 평가된다. 

하지만 상당히 강력해보이는 이 레퍼런스 카운팅 방식도 문제가 있다. Python의 컨테이너는 상당히 강력해서 어떤 객체든 담을 수 있다. 심지어는 자기 자신조차 담을 수 있다! 바로 여기에서 문제가 생긴다.

```python
>>> a = [] # a가 가리키는 리스트의 참조 카운트는 1
>>> a.append(a) # 이제 2가 됐다.
>>> a
[[...]]
>>> a[0][0][0][0]
[[...]]
>>> del a # a의 참조 카운트를 1 내린다. 어?
```

예전에는 이렇게 만들어진 리스트의 참조 카운트가 0이 되지 않아서, 그대로 메모리 누수로 이어지는 버그가 있었다고 한다. 다른 언어는 아예 독자적인 방식의 가비지 컬렉터를 돌리거나, 컨테이너를 엄격하게 관리하여 이런 일이 생기지 않게 하거나, 소유권 개념을 도입하는 등의 방법을 통해 이를 해결했다. Python은 이 문제를 어떻게 해결할까?

### Cyclic Garbage Collector

위에서 Python은 명시적인 메모리 수거자를 가지지 않으며, 메모리 관리자에 의해 레퍼런스 카운팅으로 사용되지 않는 메모리를 해제한다고 설명했다. 그렇다. Python의 가비지 컬렉터는 레퍼런스 카운팅으로 해결될 수 없는 순환 참조를 감지할 수 있도록 설계되었다. 어떻게 동작하는지 알아보자.

1. **세대 수집(Generational Collection)** <br/>
파이썬의 순환 가비지 수집기는 객체를 세 개의 서로 다른 "세대"로 나누는 세대 접근 방식을 사용한다. 새로 생성된 객체는 가장 어린 세대(0세대)에 배치되며, 가비지 컬렉션 주기에서 살아남으면 다음 상위 세대(1세대, 그리고 최종적으로 2세대)로 승격된다. 오래된 세대는 가비지 컬렉션 빈도가 낮아져, 가비지 컬렉션에 소요되는 시간이 줄어든다.

    ```python
    >>> import gc
    >>> gc.get_threshold()
    (700, 10, 10)
    ```

    `gc` 모듈의 `get_threshold()`를 호출해보면, 각 세대의 임계값(threshold)를 알 수 있다. 객체 생성 700번 후 0세대 가비지 컬렉션이 수행되며, 이 때 살아있는 객체는 1세대에 배치되고 1세대 카운터를 1 증가시킨다. 1세대 카운터가 10이되면 1세대 가비지 컬렉션이 수행된다. 즉 3세대로 나뉜 가비지 컬렉션은 객체 생성 (700, 7000, 70000)번 후 이뤄지게 된다. 대부분의 객체는 금방 접근 불가능 상태가 되고, 오래된 객체(상위 세대의 객체)에서 젋은 객체(어린 세대의 객체)로의 참조는 아주 적다는 전제하에 이런 임계값을 가지게 되었다고 한다.

2. **사이클 감지(Detecting Cycles)** <br/>
수집기는 주기적으로 각 세대의 객체에서 순환 참조가 있는지 검사한다. 이는 참조 주기의 일부일 가능성이 높은 "루트" 객체에서 시작하여 일련의 객체 "순회"를 수행함으로써 이루어진다. 객체 그룹이 서로만 도달할 수 있는 경우(사이클을 형성하는 경우) 나머지 프로그램에서 접근할 수 없으므로 안전하게 수집할 수 있다는 것을 알 수 있다. 사이클 감지는 컨테이너 객체에 대해서만 수행하면 된다. 컨테이너 객체가 아닌 리터럴들은 검사할 필요가 없다. 다른 객체의 참조를 보관할 수 없어 사이클이 발생할 수 없기 때문이다.

3. **사이클 부수기(Breaking Cycles)** <br/>
순환 가비지 컬렉션 사이클에서 개체 그룹을 식별하면 이러한 개체 간의 내부 참조를 제거하여 사이클을 끊는다. 이 작업은 참조 카운트를 줄인다. 사이클에 있는 객체의 참조 수가 0으로 떨어지면 파이썬의 참조 카운팅 메커니즘이 자동으로 해당 객체를 할당 해제하여 효과적으로 사이클을 중단하고 메모리를 확보한다.

가장 좋은 방식은 순환 참조가 발생하지 않도록 코드를 작성하는 것이다. 이 경우는 `gc.disable()`을 통해 순환 가비지 컬렉션을 비활성화하여 프로그램의 성능을 아주 약간이나마 향상시킬 수 있다. 

여담으로, gc에 대한 자료를 찾다가 Naver D2 블로그에 쓰인 [Java GC](https://d2.naver.com/helloworld/1329)에 대한 좋은 글이 있어서 달아두었다. Java의 경우 GC를 실행하기 위해 GC를 실행하는 쓰레드 외 다른 쓰레드는 모두 멈추게 되어, GC 메커니즘의 최적화가 아주 중요하다. 블로그를 참조하면 어디까지 깎여있는지 잘 알아볼 수 있다. Java의 경우 GC 실행 시 다른 쓰레드를 모두 멈추는데, Python의 경우는 어떨까? 놀랍게도 그런거 없다. GIL(Global Interpreter Lock)을 통해 공유 자원(각 객체의 참조 카운트)을 보호한다. GIL까지 적으면 포스팅이 삼천포로 갈 가능성이 아주 높아, 다른 글에 분리하여 적어보겠다. 

## Interning

```python
>>> a = str('hello')
>>> b = str('hello')
>>> a == b
True
>>> a is b
True
```

마지막으로, 위 코드의 결과가 왜 이런식인지 알아보자. Python은 작은 정수나 짧은 문자열과 같이 빈번하고 불변하는 객체의 메모리 사용량을 최적화하기 위해 `Interning` 이라는 방식을 사용한다. (미니 프로젝트에서 `intern` 클래스를 작성하라고 했던 이유가...?) 위 예시와 같이, 동일한 문자열 값이 다른 변수에 할당되어 있더라도 메모리에는 해당 문자열의 복사본 하나만 저장한다.

문자열 리터럴이나 작은 정수(-5 ~ 256, 구현체마다 다름), 짧은 문자열(구현체마다 다름), 컴파일 타임에 결정되어 있는 문자열(클래스 정의의 dictionary 키 등)들은 모두 `Interning`된다. 그래서 아래 예시처럼, `str('hello')`와 같이 다른 여러 문자열과 정수에서 `Interning`이 적용된다.

```python
>>> a = 'hihi'
>>> b = 'hihi'
>>> a == b
True
>>> a is b
True
>>> a = 255
>>> b = 255
>>> a == b
True
>>> a is b
True
---------------
>>> a = 'hello world!'
>>> b = 'hello world!'
>>> a == b
True
>>> a is b
False
```

마지막 예시와 같이 길이가 좀 있는 문자열은 자동으로 `Interning`되지 않는데, 사용자가 생각하기에 자주 쓰이는 문자열인 것 같다면 명시적으로 `Interning`을 해줄 수 있다. 아래 예시를 참조하자.

```python
>>> import sys
>>> a = sys.intern('hello world!')
>>> b = sys.intern('hello world!')
>>> c = 'hello world!'
>>> a == b
True
>>> a == c
True
>>> a is b
True
>>> a is c
False
```

명시적 `Interning` 을 통해 생성된 두 문자열 `a`와 `b`는 동일성과 동등성이 모두 True로 평가된다. 하지만 `c`는 `Interning` 되지 않은 문자열이기에, `a`와의 동일성은 `False`로 평가된다. Python이 메모리를 최적화하는 방식은 `Interning` 뿐만 아니라 `pymalloc` 등의 다양한 방식도 존재하지만, 이는 프로그램의 메모리 구조까지 가져와서 설명해야 하므로, 다음 글에서 알아보자. ~~(언제가 될지는 장담할 수 없다.)~~

## Reference

<https://github.com/python/cpython/blob/3.10/Python/bltinmodule.c#L1194>

<https://github.com/python/cpython/blob/main/Include/object.h#L928>

<https://github.com/python/cpython/blob/main/Objects/longobject.c#L1263>

<https://docs.python.org/ko/3.10/library/gc.html>

<https://docs.python.org/ko/3.10/library/functions.html?highlight=id#id>

<https://docs.python.org/ko/3.10/library/functions.html#property>

<https://www.prepbytes.com/blog/python/is-operator-in-python/>

<https://weicomes.tistory.com/277>

<https://d2.naver.com/helloworld/1329>

<http://www.arctrix.com/nas/python/gc/>

<https://velog.io/@qlgks1/python-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EA%B4%80%EB%A6%AC-memory-optimization#1-byte-code%EA%B0%80-%EB%90%98%EC%96%B4-%EC%8B%A4%ED%96%89-%EB%90%98%EA%B8%B0%EA%B9%8C%EC%A7%80-%EA%B3%BC%EC%A0%95>

<https://docs.python.org/ko/3/c-api/memory.html>
