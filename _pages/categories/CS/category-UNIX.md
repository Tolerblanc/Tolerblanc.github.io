---
title: "UNIX"
layout: archive
permalink: categories/unix
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.['UNIX'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}