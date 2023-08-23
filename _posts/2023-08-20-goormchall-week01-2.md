---
title:  "[구름톤 챌린지] 1주차 Day04 ~ Day05 학습 일기"
excerpt: "구름톤 챌린지 1주차 후기 (2)"

categories:
  - 9oormthon_challenge
tags:
  - [9oormthon_challenge, Algorithm]

date : 2023-08-20
last_modified_at: 2023-08-20

toc: true
related: true
---

Day 01 ~ 03 에 이어, Day 04 ~ 05 풀이 및 후기도 적어보자.

## Day 04 : 완벽한 햄버거 만들기

>해당 문제는 정렬을 활용해서 주어지는 값들이 올바르게 배치되어 있는지 확인하는 문제입니다. 국내 알고리즘 경진대회 변형 문제입니다.

문제 및 입출력 조건은 아래와 같다.
![Day04 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/83e54f2d-62de-481b-8726-98a873a16cc3)

입출력 예제는 아래와 같다.
![Day04 예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/7359750d-2db3-4492-9b57-7c94726b6954)

주어지는 수들을 조건에 맞게 검사하고, 합을 구하는 문제이다.

```python
import sys
input = sys.stdin.readline

n = int(input())
burger = list(map(int, input().split()))

def solve():
    if len(burger) == 1:
        return burger[0]
    max_idx = burger.index(max(burger))
    upper = burger[:max_idx]
    lower = burger[max_idx:]
    answer = 0
    if max_idx != 0:
        answer += upper[0]
    for i in range(1, len(upper)):
        if upper[i] < upper[i - 1]:
            return 0
        answer += upper[i]
    answer += lower[0]
    for i in range(1, len(lower)):
        if lower[i] > lower[i - 1]:
            return 0
        answer += lower[i]
    return answer
    
print(solve())
```

주어진 리스트에서 최댓값을 찾고 그것을 기준 삼아 반으로 나눈 뒤, 각각 오름차순과 내림차순을 만족하는 지 검사하는 방식으로 구현하였다.
문제 출제 의도는 정렬을 사용하는 것이었는데, 나누어진 리스트들이 정렬 전과 후의 변화가 있다면 0을 반환하는 식으로 구현 하는 방향이 좀 더 효율적일 것 같다.

## Day 05 : 이진수 정렬

>해당 문제는 주어진 데이터를 조건에 맞게 변형한 후, 다중 조건에 맞추어 정렬하는 문제입니다. 현대 모비스 알고리즘 대회 변형 문제입니다.

다음 날이 PCCP 시험이었다. 익숙치 않은 C++로 시험을 쳐야하는 상황이라서, 이 문제를 C++로 짜보기로 했다.

문제 및 입출력 조건은 아래와 같다.
![Day05 문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/ca65acc3-6903-4fce-9be8-f1e187b81472)

입출력 예제는 아래와 같다.
![Day05 예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4fa68daf-a89c-4a12-9d28-8b0dd302d7b2)

다중 조건 정렬 문제이다. 언어 별로 내장되어 있는 정렬 함수를 잘 활용할 줄 알아야 하므로, 마냥 쉬운 문제는 아닌 것 같다. 최대 입력수가 50만이라서, \\( O(N^2) \\) 로 구현하면 시간초과가 난다.

```c++
#include <bits/stdc++.h>
using namespace std;

bool compare(pair<int, int>& a, pair<int, int>& b);

int main() {
    int n, k;
    int num, temp, cnt;
    cin >> n; cin >> k;
    vector<pair<int, int>> array;
    for (int i = 0; i < n; ++i)
    {
        cin >> num;
        temp = num; cnt = 0;
        while (temp != 0)
        {
            cnt += temp & 1;
            temp >>= 1;
        }
        array.push_back(make_pair(num, cnt));
    }
    sort(array.begin(), array.end(), compare);
    cout << array[k - 1].first << "\n";
}

bool compare(pair<int, int>& a, pair<int, int>& b)
{
    return (a.second == b.second ? a.first > b.first : a.second > b.second);
}
```

