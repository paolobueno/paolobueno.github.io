---
layout: page
title: paolobueno's blog
tagline: One step at a time
---

Olá, bem-vindo ao meu blog!

Aqui eu falo sobre programação, meus projetos atuais e de vez em quando sobre gerenciamento de projetos.

Você pode acessar a lista de posts atual abaixo ou no [Archive]({{ BASE_PATH }}{{ site.JB.archive_path }})

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>