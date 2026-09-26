import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://abdullahaffun.afnworks.workers.dev').replace(/\/$/, '');

const css = await fs.readFile(path.join(src, 'styles.css'), 'utf8');
const js = await fs.readFile(path.join(src, 'site.js'), 'utf8');
const themeJs = await fs.readFile(path.join(src, 'theme-preload.js'), 'utf8');
const base = await fs.readFile(path.join(src, 'base.html'), 'utf8');

const pages = {
  home: '/',
  work: '/work/',
  explore: '/explore/',
  origin: '/origin/',
  about: '/about/',
  contact: '/contact/',
};

const esc = (s) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow = (direction='up-right') => {
  const paths = {
    'up-right': 'M4 16 L16 4 M8 4 H16 V12',
    'down-right': 'M4 4 L16 16 M8 16 H16 V8',
    'up': 'M10 16 V4 M5 9 L10 4 L15 9',
    'left': 'M16 10 H4 M4 10 L10 4 M4 10 L10 16',
    'right': 'M4 10 H16 M16 10 L10 4 M16 10 L10 16',
  };
  return `<span class="link-arrow link-arrow-${direction}" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="${paths[direction] || paths['up-right']}" /></svg></span>`;
};
const rootFor = (pathname) => (pathname === '/' || pathname === '/404.html') ? '' : '../';
const canonical = (pathname) => SITE_URL ? `<link rel="canonical" href="${SITE_URL}${pathname}">` : `<link rel="canonical" href="${pathname}">`;
const jsonld = (pageUrl) => JSON.stringify({
  '@context':'https://schema.org',
  '@type':'Person',
  '@id': SITE_URL ? `${SITE_URL}/#person` : '/#person',
  name:'Abdullah Affun',
  url:SITE_URL ? `${SITE_URL}${pageUrl}` : pageUrl,
  sameAs:['https://github.com/abdullahaffun-dev','https://www.linkedin.com/in/abdullah-affun/'],
  mainEntityOfPage:{'@type':'ProfilePage', '@id': SITE_URL ? `${SITE_URL}${pageUrl}` : pageUrl}
}).replaceAll('<','\\u003c');

function hero() {
  return `<section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-copy">
        <div class="hero-boundary" aria-hidden="true"></div>
        <p class="section-label hero-kicker">01 / Hero</p>
        <h1 id="hero-title" class="hero-title reveal"><span>CURIOSITY</span><span class="line-2">OUT OF BOUNDS</span></h1>
        <div class="hero-secondary reveal">
          <p>Beyond disciplines.</p>
          <p>Across ideas.</p>
          <p class="muted">Exploring to understand.</p>
          <p class="muted">Building to find out.</p>
        </div>
      </div>
      <div class="scene-wrap reveal" aria-label="Optional interactive spatial structure. The same concept is represented elsewhere through normal page content.">
        <canvas id="hero-canvas" role="img" aria-label="Interactive abstract architectural structure"></canvas>
        <div class="scene-interaction" data-cursor="interactive" aria-hidden="true"></div>
        <div id="hero-scene-fallback" class="scene-fallback" aria-hidden="true">
          <svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg">
            <rect class="sf-boundary" x="90" y="70" width="420" height="380"/>
            <path class="sf-line" d="M125 160 L285 95 L470 175 L330 250 L125 160 M160 365 L320 290 L470 350 L320 425 L160 365 M285 95 L320 290 M470 175 L470 350 M125 160 L160 365"/>
            <circle class="sf-node" cx="125" cy="160" r="5"/><circle class="sf-node" cx="285" cy="95" r="5"/><circle class="sf-node" cx="470" cy="175" r="5"/><circle class="sf-node" cx="330" cy="250" r="6"/><circle class="sf-node" cx="320" cy="290" r="5"/><circle class="sf-node" cx="470" cy="350" r="5"/><circle class="sf-node" cx="160" cy="365" r="5"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="hero-scroll"><a href="#offensive-security" data-cursor-state="offensive-security">OFFENSIVE SECURITY SERVICES ${arrow('down-right')}</a></div>
  </section>
  <div class="signature-transition" aria-hidden="true"><div><div class="transition-line"></div></div></div>`;
}


