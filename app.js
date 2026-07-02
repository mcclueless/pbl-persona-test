/* =========================================================
   UM PBL Persona Test — app logic
   ========================================================= */
(function () {
  'use strict';

  const ORDER = ['collaborator', 'analyst', 'challenger'];

  const state = {
    lang: 'en',
    step: 0,                 // 0..QUESTIONS.length-1
    answers: [],             // chosen persona key per question
    scores: { collaborator: 0, analyst: 0, challenger: 0 },
    openPersona: null,       // which detail panel is shown
    topPersona: null,
  };

  // honour reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced');
  }

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const t  = () => I18N[state.lang];

  /* ---------- Screen switching ---------- */
  function show(screenId) {
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.id === screenId));
    const root = document.querySelector('.app');
    if (root) root.scrollTop = 0;
    const sc = $('#' + screenId);
    if (sc) sc.scrollTop = 0;
  }

  /* ---------- Language ---------- */
  function setLang(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    $$('.lang-toggle button').forEach((b) =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
    renderStart();
    if ($('#screen-quiz').classList.contains('is-active')) renderQuestion();
    if ($('#screen-result').classList.contains('is-active')) renderResult();
    renderModalText();
  }

  /* ---------- START ---------- */
  function renderStart() {
    const T = t();
    $('#start-eyebrow').textContent = T.eyebrow;
    $('#hero-l1').textContent = T.heroLine1;
    $('#hero-l2').textContent = T.heroLine2;
    $('#hero-sub').textContent = T.heroSub;
    $('#start-btn-label').textContent = T.startBtn;
    $('#start-note').textContent = T.startNote;
    const ul = $('#feature-list');
    ul.innerHTML = '';
    T.features.forEach((f) => {
      const li = document.createElement('li');
      li.innerHTML =
        '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' +
        '<span></span>';
      li.lastChild.textContent = f;
      ul.appendChild(li);
    });
  }

  /* ---------- QUIZ ---------- */
  function startQuiz() {
    state.step = 0;
    state.answers = [];
    state.scores = { collaborator: 0, analyst: 0, challenger: 0 };
    show('screen-quiz');
    renderQuestion();
  }

  function renderProgress() {
    const segs = $('#progress-segs');
    segs.innerHTML = '';
    for (let i = 0; i < QUESTIONS.length; i++) {
      const seg = document.createElement('span');
      seg.className = 'seg' + (i < state.step ? ' done' : i === state.step ? ' current' : '');
      seg.innerHTML = '<i></i>';
      segs.appendChild(seg);
    }
    const T = t();
    $('#q-count').innerHTML = '<b>' + (state.step + 1) + '</b> ' + T.ofWord + ' ' + QUESTIONS.length;
    const back = $('#q-back');
    back.hidden = state.step === 0;
    back.querySelector('span').textContent = T.back;
  }

  function renderQuestion() {
    renderProgress();
    const Q = QUESTIONS[state.step];
    const lang = state.lang;
    $('#q-pillar').textContent = Q.pillar[lang];
    $('#q-text').textContent = Q.q[lang];

    const wrap = $('#answers');
    wrap.innerHTML = '';
    const keys = ['A', 'B', 'C'];
    Q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer';
      btn.type = 'button';
      if (state.answers[state.step] === opt.p && wrap.dataset.locked) {
        btn.classList.add('chosen');
      }
      btn.innerHTML =
        '<span class="key">' + keys[i] + '</span><span class="label"></span>';
      btn.querySelector('.label').textContent = opt[lang];
      btn.addEventListener('click', () => choose(opt.p, btn));
      wrap.appendChild(btn);
    });
  }

  function choose(persona, btn) {
    const wrap = $('#answers');
    if (wrap.dataset.busy) return;
    wrap.dataset.busy = '1';

    // if re-answering, remove previous score for this step
    const prev = state.answers[state.step];
    if (prev) state.scores[prev]--;
    state.answers[state.step] = persona;
    state.scores[persona]++;

    $$('.answer', wrap).forEach((b) => b.classList.remove('chosen'));
    btn.classList.add('chosen');

    setTimeout(() => {
      delete wrap.dataset.busy;
      if (state.step < QUESTIONS.length - 1) {
        state.step++;
        renderQuestion();
      } else {
        computeResult();
        show('screen-result');
        renderResult();
      }
    }, 340);
  }

  function goBack() {
    if (state.step === 0) return;
    state.step--;
    renderQuestion();
  }

  /* ---------- RESULT ---------- */
  function computeResult() {
    const total = QUESTIONS.length;
    state.pct = {};
    ORDER.forEach((k) => {
      state.pct[k] = Math.round((state.scores[k] / total) * 100);
    });
    // determine top (ties -> order priority by score then ORDER)
    let top = ORDER[0];
    ORDER.forEach((k) => {
      if (state.scores[k] > state.scores[top]) top = k;
    });
    state.topPersona = top;
    state.openPersona = null; // detail is revealed only on click
  }

  function personaStone(key) {
    const P = PERSONAS[key];
    const meta = P[state.lang];
    const stone = document.createElement('button');
    stone.className = 'stone' +
      (key === state.topPersona ? ' is-top' : '') +
      (key === state.openPersona ? ' is-open' : '');
    stone.type = 'button';
    stone.dataset.persona = key;
    const crown = key === state.topPersona
      ? '<span class="crown">' + t().bestMatch + '</span>' : '';
    stone.innerHTML =
      crown +
      '<span class="stone-ico">' + ICONS[key] + '</span>' +
      '<span class="stone-main">' +
        '<span class="stone-name">' + meta.name + '</span>' +
        '<span class="stone-tag">' + meta.tag + '</span>' +
      '</span>' +
      '<span class="stone-pct">' + state.pct[key] + '%<small>' + t().matchSuffix + '</small></span>';
    stone.addEventListener('click', () => {
      // toggle: clicking the open persona collapses it back to empty
      const willOpen = state.openPersona !== key;
      state.openPersona = willOpen ? key : null;
      $$('.stone').forEach((s) =>
        s.classList.toggle('is-open', willOpen && s.dataset.persona === key)
      );
      renderDetail();
      if (willOpen) {
        const d = $('#detail');
        if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    return stone;
  }

  function renderResult() {
    const T = t();
    $('#result-kicker').textContent = T.resultKicker;
    $('#result-title1').textContent = T.resultTitle1;
    $('#result-title2').textContent = T.resultTitle2;
    $('#tap-hint').textContent = T.tapHint;
    $('#cta-title').textContent = T.ctaTitle;
    $('#cta-text').textContent = T.ctaText;
    $('#cta-btn-label').textContent = T.ctaBtn;
    $('#restart-label').textContent = T.restart;

    const grid = $('#stones-grid');
    grid.innerHTML = '';
    // sort by percentage desc for display, top persona first
    const sorted = ORDER.slice().sort((a, b) => state.pct[b] - state.pct[a]);
    sorted.forEach((k) => grid.appendChild(personaStone(k)));

    renderDetail();
  }

  function renderDetail() {
    const el = $('#detail');
    // no persona selected -> keep the panel empty (hint is the only cue)
    if (!state.openPersona) {
      el.innerHTML = '';
      el.classList.remove('is-shown');
      return;
    }
    const key = state.openPersona;
    const lang = state.lang;
    const P = PERSONAS[key];
    const meta = P[lang];
    const txt = RESULT_TEXT[key][lang];
    const pct = state.pct[key];
    const T = t();

    el.classList.add('is-shown');
    const accent = P.color;

    const bodyHtml = txt.body.map((p) => '<p>' + p + '</p>').join('');

    el.innerHTML =
      '<div class="detail-top">' +
        '<span class="detail-badge" style="background:' + accent + '">' + ICONS[key] + '</span>' +
        '<div>' +
          '<h2 style="color:' + accent + '">' + meta.name + '</h2>' +
          '<div class="pct-line">' + T.youAre + ' <b>' + pct + '%</b> ' + meta.name + '</div>' +
        '</div>' +
      '</div>' +
      '<p>' + txt.intro.replace('{pct}', pct) + '</p>' +
      bodyHtml +
      '<h3 style="color:' + accent + '">' + T.growthTitle + '</h3>' +
      '<div class="grow-card" style="border-left-color:' + accent + '"><p>' + txt.grow + '</p></div>' +
      '<div class="key-message">“' + T.keyMessage + '”</div>';
  }

  /* ---------- MODAL ---------- */
  function openModal() {
    $('#modal-overlay').classList.add('open');
    $('#modal-form').style.display = '';
    $('#modal-success').classList.remove('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  function renderModalText() {
    const T = t();
    $('#modal-title').textContent = T.modalTitle;
    $('#modal-sub').textContent = T.modalSub;
    $('#lbl-name').textContent = T.fName;
    $('#lbl-email').textContent = T.fEmail;
    $('#in-name').placeholder = T.fNamePh;
    $('#in-email').placeholder = T.fEmailPh;
    $('#consent-text').textContent = T.consent;
    $('#send-label').textContent = T.sendBtn;
    $('#success-title').textContent = T.successTitle;
    $('#success-text').textContent = T.successText;
    $('#success-close').textContent = T.close;
  }
  function submitLead(e) {
    e.preventDefault();
    // No backend: this is where a Dynamics / CRM integration would post.
    // We capture the payload (persona + locale) ready for wiring.
    const payload = {
      firstName: $('#in-name').value.trim(),
      email: $('#in-email').value.trim(),
      persona: state.topPersona,
      scores: state.scores,
      locale: state.lang,
      consent: $('#in-consent').checked,
    };
    try { console.log('[PBL lead]', payload); } catch (_) {}
    $('#modal-form').style.display = 'none';
    $('#modal-success').classList.add('show');
  }

  /* ---------- Wire up ---------- */
  function init() {
    renderStart();
    renderModalText();

    $$('.lang-toggle button').forEach((b) =>
      b.addEventListener('click', () => setLang(b.dataset.lang))
    );
    $('#start-btn').addEventListener('click', startQuiz);
    $('#q-back').addEventListener('click', goBack);
    $('#restart-btn').addEventListener('click', () => { show('screen-start'); });
    $('#cta-btn').addEventListener('click', openModal);
    $('#modal-overlay').addEventListener('click', (e) => {
      if (e.target === $('#modal-overlay')) closeModal();
    });
    $('#modal-close').addEventListener('click', closeModal);
    $('#success-close').addEventListener('click', closeModal);
    $('#modal-form').addEventListener('submit', submitLead);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    show('screen-start');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
