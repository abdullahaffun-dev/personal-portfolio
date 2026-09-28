(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  // Theme: saved preference → dark by default.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('affun-theme'); } catch {}
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  root.dataset.theme = initialTheme;

  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const applyTheme = (next) => {
    root.dataset.theme = next;
    root.classList.add('theme-shifting');
    try { localStorage.setItem('affun-theme', next); } catch {}
    themeButtons.forEach((item) => {
      item.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      const mode = item.querySelector('[data-theme-mode]');
      if (mode) mode.textContent = next === 'light' ? 'Light' : 'Dark';
    });
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = next === 'light' ? '#edf0f4' : '#090a0c';
    window.dispatchEvent(new CustomEvent('affun:theme', { detail: next }));
    window.setTimeout(() => root.classList.remove('theme-shifting'), 560);
  };
  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', initialTheme === 'light' ? 'true' : 'false');
    const mode = button.querySelector('[data-theme-mode]');
    if (mode) mode.textContent = initialTheme === 'light' ? 'Light' : 'Dark';
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      if (document.startViewTransition && !reduceMotion) {
        document.startViewTransition(() => applyTheme(next));
      } else {
        applyTheme(next);
      }
    });
  });

  // Hero service link: keep same-page anchor behavior reliable on touch devices even
  // when the 3D interaction surface is nearby.
  const heroServiceLink = document.querySelector('.hero-scroll a[href="#offensive-security"]');
  heroServiceLink?.addEventListener('click', (event) => {
    const target = document.getElementById('offensive-security');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#offensive-security');
  });

  // Header state.
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  // Mobile navigation with focus return.
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = mobileNav ? [...mobileNav.querySelectorAll('a')] : [];
  const mobileTheme = mobileNav?.querySelector('[data-theme-toggle]');
  let menuOpen = false;
  let lastFocus = null;
  if (mobileNav) {
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.setAttribute('inert', '');
  }
  const setMenu = (open) => {
    menuOpen = open;
    body.classList.toggle('nav-open', open);
    if (mobileNav) {
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) mobileNav.removeAttribute('inert');
      else mobileNav.setAttribute('inert', '');
    }
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }
    if (open) {
      lastFocus = document.activeElement;
      window.requestAnimationFrame(() => mobileLinks[0]?.focus());
    } else {
      lastFocus?.focus?.();
      menuToggle?.focus();
    }
  };
  menuToggle?.addEventListener('click', () => setMenu(!menuOpen));
  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false);
    if (event.key === 'Tab' && menuOpen && mobileNav) {
      const focusables = [menuToggle, ...mobileLinks, mobileTheme].filter(Boolean);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Primary navigation follows the real page order. Non-navigation chapters intentionally leave it blank.
  const sectionLinks = [...document.querySelectorAll('.nav-link[data-section-link]')];
  const syncNav = () => {
    if (!sectionLinks.length) return;
    const navTargets = sectionLinks.map(link => ({ link, section: document.getElementById(link.dataset.sectionLink) })).filter(item => item.section);
    const marker = window.scrollY + window.innerHeight * .42;
    let current = null;
    navTargets.forEach(({ link, section }) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = link;
    });
    sectionLinks.forEach(link => link.classList.toggle('is-active', link === current));
  };
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });
  window.addEventListener('resize', syncNav, { passive: true });

  // Reveal motion.
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // Explore: last hovered/focused topic remains active until another topic takes focus.
  const exploreGrid = document.querySelector('.explore-grid');
  const exploreItems = [...document.querySelectorAll('.explore-item')];
  const setExploreActive = (item) => {
    if (!item) return;
    exploreItems.forEach(other => {
      const active = other === item;
      other.classList.toggle('is-active', active);
      other.classList.toggle('is-dimmed', !active);
    });
    exploreGrid?.style.setProperty('--topic-intensity', item.dataset.intensity || '0');
    if (exploreGrid) exploreGrid.dataset.activeTopic = item.dataset.topic || '';
  };
  exploreItems.forEach((item) => {
    const intensity = Number(item.dataset.intensity || 0);
    item.style.setProperty('--intensity', String(Math.max(0, Math.min(5, intensity))));
    item.addEventListener('pointerenter', () => setExploreActive(item));
    item.addEventListener('focusin', () => setExploreActive(item));
  });
  setExploreActive(exploreItems[0]);

  // Origin timeline trace follows natural scroll position.
  const originTrack = document.querySelector('.origin-track');
  if (originTrack) {
    const updateOrigin = () => {
      const rect = originTrack.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * .74 - rect.top) / Math.max(1, rect.height * .9)));
      originTrack.style.setProperty('--timeline-progress', progress.toFixed(3));
    };
    updateOrigin();
    window.addEventListener('scroll', updateOrigin, { passive: true });
    window.addEventListener('resize', updateOrigin, { passive: true });
  }

  // Connections graph: active nodes illuminate connected lines and related nodes.
  const nodeButtons = [...document.querySelectorAll('.connection-node')];
  const lineEls = [...document.querySelectorAll('.connection-line')];
  const detailsTitle = document.querySelector('[data-connection-title]');
  const detailsText = document.querySelector('[data-connection-text]');
  const connectionCopy = {
    cybersecurity: 'A direction for investigating how systems behave, where boundaries fail, and how security changes the way systems are understood.',
    python: 'A practical language for turning ideas into small experiments, tools, and observable systems.',
    ai: 'A connected area of investigation that intersects with programming, systems, and questions about intelligent behavior.',
    systems: 'The layer beneath the interfaces: operating systems, hardware, networking, and the mechanisms that make computing work.',
    mathematics: 'A way to reason about structure, abstraction, relationships, and the patterns that connect different fields.'
  };
  const connectionNeighbors = new Map();
  lineEls.forEach(line => {
    const from = line.dataset.from, to = line.dataset.to;
    if (!connectionNeighbors.has(from)) connectionNeighbors.set(from, new Set());
    if (!connectionNeighbors.has(to)) connectionNeighbors.set(to, new Set());
    connectionNeighbors.get(from).add(to);
    connectionNeighbors.get(to).add(from);
  });
  const setConnection = (id) => {
    const neighbors = connectionNeighbors.get(id) || new Set();
    nodeButtons.forEach(btn => {
      const active = btn.dataset.node === id;
      const related = neighbors.has(btn.dataset.node);
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-related', related && !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    lineEls.forEach(line => line.classList.toggle('is-active', line.dataset.from === id || line.dataset.to === id));
    const active = nodeButtons.find(btn => btn.dataset.node === id);
    if (active && detailsTitle && detailsText) {
      detailsTitle.textContent = active.querySelector('.node-name')?.textContent || id;
      detailsText.textContent = connectionCopy[id] || '';
    }
  };
  nodeButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => setConnection(btn.dataset.node));
    btn.addEventListener('focus', () => setConnection(btn.dataset.node));
    btn.addEventListener('click', () => setConnection(btn.dataset.node));
  });
  setConnection(nodeButtons[0]?.dataset.node || '');

  // Approach: scroll rotates the cycle; only the last hovered/focused node glows.
  const approachSection = document.getElementById('approach');
  const cycle = document.querySelector('.approach-cycle');
  const cycleNodes = cycle ? [...cycle.querySelectorAll('.cycle-node')] : [];
  let approachRaf = 0;
  let scrollStep = 0;
  const rotateCycle = (index) => {
    if (!cycle) return;
    const normalized = ((index % 3) + 3) % 3;
    cycle.style.setProperty('--cycle-step', String(normalized));
    cycle.style.setProperty('--cycle-angle', `${normalized * 120}deg`);
  };
  const setLastHovered = (index) => {
    cycleNodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
  };
  const updateApproach = () => {
    if (!approachSection || !cycle || reduceMotion) return;
    cancelAnimationFrame(approachRaf);
    approachRaf = requestAnimationFrame(() => {
      const rect = approachSection.getBoundingClientRect();
      const span = Math.max(1, rect.height - innerHeight * .12);
      const progress = Math.min(.999, Math.max(0, (innerHeight * .82 - rect.top) / span));
      scrollStep = Math.min(2, Math.floor(progress * 3));
      rotateCycle(scrollStep);
    });
  };
  if (approachSection) {
    rotateCycle(0);
    updateApproach();
    window.addEventListener('scroll', updateApproach, { passive: true });
    window.addEventListener('resize', updateApproach, { passive: true });
  }
  cycleNodes.forEach((node, index) => {
    node.addEventListener('pointerenter', () => setLastHovered(index));
    node.addEventListener('focus', () => setLastHovered(index));
    node.addEventListener('click', () => setLastHovered(index));
  });

  // Elsewhere network: outbound links activate their shared centre.
  const externalNetwork = document.querySelector('.external-network');
  const externalNodes = externalNetwork ? [...externalNetwork.querySelectorAll('.external-node')] : [];
  externalNodes.forEach((node) => {
    const activate = () => externalNetwork?.classList.add('has-focus');
    const deactivate = () => { if (!externalNodes.some(other => other.matches(':hover, :focus-visible'))) externalNetwork?.classList.remove('has-focus'); };
    node.addEventListener('mouseenter', activate);
    node.addEventListener('focus', activate);
    node.addEventListener('mouseleave', deactivate);
    node.addEventListener('blur', deactivate);
  });

  // Email copy.
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const helper = document.createElement('textarea');
        helper.value = email;
        helper.style.position = 'fixed'; helper.style.opacity = '0';
        document.body.appendChild(helper); helper.focus(); helper.select();
        try { document.execCommand('copy'); } catch {}
        helper.remove();
      }
      const feedback = button.parentElement?.querySelector('.copy-feedback');
      if (feedback) {
        feedback.classList.add('is-visible');
        window.setTimeout(() => feedback.classList.remove('is-visible'), 1600);
      }
    });
  });

  // Custom cursor enhancement; never required for interaction.
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let x = innerWidth * .5, y = innerHeight * .5, rx = x, ry = y;
    addEventListener('pointermove', (event) => { x = event.clientX; y = event.clientY; });
    const loop = () => {
      rx += (x-rx) * .18; ry += (y-ry) * .18;
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    };
    loop();
    const updateCursor = () => {
      const active = document.elementFromPoint(x, y)?.closest('a,button,[data-cursor="interactive"]');
      ring.classList.toggle('is-active', !!active);
    };
    document.addEventListener('pointermove', updateCursor, { passive: true });
  }

  // Meaningful section-transition cue, kept lightweight and tied to natural scrolling.
  const transition = document.querySelector('.signature-transition');
  const transitionLine = document.querySelector('.transition-line');
  const heroSection = document.querySelector('.hero');
  if (transition && transitionLine && heroSection && !reduceMotion) {
    const updateTransition = () => {
      const r = heroSection.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * .55)));
      transitionLine.style.transform = `scaleX(${Math.max(.08, progress)})`;
      transition.style.opacity = String(.55 + progress * .45);
    };
    updateTransition();
    window.addEventListener('scroll', updateTransition, { passive: true });
  }

  // Hero WebGL system.
  initHeroScene();

  function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    const fallback = document.getElementById('hero-scene-fallback');
    if (!canvas) return;

    let gl;
    try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { gl = null; }
    if (!gl) {
      fallback?.removeAttribute('hidden');
      canvas.style.display = 'none';
      return;
    }
    fallback?.setAttribute('hidden', 'hidden');

    const vertexShader = `
      attribute vec3 aPosition;
      uniform mat4 uProjection;
      uniform mat4 uModel;
      uniform float uPointSize;
      varying float vZ;
      void main(){
        vec4 p = uProjection * uModel * vec4(aPosition,1.0);
        gl_Position = p;
        gl_PointSize = uPointSize;
        vZ = aPosition.z;
      }
    `;
    const fragmentShader = `
      precision mediump float;
      uniform vec4 uColor;
      uniform float uBlue;
      void main(){
        vec2 c = gl_PointCoord - .5;
        float d = dot(c,c);
        float alpha = 1.0 - smoothstep(.16,.25,d);
        if(alpha < .03) discard;
        vec3 color = mix(uColor.rgb, vec3(.30,.55,1.0), uBlue);
        gl_FragColor = vec4(color, uColor.a * alpha);
      }
    `;
    const lineVertexShader = `
      attribute vec3 aPosition;
      uniform mat4 uProjection;
      uniform mat4 uModel;
      varying float vZ;
      void main(){ gl_Position = uProjection * uModel * vec4(aPosition,1.0); vZ = aPosition.z; }
    `;
    const lineFragmentShader = `
      precision mediump float;
      uniform vec4 uColor;
      uniform float uBlue;
      void main(){ vec3 c = mix(uColor.rgb, vec3(.30,.55,1.0), uBlue); gl_FragColor = vec4(c, uColor.a); }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const makeProgram = (vs, fs) => {
      const v = compile(gl.VERTEX_SHADER, vs), f = compile(gl.FRAGMENT_SHADER, fs); if (!v || !f) return null;
      const p = gl.createProgram(); gl.attachShader(p,v); gl.attachShader(p,f); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
      return p;
    };
    const pointProgram = makeProgram(vertexShader, fragmentShader);
    const lineProgram = makeProgram(lineVertexShader, lineFragmentShader);
    if (!pointProgram || !lineProgram) {
      fallback?.removeAttribute('hidden'); canvas.style.display='none'; return;
    }

    const isSmall = matchMedia('(max-width: 700px)').matches;
    const gridN = isSmall ? 5 : 7;
    const depth = isSmall ? 3 : 4;
    const points = [];
    for (let side = 0; side < 2; side++) {
      const offset = side === 0 ? -.42 : .42;
      for (let z = 0; z < depth; z++) {
        const tz = z/(depth-1);
        const zVal = (tz-.5) * 1.5;
        for (let y = 0; y < gridN; y++) {
          const ty = y/(gridN-1) - .5;
          for (let x = 0; x < gridN; x++) {
            const tx = x/(gridN-1) - .5;
            const warp = Math.sin((tx+zVal)*3.1) * .06 + Math.cos((ty-zVal)*2.8) * .05;
            points.push([tx * 1.9 + offset, ty * 1.9 + warp, zVal + Math.sin((tx-ty)*2.3)*.08]);
          }
        }
      }
    }
    const lines = [];
    const gridPoints = gridN * gridN;
    const layerSize = gridPoints * depth;
    const idx = (side,z,y,x) => side * layerSize + z*gridPoints + y*gridN + x;
    for (let side = 0; side < 2; side++) {
      for (let z = 0; z < depth; z++) {
        for (let y = 0; y < gridN; y++) for (let x = 0; x < gridN; x++) {
          if (x < gridN-1) lines.push(points[idx(side,z,y,x)], points[idx(side,z,y,x+1)]);
          if (y < gridN-1 && (x % 2 === 0)) lines.push(points[idx(side,z,y,x)], points[idx(side,z,y+1,x)]);
          if (z < depth-1 && (x === Math.floor(gridN/2) || y === Math.floor(gridN/2))) lines.push(points[idx(side,z,y,x)], points[idx(side,z+1,y,x)]);
        }
      }
    }
    for (let z = 0; z < depth; z++) {
      const x = Math.floor(gridN/2), y = Math.floor(gridN/2);
      lines.push(points[idx(0,z,y,x)], points[idx(1,z,y,x)]);
      if (z < depth-1) {
        lines.push(points[idx(0,z,y,x)], points[idx(1,z+1,y,x)]);
        lines.push(points[idx(1,z,y,x)], points[idx(0,z+1,y,x)]);
      }
    }
    const pointData = new Float32Array(points.flat());
    const lineData = new Float32Array(lines.flat());

    const pBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pBuf); gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW);
    const lBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, lBuf); gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.STATIC_DRAW);

    const pLoc = gl.getAttribLocation(pointProgram, 'aPosition');
    const lpLoc = gl.getAttribLocation(lineProgram, 'aPosition');
    const pProj = gl.getUniformLocation(pointProgram, 'uProjection');
    const pModel = gl.getUniformLocation(pointProgram, 'uModel');
    const pColor = gl.getUniformLocation(pointProgram, 'uColor');
    const pBlue = gl.getUniformLocation(pointProgram, 'uBlue');
    const pSize = gl.getUniformLocation(pointProgram, 'uPointSize');
    const lProj = gl.getUniformLocation(lineProgram, 'uProjection');
    const lModel = gl.getUniformLocation(lineProgram, 'uModel');
    const lColor = gl.getUniformLocation(lineProgram, 'uColor');
    const lBlue = gl.getUniformLocation(lineProgram, 'uBlue');

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mat4 = {
      identity(){return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];},
      multiply(a,b){const o=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;},
      perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0];},
      translate(x,y,z){const m=this.identity();m[12]=x;m[13]=y;m[14]=z;return m;},
      rotateX(a){const c=Math.cos(a),s=Math.sin(a);return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];},
      rotateY(a){const c=Math.cos(a),s=Math.sin(a);return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];},
      rotateZ(a){const c=Math.cos(a),s=Math.sin(a);return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1];}
    };

    const pointer = { x:0, y:0, dragX:0, dragY:0, dragging:false, has:false, proximity:0, lastClientX:0, lastClientY:0 };
    const interaction = canvas.parentElement?.querySelector('.scene-interaction');
    let targetThemeMix = root.dataset.theme === 'light' ? 1 : 0;
    let themeMix = targetThemeMix;
    window.addEventListener('affun:theme', (event) => { targetThemeMix = event.detail === 'light' ? 1 : 0; });
    const updatePointer = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x=(e.clientX-r.left)/r.width*2-1;
      pointer.y=-((e.clientY-r.top)/r.height*2-1);
      pointer.has=true;
      pointer.proximity = Math.max(0, 1 - Math.min(1, Math.hypot(pointer.x * .7, pointer.y * .7)));
      if (pointer.dragging) {
        pointer.dragX += (e.clientX - pointer.lastClientX) * .005;
        pointer.dragY += (e.clientY - pointer.lastClientY) * .005;
      }
      pointer.lastClientX = e.clientX;
      pointer.lastClientY = e.clientY;
    };
    interaction?.addEventListener('pointermove', updatePointer);
    interaction?.addEventListener('pointerdown', (event) => {
      pointer.dragging=true;
      pointer.lastClientX=event.clientX;
      pointer.lastClientY=event.clientY;
      interaction.setPointerCapture?.(event.pointerId);
      document.documentElement.dataset.cursorState='dragging';
      updatePointer(event);
    });
    const endDrag = (event) => {
      pointer.dragging=false;
      try { interaction?.releasePointerCapture?.(event.pointerId); } catch {}
      if (document.documentElement.dataset.cursorState === 'dragging') document.documentElement.dataset.cursorState='3d';
    };
    interaction?.addEventListener('pointerup', endDrag);
    interaction?.addEventListener('pointercancel', endDrag);
    interaction?.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse') endDrag(event); });

    let scrollProgress = 0;
    const hero = document.querySelector('.hero');
    const updateScroll = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(1, rect.height - innerHeight);
      scrollProgress = Math.min(1, Math.max(0, -rect.top / travel));
    };
    updateScroll(); window.addEventListener('scroll', updateScroll, { passive:true });

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, isSmall ? 1.35 : 1.8);
      const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr); gl.viewport(0,0,canvas.width,canvas.height);
    };
    new ResizeObserver(resize).observe(canvas); resize();

    let raf = 0;
    let last = performance.now();
    const draw = (now) => {
      const dt = Math.min(.033, (now-last)/1000); last=now;
      if (!pointer.dragging) { pointer.dragX *= Math.pow(.035, dt); pointer.dragY *= Math.pow(.035, dt); }
      const t = now/1000;
      if (reduceMotion) themeMix = targetThemeMix;
      else themeMix += (targetThemeMix - themeMix) * Math.min(1, dt * 8);
      const lineAlpha = .42 + themeMix * .26;
      const pointAlpha = .64 + themeMix * .22;
      const w = canvas.width, h = canvas.height, aspect = w/Math.max(1,h);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const proj = mat4.perspective(.78, aspect, .1, 30);
      let rx = .10 + pointer.y*.15 + pointer.y*pointer.proximity*.08 + (reduceMotion ? 0 : Math.sin(t*.2)*.03) + pointer.dragY;
      let ry = -.42 + pointer.x*.20 + pointer.x*pointer.proximity*.08 + (reduceMotion ? 0 : t*.08) + pointer.dragX;
      const rz = reduceMotion ? 0 : Math.sin(t*.11)*.035;
      const spread = scrollProgress * (isSmall ? .30 : .46) + pointer.proximity * .035;
      const cameraDistance = isSmall ? 5.85 : 5.0;
      const model = mat4.multiply(mat4.translate(0, 0, -cameraDistance - scrollProgress*(isSmall ? .16 : .25)), mat4.multiply(mat4.rotateY(ry), mat4.multiply(mat4.rotateX(rx), mat4.multiply(mat4.rotateZ(rz), mat4.translate(0,0,spread)))));
      gl.useProgram(lineProgram); gl.bindBuffer(gl.ARRAY_BUFFER,lBuf); gl.enableVertexAttribArray(lpLoc); gl.vertexAttribPointer(lpLoc,3,gl.FLOAT,false,0,0); gl.uniformMatrix4fv(lProj,false,new Float32Array(proj)); gl.uniformMatrix4fv(lModel,false,new Float32Array(model)); gl.uniform4f(lColor, .95 - themeMix * .88, .96 - themeMix * .87, .99 - themeMix * .85, lineAlpha); gl.uniform1f(lBlue, .52 + themeMix * .22); gl.lineWidth(1); gl.drawArrays(gl.LINES,0,lineData.length/3);
      gl.useProgram(pointProgram); gl.bindBuffer(gl.ARRAY_BUFFER,pBuf); gl.enableVertexAttribArray(pLoc); gl.vertexAttribPointer(pLoc,3,gl.FLOAT,false,0,0); gl.uniformMatrix4fv(pProj,false,new Float32Array(proj)); gl.uniformMatrix4fv(pModel,false,new Float32Array(model)); gl.uniform4f(pColor, .96 - themeMix * .89, .97 - themeMix * .88, .99 - themeMix * .84, pointAlpha); gl.uniform1f(pBlue, .58 + themeMix * .08 + pointer.proximity * .18); gl.uniform1f(pSize, (isSmall ? 4.5 : 5.5) + pointer.proximity * 1.5); gl.drawArrays(gl.POINTS,0,pointData.length/3);
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once:true });
  }
})();

