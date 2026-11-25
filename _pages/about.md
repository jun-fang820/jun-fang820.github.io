---
permalink: /
title: "Jun Fang"
excerpt: "Jun Fang is a third-year Ph.D. student at Tsinghua University studying wearable sensing, behavior change, and ingestion health."
author_profile: false
body_class: home-page
redirect_from:
  - /about/
  - /about.html
---

<section id="about-me" class="home-hero" aria-labelledby="home-title">
  <div class="home-hero__identity">
    <h1 id="home-title">{{ site.author.name | escape }}</h1>
  </div>
  <div class="home-hero__aside">
    <figure class="home-portrait">
      <img src="{{ '/images/portrait-riverside.webp' | relative_url }}" width="1080" height="1440" alt="Portrait of {{ site.author.name | escape }} by a river">
    </figure>
    <nav class="home-links" aria-label="Contact and profiles">
      <a href="mailto:{{ site.author.email }}" aria-label="Email" title="Email"><i class="fas fa-envelope" aria-hidden="true"></i></a>
      <a href="{{ site.author.googlescholar | escape }}" aria-label="Google Scholar" title="Google Scholar"><i class="ai ai-google-scholar" aria-hidden="true"></i></a>
      <a href="https://www.linkedin.com/in/{{ site.author.linkedin | escape }}" aria-label="LinkedIn" title="LinkedIn"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
      <a href="{{ site.author.orcid | escape }}" aria-label="ORCID" title="ORCID"><i class="ai ai-orcid" aria-hidden="true"></i></a>
    </nav>
  </div>
  <div class="home-hero__bio">
    <p class="home-bio">I'm a third-year Ph.D. student in the <a href="https://pi.cs.tsinghua.edu.cn/">Pervasive Interaction Lab</a> at Tsinghua University, advised by <a href="https://scholar.google.com/citations?user=TZm3-pwAAAAJ">Prof. Yuanchun Shi</a> and <a href="https://scholar.google.com/citations?user=kHpwoAUAAAAJ">A/Prof. Yuntao Wang</a>.</p>
    <p class="home-bio">I study wearable sensing for <strong>ingestion health</strong> and design interventions for <strong>behavior change</strong>, with broader interests in <strong>well-being</strong>.</p>
    <p class="home-note">Open to research internships, collaborations, and visiting opportunities.</p>
  </div>
</section>

{% assign news = site.data.news | sort: 'date' | reverse %}
{% assign recent_news = news | slice: 0, 3 %}
<section class="home-section home-news" aria-labelledby="news">
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

<section class="home-section" aria-labelledby="research" data-research-tabs>
  <div class="home-section__heading home-research-heading">
    <h2 id="research">Research</h2>
    <div class="home-research-plate" aria-hidden="true">
      {% for topic in site.data.research %}
      {% if topic.artwork %}
      <div class="home-research-plate__layer" data-research-art="research-{{ topic.id }}"{% if forloop.first %} data-active{% endif %}>
        {% include {{ topic.artwork }} %}
      </div>
      {% endif %}
      {% endfor %}
    </div>
    <a class="home-all-papers" href="{{ '/publications/' | relative_url }}">All publications <span aria-hidden="true">&rarr;</span></a>
    <nav class="home-research-tabs" aria-label="Research directions" data-research-tablist>
      {% for topic in site.data.research %}
      <a href="#research-{{ topic.id }}" id="tab-{{ topic.id }}">{{ topic.short_title | escape }}</a>
      {% endfor %}
    </nav>
  </div>
  <div class="home-research-panels" data-research-panels>
  {% for topic in site.data.research %}
  <section class="home-research-module" id="research-{{ topic.id }}" aria-labelledby="topic-{{ topic.id }}">
    {% for alias in topic.aliases %}
    <span id="research-{{ alias }}" aria-hidden="true"></span>
    {% endfor %}
    <div class="home-research-module__intro">
      <h3 id="topic-{{ topic.id }}">{{ topic.title | escape }}</h3>
      <p>{{ topic.description | escape }}</p>
    </div>
    <ul id="research-papers-{{ topic.id }}" class="home-research-module__papers{% if topic.papers.size == 1 %} home-research-module__papers--single{% endif %}" aria-label="Selected work: {{ topic.short_title | escape }}" data-research-paper-track>
      {% for paper in topic.papers %}
      <li class="home-research-paper{% if paper.demo == 'earinter' %} home-research-paper--demo{% endif %}">
        {% if paper.demo == 'earinter' %}
        {% include research-demos/earinter.html %}
        {% else %}
        {% include paper-figure.html class_name="paper-figure home-research-paper__image" src=paper.image.src preview=paper.image.webp label=paper.title alt=paper.image.alt viewer=true %}
        {% endif %}
        <div>
          <h4>{{ paper.name | default: paper.title | escape }}</h4>
          {% if paper.summary %}
          <p class="home-research-paper__summary">{{ paper.summary | escape }}</p>
          {% endif %}
          <div class="home-research-paper__meta">
            {% if paper.venue %}
            <span class="pub-venue">{{ paper.venue | escape }}</span>
            {% endif %}
            {% if paper.status %}
            <span>{{ paper.status | escape }}</span>
            {% endif %}
            {% for link in paper.links %}
            <a href="{{ link.url | relative_url | escape }}" aria-label="{{ link.label | escape }}: {{ paper.title | escape }}"{% if link.viewer == 'video' %} data-research-preview="video" data-preview-poster="{{ link.poster | relative_url | escape }}" data-preview-captions="{{ link.captions | relative_url | escape }}"{% endif %}>{{ link.label | escape }}</a>
            {% endfor %}
          </div>
        </div>
      </li>
      {% endfor %}
    </ul>
    <div class="home-research-paper-controls" data-research-paper-controls hidden>
      <span data-research-paper-count></span>
      <button type="button" aria-label="Previous paper" aria-controls="research-papers-{{ topic.id }}" data-research-paper-previous>Previous</button>
      <button type="button" aria-label="Next paper" aria-controls="research-papers-{{ topic.id }}" data-research-paper-next>Next</button>
    </div>
  </section>
  {% endfor %}
  </div>
  {% include research-viewer.html %}
</section>

<section class="home-section home-background" aria-labelledby="background">
  <div class="home-section__heading">
    <h2 id="background">Background</h2>
  </div>
  <div class="home-background__grid">
<div markdown="1">

### Honors and Awards {#selected-honors-and-awards}

- *2026.11* Huiyan Talent Scholarship, Secondary Scholarship, Tsinghua University.
- *2026.10* Young Elite Scientists Sponsorship Program (Doctoral Student Special Project), China Association for Science and Technology.
- *2021.12* Outstanding Scholarship for Science and Technology Innovation, Tsinghua University.
- *2021.09* Third Prize in "Shuyuan Cup" National GeneBank Algorithm Competition on One-Million Single-Cell Gene Expression Data, National GeneBank of China.
- *2017.11* Silver Medal in the 33rd China Mathematical Olympiad (CMO), Chinese Mathematical Society.

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
