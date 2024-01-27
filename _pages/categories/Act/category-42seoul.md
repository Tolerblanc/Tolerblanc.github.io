---
title: "42서울"
layout: archive
permalink: categories/42seoul
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories['42Seoul'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
