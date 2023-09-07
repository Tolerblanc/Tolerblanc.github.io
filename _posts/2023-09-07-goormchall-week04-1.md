---
title: "[구름톤 챌린지] 4주차 Day16 ~ Day18 학습 일기"
excerpt: "구름톤 챌린지 4주차 후기 (1)"

categories:
    - 9oormthon_challenge
tags:
    - [9oormthon_challenge, Algorithm]

date: 2023-09-07
last_modified_at: 2023-09-07

toc: true
toc_sticky: true
related: true
---

주말에 칠 PCCP를 위해서 이번주는 C++로 풀이하기로 했다.

## Day 16 : 연합

> 해당 문제는 그래프에서 컴포넌트의 개수를 찾는 문제입니다. 컴포넌트와 그래프 탐색 개념이 필요합니다. 구름 레벨 기출 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day16문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1fef2aa5-a082-4f20-a3ab-bb660eb6a1d5)
![Day16문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d4f95d33-17cb-42ab-9e72-27ec5f7d3fd9)
입출력 예제는 다음과 같다.
![Day16예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4800d757-e6e3-4ae0-b20f-6e61c5519cf4)

임의의 그래프에서 컴포넌트를 탐색하는 문제이다. 간단히 이야기해서 서로 연결되어 있는 섬이 몇 개인지 찾는 문제와 같다고 할 수 있다.

```c++
#include <iostream>
#include <vector>

using namespace std;

int graph[2001][2001];
bool visited[2001];

void dfs(int size, int cur)
{
    if (visited[cur])
        return;
    visited[cur] = true;
    for (int i = 1; i <= size; i++)
    {
        if (graph[cur][i] == 1 && graph[i][cur] == 1 && !visited[i])
            dfs(size, i);
    }
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    int s, e;
    for (int i = 0; i < m; i++)
    {
        cin >> s >> e;
        graph[s][e] = 1;
    }

    int ans = 0;
    for (int i = 1; i <= n; i++)
    {
        if (!visited[i])
        {
            ans++;
            dfs(n, i);
        }
    }
    cout << ans << '\n';
    return 0;
}
```

**직접** 연결된 노드만 방문 처리를 해주면 된다. DFS, BFS 아무거나 써도 해결 가능하다. 모든 노드에 대해 탐색을 시도하되, 탐색을 시도할 때마다 이동 가능한 노드를 모두 방문처리 해주면 된다. 탐색 시도 횟수가 곧 컴포넌트의 개수가 된다. 구현 자체는 재귀 DFS가 빠르고 간편해서 이걸로 구현했다. **직접** 연결된 노드의 뜻을 잘못 이해해서 시간이 좀 걸렸다.

## Day 17 : 통신망 분석

> 해당 문제는 그래프의 컴포넌트 개념과 다중 조건 정렬을 활용한 해결이 필요한 복합 유형 문제입니다. K사 기출 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day17문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/3f23538d-2918-41f5-b079-6d8cefa5bfbd)
![Day17문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/db170879-abda-4bd9-b807-6dd43b70f57e)
입출력 예제는 다음과 같다.
![Day17예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/e70bb7ad-3820-46e5-812d-68855dabf771)

이것도 컴포넌트 탐색이지만, 밀도라는 개념을 도입해서 정답을 구하는 조건을 꼬아 어렵게 만든 문제이다.

```c++
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>

using namespace std;

typedef struct component
{
    double  density;
    int     edges;
    int     nodes;
    int     smallest;
    vector<int> computers;

    component() : edges(0), nodes(0), density(0) { }

    void    add(int com)
    {
        this->computers.push_back(com);
    }

    void    set_edge(int cnt)
    {
        this->edges = cnt;
    }

    void    init()
    {
        sort(this->computers.begin(), this->computers.end());
        this->nodes = this->computers.size();
        this->density = (double) this->edges / this->nodes;
        this->smallest = this->computers[0];
    }
}component;

bool    comp(component& a, component&b)
{
    if (a.density != b.density)
        return (a.density > b.density);
    if (a.nodes != b.nodes)
        return (a.nodes < b.nodes);
    return (a.smallest < b.smallest);
}

bool visited[100001];
int  n, m;
vector<component> components;

void bfs(vector< vector<int> > &graph, int idx)
{
    queue<int> q;
    component c;

    visited[idx] = true;
    q.push(idx);
    c.add(idx);
    int edges = graph[idx].size();
    if (edges == 0)
        return ;
    int now;

    while (!q.empty())
    {
        now = q.front();
        q.pop();
        for (int next : graph[now])
        {
            if (visited[next])
                continue;
            edges += graph[next].size();
            visited[next] = true;
            c.add(next);
            q.push(next);
        }
    }
    c.set_edge(edges / 2);
    components.push_back(c);
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m;
    vector< vector<int> > graph(n + 1);

    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        graph[a].push_back(b);
        graph[b].push_back(a);
    }

    for (int i = 1; i <= n; i++)
    {
        if (!visited[i])
            bfs(graph, i);
    }
    for (int i = 0; i < components.size(); i++)
        components[i].init();
    sort(components.begin(), components.end(), comp);
    for (int n : components[0].computers)
        cout << n << " ";
}
```

