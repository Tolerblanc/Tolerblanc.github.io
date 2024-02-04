---
title: "[Python] PS와 코딩테스트를 위한 소소한 팁 모음"
excerpt: "코테 칠 때도 Pythonic 하게!"

categories:
    - Python
tags:
    - [Python, PS]

date: 2024-02-04
last_modified_at: 2024-02-04

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

파이썬이 다른 언어보다 직관적이고, 기본 기능이 강력해서 코딩테스트에서 사랑받는 언어가 된 것 같다. 나도 문제 풀 때 즐겨 사용하는데, 확실히 언어에 익숙해지면 익숙해질수록 한정된 시간이 주어지는 코딩테스트에서 훨씬 유리한 고지를 점할 수 있는 것 같다. 이 글에서는 파이썬을 사용하여 코딩 테스트를 칠 때 유용하게 사용할 수 있는 팁을 몇 가지 적어보았다. 

## 빠른 입출력

```python
import sys
input = sys.stdin.readline
print = sys.stdout.write
```

BOJ 같이 입출력을 직접 관리해야 하는 사이트에서 문제를 풀이할 때면, 은근히 입출력 시간으로 인해 시간초과가 나는 경우가 꽤 있다. (물론 대부분의 경우는, 너무 높은 시간 복잡도의 코드를 설계해서 그렇다.)

특히, 그래프 문제에서 입력을 받아야 하거나 출력을 매우 많이 해야 하는 경우에는 `sys` 모듈의 `stdin.readline`과 `stdout.write` 를 파이썬 빌트인 `input`, `print` 대신 써주는게 상당히 도움이 된다.  아래 코드를 통해 `print`와 `stdout.write`의 속도를 비교해보자.

```python
import sys, time


def timer(function):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = function(*args, **kwargs)
        end = time.time()
        with open('log.txt', 'a') as f:
            f.write(f'[{end - start:.8f}s] {function.__name__}\n')
        return result
    return wrapper


@timer
def print_wrapper(string):
    print(string)


@timer
def write_wrapper(string):
    sys.stdout.write(string)


string = 'a' * 1000
print_wrapper(string)
write_wrapper(string)
```

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/3ab10ace-646f-4f63-b213-1a2d55235fdd)


사진에서 볼 수 있다시피, 1천 자 기준 심하게는 약 20배 정도 속도차이가 난다. 이 예시는 단순하게 1천 자의 문자열을 한 번씩의 함수 호출로 속도를 비교했지만, 출력이 많은 문제에서는 보통 여러 번 출력 함수를 호출하기 때문에 속도 차이가 꽤나 날 것이다.

## all(), any()를 통한 Iterable 검사

배열의 원소들이 특정 조건을 모두 만족하는지, 또는 하나라도 만족시키는 원소가 존재하는지 검사해야 하는 경우에는 직접 배열을 순회하기 보다, `all()`과 `any()` 를 사용하여 검사하면 더 깔끔하고 빠르게 코드를 짤 수 있다.

`all()` 의 경우는 인자로 받은 Iterable에 속한 모든 원소가 `True`로 평가되는지 검사한다.
`any()`의 경우는 인자로 받은 Iterable에 속한 원소 중 하나라도 `True`로 평가되는지 검사한다. 다음 예제를 보자.

```python
>>> lst = [True, 0, 1, 'a']
>>> any(lst)
True
>>> all(lst)
False
>>> lst = [True, 1, 'a']
>>> any(lst)
True
>>> all(lst)
True
```

