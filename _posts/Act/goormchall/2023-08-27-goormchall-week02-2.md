---
title: "[구름톤 챌린지] 2주차 Day09 ~ Day10 학습 일기"
excerpt: "구름톤 챌린지 2주차 후기 (2)"

categories:
  - 9oormthon_challenge
tags:
  - [9oormthon_challenge, Algorithm]

date: 2023-08-27
last_modified_at: 2023-08-27

toc: true
toc_sticky: true
related: true
---

## Day 09 : 폭탄 설치하기 (2)

> 해당 문제는 폭탄 구현하기 문제에서 조건을 더 추가한 완전 탐색 문제입니다. 요구 사항을 정확히 구현해야 합니다. N사 기출문제를 반영한 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day09문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/65af19a2-7a17-4de0-9840-c4ed68bcd2d2)
![Day09문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/382a8bb0-a149-48de-8668-8f52b34c7b95)
![Day09문제3](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4e90a165-8b8d-4bac-b89b-662f0ad99275)
![Day09문제4](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/17d67a70-f1c3-4272-b22c-f29c556dcc48)

입출력 예제는 다음과 같다.
![Day09예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/973d18e2-41b3-4cd3-9508-e61f13542644)

그래프 완전탐색 문제인데 이동은 복잡하지 않지만, 카운팅 조건이 추가된 문제이다.

```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())

def check_ground(str):
    result = 1
    if (str == '@'):
        result = 2
    if (str == '#'):
        result = 0
    return result

ground = []
for _ in range(n):
    ground.append(list(map(check_ground, input().split())))

graph = [[0] * n for _ in range(n)]
moves = [(1, 0), (0, 1), (-1, 0), (0, -1)]
for _ in range(k):
    r, c = map(int, input().split())
    graph[r - 1][c - 1] += ground[r - 1][c - 1]
    for dr, dc in moves:
        nr, nc = r + dr - 1, c + dc - 1
        if nr < 0 or nc < 0 or nr >= n or nc >= n:
            continue
        graph[nr][nc] += ground[nr][nc]

answer = 0
for g in graph:
    answer = max(*g, answer)
print(answer)
```

초기 입력 그래프를 파싱하여 따로 저장해놓고, 같은 크기의 그래프를 두어 이동하면서 해당 땅의 폭탄 값을 갱신하는 방식으로 풀이했다. 풀고 나니 `moves`에 (0, 0)도 넣어서 깔끔하게 만들 걸 생각이 든다. 초기 파싱만 잘 하고, 그래프 탐색법을 알고 있다면 어렵지 않게 구현할 수 있다.

## Day 10 : GameJam

> 해당 문제는 시뮬레이션 문제로, 다양한 조건과 요구 사항을 모두 만족하도록 구현해야 합니다. 국비 교육 적성고사 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day10문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/bed1f795-9de6-4e3f-91da-c20a30ddad4a)
![Day10문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/32b9303e-0578-431f-b6ac-3e6477c65e67)
입력 조건이랑 예제가 안맞아서 의문이었는데, 현재는 \\(3 <= N <= 200\\), \\(1 <= count <= N \\) 으로 수정되었다.

입출력 예제는 다음과 같다.
![Day10예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b0713f60-c2fd-4a4f-91d8-2586cae8b212)

이동 조건이 복잡해진 그래프 완전탐색 문제이다. 설명을 잘못 이해해서 푸는데 한참 걸렸는데, 3칸을 움직인다면 한 번에 3칸을 움직이는게 아니라 한 칸씩 3번 움직여야 한다. 즉, 한 칸씩 이동하며 지나온 모든 칸 수를 세야 한다. 또한 보드 바깥을 넘어간다고 남은 이동 수를 저장시켜두지 않는다. 나가는 경우가 생기면 무조건 해당 행/열의 반대 끝으로 이동 한다.

```python
import sys
input = sys.stdin.readline

n = int(input().rstrip())
r_g, c_g = map(int, input().split())
r_p, c_p = map(int, input().split())
graph = []
for _ in range(n):
    graph.append(input().split())

moves = {
    'U' : (-1, 0),
    'D' : (1, 0),
    'L' : (0, -1),
    'R' : (0, 1),
}

def simulate(r, c):
    visited = [[False] * n for _ in range(n)]
    score = 1
    visited[r][c] = True
    while True:
        dr, dc = moves[graph[r][c][-1]]
        count = int(graph[r][c][:-1])
        for _ in range(count):
            r, c = r + dr, c + dc
            if r < 0:
                r = n - 1
            if r >= n:
                r = 0
            if c < 0:
                c = n - 1
            if c >= n:
                c = 0
            if visited[r][c]:
                return score
            visited[r][c] = True
            score += 1

goorm = simulate(r_g - 1, c_g - 1)
player = simulate(r_p - 1, c_p - 1)
if goorm > player:
    print('goorm', goorm)
else:
    print('player', player)
```

딕셔너리를 통해 그래프 파싱을 쉽게 할 수 있다. 그래프 파싱 시 인덱스에 주의해야 한다. \\( 3 <= N <= 200\\) 이기 때문에, `100N`과 같은 입력이 들어올 수 있다. 파이썬은 음수 인덱스도 사용 가능하기 때문에, `-1`을 참조하여 방향을 결정하고 `int([:-1])`을 통해 이동 횟수를 결정하여 구현하였다.

중간에 5중 `if`문이 별로 맘에 안들어서 방법을 찾아보니, 나머지 연산자 `%`를 이용하는 방법이 있었다. 파이썬에서는 음수 인덱스 처럼, 음수 나머지 연산을 사용할 수 있다.

```python
>>> -1 % 4
3
```

다소 괴랄하지만, 이런식으로 1~2줄로 처리해줄 수 있을 것 같다.

## 2주차 후기

완전 탐색 주간도 이렇게 끝이 났다. 중간에 뜬금 없는 그리디 문제도 하나 있었고, 테스트 케이스 오류도 있었지만, 이번 주 문제들은 생각보다 퀄리티가 좋았던 것 같다. (평가할 짬은 아니지만) 10일차 문제 풀 때 편협한 사고 안에 갇혀서 시간을 한참 보냈는데, 결국 같이 공부하는 팀원들에게 질문하여 한 칸씩 이동한다는 것을 깨달았다. 실제 시험장에서 이러면 진짜 화날 것 같은데, 처음으로 다시 돌아가 생각해보고, 엣지케이스를 찾아보려는 습관을 길러야겠다. 3주차는 탐색과 DP 문제인데, DP에 약한 편이라 공부가 많이 될 것이라는 기대를 가져본다.
