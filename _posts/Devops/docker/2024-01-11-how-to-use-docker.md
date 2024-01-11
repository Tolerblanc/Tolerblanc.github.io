---
title: "도커를 사용하기 위한 간략한 개념 및 명령어 정리"
excerpt: "도커 찍먹을 위한 문서"

categories:
    - Docker
tags:
    - [Docker, Container]

date: 2024-01-11
last_modified_at: 2024-01-11

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## 도커를 사용하기 위한 간략한 개념 정리

![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/45f6a969-7f79-484e-bec3-fb7fb4c35b27)

- 각 소프트웨어를 격리된 공간(컨테이너)내에서 실행하도록 도와주는 소프트웨어
- 가상 머신 (VM; Virtual Machine)과는 달리, OS가 통째로 올라가지 않음
- 본래 컨테이너는 리눅스 커널의 기능이지만, 도커 라는 컨테이너 런타임은 가상화 기술을 통해 리눅스 커널을 가상화 하고, 그 위에 도커 엔진을 올려 작동함
- 가상 머신과 비교하여 훨씬 가볍게, 독립된 샌드 박스 환경을 만들어 줄 수 있음
- 사용도 간편하고, 의존성 문제를 쉽게 해결해줄 수 있기 때문에 많이 쓰임

## docker ps, images, pull

- 앱스토어에서 프로그램을 다운로드 받아 프로세스를 실행 하는 것과 같이,
- `docker hub`에서 `image`를 `pull` 받아 컨테이너를 `run` 한다.
- 이미지는 일단 특정 컨테이너에 대한 스냅샷 이라고 생각하자.
- `docker images` 를 통해 로컬에 저장된 이미지를 확인할 수 있다.
- 각종 이미지들이 저장되어 있는 클라우드 저장소를 `docker hub` 라고 한다. → docker에서 직접 운영한다.
- `docker pull [OPTIONS] NAME[:TAG|@DIGEST]` 를 통해 docker hub로 부터 이미지를 가져올 수 있다.
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/46bebc96-6fff-4ca0-9e31-e907732aa3ad)
    
- `docker ps [OPTIONS]` 를 통해 현재 컨테이너 목록을 확인할 수 있다.
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/78e1bfb8-319b-4b68-9b93-bc5bdb53f14f)
    

## docker run

- 도커는 격리된 컨테이너에서 프로세스를 실행한다.
- 실행되는 컨테이너 프로세스는 호스트와 분리된 자체 파일시스템, 자체 네트워킹 및 자체 격리된 프로세스 트리를 가지고 있다.
- `docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]` 를 통해 정의된 이미지를 컨테이너로 실행시킬 수 있다.
- 이 명령의 옵션은 기존 이미지의 설정을 덮어씌울 수 있다.
- 엄청난 양의 옵션이 있으니, 링크에서 확인해보자.
    
    [Docker run reference](https://docs.docker.com/engine/reference/run/#overriding-dockerfile-image-defaults)
    
- `-d` 옵션을 통해 분리된(detached) 컨테이너를 백그라운드에서 돌릴 지 선택할 수 있다
- `—-name` 옵션을 통해 컨테이너의 이름을 지정할 수 있다.
- `—restart` 옵션을 통해 컨테이너의 재시작 정책을 설정할 수 있다.
- `-p hostPort:containerPort` 를 통해 호스트와 컨테이너의 포트를 연결할 수 있다.
- `-v [host-src:]container-dest[:<options>]` 를 통해 호스트와 컨테이너의 파일 시스템을 연결할 수 있다.
- 쉘과 같은 인터렉티브 환경을 위해서는 꼭 `-it` 옵션을 줘야한다.
    - `-i` : 연결(attached)되지 않은 상태에서도 STDIN 열어두기
    - `-t` : 의사tty(pseudo TeleTYpewriter) 할당

## docker start, stop, logs

- `docker start [OPTIONS] CONTAINER [CONTAINER...]` 를 통해 하나 이상의 종료된 컨테이너를 동작시킬 수 있다.
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/38d6f04a-55f3-4a29-81bb-a5b8f6818a05)
    
- `docker stop [OPTIONS] CONTAINER [CONTAINER...]` 를 통해 하나 이상의 실행중인 컨테이너를 중지시킬 수 있다.
- 컨테이너는 내부에 실행중인 프로세스가 없다면 바로 종료된다.
- `docker logs [OPTIONS] CONTAINER` 를 통해, 실행중인 컨테이너의 로그를 받아볼 수 있다.
    
    ![-f 옵션을 통해 로그를 실시간으로 찍어낼 수 있다.](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/42de0513-2823-43a1-b588-0677ce2e7538)
    
    -f 옵션을 통해 로그를 실시간으로 찍어낼 수 있다.
    

## docker exec

- `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/375371f7-36f0-4bc3-b22d-a4e0a055d708)
    
- 동작중인 컨테이너(=PID 1이 살아있음) 내부에서 명령어를 실행한다.
- 반드시 실행파일 형태의 명령어가 들어가야 하며, 체인이나 따옴표로 여러 명령을 묶어 넣는 것은 동작하지 않는다.
    
    → `“echo a && echo b”` 는 동작하지 않지만, `sh -c “echo a && echo b”` 는 동작한다.
    

## docker rm, rmi

- `docker rm [OPTIONS] CONTAINER [CONTAINER...]` 를 통해 하나 이상의 컨테이너를 삭제할 수 있다.
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/ccbb9dd6-aad0-46ae-ac62-e13f7826b222)
    
- `docker rmi [OPTIONS] IMAGE [IMAGE...]` 를 통해 로컬에 저장된 하나 이상의 이미지를 삭제할 수 있다.
    
    ![Untitled](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b902b29a-f7ff-4f9d-805b-a6dfa7bbc9e8)

## Reference

<https://docs.docker.com/engine/reference/commandline/cli>

<https://opentutorials.org/course/4781>