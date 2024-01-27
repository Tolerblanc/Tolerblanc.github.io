---
title: "Retrospective"
layout: archive
permalink: categories/retrospective
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories['Retrospective'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
