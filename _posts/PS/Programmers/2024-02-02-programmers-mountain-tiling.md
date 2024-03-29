---
title: "[프로그래머스] (Lv.3) 산 모양 타일링"
excerpt: "[2024 Kakao Winter Internship] 프로그래머스 산 모양 타일링 - 파이썬(Python) 풀이"

categories:
    - Programmers
tags:
    - [Python, PS, DP]

date: 2024-02-02
last_modified_at: 2024-02-02

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# 링크

<https://school.programmers.co.kr/learn/courses/30/lessons/258705>

# 문제

한 변의 길이가 1인 정삼각형 `2n+1`개를 이어붙여 윗변의 길이가 `n`, 아랫변의 길이가 `n+1`인 사다리꼴을 만들 수 있습니다. 이때 사다리꼴의 윗변과 변을 공유하는 `n`개의 정삼각형 중 일부의 위쪽에 같은 크기의 정삼각형을 붙여 새로운 모양을 만들었습니다. 예를 들어 `n`이 4이고, 1번째, 2번째, 4번째 정삼각형 위에 정삼각형을 붙인 모양은 다음과 같습니다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/2bf7275d-cde4-4d9d-8411-324b27597f34)

이렇게 만든 모양을 **정삼각형 타일** 또는 정삼각형 2개를 이어 붙인 **마름모 타일**로 빈 곳이 없도록 채우려고 합니다. 정삼각형 타일과 마름모 타일은 돌려서 사용할 수 있습니다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/19c08fab-1c7f-4c55-a489-154162412df6)

타일을 놓을 때 다른 타일과 겹치거나 모양을 벗어나게 놓을 수는 없습니다. 위의 예시 모양을 채우는 방법 중 일부는 다음과 같습니다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d1edde2c-1f91-4084-ab6f-4f00b944981f)

사다리꼴의 윗변의 길이를 나타내는 정수 `n`과 사다리꼴 윗변에 붙인 정삼각형을 나타내는 1차원 정수 배열 `tops`가 매개변수로 주어집니다. 이때 문제 설명에 따라 만든 모양을 정삼각형 또는 마름모 타일로 빈 곳이 없도록 채우는 경우의 수를 `10007`로 나눈 나머지를 return 하도록 solution 함수를 완성해 주세요.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1b4a89e9-2aa3-4890-88e7-63882c7146fc)

# 문제 설명 및 요점

- 상단에 정삼각형이 붙으면 1, 안붙으면 0인 리스트가 주어진다.
- 정삼각형과 정삼각형 2개를 이어붙여 만들 수 있는 마름모 (회전 가능)로 주어진 모양을 채운다.
- 리스트의 길이는 최대 10만으로, 결과를 10007로 나누어 리턴한다.

# 풀이

> #DP

- 카카오 인턴 코테 마지막 문제. 시간 갈아넣고도 아예 못푼 문제 ㅠㅠ
- 타일링 DP 문제인데, 특이하게도 타일이 삼각형이다. 타일에 번호를 다음과 같이 붙이고 시작한다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/6ca2f195-54b0-4fd6-b68e-44047b8d74d4)

## 처음 생각했던 방법

- 3번 타일을 사용하는 경우와 그렇지 않은 경우로 나누어 생각했었다.
- `tops`가 0인 경우는 당연히 사용하지 않을테고, `tops`가 1인 경우일 때만 나누면 되니까 간단히 계산할 수 있을거라고 생각했다.
- 위처럼 케이스를 나누더라도, 결국 계산해야 하는 것은 사다리꼴을 채우는 경우의 수 이다. 나머지 1,2,4번 타일을 채우는 경우의 수와, 달라지는 `tops`에 대응하여 케이스를 전부 쪼개서 생각해야 한다.
- `dp[i] = 밑면이 i인 사다리꼴을 채우는 경우의 수` 로 두면, `tops` 값에 따라 1층 삼각형들 (사다리꼴 모양) 에 대해 케이스 분해를 했을 때 이미 기존에 계산한 값들만 나올거라는 가정을 했다.
- `tops = [0,1]` 에 대해 그림으로 그려보면 다음과 같다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/aa99cfb8-641c-4670-9890-725dd43b64d5)

- 왼쪽의 경우 `dp[3] * dp[1]` 로 계산할 수 있고, 오른쪽의 경우 `dp[5]`로 계산할 수 있다.
- 이 이상의 사고 확장이 안되는 점과 `dp` 배열을 사전에 다 계산해두는 것이 생각이 안나서 못풀었다.

## O(N) 풀이

- `tops`가 0일때와 1일때의 경우의 수는 다음과 같다.

![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/a2072ee1-5474-4a8b-9b7d-386dd86504c0)

