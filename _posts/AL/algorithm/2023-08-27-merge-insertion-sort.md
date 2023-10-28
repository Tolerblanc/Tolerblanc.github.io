---
title: "MergeInsertionSort (Ford-Johnson Algorithm) 를 구현하기 전에"
excerpt: "42 Cursus - CPP Module 09를 하고 계신가요?"

categories:
  - Algorithm
tags:
  - [42Seoul, Algorithm]

date: 2023-08-27
last_modified_at: 2023-08-27

toc: true
toc_sticky: true
related: true
---

## 들어가기 전에

`@ebang` 님 께서 쓰신 병합, 삽입 정렬 및 이진 탐색에 대한 개괄적인 이해를 돕는 글과 Ford-Johnson 알고리즘의 핵심 아이디어를 정리해주신 글 ([링크1](https://ebang.tistory.com/103), [링크2](https://ebang.tistory.com/104))을 읽고 오시는 것을 추천드립니다. 이어쓰게 허락해주신 `@ebang`님 고맙습니다!

## Ford-Johnson 알고리즘은 비교 횟수에 있어 항상 최적인가?

[L. Ford, S. Johnson, A tournament problem, American Mathematical Monthly 66 (1959) 387–389.](https://www.jstor.org/stable/2308750) 에서 제시된 Ford-Johnson 알고리즘은 본래 Steinhaus가 제시한 `토너먼트 문제`의 최적 해결법으로써 제시되었다. (`토너먼트 문제` : "모든 선수의 순위를 매기기에 항상 충분한 최소 경기 수는 얼마인가?")

Steinhaus는 해당 문제에 대한 귀납적 해결 방안을 같이 제안했는데, 이는 다음과 같다. 처음 \\(k\\)명의 플레이어가 순위를 매긴 후, \\(k + 1\\)번째 플에이어가 순위가 매겨진 \\(k\\)명의 중간 플레이어와 매칭되고, '반감' 과정을 (역: 이진 탐색과 비슷한 방식이다.) 통해 해당 플레이어의 최종 순위를 매긴다. 같은 방식으로 그 이후의 플레이어 순위를 결정한다. 이러한 과정을 반복하면, 한 플레이어를 \\( S(k) = 1 + \[\log_2k\]\\) 번의 매칭으로 순위를 결정할 수 있으며, 플레이어 \\(n\\) 명에 대한 매칭 수의 상한\\(M(n)\\)을 찾을 수 있다.
\\( M(n) = 1 + nS(n) - 2^{S(n)}\\)

위 방식보다 더 최적임이 증명된 방법이 바로 Ford-Johnson 알고리즘이며, 초기 제시 논문에서 매칭 수의 상한 \\(M(n)\\)이 근삿값으로 제시되었다.
\\( M(n) \sim n \log_2n - 0.915n + O(\log_2n)\\)
한 눈에 확 적어졌다고 알아보긴 어렵지만, 수식의 자세한 유도 과정이 궁금한 사람은 [여기](https://www.jstor.org/stable/2308750)를 참조하자.

Ford-Johnson 알고리즘이 제안된지 약 10년만에 [D. Knuth, The Art of Computer Programming, Volume 3, Section 5.3.1 (1968).](https://www2.warwick.ac.uk/fac/sci/dcs/teaching/material/cs341/FJ.pdf)에서 이진 삽입 과정에서 쓰이는 최대 비교 상한과 더불어, 초기에 근삿값으로 제시되었던 매칭 수의 상한까지 계산되었다. 삽입 시 야콥스탑 수열을 따르는게 왜 최적인지 설명해주는 글이므로, 한 번쯤 읽어보는 것을 추천한다.

확실한 상한이 계산되고 또 약 10년이 지나서야, Ford-Johnson 알고리즘이 항상 최적이 아니라는 사실이 증명되었다. [The Ford-Johnson Sorting Algorithm Is Not Optimal](https://dl.acm.org/doi/pdf/10.1145/322139.322145) 읽다 보니 어지러워서 초록만 보고 관뒀다. 기존에는 Ford-Johnson 알고리즘의 비교 횟수가 정보이론적 하한선을 달성하는 것으로 알려져 왔지만 해당 논문에서 \\(n \gt 189\\)에 대해 \\(kt - O(log t)\\)의 차이가 발생한다는 것을 증명한다. (k는 양수)

결론은 항상 절대적으로 최적 비교 횟수를 보장하는 것은 아니지만, 현실적인 상황에서 단순 비교로 우열을 가릴 수 없는 상황에 대해 최적으로 동작하는 알고리즘 이라는 점이고, 한 번쯤은 구현해볼 가치가 있다.

처음 공부할 때는 '도대체 이런걸 왜 해야하는 걸까?' 하는 생각이 들었다.
정렬 알고리즘을 배울 때에는 항상 숫자 정렬만을 하게 되는데, 사실 숫자 정렬이라는 상황 자체가 굉장히 이상적이라고 생각한다. 현실 세계에서는 숫자보다 훨씬 복잡한 것들을 정렬할 필요가 있기 때문이다. 이 문제가 처음 제시된 토너먼트처럼 말이다. 굳이 서브젝트에서 Ford-Johnson 알고리즘을 구현하라고 명시한 이유도 이런 비슷한 맥락이라고 생각한다. 비록 구현 자체는 positive integer만을 사용하라고 나와 있지만, 이 세상에는 정렬 시간만 최적화 한 알고리즘만 있는게 아니라 정렬 횟수 자체를 최적화 한 알고리즘도 있으니 이것도 한 번 공부해보라는 의도가 아닐까?

## 어떻게 구현하지?

얼추 알고리즘은 이해했는데, 어떻게 구현할지 막막해진다. 가장 큰 문제는 이 정렬 알고리즘의 공식 구현이 없어서 구현하는 사람마다 약간씩 차이가 있다는 점이다. 게다가 이 알고리즘이 처음 제시되었을 때는 pseudo-code 제시조차 없이 그림으로 뭉뚱그려 놓았다. 해당 그림과 그에 대한 설명 먼저 살펴보자.

### 초기 제안 방식

\\( n = 2r \\) 또는 \\( n= 2r + 1 \\)이라고 가정합니다.

1. 2명의 플레이어가 짝을 이루어 첫 번째 라운드에서 짝을 이루고, \\(n\\)이 홀수일 경우 한 명을 제외합니다.
2. \\(r\\)명의 플레이어에게 현재 방법을 계속 적용하여, 이 \\(r\\)명의 1라운드 승자들의 전체 순위를 매깁니다.
3. 세 번째 단계는 다이어그램으로 설명하는 것이 가장 좋습니다. ~~(???)~~
   ![ford-johnson_diagram](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1eb74ef3-b54e-4745-9023-df9e94486839)

> 첫 라운드 우승자인 JIH...CB 순으로 순위가 매겨지며 J가 최고 플레이어 입니다.A는 B에 대한 첫 번째 라운드 패자이며, 다른 첫 번째 라운드 패자는 각 승자 바로 아래에 표시됩니다. 1라운드에서 기권을 뽑은 홀수 플레이어는 패자로 간주되어 도표의 맨 왼쪽에 배치됩니다. 메인 체인 (J-I-H-...-C-B-A)에 번호가 매겨진 순서로 삽입합니다. 이 절차는 체인의 포인트 수가 \\( 2k-1 \\) 형태일 때 Steinhaus 방식으로 단일 포인트를 체인에 삽입하는 것이 가장 효율적이라는 사실에 기반합니다.

위 글처럼 초기에 제시된 방식은 메인 체인에 대한 정렬 과정이 명시적으로 나와 있지 않고, pair-wise한 정렬 방식을 계속 적용하라고만 되어 있다. 넓게 보면, 버블 정렬 또한 pair-wise라고 볼 수 있지 않을까? 거의 모든 정렬 알고리즘이 swap 과정을 거치기 때문에, swap 또한 pair-wise 연산으로 본다면 메인 체인을 정렬하는 알고리즘에는 크게 제약이 있진 않은 것 같다.

### 최신 구현 방식

Ford-Johnson의 평균 케이스를 계산한 최근 논문인 [On the Average Case of MergeInsertion](https://arxiv.org/abs/1905.09656)에서 제시된 pseudo-code를 참조하자.
![MergeInsertion_pseudo-code](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/7608af68-b887-43da-88d2-5915ce89ff5e)

전체적인 맥락은 비슷하지만, 메인 체인 또한 재귀적으로 같은 알고리즘을 통해 정렬하는 점이 다르다.

### 결론 & 참고하면 좋은 자료들

메인 체인의 정렬 방식이 화두가 된 것으로 알고 있는데, 어느 쪽으로 구현하던 디펜스 근거는 충분하다. 다만, pair-wise한 정렬 접근, 메인 체인과 펜딩(pending) 체인의 분리, 야콥스탈 수열을 따르는 삽입 과정은 초기부터 제안되어 왔으므로 반드시 지켜져야 한다고 생각한다. 이제 서브젝트에 Ford-Johnson 알고리즘을 구현하라고 명시되어 있으니, 이것들이 지켜지지 않은 구현은 과감히 Fail을 누르도록 하자.

[C++](https://github.com/Morwenn/cpp-sort/blob/1.x.y-stable/include/cpp-sort/detail/merge_insertion_sort.h#L244), [Python](https://github.com/PunkChameleon/ford-johnson-merge-insertion-sort/blob/master/fjmi.py#L90), [Clojure](https://github.com/decidedlyso/merge-insertion-sort/blob/master/src/merge_insertion_sort/core.cljc), [Rust](https://docs.rs/crate/ford-johnson/0.2.1/source/src/lib.rs)로 구현된 코드가 있으니 참고하자. 이 중 Rust 구현체만 메인 체인을 재귀적인 Ford-Johnson을 통해 정렬하였으며, 나머지 코드들은 각기 다른 방식을 사용한다.

### 내가 구현한 방식

초기 제안 방식에 약간의 꼼수를 섞어서 구현했다. _positive integer_ 에 대해 유효한 방법이니 구현 전에 한 번 생각해보자.

본래 홀수 개의 원소를 정렬할 때에 하나의 원소가 페어로 만들어지지 않고 남아있게 된다. 나는 남아있는 원소 또한 `INT_MAX`와 페어로 만들어서 메인 체인을 정렬하고, 메인 체인에 남아있는 `INT_MAX`를 제거하는 방식으로 구현했다. `for`문으로 인덱스를 2칸씩 밀면서 페어를 만들면 되는지라 고려해야 할 부분이 조금 줄어든다. 또한 페어를 만들고 그것을 정렬하는 방식이 아닌, 숫자 두 개를 먼저 보고 비교하여 페어를 만들어주는 방식으로 구현했다.

메인 체인을 정렬하는 방식은 선택 정렬 알고리즘을 사용했다. 큰 의미는 없고, `vector`와 `list`를 정렬할 때 `list`에 조금이나마 유리할 것 같은 알고리즘을 골랐다. 선택 정렬은 `std::iter_swap` 과 `std::min_element`를 통해 직접 구현하였다.

STL의 사용 숙달이 주 목적인 과제이므로, 두 컨테이너의 정렬 시간 및 결과를 main문에서 `std::sort`와 비교해보는 것 또한 추천한다. STL의 위대함을 깨달을 수 있다.

## References

<https://www.jstor.org/stable/2308750>

<https://ebang.tistory.com/104>

<https://dl.acm.org/doi/pdf/10.1145/322139.322145>

<https://github.com/PunkChameleon/ford-johnson-merge-insertion-sort>

<https://docs.rs/crate/ford-johnson/0.2.1>

<https://github.com/decidedlyso/merge-insertion-sort>

<https://github.com/Morwenn/cpp-sort/blob/1.x.y-stable/include/cpp-sort/detail/merge_insertion_sort.h#L244>

<https://warwick.ac.uk/fac/sci/dcs/teaching/material/cs341/FJ.pdf>

<https://en.m.wikipedia.org/wiki/Merge-insertion_sort#cite_ref-6>

<https://books.google.co.kr/books?id=kM5v2YqMVuoC&pg=PA286&redir_esc=y#v=onepage&q&f=false>

<https://codereview.stackexchange.com/questions/116367/ford-johnson-merge-insertion-sort>
