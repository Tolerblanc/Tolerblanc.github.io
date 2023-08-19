---
title:  "[구름톤 챌린지] 1주차 Day01 ~ Day03 학습 일기"
excerpt: "구름톤 챌린지 1주차 후기 (1)"

categories:
  - 9oormthon_challenge
tags:
  - 9oormthon_challenge, Algorithm

date : 2023-08-19
last_modified_at: 2023-08-20

toc: true
related: true
---

## 구름톤 챌린지란?
[구름](https://goorm.co/)에서 진행하는 알고리즘 문제풀이 챌린지이다. 예전에 웹IDE를 알아보다가 구름이란 회사를 알게 된  것 같은데, 그 때와는 달리 프로그래머스마냥 알고리즘 문제풀이, 웹 컨테이너, 강의 등등 다방면으로 사업을 확장한 상태이다.

20일(5일 * 4주)동안 진행되며, 주차별 문제 유형은 아래와 같다.
![구름톤 유형](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/a336f12c-0d14-4fcb-9ad2-beb6e8443735)

## Day 01 : 운동 중독 플레이어

>해당 문제는 주어진 수식에 따른 결과를 찾아내는 문제입니다. 소수점을 잘 처리해야 하는 기초적인 수학 문제입니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day01 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4f3bb54d-f685-4a7f-98bd-767593b83c3e)

입출력 예제는 아래와 같다.
![Day01 예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/dc501d62-2d96-4b18-b6c6-cae3c450954b)

첫번째 문제라서 그런지 몸풀기 수준의 가벼운 문제가 나왔다. 주어진 수식을 단순 구현하기만 하면 된다.

```python
import sys
input = sys.stdin.readline

w, r = map(int, input().split())
print(int(w * (1 + (r / 30))))
```

별로 설명할 게 없다... 입력을 잘 받아서 주어진 수식의 계산 순서에 맞게 계산하여 출력하면 된다. 버림의 경우 `math.trunc()`을 사용할 수도 있지만, `int()`로도 간단하게 구현할 수 있다.

## Day 02 : 프로젝트 매니징

>해당 문제는 정수를 시간 단위로 변환 및 연산하는 문제입니다. 시간을 처리하는 문제는 다양하게 활용될 수 있습니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day02 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/9f12c9c6-7362-415c-8d9e-3e0ce47f6c8c)

입출력 예제는 아래와 같다.
![Day02 예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/a07e6593-9726-47ef-b1ea-1470284ebad4)

초기 시간에 $c_i$분씩 계속 더해서 출력하면 되는 문제이다. 이것도 단순 구현으로 쉽게 풀이할 수 있다.

```python
import sys
input = sys.stdin.readline

n = int(input())
t, m = map(int, input().split())

def add_time(t, m, a):
	m += a
	while (m >= 60):
		m -= 60
		t += 1
		if (t >= 24):
			t -= 24
	return t, m

for _ in range(n):
	t, m = add_time(t, m, int(input()))
print(t, m)
```

`add_time` 이라는 함수를 만들어서, 입력을 받을 때마다 바로바로 결과를 계산하도록 구현했다. 시간 포맷에 맞게 연산만 하면 되는 문제라서 어렵지 않게 구현할 수 있다.

## Day 03 : 합 계산기

>해당 문제는 문자열과 정수가 혼용된 데이터를 적절하게 분리한 후, 부호를 기준으로 모든 결과를 합산하는 문제입니다. W사의 코딩 테스트 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day03 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/eae9dc61-c04d-452b-a03c-a47b374381a5)

입출력 예제는 아래와 같다.
![Day03 예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4f7c17ab-4224-4ee0-ba5d-ea9c77dd8987)

미니 계산기를 만드는 문제이다. 입력값을 파싱하여 계산 후, 반환하면 된다.

```python
import sys
input = sys.stdin.readline

t = int(input().rstrip())
answer = 0
for _ in range(t):
	n1, op, n2 = input().split()
	if op == '+':
		answer += int(n1) + int(n2)
	elif op == '-':
		answer += int(n1) - int(n2)
	elif op == '*':
		answer += int(n1) * int(n2)
	elif op == '/':
		answer += int(n1) // int(n2)
print(answer)
```

이것도 단순 구현으로 풀이할 수 있다. 연산자 검사 후 계산하여, 누적합을 출력하면 된다.
사실 이 문제, `eval()` 함수를 사용하면 말도 안되게 간단히 구현할 수 있다. `for`문을 아래 코드로 치환하면 된다.

```python
for _ in range(t):
	answer += int(eval(input().strip()))
print(answer)
```

## 1주차 중간 후기
1주차 초반부라서 그런지, 문제 난이도가 그렇지 높지않다. 솔브드 브론즈 정도 되는 문제들 같다. 그래도 정해진 시간에 문제가 출제되고, 같이 하는 사람들도 있다보니 동기부여가 되는 것 같다. 난이도가 살짝 오르길 기대 해봐야겠다.