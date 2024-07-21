---
title: "[혼공S] 3주차 - 데이터 형식과 조인, 스토어드 프로시저"
excerpt: "혼자 공부하는 SQL Chapter 04"

categories:
    - 혼공학습단
tags:
    - [혼공학습단, Database, SQL]

date: 2024-07-21
last_modified_at: 2024-07-21

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

# Introduction

벌써 3주차 마지막 날이 되었다. 갑자기 너무 바빠져서 책 펴기도 쉽지 않지만, 혼공학습단 이라는 것이 있어서 그래도 읽고 정리할 의지가 생기는 것 같다. 내일(7/22) SQLD 접수가 있는데, [리트 코드 SQL 50제](https://leetcode.com/studyplan/top-sql-50/)를 풀면서 준비하면 좋을 것 같다. 이번주는 MySQL의 데이터 형식(자료형)과 조인에 대해 이해하고 활용하는 방법, 스토어드 프로시저를 통해 일반 프로그래밍 언어처럼 SQL을 작성하는 법에 대해 알아본다.

# MySQL의 데이터 형식

### 정수형

정수형 데이터는 숫자를 저장하는 데 사용되며, 소수점 이하의 숫자를 저장하지 않는다. MySQL에서 주로 사용하는 정수형 데이터 형식은 TINYINT, SMALLINT, MEDIUMINT, INT, BIGINT 등이 있다. 각 형식은 저장할 수 있는 값의 범위와 크기가 다르다.

```sql
CREATE TABLE example_int (
    id INT AUTO_INCREMENT PRIMARY KEY,
    small_num SMALLINT,
    big_num BIGINT
);

INSERT INTO example_int (small_num, big_num) VALUES (32000, 9223372036854775807);

```

### 문자형

문자형 데이터는 텍스트 데이터를 저장하는 데 사용된다. MySQL에서 주로 사용하는 문자형 데이터 형식은 CHAR, VARCHAR, TEXT, BLOB 등이 있다. CHAR와 VARCHAR는 고정 길이와 가변 길이 문자열을 저장하는 데 사용되고, TEXT와 BLOB은 대량의 텍스트와 바이너리 데이터를 저장하는 데 사용된다.

```sql
CREATE TABLE example_char (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT
);

INSERT INTO example_char (name, description) VALUES ('Alice', 'This is a description text.');

```

### 대량 데이터

대량 데이터는 BLOB과 TEXT 형식을 사용하여 저장할 수 있다. BLOB(Binary Large Object)는 바이너리 데이터를 저장하는 데 사용되며, TEXT는 대량의 텍스트 데이터를 저장하는 데 사용된다. BLOB은 TINYBLOB, BLOB, MEDIUMBLOB, LONGBLOB로 세분화되며, TEXT도 마찬가지로 TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT로 세분화된다.

```sql
CREATE TABLE example_blob (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data BLOB
);

INSERT INTO example_blob (data) VALUES (LOAD_FILE('/path/to/file'));

```

### 실수형

실수형 데이터는 소수점을 포함한 숫자를 저장하는 데 사용된다. MySQL에서 주로 사용하는 실수형 데이터 형식은 FLOAT, DOUBLE, DECIMAL 등이 있다. FLOAT와 DOUBLE은 부동 소수점 숫자를 저장하는 데 사용되며, DECIMAL은 고정 소수점 숫자를 저장하는 데 사용된다.

```sql
CREATE TABLE example_float (
    id INT AUTO_INCREMENT PRIMARY KEY,
    float_num FLOAT,
    double_num DOUBLE,
    decimal_num DECIMAL(10, 2)
);

INSERT INTO example_float (float_num, double_num, decimal_num) VALUES (3.14, 12345.6789, 12345.67);

```

### 날짜형

날짜형 데이터는 날짜와 시간을 저장하는 데 사용된다. MySQL에서 주로 사용하는 날짜형 데이터 형식은 DATE, TIME, DATETIME, TIMESTAMP, YEAR 등이 있다. 각 형식은 날짜와 시간 데이터를 저장하는 방식이 다르다.

```sql
CREATE TABLE example_date (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_date DATE,
    event_time TIME,
    event_timestamp TIMESTAMP
);

INSERT INTO example_date (event_date, event_time, event_timestamp) VALUES ('2024-07-21', '14:30:00', NOW());

```

### 변수의 사용 (PREPARE-EXECUTE 포함)

MySQL에서 변수를 사용하는 방법은 크게 두 가지로 나눌 수 있다: 사용자 정의 변수와 준비된 문(PREPARE-EXECUTE)을 사용하는 방법이다. 사용자 정의 변수는 `SET` 명령을 사용하여 선언하고, 준비된 문은 `PREPARE`와 `EXECUTE` 명령을 사용하여 실행할 수 있다.

```sql
-- 사용자 정의 변수
SET @myvar = 100;
SELECT @myvar;

-- 준비된 문
PREPARE stmt FROM 'SELECT * FROM example_int WHERE id = ?';
SET @id = 1;
EXECUTE stmt USING @id;
DEALLOCATE PREPARE stmt;

```

### 데이터 형 변환

MySQL에서는 데이터를 다양한 형식으로 변환할 수 있다. `CAST`와 `CONVERT` 함수를 사용하여 데이터 형식을 변환할 수 있다.

```sql
CREATE TABLE example_conversion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    num_str VARCHAR(10)
);

INSERT INTO example_conversion (num_str) VALUES ('12345');

SELECT num_str, CAST(num_str AS UNSIGNED) AS num FROM example_conversion;

```

위와 같이 `CAST`와 `CONVERT` 함수를 이용하는 형 변환을 **명시적 형 변환(Explicit Conversion)** 이라고 한다. 반대로 **암시적 형 변환(Implicit Convertion)** 이 이뤄지는 경우가 있다. 예를 들어 문자열 끼리 덧셈을 수행한다거나(숫자로 변경되어 연산됨), 정수형끼리 `CONCAT` (문자열로 변경되여 연결됨) 하는 경우가 있다.

# 조인 (Join)

두 개 (또는 그 이상) 테이블을 서로 묶어서 하나의 결과를 만드는 것을 조인이라고 한다. 보통 데이터베이스에는 테이블 단위로 정보를 잘라서 보관하기 때문에, 원하는 정보를 얻기 위해서는 조인이 필수적이다.

## 일대다 관계의 이해

일대다 관계는 데이터베이스에서 가장 흔히 사용되는 관계 유형 중 하나다. 이는 한 테이블의 한 행이 다른 테이블의 여러 행과 관련이 있는 경우를 의미한다. 예를 들어, 하나의 고객이 여러 개의 주문을 할 수 있는 상황을 생각해보자. 이 경우 고객 테이블과 주문 테이블 간의 관계는 일대다 관계가 된다.

```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name VARCHAR(100)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderDate DATE,
    CustomerID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

INSERT INTO Customers (CustomerID, Name) VALUES (1, 'John Doe');
INSERT INTO Orders (OrderID, OrderDate, CustomerID) VALUES (101, '2024-07-21', 1);
INSERT INTO Orders (OrderID, OrderDate, CustomerID) VALUES (102, '2024-07-22', 1);

```

## 내부 조인

내부 조인(Inner Join)은 두 테이블 간의 일치하는 행만 반환한다. 주로 일대다 관계에서 사용되며, 두 테이블의 공통된 값을 기준으로 데이터를 결합한다.

```sql
SELECT Customers.Name, Orders.OrderID, Orders.OrderDate
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID;

```

이 쿼리는 Customers 테이블과 Orders 테이블을 CustomerID를 기준으로 내부 조인하여, 고객 이름과 해당 고객의 주문 ID 및 주문 날짜를 반환한다.

## 외부 조인

외부 조인(Outer Join)은 내부 조인과 달리, 조인 조건에 일치하지 않는 행도 반환한다. 외부 조인은 다시 왼쪽 외부 조인(Left Outer Join)과 오른쪽 외부 조인(Right Outer Join)으로 나눌 수 있다.

- **왼쪽 외부 조인 (Left Outer Join)**: 왼쪽 테이블의 모든 행과 오른쪽 테이블의 일치하는 행을 반환하며, 일치하지 않는 오른쪽 테이블의 행은 NULL로 표시된다.

```sql
SELECT Customers.Name, Orders.OrderID, Orders.OrderDate
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;

```

이 쿼리는 Customers 테이블의 모든 행과 일치하는 Orders 테이블의 행을 반환하며, 일치하지 않는 Orders 행은 NULL로 표시된다.

- **오른쪽 외부 조인 (Right Outer Join)**: 오른쪽 테이블의 모든 행과 왼쪽 테이블의 일치하는 행을 반환하며, 일치하지 않는 왼쪽 테이블의 행은 NULL로 표시된다.

```sql
SELECT Customers.Name, Orders.OrderID, Orders.OrderDate
FROM Customers
RIGHT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;

```

이 쿼리는 Orders 테이블의 모든 행과 일치하는 Customers 테이블의 행을 반환하며, 일치하지 않는 Customers 행은 NULL로 표시된다.

## 상호 조인

상호 조인(Cross Join)은 두 테이블의 모든 가능한 조합을 반환한다. 이는 곱집합(Cartesian Product)이라고도 불리며, 두 테이블의 행 수를 곱한 만큼의 결과를 반환한다. 주의해서 사용해야 하며, 보통 특정 조건 없이 모든 조합을 구해야 할 때 사용된다.

```sql
SELECT Customers.Name, Orders.OrderID, Orders.OrderDate
FROM Customers
CROSS JOIN Orders;

```

이 쿼리는 Customers 테이블의 모든 행과 Orders 테이블의 모든 행을 조합하여 결과를 반환한다. 예를 들어, Customers 테이블에 3개의 행이 있고, Orders 테이블에 4개의 행이 있으면, 결과는 3 x 4 = 12개의 행이 된다.

## 중복된 결과 거르기

이전 챕터에서 배운 `DISTINCT` 를 사용하면, 중복된 결과를 1개만 출력하도록 할 수 있다.

![image](https://github.com/user-attachments/assets/a53716a3-d894-40c2-8e95-b0a2386bb9d3)


## 확인 문제 풀이

![image](https://github.com/user-attachments/assets/654b37a1-ee9c-4173-a479-b76562120c05)

혼공SQL 195p 4번

![image](https://github.com/user-attachments/assets/19f0ecf9-064e-4ba1-8835-532f5ecd6aa5)

# 스토어드 프로시저 입문

스토어드 프로시저는 미리 작성된 SQL 쿼리와 제어 흐름 구조를 포함한 프로그램 코드 블록으로, 데이터베이스 서버에 저장되어 필요할 때 호출하여 실행할 수 있다. 이를 통해 데이터베이스 작업의 효율성을 높이고, 반복적인 작업을 자동화할 수 있다. 마지막 목차는 스토어드 프로시저의 기본 SQL 프로그래밍에 초점을 맞추어 조건문, 변수, 동적 SQL, CASE, WHILE 문을 사용하는 방법을 알아보자.

### 조건문

조건문은 특정 조건에 따라 코드의 실행 흐름을 제어하는 데 사용된다. 스토어드 프로시저에서 IF...ELSE 구조를 사용하여 조건문을 작성할 수 있다.

```sql
DELIMITER //

CREATE PROCEDURE CheckStock(IN productID INT, OUT stockStatus VARCHAR(50))
BEGIN
    DECLARE stock INT;

    SELECT quantity INTO stock
    FROM Products
    WHERE id = productID;

    IF stock > 10 THEN
        SET stockStatus = 'Stock is sufficient';
    ELSE
        SET stockStatus = 'Stock is low';
    END IF;
END //

DELIMITER ;

```

이 예제는 제품의 재고를 확인하는 스토어드 프로시저를 정의한다. 재고가 10개 이상이면 "Stock is sufficient", 그렇지 않으면 "Stock is low"라는 메시지를 반환한다.

### 변수

변수는 프로시저 내에서 값을 저장하고 조작하는 데 사용된다. 변수는 DECLARE 문을 사용하여 선언하고, SET 문을 사용하여 값을 할당할 수 있다.

```sql
DELIMITER //

CREATE PROCEDURE CalculateDiscount(IN price DECIMAL(10,2), OUT discountedPrice DECIMAL(10,2))
BEGIN
    DECLARE discountRate DECIMAL(5,2);
    SET discountRate = 0.10;

    SET discountedPrice = price - (price * discountRate);
END //

DELIMITER ;

```

이 예제는 가격을 입력받아 10% 할인된 가격을 계산하여 반환하는 스토어드 프로시저를 정의한다.

### 동적 SQL

동적 SQL은 실행 시점에 SQL 쿼리를 생성하고 실행하는 방법이다. PREPARE, EXECUTE, DEALLOCATE PREPARE 문을 사용하여 동적 SQL을 작성할 수 있다.

```sql
DELIMITER //

CREATE PROCEDURE DynamicQuery(IN tableName VARCHAR(50))
BEGIN
    SET @query = CONCAT('SELECT * FROM ', tableName);

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

```

이 예제는 테이블 이름을 입력받아 해당 테이블의 모든 데이터를 동적으로 조회하는 스토어드 프로시저를 정의한다.

### CASE 문

CASE 문은 여러 조건을 검사하여 조건에 맞는 값을 반환하는 데 사용된다. 이는 IF...ELSEIF...ELSE 구조와 유사하다.

```sql
DELIMITER //

CREATE PROCEDURE GetGrade(IN score INT, OUT grade CHAR(1))
BEGIN
    SET grade = CASE
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        WHEN score >= 70 THEN 'C'
        WHEN score >= 60 THEN 'D'
        ELSE 'F'
    END;
END //

DELIMITER ;

```

이 예제는 점수를 입력받아 점수에 따라 학점을 반환하는 스토어드 프로시저를 정의한다.

### WHILE 문

WHILE 문은 조건이 참인 동안 반복적으로 코드를 실행하는 데 사용된다.

```sql
DELIMITER //

CREATE PROCEDURE PrintNumbers(IN maxNum INT)
BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= maxNum DO
        SELECT i;
        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;

```

이 예제는 1부터 입력받은 숫자까지의 모든 숫자를 출력하는 스토어드 프로시저를 정의한다.