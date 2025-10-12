---
title: NestJS 해체분석기 5 - 커스텀 데코레이터와 reflect-metadata
excerpt:   
categories:
    - JavaScript
tags:
    - [NodeJS, NestJS, CustomDecorator, reflect-metadata]

date: 2025-03-16
last_modified_at: 2025-03-16

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

## Introduction

지난 [4편](https://tolerblanc.github.io/javascript/nestjs-dematerializer-4/)에서는 NestJS에서의 예외처리 필터와 파이프에 대해 알아보았다. 이번에는 커스텀 데코레이터와 함께, 그 근간이 되는 `reflect-metadata`에 대해 자세히 알아보려고 한다. 사실 NestJS 시리즈에 넣기엔 애매할 정도로 JavaScript와 TypeScript에 더 가깝긴 하지만, NestJS만큼 이를 잘 활용하고 있는 예시도 흔치 않아서 시리즈에서 다뤄보려고 한다. NestJS의 핵심기능은 거의 전부 `reflect-metadata`를 활용하고 있다고 봐도 무방하다.