function connections() {
  return `<section id="connections" class="section" aria-labelledby="connections-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">02 / Connections</p><div><h2 id="connections-title" class="section-title">I DON'T LIKE WALLS.</h2><p class="section-intro">Between disciplines.<br>Between ideas.<br>Between theory and practice.</p></div></div>
      <div class="connection-area reveal">
        <svg class="connection-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          <line class="connection-line" data-from="cybersecurity" data-to="python" x1="18.5%" y1="29.46%" x2="43.5%" y2="20.54%"/>
          <line class="connection-line" data-from="cybersecurity" data-to="systems" x1="18.5%" y1="29.46%" x2="38%" y2="63.39%"/>
          <line class="connection-line" data-from="python" data-to="ai" x1="43.5%" y1="20.54%" x2="70.5%" y2="41.96%"/>
          <line class="connection-line" data-from="python" data-to="systems" x1="43.5%" y1="20.54%" x2="38%" y2="63.39%"/>
          <line class="connection-line" data-from="ai" data-to="mathematics" x1="70.5%" y1="41.96%" x2="76%" y2="76.79%"/>
          <line class="connection-line" data-from="systems" data-to="mathematics" x1="38%" y1="63.39%" x2="76%" y2="76.79%"/>
        </svg>
        <button class="connection-node" data-cursor-state="node" aria-pressed="false" data-node="cybersecurity" ><span class="node-core" aria-hidden="true"></span><span class="node-name">Cybersecurity</span><span class="node-role">Security</span></button>
        <button class="connection-node" data-cursor-state="node" aria-pressed="false" data-node="python" ><span class="node-core" aria-hidden="true"></span><span class="node-name">Python</span><span class="node-role">Programming</span></button>
        <button class="connection-node" data-cursor-state="node" aria-pressed="false" data-node="ai" ><span class="node-core" aria-hidden="true"></span><span class="node-name">AI</span><span class="node-role">Intelligence</span></button>
        <button class="connection-node" data-cursor-state="node" aria-pressed="false" data-node="systems" ><span class="node-core" aria-hidden="true"></span><span class="node-name">Systems</span><span class="node-role">Infrastructure</span></button>
        <button class="connection-node" data-cursor-state="node" aria-pressed="false" data-node="mathematics" ><span class="node-core" aria-hidden="true"></span><span class="node-name">Mathematics</span><span class="node-role">Structure</span></button>
      </div>
      <div class="connection-details reveal" role="status" aria-live="polite"><strong data-connection-title>Cybersecurity</strong><p data-connection-text></p></div>
    </div>
  </section>`;
}

function explore() {
  const items = site.explorationAreas;
  return `<section id="explore" class="section" aria-labelledby="explore-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">05 / Explore</p><div><h2 id="explore-title" class="section-title">CURRENTLY INSIDE MY HEAD</h2><p class="section-intro">These aren't labels.<br>They're directions.</p></div></div>
      <div class="explore-grid" data-active-topic="">
        ${items.map((item) => `<article class="explore-item reveal" data-intensity="${item.intensity}" data-topic="${esc(item.name)}" tabindex="0" aria-label="${esc(item.name)} — current exploration intensity ${item.intensity} of 5"><div class="explore-top"><h3 class="explore-name">${esc(item.name)}</h3><span class="explore-status">Current direction</span></div><p class="explore-desc">${esc(item.description)}</p><div class="attention-meter" aria-hidden="true"><span class="attention-track"><span class="attention-fill"></span></span><span class="attention-value">${item.intensity}/5</span></div><div class="activity-note">Current attention</div><p class="sr-only">${esc(item.name)} is a current exploration area with an intensity of ${item.intensity} out of 5. Intensity means current attention and exploration, not proficiency or expertise.</p></article>`).join('')}
      </div>
      <div class="explore-legend reveal"><strong>Intensity means current attention.</strong> It describes how actively an area is being explored, not skill level or expertise.</div>
    </div>
  </section>`;
}

