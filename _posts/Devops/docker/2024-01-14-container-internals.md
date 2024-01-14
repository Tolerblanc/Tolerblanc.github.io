---
title: "리눅스 컨테이너의 원리"
excerpt: "도커의 근간이 되는 리눅스 컨테이너에 대해 알아보자"

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

## Linux Container의 기본 원리

- 리눅스 컨테이너는 운영체제 수준의 가상화 기술로, 리눅스 커널을 공유하면서 프로세스를 격리된 환경에서 실행하는 기술이다.
- 프로세스 격리에는 [리눅스 네임스페이스](#리눅스-네임스페이스-linux-namespace), [컨트롤 그룹](#컨트롤-그룹-cgroups), [루트 디렉터리 격리](#루트-디렉터리-격리-root-directory-isolation) 등 커널의 기능을 활용한다.
- 호스트 머신에게는 프로세스로 인식되지만, 컨테이너 관점에서는 마치 독립적인 환경을 가진 가상머신 처럼 보인다.

## Container vs. Virtual Machine

- 컨테이너는 별도의 하드웨어 에뮬레이션 없이 리눅스 커널을 공유해 실행하며, 게스트 OS 관리가 필요하지 않다.
- 반면 VM은 하이퍼바이저 (호스트 OS를 거치지 않는 타입 I, 호스트 OS를 거치는 타입 II로 분리된다.) 를 통하여 하드웨어 에뮬레이션이 일어난다. (게스트 OS가 실제로 하드웨어를 가지고 있다고 인식한다.)
- 위 특징에 의하여, 컨테이너는 프로세스 격리를 위한 약간의 오버헤드를 제외하고 일반적인 프로세스를 실행하는 것과 속도가 비슷하다.
- 컨테이너는 독자적인 실행 환경을 가지며, 이는 이미지 라는 형태로 쉽게 공유될 수 있다. 리눅스 커널 위에서 같은 컨테이너 런타임을 사용할 경우, 컨테이너의 실행 환경을 손쉽게 공유하고 재현할 수 있다.
- VM과 비교하여 컨테이너는 공유 및 재현이 쉽다.

## 왜 Container를 사용하는가?

- 실행 환경 별로 실행해야 할 명령어 형태가 다 다를 수 있다. 또는 특정 애플리케이션을 설치하기 위해 환경 별 설정법이 다양할 수 있다.
- 하지만 컨테이너를 활용한다면 어느 환경이든 상관없이 동일한 형태의 명령어를 사용할 수 있다. 또한 편리함과 확장성을 지닌다.
- 같은 일을 수행하는 A, B 서버가 있다고 가정해보자. A 서버는 오래 전에 환경을 구성했고, B 서버는 이제 막 새로 환경을 구성했다.
    - 시간 차가 존재하기 때문에, 운영체제부터 컴파일러, 패키지 등 실행 환경을 완벽하게 맞추어 주기란 불가능에 가깝다. 그리고 이런 미세한 차이들이 장애를 일으킨다.
    - 그래서 ‘A 서버는 잘 되는데 B 서버는 왜 죽었지?’ 와 같은 일이 일어난다. 이렇게 A, B 서버 처럼 서로 모양이 다른 서버들이 존재하는 상황을 눈송이 서버 (Snowflake Server) 라고 한다.
- 하지만 ‘이미지’를 통해서 ‘컨테이너’로 환경을 구성하게 되면, 언제든 똑같은 형태의 서버를 실행할 수 있게 된다.
    - 이것이 도커 (컨테이너) 가 다른 서버 구성 도구와 가장 다른 부분이다. 다른 서버 구성 도구는 실행하는 시점에 서버의 상태가 결정되어 눈송이 서버가 만들어 질 수 있지만, 도커는 작업자가 그 시점을 미리 정해둘 수 있다. (이미지)
    - 다른 서버 구성 도구와 마찬가지로 서버 구성을 코드화 할 수 있는데, 이를 도커파일(Dockerfile)에 빗대어 볼 수 있다.
    - 도커파일의 실행 시점을 정해주게 되면 그것을 도커 이미지 라고 한다.
    - 도커 이미지에 환경 변수를 붙여 실행하게 되면 도커 컨테이너가 된다.
- 위와 같이 도커 컨테이너를 도커 이미지 + 환경 변수 형태로 바라보면, 클래스와 비슷하다고 생각할 수 있다.
    - 도커 이미지 자체는 수정이 불가능하다. (private)
    - 하지만 환경 변수는 실행 시 수정이 가능하다. (public)
    - 그래서 이미지를 공유하게 되면, 사용자가 입맛에 맞게 환경 변수를 설정하여 컨테이너를 사용할 수 있게 된다. (설치가 까다로운 소프트웨어도 이미지 형태로 관리하게 되면, 동일한 환경을 쉽게 재현할 수 있다.)
- 정리하면, 다음과 같은 장점들을 얻을 수 있다.
    1. 서버 등 실행 환경 제작 과정에서 견고함과 유연성 부여
    2. 다른 이가 사전에 제작한 환경(이미지)을 소프트웨어 사용하듯 가져다 쓸 수 있음
    3. 이미지만 있으면 동일한 환경을 여러 곳에 배포할 수 있는 확장성

## Container의 종류와 런타임

- 컨테이너는 크게 **시스템 컨테이너 (System Container)** 와 **애플리케이션 컨테이너 (Application Container)** 로 나눌 수 있다.
- 시스템 컨테이너는 호스트OS 위에 하드웨어 가상화 없이 게스트OS를 실행 하는 것을 목표로 한다.
    - 일반적인 리눅스 처럼 init 프로세스 (PID 1) 등을 사용하여 다수의 프로세스가 같은 환경을 공유하는 것을 목표로 한다.
    - LXC(Linux Containers) 와 LXD 가 여기 속한다.
- 애플리케이션 컨테이너는 컨테이너 기술을 활용하여 하나의 애플리케이션(프로세스)를 실행하는 것을 목표로 한다.
    - 독립적인 환경을 가진다는 점에서는 시스템 컨테이너와 동일하다.
    - 단 하나의 프로세스의 실행을 목표로 한다는 점에서 확장이 쉽고 관리 요소가 거의 없다.
    - Docker가 이에 속한다.
- 시스템 컨테이너의 경우 실행 환경이 무거워서, 변경 사항을 적절하게 저장하고 공유하는 것이 어려웠다.
- 하지만 애플리케이션 컨테이너의 경우, 유니온 마운트 기반의 이미지 개념을 도입해 실행 환경을 효율적으로 관리하고 적절한 단위로 공유할 수 있다.

## 컨트롤 그룹 (cgroups)

- 리눅스 커널의 기능 중 하나로, 프로세스에서 사용 가능한 CPU, 메모리, 네트워크 대역폭, 디스크 I/O 등을 그룹 단위로 제어하고 격리시킨다.
- 또한 설정한 cgroup을 모니터링 하거나 특정 자원으로의 cgroup 액세스 거부, 실행중인 시스템에서 cgroup을 동적으로 다시 구성하는 등 다양한 동작을 할 수 있다.
- cgconfig 서비스는 부팅 시 사전 정의된 cgroup을 다시 구성하도록 설정하여, 재부팅 후에도 구성된 사항이 지속되도록 설정한다.
- 이를 통해 시스템 관리자는 시스템 자원 할당, 우선 순위 지정, 거부, 관리, 모니터링과 같은 세밀한 제어가 가능하며, 하드웨어 자원을 사용자 간 신속하게 분배하여 전체적인 효율성을 향상시킬 수 있다.

## 유니온 마운트 (Union Mount)

- 이미지의 기반 개념이 된 유니온 마운트 (Union Mount) 란 무엇일까?
- 여러 개의 폴더를 동시에 특정 폴더에 마운트 하는 동작을 유니온 마운트 라고 한다. 리눅스에서는 AUFS(Advanced multi layered Unification File System) 과 OverlayFS, device mapper 등이 구현체로써 존재한다.
- 이 중 도커는 현재 OverlayFS2를 기반으로 작동하는데, Overlay의 작동 방식에 대해 간략하게 알아보자.
    - 도커 컨테이너나 다른 OS에서는 동작하지 않으니, 리눅스나 WSL2에서 시도하길 권장한다.
    1. `apt-get`을 업데이트하고, 디렉터리를 트리 구조로 보기위한 tree를 설치
        
        ```bash
        sudo apt-get update && sudo apt-get upgrade && sudo apt-get install tree
        ```
        
    2. 아래 명령어를 차례대로 입력해보자.
        
        ```bash
        mkdir overlayfs; cd overlayfs
        mkdir container image1 image2 merge work
        touch image1/a image1/b image2/c
        sudo mount -t overlay overlay -o lowerdir=image2:image1,upperdir=container,workdir=work merge
        ```
        
        아래 구조가 보이면 성공이다.
        
        ```bash
        $ tree . -I work
        ```
        <img src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/52cbba65-4101-4096-8a57-7f7b0dcbf77c" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>
        
        - merge에는 이미지들의 파일들이 합쳐서 보이고, container는 최상위 레이어, image2는 최하위 레이어 이다.
        - 모든 작업은 merge에서 이뤄진다.
    3. a를 삭제하고 d를 추가한 후, 디렉터리 구조가 어떻게 되는지 확인해보자.
        
        
        ```bash
        rm ./merge/a
        touch ./merge/d
        tree . -I work
        ```
        
        <img src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/37c734ff-047f-4241-85e7-2363c58d95b3" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>
        
    - 3번 구조에서 볼 수 있다시피, OverlayFS에서는 파일을 수정한다고 해도 다른 레이어의 파일에서는 아무런 영향을 끼치지 않는다.
    - 마치 깃 처럼 가장 상위 레이어에 변경 사항이 쌓이게 된다.
    - container 폴더에 존재하는 a는 Character device 라는 특수 파일로, 해당 파일이 삭제되었다는 것을 뜻한다.

## 루트 디렉터리 격리 (Root Directory Isolation)

- 컨테이너는 호스트의 파일 시스템이 아닌 별도의 실행 환경을 가진다. 이 원리는 무엇일까?
- `chroot` 와 같은 시스템 콜을 통하여, 분리된 프로세스가 바라보는 루트 디렉터리를 호스트 파일 시스템의 특정한 디렉터리로 변경하는 것이 가능하다.
    - 실제로 도커 내부에서는 `chroot`를 사용하지는 않는다. 원리는 `chroot`와 비슷하다.
- 유니온 마운트, 네임스페이스, cgroup등 컨테이너를 구현하기 위한 여러가지 기능이 있지만, 가장 기본이 되는 것은 `chroot`와 같이 프로스세가 실행되는 루트를 변경하는 일이다.
    
    ```bash
    chroot [-G group[,group ...]] [-g group] [-u user] newroot [command [arg ...]]
    ```
    
    ![chroot](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/2b81f2d9-e642-4bd7-8d26-28c98fa5e71c)

- 위 그림과 같이 `chroot` 명령어를 적용하면, K 프로세스에서는 A 폴더가 루트가 되어 그 위에 있는 경로를 표현할 방법 자체가 없게 된다.
- 이처럼 루트 디렉터리를 변경함으로써, 특정 프로세스가 상위 디렉터리에 접근할 수 없도록 격리 시킬 수 있다.
- VM이나 네이티브 리눅스를 구동시킬 수 있는 환경이라면, [링크](https://www.44bits.io/ko/post/change-root-directory-by-using-chroot#chroot-%EC%9E%85%EB%AC%B8-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%A3%A8%ED%8A%B8%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0) 를 따라가 실습을 해볼 수 있다.

## 리눅스 네임스페이스 (Linux Namespace)

- 특정 프로세스의 리눅스 리소스 접근을 제어하기 위해 사용되는 기능이다. 각 리소스 별로 IPC 네임스페이스, 마운트 네임스페이스, 네트워크 네임스페이스, PID 네임스페이스, 사용자 네임스페이스, UTS 네임스페이스, 컨트롤 그룹 네임스페이스 등으로 나뉜다.
- 시스템 상에서 실행되는 프로세스들은 기본적으로 init 프로세스의 네임스페이스를 공유하지만,  시스템 콜이나 `unshare` 명령어를 사용해 리소스 별로 네임스페이스를 분리하는 것이 가능하다.
- PID 네임스페이스
    - 프로세스의 ID를 격리할 수 있는 네임스페이스
    - PID는 init 프로세스 (PID=1) 를 시작하며 그 외 모든 프로세스는 항상 1보다 큰 PID를 부여받는다.
    - PID 네임스페이스를 분리하면 PID가 1부터 다시 시작한다.
    - 이 경우, 해당 프로세스는 디폴트 네임스페이스와 분리된 네임스페이스에 동시에 속하게 된다.
    - → 분리된 네임스페이스에서는 PID가 1부터 시작되지만, 디폴트 네임스페이스에서는 다른 값이다.
    - 즉, 하나의 프로세스가 다른 네임스페이스에 동시에 존재할 수 있으며, 이때 각각의 네임스페이스에서 바라보는 PID값은 서로 다르나, 바라보는 프로세스 자체는 같다.
- 네트워크 네임스페이스
    - 프로세스의 네트워크 환경을 분리할 수 있는 네임스페이스
    - 네트워크 환경을 분리하면, 네임스페이스에 속한 프로세스들에 새로운 IP를 부여하거나 네트워크 인터페이스를 추가할 수 있다.
- UTS 네임스페이스
    - 호스트 네임과 NIS 도메인 네임을 격리하는 네임스페이스
        - 호스트 네임 : 네트워크 상에서 고유한 이름을 나타냄
        
        <img src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d672b8ca-91c6-4b1e-b095-54be7651d4bc" style="display: block; margin-left: auto; margin-right: auto; width: 50%;"/>

        hostname을 통한 현재 시스템의 호스트 네임 조회
        
    - 네트워크 네임스페이스와 함께 네트워크를 격리하는 용도로 사용한다.
    - VM이나 네이티브 리눅스를 구동시킬 수 있는 환경이라면, [링크](https://www.44bits.io/ko/post/container-network-1-uts-namespace)에 있는 실습을 해볼 수 있다.


## Reference

[컨테이너란? 리눅스의 프로세스 격리 기능](https://www.44bits.io/ko/keyword/linux-container#아마존-ecsamazon-ecs)

[컨테이너 기초 - chroot를 사용한 프로세스의 루트 디렉터리 격리](https://www.44bits.io/ko/post/change-root-directory-by-using-chroot)

[도커(Docker) 컨테이너는 가상 머신인가요? 프로세스인가요?](https://www.44bits.io/ko/post/is-docker-container-a-virtual-machine-or-a-process)

[도커(Docker) 입문편: 컨테이너 기초부터 서버 배포까지](https://www.44bits.io/ko/post/easy-deploy-with-docker)

[도커 이미지 빌드와 Dockerfile 기초](https://www.44bits.io/ko/post/building-docker-image-basic-commit-diff-and-dockerfile)

[왜 굳이 도커(컨테이너)를 써야 하나요? - 컨테이너를 사용해야 하는 이유](https://www.44bits.io/ko/post/why-should-i-use-docker-container)

[도커(Docker) 컴포즈를 활용하여 완벽한 개발 환경 구성하기](https://www.44bits.io/ko/post/almost-perfect-development-environment-with-docker-and-docker-compose)

[Docker Internals -- Docker Saigon](http://docker-saigon.github.io/post/Docker-Internals/)