C++ STL의 `sort()` 함수는 위와 같이 3번째 인자에 `bool` 반환형의 비교 함수를 넣을 수 있다. 입력을 받는 시점에, 비트 연산을 통해 1의 개수를 세어 (숫자, 1의 개수) 페어를 만들어서 벡터에 넣었다. 문제 조건에 맞게 1의 개수가 일치하는 지 먼저 체크한 후, 숫자를 비교할 지 1의 개수를 비교할 지 결정한다. 이렇게 비교 함수를 이용하면, \\( O(NlogN) \\)으로 최적화된 STL `sort()`를 나만의 기준으로 사용할 수 있다.

비트 연산을 통해 1의 개수를 세는 방법도 있지만, STL에 내장되어 있는 `bitset`을 사용하는 방법도 있다. `bitset.count()`를 통해 1의 개수를 셀 수 있다.

주의해야 할 점이 있다. 비교 함수 안에서 비트연산을 통해 1의 개수를 비교하게 되면, 매 비교시 마다 비트연산을 수행하게 되어 엄청난 시간 손해를 보게 된다. 또한, 비교 함수의 논리 연산으로 `<=`, `>=` 같은 것을 쓰게 되면, _strict weak ordering_ 규칙을 위반하게 된다. 해당 규칙을 위반하도록 비교 함수를 작성한다면, 프로그램이 SEGV나 ABORT 같은 것을 내뿜으며 죽어버린다. 직접 컴파일 해보는 상황도 아니라면, 찾아내기 쉽지 않다.

파이썬으로 푼다면 `bin(num)[2:].count('1')`로 한 번에 해결할 수 있다. `bin()`은 정수를 2진수 문자열로 바꾸면서 앞에 `0b`를 붙이게 되는데, 앞 두글자를 제거한 후 `count()`를 통해 1의 개수를 셀 수 있다. 그 후 (1의 개수, 숫자) 페어(튜플)를 만들어서 내림차순으로 정렬해준다. 파이썬 내장 `sort()`는 iterable한 객체를 비교할 때에는 앞에서 부터 순서대로 비교해 나아간다.

```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())

def make_pair(num_string):
    num = int(num_string)
    cnt_1 = bin(num)[2:].count('1')
    return (cnt_1, num)

lst = list(map(make_pair, input().split()))
lst.sort(reverse=True)
print(lst[k - 1][1])
```

### strict weak ordering

[영문 위키](https://en.wikipedia.org/wiki/Weak_ordering)에 자세히 나와있다.

어떤 이항연산 \\( R \\)에 대하여, 다음 4가지 조건을 만족할 때 **strict weak ordering**을 만족한다.

1. 비반사성(irreflexivity): 모든 \\( x \\)에 대해 \\( R(x, x) \\)는 거짓
2. 비대칭성(asymmetry): 모든 \\( x \\), \\( y \\)에 대해 \\( R(x, y) \\)가 참이면 \\( R(y, x) \\)는 거짓
3. 추이성(transitivity): 모든 \\( x \\), \\( y \\), \\( z\\)에 대해 \\( R(x, y) \\)와 \\( R(y, z) \\)가 참이면 \\( R(x, z) \\)는 참
4. 비비교성의 추이성(transitivity of incomparability): 모든 \\( x \\), \\( y \\), \\( z \\)에 대해 \\( R(x, y) \\)와 \\( R(y, x) \\)가 거짓이고 \\( R(y, z) \\)와 \\( R(z, y) \\)가 거짓이면 \\( R(x, z) \\)와 \\( R(z, x) \\)는 거짓

쉽게 풀이하면, 논리 연산이 삼단 논법을 만족해야 하며, 역이 성립해야 한다.
`<=`, `>=` 연산을 \\( R \\)에 대입해보면, 위 4가지 가정이 하나도 성립하지 않음을 이해할 수 있다.

## 1주차 마무리 후기

확실히 초반부 문제들 보다는 난이도가 상승한 모습이다. 이번주만 보면 월~금으로 갈수록 난이도가 올라가는 모습인데, 다음주 완전 탐색 유형도 이런식일지 궁금해진다. 문제가 무지막지하게 어렵다 이런건 아닌데, 생각보다 복습하게 되는 키워드들이 많다. 모쪼록 성실히 완주해서, 공부도 하고 후기도 적고 네이버페이 포인트도 타야겠다 +_+
