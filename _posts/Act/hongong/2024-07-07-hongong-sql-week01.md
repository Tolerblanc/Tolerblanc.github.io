---
title: "[혼공S] 1주차 - DBMS 설치, 데이터베이스 개체"
excerpt: "혼자 공부하는 SQL Chapter 01 - 02"

categories:
    - 혼공학습단
tags:
    - [혼공학습단, Database, SQL]

date: 2024-07-07
last_modified_at: 2024-07-07

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>


## Introduction

미친듯한 게으름과 바쁜 일정 덕에 거의 두 달만에 포스팅을 하는 것 같다. 정신 차려보니 2024년이 벌써 절반이 지나갔는데, 이에 대해서는 따로 회고록을 써야겠다.
각설하고, 혼공학습단 12기에 참여하게 되었다. 작년에 데이터베이스 수업을 들었는데, 따로 실습은 안해본 터라 실습을 곁들여 복습하기 위해 **혼자 공부하는 SQL** 책을 골랐다. ORM만 쓰다보니 로우쿼리를 잘 못짜기도 하고, 정처기랑 SQLD도 따놓으려고 하기 때문에 어찌됐던 SQL은 꼭 공부해놔야 한다.
예상외로 일정이 바빠진 터라 쉽지 않겠지만, 반드시 추가미션까지 꽉꽉 채워서 완주해야겠다.

## M1 Mac에 MySQL과 Workbench 설치하기 

