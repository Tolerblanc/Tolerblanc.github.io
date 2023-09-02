---
title: "[구름톤 챌린지] 3주차 Day14 ~ Day15 학습 일기"
excerpt: "구름톤 챌린지 3주차 후기 (2)"

categories:
    - 9oormthon_challenge
tags:
    - [9oormthon_challenge, Algorithm]

date: 2023-08-31
last_modified_at: 2023-08-31

toc: true
toc_sticky: true
related: true
---

## Day 14 : 작은 노드

> 해당 문제는 그래프와 노드, 간선에 대한 개념이 필요한 문제입니다. 현재 위치한 노드에서 다른 노드로 이동하는 개념이 필요합니다. 신규 제작 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day14문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/aa6fc3f3-641b-4396-9e03-b04b26f45aab)
입출력 예제는 다음과 같다.
![Day14예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d75fe0b0-40b6-4f07-be7b-10a97e58cfe5)

지금까지의 행렬 형태의 그래프 탐색 문제와는 달리, 진짜 양방향 그래프를 탐색하는 문제가 나왔다.

```python
import sys, heapq
input = sys.stdin.readline

n, m, prev = map(int, input().split())
graph = [[] for _ in range(n + 1)]
visited = [False] * 2001
for _ in range(m):
    s, e = map(int, input().split())
    heapq.heappush(graph[s], e)
    heapq.heappush(graph[e], s)

visited[prev] = True
while True:
    if len(graph[prev]) == 0:
        print(sum(visited), prev)
        break
    curr = heapq.heappop(graph[prev])
    if visited[curr]:
        continue
    visited[curr] = True
    prev = curr
```

최대 노드 개수가 2천개이고, 간선 개수가 20만개 (양방향이니까 40만개를 저장해야 한다.) 이므로 인접행렬 방식으로 저장하면 메모리가 터진다. 방문할 수 있는 노드 중 번호가 가장 작은 노드로 이동한다는 조건 때문에 최소 힙을 이용하였다. 물론 입력을 모두 받은 다음, 노드를 돌면서 `sort()`를 사용해도 된다. 노드의 방문 여부만 잘 체크하면서 이동한다면 그리 어렵지는 않은 문제이다.

## Day 15 : 과일 구매

> 해당 문제는 그리디의 응용문제입니다. 현재 상태에서 최고의 선택을 찾아야 합니다. 국비 교육 적성고사 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day15문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/218916e7-a8cf-41a7-abea-40976c0f4346)
![Day15문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/89d3c159-4f39-4575-a589-c3bccf905d05)
입출력 예제는 다음과 같다.
![Day15예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b8bca085-0c79-4982-86e4-a5605dedcda2)

당황스럽게 갑자기 그리디 문제가 나와버렸다. 배낭 문제와 비슷하게 생겼지만, 과일을 조각낼 수 있다는 점에서 다르다.

```python
import sys
input = sys.stdin.readline

fruits = []
n, k = map(int, input().split())
for _ in range(n):
    fruit = tuple(map(int, input().split()))
    fruits.append((fruit[1] // fruit[0], fruit[0], fruit[1]))
fruits.sort(reverse=True)

answer = 0
for part, price, fullness in fruits:
    if k > price:
        k -= price
        answer += fullness
    else:
        answer += (part * k)
        break

print(answer)
```

그리디는 앞선 포스팅에서 말했듯, 현재 상황에서 가장 좋은 것만을 골라 나아가는 알고리즘이다. 포만감이 가장 높아야 하므로, **조각 당 포만감이 가장 높은 과일**을 고르는 것이 적합하다. 따라서 입력을 받을 때에 조각 당 포만감을 같이 구해서 그것을 기준으로 정렬 시켜놓고, 가지고 있는 돈에 맞추어 포만감을 구하면 된다. 과일 조각의 개수는 해당 과일의 가격에 달려있다는 것을 주의해야 한다.

## 3주차 후기

뭔가 그래프 탐색 문제가 더 많았던 것 같다. 다음주엔 도대체 뭘 내려고...? 메모리/시간 제한을 안써놓는게 좀 아쉽다. 시간 제한은 생각보다 널널한 것 같아서 그러려니 하는데, 12일차 문제에서 재귀 풀이를 막은 건 어이가 없다. 런타임 에러 로그도 안보이는데, 최소한 메모리 제한이라도 표기를 해놨으면 삽질하는 시간이 줄었을 것이다. 그래도 매번 공식 해설지를 제공해주는 것은 좋은 것 같다.
