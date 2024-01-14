---
title: "도커 구성요소 파헤치기"
excerpt: "도커는 어떻게 동작하는걸까?"

categories:
    - Docker
tags:
    - [Docker, Container, Linux]

date: 2024-01-14
last_modified_at: 2024-01-14

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>


## Docker Architecture

![Docker Architecture Overview](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/85ed14be-9053-403c-94aa-6afa28308ad3)

- 도커는 클라이언트-서버 아키텍쳐를 사용하며, Go로 작성되었다.
- 도커 클라이언트는 도커 데몬 (서버) 과 통신한다. 통신은 REST API 방식으로 이루어지며, UNIX 소켓이나 네트워크 인터페이스를 활용한다.
    - 도커 사용자가 도커와 상호 작용하는 기본 방법이다.
    - 사용자가 명령을 입력하면, 도커 클라이언트는 이 명령을 도커 데몬에 전달하여 명령이 수행되도록 한다.
    - 도커 클라이언트는 둘 이상의 데몬과 통신할 수 있으며, 데몬과 동일한 시스템에 있거나 다른 시스템에서 원격으로 통신할 수 있다.
- 도커 데몬(`dockerd`)은 도커 컨테이너의 빌드, 실행, 배포 등 무거운 작업을 수행한다.
    - 기본적으로 데몬이기 때문에, 도커 API 요청을 수신 대기하고 있다.
    - 이미지, 컨테이너, 네트워크, 볼륨과 같은 도커 개체를 관리한다.
    - 다른 데몬과 통신하여 도커 서비스를 관리할 수 있다.
- 도커 데몬(`dockerd`)이 포함된 서버와 CLI 도커 클라이언트, 이 둘의 통신을 도와줄 API를 묶어 도커 엔진으로 통칭한다.
- 도커 데스크탑을 설치하면 도커 엔진, 도커 컴포즈, 도커 빌드(buildx), 쿠버네티스 등이 함께 설치된다.
- 도커 레지스트리(Registry)는 도커 이미지를 저장한다. 도커 허브는 누구나 사용할 수 있는 도커 레지스트리 이다. 도커는 기본적으로 도커 허브에서 이미지를 찾도록 설정되어 있으며, 사용자만의 프라이빗 레지스트리를 사용할 수도 있다.
- 위에 적었다시피, 도커는 리눅스 커널을 활용하여 컨테이너 기술을 구현한다. 즉, 도커는 리눅스 위에서 네이티브로 돌아가게 된다. Windows나 macOS 같은 경우에는 하이퍼바이저를 통해 컨테이너 기술을 실현할 수 있는 최소한의 리눅스 VM(이를 경량VM이라고 한다.)을 뒷단에서 돌리고, 그 위에 도커 엔진을 올려 컨테이너를 구현한다. 결국 리눅스가 아닌 OS에서는 가상화 기술이 들어가긴 하지만, 기존 VM과 비교하면 절대적인 성능차이가 매우 크다. Windows에서는 WSL위에서 도커를 네이티브로 돌릴 수 있다.

## Docker Image

![docker image](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/8f51620c-23af-497a-aab2-d8c7d834c9f9)

- 도커 컨테이너를 만들기 위한 지침이 포함된 읽기 전용 템플릿
- 종종, 이미지는 다른 이미지를 기반으로 하여 약간의 추가 사용자 정의가 적용된다.
    - 예를 들어 우분투 이미지에 아파치 웹 서버와 애플리케이션을 설치하고, 애플리케이션 구동에 필요한 세부 구성 정보를 포함하는 이미지를 빌드할 수 있다.
- 직접 이미지를 만들거나, 도커 레지스트리에 올라온 이미지만 사용할 수 있다.
- 특정 이미지를 통해 컨테이너를 만들고, 컨테이너에 일련의 동작들을 통해 파일 시스템이 변경된다면, `docker commit`을 통해 새로운 이미지를 만들 수 있다.
    - 해당 컨테이너에서 아무리 어떤 동작을 하더라도 이미지 자체는 변하지 않는다. 본래의 이미지에 `git`과 같이 변경 레이어가 쌓인다고 생각하면 된다. ⇒ 유니온 마운트
