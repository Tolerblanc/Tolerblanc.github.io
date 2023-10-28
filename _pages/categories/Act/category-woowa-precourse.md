---
title: "우아한 테크코스 프리코스 6기"
layout: archive
permalink: categories/woowa-precourse
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.['woowa_precourse'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
