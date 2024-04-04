---
title: "[프로그래머스] (Lv.2) 방문 길이"
excerpt: "프로그래머스 등대 - 파이썬(Python), 자바(Java) 풀이"

categories:
    - Programmers
tags:
    - [Python, Java, PS, Graph, Simulation]

date: 2024-04-04
last_modified_at: 2024-04-04

toc: true
toc_sticky: true
related: true
---

# 링크

<https://school.programmers.co.kr/learn/courses/30/lessons/49994>

# 문제

<div class="guide-section-description">
        <h6 class="guide-section-title">문제 설명</h6>
        <div class="markdown solarized-dark"><p>게임 캐릭터를 4가지 명령어를 통해 움직이려 합니다. 명령어는 다음과 같습니다.</p>

<ul>
<li><p>U: 위쪽으로 한 칸 가기</p></li>
<li><p>D: 아래쪽으로 한 칸 가기</p></li>
<li><p>R: 오른쪽으로 한 칸 가기</p></li>
<li><p>L: 왼쪽으로 한 칸 가기</p></li>
</ul>

<p>캐릭터는 좌표평면의 (0, 0) 위치에서 시작합니다. 좌표평면의 경계는 왼쪽 위(-5, 5), 왼쪽 아래(-5, -5), 오른쪽 위(5, 5), 오른쪽 아래(5, -5)로 이루어져 있습니다.</p>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/ace0e7bc-9092-4b95-9bfb-3a55a2aa780e/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B51_qpp9l3.png" title="" alt="방문길이1_qpp9l3.png"></p>

<p>예를 들어, "ULURRDLLU"로 명령했다면</p>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/668c7458-e184-472d-9d32-f5d2acca759a/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B52_lezmdo.png" title="" alt="방문길이2_lezmdo.png"></p>

<ul>
<li>1번 명령어부터 7번 명령어까지 다음과 같이 움직입니다.</li>
</ul>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/08558e36-d667-4160-bfec-b754c78a7d85/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B53_sootjd.png" title="" alt="방문길이3_sootjd.png"></p>

<ul>
<li>8번 명령어부터 9번 명령어까지 다음과 같이 움직입니다.</li>
</ul>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/a52af28e-5835-438b-9f40-5467ebf9bf03/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B54_hlpiej.png" title="" alt="방문길이4_hlpiej.png"></p>

<p>이때, 우리는 게임 캐릭터가 지나간 길 중 <strong>캐릭터가 처음 걸어본 길의 길이</strong>를 구하려고 합니다. 예를 들어 위의 예시에서 게임 캐릭터가 움직인 길이는 9이지만, 캐릭터가 처음 걸어본 길의 길이는 7이 됩니다. (8, 9번 명령어에서 움직인 길은 2, 3번 명령어에서 이미 거쳐 간 길입니다)</p>

<p>단, 좌표평면의 경계를 넘어가는 명령어는 무시합니다.</p>

<p>예를 들어, "LULLLLLLU"로 명령했다면</p>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/f631f005-f8de-4392-a76c-a9ef64b6de08/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B55_nitjwj.png" title="" alt="방문길이5_nitjwj.png"></p>

<ul>
<li>1번 명령어부터 6번 명령어대로 움직인 후, 7, 8번 명령어는 무시합니다. 다시 9번 명령어대로 움직입니다.</li>
</ul>

<p><img src="https://grepp-programmers.s3.ap-northeast-2.amazonaws.com/files/production/35e62f0a-43c6-4142-bec6-6d28fbc57216/%E1%84%87%E1%85%A1%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AB%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%B56_nzhumd.png" title="" alt="방문길이6_nzhumd.png"></p>

<p>이때 캐릭터가 처음 걸어본 길의 길이는 7이 됩니다.</p>

<p>명령어가 매개변수 dirs로 주어질 때, 게임 캐릭터가 처음 걸어본 길의 길이를 구하여 return 하는 solution 함수를 완성해 주세요.</p>

<h5>제한사항</h5>