- 자체 이미지를 만들기 위해서는, 이미지를 만들고 실행하는데에 필요한 단계를 간단한 구문으로 정의하는 도커파일이 사용된다.
    - 도커 파일의 각 명령은 이미지에 레이어를 만든다.
    - 도커 파일을 변경하고 이미지를 변경하면, 변경된 레이어만 다시 빌드된다.
    - 도커 파일을 통해 이미지를 만드는 데에는 `docker bulid` 가 사용된다.
    - 이것이 다른 가상화 기술과 비교하여 이미지가 가볍고 빠른 이유이다.

## Dockerfile

- 도커는 도커파일의 단계별 설정을 읽어 자동으로 이미지를 빌드할 수 있다.
- 도커파일은 사용자가 커맨드라인에서 호출하여 이미지를 어셈블할 수 있는 모든 명령이 포함된 텍스트 문서이다.
- 이미지 항목에도 설명되어 있다시피, 도커 이미지는 읽기 전용 레이어로 구성되며, 각 레이어는 도커파일 명령어를 나타낸다. 레이어는 스택으로 쌓여 있으며, 각 레이어는 이전 레이어로 부터의 변경 사항이다.
- 도커 파일 명령어는 아래의 형식을 따른다.
    
    ```docker
    # Comment
    INSTRUCTION arguments
    
    # example with multiple lines
    RUN echo hello  \
    # this is comment line.
    world!
    ```
    
- 각 명령어에 대해 살펴보기 전에, 도커 파일의 예시를 보자.
    
    ```docker
    FROM ubuntu:22.04
    COPY . /app
    RUN make /app
    CMD python /app/app.py
    ```
    
    - `FROM` : 우분투 22.04버전의 이미지를 기반으로
    - `COPY` : 파일을 복사 (상대경로는 현재 Dockerfile의 위치를 기준으로 함)
    - `RUN` : make를 통해 app 디렉터리 빌드
    - `CMD` : 해당 명령어를 컨테이너 안에서 실행
- 도커 파일의 명령어에 대해 알아보자.
    
    
    | INSTRUCTION | arguments | explanation |
    | --- | --- | --- |
    | FROM | 베이스 이미지 | 도커 컨테이너의 기본 이미지 지정 |
    | RUN | 커맨드 | 현재 이미지에서, 새 레이어를 추가하여 명령을 실행하고 결과를 커밋. |
    | CMD | 커맨드 | 컨테이너 실행을 위한 기본값. 실행 파일 또는 매개 변수를 넣을 수 있음. |
    | EXPOSE | 포트 | 컨테이너가 런타임에 특정 포트를 listen |
    | ENV | 환경변수 | key-value 쌍을 받아서, 컨테이너 내부에 등록함 |
    | ADD / COPY | 파일 | 새 파일 또는 디렉터리를 복사하여 컨테이너 파일시스템에 복사
    ADD는 압축을 풀 수 있고, URL에서 파일을 검색할 수 있음. |
    | ENTRYPOINT | 실행파일 | 실행파일로 구동할 수 있는 컨테이너를 구성. ENTRYPOINT 인자는 항상 사용되며, CMD 인수는 커맨드라인 인자로 덮어쓸 수 있음. |
    | VOLUME | 경로 | 지정된 이름의 마운트 포인트를 생성 |
    | USER | UID | 컨테이너를 실행할 UID 설정 |
    | WORKDIR | 경로 | WORKDIR 뒤에 오는 나머지 실행 명령의 작업 디렉터리 설정 |

