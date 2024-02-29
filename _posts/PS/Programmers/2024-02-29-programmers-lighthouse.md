---
title: "[프로그래머스] (Lv.3) 등대"
excerpt: "프로그래머스 등대 - 파이썬(Python) 풀이"

categories:
    - Programmers
tags:
    - [Python, PS, Graph, DFS]

date: 2024-02-29
last_modified_at: 2024-02-29

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# 링크

<https://school.programmers.co.kr/learn/courses/30/lessons/133500>

# 문제

<div class="guide-section-description">
        <h6 class="guide-section-title">문제 설명</h6>
        <div class="markdown solarized-dark"><p>인천 앞바다에는 1부터 <code>n</code>까지 서로 다른 번호가 매겨진 등대 <code>n</code>개가 존재합니다. 등대와 등대 사이를 오가는 뱃길이 <code>n-1</code>개 존재하여, 어느 등대에서 출발해도 다른 모든 등대까지 이동할 수 있습니다. 등대 관리자 윤성이는 전력을 아끼기 위하여, 이 중 몇 개의 등대만 켜 두려고 합니다. 하지만 등대를 아무렇게나 꺼버리면, 뱃길을 오가는 배들이 위험할 수 있습니다. 한 뱃길의 양쪽 끝 등대 중 적어도 하나는 켜져 있도록 등대를 켜 두어야 합니다.</p>

<p>예를 들어, 아래 그림과 같이 등대 8개와 7개의 뱃길들이 있다고 합시다. 이 경우 1번 등대와 5번 등대 두 개만 켜 두어도 모든 뱃길은 양쪽 끝 등대 중 하나가 켜져 있으므로, 배들은 안전하게 운항할 수 있습니다.</p>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/f8f83817-2d81-41ec-ab2f-64b19abf7dfb/image7_1.PNG" title="" alt="image7_1.PNG"></p>

<p>등대의 개수 <code>n</code>과 각 뱃길이 연결된 등대의 번호를 담은 이차원 배열 <code>lighthouse</code>가 매개변수로 주어집니다. 윤성이가 켜 두어야 하는 등대 개수의 최솟값을 return 하도록 solution 함수를 작성해주세요.</p>

<hr>

<h5>제한사항</h5>

<ul>
<li>2 ≤ <code>n</code> ≤ 100,000</li>
<li><code>lighthouse</code>의 길이 = <code>n – 1</code>

<ul>
<li><code>lighthouse</code> 배열의 각 행 <code>[a, b]</code>는 <code>a</code>번 등대와 <code>b</code>번 등대가 뱃길로 연결되어 있다는 의미입니다.

<ul>
<li>1 ≤ <code>a</code> ≠ <code>b</code> ≤ <code>n</code></li>
<li>모든 등대는 서로 다른 등대로 이동할 수 있는 뱃길이 존재하도록 입력이 주어집니다.</li>
</ul></li>
</ul></li>
</ul>

<hr>

<h5>입출력 예</h5>
<table class="table">
        <thead><tr>
<th>n</th>
<th>lighthouse</th>
<th>result</th>
</tr>
</thead>
        <tbody><tr>
<td>8</td>
<td>[[1, 2], [1, 3], [1, 4], [1, 5], [5, 6], [5, 7], [5, 8]]</td>
<td>2</td>
</tr>
<tr>
<td>10</td>
<td>[[4, 1], [5, 1], [5, 6], [7, 6], [1, 2], [1, 3], [6, 8], [2, 9], [9, 10]]</td>
<td>3</td>
</tr>
</tbody>
      </table>
<hr>

<h5>입출력 예 설명</h5>

<p><strong>입출력 예 #1</strong></p>

<ul>
<li>본문에서 설명한 예시입니다.</li>
</ul>

<p><strong>입출력 예 #2</strong></p>

<ul>
<li>뱃길은 아래 그림과 같이 연결되어 있습니다. 윤성이가 이중 1, 6, 9번 등대 3개만 켜 두어도 모든 뱃길은 양쪽 끝 등대 중 하나가 켜져 있게 되고, 이때의 등대 개수 3개가 최소가 됩니다.</li>
</ul>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/afbcc08e-99f5-478e-a7d8-3bc4828ef04a/image7_2.PNG" title="" alt="image7_2.PNG"></p>
</div>
      </div>

# 문제 설명 및 요점

- 등대의 개수와 뱃길이 주어진다.
- 두 뱃길의 양쪽 끝 등대 중 적어도 하나는 켜져 있도록 등대를 켜 두어야 한다.
- 켜두어야 하는 등대의 개수의 최솟값을 구한다.

# 풀이

> #DFS #구현 #재귀 #그래프

- 처음 문제를 봤을 때는 어떤 유형인지 감이 잘 안왔다.
- 문제의 예시 그림을 보고 체크 가능한 점은 리프 노드의 경우 무조건 등대를 꺼놓는게 효율적이라는 것이다.
- 리프 노드가 꺼져있다면, 그것의 부모 노드인 등대는 무조건 켜져있어야 한다.
- 위 원리를 확장하면, 어떤 노드의 자식 노드들을 검사했을 때 하나라도 꺼져있는게 있다면, 자기 자신이 무조건 켜져야 한다는 것을 발견할 수 있다.
- 어떠한 입력에도 항상 존재하는 1번 노드를 루트로 두고 다음을 반복한다.
	- 현재 노드의 자식 노드가 존재하지 않는다면, 리프 노드라는 뜻이므로 끈다. (False)
	- 자식 노드 중 하나라도 꺼져있는게 있다면, 자기 자신은 무조건 켜져야 한다. (True)
- 편하게 구현하기 위해 몇가지 트릭을 사용하였다.
	- 그래프 파싱 및 저장에`defaultdict(set)`을 이용하였다.
	- `graph[child] - {parent}` 를 통해, 자식 노드와 부모 노드 간 간선을 제거할 수 있다.
	- 리스트 컴프리헨션과 `any`를 이용하여 한 줄로 자식 노드의 상태를 검사하도록 하였다.
	- [PS용 파이썬 팁 정리](https://tolerblanc.github.io/python/python-for-PS/) 참조
- 모든 노드를 탐색한 후 켜져 있는 노드의 개수를 구하면 정답

# 코드

```python
import sys
sys.setrecursionlimit(100001)

from collections import defaultdict

def solution(n, lighthouse):
    graph = defaultdict(set)
    for a, b in lighthouse:
        graph[a].add(b)
        graph[b].add(a)
    lightup = [False] * (n + 1)
    
    
    def check(root, children):
        if not children:
            return False
        if any([(not check(c, graph[c] - {root})) for c in children]):
            lightup[root] = True
            return True


    check(1, graph[1])
    
    return sum(lightup)

```
 