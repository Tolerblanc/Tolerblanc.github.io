---
title: "[혼공S] 2주차 - SQL 기본 문법"
excerpt: "혼자 공부하는 SQL Chapter 03"

categories:
    - 혼공학습단
tags:
    - [혼공학습단, Database, SQL]

date: 2024-07-14
last_modified_at: 2024-07-14

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>


## Introduction

벌써 2주차의 마지막 날이 되었다. 1주차 글이 운좋게도 '우수 혼공족'에 뽑혀서 아아 기프티콘을 받게 되었다. 

![IMG_1892](https://github.com/user-attachments/assets/cc035591-db24-44ab-893b-c3a19bea0dc2)

하하 제가 아메리카노에 미쳐사는거 또 어떻게 아시고... 이번주도 받을 수 있게 달려봅시다!

이번주는 기본적인 SELECT, INSERT, UPDATE, DELETE에 대해 다룬다. 데이터베이스의 CRUD 작업인 셈이다.

## 실습용 데이터베이스 구축

일단 바로 아래 쿼리를 실행시키자. 출판사 자료실에서 가져온거니까 안심하세요.

```sql
DROP DATABASE IF EXISTS market_db; -- 만약 market_db가 존재하면 우선 삭제한다.
CREATE DATABASE market_db;

USE market_db;
CREATE TABLE member -- 회원 테이블
( mem_id  		CHAR(8) NOT NULL PRIMARY KEY, -- 사용자 아이디(PK)
  mem_name    	VARCHAR(10) NOT NULL, -- 이름
  mem_number    INT NOT NULL,  -- 인원수
  addr	  		CHAR(2) NOT NULL, -- 지역(경기,서울,경남 식으로 2글자만입력)
  phone1		CHAR(3), -- 연락처의 국번(02, 031, 055 등)
  phone2		CHAR(8), -- 연락처의 나머지 전화번호(하이픈제외)
  height    	SMALLINT,  -- 평균 키
  debut_date	DATE  -- 데뷔 일자
);
CREATE TABLE buy -- 구매 테이블
(  num 		INT AUTO_INCREMENT NOT NULL PRIMARY KEY, -- 순번(PK)
   mem_id  	CHAR(8) NOT NULL, -- 아이디(FK)
   prod_name 	CHAR(6) NOT NULL, --  제품이름
   group_name 	CHAR(4)  , -- 분류
   price     	INT  NOT NULL, -- 가격
   amount    	SMALLINT  NOT NULL, -- 수량
   FOREIGN KEY (mem_id) REFERENCES member(mem_id)
);

INSERT INTO member VALUES('TWC', '트와이스', 9, '서울', '02', '11111111', 167, '2015.10.19');
INSERT INTO member VALUES('BLK', '블랙핑크', 4, '경남', '055', '22222222', 163, '2016.08.08');
INSERT INTO member VALUES('WMN', '여자친구', 6, '경기', '031', '33333333', 166, '2015.01.15');
INSERT INTO member VALUES('OMY', '오마이걸', 7, '서울', NULL, NULL, 160, '2015.04.21');
INSERT INTO member VALUES('GRL', '소녀시대', 8, '서울', '02', '44444444', 168, '2007.08.02');
INSERT INTO member VALUES('ITZ', '잇지', 5, '경남', NULL, NULL, 167, '2019.02.12');
INSERT INTO member VALUES('RED', '레드벨벳', 4, '경북', '054', '55555555', 161, '2014.08.01');
INSERT INTO member VALUES('APN', '에이핑크', 6, '경기', '031', '77777777', 164, '2011.02.10');
INSERT INTO member VALUES('SPC', '우주소녀', 13, '서울', '02', '88888888', 162, '2016.02.25');
INSERT INTO member VALUES('MMU', '마마무', 4, '전남', '061', '99999999', 165, '2014.06.19');

INSERT INTO buy VALUES(NULL, 'BLK', '지갑', NULL, 30, 2);
INSERT INTO buy VALUES(NULL, 'BLK', '맥북프로', '디지털', 1000, 1);
INSERT INTO buy VALUES(NULL, 'APN', '아이폰', '디지털', 200, 1);
INSERT INTO buy VALUES(NULL, 'MMU', '아이폰', '디지털', 200, 5);
INSERT INTO buy VALUES(NULL, 'BLK', '청바지', '패션', 50, 3);
INSERT INTO buy VALUES(NULL, 'MMU', '에어팟', '디지털', 80, 10);
INSERT INTO buy VALUES(NULL, 'GRL', '혼공SQL', '서적', 15, 5);
INSERT INTO buy VALUES(NULL, 'APN', '혼공SQL', '서적', 15, 2);
INSERT INTO buy VALUES(NULL, 'APN', '청바지', '패션', 50, 1);
INSERT INTO buy VALUES(NULL, 'MMU', '지갑', NULL, 30, 1);
INSERT INTO buy VALUES(NULL, 'APN', '혼공SQL', '서적', 15, 1);
INSERT INTO buy VALUES(NULL, 'MMU', '지갑', NULL, 30, 4);

SELECT * FROM member;
SELECT * FROM buy;
```

그럼 이렇게 `member` 와 `buy` 테이블 2개가 생성된 것을 볼 수 있다.

<img width="607" alt="SCR-20240714-sviw" src="https://github.com/user-attachments/assets/676aa724-d186-4186-a124-cbf138a18058">

방금 만든 데이터베이스만 사용할 수 있도록 `USE market_db;` 까지 실행해주자.

## 데이터를 조회하는 SELECT

SELECT는 데이터를 조회하는 데에 쓰이는 쿼리 명령으로, 다방면으로 쓰일 수 있다. 동일한 SELECT문을 여러 번 실행해도 항상 조회 결과가 같고 데이터베이스의 상태가 변경되지 않기 때문에, 멱등성을 가진다.

SELECT문은 다음과 같은 형식을 지킨다.
```sql
SELECT 열_이름
    FROM 테이블_이름
    WHERE 조건식
    GROUP BY 열_이름
    HAVING 조건식
    ORDER BY 열_이름
    LIMIT 숫 자
```

제일 기본적인 형태는 `SELECT * FROM table;` 이다. 애스터리스크(`*`)를 통해, `table`에 속한 모든 열을 조회하는 쿼리이다. 원래는 `database.table` 형태로 적어야 하지만, 앞에서 `USE` 문을 통해 데이터베이스를 지정한 상태이므로 앞으로도 테이블 이름만 적도록 하겠다.

애스터리스크가 위치한 자리에 열의 속성을 집어 넣으면, 원하는 부분만 가져올 수 있다. 또한 DISTINCT를 붙이면 중복되는 결과는 알아서 지워준다. 다음은 `member` 테이블에서 `mem_name`과 `mem_number` 만 가져온 결과이다.

<img width="421" alt="image" src="https://github.com/user-attachments/assets/97c492ba-4285-4d6f-853e-fea084d778e5">

WHERE 문을 통해 조건을 걸 수 있다. 해당 조건을 만족하는 열만 가져와진다. 프로그래밍 언어 쓰듯 조건을 달면 된다. 주의해야 할 점은 _equality_ 를 검사하는 연산자가 `==`가 아니라 `=`라는 점이다. 맨날 쓸 때마다 헷갈린다. 

파이썬 처럼 IN 연산을 통해 특정 값이 특정 집합에 속해있는지도 검사할 수 있다. LIKE 연산으로 문자열 매치도 검사할 수 있다. `김%` 형태로 조건을 주면, 김으로 시작하는 모든 문자열을 허용한다는 의미이다. 만약 김으로 시작하는 2글자 문자열만 가져오고 싶다면, `김_` 과 같이 언더바를 사용하면 된다.

WHERE 절 안에 쿼리문 자체를 작성할 수도 있다. 이를 `서브 쿼리` 라고 한다. 책에 나온 예시는 다음과 같다.

```sql
SELECT mem_name, height FROM member
    WHERE height > (SELECT height FROM member WHERE mem_name = '에이핑크');
```

두 개의 쿼리문이 하나로 묶여 있는 모습을 볼 수 있다. 이렇게 쓰면 관리 책임이 줄어들고, 조건 자체가 고정되어 있는 매직넘버가 아니기 때문에 좀 더 변화에 유연하다고 볼 수 있다.

## 정렬과 그룹화, 중복 제거와 개수 제한

위에서 SELECT, FROM, WHERE에 대해 알아보았다. 하지만 아직도 아래에 GROUP BY, HAVING, ORDER BY, LIMIT 등이 덕지덕지 붙을 수 있다. 이 구문들은 SELECT의 결과를 변형시킬 때 쓰인다. 각각에 대해 자세히 알아보자.

### 결과를 정렬하는 ORDER BY

어떤 열을 기준으로 정렬할 것인지를 인자로 주면 된다. 예컨대 `ORDER BY debut_date` 같이 쓰였다면, `debut_date` 행을 기준으로 오름차순 정렬된다. 
내림차순으로 정렬하고 싶다면 뒤에 `DESC` 를 붙여주면 된다. 큰 의미가 있는 것은 아니고, Descent의 약어이다. 생략하면 기본으로 `ASC` (Ascent) 라고 인식한다.
사용할 때 순서에 주의해야 한다. WHERE 절 보다 먼저 나오면 안된다. WHERE는 SELECT 명령을 통해 열을 가져오기 **전에** 조건을 걸어주는 것이고, ORDER BY는 SELECT 명령으로 값을 가져온 **후에** 변형을 가하는 것이기 때문이다.

### 개수를 제한하는 LIMIT

주로 결과의 개수를 제한하여 보여줄 때 사용되는 LIMIT 구문이다. 개수 뿐 만이라 시작 위치도 지정할 수 있다. 예컨대 `LIMIT 3, 2` 로 쓰였다면 3번째 부터 2건만 조회하겠다는 의미이다. 예시로 게시판을 생각해보면 된다. 한 페이지 당 10개의 게시글이 보인다면, 첫 페이지는 그냥 `LIMIT 10` 정도로 결과를 보여주면 될 것이고, 두 번째 페이지 부터는 `LIMIT 11, 10` 처럼 11번째 게시글 부터 10개를 가져와 표시해주고, 세 번째 페이지 부터는 `LIMIT 21, 10` ... 처럼 반복해주면 된다. 이를 웹 개발에서는 페이지네이션(Pagenation) 이라고 한다. 커서 기반으로 LIMIT 구문을 조절해주면 페이지네이션을 구현할 수 있다.

<img width="346" alt="image" src="https://github.com/user-attachments/assets/f50b3754-7e82-432a-9cca-facbf98c4ce7">
구글 검색 결과를 표시하는 것도 아마 같은 원리일 것이다.

## 그룹으로 묶는 GROUP BY

GROUP BY는 단독으로 쓰이기 보다는, 데이터를 그룹으로 묶어 집계 함수(aggregate function)로 결과를 계산하는데 주로 쓰인다. 같이 쓰이는 집계 함수는 다음과 같다.

| 함수명               | 설명                           |
|------------------|----------------------------|
| SUM()            | 합계를 구합니다.               |
| AVG()            | 평균을 구합니다.               |
| MIN()            | 최소값을 구합니다.              |
| MAX()            | 최대값을 구합니다.              |
| COUNT()          | 행의 개수를 셉니다.             |
| COUNT(DISTINCT)  | 행의 개수를 셉니다(중복은 1개만 인정). |

예를 들어 `buy` 테이블에서 각 제품마다 몇 개씩 팔렸는지 데이터를 조회하려면 아래와 같은 쿼리를 작성하면 된다.

<img width="537" alt="image" src="https://github.com/user-attachments/assets/bc1c8691-4873-4a88-baf6-84c65c6847a6">

### 집계 함수에 조건을 거는 HAVING

HAVING은 GROUP BY를 통해 집계 함수를 적용하는 시점에서 조건을 걸고 싶을 때 사용한다.
엥? 조건을 거는건 WHERE가 아닌가? 라고 생각할 수 있지만, 적용되는 시점이 다르다.
WHERE 같은 경우는 아까도 말했듯 SELECT로 열을 뽑아내기 전에 적용되는 조건이고, HAVING은 SELECT로 열을 뽑아내고 난 다음 집계함수 까지 모두 적용한 후에 조건이 적용된다.

## 확인 문제 풀이 
SELECT에 대한 거의 모든 것을 다루었으니, 책의 확인 문제까지 하나 풀어보자.
<img width="506" alt="SCR-20240714-sspt" src="https://github.com/user-attachments/assets/015966c8-0d8c-46ea-be3d-0f8318448886">

1번은 맨 뒤에 열의 이름이 나왔으므로, 해당 열을 기준으로 정렬하라는 의미일 것이다. 따라서 `ORDER BY` 가 정답. 

2번은 5, 2와 같이 개수가 지정되었으므로, `LIMIT`를 통해 시작점과 개수를 지정하여 결과의 총 개수를 지정하려는 의도일 것이다. 따라서 정답은 `LIMIT`

3번은 들어갈 수 있는게 `DISTINCT` 밖에 없다. 아마 중복을 제거하려는 의도일 것이다.

## 데이터를 입력하는 INSERT

데이터베이스는 다양한 데이터를 저장하고 관리하는 데 사용된다. 데이터베이스에 새로운 데이터를 추가하기 위해 사용하는 SQL 명령어가 바로 `INSERT`이다. `INSERT` 명령어는 새로운 데이터를 특정 테이블에 삽입하는 기능을 한다.

### INSERT 명령어의 일반적인 사용 형식

```sql
INSERT INTO 테이블명 (열1, 열2, 열3, ...)
VALUES (값1, 값2, 값3, ...);
```

### INSERT 명령어 사용 예시

예를 들어, `member` 테이블에 새로운 멤버를 추가하려면 다음과 같이 작성할 수 있다:

```sql
INSERT INTO member (mem_id, mem_name, mem_number, addr, phone1, phone2, height, debut_date)
VALUES ('NJS', '뉴진스', 5, '서울', '02', '12345678', 170, '2022.07.22');
```

이 명령어는 `member` 테이블에 `뉴이스트`라는 이름의 그룹을 추가한다.

### 언제 쓰이는가?

`INSERT` 명령어는 주로 다음과 같은 상황에서 사용된다:
- 새로운 데이터 레코드를 테이블에 추가할 때
- 초기 데이터베이스 설정 시 기본 데이터를 삽입할 때
- 데이터 수집 및 입력 애플리케이션에서 사용자 입력 데이터를 저장할 때

## 데이터를 수정하는 UPDATE

데이터베이스에 저장된 데이터는 시간이 지남에 따라 변경될 수 있다. 사용자의 정보가 변경되거나, 특정 조건에 따라 데이터를 업데이트해야 할 때가 있다. 이러한 경우에 사용되는 SQL 명령어가 바로 `UPDATE`이다. `UPDATE` 명령어는 기존 데이터를 수정하는 데 사용된다.

### UPDATE 명령어의 일반적인 사용 형식

```sql
UPDATE 테이블명
SET 열1 = 값1, 열2 = 값2, ...
WHERE 조건;
```

### UPDATE 명령어 사용 예시

예를 들어, `member` 테이블에서 특정 멤버의 연락처를 변경하려면 다음과 같이 작성할 수 있다:

```sql
UPDATE member
SET phone1 = '010', phone2 = '12345678'
WHERE mem_id = 'TWC';
```

이 명령어는 `TWC`라는 아이디를 가진 멤버의 연락처를 수정한다.

### 언제 쓰이는가?

`UPDATE` 명령어는 주로 다음과 같은 상황에서 사용된다:
- 특정 조건에 해당하는 데이터 레코드를 수정할 때
- 데이터 정제 및 갱신 작업을 수행할 때
- 사용자 프로필 정보와 같은 데이터를 변경할 때

## 데이터를 삭제하는 DELETE

때로는 데이터베이스에서 불필요하거나 오래된 데이터를 삭제해야 할 필요가 있다. 이러한 경우에 사용되는 SQL 명령어가 바로 `DELETE`이다. `DELETE` 명령어는 특정 조건에 맞는 데이터 레코드를 테이블에서 제거하는 데 사용된다.

### DELETE 명령어의 일반적인 사용 형식

```sql
DELETE FROM 테이블명
WHERE 조건;
```

### DELETE 명령어 사용 예시

예를 들어, `member` 테이블에서 특정 멤버를 삭제하려면 다음과 같이 작성할 수 있다:

```sql
DELETE FROM member
WHERE mem_id = 'OMY';
```

이 명령어는 `OMY`라는 아이디를 가진 멤버를 `member` 테이블에서 삭제한다.

### 언제 쓰이는가?

`DELETE` 명령어는 주로 다음과 같은 상황에서 사용된다:
- 특정 조건에 해당하는 데이터 레코드를 삭제할 때
- 오래된 데이터나 더 이상 필요하지 않은 데이터를 제거할 때
- 데이터 정리 작업을 수행할 때
