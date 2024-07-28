---
title: "[혼공S] 4주차 - 테이블과 뷰"
excerpt: "혼자 공부하는 SQL Chapter 05"

categories:
    - 혼공학습단
tags:
    - [혼공학습단, Database, SQL]

date: 2024-07-28
last_modified_at: 2024-07-28

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# Introduction

![IMG_1907](https://github.com/user-attachments/assets/8aae0af0-1c66-40e7-a9c2-d2d927d2b279)

50% 완주했다고 기프티콘을 또 보내주셨다... 공부도 하고 간식도 먹고 응원도 받을 수 있는 프로그램이 있다??? 그것은 바로 혼공학습단. 이렇게 퍼주시면 다음 기수도 할 수 밖에 없겠죠?? 

오늘 공부할 내용은 **테이블과 뷰** 이다. 이 책에서도 그렇고 보통 엑셀에 많이 비유하는 것 같다. 테이블은 엑실의 시트와 상당히 비슷한 구조이고, 뷰는 단어 뜻 그대로 보여지는 가상의 테이블이다. 즉, 앞에서 배운 SELECT로 확인되는 것이 뷰라고 보면 간편하다. 설계 내용도 조금 섞여있는데, 데이터베이스 설계는 직접 해봐야 느는 것 같다. 정규화 같이 관련된 이론들이 꽤나 복잡하기도 하고... 그래서 이번 챕터는 실습과 정리 위주로 진행하려고 한다.


# 테이블 생성하기

책 예제에 있는 SQL 문을 모아서 실행시켜보고, 하나씩 뜯어보자.

```sql
DROP DATABASE IF EXISTS naver_db;
CREATE DATABASE naver_db;
USE naver_db;
DROP TABLE IF EXISTS member;
CREATE TABLE member (
    mem_id      CHAR(8) NOT NULL PRIMARY KEY,
    mem_name    VARCHAR(10) NOT NULL,
    mem_number 	TINYINT NOT NULL,
    addr        CHAR(2) NOT NULL,
    phone1      CHAR(3) NULL,
    phone2      CHAR(8) NULL,
    height      TINYINT UNSIGNED NULL,
    debut_date  DATE NULL
);

DROP TABLE IF EXISTS buy;
CREATE TABLE buy (
    num         INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    mem_id      CHAR(8) NOT NULL,
    prod_name   CHAR(6) NOT NULL,
    group_name  CHAR(4) NULL,
    price       INT UNSIGNED NOT NULL,
    amount      SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY(mem_id) REFERENCES member(mem_id)
);


INSERT INTO member VALUES('TNC', '트와이스', 9, '서울', '02',
	'11111111', 167, '2015-10-19');
INSERT INTO member VALUES('BLK', '블랙핑크', 4, '경남' , '055',
	'22222222', 163, '2016-8-8');
INSERT INTO member VALUES('WMN', '여자친구', 6, '경기', '031',
	'33333333', 166, '2015-1-15');
    
INSERT INTO buy VALUES(NULL, 'BLK', '지갑', NULL, 30, 2);
INSERT INTO buy VALUES(NULL, 'BLK', '맥북프로', '디지털', 1000, 1);
INSERT INTO buy VALUES(NULL, 'APN', '아이폰', '디지털', 200, 1);
```

데이터 타입은 지난주에 열심히 공부했으니까 전부 패스한다. `AUTO_INCREMENT NOT NULL PRIMARY KEY` 를 먼저 보자. `AUTO_INCREMENT`는 데이터가 삽입될 때마다 자동으로 하나씩 값을 올린다는 의미이다. 즉, 값을 따로 지정하지 않아도 DBMS가 알아서 데이터가 삽입되는 시점에 하나씩 값을 올려 저장한다. `NOT NULL`은 해당 값이 NULL이어서는 안된다는 뜻이다. NULL을 넣으려고 할 경우 오류가 발생한다. `PRIMARY KEY`는 해당 속성을 PK로 지정한다는 의미이다. 뒤에 나오겠지만 PK는 테이블의 고유성을 보장하는 제약 조건이고, 하나의 테이블에 하나만 존재할 수 있는 행의 식별자 역할을 하기 때문에 자동으로 NOT NULL로 지정된다.

`FOREIGN KEY(mem_id) REFERENCES member(mem_id)`의 경우, 이 테이블의 `mem_id` 열을 `member` 테이블의 `mem_id` 열과 외래 키 관계로 연결한다는 의미이다. 즉 이 테이블의 `mem_id`는 꼭 `member` 테이블의 `mem_id`에도 값이 있어야 한다는 뜻이다. 그래서 위 SQL문을 실행시켜보면 맨 마지막 INSERT에서 오류가 발생한다. `APN`이라는 `mem_id`는 `member` 테이블에 존재하지 않기 때문이다.

SELECT 문으로 확인해보면 아래와 같이 나머지 데이터는 잘 들어가 있는 것을 확인할 수 있다.

<img width="502" alt="SCR-20240728-opqb" src="https://github.com/user-attachments/assets/053dd9c7-522b-4ecf-8ba0-fd70bdbce682">

<img width="494" alt="SCR-20240728-oprk" src="https://github.com/user-attachments/assets/773fd323-2d73-47f6-8143-a407da68073e">

# 제약조건(Constraint)

앞에서 _PK는 테이블의 고유성을 보장하는 제약 조건_ 이라고 언급했었는데, 제약 조건이 무엇인지 알아보자. 

제약조건(Constraint)은 데이터의 무결성을 지키기 위해 제한하는 조건이다. 즉, 데이터에 결함이 없음을 보장하기 위한 조건으로, 데이터가 중복되지 않는다거나 일정 조건을 따르는 등 규칙에 맞는지 검사할 수 있다. PK는 중복되지 않고 비어있지 않는다는 제약조건을 가지기 때문에, 실수로 중복된 아이디를 넣으려고 해도 입력 조차 불가능하다.

앞에서 `FOREIGN KEY(mem_id) REFERENCES member(mem_id)`와 같이 두 테이블을 연결하는 예제가 있었는데, 이런 외래 키에도 제약조건이 존재한다. 외래 키(FK)가 설정된 열은 보통 다른 테이블의 기본 키(PK)와 연결되기 때문에, 이 FK 열은 NULL이 될 수 없다. 그렇다고 FK가 반드시 NULL이 될 수 없는 것은 아니다. PK 말고도 고유 키 (UNIQUE KEY) 에 연결되는 경우도 있기 때문이다. 고유 키는 고유성을 가지지만 NULL값을 허용하기에, FK가 NULL이 될 수 있다. 잘 생각해보면 FK가 고유성을 가지는 열과 연결되는 것은 당연하다. 조인 하는 시점에 열끼리 연결되어야 하는데, FK가 고유성을 가지지 않는 열과 연결되어 있다면 어떤 열끼리 이어야 할 지 모호해지기 때문이다.

앞 문단에서 고유 키(UNIQUE KEY)에 대해 잠깐 언급했는데, 이 UK는 중복되지 않는 유일한 값을 입력해야 하는 조건이다. PK와 거의 비슷하지만, NULL을 허용한다. 또한, UK는 한 테이블에서 여러 개를 지정해도 상관 없다.

체크(Check)라는 제약조건도 있다. 입력되는 데이터가 특정 조건에 맞는지 검사한다. 앞에서 `member` 테이블에 `height`라는 열을 정의했는데, `height TINYINT UNSIGNED NULL CHECK (height >= 100)` 과 같이 정의한다면 100 미만의 값은 `height`에 입력할 수 없게된다. `CHECK (height IN ('150', '160'))` 과 같이 IN을 활용하는 것도 가능하다. 이런 경우는 `height`에 150이나 160만 입력 가능하다.

마지막으로 기본값 정의(DEFAULT)는 자동으로 입력될 값을 미리 지정해놓는 방법이다. 값을 입력할 때 해당 열을 비워뒀다면, 자동으로 DEFAULT로 지정된 값을 채워 넣는다. INSERT할 때 VALUES에 `default`라고 적으면 해당 열은 자동으로 기본 값으로 채워진다.

# 가상의 테이블: 뷰(View)

뷰(View)는 데이터베이스 개체 중 하나이다. 목차에서 **가상의 테이블** 이라고 언급했듯, 뷰는 실체가 없다. SELECT 문의 결과에 별명을 짓는다고 생각하면 편하다. 이는 쿼리의 재사용성을 늘리기 위한 기능인데, 엄청나게 복잡한 SELECT문을 작성하고 그것을 뷰로 만들어버리면 복잡한 쿼리를 단순하게 만들 수 있고, 데이터베이스의 보안성과 관리 효율성을 높이는 데 도움을 준다.

## 뷰의 특징

1. **데이터 추상화**: 뷰는 실제 데이터베이스 테이블을 감추고, 사용자에게 필요한 데이터만을 보여준다. 이를 통해 데이터베이스 구조의 복잡성을 숨길 수 있다.
2. **재사용성**: 자주 사용되는 복잡한 쿼리를 뷰로 정의해 두면, 이후에는 간단한 SELECT 문으로 뷰를 호출하여 동일한 결과를 얻을 수 있다.
3. **보안**: 뷰를 사용하면 민감한 데이터에 대한 접근을 제한할 수 있다. 예를 들어, 특정 컬럼을 포함하지 않은 뷰를 정의함으로써 민감한 정보를 감출 수 있다.
4. **데이터 일관성**: 뷰를 사용하면 여러 테이블에 걸친 데이터를 일관성 있게 조회할 수 있다. 

## 뷰 생성

뷰는 CREATE VIEW 문을 사용하여 생성할 수 있다. 예를 들어, `member` 테이블과 `buy` 테이블에서 특정 정보를 조회하는 뷰를 생성해보자.

```sql
CREATE VIEW member_buy_view AS
SELECT 
    m.mem_name, 
    m.addr, 
    b.prod_name, 
    b.price
FROM 
    member m
JOIN 
    buy b 
ON 
    m.mem_id = b.mem_id;
```

이 뷰는 `member` 테이블과 `buy` 테이블을 조인하여 각 멤버가 구매한 상품의 정보를 조회하는 역할을 한다. 이제 이 뷰를 간단한 SELECT 문으로 호출할 수 있다. DESCRIBE 문을 통해 정의된 뷰의 구조 또한 확인할 수 있다.

```sql
SELECT * FROM member_buy_view;
DESCRIBE member_buy_view;
```

## 뷰 수정

뷰를 수정하려면 `CREATE OR REPLACE VIEW` 문을 사용하면 된다. 기존 뷰를 대체할 수 있으며, 새로운 정의를 제공할 수 있다.

```sql
CREATE OR REPLACE VIEW member_buy_view AS
SELECT 
    m.mem_name, 
    m.phone1, 
    b.prod_name, 
    b.price
FROM 
    member m
JOIN 
    buy b 
ON 
    m.mem_id = b.mem_id;
```

이제 `member_buy_view` 뷰는 `addr` 대신 `phone1` 정보를 포함하게 된다.

## 뷰 삭제

뷰가 더 이상 필요하지 않다면, `DROP VIEW` 문을 사용하여 삭제할 수 있다.

```sql
DROP VIEW IF EXISTS member_buy_view;
```

이 명령을 실행하면 `member_buy_view` 뷰가 데이터베이스에서 삭제된다.

## 확인 문제

<img width="586" alt="image" src="https://github.com/user-attachments/assets/2c72d927-3253-4f7b-82d4-3527e6254a9e">

정답은 2번 `CREATE OR REPLACE VIEW` 이다. 기존 뷰가 없으면 생성하고, 있으면 덮어쓰는 구문이다.