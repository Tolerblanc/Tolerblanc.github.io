---
title: "Web Fundamentals"
layout: archive
permalink: categories/web
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories['Web_Fundamentals'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
