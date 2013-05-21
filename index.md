---
layout: page
title: paolobueno's blog
tagline: One step at a time
---
{% include JB/setup %}

Hello, welcome to my blog!

Here I talk about programming, my ongoing projects, and sometimes project management.

You can access the list of posts so far below or on the [Archive]({{ BASE_PATH }}{{ site.JB.archive_path }})

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>