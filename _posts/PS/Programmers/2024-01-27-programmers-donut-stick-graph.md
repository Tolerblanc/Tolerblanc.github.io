---
title: "[프로그래머스] (Lv.2) 도넛과 막대 그래프"
excerpt: "[2024 Kakao Winter Internship] 프로그래머스 도넛과 막대 그래프 - 파이썬(Python) 풀이"

categories:
    - Programmers
tags:
    - [Python, PS]

date: 2024-01-27
last_modified_at: 2024-01-27

toc: true
toc_sticky: true
related: true
---


<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# 링크

<https://school.programmers.co.kr/learn/courses/30/lessons/258711>

# 문제

- 문제가 너무 길어서 요약
- 도넛 모양 그래프, 막대 모양 그래프, 8자 모양 그래프들이 있다. 
- 위 그래프들은 1개 이상의 정점과, 정점들을 연결하는 **단방향** 간선으로 이루어져 있다.
- 크기가 \\( n \\)인 도넛 모양 그래프는 아래와 같다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b8dfdc57-bda8-4ead-9375-6549be96d465)

- 크기가 \\( n \\)인 막대 모양 그래프는 아래와 같다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/016b1c8d-e48a-4960-a043-69e8f3f2ace2)

- 크기가 \\( n \\)인 8자 모양 그래프는 아래와 같다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/cd03c7f8-1d42-41be-80df-02fc7ba7cd50)

- 이 그래프들과 무관한 정점을 하나 생성하여, 각 그래프의 임의의 정점 하나로 향하는 간선들을 연결하고 각 정점에 서로 다른 번호를 매겼다.
- 생성한 정점의 번호를 찾고, 그 정점이 생성되기 전 도넛 모양의 그래프 수, 막대 모양의 그래프 수, 8자 모양의 그래프 수를 구하기

# 문제 설명 및 요점

- 문제의 조건에 맞는 그래프만 주어진다.
- 간선의 개수는 최대 100만개이다.
- **단방향** 간선만 입력으로 들어온다.
- 각 모양의 그래프 수 합은 최소 2이다.

# 풀이

> #그래프 

- 특이한 그래프 탐색 문제로, 들어오는 간선과 나가는 간선의 개수를 유심히 체크하면 규칙을 찾을 수 있다. 일반적인 BFS나 DFS로도 탐색 가능하지만, 나는 간선의 개수를 통해 문제를 풀었다.
- 먼저, 생성된 정점을 찾아보자.
	- 생성된 정점은 2개 이상의 그래프를 잇는다.
	- 그 말인 즉슨, 나가는 간선이 2개 이상이며, 들어오는 간선은 존재하지 않는다.
	- 모든 간선을 체크해보면서, 위 조건을 만족하는 정점을 고르면 그것이 생성된 정점이다.
- 생성된 정점과 이어진 정점은 임의의 그래프의 한 정점이다.
- 해당 정점으로부터 탐색을 시작한다.
	- 나가는 간선이 존재하지 않는 정점이 있다면 막대 모양 그래프이다.
	- 나가는 간선이 2개 이상 존재하는 정점이 있다면 8자 모양 그래프이다.
	- 재방문하게 되는 정점이 있는데, 해당 정점이 가지는 나가는 간선이 1개라면 도넛 모양 그래프이다.


# 코드
```python
from collections import defaultdict

def find_centroid(graph, inDegree, outDegree):
    # centroid = 중심 시작점: 들어오는 엣지 없고, 나가는 엣지 2개 이상임 (유일)
    for node in graph.keys():
        if inDegree[node] == 0 and outDegree[node] >= 2:
            return node

def count_graphs(centroid, graph, inDegree, outDegree):
    count = [0, 0, 0] # 도넛 모양, 막대 모양, 8자 모양
    visited = set()
    for start in graph[centroid]: # 중심 시작점이 갈 수 있는 모든 노드에 대해 탐색
        visited.add(start)
        curr = start
        while curr:
            if outDegree[curr] == 0: # 나가는 엣지 없음: 막대 모양
                count[1] += 1
                break
            elif outDegree[curr] == 2: # 나가는 엣지 2개: 8자 모양의 중심
                count[2] += 1
                break
            curr = graph[curr][0] # 다음으로 이동
            if curr in visited and outDegree[curr] == 1: # 이미 방문한 노드면서 나가는 엣지 1개면 도넛
                count[0] += 1
                break
            visited.add(curr)
    return [centroid] + count

def solution(edges):
    graph = defaultdict(list)
    inDegree = defaultdict(int) # 들어오는 엣지 개수
    outDegree = defaultdict(int) # 나가는 엣지 개수
    for start, end in edges:
        graph[start].append(end)
        inDegree[end] += 1
        outDegree[start] += 1

    centroid = find_centroid(graph, inDegree, outDegree)
    return count_graphs(centroid, graph, inDegree, outDegree)
```