[공식 문서](https://docs.python.org/3/library/functions.html#all)를 보더라도 `all()` 의 구현과 아래 코드 스니펫의 구현은 동등(equivalent)하다고 되어있다.
```python
def all(iterable):
    for element in iterable:
        if not element:
            return False
    return True
```

다음에 나올 **List Comprehension** 과 같이 사용하면 상당히 강력하다.

## List Comprehension

리스트 컴프리헨션은 리스트를 만드는 간결한 방법이다. 이를 이용하면 특정 형태의 리스트를 간결히 표현하거나, 조건에 따라 원소를 필터링 하거나, 어떤 연산을 적용한 새 결과 리스트를 만들 수 있다.

```python
# List comprehension
# [expression for variable in itaerable if expression]

# 1. 5 by 5 list
>>> lst1 = [[0] * 5 for _ in range(5)]
>>> lst1
[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]


# 2. filtering
>>> lst2 = [i for i in range(10) if i % 2 == 0]
>>> lst2
[0, 2, 4, 6, 8]
>>> lst2 = [i % 2 for i in range(10) if i % 2 == 0]
>>> any(lst2) # 2로 나누어서 나머지가 0인 것 중 홀수?
False

# 3. squared list
>>> lst3 = [i ** 2 for i in range(10)]
>>> lst3
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

좀 더 응용해보자. 다음과 같이 2차원 그래프의 입력을 행렬 형태로 받을 수 있다.

```python
graph = [
    list(map(int, input().split()) 
    for _ in range(n)
]
```

`for` 2개를 중첩하여 쓸 수 있다. (표현식 자리에 또 다른 리스트 컴프리헨션이 위치할 수 있다.)

```python
>>> vec = [[1,2,3], [4,5,6], [7,8,9]]
>>> [num for elem in vec for num in elem]
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

`enumerate()`를 통해, 정렬 전 인덱스를 유지할 수 있다.

```python
>>> nums = [5, 4, 7, 3, 4, 9, 2]
>>> nums = sorted([(n, idx) for idx, n in enumerate(nums)])
>>> nums # (값, 기존 인덱스)
[(2, 6), (3, 3), (4, 1), (4, 4), (5, 0), (7, 2), (9, 5)]
```

## * (Asterisk) 활용 - Iterable Unpacking

- 곱셈 및 거듭제곱 연산
```python
>>> 2 * 3
6
>>> 2 ** 3
8
```

`**` (거듭제곱) 연산은 내부적으로 최적화 되어 있지 않다. `a ** 3` 의 경우 단순히 `a * a * a` 로 치환하여 계산한다.따라서 속도 측면에서 최적화된 거듭제곱 연산을 위해서는 `pow()`를 활용해야 한다.


- 컨테이너의 단순 반복 확장
```python
>>> [0] * 5
[0, 0, 0, 0, 0]
>>> (0,) * 5
(0, 0, 0, 0, 0)
>>> [1, 2] * 3
[1, 2, 1, 2, 1, 2]
```

1차원 단순 확장만 가능하다. 다차원 확장은 리스트 컴프리헨션을 이용하자.

- 가변인자 사용 (패킹)
```python
def save_ranking(*args, **kwargs):
    print(args)
    print(kwargs)
save_ranking('faker', 'oner', 'zeus', fourth='gumayusi', fifth='keria')
# ('faker', 'oner', 'zeus')
# {'fourth': 'gumayusi', 'fifth': 'keria'}
```

`*args` 는 임의의 개수의 인자들을 튜플 형태로 넘겨준다. `**kwargs` 는 임의의 개수와 키값의 인자들을 딕셔너리 형태로 넘겨준다. `**kwargs` 는 `*args` 보다 앞에 위치할 수 없다.

- 컨테이너 언패킹 - 보통 Iterable Unpacking 이라고 부른다.
```python
>>> lst = [1, 2, 3, 4, 5]
>>> print(*lst)
1 2 3 4 5
>>> a, *b, c = lst
>>> print(a, b, c)
1, [2, 3, 4], 5
>>> def f(x, y, z):
        return x + y * z
>>> print(f(**{'z':4, 'x':1, 'y':3}))
13
```

컨테이너 타입의 데이터 (리스트, 튜플, 딕셔너리)를 언패킹한다. `*` 의 경우, 리스트와 튜플을 언패킹하여 넘겨준다. (괄호를 벗긴다고 생각하면 쉽다.) `*` 를 딕셔너리에 사용하면, 키값만 언패킹된다. `**` 는 딕셔너리에만 사용하는데, 패킹처럼 명시적으로 인자를 넘겨줄 수 있다.

- 컨테이너 언패킹 활용
```python
>>> first, *remains, end = [1,2,3,4,5]
>>> first
1
>>> remains
[2, 3, 4]
>>> end
5
>>> matrix = [
...     [1, 2, 3, 4],
...     [5, 6, 7, 8],
...     [9, 10, 11, 12],
... ]
>>> for row in matrix:
...     print(*row)
1 2 3 4
5 6 7 8
9 10 11 12
```

위와 같이 리스트에서 특정 값을 제하고 나머지 값을 다시 리스트로 취하는 연산이나, 2차원 리스트를 깔끔하게 출력하는 등 다양한 곳에 활용할 수 있다. `zip()` 내장 함수와 함께 사용하면 좀 더 극한으로 활용할 수 있다.

이따금씩 행렬을 회전시키는 문제가 있는데, 파이썬에서는 말도 안되게 간단한 코드로 해결할 수 있다.
```python
>>> matrix = [
...     [1, 2, 3, 4],
...     [5, 6, 7, 8],
...     [9, 10, 11, 12],
... ]
>>> rotated = [list(vec) for vec in zip(*matrix[::-1])]
>>> rotated
[[9, 5, 1], [10, 6, 2], [11, 7, 3], [12, 8, 4]]
```

코드를 해석해보면
1. `*matrix[::-1]`: `matrix` 리스트를 언패킹하고 순서를 뒤집는다. 
2. `zip()`: 1의 결과로 `zip`은 `[9, 10, 11, 12]`, `[5, 6, 7, 8]`,`[1, 2, 3, 4]`를 인자로 받고, 인덱스가 같은 것 끼리 묶어서 반환한다.
3. List comprehension: 2의 `zip` 객체에서 원소를 하나씩 꺼내어 튜플에서 리스트로 바꿔준다.
예시는 시계방향으로 90도 회전하는 코드이지만, 응용하면 방향 상관없이 한 줄로 2차원 리스트를 회전시킬 수 있다.

## for-else, while-else

그렇게 자주 쓰이는 건 아니지만, 알아둬서 나쁘지 않은 구문이 있다. 파이썬의 루프는 특이하게 `else` 절을 가질 수 있는데, 이는 루프를 **정상적으로** 종료하였을 때 실행된다.
`for` 루프의 경우 이터러블이 전부 소진된 상황에, `while` 루프의 경우 조건이 거짓이 되어 종료될 때 정상적으로 루프가 종료되었다고 본다. 아래 예시를 보면 바로 이해할 수 있다.

```python
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(n, 'equals', x, '*', n//x)
            break
    else:
        print(n, 'is a prime number')

2 is a prime number
3 is a prime number
4 equals 2 * 2
5 is a prime number
6 equals 2 * 3
7 is a prime number
8 equals 2 * 4
9 equals 3 * 3
```
## heapq

`heapq`는 0-index 최소 힙의 구현을 제공하는 모듈이다. 특정 수열의 최대/최소를 빠르게 가져다 써야할 때 유용하다. 최소 힙만 제공하지만, 원소를 삽입할 때 모두 음수로 만들어서 넣고 꺼낼 때 -1을 곱해주면 최대 힙처럼 사용할 수 있다. [공식문서](https://docs.python.org/ko/3.10/library/heapq.html)에 메서드와 이론에 대해 자세히 적혀있으니 한 번씩 읽어보는 것을 추천한다.  

## collections

파이썬의 기본 내장 컨테이너인 `dict`, `list`, `set`, `tuple`은 그 자체만으로 아주 훌륭하지만, `collections` 모듈은 기본 내장 컨테이너의 단점을 해결하거나 대안을 제공하는 특수 컨테이너들을 제공한다. 유용하게 사용할 수 있는 컨테이너를 몇 가지 알아보자. 

### namedtuple

자주 사용되는 것은 아니지만, 복잡한 구현 문제에서 가독성을 올려 스스로 헷갈리지 않게 하기 위해 활용할 만 하다. 이름에서 알 수 있듯, 튜플에 이름을 붙여줄 수 있으며 필드에도 이름을 붙일 수 있다. 예제를 보면 바로 이해할 수 있다.

```python
>>> from collections import namedtuple
>>> Point = namedtuple('Point', ['x', 'y'])
>>> p = Point(1, 2)
>>> p
Point(x=1, y=2)
>>> x, y = p
>>> x
1
>>> p.x + p.y
3
```

### deque

파이썬 리스트를 스택으로 활용하는 것은 아무 문제가 없으나, 큐로 활용할 때는 문제가 생길 수 있다. `pop()` 메서드를 사용하여 맨 앞에 있는 원소를 제거하면, 뒤에 있는 원소들을 모두 앞으로 당겨줘야 하기 때문에 `O(N)`의 비용이 발생한다. 

`deque` 를 사용하면 양 끝에서의 추가와 삭제를 `O(1)`에 가까운 성능으로 수행할 수 있다. 보통 `append()`를 통해 오른쪽으로 원소를 추가하고, `popleft()`를 통해 왼쪽으로 원소를 꺼내는 방식으로 많이 활용한다. 그 외 메서드는 [공식문서](https://docs.python.org/ko/3.10/library/collections.html#deque-objects) 를 참고하자.

### Counter

개수를 세어 주는 객체로, 일단 이터러블을 때려 넣으면 알아서 원소 개수를 다 세어주기 때문에 아주 편하게 사용할 수 있다.  

```python
>>> from collections import Counter
>>> c = Counter('hihihiqwerbliwqbeljkasdf')
>>> c
Counter({'i': 4, 'h': 3, 'q': 2, 'w': 2, 'e': 2, 'b': 2, 'l': 2, 'r': 1, 'j': 1, 'k': 1, 'a': 1, 's': 1, 'd': 1, 'f': 1})
>>> c.most_common(2)
[('i', 4), ('h', 3)]
>>> c.keys()
dict_keys(['h', 'i', 'q', 'w', 'e', 'r', 'b', 'l', 'j', 'k', 'a', 's', 'd', 'f'])
>>> c.values()
dict_values([3, 4, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1])
>>> c.items()
dict_items([('h', 3), ('i', 4), ('q', 2), ('w', 2), ('e', 2), ('r', 1), ('b', 2), ('l', 2), ('j', 1), ('k', 1), ('a', 1), ('s', 1), ('d', 1), ('f', 1)])
>>> c['h']
3
>>> c['z']
0
```

`most_commons(n)` 메서드를 통해 개수 기준 내림차순 `n`개의 원소와 그 개수를 리스트 형태로 가져올 수 있다. 어지간한 딕셔너리 인터페이스를 모두 활용할 수 있으나, 없는 키에 접근해도 오류가 나지 않고 0을 반환한다. 개수가 0이라고 해도 제거되지 않으니, 완전히 제거하고 싶다면 `del`을 사용하자.

### defaultdict

딕셔너리는 없는 키값에 접근할 경우 `KeyError`를 발생시킨다. 알고리즘 짜기도 바쁜데 이런거 하나씩 신경 쓸 여유가 없다. 딕셔너리를 맵핑한 `defaultdict`에 대해 알아보자.

인스턴스 변수로 `default_factory`를 받는데, 이를 활용하면 인접 리스트 형태의 그래프를 초기화 하기 아주 편하다. 없는 키에 접근할 때, 에러를 뱉지 않고 생성해준다는 차이를 제외하고는 딕셔너리와 같다. 다만 `default_factory`가 `None`이면, 기존 딕셔너리와 같이 `KeyError`를 발생시킨다.

```python
>>> from collections import defaultdict
>>> dd = defaultdict()
>>> dd['a']
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: 'a'
>>> dd = defaultdict(int)
>>> dd['a']
0
>>> dd
defaultdict(<class 'int'>, {'a': 0})
>>> graph = defaultdict(list)
>>> graph[2]
[]
>>> graph[1].append(2)
>>> graph
defaultdict(<class 'list'>, {1: [2], 2: []})
```

## functools.lru_cache

[이전 글](https://tolerblanc.github.io/python/what-is-decorator/)에서 적었다시피, 은근 유용하게 쓰이는 경우가 많다. DP 를 재귀로 구현하려고 할 때(보통 잘 없겠지만) 이 데코레이터를 갖다 붙여주면 실행 시간이 굉장히 많이 줄어든다. 자세한 내용은 [공식문서](https://docs.python.org/ko/3.10/library/functools.html#functools.lru_cache)를 참고하자. 3.3버전 이상의 파이썬에서 사용할 수 있으니, 어지간한 채점 환경에서는 써도 된다.

## bisect (이진 탐색)

[최근 카카오 코테 문제](https://tolerblanc.github.io/programmers/programmers-split-dice/) 같이, 이진 탐색을 요구하는 문제가 빈번하게 출제되고 있다. `bisect` 모듈은 이진 탐색 함수를 제공한다. 리스트에 중복된 값이 존재해도, 인터페이스가 두 가지로 나뉘기 때문에 상황에 맞춰 사용하면 된다. 위에 있는 카카오 코테 문제에서는 두 가지를 모두 적절하게 활용해야만 풀 수 있는 문제이니 꼭 한 번 접해봤으면 좋겠다. 파라매트릭 서치 같이 이진 탐색을 직접 구현해야 풀이할 수 있는 문제도 빈출 킬러 유형인 것 같으니, 너무 `bisect` 모듈에 의존하지는 말자.

```python
>>> from bisect import bisect_left, bisect_right
>>> lst = [0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4]
>>> bisect_left(lst, 0)
0
>>> bisect_right(lst, 0)
3
>>> bisect_left(lst, 1)
3
>>> bisect_right(lst, 1)
9
>>> bisect_left(lst, 2)
9
>>> bisect_right(lst, 2)
15
>>> bisect_left(lst, 3)
15
>>> bisect_right(lst, 3)
21
>>> bisect_left(lst, 4)
21
>>> bisect_right(lst, 4)
24
>>> bisect_left(lst, 5)
24
>>> bisect_right(lst, 5)
24
```

## 비트마스킹 및 비트연산 활용

파이썬에만 있는 개념은 아니지만, 헷갈려서 정리 해두려고 한다. 비트마스킹은 2진수 표현의 특징을 활용하여 정수를 `boolean` 배열로 사용하는 기법이다. 제한된 범위에 대한 `True`, `False` 체크와 갱신을 빠르고 효율적으로 할 수 있다.

- `arr |= (1 << i)` : `i` 번째 비트를 OR 연산을 통해 1로 바꿔준다.
- `arr &= ~(1 << i)` : `i` 번째 비트를 AND NOT 연산을 통해 0으로 바꿔준다.
- `arr ^= (1 << i)` : `i` 번째 비트를 XOR 연산을 통해 토글 한다.

```python
# 초기 플래그 설정: 모든 비트를 0으로 초기화
flag = 0

# 1번 비트 설정 (0번째 비트부터 시작하므로, 실제로는 두 번째 비트)
flag |= (1 << 1)

# 2번 비트 설정
flag |= (1 << 2)

# 1번 비트 검사
if flag & (1 << 1):
    print("1번 비트가 설정되어 있습니다.")

# 2번 비트 클리어
flag &= ~(1 << 2)

# 2번 비트 검사
if not (flag & (1 << 2)):
    print("2번 비트가 클리어되어 있습니다.")

```

좀 더 극한으로 활용하면, 특정 원소만 포함하는 부분집합을 굉장히 빠르게 구할 수 있다.

```python
# 집합의 원소 개수
n = 4

# 모든 부분집합을 순회하기 위한 초기 flag 값 설정: 2^n - 1
# 이는 모든 비트를 1로 설정하여, 집합의 모든 원소를 포함하는 상태를 나타냄
bitArray = (1 << n) - 1

# 2번 비트 클리어
bitArray &= ~(1 << 2)

subsets = []
origin = bitArray

# bitArray가 0이 될 때까지 반복
while bitArray > 0:
    # 현재 bitArray에 대응하는 부분집합 생성 
    subset = [i for i in range(n) if flag & (1 << i)]
    subsets.append(subset) 
    
    # bitArraydhk bitArray - 1을 AND 연산 
    flag = (flag - 1) & origin

print(subsets)
'''
[[0, 1, 3], [1, 3], [0, 3], [3], [0, 1], [1], [0]]
'''
```
