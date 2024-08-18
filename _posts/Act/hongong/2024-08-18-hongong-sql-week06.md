---
title: "[혼공S] 6주차 - 스토어드 프로시저 & 파이썬 연결"
excerpt: "혼자 공부하는 SQL Chapter 07, 08"

categories:
    - 혼공학습단
tags:
    - [혼공학습단, Database, SQL]

date: 2024-08-18
last_modified_at: 2024-08-18

toc: true
toc_sticky: true
related: true
---

# Introduction

한 번 밀리니까 진도 잡는게 너무 어렵다. 마지막 주여서 ~~다행이다~~ 너무 아쉽다...
일단 기본 미션만 진행하고, 빠른 시일내에 내용 정리도 업데이트 할 예정이다.

# 기본 미션 인증

```sql
USE market_db;
CREATE TABLE singer (SELECT mem_id, mem_name, mem_number, addr FROM member);
CREATE TABLE backup_singer
( mem_id CHAR (8) NOT NULL ,
  mem_name VARCHAR (10) NOT NULL,
  mem_number INT NOT NULL,
  addr CHAR(2) NOT NULL,
  modType CHAR(2),
  modDate DATE,
  modUser VARCHAR(30)
);

DROP TRIGGER IF EXISTS singer_updateTrg;
DELIMITER $$
CREATE TRIGGER singer_updateTrg
	AFTER UPDATE
	ON singer
	FOR EACH ROW
BEGIN
	INSERT INTO backup_singer VALUES( OLD.mem_id, OLD.mem_name,
		OLD.mem_number, OLD.addr, '수정', CURDATE(), CURRENT_USER() );
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS singer_deLeteirg;
DELIMITER $$
CREATE TRIGGER singer_deleteTrg
	AFTER DELETE
	ON singer
	FOR EACH ROW
BEGIN
	INSERT INTO backup_singer VALUES( OLD.mem_id, OLD.mem_name,
		OLD.mem_number, OLD.addr, '삭제', CURDATE(), CURRENT_USER() );
END $$
DELIMITER ;
```

위와 같이 트리거를 만드는 쿼리를 실행 시킨 후

```sql
UPDATE singer SET addr = '영국' WHERE mem_id = 'BLK';
DELETE FROM singer WHERE mem_number >= 7;

SELECT * FROM backup_singer;
```

트리거가 잘 동작하는지 확인해보기 위해 위와 같은 쿼리를 실행시켰을 때 아래와 같은 오류가 발생했다.

```text
Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect.
```

안전 모드를 사용중이라서 WHERE 절에서 Key Column을 특정하지 않고 여러 개의 Column을 한 번에 UPDATE/DELETE 하려고 하면 막힌다. 아래와 같이 에러로그를 따라가 아래 설정을 끄게 되면 정상 동작을 확인할 수 있다.

<img width="801" alt="image" src="https://github.com/user-attachments/assets/84c18bf3-2226-4586-a03e-ea4e048321cd">

<img width="469" alt="image" src="https://github.com/user-attachments/assets/b94e4e1c-affe-4449-a8c8-a6106a8ac407">

내용 정리도 빠른 시일내에 해야지...
