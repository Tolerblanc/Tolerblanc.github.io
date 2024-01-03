---
title: "[프로그래머스] (Lv.3) 정수 삼각형"
excerpt: "프로그래머스 정수 삼각형 DP - 파이썬(Python) 풀이"

categories:
    - Programmers
tags:
    - [Python, PS, DP]

date: 2024-01-03
last_modified_at: 2024-01-03

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# 링크

https://school.programmers.co.kr/learn/courses/30/lessons/43105

# 문제

![프그 정수 삼각형 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/299e94f3-2e2b-4f6b-808c-eed0f4eab867)

# 문제 설명 및 요점

- 삼각형을 이루는 숫자가 1만 미만이고 높이도 500 이하라서, 다른 언어로 풀어도 오버플로우 걱정은 없다.
- 이동 자체가 인접한 칸으로만 가능하다.

# 풀이

> #DP 

- 이전 과정을 계속해서 누적해 나아가야 하기 때문에, DP로 분류된다.
- 맨 꼭대기에서 출발하는 것이 일반적인 해법이지만, 맨 아래서 부터 올라가는 풀이도 가능하다.
	- 어차피 거쳐간 숫자의 최댓값을 만드는 경로는 정해져있기 때문이다.
- (바닥 + 1)층에서 시작하여, 해당 숫자에서 이동 가능한 경로상에 있는 숫자를 비교하여 더 큰 것을 더해준다.

![프그 정수 삼각형 풀이](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/219fe028-ff1c-4ed5-9941-e4b57a340ad8)

초록색 부분부터 한 층씩 올라가게 되며, 빨간색 화살표와 파란색 화살표 중 파란색 화살표의 값이 더 크기 때문에, 해당 값이 현재 숫자에 더해지게 된다.

- 한 층씩 올라가며 반복하고, 맨 꼭대기 값을 리턴하면 정답을 구할 수 있다.

# 코드

```python
def solution(triangle):
    for i in range(len(triangle) - 2, -1, -1):
        for j in range(len(triangle[i])):
            triangle[i][j] += max(triangle[i + 1][j], triangle[i + 1][j + 1])
    return triangle[0][0]
```
 