/* Browser-local authoring. Publishing always requires uploading the exported file. */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'studio') return;
  const P = window.Portfolio;
  const mount = document.getElementById('page-content');
  if (!P || !mount) return;
  const esc = P.escape;
  const KEY = 'minh-portfolio-drafts-v1';
  const CATEGORIES = ['Data Science', 'Business Intelligence', 'Personal'];
  const MAX_BYTES = 2 * 1024 * 1024;
  const MAX_ARTICLES = 300;
  const existing = Array.isArray(window.PORTFOLIO_POSTS) ? window.PORTFOLIO_POSTS : [];
  let drafts = [];
  let currentId = '';
  let dirty = false;
  let slugEdited = false;
  let storageProblem = false;
  let startupMessage = '';

  const today = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const slugify = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100).replace(/-+$/g, '');
  const readingTime = text => Math.max(1, Math.ceil(String(text).trim().split(/\s+/).filter(Boolean).length / 220));

  function assertArticleLimit(localDrafts, currentPost = null) {
    const ids = new Set(existing.map(post => post.id));
    localDrafts.forEach(post => ids.add(post.id));
    if (currentPost) ids.add(currentPost.id);
    if (localDrafts.length > MAX_ARTICLES || ids.size > MAX_ARTICLES) {
      throw new Error(`Keep at most ${MAX_ARTICLES} unique articles across the site file and local drafts. Delete an unused local draft before adding another.`);
    }
  }

  function validatePost(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Every article must be an object.');
    const string = (key, max, required = true) => {
      if (typeof value[key] !== 'string') {
        if (!required && value[key] == null) return '';
        throw new Error(`Article ${key} must be text.`);
      }
      const result = value[key].trim();
      if ((required && !result) || result.length > max) throw new Error(`Article ${key} is empty or too long.`);
      return result;
    };
    const id = string('id', 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Article IDs can contain lowercase letters, numbers and single hyphens.');
    const date = string('date', 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) {
      throw new Error('Choose a valid article date.');
    }
    const category = string('category', 100);
    if (!CATEGORIES.includes(category)) throw new Error(`Choose one of these categories: ${CATEGORIES.join(', ')}.`);
    const body = string('body', 250000);
    return {
      id, title: string('title', 140), excerpt: string('excerpt', 350, false),
      category, date, readTime: readingTime(body), body, sample: value.sample === true
    };
  }

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Stored drafts are not a valid article list.');
      if (parsed.length > MAX_ARTICLES) throw new Error(`Stored drafts exceed the ${MAX_ARTICLES}-article limit. They have been kept unchanged in browser storage.`);
      const loaded = [...new Map(parsed.map(p => { const valid = validatePost(p); return [valid.id, valid]; })).values()];
      assertArticleLimit(loaded);
      drafts = loaded;
    }
  } catch (error) { storageProblem = true; startupMessage = error.message; }

  mount.innerHTML = `
    <style>
      .studio-grid{display:grid;grid-template-columns:250px minmax(0,1fr);gap:24px;align-items:start}
      .studio-sidebar{display:flex;flex-direction:column;gap:18px;padding:24px}
      .studio-form{padding:28px;min-width:0}
      .studio-form .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      .studio-form .field{display:flex;flex-direction:column;gap:7px;margin-bottom:20px}
      .studio-form label,.studio-sidebar label{font-weight:650;font-size:13px}
      .studio-form small,.studio-sidebar small{font-size:12px;line-height:1.65}
      .studio-form .textarea{width:100%;resize:vertical;min-height:100px;box-sizing:border-box}
      .studio-form .markdown-input{min-height:360px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;line-height:1.8}
      .studio-form .form-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:22px}
      .studio-library-select{width:100%;max-width:100%;margin-top:9px}
      .studio-sidebar .button{width:100%;justify-content:center}
      .studio-divider{border:0;border-top:1px solid var(--border,#dfe5e8);margin:2px 0}
      .studio-note{font-size:12px;line-height:1.8;margin:0}
      .studio-status{font-size:12px;margin-top:12px;min-height:18px}
      .studio-preview{background:var(--surface,#fff);color:var(--text,#152d43);border:1px solid var(--border,#dfe5e8);border-radius:20px;width:min(760px,calc(100vw - 32px));max-height:86vh;padding:0;box-sizing:border-box;overflow:auto}
      .studio-preview::backdrop{background:rgba(8,22,35,.65);backdrop-filter:blur(5px)}
      .studio-preview-header{display:flex;justify-content:space-between;align-items:center;padding:18px 26px;border-bottom:1px solid var(--border,#dfe5e8)}
      .studio-preview-content{padding:30px clamp(20px,5vw,48px) 46px;overflow-wrap:anywhere}
      .studio-preview-content h1{font-size:clamp(28px,5vw,42px);line-height:1.15;margin:20px 0}
      .studio-preview-content .prose img{max-width:100%}
      .studio-export-note{border-left:3px solid var(--accent,#9fcd61);padding:3px 0 3px 14px}
      .studio-form .studio-danger{color:#b94a49;font-size:12px}
      .studio-field-caption{display:flex;align-items:center;justify-content:space-between;gap:12px}
      @media(max-width:900px){.studio-grid{grid-template-columns:1fr}.studio-sidebar{display:grid;grid-template-columns:1fr 1fr;gap:16px}.studio-sidebar .studio-wide{grid-column:1/-1}.studio-sidebar .studio-divider{display:none}}
      @media(max-width:560px){.studio-sidebar{display:flex}.studio-form{padding:20px}.studio-form .form-grid{grid-template-columns:1fr;gap:0}.studio-form .form-actions .button{flex:1}.studio-field-caption{align-items:start;flex-direction:column;gap:4px}}
    </style>
    <div class="page-intro">
      <div>
        <p class="eyebrow">A place to put your thoughts</p>
        <h1>Writing studio<span class="accent">.</span></h1>
        <p class="muted">Write, preview and prepare your next article. Your drafts stay in this browser until you export them.</p>
      </div>
    </div>
    <div class="studio-grid">
      <aside class="panel studio-sidebar" aria-label="Article library and export tools">
        <div class="studio-wide">
          <p class="eyebrow">Your library</p>
          <label for="studio-library">Open an article or draft</label>
          <select class="select input studio-library-select" id="studio-library"><option value="">New article</option></select>
          <p class="muted studio-note" id="studio-library-count"></p>
        </div>
        <button class="button secondary" id="studio-new" type="button">New article <span aria-hidden="true">+</span></button>
        <hr class="studio-divider studio-wide">
        <div class="studio-wide studio-export-note">
          <strong style="font-size:13px">Ready to publish?</strong>
          <p class="muted studio-note">Download <code>posts.js</code>, replace <code>posts.js</code> in your GitHub repository, then commit. The export includes your existing articles, saved drafts and the current form.</p>
        </div>
        <button class="button primary" id="studio-export" type="button">Download posts.js <span aria-hidden="true">↓</span></button>
        <button class="button secondary" id="studio-backup" type="button">Back up as JSON <span aria-hidden="true">↓</span></button>
        <button class="button ghost" id="studio-import" type="button">Import JSON backup <span aria-hidden="true">↑</span></button>
        <input type="file" id="studio-import-file" accept="application/json,.json" hidden>
        <p class="muted studio-note studio-wide">This studio has no sign-in or publishing access. Visitors cannot change your live site here. Local drafts are visible only in the browser where they were saved.</p>
      </aside>
      <section class="panel studio-form" aria-labelledby="editor-heading">
        <div class="section-head"><h2 class="section-title" id="editor-heading">A new idea</h2><span class="badge" id="studio-state">New draft</span></div>
        <form id="studio-form">
          <div class="field"><label class="field-label" for="studio-title">Article title</label><input class="input" id="studio-title" name="title" maxlength="140" placeholder="What have you been thinking about?" required autocomplete="off"></div>
          <div class="form-grid">
            <div class="field"><label class="field-label" for="studio-slug">URL slug</label><input class="input" id="studio-slug" name="slug" maxlength="100" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="a-new-idea" required autocomplete="off"><small class="muted">Lowercase letters, numbers and hyphens. Changing a published slug creates a separate article.</small></div>
            <div class="field"><label class="field-label" for="studio-date">Article date</label><input class="input" id="studio-date" name="date" type="date" required></div>
          </div>
          <div class="field"><label class="field-label" for="studio-category">Category</label><select class="select input" id="studio-category" name="category">${CATEGORIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></div>
          <div class="field"><label class="field-label" for="studio-excerpt">Short introduction</label><textarea class="textarea input" id="studio-excerpt" name="excerpt" maxlength="350" rows="3" placeholder="A short summary for the blog listing."></textarea></div>
          <div class="field">
            <div class="studio-field-caption"><label class="field-label" for="studio-body">Article · Markdown</label><span class="muted" id="studio-word-count" style="font-size:12px">0 words · 1 min read</span></div>
            <textarea class="textarea input markdown-input" id="studio-body" name="body" maxlength="250000" rows="16" required placeholder="Start writing here…&#10;&#10;## A section heading&#10;&#10;Use **bold**, *italics*, links and lists."></textarea>
            <small class="muted">Use ## headings, **bold**, *italics*, - lists, &gt; quotes, [link text](https://example.com) and fenced code blocks.</small>
          </div>
          <div class="form-actions">
            <button class="button primary" type="submit">Save draft</button>
            <button class="button secondary" id="studio-preview" type="button">Preview article</button>
            <button class="button ghost studio-danger" id="studio-delete" type="button" hidden>Delete local draft</button>
          </div>
          <p class="studio-status muted" id="studio-status" role="status" aria-live="polite">${storageProblem ? 'Browser storage is unavailable or could not be read. Export a backup to keep your writing.' : 'Drafts are saved only when you choose Save draft. Export a backup before clearing browser data.'}</p>
        </form>
      </section>
    </div>
    <dialog class="studio-preview" id="studio-preview-dialog" aria-labelledby="studio-preview-title">
      <div class="studio-preview-header"><span class="eyebrow" style="margin:0">Article preview</span><button class="button ghost" id="studio-close-preview" type="button" aria-label="Close article preview">Close ×</button></div>
      <div class="studio-preview-content" id="studio-preview-content"></div>
    </dialog>`;

  const $ = id => document.getElementById(id);
  const fields = {
    title: $('studio-title'), id: $('studio-slug'), date: $('studio-date'),
    category: $('studio-category'), excerpt: $('studio-excerpt'), body: $('studio-body')
  };
  const status = message => { $('studio-status').textContent = message; };

  function mergedPosts(includeForm = false) {
    const map = new Map(existing.map(p => [p.id, p]));
    drafts.forEach(p => map.set(p.id, p));
    if (includeForm && (fields.title.value.trim() || fields.body.value.trim() || fields.id.value.trim())) {
      const current = readForm();
      assertArticleLimit(drafts, current);
      if (!confirmReplacement(current, 'include it in this export')) return null;
      map.set(current.id, current);
    }
    if (includeForm) assertArticleLimit(drafts);
    return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function confirmReplacement(post, action) {
    if (post.id === currentId) return true;
    const collision = drafts.find(article => article.id === post.id) || existing.find(article => article.id === post.id);
    if (!collision) return true;
    const confirmed = window.confirm(`The slug “${post.id}” already belongs to “${collision.title}”. Replace that article with the current form and ${action}?`);
    if (!confirmed) status('Canceled. The existing article has been kept. Choose a different slug to create a separate article.');
    return confirmed;
  }

  function refreshLibrary(selected = '') {
    const posts = mergedPosts();
    const draftIds = new Set(drafts.map(d => d.id));
    $('studio-library').innerHTML = '<option value="">New article</option>' + posts.map(post =>
      `<option value="${esc(post.id)}">${esc(post.title)}${draftIds.has(post.id) ? ' · local draft' : ' · site file'}</option>`
    ).join('');
    $('studio-library').value = selected;
    $('studio-library-count').textContent = `${existing.length} in site file · ${drafts.length} local draft${drafts.length === 1 ? '' : 's'}`;
    $('studio-delete').hidden = !draftIds.has(currentId);
  }

  function updateCount() {
    const words = fields.body.value.trim().split(/\s+/).filter(Boolean).length;
    $('studio-word-count').textContent = `${words.toLocaleString()} word${words === 1 ? '' : 's'} · ${readingTime(fields.body.value)} min read`;
  }

  function load(post) {
    currentId = post ? post.id : '';
    Object.entries(fields).forEach(([key, field]) => { field.value = post ? (post[key] || '') : ''; });
    if (!post) { fields.date.value = today(); fields.category.value = CATEGORIES[0]; }
    slugEdited = Boolean(post);
    dirty = false;
    $('editor-heading').textContent = post ? 'Keep the idea moving' : 'A new idea';
    $('studio-state').textContent = post ? (drafts.some(d => d.id === post.id) ? 'Local draft' : 'From site file') : 'New draft';
    status(post ? 'Editing here does not change the live article. Save a draft or export when you are ready.' : 'Drafts are saved only when you choose Save draft. Export a backup before clearing browser data.');
    updateCount();
    refreshLibrary(currentId);
  }

  function readForm() {
    return validatePost(Object.fromEntries([...Object.entries(fields).map(([key, field]) => [key, field.value]), ['sample', false]]));
  }

  function persist(nextDrafts) {
    try {
      localStorage.setItem(KEY, JSON.stringify(nextDrafts));
      drafts = nextDrafts;
      storageProblem = false;
      return true;
    } catch (_) {
      status('The browser could not save this draft. Download a JSON backup or posts.js now to keep your work.');
      P.toast('Browser storage is unavailable. Please export your writing.');
      return false;
    }
  }

  function save(event) {
    event.preventDefault();
    try {
      const post = readForm();
      const next = drafts.filter(p => p.id !== post.id);
      next.push(post);
      assertArticleLimit(next);
      if (!confirmReplacement(post, 'save a local draft')) return;
      if (!persist(next)) return;
      currentId = post.id;
      dirty = false;
      slugEdited = true;
      refreshLibrary(currentId);
      $('studio-state').textContent = 'Local draft';
      status('Draft saved in this browser. Download posts.js and upload it to GitHub to publish.');
      P.toast('Draft saved in this browser.');
    } catch (error) { status(error.message); P.toast(error.message); }
  }

  function download(filename, type, value) {
    const url = URL.createObjectURL(new Blob([value], {type}));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function serialize(value) {
    return JSON.stringify(value, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  function exportPosts(asBackup = false) {
    try {
      const posts = mergedPosts(true);
      if (!posts) return;
      if (asBackup) {
        download('minh-blog-backup.json', 'application/json;charset=utf-8', serialize({version: 1, exportedAt: new Date().toISOString(), posts}));
        status('JSON backup downloaded. It includes the current form, local drafts and articles from the site file.');
      } else {
        download('posts.js', 'text/javascript;charset=utf-8', '/* Articles for Minh Nguyen’s portfolio. Generated in the writing studio. */\nwindow.PORTFOLIO_POSTS = ' + serialize(posts) + ';\n');
        status('posts.js downloaded. Replace posts.js in your GitHub repository and commit to publish these articles.');
      }
      P.toast(asBackup ? 'JSON backup downloaded.' : 'posts.js downloaded — upload it to GitHub to publish.');
    } catch (error) { status(error.message); P.toast(error.message); }
  }

  function preview() {
    try {
      const post = readForm();
      $('studio-preview-content').innerHTML = `<div class="eyebrow">${esc(post.category)} · ${esc(P.formatDate(post.date))} · ${post.readTime} min read</div><h1 id="studio-preview-title">${esc(post.title)}</h1>${post.excerpt ? `<p class="muted">${esc(post.excerpt)}</p>` : ''}<div class="prose">${P.renderMarkdown(post.body)}</div>`;
      $('studio-preview-dialog').showModal();
    } catch (error) { status(error.message); P.toast(error.message); }
  }

  $('studio-form').addEventListener('submit', save);
  $('studio-form').addEventListener('input', () => {
    dirty = true;
    $('studio-state').textContent = 'Unsaved changes';
    status('Unsaved changes. Save a draft or export to keep them.');
  });
  fields.title.addEventListener('input', () => { if (!slugEdited) fields.id.value = slugify(fields.title.value); });
  fields.id.addEventListener('input', () => { slugEdited = true; });
  fields.body.addEventListener('input', updateCount);

  $('studio-library').addEventListener('change', event => {
    const selected = event.target.value;
    if (dirty && !window.confirm('Discard unsaved changes and open another article?')) { event.target.value = currentId; return; }
    load(mergedPosts().find(p => p.id === selected));
  });
  $('studio-new').addEventListener('click', () => {
    if (dirty && !window.confirm('Discard unsaved changes and start a new article?')) return;
    load();
    fields.title.focus();
  });
  $('studio-delete').addEventListener('click', () => {
    if (!drafts.some(p => p.id === currentId) || !window.confirm('Delete this local draft? Any article already in the site file will be kept.')) return;
    if (!persist(drafts.filter(p => p.id !== currentId))) return;
    load(existing.find(p => p.id === currentId));
    P.toast('Local draft deleted. The site file is unchanged.');
  });
  $('studio-export').addEventListener('click', () => exportPosts(false));
  $('studio-backup').addEventListener('click', () => exportPosts(true));
  $('studio-preview').addEventListener('click', preview);
  $('studio-close-preview').addEventListener('click', () => $('studio-preview-dialog').close());
  $('studio-preview-dialog').addEventListener('click', event => { if (event.target === $('studio-preview-dialog')) $('studio-preview-dialog').close(); });
  $('studio-import').addEventListener('click', () => $('studio-import-file').click());
  $('studio-import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > MAX_BYTES) throw new Error('Choose a JSON backup smaller than 2 MB.');
      const parsed = JSON.parse(await file.text());
      const records = Array.isArray(parsed) ? parsed : parsed.posts;
      if (!Array.isArray(records) || records.length > MAX_ARTICLES) throw new Error(`The backup must contain an array of up to ${MAX_ARTICLES} articles.`);
      const imported = records.map(validatePost);
      if (new Set(imported.map(p => p.id)).size !== imported.length) throw new Error('The backup contains duplicate article IDs. Give each article a unique slug.');
      const nextMap = new Map(drafts.map(p => [p.id, p]));
      imported.forEach(p => nextMap.set(p.id, p));
      assertArticleLimit([...nextMap.values()]);
      if (dirty && !window.confirm('Import this backup and discard the current unsaved form?')) return;
      if (!persist([...nextMap.values()])) return;
      load(imported[0]);
      status(`${imported.length} article${imported.length === 1 ? '' : 's'} imported as local drafts. Matching slugs replace local drafts only. Export posts.js to publish.`);
      P.toast('JSON backup imported.');
    } catch (error) {
      const message = error instanceof SyntaxError ? 'This file is not valid JSON. Import a JSON backup exported by this studio.' : error.message;
      status(message);
      P.toast(message);
    } finally { event.target.value = ''; }
  });
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  load();
  if (storageProblem) status(`${startupMessage || 'Browser storage could not be read.'} Download a backup to keep new writing. Existing stored drafts have not been overwritten.`);
})();
