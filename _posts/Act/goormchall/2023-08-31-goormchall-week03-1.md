---
title: "[구름톤 챌린지] 3주차 Day11 ~ Day13 학습 일기"
excerpt: "구름톤 챌린지 3주차 후기 (1)"

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

## Day 11 : 통증(2)

> 해당 문제는 통증 문제와는 조건이 다른 문제입니다. 문제를 해결하기 위해서는 동적 프로그래밍의 개념이 필요합니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day11문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/ec7a863a-8065-4efe-87ef-3c9b1f656062)
입출력 예제는 다음과 같다.
![Day11예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/13bd9b87-5e6f-48d6-b3d6-b6d9396e99bf)

지난주에 그리디로 나왔던 문제가 다이나믹 프로그래밍 문제로 변형되어 나왔다.

```python
import sys
from collections import deque
input = sys.stdin.readline

n = int(input())
a, b = map(int, input().split())

dp = [-1] * (n + 1)
q = deque([(0, 0)])

while q:
    curr, cost = q.popleft()
    if (curr <= n and dp[curr] != -1):
        continue
    dp[curr] = cost
    if (curr + a <= n):
        q.append((curr + a, cost + 1))
    if (curr + b <= n):
        q.append((curr + b, cost + 1))

print(dp[n])
```

DP 문제이지만, 제대로된 DP가 아니라 약간 BFS 같이 푼 것 같다. 현재 방문 인덱스 및 몇번째 스텝인지 체크해가면서, 더이상 방문 불가능할 때까지 반복해주었다. 매번 구름톤 풀 때마다 팀원들이랑 풀이를 공유해보는데, 진짜 DP로 풀려면 현재 인덱스에 대해 `min(dp[idx - a], dp[idx - b])` 로 업데이트 하는 게 맞는 것 같다. b로 끝까지 나눠놓고, b를 한 번씩 더하면서 a로 나뉘는지 체크하는 방식으로 푸신 분도 있었는데, 이렇게 해도 통과가 가능하다. 진짜 팀원들한테 많이 배우는 중... 원래 문제 풀이에 정답이 하나는 아니지만, 이 문제는 생각보다 허술하게 만든 듯 하다.

## Day 12 : 발전기

> 해당 문제는 행렬에서의 효율적 탐색 문제입니다. 탐색을 하는 기본 틀은 같지만, 항상 탐색 조건을 잘 설정해야 합니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day12문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/abdd4888-d36d-4e6b-844a-ce36b662a883)
입출력 예제는 다음과 같다.
![Day12예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/eb76dad9-9398-4aa1-8036-8e5517ddcc48)

갑자기 그래프 탐색 문제가 나왔다. 분명 다음주라고 했었는데...?

```python
import sys
from collections import deque
input = sys.stdin.readline

n = int(input())
graph = []
for _ in range(n):
    graph.append(list(map(int, input().split())))
visited = [[False] * n for _ in range(n)]
moves = [(1, 0), (0, 1), (-1, 0), (0, -1)]


def bfs(r, c):
    q = deque([(r, c)])
    visited[r][c] = True
    while q:
        curr = q.popleft()
        for move in moves:
            nr, nc = curr[0] + move[0], curr[1] + move[1]
            if nr >= n or nc >= n or nr < 0 or nc < 0:
                continue
            if visited[nr][nc] == True or graph[nr][nc] == 0:
                continue
            q.append((nr, nc))
            visited[nr][nc] = True
    return 1

answer = 0
for i in range(n):
    for j in range(n):
        if graph[i][j] == 1 and visited[i][j] == False:
            answer += bfs(i, j)
print(answer)
```

덩어리 찾기 문제라고 생각해서 재귀 DFS로 구현했었는데, 나중에 해설지를 보니까 스택 메모리를 엄청 낮게 잡아서 재귀 풀이를 막아둔 듯 했다. 어이없네 ㅡㅡ
DFS로 안풀려서 BFS로 바꾸어 풀었다. 현재 인덱스에서 방문 가능한 모든 곳을 방문하고, 정답을 1씩 체크해주면 된다. 조건 체크만 잘 한다면 어렵지 않게 구현할 수 있다. 주의해야 할 점은, BFS를 구현할 때는 반드시 큐에 넣을 시점에 방문 처리를 해야 중복 방문을 하지 않는다는 점이다. DFS를 재귀 없이 스택을 이용하여 구현한다면 통과할 수 있다.

## Day 13 : 발전기(2)

> 해당 문제는 행렬에서의 효율적 탐색 문제입니다. 발전기 문제와 비슷하지만 완전 탐색의 개념도 필요합니다. 현대 모비스 알고리즘 대회 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day13문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/c0060658-9033-4504-a0ba-b3f16345b29d)
입출력 예제는 다음과 같다.
![Day13예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/35bb851d-d240-4878-bd0b-bb545b6dd6fd)

오늘도 그래프 탐색 문제가 나왔다. 어제 문제와는 달리, 조건이 많이 추가된 상태로 변형되었다.

```python
import sys
from collections import deque
input = sys.stdin.readline

n, k = map(int, input().split())
graph = []
for _ in range(n):
    graph.append(list(map(int, input().split())))

clusters = [0] * 31
visited = [[False] * n for _ in range(n)]
moves = [(1, 0), (0, 1), (0, -1), (-1, 0)]


def bfs(r, c, buildType):
    q = deque([(r, c)])
    visited[r][c] = True
    cost = 1
    while q:
        curR, curC = q.popleft()
        for dr, dc in moves:
            nr, nc = dr + curR, dc + curC
            if nr < 0 or nc < 0 or nr >= n or nc >= n:
                continue
            if visited[nr][nc] == True or graph[nr][nc] != buildType:
                continue
            visited[nr][nc] = True
            cost += 1
            q.append((nr, nc))
    return 1 if cost >= k else 0


for i in range(n):
    for j in range(n):
        if visited[i][j] == False:
            clusters[graph[i][j]] += bfs(i, j, graph[i][j])

answer = (0, 0)
for i, c in enumerate(clusters):
    if c >= answer[1]:
        answer = (i, c)
print(answer[0])
```

이것도 조건 체크를 잘 해야 한다. **단지 개수가 가장 많은** 단지를 골라야 한다! 큰 단지를 고르는게 아니다. 단지 크기를 큐에 같이 넣어서 체크하는 바람에, 시간을 많이 날렸다. 이것도 팀원분들이 찾아주셨다... 너무 멋져
BFS 풀이할 때, 비용 갱신 시점을 잘 따져봐야 할 것 같다. 어제 문제랑 방향이 되게 비슷해서 쓸 말이 별로 없다.

## 3주차 중간 후기

어찌저찌 벌써 3주차 중간까지 왔는데, 사전 공지된 대로 문제 유형이 나오지 않고 다양하게 섞여 나온다. 그렇다고 문제가 엄청 깔끔하지도 않다. 구름IDE에서는 Vscode로 에디터 설정을 변경할 수 있던데, 구름Level에도 Vscode가 붙어있었으면 좋겠다. 이번주는 뭔가 문제를 꼼꼼하게 읽지 않는 등 여러가지 이유로 문제 풀이에 시간을 많이 썼는데, 좀 더 세심하게 체크하고 구현해야겠다.