function offensiveSecurity() {
  return `<section id="offensive-security" class="section offensive-section" aria-labelledby="offensive-security-title">
    <div class="section-shell offensive-shell">
      <div class="section-header reveal"><p class="section-label">03 / Offensive Security</p><div><h2 id="offensive-security-title" class="section-title">I BREAK THINGS.<br>WITH PERMISSION.</h2><p class="section-intro">I'm still developing my offensive-security capability. Authorized client work is planned for late November.</p></div></div>
      <div class="offensive-grid">
        <div class="offensive-statement reveal"><span class="offensive-mark">AUTHORIZED ONLY</span><p>The direction is offensive security: understanding systems by testing where their assumptions and boundaries hold or fail.</p></div>
        <div class="offensive-structure reveal" aria-hidden="true"><span class="os-corner os-corner-a"></span><span class="os-corner os-corner-b"></span><span class="os-axis"></span><span class="os-signal"></span><span class="os-label">IN DEVELOPMENT</span></div>
      </div>
    </div>
  </section>`;
}

function work() {
  return `<section id="work" class="section" aria-labelledby="work-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">04 / Work</p><div><h2 id="work-title" class="section-title">THINGS I'M BUILDING</h2><p class="section-intro">The work section stays intentionally sparse until genuine project evidence exists.</p></div></div>
      <div class="work-feature reveal" data-cursor-state="project"><div><div class="empty-title">MORE TO COME.</div><p class="empty-text">No project entries are published here yet. The structure is ready for real projects, experiments, labs, evidence, and unfinished work without manufacturing filler.</p><div class="work-note">Published content only · no placeholder projects</div></div><div class="status-mark" aria-hidden="true">BUILDING</div></div>
    </div>
  </section>`;
}

function origin() {
  const items = site.timeline.map(item => [item.period, item.title, item.description]);
  return `<section id="origin" class="section" aria-labelledby="origin-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">06 / Origin</p><div><h2 id="origin-title" class="section-title">HOW I GOT HERE</h2><p class="section-intro">A factual outline of an evolving trajectory rather than a dramatic autobiography.</p></div></div>
      <div class="origin-layout"><div></div><div class="origin-track">
        ${items.map(([period,title,description])=>`<article class="origin-item reveal"><div class="origin-period">${period}</div><h3 class="origin-title">${esc(title)}</h3><p class="origin-desc">${esc(description)}</p></article>`).join('')}
        <div class="origin-future"><article class="origin-item reveal"><div class="origin-period">NEXT</div><h3 class="origin-title">?</h3><p class="origin-desc">The future remains unresolved by design.</p></article></div>
      </div></div>
    </div>
  </section>`;
}


function approach() {
  return `<section id="approach" class="section" aria-labelledby="approach-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">07 / Approach</p><div><h2 id="approach-title" class="section-title">HOW I LEARN<br>HOW I BUILD<br>HOW I THINK</h2></div></div>
      <div class="approach-wrap">
        <div class="approach-copy reveal"><p>I don't want to know how to do something.</p><p>I want to understand it well enough to do something new with it.</p><p>The cycle is simple: understand, explore, build — then understand again.</p></div>
        <div class="approach-cycle reveal" aria-label="A learning cycle: understand, explore, build, then repeat."><button class="cycle-node" type="button" tabindex="0">Understand</button><button class="cycle-node" type="button" tabindex="0">Explore</button><button class="cycle-node" type="button" tabindex="0">Build</button></div>
      </div>
    </div>
  </section>`;
}

function about() {
  return `<section id="about" class="section" aria-labelledby="about-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">08 / About</p><div><h2 id="about-title" class="about-name">ABDULLAH<br>AFFUN</h2></div></div>
      <div class="about-grid"><div class="about-list reveal"><span>Student.</span><span>Independent learner.</span><span>Technically curious.</span><span>Still exploring.</span></div><p class="about-statement reveal">A technically curious person developing broad and deep capabilities while exploring how different fields connect.</p></div>
    </div>
  </section>`;
}