파이썬이었으면 좀 더 간단하게 구현했을 것 같은데, 내 머리로 C++은 이게 한계이다... 원리 자체는 어제 문제와 크게 다르지 않다. 다만 밀도를 구하기 위해서는 방문한 노드 수 뿐만 아니라 엣지 수도 구해야 한다. 양방향 그래프이기 때문에 방문한 노드들의 엣지 수를 모두 더하면, 정확히 컴포넌트에 속한 엣지들의 개수의 두 배가 나온다. 밀도와 컴포넌트에 속한 엣지 수, 가장 작은 엣지 번호를 모두 저장해놓은 상태로 문제 조건에 맞게 정렬하면 해결할 수 있다.

## Day 18 : 중첩 점

> 해당 문제는 동적 프로그래밍과 시뮬레이션 문제를 혼합한 문제입니다. 칸 안에 그려진 선의 개수를 관리할 방법을 찾아야 합니다. 공기업 기출 변형 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day18문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/c2832336-54ff-4bce-9fc0-fa400681507f)
![Day18문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/dfee78b9-8ae8-4f39-a87b-1a66920b06d7)
입출력 예제는 다음과 같다.
![Day18예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/56c0e6b9-b7df-46a6-8a01-214770022d1d)

DP + 시뮬레이션 문제라고 설명되어 있는데, 사실 아직도 이게 왜 DP인지 이해하지 못했다.

```c++
#include <iostream>
#include <queue>
#include <array>

using namespace std;
queue<array<int, 3> > query;
int graph[101][101];
int n, m, x, y;
char d;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> y >> x >> d;
        if (d == 'U' || d == 'D')
        {
            array<int, 3> temp = {y, x, d};
            query.push(temp);
        }
        else if (d == 'R')
        {
            for (int j = x; j <= n; j++)
                graph[y][j] += 1;
        }
        else if (d == 'L')
        {
            for (int j = x; j >= 1; j--)
                graph[y][j] += 1;
        }
    }
    unsigned int answer = 0;
    while (!query.empty())
    {
        auto temp = query.front();
        query.pop();
        if (temp[2] == 'U')
        {
            for (int i = temp[0]; i >= 1; i--)
                answer += graph[i][temp[1]];
        }
        else if (temp[2] == 'D')
        {
            for (int i = temp[0]; i <= n; i++)
                answer += graph[i][temp[1]];
        }
    }
    cout << answer << '\n';
}
```

교점이 생기는 조건을 잘 생각해보면, 가로 세로 반직선이 만나는 경우이다. 가로 반직선 끼리, 세로 반직선 끼리는 문제 조건에 의하여 절대 교점이 생겨날 수 없다. 그래서 오프라인 쿼리처럼 가로 반직선을 모두 그어둔 뒤에, 세로 반직선을 그어가면서 정답을 구했다. 나름 시간복잡도도 잘 챙긴 코드라고 생각한다. 올바르게 계산한건지 잘 모르겠지만, \\( M \\) 개의 쿼리에 대해 각 \\( N \\) 번의 탐색으로 해결하였으니 \\( O(N\*M) \\) 인 것 같다. 출제자의 의도가 이게 맞는지는 잘 모르겠다.

## 4주차 중간 후기

마지막 주 라서 출제자 분들이 이를 가신 것 같다. 이전 주차들에 비해 난이도가 확실히 올라갔다. 어쩌면 그래프 문제들을 위해 힘을 숨겨 왔던 걸지도...? 종료까지 진짜 얼마 안남았는데, 남은 이틀도 잘 풀어서 완주해야겠다.
