---
title: "[프로그래머스] (Lv.1) 가장 많이 받은 선물"
excerpt: "[2024 Kakao Winter Internship] 프로그래머스 가장 많이 받은 선물 - 파이썬(Python) 풀이"

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
<https://school.programmers.co.kr/learn/courses/30/lessons/258712>

# 문제

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/f4ab7c78-a5b5-47ac-8c8c-2b997c32e7a5)


# 문제 설명 및 요점

- 선물을 더 많이 준 사람이 다음 달에 받는다.
- 선물을 주고 받은 기록이 없거나 수가 같다면, 선물 지수를 계산한다.
	- 선물 지수 : 준 선물 - 받은 선물
	- 선물 지수가 더 높은 사람이 다음 달에 받는다.
	- 선물 지수 조차 같다면, 선물을 주고받지 않는다.
- 친구의 수는 최대 50, 선물 기록은 최대 1만개 이다. 이상한 입력은 주어지지 않는다.

# 풀이

> #구현 

- 단순 빡구현 문제. 입력이랑 문제 내용을 꼬아놔서 좀 귀찮고 화나는 문제였다. (시간복잡도 조차 신경쓰지 않아도 된다.)
- 시험볼때는 되게 빙빙 돌아서 구현했던 것 같은데, 다시 풀 때는 약간이나마 깔끔하게 정리해보았다.
- 먼저, 친구 이름으로 바로 접근할 수 있는 딕셔너리인 `indexTable`을 만들었다.
- 그 다음, 모든 선물 기록을 행렬 형태로 바꾸고, 선물 지수를 계산하였다. (주고 받은 수에 상관 없이 전부 계산)
- 그 다음, 행렬을 통해 조건을 검사하여 최대로 받을 수 있는 선물을 계산한다.

# 코드

```python
from collections import defaultdict

def get_record_table(friends, gifts, indexTable):
    table = [[0] * len(friends) for _ in range(len(friends))]
    # table[i][j] : i가 j에게 준 선물 개수
    
    for gift in gifts:
        giver, receiver = gift.split()
        table[indexTable[giver]][indexTable[receiver]] += 1
    
    return table
    
    
def calculate_gift_index(friends, recordTable, indexTable):
    index = defaultdict()
    for i, friend in enumerate(friends):
        index[friend] = i
    
    giftIndex = [0] * len(friends)
    transposedRecordTable = list(zip(*recordTable)) # 전치 행렬 만들기 (받은 선물 체크)
    for friend in friends:
        i = index[friend]
        giftIndex[i] = sum(recordTable[i]) - sum(transposedRecordTable[i])
    
    return giftIndex

def solution(friends, gifts):
    indexTable = defaultdict()
    for i, friend in enumerate(friends):
        indexTable[friend] = i

    recordTable = get_record_table(friends, gifts, indexTable)
    giftIndex = calculate_gift_index(friends, recordTable, indexTable)

    maxRecv = 0
    for i, recevier in enumerate(friends):
        localRecv = 0
        for j, giver in enumerate(friends):
            if i == j:
                continue
            if recordTable[i][j] > recordTable[j][i]:
                localRecv += 1
            elif recordTable[i][j] == recordTable[j][i]: # 기록이 없거나 같다면
                if giftIndex[i] > giftIndex[j]:
                    localRecv += 1
        maxRecv = max(maxRecv, localRecv)
    return maxRecv
```