function elsewhere() {
  const github = site.profiles.find(p => p.name === 'GitHub');
  const linkedin = site.profiles.find(p => p.name === 'LinkedIn');
  return `<section id="elsewhere" class="section" aria-labelledby="elsewhere-title">
    <div class="section-shell">
      <div class="section-header reveal"><p class="section-label">09 / Elsewhere</p><div><h2 id="elsewhere-title" class="section-title">THE WORK CONTINUES<br>OUTSIDE THIS SITE.</h2></div></div>
      <div class="external-network reveal">
        <svg viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true"><line class="external-line" x1="200" y1="120" x2="500" y2="220"/><line class="external-line" x1="800" y1="120" x2="500" y2="220"/></svg>
        <a class="external-node github" href="${github?.url || '#'}" target="_blank" rel="me external noopener noreferrer" data-cursor-state="link">${arrow('up-right')}<span class="ext-name">${esc(github?.name || 'GitHub')}</span><p>${esc(github?.description || '')}</p></a>
        <a class="external-node linkedin" href="${linkedin?.url || '#'}" target="_blank" rel="me external noopener noreferrer" data-cursor-state="link">${arrow('up-right')}<span class="ext-name">${esc(linkedin?.name || 'LinkedIn')}</span><p>${esc(linkedin?.description || '')}</p></a>
        <div class="external-center"><span>The work<br>continues<br>elsewhere</span></div>
      </div>
    </div>
  </section>`;
}

function contact() {
  return `<section id="contact" class="section contact-section" aria-labelledby="contact-title">
    <div class="section-shell contact-shell">
      <p class="section-label reveal">10 / Contact</p>
      <h2 id="contact-title" class="contact-title reveal">SOMETHING WORTH<br>BUILDING OR BREAKING?</h2>
      <div class="contact-row reveal">
        <span class="contact-email">abdullahaffun@gmail.com</span>
        <div class="contact-actions">
          <button class="email-button" type="button" data-cursor-state="link" data-copy-email="abdullahaffun@gmail.com">Copy email</button>
          <a class="send-button" href="mailto:abdullahaffun@gmail.com" data-cursor-state="link">Send <span class="link-arrow link-arrow-right" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M4 10 H16 M16 10 L10 4 M16 10 L10 16" /></svg></span></a>
          <a class="linkedin-button" href="https://www.linkedin.com/in/abdullah-affun/" target="_blank" rel="me external noopener noreferrer" data-cursor-state="link">LinkedIn ${arrow('up-right')}</a>
          <span class="copy-feedback" aria-live="polite">Copied</span>
        </div>
      </div>
    </div>
  </section>`;
}

function closing() {
  return `<section class="closing" aria-labelledby="closing-title"><div class="closing-inner"><p class="section-label reveal">Closing</p><h2 id="closing-title" class="closing-title reveal">CURIOSITY IS STILL<br>OUT OF BOUNDS.</h2><a class="restart reveal" data-cursor-state="link" href="#top" aria-label="Return to the Hero">↻</a></div></section>`;
}

function projectDetail(project, index, projects) {
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const block = (heading, value) => `<section class="project-block"><h2 class="section-label">${heading}</h2>${value ? `<p>${esc(value)}</p>` : ''}</section>`;
  return `<div class="page-frame"><div class="section-shell"><a class="page-back" href="../">${arrow('left')} Back to work</a><article class="section" aria-labelledby="project-title"><p class="section-label">Project</p><h1 id="project-title" class="section-title">${esc(project.title)}</h1><p class="section-intro">${esc(project.summary || '')}</p><div class="explore-legend"><strong>${esc(project.status || '')}</strong>${project.year ? ` · ${esc(project.year)}` : ''}</div><div class="project-detail-grid">${block('WHAT INTERESTED ME?', project.why)}${block('HOW DID I APPROACH IT?', project.approach)}${block('WHAT DID I BUILD?', project.build)}${block('WHAT HAPPENED?', project.result)}${block('WHAT DID I LEARN?', project.learning)}</div><nav aria-label="Project navigation" class="explore-legend project-nav"><a class="nf-link" href="${previous ? `../${previous.slug}/` : '../'}">${arrow('left')} ${previous ? 'Previous project' : 'Back to work'}</a><a class="nf-link" href="${next ? `../${next.slug}/` : '../'}">${next ? 'Next project' : 'Back to work'} ${arrow('right')}</a></nav></article></div></div>`;
}

