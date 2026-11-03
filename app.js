(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG;
  const posts = window.PORTFOLIO_POSTS || [];
  const page = document.body.dataset.page || 'dashboard';
  const base = document.body.dataset.base || './';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    book:'<path d="M3 4h6a4 4 0 0 1 3 1 4 4 0 0 1 3-1h6v16h-6a4 4 0 0 0-3 1 4 4 0 0 0-3-1H3zM12 5v16"/>',
    graduation:'<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v6c3 3 9 3 12 0v-6M22 9v8"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a22 22 0 0 0 18 0M10 13h4"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    up:'<path d="M6 18 18 6M6 6h12v12"/>',
    chevron:'<path d="m9 5 7 7-7 7"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .3-2 1-2.5 3-.3 5-1.5 5-5 0-1.5-.5-2.5-1.5-3.5.2-1.2.2-2.5-.5-3.5-2 0-3 1-4 1.5-2-.5-4-.5-6 0C8 4.5 7 3.5 5 3.5 4.3 4.5 4.3 6 4.5 7 3.5 8 3 9 3 10.5c0 3.5 2 4.7 5 5 .7.5 1 1.5 1 2.5v4"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chart:'<path d="M4 3v17h17M8 16v-5m5 5V6m5 10v-8"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
    music:'<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    edit:'<path d="m15 4 5 5M4 16 16 4a3.5 3.5 0 0 1 5 5L9 21H3z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 4000);
  }
  const formatDate = d => new Intl.DateTimeFormat('en-AU', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${d}T12:00:00Z`));
  const latestPosts = () => [...posts].sort((a,b) => b.date.localeCompare(a.date));
  function inlineMarkdown(text) {
    return escape(text).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }
  function renderMarkdown(text) {
    let inCode = false, list = false, result = '';
    const lines = String(text || '').replace(/\r/g,'').split('\n');
    for (const line of lines) {
      if (line.startsWith('```')) {
        if (list) { result += '</ul>'; list = false; }
        result += inCode ? '</code></pre>' : '<pre><code>';
        inCode = !inCode;
        continue;
      }
      if (inCode) { result += escape(line) + '\n'; continue; }
      if (/^[-*] /.test(line)) {
        if (!list) { result += '<ul>'; list = true; }
        result += `<li>${inlineMarkdown(line.slice(2))}</li>`;
        continue;
      }
      if (list) { result += '</ul>'; list = false; }
      if (/^#{1,3} /.test(line)) {
        const level = Math.max(2,Math.min(line.match(/^#+/)[0].length,3));
        result += `<h${level}>${inlineMarkdown(line.replace(/^#+ /,''))}</h${level}>`;
      } else if (line.startsWith('> ')) result += `<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`;
      else if (line.trim()) result += `<p>${inlineMarkdown(line)}</p>`;
    }
    if (list) result += '</ul>';
    if (inCode) result += '</code></pre>';
    return result;
  }
  window.Portfolio = { icon, escape, base, toast, renderMarkdown, posts, formatDate };
  const timelinePages = {experience:'work',education:'education',volunteering:'volunteering'};
  const timelineRoutes = {work:'experience.html',education:'education.html',volunteering:'volunteering.html'};
  const nav = [ ['dashboard','Dashboard','','grid'],['personal','Personal','personal.html','user'],['experience','Work Experience','experience.html','briefcase'],['education','Education','education.html','graduation'],['volunteering','Volunteering','volunteering.html','heart'],['blog','Journal','blog.html','book'],['contact','Contact','contact.html','mail'] ];
  const pageName = nav.find(n => n[0] === page)?.[1] || 'Writing Studio';
  const storedTheme = (() => { try {return localStorage.getItem('minh-theme');} catch {return null;} })();
  if (storedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
  document.body.innerHTML = `<a class="skip-link" href="#page-content">Skip to content</a>
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
      <a class="brand" href="${base}" aria-label="Minh Nguyen home"><img src="${base}brand-mark.png?v=20261103-brandexact" alt="Minh’s M logo"><span>minh<span class="brand-dot">.</span><small>THE PERSONAL PORTFOLIO</small></span></a>
      <div class="sidebar-scroll">
        <div class="nav-caption">EXPLORE MY WORLD</div>
        <nav>${nav.map(([id,label,url,ic]) => `<a href="${base}${url}" class="nav-item ${id===page?'active':''}" ${id===page?'aria-current="page"':''}>${icon(ic)}<span>${label}</span>${id===page?'<span class="nav-active-dot"></span>':''}</a>`).join('')}</nav>
        <div class="sidebar-note"><span class="tiny-star">✳</span><p>A curious mind.<br>A work in progress.</p><span class="small-muted">Data. People. Possibilities.</span></div>
      </div>
      <div class="sidebar-bottom"><div class="sidebar-profile"><img src="${base}avatar.png" alt=""><div><strong>Minh Nguyen</strong><span>${icon('pin')} Melbourne, AU</span></div></div><div class="sidebar-social"><a href="${escape(config.github)}" target="_blank" rel="noopener noreferrer" aria-label="Minh on GitHub">${icon('github')}</a><a href="mailto:${escape(config.email)}" aria-label="Email Minh">${icon('mail')}</a><span>LET’S CONNECT ${icon('up')}</span></div></div>
    </aside><button class="nav-scrim" aria-label="Close navigation" hidden></button>
    <div class="main-shell"><header class="topbar"><div class="breadcrumbs"><button class="icon-button mobile-menu" aria-label="Open navigation" aria-expanded="false">${icon('menu')}</button><span class="breadcrumb-home">My portfolio</span><span class="breadcrumb-slash">/</span><strong>${pageName}</strong></div><div class="top-actions"><span class="local-time" id="local-time"></span><button class="icon-button search-button" aria-label="Search portfolio (Control K)">${icon('search')}</button><button class="icon-button theme-button" aria-label="Switch colour theme">${icon('moon')}</button></div></header>
    <main id="page-content" tabindex="-1"></main><footer class="site-footer"><span>© ${new Date().getFullYear()} Minh Nguyen <span class="footer-dot">·</span> Made with curiosity.</span><div><a href="${base}studio.html">Writing Studio ${icon('edit')}</a><button class="text-button back-top">Back to top ↑</button></div></footer></div>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <dialog id="search-dialog" class="search-dialog"><div class="search-dialog-head">${icon('search')}<input type="search" id="global-search" placeholder="Search pages and articles…" aria-label="Search pages and articles"><button class="icon-button" data-close-search aria-label="Close search">${icon('close')}</button></div><div id="global-results"></div><div class="search-help">Explore a page or find a thought. <kbd>esc</kbd> to close</div></dialog>`;
  const tags = a => a.map(t=>`<span class="tag">${escape(t)}</span>`).join('');
  const intro = (label,title,desc,extra='') => `<div class="page-intro"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p>${desc}</p></div>${extra}</div>`;
  const logo = e => e.logo ? `<img src="${base}${e.logo}" alt="${escape(e.org)} logo" loading="lazy">` : `<span class="wordmark ${e.id==='siemens'?'siemens':''}">${escape(e.mark)}</span>`;
  const logoFrame = e => `<div class="org-logo org-logo-${e.id}">${logo(e)}</div>`;
  const chapterHref = e => `${base}${timelineRoutes[e.kind]}#${encodeURIComponent(e.id)}`;
  function miniChapter(e) {
    return `<a href="${chapterHref(e)}" class="mini-timeline-row">${logoFrame(e)}<div><h3>${escape(e.org)}</h3><p>${escape(e.role)}</p></div><span>${escape(e.period)}</span>${icon('chevron')}</a>`;
  }

  function postCard(post, i=0) {
    return `<a class="post-card" href="${base}blog.html?post=${encodeURIComponent(post.id)}"><div class="post-art art-${i%3}" aria-hidden="true"><span class="art-category">${escape(post.category)}</span><div class="abstract-shape"></div><span class="art-number">${String(i+1).padStart(2,'0')}</span>${icon(i%2?'layers':'book')}</div><div class="post-card-content"><div class="post-meta">${formatDate(post.date)}<span>·</span>${post.readTime || 2} min read${post.sample?'<span class="sample-label">Starter article</span>':''}</div><h3>${escape(post.title)} ${icon('up')}</h3><p>${escape(post.excerpt)}</p></div></a>`;
  }
  function dashboard() {
    const work = config.experience.filter(e=>e.kind==='work');
    const education = config.experience.filter(e=>e.kind==='education').slice(0,2);
    const volunteering = config.experience.filter(e=>e.kind==='volunteering');
    return `<div class="dashboard-heading"><div><p class="eyebrow">WELCOME TO MY CORNER OF THE INTERNET</p><h1>A little introduction<span class="heading-dot">.</span></h1></div><span class="outlined-pill">${icon('pin')} ${escape(config.location)}</span></div>
    <section class="hero"><div class="hero-copy"><span class="hero-kicker"><span class="status-dot"></span> DATA SCIENCE × BUSINESS INTELLIGENCE</span><h2>Hi, I’m Minh.<br>I make data<br><span>make sense.</span></h2><p>${escape(config.summary)}<br>Currently learning, building and connecting the dots in Melbourne.</p><div class="hero-actions"><a class="button lime" href="${base}experience.html">Explore my work ${icon('arrow')}</a><a class="hero-contact" href="${base}contact.html">Let’s talk ${icon('up')}</a></div><div class="hero-footnote"><span class="mini-line"></span> A CURIOUS MIND, ALWAYS IN MOTION</div></div><div class="hero-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="portrait-frame"><img src="${base}avatar.png" alt="Portrait of Minh Nguyen" fetchpriority="high"></div><div class="photo-label"><span class="status-dot"></span><div><strong>Minh Nguyen</strong><span>Data person. Music person. People person.</span></div>${icon('up')}</div><span class="hero-star">✳</span></div></section>
    <div class="quick-grid"><a class="quick-card" href="${base}personal.html"><span class="quick-icon blue">${icon('user')}</span><div><span>A LITTLE ABOUT ME</span><h3>Beyond the résumé</h3><p>The person behind the data.</p></div>${icon('up')}</a><a class="quick-card" href="${base}blog.html"><span class="quick-icon peach">${icon('book')}</span><div><span>THE OPEN NOTEBOOK</span><h3>Ideas & observations</h3><p>Learning, one note at a time.</p></div>${icon('up')}</a><a class="quick-card" href="${base}Mario_Nguyen.pdf" download><span class="quick-icon green">${icon('download')}</span><div><span>THE SHORT VERSION</span><h3>Grab my résumé</h3><p>Experience, skills and education.</p></div>${icon('up')}</a></div>
    <div class="home-chapters"><section class="panel journey-panel"><div class="section-head"><div><p class="eyebrow">PUTTING DATA TO WORK</p><h2>Work experience</h2></div><a class="text-link" href="${base}experience.html">View work ${icon('arrow')}</a></div><div class="mini-timeline">${work.map(miniChapter).join('')}</div></section>
    <section class="panel journey-panel"><div class="section-head"><div><p class="eyebrow">BUILDING THE FOUNDATION</p><h2>Education</h2></div><a class="text-link" href="${base}education.html">View education ${icon('arrow')}</a></div><div class="mini-timeline">${education.map(miniChapter).join('')}</div></section></div>
    <section class="panel community-preview"><div class="section-head"><div><p class="eyebrow">BEYOND THE SCREEN</p><h2>Music & community</h2></div><a class="text-link" href="${base}volunteering.html">Volunteering ${icon('arrow')}</a></div><div class="community-organisations">${volunteering.map(e=>`<a class="community-organisation" href="${chapterHref(e)}">${logoFrame(e)}<div><strong>${escape(e.id==='social-work'?'Social Work Team · CTXH':e.org)}</strong><span>${escape(e.role)}</span></div>${icon('up')}</a>`).join('')}</div></section>
    <section class="journal-preview"><div class="section-head"><div><p class="eyebrow">FROM THE JOURNAL</p><h2>Notes along the way</h2></div><a class="text-link" href="${base}blog.html">Visit the journal ${icon('arrow')}</a></div><div class="journal-home-grid">${latestPosts().slice(0,2).map(postCard).join('')}<a class="journal-invitation" href="${base}contact.html"><span>GOOD WORK STARTS WITH A CONVERSATION</span><h3>Have something<br>in mind?</h3><span class="round-arrow">${icon('up')}</span><p>I’d love to hear about it.</p></a></div></section>`;
  }
  function personal() {
    return `${intro('THE PERSON BEHIND THE DATA','A curious mind.<br>A few different worlds.','Data science is part of my story. Here’s a little more of it.')}<section class="about-grid"><div class="about-portrait"><img src="${base}avatar.png" alt="Minh Nguyen"><div><span>NGUYỄN ĐỨC MINH</span><strong>Minh, or Mario.</strong></div></div><div class="about-copy panel"><span class="badge">${icon('pin')} Melbourne, Australia</span><h2>Hello, I’m Minh<span class="heading-dot">.</span></h2>${config.about.map(p=>`<p>${escape(p)}</p>`).join('')}<div class="about-facts"><div><span>BASED IN</span><strong>Melbourne, Australia</strong></div><div><span>STUDYING</span><strong>Master of Data Science</strong></div><div><span>MY FOCUS</span><strong>Data → insight → decisions</strong></div><div><span>ALSO KNOWN AS</span><strong>${escape(config.alternateName)}</strong></div></div><a class="text-link" href="${base}contact.html">Say hello ${icon('arrow')}</a></div></section>
    <section class="skills-section"><div class="section-head"><div><p class="eyebrow">MY TOOLKIT</p><h2>Tools I think with</h2></div><span class="muted">Always room to learn something new.</span></div><div class="skills-grid">${config.skills.map((g,i)=>`<div class="skill-card"><span class="skill-number">0${i+1}</span><h3>${escape(g.name)}</h3><div class="tags">${tags(g.items)}</div></div>`).join('')}</div></section><section class="outside-card"><div class="outside-icon">${icon('music')}</div><div><p class="eyebrow">BEYOND THE SCREEN</p><h2>There’s room for music, too.</h2><p>As a Live Music Volunteer at the Royal Melbourne Hospital, I bring another part of myself into the community. It’s a different way to connect with people.</p></div><a href="${base}volunteering.html#rmh" class="button secondary">The full story ${icon('arrow')}</a></section>`;
  }
  function focusSection(title,projects) {
    if(!projects.length) return '';
    return `<section class="project-section"><div class="section-head"><div><p class="eyebrow">A CLOSER LOOK</p><h2>${title}</h2></div></div><div class="project-grid ${projects.length===1?'project-grid-single':''}">${projects.map((p,i)=>`<article class="project-card"><div class="project-symbol symbol-${i}">${icon(p.icon)}</div><p class="eyebrow">${escape(p.category)}</p><h3>${escape(p.title)}</h3><p>${escape(p.summary)}</p><div class="tags">${tags(p.tags)}</div></article>`).join('')}</div></section>`;
  }
  function timelinePage(kind) {
    const content = {
      work:{eyebrow:'WORK EXPERIENCE',title:'Turning data into<br>practical decisions.',description:'Industry experience in business intelligence, finance reporting and data science.',count:'industry roles',projects:config.projects.filter(p=>p.category.startsWith('Experience')),focus:'Work in focus'},
      education:{eyebrow:'EDUCATION',title:'A foundation in curiosity.<br>A journey in learning.',description:'My education, from the first school chapters to postgraduate data science.',count:'education chapters',projects:config.projects.filter(p=>p.category==='Capstone project'),focus:'Learning in practice'},
      volunteering:{eyebrow:'VOLUNTEERING',title:'Music and community.<br>Different ways to contribute.',description:'Live music at the Royal Melbourne Hospital and social work at Le Hong Phong.',count:'community roles',projects:[],focus:''}
    }[kind];
    const count = config.experience.filter(e=>e.kind===kind).length;
    return `${intro(content.eyebrow,content.title,content.description,`<a class="button primary" href="${base}Mario_Nguyen.pdf" download>${icon('download')} Download résumé</a>`)}
    <div class="timeline-toolbar"><span class="outlined-pill">${count} ${content.count}</span><div class="timeline-controls"><button class="text-button" id="timeline-expand" type="button">Expand details ${icon('chevron')}</button><label class="timeline-order-label"><span class="visually-hidden">Timeline order</span><select class="select timeline-order-select" id="timeline-order"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div></div>
    <div id="timeline" class="timeline"></div>${focusSection(content.focus,content.projects)}`;
  }
  function experience(){return timelinePage('work');}
  function education(){return timelinePage('education');}
  function volunteering(){return timelinePage('volunteering');}
  function drawTimeline(kind,order='newest') {
    const entries = config.experience.filter(e=>e.kind===kind).sort((a,b)=>order==='oldest'?a.start.localeCompare(b.start):b.start.localeCompare(a.start));
    $('#timeline').innerHTML = entries.map(e=>`<article class="timeline-entry" id="${e.id}"><div class="timeline-date"><strong>${escape(e.period.split(' — ')[0])}</strong><span>${escape(e.kind==='work'?'Work experience':e.kind==='education'?'Education':'Volunteering')}</span></div><div class="timeline-node"></div><div class="timeline-card"><div class="timeline-card-head">${logoFrame(e)}<div><h2>${escape(e.org)}</h2><p>${escape(e.role)}</p></div><span class="badge ${e.period.includes('Present')?'current-badge':''}">${e.period.includes('Present')?'<span class="status-dot"></span> ':''}${escape(e.period)}</span></div><p class="timeline-summary">${escape(e.summary)}</p>${e.bullets.length?`<details><summary>What this chapter involved ${icon('chevron')}</summary><ul>${e.bullets.map(b=>`<li>${escape(b)}</li>`).join('')}</ul></details>`:''}<div class="tags">${tags(e.tags)}</div></div></article>`).join('');
  }
  function blog() {
    const id = new URLSearchParams(location.search).get('post');
    if (id) {
      const p = posts.find(p=>p.id===id);
      if (!p) return `${intro('THE JOURNAL','This page is still unwritten.','That article could not be found.')}<a href="${base}blog.html" class="button primary">Back to the journal ${icon('arrow')}</a>`;
      document.title = `${p.title} | Minh Nguyen`;
      const other = latestPosts().find(q=>q.id!==p.id);
      return `<div class="reading-progress" aria-hidden="true"></div><article class="article"><a class="text-link article-back" href="${base}blog.html">← Back to journal</a><div class="article-heading"><span class="badge">${escape(p.category)}</span>${p.sample?'<span class="sample-label">Starter article · ready to replace</span>':''}<h1>${escape(p.title)}</h1><p>${escape(p.excerpt)}</p><div class="author-row"><img src="${base}avatar.png" alt=""><span><strong>Minh Nguyen</strong><small>${formatDate(p.date)} · ${p.readTime||2} min read</small></span><button class="icon-button copy-article" aria-label="Copy article link">${icon('copy')}</button></div></div><div class="prose">${renderMarkdown(p.body)}</div><div class="article-end"><span>Thanks for reading.</span><a class="text-link" href="mailto:${escape(config.email)}">Share a thought ${icon('up')}</a></div>${other?`<a class="next-article" href="?post=${encodeURIComponent(other.id)}"><span>NEXT IN THE JOURNAL</span><h2>${escape(other.title)} ${icon('arrow')}</h2></a>`:''}</article>`;
    }
    return `${intro('THE OPEN NOTEBOOK','Ideas, observations<br>& things I’m learning.','Notes on data, business intelligence and life beyond the screen.')}<div class="blog-toolbar"><label class="search-field">${icon('search')}<input id="blog-search" type="search" placeholder="Find a note…" aria-label="Search articles"></label><div class="blog-filters" role="group" aria-label="Filter articles">${['All',...new Set(posts.map(p=>p.category))].map((c,i)=>`<button class="filter-chip ${i===0?'active':''}" data-blog-filter="${escape(c)}" aria-pressed="${i===0}">${escape(c)}</button>`).join('')}</div></div><p class="results-label" id="article-count" aria-live="polite"></p><div class="post-grid" id="post-grid"></div><div class="journal-note">${icon('edit')}<p>A notebook grows one page at a time. More thoughts will find their way here.</p></div>`;
  }
  function drawPosts(category='All', query='') {
    const visible = latestPosts().filter(p=>(category==='All'||p.category===category) && `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    $('#article-count').textContent = `${visible.length} ${visible.length===1?'ARTICLE':'ARTICLES'}`;
    $('#post-grid').innerHTML = visible.length?visible.map(postCard).join(''):`<div class="empty-state">${icon('search')}<h2>No notes found.</h2><p>Try another keyword or choose a different category.</p></div>`;
  }
  function contact() {
    return `${intro('LET’S CONNECT','Good things start<br>with a hello.','A project, an opportunity, a shared interest — I’m happy to hear from you.')}<div class="contact-grid"><section class="contact-info"><div class="contact-feature">${icon('mail')}<span>THE BEST WAY TO REACH ME</span><a href="mailto:${escape(config.email)}">${escape(config.email)} ${icon('up')}</a><button class="text-button copy-email">${icon('copy')} Copy email address</button></div><a class="contact-method panel" href="${escape(config.github)}" target="_blank" rel="noopener noreferrer"><span class="quick-icon blue">${icon('github')}</span><span><strong>Find me on GitHub</strong><small>@nguyenducminh-cloud</small></span>${icon('up')}</a><div class="contact-location panel">${icon('globe')}<div><strong>Based in Melbourne, Australia</strong><span id="contact-time">${icon('clock')} Melbourne local time</span></div><div class="location-mark" aria-hidden="true">MEL</div></div></section><section class="panel contact-form-panel"><h2>What’s on your mind?</h2><p>Leave a little context and let’s start a conversation.</p><form id="contact-form"><div class="form-grid"><label class="field"><span class="field-label">Your name</span><input class="input" name="name" placeholder="Alex Taylor" required maxlength="120" autocomplete="name"></label><label class="field"><span class="field-label">Your email</span><input class="input" name="email" type="email" placeholder="alex@example.com" required maxlength="180" autocomplete="email"></label></div><label class="field"><span class="field-label">Subject</span><input class="input" name="subject" placeholder="Let’s work on something interesting" required maxlength="180"></label><label class="field"><span class="field-label">Message</span><textarea class="textarea" name="message" placeholder="Hi Minh, I’d love to chat about…" required minlength="10" maxlength="5000" rows="6"></textarea></label><button class="button primary" type="submit">Continue to email ${icon('up')}</button><p class="form-help">Opens your email app with a draft. You can review it before sending.</p></form></section></div>`;
  }
  const renderers = {dashboard,personal,experience,education,volunteering,blog,contact};
  if (renderers[page]) $('#page-content').innerHTML = renderers[page]();
  if (timelinePages[page]) {
    const kind=timelinePages[page];
    drawTimeline(kind);
    const expandButton=$('#timeline-expand');
    $('#timeline-order').addEventListener('change',e=>{
      drawTimeline(kind,e.target.value);
      expandButton.innerHTML=`Expand details ${icon('chevron')}`;
    });
    expandButton.addEventListener('click',()=>{
      const details=$$('#timeline details');
      const expand=details.some(el=>!el.open);
      details.forEach(el=>el.open=expand);
      expandButton.innerHTML=`${expand?'Collapse details':'Expand details'} ${icon('chevron')}`;
    });
    if (location.hash) requestAnimationFrame(()=>{
      let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);
      if(target)target.scrollIntoView();
      else{
        const entry=config.experience.find(e=>e.id===id);
        if(entry&&entry.kind!==kind)location.replace(chapterHref(entry));
      }
    });
  }
  if (page === 'blog' && $('#blog-search')) {
    let category = 'All';
    drawPosts();
    $('#blog-search').addEventListener('input',e=>drawPosts(category,e.target.value));
    $$('[data-blog-filter]').forEach(b=>b.addEventListener('click',()=>{
      category = b.dataset.blogFilter;
      $$('[data-blog-filter]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});
      drawPosts(category,$('#blog-search').value);
    }));
  }
  if ($('.reading-progress')) {
    const progress = () => { const h=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.width=(h>0?Math.min(100,scrollY/h*100):100)+'%'; };
    addEventListener('scroll',progress,{passive:true}); progress();
    $('.copy-article').addEventListener('click',()=>copy(location.href,'Article link copied.'));
  }
  function updateTime() {
    const time = new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Melbourne',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
    $('#local-time').innerHTML = `<span class="status-dot"></span> ${time} IN MELBOURNE`;
    if ($('#contact-time')) $('#contact-time').innerHTML = `${icon('clock')} ${time} local time`;
  }
  updateTime(); setInterval(updateTime,30000);
  function updateThemeIcon(){ $('.theme-button').innerHTML=icon(document.documentElement.dataset.theme==='dark'?'sun':'moon');$('.theme-button').setAttribute('aria-label',`Switch to ${document.documentElement.dataset.theme==='dark'?'light':'dark'} theme`); }
  updateThemeIcon();
  $('.theme-button').addEventListener('click',()=>{
    const theme = document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=theme;
    try {localStorage.setItem('minh-theme',theme);} catch {}
    updateThemeIcon();
  });
  const scrim = $('.nav-scrim'), menu = $('.mobile-menu');
  const mobileQuery=matchMedia('(max-width: 700px)');
  function syncMenu(){
    const open=document.body.classList.contains('menu-open');
    const sidebar=$('#sidebar');
    sidebar.inert=mobileQuery.matches&&!open;
    sidebar.setAttribute('aria-hidden',String(mobileQuery.matches&&!open));
  }
  function closeMenu(){ const wasOpen=document.body.classList.contains('menu-open');document.body.classList.remove('menu-open');scrim.hidden=true;menu.setAttribute('aria-expanded','false');syncMenu();if(wasOpen)menu.focus(); }
  menu.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);scrim.hidden=!open;menu.setAttribute('aria-expanded',String(open));syncMenu();if(open)$('#sidebar .nav-item').focus();});
  mobileQuery.addEventListener('change',()=>{if(!mobileQuery.matches)closeMenu();else syncMenu();});
  syncMenu();
  scrim.addEventListener('click',closeMenu);
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  $('.back-top').addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  async function copy(value,msg) {
    try { await navigator.clipboard.writeText(value); toast(msg); }
    catch { const el=document.createElement('textarea');el.value=value;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.select();const ok=document.execCommand('copy');el.remove();toast(ok?msg:`Copy this address: ${value}`); }
  }
  $('.copy-email')?.addEventListener('click',()=>copy(config.email,'Email address copied.'));
  $('#contact-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(e.target);
    const body=`Hi Minh,\n\n${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
    location.href=`mailto:${config.email}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
    toast('Your email draft is ready. Send it from your email app.');
  });
  const dialog=$('#search-dialog');
  const searchIndex=[...nav.map(n=>({title:n[1],detail:'Explore the portfolio',url:base+n[2],type:'Page'})),...posts.map(p=>({title:p.title,detail:p.excerpt,url:`${base}blog.html?post=${encodeURIComponent(p.id)}`,type:'Article'}))];
  function globalSearch(query='') {
    const found=searchIndex.filter(item=>`${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));
    $('#global-results').innerHTML=found.length?found.map(item=>`<a href="${item.url}" class="search-result"><span>${item.type==='Page'?icon('grid'):icon('book')}</span><div><strong>${escape(item.title)}</strong><small>${escape(item.type)}</small></div>${icon('arrow')}</a>`).join(''):'<p class="empty-search">No matches. Try “experience” or “journal”.</p>';
  }
  function openSearch(){closeMenu();globalSearch();dialog.showModal();$('#global-search').value='';$('#global-search').focus();}
  $('.search-button').addEventListener('click',openSearch);
  $('[data-close-search]').addEventListener('click',()=>dialog.close());
  $('#global-search').addEventListener('input',e=>globalSearch(e.target.value));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!dialog.open)openSearch();}});
})();