<ul>
<li>dirs는 string형으로 주어지며, 'U', 'D', 'R', 'L' 이외에 문자는 주어지지 않습니다.</li>
<li>dirs의 길이는 500 이하의 자연수입니다.</li>
</ul>

<h5>입출력 예</h5>
<table class="table">
        <thead><tr>
<th>dirs</th>
<th>answer</th>
</tr>
</thead>
        <tbody><tr>
<td>"ULURRDLLU"</td>
<td>7</td>
</tr>
<tr>
<td>"LULLLLLLU"</td>
<td>7</td>
</tr>
</tbody>
      </table>
<h5>입출력 예 설명</h5>

<p>입출력 예 #1<br>
문제의 예시와 같습니다.</p>

<p>입출력 예 #2<br>
문제의 예시와 같습니다.</p>
</div>
      </div>

# 문제 설명 및 요점

- 격자의 크기가 정해져 있으며(5 by 5), 이동 방향과 칸 수가 정해져있다.
- 격자의 경계를 넘어가는 이동은 무시한다.
- **처음 걸어본 길의 길이**를 구한다.

# 풀이

> #그래프 #시뮬레이션 #해시 

- 발상의 전환으로 쉽게 풀 수 있는 문제이다. 걸어본 길을 저장하기 위해 시점과 끝점을 이어서 저장하는 방법도 있지만, 제일 간단한 것은 격자를 2배 늘려서 생각하는 것이다.
	- 즉, 중점만 저장해놓으면 시점과 끝점의 순서에 상관 없이 두 점을 잇는 격자에 대해 방문 처리를 할 수 있다.
	- 단위 격자가 1 by 1 인 격자의 중점을 저장하게 되면 소수가 나올 수 밖에 없다. 따라서 격자를 2배 늘려서, 중점의 좌표를 구하더라도 항상 정수가 나올 수 있게 한다.
- 격자를 2배 늘려서 방문처리 하는 것 까지 생각했다면, 입력의 크기가 그렇게 크지 않기 때문에 값을 파싱하여 직접 이동해보면 된다.
- 방문 처리를 배열로 처리해도 되지만, `set`과 같은 자료구조를 사용하면 복잡하게 생각할 필요 없다.
- Java로 풀 때는 `set` 에 직접적으로 좌표를 넣을 수 없어서, _x_ 좌표에 100을 곱하여 넣었다. 
	- 프로그래머스 버전 상 `record`를 쓸 수도 없고, 언어 자체에 `tuple` 같은게 없다. 세상에...

# 코드

```python
def solution(dirs):
    move = {
        'L': (-1, 0),
        'R': (1, 0),
        'U': (0, 1),
        'D': (0, -1),
    }
    prev = (0, 0)
    visited = set()
    answer = 0
    for dir in dirs:
        curr = (prev[0] + move[dir][0], prev[1] + move[dir][1])
        if curr[0] < -10 or curr[1] < -10 or curr[0] > 10 or curr[1] > 10:
            continue
        if curr not in visited:
            visited.add(curr)
            answer += 1
        prev = (curr[0] + move[dir][0], curr[1] + move[dir][1])
    return answer
```

```java
import java.util.*;

class Solution {
    public int solution(String dirs) {
        int nx, ny; // next x, next y
        int cx = 0, cy = 0; // current x, current y
        int answer = 0;

        Set<Integer> visited = new HashSet<>();
        Map<Character, int[]> move = new HashMap<>();
        move.put('U', new int[]{0, 1});
        move.put('D', new int[]{0, -1});
        move.put('L', new int[]{-1, 0});
        move.put('R', new int[]{1, 0});
        
        for (char c : dirs.toCharArray()) {
            int[] dir = move.get(c);
            nx = cx + dir[0]; 
            ny = cy + dir[1];
            if (nx < -10 || ny < -10 || nx > 10 || ny > 10) 
                continue;
            if (!visited.contains(nx * 100 + ny)) {
                visited.add(nx * 100 + ny);
                answer += 1;
            }
            cx = nx + dir[0];
            cy = ny + dir[1];
        }
        return answer;
    }
}
```