- 위 단위 경우의 수를 통해 `tops = [0, 1]` 일 때의 경우의 수를 도출해보자.
	- 0과 1이 붙었으니, 3 * 4 = 12 가지 경우의 수를 만들 수 있지만, 이 중 불가능한 케이스가 존재한다.

    ![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4c6e323a-a336-4595-b7ae-17de05b7881f)

    - 검은색 부분이 겹쳐버리는 케이스가 존재하기 때문에, 이를 빼줘야 한다. 따라서 구하고자 하는 경우의 수는 11가지 이다.

- 겹치는 케이스를 다시 잘 생각해보자. `tops = 0`에서 겹치지 않는 경우에는 모두 초록색 정삼각형(1번 타일)로 끝났지만, 겹치는 경우는 노란색 마름모(4번 타일)로 끝났다.
	- 즉, 이전 모양이 노란색 마름모로 끝났는지 체크하면, 다음 경우의 수를 구할 수 있다.
	- 이를 위해 2개의 `dp`배열을 사용한다.
	- `dp1[i] = i번째 tops 까지 타일링 했을 때, 마지막을 노란색 타일로 끝낸 경우`
	- `dp2[i] = i번째 tops 까지 타일링 했을 때, 마지막에 노란색 타일을 제외한 나머지 타일로 끝낸 경우`
	- `dp1[0]` 의 경우, `tops[0]` 에 상관 없이 항상 1이다.
	- `dp2[0]` 의 경우, `tops[0]`에 따라 2, 또는 3이다. 아래 그림을 보자.

    ![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/8d368252-0b24-43f3-be1f-2aa5a311aef4)

- `dp1` 과 `dp2` 과 각각의 초기 케이스를 정의했으니, 다음 케이스도 생각해보자. `dp1[1]` 과 `dp2[1]` 은 어떻게 만들어질까?
	- 각각의 케이스는 다시 두가지 경우(노란색 타일로 끝내는 경우와, 그렇지 않은 경우)로 나뉜다.
	- `dp1`에서 다시 `dp1`을 만들 수 있고, (case i)
	- `dp1`에서 `dp2`를 만들 수 있다. (case ii)
	- 마찬가지로, `dp2`에서 `dp1`을 만들 수 있고, (case iii)
	- `dp2`에서 `dp2`를 만들 수 있다. (case iv)
	- 그림을 통해 이해해보자. 회색 부분은 이전 `dp`를 통해 채워진 부분이다.

    ![image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/35af5074-40dc-461f-a517-8c5b621871a2)

    - case i은 `tops`와 관계없이 항상 하나의 경우의 수를 가진다.
	- case ii는 `tops`에 따라 경우의 수가 달라진다. `tops=0`이면 초록 정삼각형(1번 타일)로만 채울 수 있어 1가지, `tops=1`이면 파란색 마름모(3번 타일)도 사용 가능하므로 2가지
	- case iii  또한  `tops`와 관계없이 항상 하나의 경우의 수를 가진다.
	- case iv는 `tops=0` 이면 2가지, `tops=1`이면 3가지 이다. (위에 있는 표를 참조하자.)
	- 따라서, `dp1[1] = case i + case iii = dp1[0] * 1 + dp2[0] * 1` 이다.
	- `dp2[1] = case ii + case iv = dp1[0] * (1 or 2) + dp2[0] * (2 or 3)`, or로 묶은 부분은 `tops`에 따라 달라지는 값이다.
- 위 원리를 통해 점화식을 도출하면 다음과 같다.
	- `dp1[i] = dp1[i - 1] + dp2[i - 1]`
	- `dp2[i] = dp1[i - 1] * (1 or 2) + dp2[i - 1] * (2 or 3)`
	- `tops` 가 0 또는 1로 주어지기 때문에, `or` 부분은 해당 값을 가져와서 더해주는 식으로 구현하면 편하다.
- 파이썬으로 풀어도 중간에 나머지 연산을 해주지 않으면 시간초과가 난다. 입력으로 뭘 때려 넣는지 잘 모르겠지만, 인덱스가 커질수록 최소 2배씩 늘어나기 때문에 \\( n \\) 이 1만 정도만 되어도 \\( 2^{10000} \\)  언저리의 수를 계산하게 된다.


# 코드

```python
def solution(n, tops):
    MOD = 10007
    dp1 = [0] * n
    dp2 = [0] * n
    dp1[0] = 1
    dp2[0] = 2 + tops[0]
    
    for i in range(1, n):
        dp1[i] = (dp1[i - 1] + dp2[i - 1]) % MOD
        dp2[i] = ((dp1[i - 1] * (1 + tops[i])) + \
                (dp2[i - 1] * (2 + tops[i]))) % MOD
        
    return (dp1[-1] + dp2[-1]) % MOD 
```
