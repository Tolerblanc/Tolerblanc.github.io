---
title: "[프로그래머스] (Lv.3) n + 1 카드게임"
excerpt: "[2024 Kakao Winter Internship] 프로그래머스 n + 1 카드게임 - 파이썬(Python) 풀이"

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

https://school.programmers.co.kr/learn/courses/30/lessons/258707

# 문제

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/fa2ff26c-cf5c-41e5-bf91-d8f25b1576eb)

# 문제 설명 및 요점

- 항상 6의 배수 만큼의 카드가 주어지며, 카드를 뽑는 순서는 정해져있다.
- 턴마다 2장을 뽑고 (카드 수 + 1) 을 만드는 카드 2장을 내야 하며, 그렇지 못할 경우 게임을 종료한다.
- 뽑을 카드가 없는 경우에도 게임을 종료한다.
- 뽑은 카드는 1개의 코인을 통해 손으로 가져올 수 있다.
- 도달 가능한 최대의 라운드 수를 구해야 한다.

# 풀이

> #그리디 #시뮬레이션 #구현 

- 시험장에서 탈탈 털렸던 문제 ㅠ
- 단순히 생각하면 너무 어렵다.
	- 일단 코인을 적게 쓸 수록 턴을 지속할 확률이 높을 것이다.
	- 현재 손에 있는 카드로만 제출하고 턴을 마칠 수 있고
	- 반드시 코인을 써야만 턴을 마칠 수 있는 경우가 있을 것이고
	- 현재 손에 있는 카드로 제출이 가능하지만, 코인을 주고 카드를 가져와 제출하고 턴을 마치는게 더 유리할 수 있고
	- 생각할 경우의 수가 너무 많다...
	- 이전 턴에 했던 행동이 다음 턴에 큰 영향을 끼친다.
- 관점을 바꿔서 접근해보자.
	- 매 턴 카드를 뽑은 후 손으로 안가져온다고 해도, 그 값을 진짜 버릴 필요가 있는가?
	- 카드를 3개로 분류한다. (손에 든 카드, 뽑은 카드, 뽑을 카드)
	- 매 턴, `뽑을 카드` 에서 `뽑은 카드`로 2장씩 이동한다.
	- `손에 든 카드` + `뽑은 카드` 를 같이 고려하면, **손에 있는 카드 만으로 턴을 넘길 수 있지만, 코인을 주고 카드를 가져와야 하는 경우** 를 생각하지 않아도 된다. -> 턴에 대한 의존성이 사라지게 된다.
	- 그러면 이제 코인을 적게 써서 턴을 길게 가져가야 하는 그리디 문제로 바뀐다.
		- 코인을 사용하지 않고, `손에 든 카드`로만 턴을 넘긴다.
		- 코인을 1개 사용하여, `손에 든 카드` 1장, `뽑은 카드` 1장으로 턴을 넘긴다.
		- 코인을 2개 사용하여, `뽑은 카드`로만 턴을 넘긴다.
		- 위 차례로 더이상 진행이 불가능해질 때까지 게임을 시뮬레이션 하면 된다.
	- 코인이 없다고 게임을 종료하면 안된다. 코인 없이 `손에 든 카드` 로만 턴을 넘길 수도 있다.
	- 코인을 사용하기 전 개수에 대한 예외처리를 해줘야 한다.
- 턴을 넘길 수 있는지 체크할 때, 카드 덱 2개에 속한 카드들을 전부 돌면서 더해보는 방법도 있지만, 하나의 덱을 `set`으로 만든 뒤 나머지 덱을 순회하면서 (카드 수 + 1 - 카드)가 `set`에 있는지 확인해보면 더 빠르게 체크할 수 있다.

# 코드

```python
from collections import deque

def check(deck1, deck2, target):
    operand = set(deck2)
    for card in deck1:
        if target - card in operand:
            deck1.remove(card)
            deck2.remove(target-card)
            return True
    return False

def solution(coin, cards):
    hand = cards[:len(cards) // 3]
    deck = deque(cards[len(cards) // 3:])
    pending = []
    turn = 1
    while coin >= 0 and deck:
        pending.append(deck.popleft())
        pending.append(deck.popleft())
        
        if check(hand, hand, len(cards) + 1):
            pass
        elif coin >= 1 and check(hand, pending, len(cards) + 1):
            coin -= 1
        elif coin >= 2 and check(pending, pending, len(cards) + 1):
            coin -= 2
        else:
            break
        turn += 1
    return turn
```