나는 맥 유저이기 때문에, 아래와 같은 프로세스를 따를 것이다. 윈도우 유저는 책에 친절하게 설명되어 있으니, 그걸 보도록 하자.
[Homebrew](https://brew.sh/) 가 설치되어 있다는 전제하에, 아래 명령을 실행해보자.

```bash
brew install mysql
mysql -V
sudo mysql.server start
```

아래와 같이 확인된다면 성공!

<img width="567" alt="SCR-20240707-rzqh" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1d698b0b-e591-4a42-a2af-a134dc19701b">

Workbench는 [공식 사이트](https://dev.mysql.com/downloads/workbench/) 에서 OS에 맞게 설치하면 된다. Workbench를 켜보면 아래와 같이 로컬 인스턴스가 하나 존재하는 것을 볼 수 있다. 바로 위에서 MySQL을 설치하고, 서버까지 켜두었기 때문이다. 혹시 없다면, 맨 처음부터 다시 해보자.

<img width="1019" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/6f2d1b84-7900-4d5a-8ae9-e1dac8cfe8f6">

Local instance 3306 우클릭 - 'Edit Connections...' - Password 에 `Store in keychain`을 눌러 root 계정의 비밀번호를 저장하고, 오른쪽 아래 `Test connection`을 통해 연결이 잘 되는지 확인해보자.

<img width="639" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/ac444ba2-e805-4bd1-b42f-05e6adc679e6">

Query 칸에 `SHOW DATABASES;` 를 입력하고 번개 버튼을 눌렀을 때, 이렇게 결과가 나오면 세팅 끝!

### 비밀번호를 잊어버렸다면?

멍청하게 root 계정의 비밀번호를 잊어버려서, mysql을 켤 수 없는 상황이 되었다... 아래와 같은 방법으로 재설정할 수 있다.

1. 실행 중인 mysql 서버를 내린다.
    ```bash
    brew services stop mysql
    ```

2. 아래 명령어를 입력하여, 안전 모드로 MySQL 서버를 켜 인증을 무시한다.
    ```bash
    mysqld_safe --skip-grant-tables &
    ```

3. 새 터미널을 켜고, 아래 명령어를 입력한다.
    ```bash
    mysql -u root # root 계정으로 MySQL 서버 접속 
    FLUSH PRIVILEGES;
    ALTER USER 'root'@'localhost' IDENTIFIED BY '새로운비밀번호';
    ```

4. 안전 모드 종료 후 재시작
    ```bash
    brew services start mysql
    ```

비밀번호를 까먹어서 시간 버리는 일 없도록 하자...

## 바로 실습해보자

DBMS인 MySQL을 설치했으니, 데이터베이스를 만들고 쿼리까지 날려보자.

<img width="215" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/fc3b5bd0-b640-4759-8029-5218f54996a8">

Workbench를 사용하면, 직접 쿼리문을 작성하지 않아도 아주 간편하게 스키마를 만들 수 있다. 빈 곳을 아무데나 우클릭하고 `Create Schema...` 를 누르면 된다. 책의 예제 처럼 `shop_db` 라는 이름으로 만들었다.

스키마 안에는 테이블이 존재한다. 스키마 만들때랑 똑같이 Tables를 우클릭하여 `Create Table...` 을 누르면 된다.

<img width="574" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/bdb2960b-b28f-461b-8d92-2ef26660f7d1">

책의 예제처럼 3개의 Column을 지닌 테이블을 만들었다. Apply를 클릭하면 만들어진다. 해당 테이블을 생성하는 SQL문도 확인할 수 있다.

```sql
CREATE TABLE `shop_db`.`member` (
  `member_id` CHAR(8) NOT NULL,
  `member_name` CHAR(5) NOT NULL,
  `member_addr` CHAR(20) NULL,
  PRIMARY KEY (`member_id`));
```

<img width="524" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/e15feeda-284b-472f-9b60-20d6bc5560f0">

똑같이 Product 테이블도 만들어주었다. 귀찮으니 데이터들은 쿼리문으로 넣어주자. 대충 아래 쿼리문을 복사해서 실행하면 된다.

```sql
INSERT INTO `shop_db`.`member` (`member_id`, `member_name`, `member_addr`) VALUES ('tess', '나훈아', '경기 부천시 중동');
INSERT INTO `shop_db`.`member` (`member_id`, `member_name`, `member_addr`) VALUES ('iyou', '아이유', '인천 남구 주안동');
INSERT INTO `shop_db`.`member` (`member_id`, `member_name`, `member_addr`) VALUES ('jyp', '박진영', '경기 고양시 장항동');
INSERT INTO `shop_db`.`member` (`member_id`, `member_name`, `member_addr`) VALUES ('hero', '임영웅', '서울 은평구 증산동');
INSERT INTO `shop_db`.`product` (`product_name`, `cost`, `make_date`, `company`, `amount`) VALUES ('바나나', '1500', '2021-07-01', '델몬트', '17');
INSERT INTO `shop_db`.`product` (`product_name`, `cost`, `make_date`, `company`, `amount`) VALUES ('삼각김밥', '800', '2023-09-01', 'CJ', '22');
INSERT INTO `shop_db`.`product` (`product_name`, `cost`, `make_date`, `company`, `amount`) VALUES ('카스', '2500', '2022-03-01', 'OB', '3');
```

쿼리문을 통해 원하는 데이터를 가져올 수 있다. 위 쿼리문을 돌렸다면 각 테이블에 데이터가 들어갔을 것이고, `SELECT * FROM member` 쿼리를 실행하면 이런 결과가 나와야 한다.

<img width="363" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/baaecba3-c8de-4659-8dbc-8f25e0c22946">

SELECT 문은 뒤에 WHERE 조건절을 받을 수 있다. 일반적인 프로그래밍 언어의 IF 문이라고 보면 간단하다. 위 테이블에서 아이유의 정보만 가져오려면 아래와 같은 쿼리를 작성하면 된다.

<img width="485" alt="image" src="https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/f054068a-3082-4abe-b768-607ae41337bc">

## 데이터베이스 개체 

위에서 실습한 것 처럼, 데이터베이스의 핵심 요소는 테이블이다. 데이터가 담기기 때문이다. 하지만, 담은 데이터를 어떻게 가져와 확인하는지 또한 중요한 요소이다. 이와 관련된 **인덱스**, **뷰**, **스토어드 프로시저**, **트리거**, **커서** 등의 개체도 필요하다. 이에 대해 간략히 정리하고 글을 마치고자 한다.

### 인덱스 (Index)

인덱스는 데이터베이스 성능 최적화를 위한 중요한 도구이다. 인덱스는 테이블의 특정 열에 대한 데이터를 빠르게 검색할 수 있도록 도와준다. 이는 책의 목차와 유사하다. 책의 목차를 통해 특정 페이지를 빠르게 찾을 수 있듯이, 인덱스를 통해 특정 데이터를 빠르게 찾을 수 있다.

- 구조: 일반적으로 B-트리 구조를 사용하여 데이터의 삽입, 삭제, 검색 시 빠른 속도를 보장한다.
- 유형: 클러스터형 인덱스와 비클러스터형 인덱스로 나뉜다. 클러스터형 인덱스는 실제 데이터가 정렬되어 저장되며, 비클러스터형 인덱스는 별도의 인덱스 테이블을 사용한다.
- 장점: 검색 성능 향상, 쿼리 속도 개선
- 단점: 데이터 삽입, 업데이트, 삭제 시 오버헤드 발생, 저장 공간 추가 필요

### 뷰 (View)

뷰는 하나 이상의 테이블로부터 생성된 가상의 테이블이다. 실제 데이터를 저장하지 않고, 테이블의 데이터에 대한 쿼리 결과를 저장한다. 이를 통해 복잡한 쿼리를 단순화하고, 보안 목적으로 사용할 수 있다.

- 생성: SELECT 문을 사용하여 생성되며, 데이터베이스에서 뷰를 사용할 수 있도록 CREATE VIEW 명령을 사용한다.
- 장점: 데이터 접근 제어, 쿼리 단순화, 데이터 일관성 유지.
- 단점: 뷰의 성능은 기본 테이블의 성능에 의존하며, 자주 변경되는 데이터를 포함한 뷰는 성능 저하를 일으킬 수 있다.

### 스토어드 프로시저 (Stored Procedure)

스토어드 프로시저는 데이터베이스에 저장된 하나 이상의 SQL 문으로 이루어진 코드 블록이다. 이를 통해 반복적인 작업을 자동화하고, 복잡한 비즈니스 로직을 데이터베이스 수준에서 처리할 수 있다.

- 특징: 매개변수를 받아들이고, 실행 결과를 반환할 수 있다. 데이터베이스 서버에서 실행되므로 네트워크 트래픽을 줄일 수 있다.
- 장점: 성능 향상, 코드 재사용성 증가, 보안 강화.
- 단점: 디버깅이 어렵고, 데이터베이스 종속성이 높아진다.

### 트리거 (Trigger)

트리거는 특정 이벤트가 발생할 때 자동으로 실행되는 SQL 코드 블록이다. 데이터의 삽입, 업데이트, 삭제 등의 이벤트에 반응하여 실행된다. 이를 통해 데이터 무결성을 유지하고, 비즈니스 규칙을 강제할 수 있다.

- 유형: BEFORE 트리거와 AFTER 트리거로 나뉘며, 이벤트 발생 전과 후에 실행된다.
- 장점: 데이터 무결성 유지, 자동화된 데이터 검증 및 처리.
- 단점: 트리거의 잘못된 사용은 복잡성을 증가시키고, 성능 저하를 일으킬 수 있다.

### 커서 (Cursor)

커서는 SQL 쿼리 결과 집합을 한 행씩 처리할 수 있도록 해주는 데이터베이스 객체이다. 이는 특히 대량의 데이터를 순차적으로 처리해야 하는 상황에서 유용하다.

- 작동 방식: 쿼리 실행 후, 결과 집합을 커서에 저장하고, FETCH 명령을 통해 한 행씩 데이터를 가져온다.
- 장점: 복잡한 데이터 처리 작업에 유용, 개별 행에 대한 세밀한 제어 가능.
- 단점: 성능 저하 가능성, 코드 복잡성 증가.
