---
title: "[구름톤 챌린지] 4주차 Day19 ~ Day20 학습 일기"
excerpt: "구름톤 챌린지 4주차 후기 (2)"

categories:
    - 9oormthon_challenge
tags:
    - [9oormthon_challenge, Algorithm]

date: 2023-09-09
last_modified_at: 2023-09-09

toc: true
toc_sticky: true
related: true
---

## Day 19 : 대체 경로

> 해당 문제는 변화하는 그래프에서 최단 거리를 찾는 문제입니다. 제약 조건이 있을 때, 효율적인 그래프 탐색 방법을 찾아야 합니다. 신규 제작 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day19문제1](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/513140cf-82c6-42a2-8ce0-f49cd9881daa)
![Day19문제2](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/6fcaf4b6-4add-41c5-8652-ee9f53cd5c1a)
![Day19문제3](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b928d067-75f1-4914-b8fd-7285fc04467b)
![Day19문제4](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/8ee47704-c111-43f4-8acc-d66cfe36b77b)
입출력 예제는 다음과 같다.
![Day19예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/e94d718f-5105-46c9-8fb5-10dc60694268)

특정 노드로의 이동이 불가할 때의 최단 거리를 찾는 문제이다. 이동이 불가능한 노드가 매 번 바뀌기 때문에, 그래프를 변화시키며 탐색해야 한다.

```c++
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int n, m, s, e;

int bfs(vector<vector<int> > &graph, int uc)
{
    int visited[n + 1] = { 0 };
    queue<pair<int, int> > q;
    visited[s] = true;
    q.push(make_pair(s, 1));
    while (!q.empty())
    {
        auto next = q.front();
        q.pop();
        for (int node : graph[next.first])
        {
            if (node == uc || visited[node])
                continue;
            if (visited[node] == 0 || next.second + 1 < visited[node])
            {
                visited[node] = next.second + 1;
                q.push(make_pair(node, next.second + 1));
            }
        }
    }
    if (visited[e])
        return visited[e];
    return -1;
}

void simulate(vector<vector<int> > &graph)
{
    vector<int> temp;
    for (int i = 1; i <= n; i++)
    {
        if (i == s || i == e)
            cout << "-1\n";
        else
            cout << bfs(graph, i) << "\n";
    }
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n >> m >> s >> e;
    vector< vector<int> > graph(n + 1);
    int u, v;
    for (int i = 0; i < m; i++)
    {
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    simulate(graph);
}
```

BFS를 숙지하고 있다면, 시뮬레이션 + 구현에 더 가까운 문제이다. 주어진 조건에 따라 양방향 그래프를 만들어 둔 후, 특정 노드를 방문하지 않도록 BFS를 구현하여 이터레이션을 돌리면 된다. 출발/도착점이 이동 불가일 때에는 아예 BFS를 시도하지 않고 -1을 출력할 수 있도록 구현하였다.

## Day 20 : 연결 요소 제거하기

> 해당 문제는 그래프 탐색과 시뮬레이션을 혼합한 문제입니다. 조건에 따라 효율적으로 문제를 해결할 방법을 찾아야 합니다. 신규 제작 문제입니다.

문제 및 입출력 조건은 다음과 같다.
![Day20문제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4fe5d96d-f599-4131-a222-2ec415916ed1)
입출력 예제는 다음과 같다.
![Day20예제](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/2bdf8c1c-e478-4452-9f7d-fcd017d4d1f2)

어제 문제처럼 시뮬레이션+구현+BFS를 적절히 섞어놓은 문제이다. 그러나 입력되는 그래프의 요소가 문자이기 때문에, 파싱과 저장 및 출력에 주의해야 한다.

```c++
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int n, k, q;
int dx[4] = {1, 0, -1, 0};
int dy[4] = {0, 1, 0, -1};

void bfs(vector< vector<int > > &graph, vector< vector<bool> > &visited, int r, int c)
{
    int cnt = 1;
    int nr, nc;
    queue<pair<int, int> > que;
    queue<pair<int, int> > trace;

    que.push(make_pair(r, c));
    trace.push(make_pair(r, c));
    visited[r][c] = true;

    while (!que.empty())
    {
        auto curr = que.front();
        que.pop();
        for (int i = 0; i < 4; i++)
        {
            nr = curr.first + dx[i]; nc = curr.second + dy[i];
            if (nr <= 0 || nc <= 0 || nr > n || nc > n)
                continue;
            if (!visited[nr][nc] && (graph[r][c] == graph[nr][nc]))
            {
                visited[nr][nc] = true;
                cnt++;
                que.push(make_pair(nr, nc));
                trace.push(make_pair(nr, nc));
            }
        }
    }
    if (cnt >= k)
    {
        while (!trace.empty())
        {
            auto t = trace.front();
            trace.pop();
            graph[t.first][t.second] = '.';
        }
    }
}

void simulate(vector< vector<int> > &graph)
{
    vector< vector<bool> > visited(51);
    for(int i =0; i < visited.size(); ++i)
        visited[i].resize(51);

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            if (!visited[i][j])
                bfs(graph, visited, i, j);
        }
    }
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n >> k >> q;
    vector< vector<int> > graph(n + 1);
    int u, v; char c;
    for (int i = 1; i <= n; i++)
    {
        graph[i].push_back(0);
        for (int j = 0; j < n; j++)
        {
            cin >> c;
            graph[i].push_back(c);
        }
    }
    for (int i = 0; i < q; i++)
    {
        cin >> u >> v >> c;
        graph[u][v] = c;
        simulate(graph);
    }
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++)
            cout << static_cast<char>(graph[i][j]);
        cout << "\n";
    }
}
```

BFS를 돌릴 때 방문했던 노드들을 저장하는 큐를 하나 만들고, 컴포넌트의 크기가 \\( K \\) 이상이라면 방문했던 노드들의 문자를 다 지우는 방식으로 구현했다. 조건만 잘 체크해가며 구현하면 크게 어렵지는 않다. 구현의 편의를 위해 `int`배열을 사용하였는데, 출력할 때는 반드시 문자로 돌려줘야 한다.

## 마무리 후기

벌써 4주차가 막을 내렸다. 중간에 약간 의문스러운 문제도 있었지만, 팀원들이랑 다같이 풀다보니 확실히 동기부여가 됐던 것 같다. BOJ는 내가 직접 문제를 골라 풀어야 하지만, 구름톤은 일차별 정해진 문제가 있어서 좋았는데 막상 이게 끝이라니 아쉽다. 혹여나 다음에도 열린다면 또 참여해야겠다.