- 도커 파일을 잘 작성하기 위한 몇 가지 지침에 대해 알아보자.
    - multi-stage 빌드 활용
    - 필요하지 않은 패키지는 설치하지 않기
    - 레이어의 수를 최소화하기
    - 실행하고자 하는 프로그램을 최대한 잘게 쪼개어 컨테이너 단위로 분리한다. (Decoupling)
    - 명령이 여러 줄일 경우, `\`로 구분하고 정렬하기
    - 빌드 캐시에 대한 레버리지

## Docker Container

- 도커 컨테이너는 도커 이미지의 실행가능한 인스턴스이다.
- 컨테이너를 하나 이상의 네트워크에 연결하거나, 스토리지를 연결하거나, 현재 상태를 기반으로 새 이미지를 만들 수 있다.
- 컨테이너는 이미지와 컨테이너를 만들거나 시작할 때 제공하는 모든 구성 옵션에 의해 정의된다.
- 컨테이너가 제거되면 영구 스토리지에 저장되지 않은 상태의 변경 사항은 모두 사라진다.
- 도커 컨테이너는 가상머신이 아니고, 프로세스다.
- 도커 컨테이너의 PID는 항상 1번이다. → PID 네임스페이스의 분리
    - 위에서 PID 네임스페이스를 분리하는 원리에 대해 익혔다면, 호스트 시점에서의 컨테이너 PID와 컨테이너 시점의 자기 자신의 PID가 왜 다르고, 2개의 PID가 있지만 왜 실제 프로세스는 1개인지 이해가 될 것이다.
- 도커 컨테이너가 프로세스인 것을 이해하고 나면, 도커 이미지를 ‘단 하나의 타깃 프로세스를 실행하기 위한 파일들의 집합’ 으로 이해할 수 있게 된다.
- 도커 컨테이너를 실행시켜 tty를 붙이는 것도 ssh 접속이나 VM위에서 쉘을 실행시키는 것이 아니라, 컨테이너가 사용중인 네임스페이스나 파일 시스템에 접근하기 위한 특별한 명령어에 불과하다.

![container lifecycle](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1b878adc-edfe-4a14-bedd-835ea039a51b)

- 도커 컨테이너는 위와 같은 생애주기를 가진다. 명령어에 따른 컨테이너의 상태는 총 5가지 (created / stopped / running / paused / deleted)로 구분되며, 위 사진에서 확인할 수 있다.

## Dumb-init (For PID 1)

- 대다수의 OS에서 PID 1은 초기에 실행되는 init 프로세스가 할당 받는다.
    - 부팅 시 최초의 프로세스가 되는 데몬으로, 모든 프로세스의 직/간접적인 부모 프로세스가 된다.
    - 이는 init 프로세스가 고아 프로세스를 입양하는 역할을 하기 때문이다.
- 하지만 도커와 같은 경량 컨테이너들은 init 프로세스의 역할을 원활하게 수행할 수 있는 systemd, sysvinit등의 init 시스템이 없기 때문에, ENTRYPOINT에 명시된 명령어가 PID 1번을 받는다.
- 즉, 일반 애플리케이션이 PID 1을 가지게 된다.
- 일반 애플리케이션이 PID 1을 가지게 되면 해당 애플리케이션이 시그널 핸들러를 가지지 않는 이상, 정상적으로 시그널 처리를 할 수 없다.
- 또한, 고아 프로세스의 종료상태를 회수할 수 없어 좀비 프로세스가 생길 위험이 있다.
- [dumb-init](https://github.com/Yelp/dumb-init)은 경량 컨테이너를 위한 init 프로세스로, 최소 단위 컨테이너에서 시스템을 관리할 수 있도록 여러가지 기능들을 지원한다.

## Docker Volume

![Docker volume](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/8f5604be-6b6a-43f6-b218-2a8394ca61e6)

- 컨테이너의 생애주기에 따라, 명시적으로 저장하지 않은 변경 사항들은 컨테이너의 삭제와 함께 사라지게 된다.
- 이를 방지할 수 있는 방법이 두 가지가 있는데, `bind mount` 와 `volume`이다. (사진에는 `tmpfs mount`도 있지만, 이는 리눅스에서 임시적으로 사용하기 위한 공간을 메모리에 할당하는 기술이다. tmpfs = temporary file system)
- 도커 볼륨의 관리 주체는 도커 엔진이다. (도커 팀에서, 컨테이너 내부의 데이터를 보존하기 위한 방법으로 권장하는 방식이다.)
- 컨테이너가 시작되면, 도커는 읽기 전용 레이어를 로드하여 이미지 스택 위에 읽기-쓰기 레이어를 추가하고 컨테이너 파일시스템에 마운트한다.
- `docker volume create <name>` 으로 볼륨을 생성하고, `docker volume ls` 로 확인할 수 있다.
- `docker volume inspect <name>`으로 해당 볼륨에 대한 자세한 정보를 알 수 있다.

![volume inspect](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/05c4c0b5-1d73-4c0c-9a2a-026ae3a90dda)

- `Mountpoint` 부분에 마운트되는 실제 호스트 머신의 경로가 표기된다.
- `docker volume rm <name>`으로 볼륨을 삭제하고, `docker volume prune` 으로 마운트 되지 않은 볼륨을 청소할 수 있다.
- 컨테이너를 실행할 때, `-v` 옵션을 통해 볼륨을 마운트할 수 있다. 하나의 볼륨을 여러 컨테이너가 공유할 수 있다.
- 볼륨의 관리 주체를 사용자가 넘겨 받을 수 있는데, 로컬 머신의 특정 경로(파일 시스템)를 도커 컨테이너에 마운트 하는 것을 `bind mount` 라고 한다.
- 호스트 머신의 파일 시스템에서 git을 통해 소스파일을 관리하고, 컨테이너 내부에는 환경만 구축 해놓고 외부 git repo를 마운트 하여 빌드 후 테스트 하는 등의 용도로써 활용할 수 있다.

## Docker Network

### CNM (Container Network Model)

- 도커는 CNM을 기반의 네트워킹 구조를 가진다.
- 정확히는, CNM의 구현체인 libnetwork가 도커 네트워크의 모체가 된다.

![CNM](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/57455d82-e740-42f2-8039-2a57cc6970d7)

- Sandbox는 격리된 네트워크 스택으로, 네트워크 네임스페이스 등으로 격리된 구성이다.
- Endpoint는 `veth`와 같은 가상 네트워크 인터페이스로, 네트워크와 Sandbox를 1대1로 연결한다.
- 최종적으로, 서로 통신해야 하는 Endpoint 그룹을 그룹화하거나 격리하는 네트워크 스위치가 있다.
- 위와 같은 구성으로 마치 격리된 것 같은 네트워크 구조를 구성하고, 설정에 따라 컨테이너끼리, 혹은 원격 환경과 통신할 수 있다.
- 위 모델을 지킨 표준 구현체가 바로 `libnetwork` 이다. `go`로 쓰였으며, 오픈소스이다.

---

![network ls](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/ee310d84-c8d5-43ed-bbc7-28a95c9dae26)

- 드라이버 종류에서 볼 수 있다시피, 대표적으로 `bridge`와 `host`, `null` 3가지가 있다. `overlay` 드라이버도 있지만, 여러 호스트에 분산되어 돌아가는 컨테이너들 간 네트워킹에 사용되므로 여기서는 다루지 않는다.
- `bridge` 네트워크 드라이버는 하나의 호스트 머신 내에서 여러 컨테이너들이 통신할 수 있도록 한다.
- `host` 네트워크 드라이버는 컨테이너를 호스트 머신과 동일한 네트워크에서 돌리기 위해 사용한다.


- `docker network create <name>` 을 통해 네트워크를 생성하고, `docker network inspect <name>` 을 통해 상세 정보를 확인한다.

![inspect](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/4d91240d-4a83-4865-b93c-4866d762e11b)

- 컨테이너 구동 시 `—-network` 옵션을 통해 명시하거나, `docker network connect <network> <container>` 를 통해 컨테이너를 네트워크에 연결할 수 있다.
- `docker network disconnect <network> <container>` 를 통해 연결을 끊을 수 있다.
- `docker network prune` 을 통해 컨테이너가 연결되어 있지 않은 네트워크를 정리할 수 있다.

## Reference

[Docker Engine, 제대로 이해하기 (1)](https://gngsn.tistory.com/128)

[Linux Containers](https://linuxcontainers.org/)

[Docker Internals -- Docker Saigon](http://docker-saigon.github.io/post/Docker-Internals/)

[Docker overview](https://docs.docker.com/get-started/overview/)

[Dockerfile reference](https://docs.docker.com/engine/reference/builder/)

[Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

[생활코딩 Docker 입문수업 - 1. 수업소개](https://www.youtube.com/watch?v=Ps8HDIAyPD0&list=PLuHgQVnccGMDeMJsGq2O-55Ymtx0IdKWf)

[도커 : 이미지 만드는 법 - Dockerfile & build](https://www.youtube.com/watch?v=0kQC19w0gTI)

[도커 : 이미지 만드는 법 - commit](https://www.youtube.com/watch?v=RMNOQXs-f68)

[[Docker 기본(1/8)] Hello Docker!](https://medium.com/dtevangelist/docker-기본-1-8-hello-docker-5165abd00a3d)

[Docker와 Dumb-Init](https://www.hahwul.com/2022/08/06/docker-dumb-init/#orphanedzombie-process)

[Understanding Docker Volumes](https://earthly.dev/blog/docker-volumes/)