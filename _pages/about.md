---
permalink: /
title: "Jun Fang"
excerpt: "Jun Fang, Ph.D. student at Tsinghua University, researches everyday behavior sensing and intervention."
author_profile: false
body_class: home-page
redirect_from:
  - /about/
  - /about.html
---

<section id="about-me" class="home-hero" aria-labelledby="home-title">
  <div class="home-hero__identity">
    <p class="home-kicker">Ph.D. student &middot; Tsinghua University</p>
    <h1 id="home-title">{{ site.author.name | escape }}</h1>
  </div>
  <img class="home-portrait" src="{{ site.author.avatar | relative_url }}" width="264" height="368" alt="Portrait of {{ site.author.name | escape }}">
  <div class="home-hero__bio">
    <p class="home-lede">I design sensing and feedback systems that help people understand and change their everyday habits.</p>
    <p class="home-bio">I work in the <a href="https://pi.cs.tsinghua.edu.cn/">Pervasive Interaction Lab</a>, advised by <a href="https://scholar.google.com/citations?user=TZm3-pwAAAAJ">Prof. Yuanchun Shi</a> and <a href="https://scholar.google.com/citations?user=kHpwoAUAAAAJ">A/Prof. Yuntao Wang</a>. My work spans human-AI interaction, behavior change, and everyday health.</p>
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
    <h2 id="research">Selected Research</h2>
    <a class="home-all-papers" href="{{ '/publications/' | relative_url }}">All publications <span aria-hidden="true">&rarr;</span></a>
  </div>
  <div class="home-projects">
    <article class="home-project" aria-labelledby="earinter-title">
      <picture class="home-project__media">
        <source srcset="{{ '/images/earinter-home.webp' | relative_url }}" type="image/webp">
        <img src="{{ '/images/earinter.PNG' | relative_url }}" width="2787" height="1647" alt="Earinter uses earbud sensing to deliver feedback during meals.">
      </picture>
      <p class="home-kicker home-project__venue">IMWUT 2026</p>
      <h3 id="earinter-title">Earinter</h3>
      <p>Commodity earbuds sense eating pace and deliver just-in-time feedback during meals.</p>
      <div class="home-links">
        <a href="https://dl.acm.org/doi/10.1145/3831629" aria-label="Paper on Earinter">Paper</a>
        <a href="{{ '/video/earinter/IMWUT-Feb262705-teaser.mp4' | relative_url }}" aria-label="Earinter video">Video</a>
      </div>
    </article>
    <article class="home-project" aria-labelledby="photo-habits-title">
      <picture class="home-project__media">
        <source srcset="{{ '/images/premeal-habit-home.webp' | relative_url }}" type="image/webp">
        <img src="{{ '/images/premeal_habit.png' | relative_url }}" width="3146" height="1436" alt="Behavior change techniques and paths to forming a pre-meal photo habit.">
      </picture>
      <p class="home-kicker home-project__venue">2026 preprint</p>
      <h3 id="photo-habits-title">Pre-Meal Photo Habits</h3>
      <p>A longitudinal study of how prompts, reflection, and social support shape a food-journaling habit.</p>
      <div class="home-links">
        <a href="https://arxiv.org/abs/2611.02983" aria-label="Pre-Meal Photo Habits preprint on arXiv">arXiv</a>
      </div>
    </article>
  </div>
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