const homeContent = hero() + connections() + offensiveSecurity() + work() + explore() + origin() + approach() + about() + elsewhere() + contact() + closing();


const focused = {
  work: work(),
  explore: explore(),
  origin: origin(),
  about: about(),
  contact: contact()
};

const pageMeta = {
  home: 'Abdullah Affun',
  work: 'Projects — Abdullah Affun',
  explore: 'Exploration — Abdullah Affun',
  origin: 'Origin — Abdullah Affun',
  about: 'About — Abdullah Affun',
  contact: 'Contact — Abdullah Affun'
};

function buildPage({ pathname, title, content }) {
  const rootPath = rootFor(pathname);
  const home = rootPath || './';
  let html = base.replaceAll('{{TITLE}}', esc(title)).replaceAll('{{ROOT}}', rootPath).replaceAll('{{HOME}}', home).replace('{{CONTENT}}', content).replace('{{JSONLD}}', jsonld(pathname)).replace('{{CANONICAL}}', canonical(pathname)).replaceAll('{{VERSION}}', esc(site.version));
  return html;
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.writeFile(path.join(dist, 'styles.css'), css);
await fs.writeFile(path.join(dist, 'site.js'), js);
await fs.writeFile(path.join(dist, 'theme-preload.js'), themeJs);
await fs.writeFile(path.join(dist, 'favicon.svg'), await fs.readFile(path.join(src, 'favicon.svg')));

await fs.writeFile(path.join(dist, 'index.html'), buildPage({ pathname:'/', title:pageMeta.home, content:homeContent }));
for (const [key, pathname] of Object.entries(pages)) {
  if (key === 'home') continue;
  const dir = path.join(dist, pathname);
  await fs.mkdir(dir, { recursive: true });
  const pageContent = `<div class="page-frame"><div class="section-shell"><a class="page-back" href="../">${arrow('left')} Back to exploring</a></div>${focused[key]}</div>`;
  await fs.writeFile(path.join(dir, 'index.html'), buildPage({ pathname, title:pageMeta[key], content:pageContent }));
}

const notFound = buildPage({ pathname:'/404.html', title:'404 — Abdullah Affun', content:`<div class="page-frame"><div class="section-shell"><section class="not-found" aria-labelledby="nf-title"><div><div class="nf-kicker">404</div><h1 id="nf-title" class="nf-title">SOMETHING<br>WENT OUT<br>OF BOUNDS.</h1><p class="nf-text">This path doesn't exist.</p><a class="nf-link" href="../">← Back to exploring</a><div class="nf-graphic" aria-hidden="true"></div></div></section></div></div>` });
for (const [index, project] of site.projects.entries()) {
  const dir = path.join(dist, 'work', project.slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), buildPage({ pathname:`/work/${project.slug}/`, title:`${project.title} — Abdullah Affun`, content:projectDetail(project, index, site.projects) }));
}

await fs.writeFile(path.join(dist, '404.html'), notFound);

const sitemapPaths = [...Object.values(pages), ...site.projects.map(project => `/work/${project.slug}/`)];
const sitemapUrls = sitemapPaths.map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n');
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);

await fs.writeFile(path.join(dist, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
`);
await fs.writeFile(path.join(dist, 'security-headers.md'), `# Production security headers\n\nRecommended for the static host: HTTPS, HSTS after HTTPS verification, Content-Security-Policy, X-Content-Type-Options: nosniff, frame-ancestors protection, Referrer-Policy, Permissions-Policy, and safe handling of external links.\n\nThe static files do not know the deployment host, so host/CDN-specific response headers must be applied by the production platform.\n`);

console.log(`Built ${Object.keys(pages).length} primary pages plus 404 into ${dist}${SITE_URL ? ` using SITE_URL=${SITE_URL}` : ''}.`);
