---
title:  "[구름톤 챌린지] 2주차 Day06 ~ Day08 학습 일기"
excerpt: "구름톤 챌린지 2주차 후기 (1)"

categories:
  - 9oormthon_challenge
tags:
  - [9oormthon_challenge, Algorithm]

date : 2023-08-23
last_modified_at: 2023-08-23

toc: true
related: true
---

## Day 06 : 문자열 나누기

>해당 문제는 문자열을 분리하는 모든 경우의 수를 조합으로 탐색한 후, 조건에 따라서 점수를 측정하는 완전 탐색 문제입니다. 신규 제작 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day06문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/5f860b94-a204-43b1-b521-99e0d8b853a0)

입출력 예제는 아래와 같다.
![Day06예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/dcfec848-1c02-4b3c-82d1-f83a9a797b6a)

중복되지 않는 부분 문자열 조합 중 얻을 수 있는 최대 점수를 찾는 문제이다.

```python
import sys
from itertools import combinations

input = sys.stdin.readline
n = int(input())
s = input().strip()

def get_all_combinations(n):
    result = []
    parts = []
    for idx_1, idx_2 in combinations(range(1, n), 2):
        result.append((s[:idx_1], s[idx_1:idx_2], s[idx_2:]))
        parts.append(s[:idx_1])
        parts.append(s[idx_1:idx_2])
        parts.append(s[idx_2:])
    return result, parts

comb, p = get_all_combinations(n)
p = sorted(set(p))

answer = 0
for part1, part2, part3 in comb:
    score = p.index(part1) + p.index(part2) + p.index(part3) + 3
    answer = score if answer < score else answer

print(answer)
```

이번 주제가 완전 탐색이기도 하고, 문자열 길이가 최대 100이라서 가능한 모든 조합을 찾아서 하나씩 점수를 계산했다.
`itertools.combination`을 활용하면 조합을 추출할 수 있다. 길이 N에 대하여 1이상 N미만의 수 중 2개를 뽑아 인덱스로 사용하면, 주어진 리스트를 3개의 부분 문자열로 나눌 수 있다. 구한 조합들을 `set()`에 넣어서 중복을 제거하고, `sorted()`를 통해 정렬된 리스트로 만들었다. (`set`은 해시로 동작하기 때문에, 정렬 상태를 보장하지 않는다.) 정렬한 리스트와 구한 조합을 통해, 점수의 모든 경우의 수를 체크해보면 정답을 구할 수 있다.

## Day 07 : 구름 찾기 깃발

>해당 문제는 행렬에서 문제의 요구 사항을 만족하는 값을 찾는 완전 탐색 문제입니다. 행렬에서의 이동 개념이 필요합니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day07문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/802d11bb-3075-4477-a120-a1882df82554)
![Day07문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/f8076ae8-c16b-4578-9514-92fe07638138)
![Day07문제3](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/13f6abfe-2870-4690-8eaa-0ef9ddb7fa63)

입출력 예제는 아래와 같다.
![Day07예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/41e99436-9046-4fb4-9594-497ee23838ed)

문제가 리버스 지뢰찾기 같은데, 그래프에서의 완전탐색 문제이다.

```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
graph = []
for _ in range(n):
    graph.append(list(map(int, input().split())))

moves = [(1, 0), (0, 1), (-1, 0), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
flags = [[0] * n for _ in range(n)]

for i in range(n):
    for j in range(n):
        if graph[i][j] == 0:
            continue
        for move in moves:
            r = i + move[0]
            c = j + move[1]
            if r < 0 or c < 0 or r >= n or c >= n:
                continue
            if graph[r][c] != 1:
                flags[r][c] += 1

answer = 0
for g in flags:
    answer += g.count(k)
print(answer)
```

이 문제도 그래프의 최대 크기가 1000 * 1000이고, 이미 구름이 있는 칸은 체크하지 않아도 되므로 완전탐색 풀이가 가능하다.
현재 칸으로부터 다음 칸까지의 이동 시 좌표의 변화를 리스트 형태로 저장해두면, `for`문으로 쉽게 꺼내쓰면서 조건을 검사할 수 있어서 편리하다. 그래프를 순회하면서 현재 칸이 구름이 아닐 때, 주변의 구름 수만 체크해보면 풀 수 있다.

## Day 08 : 통증

>해당 문제는 그리디의 기초가 되는 문제입니다. 현재 상태에서 최고의 선택을 찾아야 합니다. 구름 레벨 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day08문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/35a21723-b320-457d-9524-4dca1e0411fb)

입출력 예제는 아래와 같다.
![Day08예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/e81d66cb-8c07-469c-971f-bc8db743a0cb)

어제 문제처럼 게임을 변형한 것 같다. 갑자기 그리디 문제가 나왔다???

```python
import sys
input = sys.stdin.readline

pain = int(input())
answer = 0
while (pain != 0):
    if (pain >= 14):
        pain -= 14
        answer += 1
    elif (pain >= 7):
        pain -= 14
        answer += 1
    elif (pain >= 1):
        pain -= 1
        answer += 1
print(answer)
```

현재의 상황에서 지금 당장 좋은 것을 고르는 것이 그리디이다. 현재의 선택이 나중에 미칠 영향에 대해서는 고려하지 않는다. 아이템의 **최소** 개수를 구하는 문제이므로, 현재 통증 수치를 가장 크게 줄일 수 있는 아이템을 선택해 나가면 된다.

이 문제는 아이템의 통증 감소 수치가 서로 배수 관계이기 때문에, 작은 단위의 아이템을 통해 다른 최적해가 도출될 여지가 없다. 이러한 이유 때문에 이 문제에 그리디 알고리즘 사용이 가능한 것이다. 그리디 알고리즘을 통해 문제에 접근할 때에는 항상 해법이 정당한지 검토해야 한다.

## 2주차 중간 후기

6일차 문제 같은 경우는, 언어에 따라서 / 조합 구하는 방법을 알고 있냐에 따라서 체감 난이도가 차이날 것 같다. 7일차 문제는 백준에서 많이 풀어본 듯 한 그래프 탐색 문제라서 쉽게 풀었다. 8일차 문제는 아무리 봐도 잘못 낸가 아닌가? 하는 생각이 든다.

난이도가 뒤죽박죽이 된 것 같다. 애초에 완전탐색 주간이라고 써놓고 갑자기 그리디가 튀어나오질 않나... 심지어 그리디 문제는 테스트 케이스가 하나 밖에 없었다. 갑자기 문제 출제에 있어 성의가 없어진 것 같다.
