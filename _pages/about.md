---
permalink: /
title: "Jun Fang"
excerpt: "Jun Fang is a third-year Ph.D. student at Tsinghua University studying eating behavior and behavior change."
author_profile: false
body_class: home-page
redirect_from:
  - /about/
  - /about.html
---

<section id="about-me" class="home-hero" aria-labelledby="home-title">
  <div class="home-hero__identity">
    <p class="home-kicker">Third-year Ph.D. student &middot; Tsinghua University</p>
    <h1 id="home-title">{{ site.author.name | escape }}</h1>
  </div>
  <img class="home-portrait" src="{{ '/images/portrait-home.jpg' | relative_url }}" width="720" height="900" alt="Portrait of {{ site.author.name | escape }}">
  <div class="home-hero__bio">
    <p class="home-bio">I work in the <a href="https://pi.cs.tsinghua.edu.cn/">Pervasive Interaction Lab</a>, advised by <a href="https://scholar.google.com/citations?user=TZm3-pwAAAAJ">Prof. Yuanchun Shi</a> and <a href="https://scholar.google.com/citations?user=kHpwoAUAAAAJ">A/Prof. Yuntao Wang</a>.</p>
    <p class="home-bio">I study eating behavior and build closed-loop systems to support behavior change in everyday life.</p>
    <div class="home-links">
      <a href="mailto:{{ site.author.email }}">Email</a>
      <a href="{{ site.author.googlescholar | escape }}">Google Scholar</a>
      <a href="https://www.linkedin.com/in/{{ site.author.linkedin | escape }}">LinkedIn</a>
      <a href="{{ site.author.orcid | escape }}">ORCID</a>
    </div>
    <p class="home-note">Open to research internships, collaborations, and visiting opportunities.</p>
  </div>
</section>

<section class="home-section" aria-labelledby="research">
  <div class="home-section__heading">
    <h2 id="research">Research</h2>
    <a class="home-all-papers" href="{{ '/publications/' | relative_url }}">All publications <span aria-hidden="true">&rarr;</span></a>
  </div>
  {% for topic in site.data.research %}
  <section class="home-research-line" aria-labelledby="research-{{ topic.id }}">
    <div class="home-research-line__intro">
      <h3 id="research-{{ topic.id }}">{{ topic.title | escape }}</h3>
      <p>{{ topic.description | escape }}</p>
    </div>
    <ul class="home-research-line__papers">
      {% for paper in topic.papers %}
      <li>
        <h4>{{ paper.title | escape }}</h4>
        <div class="home-research-paper__meta">
          <span>{{ paper.venue | escape }}</span>
          {% for link in paper.links %}
          <a href="{{ link.url | relative_url | escape }}" aria-label="{{ link.label | escape }}: {{ paper.title | escape }}">{{ link.label | escape }}</a>
          {% endfor %}
        </div>
      </li>
      {% endfor %}
    </ul>
    <picture class="home-research-line__image">
      <source srcset="{{ topic.image.webp | relative_url }}" type="image/webp">
      <img src="{{ topic.image.src | relative_url }}" width="{{ topic.image.width }}" height="{{ topic.image.height }}" alt="{{ topic.image.alt | escape }}">
    </picture>
  </section>
  {% endfor %}
</section>

{% assign news = site.data.news | sort: 'date' | reverse %}
{% assign recent_news = news | slice: 0, 3 %}
<section class="home-section" aria-labelledby="news">
  <div class="home-section__heading">
    <h2 id="news">News</h2>
  </div>
  {% include home-news-list.html items=recent_news %}
  {% if news.size > 3 %}
  {% assign earlier_news = news | slice: 3, news.size %}
  <details class="home-news-archive">
    <summary>Earlier news</summary>
    {% include home-news-list.html items=earlier_news %}
  </details>
  {% endif %}
</section>

<section class="home-section home-background" aria-labelledby="background">
  <div class="home-section__heading">
    <h2 id="background">Background</h2>
  </div>
  <div class="home-background__grid">
<div markdown="1">

### Honors and Awards {#selected-honors-and-awards}

- *2026.11* **Huiyan Talent Scholarship, Secondary Scholarship**, Tsinghua University.
- *2026.10* **Young Elite Scientists Sponsorship Program (Doctoral Student Special Project)**, China Association for Science and Technology.
- *2021.12* **Outstanding Scholarship for Science and Technology Innovation**, Tsinghua University.
- *2021.09* **Third Prize in "Shuyuan Cup" National GeneBank Algorithm Competition on One-Million Single-Cell Gene Expression Data**, National GeneBank of China.
- *2017.11* **Silver Medal in the 33rd China Mathematical Olympiad (CMO)**, Chinese Mathematical Society.

</div>
<div markdown="1">

### Education {#educations}

- *2023.09 - 2029.06 (expected)*, Ph.D. in Department of Computer Science and Technology, Tsinghua University.
- *2018.09 - 2023.06*, B.S. in Department of Automation, Tsinghua University.


### Internships

- *2022.07 - 2022.09*, [Microsoft STCA](https://www.microsoft.com/zh-cn/aprd/aboutus/teams-stca), Beijing
- *2021.07 - 2021.08*, [Microsoft STCA](https://www.microsoft.com/zh-cn/aprd/aboutus/teams-stca), Suzhou

### Professional Services

- Conference Reviewer: CHI 2026, DIS 2026, CHI 2027

</div>
  </div>
</section>
