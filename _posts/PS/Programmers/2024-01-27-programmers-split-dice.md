---
title: "[프로그래머스] (Lv.3) 주사위 나누기"
excerpt: "[2024 Kakao Winter Internship] 프로그래머스 주사위 나누기 - 파이썬(Python) 풀이"

categories:
    - Programmers
tags:
    - [Python, PS, BinarySearch]

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

<https://school.programmers.co.kr/learn/courses/30/lessons/258709>

# 문제

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/411f69d0-9b73-4ff6-8293-e8ffda425106)


# 문제 설명 및 요점
- 주사위의 개수를 최대 10이다. 
- 주사위의 각 눈은 1이상 100이하의 자연수이다. (전부 같을 수도 있다.)
- 승리할 확률이 가장 높은 조합이 유일한 경우만 주어진다.

# 풀이

> #구현 #이진탐색 #완전탐색

- 시험장에서 탈탈 털렸던 문제... 당시에는 경우의 수가 \\( _{10}C_{5} * 6^5 * 6^5 \\) 인 완전탐색 방법밖에 생각이 안나서 못풀었다.
- 완전탐색이 정해는 맞다! 시간초과에서 벗어나기 위해, 이진탐색을 사용할 수 있다.
- 주사위의 조합을 모두 뽑아서, 해당 조합이 만들 수 있는 모든 주사위눈을 전부 계산한다.
- A와 B가 들고 있는 조합에 따른 주사위 눈을 계산하면, 이진 탐색을 통해 승/패를 계산할 수 있다.
	- A의 조합에 대해 B를 하나씩 꺼내어 이진탐색을 돌리면
	- `bisect_left`의 결과는 A의 패배
	- `bisect_right`의 결과는 B의 패배 + 비김 -> 전체 개수에서 빼면 A의 승리
- A가 뽑은 주사위 조합이 있으면 B의 조합은 자동으로 결정되므로, 주사위 조합의 절반만 계산하면 된다.
- 각 조합에 대해 A의 승리 수를 체크해놓고, 마지막에 최대 승리 수를 가지는 조합을 선택하면 정답이다.
	- 각 조합에 대한 전체 경우의 수는 정해져있기 때문이다. 

# 코드

```python
from itertools import combinations
from bisect import bisect_left, bisect_right


def roll_dice(dice, idx):
    dice_comb = [1]
    for i in idx:
        temp = []
        for curr_dice in dice_comb:
            for next_dice in dice[i - 1]:
                temp.append(curr_dice + next_dice)
        dice_comb = temp[:]
        dice_comb.sort()
    return dice_comb


def get_game_result(a_comb, b_comb):
    total_win = 0
    total_lose = 0
    for b in b_comb:
        total_win += len(a_comb) - bisect_right(a_comb, b)
        total_lose += bisect_left(a_comb, b)
    return total_win, total_lose


def solution(dice):
    dice_idx = [i for i in range(1, len(dice) + 1)]
    idx_comb = list(combinations(dice_idx, len(dice) // 2))
    game = dict()
    for a_pick, b_pick in zip(idx_comb[:len(idx_comb)//2], reversed(idx_comb[len(idx_comb)//2:])):
        a_comb = roll_dice(dice, a_pick)
        b_comb = roll_dice(dice, b_pick)
        a_win, a_lose = get_game_result(a_comb, b_comb)
        game[a_pick] = a_win
        game[b_pick] = a_lose

    max_wins = 0
    max_win_comb = None
    for k, v in game.items():
        if v > max_wins:
            max_win_comb = k
            max_wins = v
    
    return list(max_win_comb)
```
