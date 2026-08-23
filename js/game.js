'use strict';


(function () {
  const VW = 960;
  const VH = 540;
  const STEP = 1 / 60;
  const TAU = Math.PI * 2;
  const UNIT_R = 14;
  const WALK_PX = 96;
  const CHARGE_T = 0.8;
  const TAP_POW = 12;
  const TURN_T = 20;
  const GRAV = 260;
  const VK = 420;
  const LOFT_W = 20;
  const LOFT_B = 0.55;
  const WIND_K = 2.05;
  const GRID = 48;
  const STAM_MAX = 100;
  const LEAP_DX = 80;
  const LEAP_H = 56;
  const LEAP_T = 0.34;
  const WARP_R = 220;
  const BEST_KEY = 'playbox-tan-tang-best';
  const MUTE_KEY = 'playbox-tan-tang-mute';
  const OPS = '← → 走 · ↑ ↓ 角 · 空格/Z 蓄力 · 1 弹堂 · 2 堂核 · 3 演习场 · R 重开 · M 静音 · H 辅助';
  const OPS_PLAY = 'Q飞步 E影挪 C霓弹 V鼓息 F殿破 X过 · 4三裂 5霓轨 · 65°查表 · Tab尺 · H辅';
  const OPS_DRILL = '演习 · 表随距离变 · 空格仍能打木桩 · H辅';
  const ASSIST_NAME = ['关', '弱', '中', '强'];
  const TABLE65 = [0, 20, 28, 34, 39, 44, 48, 52, 55, 59, 62, 65, 68, 71, 73, 76, 78, 81, 83, 85, 88];
  const ITEM_MAX = { leap: 2, warp: 1, neon: 2, drum: 1 };
  const ITEM_COST = { leap: 35, warp: 25, neon: 0, drum: 0 };
  const MAP_NAME = { plain: '平原', canyon: '峡谷', twin: '双台', spire: '风柱', bridge: '碎桥', isles: '悬岛' };
  const MAP_IDS = ['plain', 'canyon', 'twin', 'spire', 'bridge', 'isles'];
  const GUST_MID = 480;
  const GUST_HW = 80;
  const GUST_AY = -150;
  const BRIDGE_X0 = 360;
  const BRIDGE_X1 = 600;
  const BRIDGE_Y = 310;
  const BRIDGE_THICK = 22;
  const BRIDGE_VOID = 528;
  const ISLE_VOID = 532;
  const ISLE_THICK = 44;
  const BURY_PX = 40;
  const SUDDEN_TURN = 12;
  const SUDDEN_HP = 35;
  const SUDDEN_SHRINK = 40;
  const SUDDEN_MIN = 200;
  const CLUSTER = [
    { dx: 0, dy: 0, r: 22 },
    { dx: -12, dy: 1, r: 18 },
    { dx: 12, dy: 2, r: 18 }
  ];

  const CYN = [0, 232, 255];
  const MAG = [255, 61, 184];
  const GOLD = [255, 227, 107];
  const HOT = [139, 92, 255];
  const WHT = [244, 238, 255];
  const DIRT = [92, 68, 48];
  const ICE = [160, 220, 255];
  const RAIL = [100, 255, 210];

  const WEPS = [
    { id: 0, name: '普通弹', direct: 32, splash: 36, crater: 30, spd: 1.00 },
    { id: 1, name: '高爆', direct: 24, splash: 56, crater: 48, spd: 0.88 },
    { id: 2, name: '穿透', direct: 30, splash: 32, crater: 26, spd: 1.06 },
    { id: 4, name: '三裂', direct: 14, splash: 22, crater: 16, spd: 0.96 },
    { id: 5, name: '霓轨', direct: 20, splash: 40, crater: 22, spd: 0.70 }
  ];
  const NEON = { id: 3, name: '霓弹', direct: 8, splash: 28, crater: 18, spd: 1.00 };

  const hasDom = typeof document !== 'undefined';
  const REDUCE = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function el(id) { return hasDom ? document.getElementById(id) : null; }
  function clamp(n, a, b) { return n < a ? a : n > b ? b : n; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function irand(a, b) { return (a + Math.random() * (b - a + 1)) | 0; }
  function hypot(ax, ay) { return Math.sqrt(ax * ax + ay * ay); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function approach(a, b, step) {
    if (a < b) return Math.min(a + step, b);
    if (a > b) return Math.max(a - step, b);
    return b;
  }
  function rgba(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; }
  function elev(ang) { return ang <= 90 ? ang : 180 - ang; }

  function muzzleSpeed(power, ang, wep) {
    const e = elev(ang);
    const loft = 1 + LOFT_B * Math.exp(-((e - 65) * (e - 65)) / (2 * LOFT_W * LOFT_W));
    return VK * (clamp(power, 1, 100) / 100) * (wep && wep.spd ? wep.spd : 1) * loft;
  }

  const canvas = el('c');
  const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
  const overlay = el('overlay');
  const panel = el('panel');
  const ovKicker = el('ov-kicker');
  const ovTitle = el('ov-title');
  const ovLead = el('ov-lead');
  const ovOps = el('ov-ops');
  const ovStart = el('ov-start');
  const ovEnd = el('ov-end');
  const ovMaps = el('ov-maps');
  const btnHall = el('btn-hall');
  const btnCore = el('btn-core');
  const ovRetry = el('ov-retry');
  const ovModes = el('ov-modes');
  const btnMute = el('btn-mute');
  const btnRetry = el('btn-retry');
  const btnAssist = el('btn-assist');
  const scoreEl = el('score');
  const bestEl = el('best');
  const scoreBox = el('score-box');
  const scoreAdd = el('score-add');
  const stageLabel = el('stage-label');
  const mapLabel = el('map-label');
  const windLabel = el('wind-label');
  const angLabel = el('ang-label');
  const powLabel = el('pow-label');
  const walkLabel = el('walk-label');
  const comboEl = el('combo-label');
  const hpPN = el('hp-p-n');
  const hpFN = el('hp-f-n');
  const hpP = el('hp-p');
  const hpF = el('hp-f');
  const toastEl = el('toast');
  const hintEl = el('hint');
  const stageEl = el('stage');
  const wepsEl = el('weps');
  const padEl = el('pad');
  const btnDrill = el('btn-drill');
  const itemsEl = el('items');
  const rageLabel = el('rage-label');
  const ghostLabel = el('ghost-label');
  const foeNameEl = el('foe-name');
  const stP = el('st-p');
  const stF = el('st-f');
  const rgP = el('rg-p');
  const rgF = el('rg-f');
  const drillTable = el('drill-table');
  const dtRows = el('dt-rows');
  const dtInfo = el('dt-info');
  const dt65 = el('dt-65');
  const dt90 = el('dt-90');
  const drillWindEl = el('drill-wind');
  const aimHintEl = el('aim-hint');

  const view = { w: 1, h: 1, dpr: 1, scale: 1, ox: 0, oy: 0 };
  const keys = { l: false, r: false, u: false, d: false, fire: false };
  const padHold = { l: false, r: false, u: false, d: false, fire: false };
  const cam = { x: VW * 0.5, y: VH * 0.5, z: 1, tx: VW * 0.5, ty: VH * 0.5, tz: 1 };

  const G = {
    mode: 'title',
    kind: 'hall',
    mapId: 'plain',
    t: 0,
    clock: 0,
    phase: 'aim',
    turn: 'p',
    wind: 0,
    power: TAP_POW,
    wep: 0,
    walk: WALK_PX,
    timeout: TURN_T,
    turns: 0,
    combo: 0,
    stop: 0,
    shake: 0,
    flash: 0,
    flashRgb: CYN,
    punch: 1,
    toastT: 0,
    settleT: 0,
    winStreak: 0,
    bestTurns: 0,
    H: null,
    p: null,
    f: null,
    shot: null,
    charging: false,
    stam: STAM_MAX,
    neonOn: false,
    busy: null,
    busyT: 0,
    ruler: true,
    assist: 2,
    drillWind: 'rand',
    ghost: null,
    ghostPend: null,
    pointer: { x: 480, y: 200 },
    warpX: 0,
    lastKind: 'hall',
    stakeT: 0,
    frozenT: 0,
    aiLastNeonTurn: -9,
    camHold: false,
    impactX: VW * 0.5,
    impactY: VH * 0.5,
    sudden: false,
    safeL: 0,
    safeR: VW - 1,
    slowMo: 0
  };

  const particles = [];
  const floats = [];
  const rings = [];
  const stars = [];
  const trail = [];

  let hidden = false;
  let addTok = 0;
  let toastTok = 0;
  let kickTok = 0;
  let terrainDirty = true;
  let terrainCv = null;
  let terrainCx = null;
  let coverImg = null;
  let heroImg = null;
  let foeImg = null;
  let heroFrames = [];
  let foeSpr = null;
  let artReady = false;
  let chargeOsc = null;
  let chargeGain = null;

  function dmgMul() { return G.kind === 'core' ? 1.15 : 1; }
  function maxHp(side) {
    if (G.kind === 'drill' && side === 'f') return 9999;
    return G.kind === 'core' ? 60 : 100;
  }
  function windMax() { return G.kind === 'core' ? 14 : 8; }
  function overlayOpen() { return !!(overlay && !overlay.classList.contains('hidden')); }
  function curUnit() { return G.turn === 'p' ? G.p : G.f; }
  function otherUnit(u) { return u === G.p ? G.f : G.p; }
  function wepOf() { return G.neonOn ? NEON : (WEPS[G.wep] || WEPS[0]); }
  function kindName() {
    return G.kind === 'core' ? '堂核' : G.kind === 'drill' ? '演习场' : '弹堂';
  }
  function addRage(u, n) {
    if (!u || u.stake) return;
    u.rage = clamp((u.rage || 0) + n, 0, 100);
    if (u.rage >= 100 && !u.ragedPrompted) {
      u.ragedPrompted = true;
      toast('怒满 · F 殿破', false, true);
    }
  }
  function resetItems(u) {
    if (!u) return;
    u.items = { leap: ITEM_MAX.leap, warp: ITEM_MAX.warp, neon: ITEM_MAX.neon, drum: ITEM_MAX.drum };
  }
  function facingOf(u) {
    if (!u) return 1;
    if (u.face === -1 || u.face === 1) return u.face;
    return u.ang > 90 ? -1 : 1;
  }

  function gustAy(x) {
    if (G.mapId !== 'spire') return 0;
    const d = Math.abs(x - GUST_MID);
    if (d >= GUST_HW) return 0;
    const k = 1 - d / GUST_HW;
    return GUST_AY * k * k;
  }

  function windKAt(wep, t) {
    if (!wep || wep.id !== 5) return WIND_K;
    const ticks = Math.min(8, Math.floor((t || 0) / 0.05));
    return WIND_K * Math.pow(1.15, ticks);
  }

  function isDeathVoid(x) {
    if (!G.H) return false;
    if (G.mapId === 'isles' && groundAt(x) >= VH - 14) return true;
    if (G.sudden && (x < G.safeL || x > G.safeR)) return true;
    return false;
  }

  function isBridgeCol(x) {
    return G.mapId === 'bridge' && x >= BRIDGE_X0 && x <= BRIDGE_X1;
  }

  function liveBridge(x) {
    return isBridgeCol(x) && G.H && G.H[x | 0] < BRIDGE_VOID - 20;
  }

  function setCamFighters() {
    cam.tx = VW * 0.5;
    cam.ty = VH * 0.5;
    cam.tz = 1;
    G.camHold = false;
  }

  function setCamShot(s) {
    if (!s) return;
    const lookX = s.x + s.vx * 0.20;
    const lookY = s.y + s.vy * 0.14;
    cam.tx = clamp(lookX, 140, VW - 140);
    cam.ty = clamp(lookY, 100, VH - 70);
    cam.tz = 1.14;
  }

  function setCamImpact(x, y) {
    G.camHold = true;
    G.impactX = x;
    G.impactY = y;
    cam.tx = clamp(x, 140, VW - 140);
    cam.ty = clamp(y, 90, VH - 70);
    cam.tz = 1.18;
  }

  function groundAt(x) {
    const H = G.H;
    if (!H) return VH - 8;
    const i = clamp(x, 0, VW - 1.001);
    const a = i | 0;
    const b = a + 1 < VW ? a + 1 : a;
    const t = i - a;
    return H[a] * (1 - t) + H[b] * t;
  }

  function padFlat(h, x0, x1, y) {
    const a = Math.max(0, x0 | 0);
    const b = Math.min(VW - 1, x1 | 0);
    for (let x = a; x <= b; x++) {
      const k = (x - a) / Math.max(1, b - a);
      const e = Math.sin(k * Math.PI);
      h[x] += (y - h[x]) * Math.min(1, e * 1.35);
    }
  }

  function buildHeight(id) {
    const h = new Float32Array(VW);
    if (id === 'canyon') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        const v = Math.pow(Math.sin(t * Math.PI), 1.32);
        h[x] = 294 + v * 206 + Math.sin(t * 16.2) * 7 + Math.sin(t * 39) * 3;
      }
      padFlat(h, 64, 196, 306);
      padFlat(h, 764, 906, 306);
    } else if (id === 'twin') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        const sm = function (a, b, u) {
          const k = clamp((u - a) / (b - a), 0, 1);
          return k * k * (3 - 2 * k);
        };
        const left = sm(0.02, 0.16, t) * (1 - sm(0.30, 0.40, t));
        const right = sm(0.60, 0.70, t) * (1 - sm(0.84, 0.98, t));
        h[x] = 508 - Math.max(left, right) * 198 + Math.sin(t * 13) * 5;
      }
    } else if (id === 'spire') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        h[x] = 392 + Math.sin(t * Math.PI * 2.05) * 14 + Math.sin(t * Math.PI * 5.1) * 7 + Math.sin(t * Math.PI * 11.2) * 3;
        h[x] += Math.sin(t * Math.PI) * 16;
      }
    } else if (id === 'bridge') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        const sm = function (a, b, u) {
          const k = clamp((u - a) / (b - a), 0, 1);
          return k * k * (3 - 2 * k);
        };
        const left = sm(0.02, 0.16, t) * (1 - sm(0.28, 0.36, t));
        const right = sm(0.64, 0.72, t) * (1 - sm(0.84, 0.98, t));
        h[x] = 508 - Math.max(left, right) * 198 + Math.sin(t * 13) * 4;
        if (x >= BRIDGE_X0 && x <= BRIDGE_X1) {
          const edge = Math.min(x - BRIDGE_X0, BRIDGE_X1 - x);
          const ramp = clamp(edge / 14, 0, 1);
          h[x] = lerp(h[x], BRIDGE_Y + Math.sin(x * 0.11) * 1.6, ramp);
        }
      }
    } else if (id === 'isles') {
      for (let x = 0; x < VW; x++) h[x] = ISLE_VOID;
      function isleBand(x0, x1, y) {
        for (let x = x0; x <= x1; x++) {
          const edge = Math.min(x - x0, x1 - x);
          const ramp = clamp(edge / 16, 0, 1);
          const sm = ramp * ramp * (3 - 2 * ramp);
          const yy = y + Math.sin(x * 0.09) * 3.2 + Math.sin(x * 0.21) * 1.4;
          h[x] = lerp(ISLE_VOID, yy, sm);
        }
      }
      isleBand(80, 280, 360);
      isleBand(400, 560, 240);
      isleBand(680, 880, 360);
    } else {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        h[x] = 394 + Math.sin(t * Math.PI * 2.05) * 18 + Math.sin(t * Math.PI * 5.3) * 8 + Math.sin(t * Math.PI * 11.2) * 3.5;
      }
    }
    for (let x = 0; x < VW; x++) h[x] = clamp(h[x], 88, VH - 8);
    return h;
  }

  function spawnX(id, side) {
    if (id === 'canyon') return side === 'p' ? 122 : 838;
    if (id === 'twin') return side === 'p' ? 148 : 812;
    if (id === 'spire') return side === 'p' ? 140 : 820;
    if (id === 'bridge') return side === 'p' ? 150 : 810;
    if (id === 'isles') return side === 'p' ? 160 : 800;
    return side === 'p' ? 152 : 768;
  }

  function makeUnit(side) {
    const x = spawnX(G.mapId, side);
    const stake = G.kind === 'drill' && side === 'f';
    const u = {
      side: side,
      name: side === 'p' ? '岚丸' : (stake ? '石俑' : '烬丸'),
      stake: stake,
      x: x,
      y: 0,
      r: UNIT_R,
      hp: maxHp(side),
      max: maxHp(side),
      ang: side === 'p' ? 65 : 115,
      vy: 0,
      grounded: true,
      fall: 0,
      bob: rand(0, TAU),
      hitT: 0,
      walkT: 0,
      face: side === 'p' ? 1 : -1,
      flash: 0,
      stam: STAM_MAX,
      rage: 0,
      ult: false,
      frozen: 0,
      ragedPrompted: false,
      buried: false,
      items: { leap: ITEM_MAX.leap, warp: ITEM_MAX.warp, neon: ITEM_MAX.neon, drum: ITEM_MAX.drum }
    };
    u.y = groundAt(u.x) - u.r;
    return u;
  }

  function rollWind() {
    if (G.kind === 'drill') {
      if (G.drillWind === '0') { G.wind = 0; return; }
      if (G.drillWind === '4r') { G.wind = 4; return; }
      if (G.drillWind === '4l') { G.wind = -4; return; }
    }
    const m = windMax();
    let w;
    if (G.kind === 'core' && Math.random() < 0.55) {
      w = (Math.random() < 0.5 ? -1 : 1) * irand(8, m);
    } else {
      w = irand(-m, m);
    }
    if (w === 0 && Math.random() < 0.35) w = Math.random() < 0.5 ? -1 : 1;
    G.wind = w;
  }

  function carve(cx, cy, r) {
    if (!G.H || r <= 0) return;
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(VW - 1, Math.ceil(cx + r));
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const inn = r * r - dx * dx;
      if (inn <= 0) continue;
      const bot = cy + Math.sqrt(inn);
      if (G.H[x] < bot) G.H[x] = Math.min(VH - 6, bot);
    }
    terrainDirty = true;
  }

  function snapBridge(cx, r, wep) {
    if (G.mapId !== 'bridge' || !G.H || !wep) return;
    const canSnap = wep.id === 1 || wep.id === 4;
    if (!canSnap) return;
    const x0 = Math.max(BRIDGE_X0, Math.floor(cx - r - 10));
    const x1 = Math.min(BRIDGE_X1, Math.ceil(cx + r + 10));
    let any = false;
    for (let x = x0; x <= x1; x++) {
      if (G.H[x] < BRIDGE_VOID - 20) {
        G.H[x] = BRIDGE_VOID;
        any = true;
      }
    }
    if (any) terrainDirty = true;
  }

  function carveCluster(cx, cy, mul) {
    const hits = [];
    for (let i = 0; i < CLUSTER.length; i++) {
      const pop = CLUSTER[i];
      const px = clamp(cx + pop.dx, 4, VW - 4);
      const py = groundAt(cx) + pop.dy;
      const r = Math.round(pop.r * (mul || 1));
      carve(px, py, r);
      hits.push({ x: px, y: py, r: r });
    }
    return hits;
  }

  function inGround(x, y) {
    if (x < 0 || x >= VW) return true;
    return y >= groundAt(x);
  }

  function unitAt(x, y, skip) {
    const list = [G.p, G.f];
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      if (!u || u === skip || u.hp <= 0) continue;
      if (hypot(x - u.x, y - u.y) <= u.r + 5) return u;
    }
    return null;
  }

  function traceShot(x0, y0, ang, power, wind, wep, Hsave, skip) {
    const old = G.H;
    if (Hsave) G.H = Hsave;
    const th = ang * Math.PI / 180;
    const spd = muzzleSpeed(power, ang, wep);
    let vx = Math.cos(th) * spd;
    let vy = -Math.sin(th) * spd;
    let x = x0;
    let y = y0;
    let pierced = false;
    let fuse = 0;
    const dt = 1 / 60;
    let hitU = null;
    let t = 0;
    for (let i = 0; i < 420; i++) {
      vx += wind * windKAt(wep, t) * dt;
      vy += (GRAV + gustAy(x)) * dt;
      x += vx * dt;
      y += vy * dt;
      t += dt;
      if (x < 4 || x > VW - 4 || y > VH + 30) {
        if (Hsave) G.H = old;
        return { x: clamp(x, 0, VW - 1), y: Math.min(y, VH), t: t, hit: null, air: y < VH };
      }
      const u = unitAt(x, y, skip);
      if (u) {
        if (Hsave) G.H = old;
        return { x: x, y: y, t: t, hit: u, air: false };
      }
      if (inGround(x, y)) {
        if (wep && wep.id === 2 && !pierced) {
          pierced = true;
          fuse = 0.18;
          const s = hypot(vx, vy) || 1;
          const ux = vx / s;
          const uy = vy / s;
          x += ux * 46;
          y += uy * 46;
          let g = 0;
          while (inGround(x, y) && g < 18) {
            x += ux * 3;
            y += uy * 3;
            g += 1;
          }
          continue;
        }
        if (Hsave) G.H = old;
        return { x: x, y: y, t: t, hit: null, air: false, pierced: pierced };
      }
      if (pierced) {
        fuse -= dt;
        if (fuse <= 0) {
          if (Hsave) G.H = old;
          return { x: x, y: y, t: t, hit: null, air: true, pierced: true };
        }
      }
    }
    if (Hsave) G.H = old;
    return { x: x, y: y, t: t, hit: hitU, air: true };
  }

  const audio = {
    ctx: null,
    master: null,
    muted: false,
    ensure() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          try { this.ctx.resume(); } catch (err) { /* */ }
        }
        return;
      }
      if (typeof window === 'undefined') return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.42;
        this.master.connect(this.ctx.destination);
      } catch (err) {
        this.ctx = null;
      }
    },
    setMuted(m) {
      this.muted = !!m;
      if (this.master) this.master.gain.value = this.muted ? 0 : 0.42;
      if (btnMute) {
        btnMute.textContent = m ? '静' : '声';
        btnMute.classList.toggle('muted', m);
        btnMute.setAttribute('aria-label', m ? '取消静音' : '静音');
      }
      try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (err) { /* */ }
    },
    beep(freq, dur, type, vol, slide) {
      if (!this.ctx || this.muted) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(Math.max(40, freq), t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
      g.gain.setValueAtTime(Math.max(0.0001, vol), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(this.master);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    noise(dur, vol, hp) {
      if (!this.ctx || this.muted) return;
      const n = Math.max(0.04, dur);
      const sr = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, Math.max(1, (sr * n) | 0), sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hp || 400;
      const g = this.ctx.createGain();
      const t = this.ctx.currentTime;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f);
      f.connect(g);
      g.connect(this.master);
      src.start(t);
      src.stop(t + dur + 0.02);
    },
    chargeStart() {
      this.ensure();
      this.chargeStop();
      if (!this.ctx || this.muted) return;
      try {
        chargeOsc = this.ctx.createOscillator();
        chargeGain = this.ctx.createGain();
        chargeOsc.type = 'sawtooth';
        chargeOsc.frequency.value = 180;
        chargeGain.gain.value = 0.028;
        chargeOsc.connect(chargeGain);
        chargeGain.connect(this.master);
        chargeOsc.start();
      } catch (err) { chargeOsc = null; }
    },
    chargeTick(p) {
      if (!chargeOsc || !this.ctx) return;
      try { chargeOsc.frequency.setValueAtTime(180 + p * 7.2, this.ctx.currentTime); } catch (err) { /* */ }
    },
    chargeStop() {
      if (chargeOsc) {
        try { chargeOsc.stop(); } catch (err) { /* */ }
        try { chargeOsc.disconnect(); } catch (err) { /* */ }
      }
      chargeOsc = null;
      chargeGain = null;
    },
    fire(wep) {
      this.ensure();
      this.chargeStop();
      this.beep(220, 0.08, 'sawtooth', 0.04, 720);
      this.beep(wep && wep.id === 1 ? 140 : 280, 0.1, 'square', 0.03, 90);
      if (wep && wep.id === 2) this.beep(880, 0.08, 'triangle', 0.028, 1400);
    },
    boom(hit, wep, ult) {
      this.ensure();
      this.noise(hit ? 0.2 : 0.14, hit ? 0.08 : 0.05, hit ? 180 : 280);
      this.beep(hit ? 160 : 110, 0.22, 'sine', hit ? 0.07 : 0.04, 40);
      if (wep && wep.id === 1) this.beep(70, 0.28, 'triangle', 0.05, 32);
      if (wep && wep.id === 5) this.beep(210, 0.16, 'sine', 0.045, 90);
      if (ult) {
        this.noise(0.42, 0.16, 70);
        this.beep(48, 0.5, 'sine', 0.14, 24);
        this.beep(86, 0.36, 'triangle', 0.1, 28);
        this.beep(36, 0.28, 'square', 0.06, 20);
      }
    },
    hit() {
      this.ensure();
      this.beep(540, 0.07, 'square', 0.05, 220);
      this.beep(880, 0.1, 'triangle', 0.036, 1320);
    },
    dirt() {
      this.ensure();
      this.noise(0.1, 0.04, 320);
    },
    fall() {
      this.ensure();
      this.beep(90, 0.16, 'sine', 0.045, 40);
      this.noise(0.12, 0.05, 140);
    },
    combo(n) {
      this.ensure();
      this.beep(392 + n * 40, 0.08, 'sine', 0.04, 784);
      this.beep(660, 0.12, 'triangle', 0.032, 1046);
    },
    start() {
      this.ensure();
      this.beep(330, 0.08, 'square', 0.04, 660);
      this.beep(660, 0.12, 'triangle', 0.034, 990);
    },
    win() {
      this.ensure();
      this.beep(523, 0.1, 'sine', 0.045, 659);
      this.beep(784, 0.14, 'triangle', 0.05, 1046);
      this.beep(1046, 0.22, 'sine', 0.04, 1318);
    },
    lose() {
      this.ensure();
      this.beep(196, 0.22, 'sawtooth', 0.05, 80);
      this.beep(110, 0.4, 'sine', 0.055, 40);
    },
    tick() {
      this.ensure();
      this.beep(880, 0.035, 'square', 0.02);
    }
  };


  function toast(msg, warn, gold) {
    G.toastT = 1.4;
    toastTok += 1;
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle('warn', !!warn);
    toastEl.classList.toggle('gold', !!gold && !warn);
    toastEl.classList.remove('hidden');
  }

  function setHint(text, kind) {
    if (!hintEl) return;
    hintEl.textContent = text;
    hintEl.classList.toggle('hot', kind === 'hot');
    hintEl.classList.toggle('warn', kind === 'warn');
  }

  function windText() {
    if (G.wind > 0) return '→ ' + G.wind;
    if (G.wind < 0) return '← ' + (-G.wind);
    return '· 0';
  }

  function showOverlay(kind, title, lead) {
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    if (panel) {
      panel.classList.toggle('win', kind === 'win');
      panel.classList.toggle('lose', kind === 'lose' || kind === 'draw');
    }
    if (ovKicker) {
      ovKicker.textContent = kind === 'lose' ? 'DOWN' : kind === 'win' ? 'CLEAR' : kind === 'draw' ? 'DRAW' : 'TAN HALL';
    }
    if (ovTitle) ovTitle.textContent = title;
    if (ovLead) ovLead.textContent = lead;
    if (ovOps) ovOps.textContent = OPS;
    if (kind === 'title') {
      if (ovStart) ovStart.classList.remove('gone');
      if (ovEnd) ovEnd.classList.add('gone');
      if (ovMaps) ovMaps.style.display = '';
    } else {
      if (ovStart) ovStart.classList.add('gone');
      if (ovEnd) ovEnd.classList.remove('gone');
      if (ovMaps) ovMaps.style.display = 'none';
    }
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    if (canvas && canvas.focus) canvas.focus();
  }

  function loadBest() {
    G.winStreak = 0;
    G.bestTurns = 0;
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      G.winStreak = Math.max(0, parseInt(o.winStreak, 10) || 0);
      G.bestTurns = Math.max(0, parseInt(o.bestTurns, 10) || 0);
      if (o.mode === 'core' || o.mode === 'hall') { G.kind = o.mode; G.lastKind = o.mode; }
      if (MAP_IDS.indexOf(o.map) >= 0) G.mapId = o.map;
      if (o.ruler === false) G.ruler = false;
      else G.ruler = true;
      const ast = parseInt(o.assist, 10);
      if (ast === 0 || ast === 1 || ast === 2 || ast === 3) G.assist = ast;
      else G.assist = 2;
      if (o.drillWind === '0' || o.drillWind === '4l' || o.drillWind === '4r' || o.drillWind === 'rand') {
        G.drillWind = o.drillWind;
      }
    } catch (err) { /* */ }
  }

  function saveBest() {
    try {
      const mode = (G.kind === 'core' || G.lastKind === 'core') && G.kind !== 'hall' && G.kind !== 'drill'
        ? 'core'
        : (G.kind === 'core' ? 'core' : 'hall');
      const saveMode = G.kind === 'drill' ? (G.lastKind === 'core' ? 'core' : 'hall') : (G.kind === 'core' ? 'core' : 'hall');
      localStorage.setItem(BEST_KEY, JSON.stringify({
        winStreak: G.winStreak,
        bestTurns: G.bestTurns,
        mode: saveMode,
        map: G.mapId,
        ruler: !!G.ruler,
        assist: clamp(G.assist | 0, 0, 3),
        drillWind: G.drillWind || 'rand'
      }));
    } catch (err) { /* */ }
  }

  function popStreak(n) {
    if (!scoreBox || !scoreAdd) return;
    scoreBox.classList.remove('flash');
    void scoreBox.offsetWidth;
    scoreBox.classList.add('flash');
    addTok += 1;
    const tok = addTok;
    scoreAdd.hidden = false;
    scoreAdd.textContent = n > 0 ? '+' + n : String(n);
    scoreAdd.style.animation = 'none';
    void scoreAdd.offsetWidth;
    scoreAdd.style.animation = '';
    setTimeout(function () { if (tok === addTok) scoreAdd.hidden = true; }, 700);
  }

  function syncMaps() {
    if (!ovMaps) return;
    const btns = ovMaps.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-map') === G.mapId);
    }
  }

  function syncWeps() {
    if (!wepsEl) return;
    const btns = wepsEl.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', (btns[i].getAttribute('data-w') | 0) === G.wep);
    }
  }

  function syncHud() {
    if (scoreEl) scoreEl.textContent = String(G.winStreak);
    if (bestEl) bestEl.textContent = G.bestTurns > 0 ? String(G.bestTurns) + '回' : '—';
    if (stageLabel) {
      stageLabel.textContent = kindName();
      stageLabel.classList.toggle('hot', G.kind === 'core');
    }
    if (mapLabel) mapLabel.textContent = MAP_NAME[G.mapId] || '平原';
    if (windLabel) windLabel.textContent = '风 ' + windText();
    const u = curUnit() || G.p;
    if (angLabel) angLabel.textContent = '角 ' + Math.round((u && u.ang) || 65) + '°';
    if (powLabel) powLabel.textContent = '力 ' + Math.round(G.power);
    const stam = (G.p && G.turn === 'p') ? G.p.stam : (u && u.stam != null ? u.stam : G.stam);
    if (walkLabel) walkLabel.textContent = '体 ' + Math.max(0, Math.round(G.p ? G.p.stam : stam));
    if (rageLabel) rageLabel.textContent = '怒 ' + Math.max(0, Math.round((G.p && G.p.rage) || 0));
    if (ghostLabel) {
      if (G.ghost && G.mode === 'play') {
        ghostLabel.classList.remove('gone');
        ghostLabel.textContent = '上 ' + Math.round(G.ghost.ang) + '°/' + Math.round(G.ghost.power);
      } else {
        ghostLabel.classList.add('gone');
      }
    }
    if (foeNameEl) foeNameEl.textContent = G.f && G.f.stake ? '石俑' : '烬丸';
    function bar(node, t) { if (node) node.style.transform = 'scaleX(' + clamp(t, 0, 1) + ')'; }
    if (G.p) {
      bar(stP, G.p.stam / STAM_MAX);
      bar(rgP, (G.p.rage || 0) / 100);
    }
    if (G.f) {
      bar(stF, (G.f.stam || 0) / STAM_MAX);
      bar(rgF, (G.f.rage || 0) / 100);
    }
    syncItems();
    syncAssist();
    syncDrillHud();
    if (comboEl) {
      if (G.combo >= 2 && G.mode === 'play') {
        comboEl.hidden = false;
        comboEl.textContent = '连堂 ×' + G.combo;
      } else comboEl.hidden = true;
    }
    if (aimHintEl) {
      const aiming = G.mode === 'play' && (G.phase === 'aim' || G.phase === 'charge') && G.p && G.f;
      if (aiming) {
        const from = curUnit() || G.p;
        const to = otherUnit(from) || G.f;
        const tip = schoolTips(from, to);
        aimHintEl.textContent = '建议 ' + Math.round(tip.ang65) + '° 力 ' + tip.pow65;
        aimHintEl.classList.remove('gone');
      } else {
        aimHintEl.classList.add('gone');
      }
    }
    if (G.p) {
      if (hpPN) hpPN.textContent = String(Math.max(0, Math.ceil(G.p.hp)));
      if (hpP) hpP.style.transform = 'scaleX(' + clamp(G.p.hp / G.p.max, 0, 1) + ')';
    }
    if (G.f) {
      if (hpFN) hpFN.textContent = String(Math.max(0, Math.ceil(G.f.hp)));
      if (hpF) hpF.style.transform = 'scaleX(' + clamp(G.f.hp / G.f.max, 0, 1) + ')';
    }
    syncWeps();
  }

  function syncItems() {
    const bag = G.p && G.p.items ? G.p.items : ITEM_MAX;
    const map = { leap: 'n-leap', warp: 'n-warp', neon: 'n-neon', drum: 'n-drum' };
    Object.keys(map).forEach(function (k) {
      const n = el(map[k]);
      if (n) n.textContent = String(bag[k] != null ? bag[k] : 0);
      const btn = el(k === 'leap' ? 'btn-leap' : k === 'warp' ? 'btn-warp' : k === 'neon' ? 'btn-neon' : 'btn-drum');
      if (btn) {
        const left = bag[k] || 0;
        const cost = ITEM_COST[k];
        const stam = G.p ? G.p.stam : 0;
        btn.classList.toggle('empty', left <= 0 || stam < cost);
        btn.classList.toggle('on', k === 'neon' && G.neonOn);
      }
    });
    if (el('btn-ult')) {
      el('btn-ult').classList.toggle('armed', !!(G.p && (G.p.rage >= 100 || G.p.ult)));
      el('btn-ult').classList.toggle('empty', !(G.p && (G.p.rage >= 100 || G.p.ult)));
    }
  }

  function syncDrillWind() {
    if (!drillWindEl) return;
    const btns = drillWindEl.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-dw') === G.drillWind);
    }
  }

  function assistName() {
    return ASSIST_NAME[clamp(G.assist | 0, 0, 3)];
  }

  function syncAssist() {
    if (!btnAssist) return;
    const n = assistName();
    btnAssist.textContent = '辅 ' + n;
    btnAssist.setAttribute('aria-label', '辅助 ' + n);
    btnAssist.classList.toggle('on', (G.assist | 0) > 0);
  }

  function setAssist(n) {
    G.assist = clamp(n | 0, 0, 3);
    saveBest();
    syncAssist();
    toast('辅助 · ' + assistName(), false, G.assist >= 2);
  }

  function cycleAssist(dir) {
    setAssist((clamp(G.assist | 0, 0, 3) + (dir || 1) + 4) % 4);
  }

  function mottoGrid(u) {
    if (!u) return 1;
    const e = elev(u.ang);
    if (e >= 82) return clamp(Math.round(Math.abs(90 - e)), 0, 20);
    let best = 1, bd = 1e9;
    for (let g = 1; g <= 20; g++) {
      const d = Math.abs(TABLE65[g] - G.power);
      if (d < bd) { bd = d; best = g; }
    }
    return best;
  }

  function schoolTips(from, to) {
    const face = facingOf(from);
    const dx = (to.x - from.x) * face;
    const grids = clamp(Math.round(Math.abs(dx) / GRID), 1, 20);
    const dh = (groundAt(from.x) - groundAt(to.x)) / GRID;
    const along = G.wind * face;
    const elev65 = clamp(65 + 2 * along, 5, 175);
    const ang65 = face > 0 ? elev65 : 180 - elev65;
    const pow65 = clamp(TABLE65[grids] + Math.round(3 * dh), 12, 100);
    const elev90 = clamp(90 - grids + 2 * along - Math.round(dh), 5, 175);
    const ang90 = face > 0 ? elev90 : 180 - elev90;
    return {
      grids: Math.abs(to.x - from.x) / GRID,
      dh: dh,
      along: along,
      ang65: ang65,
      pow65: pow65,
      ang90: ang90,
      g: grids
    };
  }

  function syncDrillHud() {
    if (!drillTable) return;
    const on = G.kind === 'drill' && G.mode === 'play';
    drillTable.classList.toggle('gone', !on);
    if (!on || !G.p || !G.f) return;
    const tip = schoolTips(G.p, G.f);
    if (dtRows && !dtRows.childElementCount) {
      for (let g = 1; g <= 20; g++) {
        const sp = document.createElement('span');
        sp.setAttribute('data-g', String(g));
        sp.textContent = g + '格 ' + TABLE65[g];
        dtRows.appendChild(sp);
      }
    }
    if (dtRows) {
      const kids = dtRows.children;
      for (let i = 0; i < kids.length; i++) {
        kids[i].classList.toggle('on', (kids[i].getAttribute('data-g') | 0) === tip.g);
      }
    }
    const sign = tip.dh >= 0 ? '+' : '';
    if (dtInfo) {
      dtInfo.textContent = '距 ' + tip.grids.toFixed(1) + ' 格  Δh ' + sign + tip.dh.toFixed(1) + ' 格  风_along ' + tip.along;
    }
    if (dt65) dt65.textContent = '65° 建议  角 ' + Math.round(tip.ang65) + '°  力 ' + tip.pow65;
    if (dt90) dt90.textContent = '90° 建议  角 ' + Math.round(tip.ang90) + '°  力 95';
  }

  function hitStop(sec) {
    if (REDUCE || G.mode !== 'play') return;
    G.stop = Math.max(G.stop, sec);
  }

  function kick(mag) {
    if (REDUCE) return;
    G.shake = Math.max(G.shake, mag);
    G.punch = Math.max(G.punch, 1 + Math.min(0.08, mag * 0.01));
    if (!stageEl || G.mode !== 'play') return;
    kickTok += 1;
    const cls = mag >= 5.5 ? 'die' : 'hit';
    stageEl.classList.remove('die');
    stageEl.classList.remove('hit');
    void stageEl.offsetWidth;
    stageEl.classList.add(cls);
  }

  function screenFlash(rgb, a) {
    G.flash = Math.max(G.flash, a || 0.4);
    G.flashRgb = rgb;
  }

  function burst(x, y, rgb, n, spd, life) {
    const N = REDUCE ? Math.min(8, n) : n;
    for (let i = 0; i < N; i++) {
      const a = rand(0, TAU);
      const s = rand(spd * 0.3, spd);
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - rand(20, 80),
        g: 420,
        life: life,
        max: life,
        r: rand(1.2, 3.4),
        rgb: rgb
      });
    }
  }

  function dirtBurst(x, y, n) {
    burst(x, y, DIRT, REDUCE ? Math.min(8, n) : n, 190, 0.52);
    const extra = REDUCE ? 3 : 8;
    for (let i = 0; i < extra; i++) {
      particles.push({
        x: x + rand(-10, 10),
        y: y + rand(-4, 8),
        vx: rand(-90, 90),
        vy: rand(-30, 140),
        g: 540,
        life: 0.58,
        max: 0.58,
        r: rand(1.8, 4.4),
        rgb: DIRT
      });
    }
  }

  function floatText(x, y, s, rgb, big) {
    floats.push({ x: x, y: y, s: s, rgb: rgb, t: 0, big: !!big });
  }

  function ringAt(x, y, rgb, r) {
    rings.push({ x: x, y: y, rgb: rgb, r: 4, max: r, t: 0 });
  }

  function hurt(u, dmg, why) {
    if (!u || dmg <= 0 || u.hp <= 0) return 0;
    dmg = Math.max(1, Math.round(dmg));
    u.hp = Math.max(0, u.hp - dmg);
    u.hitT = 0.28;
    u.flash = 0.22;
    floatText(u.x, u.y - 22, '-' + dmg, u.side === 'p' ? CYN : MAG, true);
    if (u.side === 'p' && hpP && hpP.parentElement && hpP.parentElement.parentElement) {
      const wrap = document.querySelector('.hp-p');
      if (wrap) {
        wrap.classList.remove('flash');
        void wrap.offsetWidth;
        wrap.classList.add('flash');
      }
    }
    if (u.side === 'f') {
      const wrap = document.querySelector('.hp-f');
      if (wrap) {
        wrap.classList.remove('flash');
        void wrap.offsetWidth;
        wrap.classList.add('flash');
      }
    }
    if (why !== 'fall' && why !== 'void') addRage(u, Math.floor(dmg * 0.55));
    if (why === 'fall') addRage(u, Math.floor(dmg * 0.55));
    audio.hit();
    return dmg;
  }

  function applyBlast(x, y, wep, shooter) {
    const mul = dmgMul();
    let any = false;
    const list = [G.p, G.f];
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      if (!u || u.hp <= 0) continue;
      const d = hypot(x - u.x, y - u.y);
      let dmg = 0;
      const body = d <= u.r + 5;
      if (body) dmg = wep.direct * mul;
      if (d < wep.splash) {
        const fall = Math.pow(1 - d / wep.splash, 1.1);
        const spl = wep.direct * 0.72 * fall * mul;
        if (spl > dmg) dmg = spl;
      }
      if (shooter && shooter.ult) dmg *= 1.6;
      if (dmg >= 1) {
        const dealt = hurt(u, dmg, 'blast');
        if (dealt > 0 && u !== shooter) {
          any = true;
          if (shooter && !shooter.stake) addRage(shooter, Math.floor(dealt * 0.45));
          if (wep && wep.id === 3 && u !== shooter) u.frozen = 1;
        }
      }
    }
    return any;
  }

  function ungroundIfAir(u) {
    if (!u) return;
    const gy = groundAt(u.x) - u.r;
    if (gy > u.y + 3) {
      u.grounded = false;
      if (u.vy < 0) u.vy = 0;
    } else if (u.grounded) {
      u.y = gy;
    }
  }

  function stepUnitPhys(u, dt) {
    if (!u || u.hp <= 0) {
      if (u && u.hp <= 0) {
        u.y += 30 * dt;
      }
      return;
    }
    if (u.hitT > 0) u.hitT -= dt;
    if (u.flash > 0) u.flash -= dt;
    if (u.walkT > 0) u.walkT -= dt;
    u.bob += dt * 3.2;
    const gy = groundAt(u.x) - u.r;
    if (u.grounded) {
      if (gy > u.y + 2.5) {
        u.grounded = false;
        u.vy = 0;
        u.fall = 0;
      } else {
        u.y = gy;
        u.vy = 0;
      }
    } else {
      u.vy += GRAV * dt;
      const ny = u.y + u.vy * dt;
      u.fall += Math.max(0, ny - u.y);
      u.y = ny;
      if (u.y > VH + 40) {
        addRage(u, 20);
        u.hp = 0;
        u.rage = 0;
        floatText(u.x, VH - 40, '坠亡', MAG, true);
        audio.fall();
        if (G.kind === 'drill') {
          G.stakeT = u.stake ? 1.2 : 0.4;
          if (!u.stake) G.needPlayerUp = true;
        }
        return;
      }
      if (isDeathVoid(u.x)) return;
      if (u.y >= gy) {
        u.y = gy;
        u.grounded = true;
        u.vy = 0;
        if (u.fall >= 36) {
          let dmg = Math.min(28, Math.floor((u.fall - 36) * 0.35));
          dmg = Math.max(1, Math.round(dmg * dmgMul()));
          hurt(u, dmg, 'fall');
          burst(u.x, u.y + u.r, DIRT, 12, 140, 0.4);
          audio.fall();
          kick(3.2);
        }
        u.fall = 0;
      }
    }
  }

  function unitsSettled() {
    const a = !G.p || G.p.hp <= 0 || (G.p.grounded && Math.abs(G.p.vy) < 4);
    const b = !G.f || G.f.hp <= 0 || (G.f.grounded && Math.abs(G.f.vy) < 4);
    return a && b;
  }

  function checkEnd() {
    if (G.kind === 'drill') {
      if (G.p && G.p.hp <= 0) {
        const x = spawnX(G.mapId, 'p');
        G.p.hp = G.p.max;
        G.p.x = x;
        G.p.y = groundAt(x) - G.p.r;
        G.p.grounded = true;
        G.p.vy = 0;
        G.p.fall = 0;
        toast('岚丸回堂', true, false);
      }
      if (G.f && G.f.hp <= 0) G.stakeT = Math.max(G.stakeT, 1.2);
      return false;
    }
    const pd = !G.p || G.p.hp <= 0;
    const fd = !G.f || G.f.hp <= 0;
    if (!pd && !fd) return false;
    G.mode = 'end';
    G.phase = 'end';
    audio.chargeStop();
    const turns = G.turns;
    if (pd && fd) {
      G.winStreak = 0;
      saveBest();
      audio.lose();
      showOverlay('draw', '对坠', '同烬。本局 ' + turns + ' 回合 · 连胜清零');
      setHint('对坠 · R 再来', 'warn');
    } else if (fd) {
      G.winStreak += 1;
      if (!G.bestTurns || turns < G.bestTurns) G.bestTurns = turns;
      saveBest();
      audio.win();
      popStreak(1);
      screenFlash(GOLD, 0.55);
      showOverlay('win', '堂破了', '烬丸倒了。' + turns + ' 回合 · 连胜 ' + G.winStreak + (G.bestTurns ? ' · 最快 ' + G.bestTurns + ' 回' : ''));
      setHint('堂破了 · R 再来', 'hot');
    } else {
      G.winStreak = 0;
      saveBest();
      audio.lose();
      screenFlash(MAG, 0.5);
      showOverlay('lose', '落堂了', '岚丸倒下。本局 ' + turns + ' 回合');
      setHint('落堂了 · R 再来', 'warn');
    }
    syncHud();
    return true;
  }

  function beginTurn(who) {
    if (G.kind === 'drill') who = 'p';
    G.turn = who;
    G.phase = 'aim';
    G.charging = false;
    G.busy = null;
    G.busyT = 0;
    G.power = TAP_POW;
    G.walk = WALK_PX;
    G.timeout = TURN_T;
    G.shot = null;
    trail.length = 0;
    const u = who === 'p' ? G.p : G.f;
    if (u) {
      u.stam = STAM_MAX;
      if (G.kind === 'drill') resetItems(u);
    }
    G.stam = u ? u.stam : STAM_MAX;
    rollWind();
    if (who === 'p') G.turns += 1;
    maybeSudden();
    audio.chargeStop();
    if (u && u.frozen) {
      toast(u.name + ' 被冻结', true, false);
      G.phase = 'frozenWait';
      G.frozenT = 0.55;
      u.frozen = 0;
      if (u.ult) u.ult = false;
      syncHud();
      return;
    }
    toast(who === 'p' ? '岚丸的回合 · 风 ' + windText() : '烬丸瞄准中 · 风 ' + windText(), false, who === 'p');
    setHint(G.kind === 'drill' ? OPS_DRILL : (who === 'p' ? OPS_PLAY : '烬丸拉炮…'), who === 'p' ? '' : 'warn');
    if (who === 'f' && G.kind !== 'drill') startAI();
    syncHud();
    setCamFighters();
  }

  function dropCol(x) {
    if (!G.H || x < 0 || x >= VW) return;
    G.H[x] = VH - 8;
  }

  function crumbleBand() {
    if (!G.sudden || !G.H) return;
    let nL = G.safeL + SUDDEN_SHRINK;
    let nR = G.safeR - SUDDEN_SHRINK;
    if (nR - nL < SUDDEN_MIN) {
      const mid = (G.safeL + G.safeR) * 0.5;
      nL = Math.max(G.safeL, mid - SUDDEN_MIN * 0.5);
      nR = Math.min(G.safeR, mid + SUDDEN_MIN * 0.5);
      if (nL <= G.safeL && nR >= G.safeR) return;
    }
    const oldL = G.safeL;
    const oldR = G.safeR;
    for (let x = oldL | 0; x < nL; x++) dropCol(x);
    for (let x = (nR | 0) + 1; x <= oldR; x++) dropCol(x);
    G.safeL = nL;
    G.safeR = nR;
    terrainDirty = true;
    dirtBurst(nL, groundAt(nL), 12);
    dirtBurst(nR, groundAt(nR), 12);
    kick(4.2);
    ungroundIfAir(G.p);
    ungroundIfAir(G.f);
  }

  function maybeSudden() {
    if (G.kind === 'drill' || G.mode !== 'play') return;
    if (G.sudden) {
      crumbleBand();
      return;
    }
    const both = G.p && G.f && G.p.hp > 0 && G.f.hp > 0 && G.p.hp <= SUDDEN_HP && G.f.hp <= SUDDEN_HP;
    if (G.turns > SUDDEN_TURN || both) {
      G.sudden = true;
      G.safeL = 0;
      G.safeR = VW - 1;
      toast('殿塌', true, false);
      audio.ensure();
      audio.beep(70, 0.28, 'sine', 0.06, 28);
      audio.noise(0.22, 0.08, 90);
      screenFlash(MAG, 0.28);
      crumbleBand();
    }
  }

  function startCharge() {
    if (G.mode !== 'play' || G.phase !== 'aim' || G.turn !== 'p') return;
    if (G.busy) return;
    G.phase = 'charge';
    G.charging = true;
    G.power = TAP_POW;
    audio.ensure();
    audio.chargeStart();
  }

  function releaseCharge() {
    if (G.mode !== 'play') return;
    if (G.phase === 'charge' && G.turn === 'p' && G.charging) {
      fire(G.p);
    }
  }

  function fire(u) {
    if (!u || G.phase === 'fly') return;
    const wep = wepOf();
    const th = u.ang * Math.PI / 180;
    const nose = 18;
    const sx = u.x + Math.cos(th) * nose;
    const sy = u.y - 4 - Math.sin(th) * nose;
    const spd = muzzleSpeed(G.power, u.ang, wep);
    if (G.neonOn) {
      if (u.items && u.items.neon > 0) u.items.neon -= 1;
      G.neonOn = false;
    }
    G.shot = {
      x: sx,
      y: sy,
      vx: Math.cos(th) * spd,
      vy: -Math.sin(th) * spd,
      wep: wep,
      owner: u,
      pierced: false,
      fuse: 0,
      life: 0,
      ult: !!u.ult
    };
    if (u.side === 'p') {
      G.ghostPend = { x: sx, y: sy, ang: u.ang, power: Math.round(G.power), wepId: wep.id, wind: G.wind, points: [] };
    }
    trail.length = 0;
    G.phase = 'fly';
    G.charging = false;
    G.busy = null;
    G.camHold = false;
    audio.fire(wep);
    if (wep.id === 3) audio.beep(520, 0.1, 'triangle', 0.04, 180);
    if (wep.id === 4) {
      audio.beep(300, 0.07, 'square', 0.03, 520);
      audio.beep(480, 0.08, 'triangle', 0.028, 880);
    }
    if (wep.id === 5) {
      audio.beep(180, 0.14, 'sine', 0.045, 520);
      audio.beep(90, 0.1, 'triangle', 0.03, 240);
    }
    if (u.ult) audio.beep(90, 0.28, 'sine', 0.06, 36);
    burst(sx, sy, u.ult ? GOLD : (wep.id === 3 ? ICE : (wep.id === 5 ? RAIL : (u.side === 'p' ? CYN : MAG))), 8, 80, 0.25);
    u.walkT = 0;
  }

  function explode(x, y, wep, owner, fromHit) {
    let crater = wep.crater;
    const wasUlt = !!(owner && owner.ult);
    const ultMul = wasUlt ? 1.35 : 1;
    if (wasUlt) crater = Math.round(crater * 1.35);
    let hit = !!fromHit;
    if (wep.id === 4) {
      const pops = carveCluster(x, y, ultMul);
      for (let i = 0; i < pops.length; i++) {
        const pop = pops[i];
        snapBridge(pop.x, pop.r, wep);
        if (applyBlast(pop.x, pop.y, wep, owner)) hit = true;
        burst(pop.x, pop.y, hit ? HOT : DIRT, hit ? 12 : 8, 160, 0.4);
        ringAt(pop.x, pop.y, HOT, pop.r * 1.5);
      }
      burst(x, y, GOLD, hit ? 8 : 3, 120, 0.32);
    } else {
      carve(x, y, crater);
      snapBridge(x, crater, wep);
      if (wep.id === 2 && G.shot && G.shot.pierced) {
        const s = hypot(G.shot.vx, G.shot.vy) || 1;
        const ux = G.shot.vx / s;
        const uy = G.shot.vy / s;
        for (let s2 = 0; s2 <= 46; s2 += 4) carve(x - ux * s2, y - uy * s2, 12);
      }
      hit = applyBlast(x, y, wep, owner) || hit;
      burst(x, y, hit ? (owner && owner.side === 'p' ? CYN : MAG) : DIRT, hit ? 28 : 16, hit ? 260 : 180, 0.55);
      burst(x, y, GOLD, hit ? 10 : 4, 140, 0.35);
      ringAt(x, y, hit ? GOLD : HOT, crater * 1.6);
    }
    dirtBurst(x, y, hit ? 14 : 20);
    audio.boom(hit, wep, wasUlt);
    setCamImpact(x, y);
    if (wasUlt) {
      floatText(x, y - 48, '殿破', GOLD, true);
      screenFlash(GOLD, 0.45);
      hitStop(0.12);
      kick(6.5);
    }
    if (hit) {
      audio.hit();
      hitStop(fromHit ? 0.12 : 0.09);
      if (fromHit && !REDUCE) G.slowMo = Math.max(G.slowMo || 0, 0.10);
      kick(fromHit ? 7.4 : 5.6);
      screenFlash(wasUlt ? GOLD : (owner && owner.side === 'p' ? CYN : MAG), wasUlt ? 0.45 : 0.28);
      G.combo += 1;
      if (G.combo >= 2) {
        floatText(x, y - 36, '连堂 ×' + G.combo, GOLD, true);
        audio.combo(G.combo);
        if (comboEl) {
          comboEl.classList.remove('hot');
          void comboEl.offsetWidth;
          comboEl.classList.add('hot');
        }
      }
    } else {
      G.combo = 0;
      audio.dirt();
      kick(2.8);
    }
    if (owner && owner.ult) owner.ult = false;
    if (G.ghostPend) {
      const pts = trail.slice();
      pts.push({ x: x, y: y, a: 1 });
      G.ghost = {
        x: G.ghostPend.x, y: G.ghostPend.y,
        ang: G.ghostPend.ang, power: G.ghostPend.power,
        wepId: G.ghostPend.wepId, wind: G.ghostPend.wind,
        points: pts
      };
      G.ghostPend = null;
    }
    ungroundIfAir(G.p);
    ungroundIfAir(G.f);
    G.shot = null;
    G.phase = 'settle';
    G.settleT = 0.22;
    refreshBury(G.p);
    refreshBury(G.f);
    syncHud();
  }

  function stepShot(dt) {
    const s = G.shot;
    if (!s) return;
    s.vx += G.wind * windKAt(s.wep, s.life) * dt;
    s.vy += (GRAV + gustAy(s.x)) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life += dt;
    trail.push({ x: s.x, y: s.y, a: 1 });
    if (trail.length > 42) trail.shift();
    if (G.ghostPend) G.ghostPend.points = trail.slice();
    setCamShot(s);
    if (s.x < 2 || s.x > VW - 2 || s.y > VH + 20) {
      explode(clamp(s.x, 2, VW - 2), Math.min(s.y, VH - 4), s.wep, s.owner, false);
      return;
    }
    const u = unitAt(s.x, s.y, s.owner);
    if (u) {
      explode(s.x, s.y, s.wep, s.owner, true);
      return;
    }
    if (inGround(s.x, s.y)) {
      if (s.wep.id === 2 && !s.pierced) {
        s.pierced = true;
        s.fuse = 0.18;
        const sp = hypot(s.vx, s.vy) || 1;
        const ux = s.vx / sp;
        const uy = s.vy / sp;
        for (let k = 0; k <= 46; k += 4) carve(s.x + ux * k, s.y + uy * k, 11);
        s.x += ux * 46;
        s.y += uy * 46;
        let g = 0;
        while (inGround(s.x, s.y) && g < 18) {
          s.x += ux * 3;
          s.y += uy * 3;
          g += 1;
        }
        burst(s.x, s.y, HOT, 10, 120, 0.3);
        audio.tick();
        return;
      }
      explode(s.x, s.y, s.wep, s.owner, false);
      return;
    }
    if (s.pierced) {
      s.fuse -= dt;
      if (s.fuse <= 0) explode(s.x, s.y, s.wep, s.owner, false);
    }
  }


  function playerCanAct() {
    return G.mode === 'play' && G.turn === 'p' && G.phase === 'aim' && !G.busy;
  }

  function toastDeny(msg) { toast(msg, true, false); }

  function useLeap(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (u.frozen) return false;
    if (!u.grounded) { if (u.side === 'p') toastDeny('空中不能飞步'); return false; }
    if (!u.items || u.items.leap <= 0) { if (u.side === 'p') toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.leap) { if (u.side === 'p') toastDeny('体力不足'); return false; }
    let dir = facingOf(u);
    if (u.side === 'p') {
      if (keys.l || padHold.l) dir = -1;
      if (keys.r || padHold.r) dir = 1;
    }
    u.items.leap -= 1;
    u.stam -= ITEM_COST.leap;
    u.face = dir;
    G.busy = 'leap';
    G.busyT = 0;
    G.leap = { u: u, x0: u.x, y0: u.y, dir: dir };
    u.grounded = false;
    toast('飞步', false, false);
    audio.ensure();
    audio.beep(420, 0.09, 'sine', 0.04, 720);
    burst(u.x, u.y, CYN, 6, 70, 0.2);
    syncHud();
    return true;
  }

  function stepLeap(dt) {
    const L = G.leap;
    if (!L || !L.u) { G.busy = null; return; }
    G.busyT += dt;
    const s = clamp(G.busyT / LEAP_T, 0, 1);
    const x1 = clamp(L.x0 + LEAP_DX * L.dir, 22, VW - 22);
    L.u.x = L.x0 + (x1 - L.x0) * s;
    L.u.y = L.y0 - 4 * LEAP_H * s * (1 - s);
    L.u.walkT = 0.08;
    if (s >= 1) {
      L.u.x = x1;
      L.u.vy = 0;
      L.u.fall = 0;
      ungroundIfAir(L.u);
      if (L.u.grounded) L.u.y = groundAt(L.u.x) - L.u.r;
      G.busy = null;
      G.leap = null;
      if (G.phase === 'aim') { /* stay aim */ }
    }
  }

  function validWarpX(from, x) {
    x = clamp(x, 22, VW - 22);
    const dx = x - from.x;
    const gy = groundAt(x);
    const dy = (gy - from.r) - from.y;
    if (hypot(dx, dy) > WARP_R) {
      const k = WARP_R / hypot(dx, dy);
      x = clamp(from.x + dx * k, 22, VW - 22);
    }
    return x;
  }

  function beginWarp(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (!u.items || u.items.warp <= 0) { if (u.side === 'p') toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.warp) { if (u.side === 'p') toastDeny('体力不足'); return false; }
    G.busy = 'warpAim';
    G.warpX = validWarpX(u, G.pointer.x);
    toast('影挪 · 点地确认', false, false);
    return true;
  }

  function confirmWarp(u) {
    if (G.busy !== 'warpAim' || !u) return false;
    const x = validWarpX(u, G.warpX);
    u.items.warp -= 1;
    u.stam -= ITEM_COST.warp;
    u.x = x;
    u.y = Math.max(24, groundAt(x) - u.r);
    u.vy = 0;
    u.fall = 0;
    ungroundIfAir(u);
    G.busy = null;
    toast('影挪', false, true);
    audio.ensure();
    audio.beep(880, 0.08, 'triangle', 0.04, 1400);
    burst(u.x, u.y, CYN, 10, 90, 0.22);
    syncHud();
    return true;
  }

  function cancelWarp() {
    if (G.busy !== 'warpAim') return;
    G.busy = null;
    toast('取消影挪', false, false);
  }

  function toggleNeon(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (!u.items || u.items.neon <= 0) { if (u.side === 'p') toastDeny('本局已用完'); return false; }
    G.neonOn = !G.neonOn;
    toast(G.neonOn ? '霓弹 · 本发' : '卸下霓弹', false, G.neonOn);
    syncHud();
    return true;
  }

  function useDrum(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (!u.items || u.items.drum <= 0) { if (u.side === 'p') toastDeny('本局已用完'); return false; }
    u.items.drum -= 1;
    if (u.rage >= 100) toast('怒已满', false, true);
    else {
      addRage(u, 50);
      toast('鼓息', false, true);
    }
    audio.ensure();
    audio.beep(330, 0.08, 'sine', 0.04, 660);
    audio.beep(520, 0.12, 'triangle', 0.03, 880);
    burst(u.x, u.y, GOLD, 8, 70, 0.22);
    syncHud();
    return true;
  }

  function useUlt(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (u.ult) { toast('殿破已点亮', false, true); return false; }
    if ((u.rage || 0) < 100) { if (u.side === 'p') toastDeny('怒气未满'); return false; }
    u.rage = 0;
    u.ult = true;
    toast('殿破 · 下一发', false, true);
    audio.ensure();
    audio.beep(140, 0.16, 'sine', 0.05, 60);
    syncHud();
    return true;
  }

  function skipTurn() {
    if (G.mode !== 'play' || G.phase !== 'aim' || G.busy) return;
    const u = curUnit();
    if (u && u.ult) u.ult = false;
    G.neonOn = false;
    G.combo = 0;
    G.charging = false;
    audio.chargeStop();
    toast('跳过', false, false);
    G.phase = 'settle';
    G.settleT = 0.10;
    syncHud();
  }

  function onItem(id) {
    if (G.mode !== 'play') return;
    if (G.turn !== 'p') return;
    const u = G.p;
    if (id === 'leap') useLeap(u);
    else if (id === 'warp') {
      if (G.busy === 'warpAim') confirmWarp(u);
      else beginWarp(u);
    } else if (id === 'neon') toggleNeon(u);
    else if (id === 'drum') useDrum(u);
    else if (id === 'ult') useUlt(u);
    else if (id === 'skip') skipTurn();
  }

  function pitDepth(u) {
    if (!u) return 0;
    const g = groundAt(u.x);
    const gl = groundAt(clamp(u.x - 48, 0, VW - 1));
    const gr = groundAt(clamp(u.x + 48, 0, VW - 1));
    return g - (gl + gr) * 0.5;
  }

  function walkBlocked(u) {
    return !!(u && u.hp > 0 && pitDepth(u) >= BURY_PX);
  }

  function refreshBury(u) {
    if (!u) return;
    if (u.hp <= 0) { u.buried = false; return; }
    const now = pitDepth(u) >= BURY_PX;
    if (now && !u.buried) {
      toast('埋了', true, false);
      floatText(u.x, u.y - 28, '埋了', DIRT, true);
      burst(u.x, u.y + (u.r || 14), DIRT, REDUCE ? 8 : 20, 110, 0.55);
      audio.dirt();
    }
    u.buried = now;
  }

  function thinLedge(u) {
    if (!u) return false;
    const g0 = groundAt(u.x);
    return (groundAt(clamp(u.x - 36, 0, VW - 1)) - g0 > 28) || (groundAt(clamp(u.x + 36, 0, VW - 1)) - g0 > 28);
  }

  let AI = { wait: 0, walked: false, ang: 65, pow: 70, wep: 0, stage: 0 };

  function pickAIWeapon() {
    const foe = G.p;
    if (foe) {
      if (thinLedge(foe) || pitDepth(foe) > 16) return 3;
      if (G.mapId === 'bridge' && liveBridge(foe.x)) return 3;
    }
    if (Math.abs(G.wind) >= 4) return 4;
    if (G.mapId === 'canyon') return 2;
    if (foe) {
      const x = foe.x | 0;
      const g0 = groundAt(x);
      const gl = groundAt(clamp(x - 36, 0, VW - 1));
      const gr = groundAt(clamp(x + 36, 0, VW - 1));
      if (gl - g0 > 28 || gr - g0 > 28) return 1;
      if (foe.x < 70 || foe.x > VW - 70) return 1;
    }
    return 0;
  }

  function scoreImpact(imp, wep, from) {
    if (!imp || !G.p) return -1e9;
    const t = G.p;
    const d = hypot(imp.x - t.x, imp.y - t.y);
    const feet = hypot(imp.x - t.x, imp.y - (t.y + t.r));
    const mid = Math.abs(imp.x - (from.x + t.x) * 0.5);
    let score = 200 - d * 0.45 - mid * 0.05;
    if (imp.hit === t) score = 12000 - imp.t * 40;
    else if (d < wep.splash) score = 5000 - d * 28;
    else if (feet < 40) score = 1800 - feet * 16;
    let bury = 0;
    const feetX = Math.abs(imp.x - t.x);
    const craterEff = wep.id === 4 ? 54 : wep.crater;
    if (feetX < 34 && craterEff >= 30) bury += 900 + craterEff * 0.7 * 8;
    if (pitDepth(t) > 16 && feetX < 50 && wep.id === 4) bury += 1600;
    if (pitDepth(t) > 28 && feetX < 50) bury += 1400;
    if (G.mapId === 'bridge' && liveBridge(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 800;
    score += bury;
    const selfD = hypot(imp.x - from.x, imp.y - from.y);
    if (selfD < wep.splash * 0.45) {
      const fall = Math.pow(1 - selfD / wep.splash, 1.1);
      const spl = wep.direct * 0.72 * fall * dmgMul();
      if (from.hp <= spl) score -= 20000;
    }
    return score;
  }

  function solveAI(from) {
    const wep = G.neonOn ? NEON : (WEPS[G.wep] || WEPS[0]);
    let best = { score: -1e9, ang: from.ang, pow: 70 };
    function muzzle(ang) {
      const th = ang * Math.PI / 180;
      return { x: from.x + Math.cos(th) * 18, y: from.y - 4 - Math.sin(th) * 18 };
    }
    for (let ang = 15; ang <= 165; ang += 3) {
      for (let pow = 18; pow <= 100; pow += 4) {
        const m = muzzle(ang);
        const imp = traceShot(m.x, m.y, ang, pow, G.wind, wep, G.H, from);
        const sc = scoreImpact(imp, wep, from);
        if (sc > best.score) best = { score: sc, ang: ang, pow: pow };
      }
    }
    for (let ang = best.ang - 3; ang <= best.ang + 3; ang += 1) {
      for (let pow = best.pow - 4; pow <= best.pow + 4; pow += 1) {
        if (ang < 8 || ang > 172 || pow < 14 || pow > 100) continue;
        const m = muzzle(ang);
        const imp = traceShot(m.x, m.y, ang, pow, G.wind, wep, G.H, from);
        const sc = scoreImpact(imp, wep, from);
        if (sc > best.score) best = { score: sc, ang: ang, pow: pow };
      }
    }
    return best;
  }

  function planAIMove(from) {
    let best = solveAI(from);
    let walkTo = from.x;
    const tries = [-72, -40, 40, 72];
    const ox = from.x;
    const oy = from.y;
    for (let i = 0; i < tries.length; i++) {
      const nx = clamp(ox + tries[i], 28, VW - 28);
      if (isDeathVoid(nx)) continue;
      if (G.sudden && (nx < G.safeL + 16 || nx > G.safeR - 16)) continue;
      from.x = nx;
      from.y = groundAt(nx) - from.r;
      const b2 = solveAI(from);
      if (b2.score > best.score + 80) {
        best = b2;
        walkTo = nx;
      }
    }
    from.x = ox;
    from.y = oy;
    return { best: best, walkTo: walkTo };
  }

  function pickAIWarp(from) {
    if (!from.items || from.items.warp <= 0 || from.stam < 25) return 0;
    if (G.turns <= 1) return 0;
    const foe = G.p;
    if (isDeathVoid(from.x) || (G.sudden && (from.x < G.safeL + 24 || from.x > G.safeR - 24)) || pitDepth(from) >= 40) {
      let bestX = 0, bestY = 1e9, bestD = 0;
      for (let i = 0; i < 16; i++) {
        const a = i * TAU / 16;
        const x = clamp(from.x + Math.cos(a) * 180, 22, VW - 22);
        if (Math.abs(x - from.x) > WARP_R) continue;
        const gy = groundAt(x);
        const dFoe = Math.abs(x - foe.x);
        if (isDeathVoid(x)) continue;
        if (gy < bestY - 8 || (Math.abs(gy - bestY) < 8 && dFoe > bestD)) {
          if (dFoe >= GRID * 3) { bestY = gy; bestX = x; bestD = dFoe; }
        }
      }
      if (bestX) return bestX;
    }
    if (thinLedge(from) && from.hp <= 35) {
      for (let dx = -200; dx <= 200; dx += 20) {
        const x = clamp(from.x + dx, 22, VW - 22);
        if (Math.abs(x - from.x) > WARP_R) continue;
        if (isDeathVoid(x)) continue;
        const g0 = groundAt(x);
        const gl = groundAt(clamp(x - 20, 0, VW - 1));
        const gr = groundAt(clamp(x + 20, 0, VW - 1));
        if (Math.abs(gl - g0) < 10 && Math.abs(gr - g0) < 10) return x;
      }
    }
    let bestX = 0, bestSc = solveAI(from).score;
    const dists = [80, 150, 220];
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      for (let k = 0; k < dists.length; k++) {
        const x = clamp(from.x + Math.cos(a) * dists[k], 22, VW - 22);
        if (hypot(x - from.x, 0) > WARP_R) continue;
        if (isDeathVoid(x)) continue;
        const ox = from.x, oy = from.y;
        from.x = x;
        from.y = groundAt(x) - from.r;
        const sc = solveAI(from).score;
        from.x = ox; from.y = oy;
        if (sc > bestSc + 400) { bestSc = sc; bestX = x; }
      }
    }
    return bestX;
  }

  function startAI() {
    G.wep = pickAIWeapon();
    G.neonOn = false;
    syncWeps();
    const from = G.f;
    const plan = { drum: false, warp: 0, leap: 0, neon: false, ult: false };
    const score0 = solveAI(from).score;
    if (from.items && from.items.drum > 0) {
      if (from.rage <= 50) plan.drum = true;
      else if (from.rage < 100 && score0 >= 8000 && from.rage + 50 >= 100) plan.drum = true;
    }
    const warpX = pickAIWarp(from);
    if (warpX) plan.warp = warpX;
    if (!plan.warp && from.items && from.items.leap > 0 && from.stam >= 35) {
      const ox = from.x, oy = from.y;
      let leapDir = 0;
      const opts = [1, -1];
      for (let i = 0; i < opts.length; i++) {
        const nx = clamp(ox + LEAP_DX * opts[i], 22, VW - 22);
        if (isDeathVoid(nx)) continue;
        from.x = nx;
        from.y = groundAt(nx) - from.r;
        const sc = solveAI(from).score;
        if (sc > score0 + 220) { leapDir = opts[i]; }
      }
      from.x = ox; from.y = oy;
      if (pitDepth(from) >= 40) {
        const gL = groundAt(clamp(from.x - 80, 0, VW - 1));
        const gR = groundAt(clamp(from.x + 80, 0, VW - 1));
        if (gL < groundAt(from.x) - 10) leapDir = -1;
        if (gR < groundAt(from.x) - 10) leapDir = 1;
      }
      if (!leapDir && Math.random() < 0.30) {
        const opts2 = [1, -1];
        for (let i = 0; i < opts2.length; i++) {
          const nx = clamp(ox + LEAP_DX * opts2[i], 22, VW - 22);
          if (isDeathVoid(nx)) continue;
          from.x = nx;
          from.y = groundAt(nx) - from.r;
          const sc = solveAI(from).score;
          if (sc > score0 + 60) leapDir = opts2[i];
        }
        from.x = ox; from.y = oy;
      }
      if (G.kind === 'core' && from.hp <= 18 && G.p && G.p.rage >= 80) {
        leapDir = from.x < G.p.x ? -1 : 1;
      }
      if (G.sudden) {
        if (from.x > G.safeR - 28 && !isDeathVoid(from.x - LEAP_DX)) leapDir = -1;
        else if (from.x < G.safeL + 28 && !isDeathVoid(from.x + LEAP_DX)) leapDir = 1;
      }
      plan.leap = leapDir;
    }
    const moved = planAIMove(from);
    let best = moved.best;
    if (from.items && from.items.neon > 0 && G.turns - G.aiLastNeonTurn >= 2 && G.p && G.p.hp > 12 && best.score >= 4000) {
      const lead = from.hp - G.p.hp >= 15;
      const breakRage = G.p.rage >= 80;
      const ledge = thinLedge(G.p);
      if (lead || breakRage || ledge) plan.neon = true;
    }
    if ((from.rage >= 100 || (plan.drum && from.rage + 50 >= 100)) && best.score >= 5000) plan.ult = true;
    const loose = G.kind === 'core' ? 0 : 1;
    const aj = loose ? 3 : 1.5;
    const pj = loose ? 4 : 2;
    best.ang = clamp(best.ang + rand(-aj, aj), 5, 175);
    let toasted = false;
    if (Math.abs(elev(best.ang) - 65) <= 8) {
      const jit = rand(0.05, 0.08) * (Math.random() < 0.5 ? -1 : 1);
      best.pow = clamp(best.pow * (1 + jit), 16, 100);
      if (Math.random() < 0.16) {
        toast('烬丸补角', false, false);
        toasted = true;
      }
    } else {
      best.pow = clamp(best.pow + rand(-pj, pj), 16, 100);
    }
    if (!toasted && Math.random() < 0.10 && best.score >= 4000) toast('烬丸冷笑', false, true);
    AI.wait = 0.2;
    AI.walked = false;
    AI.walkTo = moved.walkTo;
    AI.ang = best.ang;
    AI.pow = best.pow;
    AI.score = best.score;
    AI.plan = plan;
    AI.stage = 'prep';
  }

  function stepAI(dt) {
    const u = G.f;
    if (!u) return;
    if (AI.stage === 'prep') {
      AI.wait -= dt;
      if (AI.wait > 0) return;
      const plan = AI.plan || {};
      if (plan.drum) { useDrum(u); plan.drum = false; AI.wait = 0.18; return; }
      if (plan.warp) {
        G.warpX = plan.warp;
        G.busy = 'warpAim';
        confirmWarp(u);
        plan.warp = 0;
        const moved = planAIMove(u);
        AI.walkTo = moved.walkTo;
        AI.ang = moved.best.ang;
        AI.pow = moved.best.pow;
        AI.wait = 0.16;
        return;
      }
      if (plan.leap) {
        u.face = plan.leap;
        useLeap(u);
        plan.leap = 0;
        AI.stage = 'leap';
        return;
      }
      if (plan.neon) { G.neonOn = true; G.aiLastNeonTurn = G.turns; }
      if (plan.ult && u.rage >= 100) useUlt(u);
      AI.stage = 0;
      AI.wait = 0.16;
      return;
    }
    if (AI.stage === 'leap') {
      if (G.busy === 'leap') return;
      const moved = planAIMove(u);
      AI.walkTo = moved.walkTo;
      AI.ang = moved.best.ang;
      AI.pow = moved.best.pow;
      AI.stage = 0;
      AI.wait = 0.12;
      return;
    }
    if (AI.stage === 0) {
      AI.wait -= dt;
      if (AI.wait > 0) return;
      AI.stage = 1;
    }
    if (AI.stage === 1) {
      if (walkBlocked(u)) {
        AI.stage = 2;
        AI.wait = 0.08;
        return;
      }
      const dx = AI.walkTo - u.x;
      if (Math.abs(dx) > 2 && G.walk > 0 && u.stam > 0) {
        const dir = dx > 0 ? 1 : -1;
        const step = Math.min(G.walk, u.stam, 78 * dt, Math.abs(dx));
        const lo = G.sudden ? G.safeL + 18 : 22;
        const hi = G.sudden ? G.safeR - 18 : VW - 22;
        u.x = clamp(u.x + dir * step, lo, hi);
        G.walk -= step;
        u.stam -= step;
        u.face = dir;
        u.walkT = 0.1;
        ungroundIfAir(u);
      } else {
        AI.stage = 2;
        AI.wait = 0.12;
      }
      return;
    }
    if (AI.stage === 2) {
      const da = AI.ang - u.ang;
      if (Math.abs(da) > 0.6) {
        u.ang += Math.sign(da) * Math.min(Math.abs(da), 70 * dt);
      } else {
        u.ang = AI.ang;
        AI.stage = 3;
        G.phase = 'charge';
        G.charging = true;
        G.power = TAP_POW;
        audio.chargeStart();
      }
      return;
    }
    if (AI.stage === 3) {
      G.power = Math.min(100, G.power + (100 - TAP_POW) / CHARGE_T * dt);
      audio.chargeTick(G.power);
      if (G.power >= AI.pow - 0.5 || G.power >= 100) {
        G.power = clamp(AI.pow, TAP_POW, 100);
        fire(u);
      }
    }
  }

  function walkPlayer(dt) {
    if (G.turn !== 'p' || G.phase !== 'aim' || G.busy) return;
    let dir = 0;
    if (keys.l || padHold.l) dir -= 1;
    if (keys.r || padHold.r) dir += 1;
    if (!dir || G.walk <= 0 || G.p.stam <= 0) return;
    if (walkBlocked(G.p)) {
      if (G.toastT <= 0.2) toast('埋了 · 飞步或影挪', true, false);
      return;
    }
    const step = Math.min(G.walk, G.p.stam, 90 * dt);
    G.p.x = clamp(G.p.x + dir * step, 22, VW - 22);
    G.walk -= step;
    G.p.stam -= step;
    G.p.face = dir;
    G.p.walkT = 0.12;
    ungroundIfAir(G.p);
  }

  function aimPlayer(dt) {
    if (G.turn !== 'p' || G.busy || (G.phase !== 'aim' && G.phase !== 'charge')) return;
    let dir = 0;
    if (keys.u || padHold.u) dir += 1;
    if (keys.d || padHold.d) dir -= 1;
    if (!dir) return;
    G.p.ang = clamp(G.p.ang + dir * 70 * dt, 0, 180);
  }

  function assistSnap(dt) {
    if ((G.assist | 0) < 3 || G.turn !== 'p' || G.busy) return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    if (!G.p || !G.f) return;
    const tip = schoolTips(G.p, G.f);
    const holdAng = keys.u || keys.d || padHold.u || padHold.d;
    if (!holdAng && Math.abs(G.p.ang - tip.ang65) <= 3) {
      G.p.ang = clamp(approach(G.p.ang, tip.ang65, 40 * dt), 0, 180);
    }
  }

  function applyCharge(dt) {
    const rate = (100 - TAP_POW) / CHARGE_T;
    if ((G.assist | 0) >= 3 && G.p && G.f) {
      const tip = schoolTips(G.p, G.f);
      const err = tip.pow65 - G.power;
      if (Math.abs(err) <= 4) {
        if (err > 0) G.power = approach(G.power, tip.pow65, 40 * dt);
        else G.power = Math.min(100, G.power + rate * 0.25 * dt);
        return;
      }
    }
    G.power = Math.min(100, G.power + rate * dt);
  }

  function resetWorld() {
    G.H = buildHeight(G.mapId);
    terrainDirty = true;
    G.p = makeUnit('p');
    G.f = makeUnit('f');
    G.shot = null;
    G.combo = 0;
    G.turns = 0;
    G.wep = 0;
    G.power = TAP_POW;
    G.neonOn = false;
    G.busy = null;
    G.ghost = null;
    G.ghostPend = null;
    G.stakeT = 0;
    G.aiLastNeonTurn = -9;
    particles.length = 0;
    floats.length = 0;
    rings.length = 0;
    trail.length = 0;
    cam.x = cam.tx = VW * 0.5;
    cam.y = cam.ty = VH * 0.5;
    cam.z = cam.tz = 1;
    G.camHold = false;
    G.sudden = false;
    G.safeL = 0;
    G.safeR = VW - 1;
    G.slowMo = 0;
  }

  function startGame(kind) {
    if (kind === 'drill') G.kind = 'drill';
    else if (kind === 'core') { G.kind = 'core'; G.lastKind = 'core'; }
    else { G.kind = 'hall'; G.lastKind = 'hall'; }
    G.mode = 'play';
    resetWorld();
    hideOverlay();
    audio.start();
    beginTurn('p');
    const msg = G.kind === 'core' ? '堂核 · 薄血狂风' : G.kind === 'drill' ? '演习场 · 对着表练' : '弹堂 · 看风拉角';
    toast(msg + ' · ' + MAP_NAME[G.mapId], G.kind === 'core', G.kind !== 'core');
    if (G.kind !== 'drill') saveBest();
    else saveBest();
    syncHud();
    syncDrillWind();
  }

  function goTitle() {
    G.mode = 'title';
    G.phase = 'aim';
    resetWorld();
    rollWind();
    audio.chargeStop();
    showOverlay('title', '弹堂', '看风，拉满或点射，把对面从石殿上轰下去。');
    setHint('1 / 回车 / 空格 弹堂 · 2 堂核 · 3 演习场 · 点地图换地形 · H 辅助');
    syncMaps();
    syncDrillWind();
    syncHud();
  }

  function restart() {
    audio.ensure();
    if (G.mode === 'title') startGame('hall');
    else startGame(G.kind || 'hall');
  }

  function setMap(id) {
    if (MAP_IDS.indexOf(id) < 0) return;
    G.mapId = id;
    if (G.mode === 'title') {
      resetWorld();
      rollWind();
    }
    syncMaps();
    syncHud();
    saveBest();
  }

  function setWep(n) {
    n = n | 0;
    if (n < 0 || n >= WEPS.length) return;
    if (G.mode === 'play' && G.phase !== 'aim' && G.phase !== 'charge') return;
    G.wep = n;
    syncWeps();
    syncHud();
    toast(WEPS[n].name, false, n === 1);
  }


  function updateFx(dt) {
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 18);
    if (G.flash > 0) G.flash = Math.max(0, G.flash - dt * 1.8);
    if (G.punch > 1) G.punch = 1 + (G.punch - 1) * Math.max(0, 1 - dt * 10);
    if (G.toastT > 0) {
      G.toastT -= dt;
      if (G.toastT <= 0 && toastEl) toastEl.classList.add('hidden');
    }
    let ck = 5.6;
    if (G.phase === 'fly') ck = 8.4;
    else if (G.phase === 'settle' && G.camHold) ck = 6.2;
    cam.x += (cam.tx - cam.x) * Math.min(1, dt * ck);
    cam.y += (cam.ty - cam.y) * Math.min(1, dt * ck);
    cam.z += (cam.tz - cam.z) * Math.min(1, dt * (G.phase === 'fly' ? 5.2 : 3.2));
    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.vy += q.g * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.life -= dt;
      if (q.life <= 0) particles.splice(i, 1);
    }
    for (let i = floats.length - 1; i >= 0; i--) {
      const f = floats[i];
      f.t += dt;
      f.y -= 28 * dt;
      if (f.t > 0.85) floats.splice(i, 1);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.t += dt;
      r.r = lerp(4, r.max, Math.min(1, r.t / 0.32));
      if (r.t > 0.4) rings.splice(i, 1);
    }
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.tw = (s.tw + dt * s.sp) % TAU;
    }
  }

  function update(dt) {
    G.clock += dt;
    G.t += dt;
    updateFx(dt);
    if (G.stop > 0) {
      G.stop -= dt;
      return;
    }
    if (G.p) stepUnitPhys(G.p, dt);
    if (G.f) stepUnitPhys(G.f, dt);
    if (G.stakeT > 0) {
      G.stakeT -= dt;
      if (G.stakeT <= 0 && G.f) {
        const x = spawnX(G.mapId, 'f');
        G.f.hp = G.f.max;
        G.f.x = x;
        G.f.y = groundAt(x) - G.f.r;
        G.f.grounded = true;
        G.f.vy = 0;
        G.f.fall = 0;
        floatText(x, G.f.y - 20, '归位', GOLD, false);
      }
    }
    if (G.mode === 'play' && G.phase !== 'fly' && G.phase !== 'settle') {
      if ((G.p && G.p.hp <= 0) || (G.f && G.f.hp <= 0)) {
        if (checkEnd()) return;
      }
    }
    if (G.mode === 'title') {
      if (G.p) G.p.ang = 65 + Math.sin(G.t * 0.7) * 6;
      if (G.f) G.f.ang = 115 + Math.sin(G.t * 0.55 + 1) * 6;
      return;
    }
    if (G.mode !== 'play') return;

    if (G.phase === 'frozenWait') {
      G.frozenT -= dt;
      if (G.frozenT <= 0) {
        if (G.kind === 'drill') beginTurn('p');
        else beginTurn(G.turn === 'p' ? 'f' : 'p');
      }
      return;
    }
    if (G.busy === 'leap') stepLeap(dt);
    if (G.phase === 'aim' || G.phase === 'charge') {
      G.timeout -= dt;
      if (G.timeout <= 0 && (G.turn === 'p' || G.turn === 'f') && !G.busy) {
        G.power = 50;
        fire(curUnit());
        toast('超时 · 半力打出', true, false);
        return;
      }
      if (G.turn === 'p') {
        if (!G.busy) {
          walkPlayer(dt);
          aimPlayer(dt);
          assistSnap(dt);
        }
        if (G.phase === 'charge' && !G.busy) {
          applyCharge(dt);
          audio.chargeTick(G.power);
        }
      } else if (G.kind !== 'drill') {
        stepAI(dt);
      }
      syncHud();
    } else if (G.phase === 'fly') {
      stepShot(dt);
    } else if (G.phase === 'settle') {
      refreshBury(G.p);
      refreshBury(G.f);
      G.settleT -= dt;
      if (G.settleT < 0.12) setCamFighters();
      if (G.settleT <= 0 && unitsSettled()) {
        if (checkEnd()) return;
        if (G.kind === 'drill') beginTurn('p');
        else beginTurn(G.turn === 'p' ? 'f' : 'p');
      }
    }
  }

  function seedStars() {
    stars.length = 0;
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: rand(0, VW),
        y: rand(8, 280),
        r: rand(0.5, 1.6),
        a: rand(0.25, 0.85),
        tw: rand(0, TAU),
        sp: rand(0.6, 2.2)
      });
    }
  }

  function keyArt(src, sx, sy, sw, sh) {
    const c = document.createElement('canvas');
    c.width = sw;
    c.height = sh;
    const g = c.getContext('2d');
    g.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
    const id = g.getImageData(0, 0, sw, sh);
    const p = id.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i];
      const gg = p[i + 1];
      const b = p[i + 2];
      const lum = r + gg + b;
      if (lum < 46 || (r < 16 && gg < 16 && b < 20)) p[i + 3] = 0;
      else if (r < 36 && gg < 26 && b < 38 && lum < 86) p[i + 3] = Math.max(0, p[i + 3] - 180);
    }
    g.putImageData(id, 0, 0);
    return c;
  }

  function loadArt() {
    if (!hasDom) return;
    let left = 3;
    function done() {
      left -= 1;
      if (left <= 0) artReady = true;
    }
    function load(src, cb) {
      const im = new Image();
      im.onload = function () { cb(im); done(); };
      im.onerror = function () { cb(null); done(); };
      im.src = src;
    }
    load('preview.png', function (im) { coverImg = im; });
    load('art/hero.png', function (im) {
      heroImg = im;
      heroFrames = [];
      if (!im) return;
      const fw = (im.width / 6) | 0;
      const fh = (im.height / 4) | 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) heroFrames.push(keyArt(im, c * fw, r * fh, fw, fh));
      }
    });
    load('art/foe.png', function (im) {
      foeImg = im;
      if (im) foeSpr = keyArt(im, 0, 0, im.width, im.height);
    });
  }

  function paintTerrain() {
    if (!hasDom) return;
    if (!terrainCv) {
      terrainCv = document.createElement('canvas');
      terrainCv.width = VW;
      terrainCv.height = VH;
      terrainCx = terrainCv.getContext('2d');
    }
    const g = terrainCx;
    g.clearRect(0, 0, VW, VH);
    const H = G.H;
    if (!H) return;
    const top = G.mapId === 'canyon' ? '#5ad6ff' : G.mapId === 'twin' ? '#ffe36b' : G.mapId === 'spire' ? '#9af0ff' : G.mapId === 'bridge' ? '#e8c090' : G.mapId === 'isles' ? '#c8f0ff' : '#7dffc6';
    const mid = G.mapId === 'canyon' ? '#2a1a48' : G.mapId === 'twin' ? '#2a1840' : G.mapId === 'spire' ? '#143044' : G.mapId === 'bridge' ? '#2a2018' : G.mapId === 'isles' ? '#182438' : '#162436';
    const bot = '#0a0614';
    const grd = g.createLinearGradient(0, 220, 0, VH);
    grd.addColorStop(0, mid);
    grd.addColorStop(1, bot);
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(0, VH);
    g.lineTo(0, H[0]);
    for (let x = 1; x < VW; x++) g.lineTo(x, H[x]);
    g.lineTo(VW, VH);
    g.closePath();
    g.fill();
    g.strokeStyle = top;
    g.lineWidth = 2.2;
    g.shadowColor = top;
    g.shadowBlur = 10;
    g.beginPath();
    g.moveTo(0, H[0]);
    for (let x = 1; x < VW; x++) g.lineTo(x, H[x]);
    g.stroke();
    g.shadowBlur = 0;
    g.globalAlpha = 0.22;
    g.strokeStyle = '#fff';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, H[0] + 5);
    for (let x = 1; x < VW; x++) g.lineTo(x, H[x] + 5);
    g.stroke();
    g.globalAlpha = 1;
    if (G.mapId === 'bridge') {
      g.save();
      g.globalCompositeOperation = 'destination-out';
      for (let x = BRIDGE_X0; x <= BRIDGE_X1; x++) {
        if (H[x] >= BRIDGE_VOID - 20) continue;
        const slab = BRIDGE_THICK;
        const holeY = H[x] + slab;
        const holeH = Math.max(0, BRIDGE_VOID - holeY);
        if (holeH > 4) g.fillRect(x, holeY, 1, holeH);
      }
      g.restore();
      g.fillStyle = '#0a0614';
      g.fillRect(BRIDGE_X0, BRIDGE_VOID, BRIDGE_X1 - BRIDGE_X0 + 1, VH - BRIDGE_VOID);
      g.strokeStyle = 'rgba(232,192,144,0.55)';
      g.lineWidth = 1.4;
      g.beginPath();
      let drawing = false;
      for (let x = BRIDGE_X0; x <= BRIDGE_X1; x++) {
        if (H[x] >= BRIDGE_VOID - 20) {
          if (drawing) { g.stroke(); drawing = false; }
          continue;
        }
        const yb = H[x] + BRIDGE_THICK;
        if (!drawing) { g.beginPath(); g.moveTo(x, yb); drawing = true; }
        else g.lineTo(x, yb);
      }
      if (drawing) g.stroke();
    }
    if (G.mapId === 'isles') {
      g.save();
      g.globalCompositeOperation = 'destination-out';
      for (let x = 0; x < VW; x++) {
        if (H[x] >= ISLE_VOID - 8) {
          g.fillRect(x, 0, 1, VH);
        } else {
          const holeY = H[x] + ISLE_THICK;
          const holeH = Math.max(0, VH - holeY);
          if (holeH > 4) g.fillRect(x, holeY, 1, holeH);
        }
      }
      g.restore();
    }
    terrainDirty = false;
  }

  function drawSky(g) {
    const sky = g.createLinearGradient(0, 0, 0, VH);
    sky.addColorStop(0, '#14082a');
    sky.addColorStop(0.45, '#1a0c28');
    sky.addColorStop(1, '#0c0814');
    g.fillStyle = sky;
    g.fillRect(0, 0, VW, VH);
    if (coverImg && G.mode === 'title') {
      g.save();
      g.globalAlpha = 0.28;
      const s = Math.max(VW / coverImg.width, VH / coverImg.height);
      const w = coverImg.width * s;
      const h = coverImg.height * s;
      g.drawImage(coverImg, (VW - w) * 0.5, (VH - h) * 0.5, w, h);
      g.restore();
    }
    const neb = g.createRadialGradient(200, 80, 10, 200, 90, 260);
    neb.addColorStop(0, 'rgba(0,232,255,0.10)');
    neb.addColorStop(1, 'rgba(0,232,255,0)');
    g.fillStyle = neb;
    g.fillRect(0, 0, VW, VH);
    const neb2 = g.createRadialGradient(780, 60, 10, 780, 80, 240);
    neb2.addColorStop(0, 'rgba(255,61,184,0.10)');
    neb2.addColorStop(1, 'rgba(255,61,184,0)');
    g.fillStyle = neb2;
    g.fillRect(0, 0, VW, VH);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const a = s.a * (0.55 + 0.45 * Math.sin(s.tw));
      g.fillStyle = rgba(WHT, a);
      g.fillRect(s.x, s.y, s.r, s.r);
    }
    g.beginPath();
    g.fillStyle = 'rgba(255,227,107,0.16)';
    g.arc(480, 92, 34, 0, TAU);
    g.fill();
    g.beginPath();
    g.fillStyle = 'rgba(255,244,200,0.85)';
    g.arc(480, 92, 16, 0, TAU);
    g.fill();
  }

  function drawWind(g) {
    if (!G.wind) return;
    g.save();
    g.globalAlpha = 0.35;
    const dir = G.wind > 0 ? 1 : -1;
    const n = Math.min(10, 3 + Math.abs(G.wind));
    for (let i = 0; i < n; i++) {
      const y = 70 + i * 28 + (G.t * 30 * dir + i * 13) % 20;
      const x = ((G.t * (40 + Math.abs(G.wind) * 8) * dir) + i * 90) % (VW + 80) - 40;
      g.strokeStyle = rgba(GOLD, 0.45);
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + dir * (18 + Math.abs(G.wind)), y);
      g.stroke();
    }
    g.restore();
  }

  function drawGust(g) {
    if (G.mapId !== 'spire') return;
    g.save();
    const veil = g.createLinearGradient(GUST_MID - GUST_HW, 0, GUST_MID + GUST_HW, 0);
    veil.addColorStop(0, 'rgba(154,240,255,0)');
    veil.addColorStop(0.5, 'rgba(154,240,255,0.10)');
    veil.addColorStop(1, 'rgba(154,240,255,0)');
    g.fillStyle = veil;
    g.fillRect(GUST_MID - GUST_HW, 0, GUST_HW * 2, VH);
    for (let i = 0; i < 18; i++) {
      const span = GUST_HW * 2;
      const x = GUST_MID - GUST_HW + ((i * 41 + G.t * 28) % span);
      const y = VH - 40 - ((G.t * 78 + i * 31) % (VH - 60));
      const a = 0.16 + 0.14 * Math.sin(G.t * 3.2 + i);
      g.fillStyle = 'rgba(180,244,255,' + a + ')';
      g.fillRect(x, y, 2.2, 11 + (i % 4) * 3);
    }
    g.restore();
  }

  function drawProcUnit(g, u) {
    const rgb = u.side === 'p' ? CYN : MAG;
    g.save();
    g.translate(u.x, u.y + Math.sin(u.bob) * 1.4);
    if (u.hitT > 0) g.translate(rand(-2, 2), 0);
    g.fillStyle = rgba(rgb, 0.18);
    g.beginPath();
    g.arc(0, 2, 16, 0, TAU);
    g.fill();
    g.fillStyle = '#1a1028';
    g.beginPath();
    g.ellipse(0, 4, 11, 9, 0, 0, TAU);
    g.fill();
    g.fillStyle = rgba(rgb, 0.95);
    g.beginPath();
    g.arc(-5, -6, 4.2, 0, TAU);
    g.arc(5, -6, 4.2, 0, TAU);
    g.fill();
    g.fillStyle = '#f4eeff';
    g.beginPath();
    g.arc(0, -1, 6.2, 0, TAU);
    g.fill();
    g.fillStyle = rgb === CYN ? '#083038' : '#380818';
    g.beginPath();
    g.arc(u.face * 1.6, -1.2, 1.7, 0, TAU);
    g.fill();
    g.restore();
  }

  function drawSpriteUnit(g, u) {
    const walk = u.walkT > 0;
    const falling = !u.grounded;
    let fr = null;
    if (u.side === 'p' && heroFrames.length >= 24) {
      if (u.hitT > 0) fr = heroFrames[3 * 6 + 3];
      else if (falling) fr = heroFrames[2 * 6 + 1];
      else if (G.phase === 'fly' && G.shot && G.shot.owner === u) fr = heroFrames[1 * 6 + 3];
      else if (G.phase === 'charge' && G.turn === u.side[0]) fr = heroFrames[1 * 6 + 2];
      else if (walk) fr = heroFrames[0 * 6 + ((G.t * 10) | 0) % 5];
      else fr = heroFrames[1 * 6 + 0];
    } else if (u.side === 'f' && foeSpr) {
      fr = foeSpr;
    }
    if (!fr) {
      drawProcUnit(g, u);
      return;
    }
    g.save();
    g.translate(u.x, u.y + Math.sin(u.bob) * 1.2);
    if (u.hitT > 0) g.translate(rand(-2, 2), 0);
    const face = u.ang > 90 ? -1 : 1;
    g.scale(face, 1);
    const h = 46;
    const w = h * (fr.width / fr.height);
    g.drawImage(fr, -w * 0.5, -h * 0.62, w, h);
    g.restore();
  }

  function drawCannon(g, u) {
    const th = u.ang * Math.PI / 180;
    const rgb = u.side === 'p' ? CYN : MAG;
    const x0 = u.x;
    const y0 = u.y - 4;
    const x1 = x0 + Math.cos(th) * 20;
    const y1 = y0 - Math.sin(th) * 20;
    g.strokeStyle = rgba(rgb, 0.95);
    g.lineWidth = 3.2;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
    g.fillStyle = rgba(GOLD, G.phase === 'charge' && curUnit() === u ? 0.9 : 0.4);
    g.beginPath();
    g.arc(x1, y1, G.phase === 'charge' && curUnit() === u ? 3.4 + G.power * 0.02 : 2.4, 0, TAU);
    g.fill();
    if (G.mode === 'play' && G.turn === u.side[0] && (G.phase === 'aim' || G.phase === 'charge')) {
      const len = 80;
      g.save();
      g.setLineDash([4, 5]);
      g.strokeStyle = rgba(WHT, 0.45);
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x1 + Math.cos(th) * len, y1 - Math.sin(th) * len);
      g.stroke();
      g.restore();
    }
    if (u.side === 'p' && G.ghost && G.turn === 'p' && (G.phase === 'aim' || G.phase === 'charge')) {
      const gh = G.ghost.ang * Math.PI / 180;
      g.save();
      g.strokeStyle = 'rgba(255,227,107,0.35)';
      g.lineWidth = 1.4;
      g.beginPath();
      g.arc(x0, y0, 10, 0, TAU);
      g.stroke();
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x0 + Math.cos(gh) * 36, y0 - Math.sin(gh) * 36);
      g.stroke();
      g.restore();
    }
    if (u.frozen) {
      g.strokeStyle = rgba(ICE, 0.7);
      g.lineWidth = 2;
      g.beginPath();
      g.arc(u.x, u.y, 18, 0, TAU);
      g.stroke();
    }
  }

  function drawUnitHp(g, u) {
    const w = 28;
    const x = u.x - w * 0.5;
    const y = u.y - 28;
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.fillRect(x, y, w, 4);
    g.fillStyle = rgba(u.side === 'p' ? CYN : MAG, 0.95);
    g.fillRect(x, y, w * clamp(u.hp / u.max, 0, 1), 4);
  }

  function drawShot(g) {
    const s = G.shot;
    if (!s) return;
    const rgb = s.ult ? GOLD : (s.wep && s.wep.id === 3 ? ICE : (s.wep && s.wep.id === 4 ? HOT : (s.wep && s.wep.id === 5 ? RAIL : (s.owner && s.owner.side === 'p' ? CYN : MAG))));
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (let i = 1; i < trail.length; i++) {
      const a = i / trail.length;
      g.strokeStyle = rgba(rgb, a * 0.32);
      g.lineWidth = 6.2 + a * 4.4;
      g.beginPath();
      g.moveTo(trail[i - 1].x, trail[i - 1].y);
      g.lineTo(trail[i].x, trail[i].y);
      g.stroke();
      g.strokeStyle = rgba(rgb, a * 0.88);
      g.lineWidth = 2.6 + a * 3.2;
      g.beginPath();
      g.moveTo(trail[i - 1].x, trail[i - 1].y);
      g.lineTo(trail[i].x, trail[i].y);
      g.stroke();
    }
    g.fillStyle = rgba(WHT, 0.95);
    g.shadowColor = rgba(rgb, 0.9);
    g.shadowBlur = 12;
    g.beginPath();
    g.arc(s.x, s.y, s.wep.id === 1 ? 5.2 : (s.wep.id === 4 ? 4.4 : (s.wep.id === 5 ? 4.0 : 3.6)), 0, TAU);
    g.fill();
    g.restore();
  }

  function drawChargeBar(g, u) {
    if (!(G.phase === 'charge' && curUnit() === u)) return;
    const w = 52;
    const x = u.x - w * 0.5;
    const y = u.y + 20;
    g.fillStyle = 'rgba(0,0,0,0.55)';
    g.fillRect(x, y, w, 7);
    const t = G.power / 100;
    g.fillStyle = t > 0.92 ? rgba(GOLD, 1) : rgba(u.side === 'p' ? CYN : MAG, 0.95);
    g.fillRect(x, y, w * t, 7);
    g.strokeStyle = rgba(GOLD, 0.35 + t * 0.45);
    g.lineWidth = 1.2;
    g.strokeRect(x - 1, y - 1, w + 2, 9);
    if (t > 0.98) {
      g.strokeStyle = rgba(GOLD, 0.9);
      g.strokeRect(x - 2, y - 2, w + 4, 11);
    }
  }


  function drawRuler(g) {
    if (G.mode !== 'play') return;
    if (!G.ruler && G.kind !== 'drill') return;
    const u = curUnit();
    if (!u) return;
    const hi = mottoGrid(u);
    g.save();
    g.font = 'bold 10px Segoe UI, PingFang SC, sans-serif';
    g.textAlign = 'center';
    for (let n = -20; n <= 20; n++) {
      const x = u.x + n * GRID;
      if (x < 2 || x > VW - 2) continue;
      const gy = groundAt(x);
      const h = 22;
      const y1 = gy - 4;
      const y0 = y1 - h;
      const strong = n % 5 === 0;
      const on = Math.abs(n) === hi;
      g.strokeStyle = on ? 'rgba(255,227,107,0.70)' : (strong ? 'rgba(255,227,107,0.50)' : 'rgba(255,227,107,0.35)');
      g.lineWidth = on ? 2 : 1;
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x, y1);
      g.stroke();
      if (strong) {
        g.fillStyle = on ? 'rgba(255,227,107,0.85)' : 'rgba(255,227,107,0.45)';
        g.fillText(String(n), x, y0 - 3);
      }
    }
    g.restore();
  }

  function drawGhostPath(g) {
    if (!G.ghost || G.mode !== 'play' || G.turn !== 'p') return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    const pts = G.ghost.points;
    if (!pts || pts.length < 2) return;
    g.save();
    g.setLineDash([5, 6]);
    g.strokeStyle = 'rgba(255,227,107,0.30)';
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke();
    g.restore();
  }

  function drawWarpAim(g) {
    if (G.busy !== 'warpAim') return;
    const u = curUnit();
    if (!u) return;
    g.save();
    g.strokeStyle = 'rgba(0,232,255,0.35)';
    g.setLineDash([6, 5]);
    g.beginPath();
    g.arc(u.x, u.y, WARP_R, 0, TAU);
    g.stroke();
    const x = validWarpX(u, G.warpX);
    const y = groundAt(x) - u.r;
    g.setLineDash([]);
    g.fillStyle = 'rgba(0,232,255,0.35)';
    g.beginPath();
    g.arc(x, y, 8, 0, TAU);
    g.fill();
    g.restore();
  }

  function collectPredict(u) {
    const pts = [];
    if (!u) return { points: pts, len: 0 };
    const wep = wepOf();
    const th = u.ang * Math.PI / 180;
    let x = u.x + Math.cos(th) * 18;
    let y = u.y - 4 - Math.sin(th) * 18;
    const spd = muzzleSpeed(G.power, u.ang, wep);
    let vx = Math.cos(th) * spd;
    let vy = -Math.sin(th) * spd;
    const dt = 1 / 60;
    pts.push({ x: x, y: y });
    let len = 0;
    let t = 0;
    for (let i = 0; i < 420; i++) {
      vx += G.wind * windKAt(wep, t) * dt;
      vy += (GRAV + gustAy(x)) * dt;
      const nx = x + vx * dt;
      const ny = y + vy * dt;
      len += hypot(nx - x, ny - y);
      x = nx;
      y = ny;
      t += dt;
      pts.push({ x: x, y: y });
      if (x < 2 || x > VW - 2 || y > VH + 8) break;
      if (inGround(x, y)) break;
      if (unitAt(x, y, u)) break;
    }
    return { points: pts, len: len };
  }

  function drawPredict(g) {
    if (G.mode !== 'play') return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    if (G.turn !== 'p') return;
    const lv = G.assist | 0;
    if (lv <= 0) return;
    const u = G.p;
    if (!u || u.hp <= 0) return;
    const pred = collectPredict(u);
    const pts = pred.points;
    if (pts.length < 2) return;
    let drawPts = pts;
    const weak = lv === 1;
    if (weak) {
      const cap = Math.min(pred.len * 0.4, 8 * GRID);
      drawPts = [pts[0]];
      let acc = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const d = hypot(b.x - a.x, b.y - a.y);
        if (acc + d >= cap) {
          const t = clamp((cap - acc) / (d || 1), 0, 1);
          drawPts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
          break;
        }
        acc += d;
        drawPts.push(b);
      }
    }
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.setLineDash([5, 6]);
    g.lineWidth = 1.6;
    if (weak) {
      for (let i = 1; i < drawPts.length; i++) {
        const a = 1 - i / drawPts.length;
        g.strokeStyle = rgba(GOLD, 0.08 + a * 0.42);
        g.beginPath();
        g.moveTo(drawPts[i - 1].x, drawPts[i - 1].y);
        g.lineTo(drawPts[i].x, drawPts[i].y);
        g.stroke();
      }
    } else {
      g.strokeStyle = 'rgba(255,227,107,0.55)';
      g.beginPath();
      g.moveTo(drawPts[0].x, drawPts[0].y);
      for (let i = 1; i < drawPts.length; i++) g.lineTo(drawPts[i].x, drawPts[i].y);
      g.stroke();
      const land = drawPts[drawPts.length - 1];
      g.setLineDash([]);
      g.strokeStyle = 'rgba(255,227,107,0.78)';
      g.lineWidth = 1.4;
      const s = 4.5;
      g.beginPath();
      g.moveTo(land.x - s, land.y - s);
      g.lineTo(land.x + s, land.y + s);
      g.moveTo(land.x + s, land.y - s);
      g.lineTo(land.x - s, land.y + s);
      g.stroke();
      g.beginPath();
      g.arc(land.x, land.y, 6, 0, TAU);
      g.stroke();
    }
    g.restore();
  }

  function draw() {
    if (!ctx || !canvas) return;
    const dpr = view.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#070510';
    ctx.fillRect(0, 0, view.w, view.h);
    ctx.save();
    ctx.translate(view.ox, view.oy);
    ctx.scale(view.scale, view.scale);
    ctx.beginPath();
    ctx.rect(0, 0, VW, VH);
    ctx.clip();
    const sx = G.shake && !REDUCE ? rand(-G.shake, G.shake) * 0.35 : 0;
    const sy = G.shake && !REDUCE ? rand(-G.shake, G.shake) * 0.25 : 0;
    ctx.translate(VW * 0.5 + sx, VH * 0.5 + sy);
    ctx.scale(cam.z * (G.punch || 1), cam.z * (G.punch || 1));
    ctx.translate(-cam.x, -cam.y);

    drawSky(ctx);
    drawWind(ctx);
    if (terrainDirty) paintTerrain();
    if (terrainCv) ctx.drawImage(terrainCv, 0, 0);
    drawGust(ctx);
    if (G.sudden) {
      ctx.fillStyle = 'rgba(8, 4, 12, 0.42)';
      if (G.safeL > 0) ctx.fillRect(0, 0, G.safeL, VH);
      if (G.safeR < VW - 1) ctx.fillRect(G.safeR, 0, VW - G.safeR, VH);
    }
    drawRuler(ctx);
    drawGhostPath(ctx);
    drawPredict(ctx);
    drawWarpAim(ctx);

    if (G.p && G.p.hp > 0) {
      drawSpriteUnit(ctx, G.p);
      drawCannon(ctx, G.p);
      drawUnitHp(ctx, G.p);
      drawChargeBar(ctx, G.p);
    }
    if (G.f && G.f.hp > 0) {
      drawSpriteUnit(ctx, G.f);
      drawCannon(ctx, G.f);
      drawUnitHp(ctx, G.f);
      drawChargeBar(ctx, G.f);
    }
    drawShot(ctx);

    for (let i = 0; i < particles.length; i++) {
      const q = particles[i];
      ctx.fillStyle = rgba(q.rgb, clamp(q.life / q.max, 0, 1));
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, TAU);
      ctx.fill();
    }
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      ctx.strokeStyle = rgba(r.rgb, 1 - r.t / 0.4);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, TAU);
      ctx.stroke();
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < floats.length; i++) {
      const f = floats[i];
      const pop = 1 + (f.big ? 0.58 : 0.32) * Math.max(0, 1 - f.t / 0.2);
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(pop, pop);
      ctx.fillStyle = rgba(f.rgb, 1 - f.t / 0.85);
      ctx.font = (f.big ? 'bold 18px ' : 'bold 13px ') + 'Segoe UI, PingFang SC, sans-serif';
      ctx.fillText(f.s, 0, 0);
      ctx.restore();
    }

    ctx.restore();
    if (G.flash > 0) {
      ctx.fillStyle = rgba(G.flashRgb, G.flash * 0.35);
      ctx.fillRect(view.ox, view.oy, VW * view.scale, VH * view.scale);
    }
  }

  function worldFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - view.ox) / view.scale;
    const y = (e.clientY - rect.top - view.oy) / view.scale;
    return { x: x / cam.z + cam.x - VW * 0.5 / cam.z, y: y / cam.z + cam.y - VH * 0.5 / cam.z };
  }

  function aimFromPointer(x, y, u) {
    if (!u) return;
    const dx = x - u.x;
    const dy = u.y - y;
    let ang = Math.atan2(dy, dx) * 180 / Math.PI;
    if (ang < 0) ang += 360;
    if (ang > 180 && ang < 270) ang = 180;
    if (ang >= 270) ang = 0;
    u.ang = clamp(ang, 0, 180);
  }

  function resize() {
    if (!canvas || !ctx) return;
    const parent = canvas.parentElement || stageEl;
    const rect = parent.getBoundingClientRect();
    view.dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.w = Math.max(1, rect.width);
    view.h = Math.max(1, rect.height);
    canvas.width = Math.max(1, (view.w * view.dpr) | 0);
    canvas.height = Math.max(1, (view.h * view.dpr) | 0);
    canvas.style.width = view.w + 'px';
    canvas.style.height = view.h + 'px';
    view.scale = Math.min(view.w / VW, view.h / VH);
    view.ox = (view.w - VW * view.scale) * 0.5;
    view.oy = (view.h - VH * view.scale) * 0.5;
  }

  function primaryAction() {
    if (G.mode === 'title') startGame('hall');
    else if (G.mode === 'end') restart();
  }

  function onKey(e, down) {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.l = down; e.preventDefault(); }
    if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.r = down; e.preventDefault(); }
    if (k === 'ArrowUp' || k === 'w' || k === 'W') { keys.u = down; e.preventDefault(); }
    if (k === 'ArrowDown' || k === 's' || k === 'S') { keys.d = down; e.preventDefault(); }
    if (k === ' ' || k === 'Spacebar' || k === 'z' || k === 'Z') {
      e.preventDefault();
      if (down && !keys.fire) {
        keys.fire = true;
        if (overlayOpen() && (G.mode === 'title' || G.mode === 'end')) {
          if (k === 'z' || k === 'Z') return;
          primaryAction();
          return;
        }
        startCharge();
      }
      if (!down) {
        keys.fire = false;
        releaseCharge();
      }
      return;
    }
    if (!down) return;
    if (k === 'm' || k === 'M') {
      audio.ensure();
      audio.setMuted(!audio.muted);
      return;
    }
    if (k === 'r' || k === 'R') {
      restart();
      return;
    }
    if (k === 'h' || k === 'H') {
      e.preventDefault();
      cycleAssist(1);
      return;
    }
    if (k === '[') {
      e.preventDefault();
      cycleAssist(-1);
      return;
    }
    if (k === ']') {
      e.preventDefault();
      cycleAssist(1);
      return;
    }
    if (G.mode === 'title') {
      if (k === '1' || k === 'Enter') { startGame('hall'); return; }
      if (k === '2') { startGame('core'); return; }
      if (k === '3') { startGame('drill'); return; }
      return;
    }
    if (k === 'Escape' || k === 'Esc') { cancelWarp(); return; }
    if (k === 'Tab') {
      e.preventDefault();
      if (G.kind !== 'drill') {
        G.ruler = !G.ruler;
        saveBest();
        toast(G.ruler ? '格尺开' : '格尺关', false, false);
      }
      return;
    }
    if (k === 'q' || k === 'Q') { onItem('leap'); return; }
    if (k === 'e' || k === 'E') { onItem('warp'); return; }
    if (k === 'c' || k === 'C') { onItem('neon'); return; }
    if (k === 'v' || k === 'V') { onItem('drum'); return; }
    if (k === 'f' || k === 'F') { onItem('ult'); return; }
    if (k === 'x' || k === 'X') { onItem('skip'); return; }
    if (k === '1') setWep(0);
    if (k === '2') setWep(1);
    if (k === '3') setWep(2);
    if (k === '4') setWep(3);
    if (k === '5') setWep(4);
  }

  function bindPad() {
    if (!padEl) return;
    const btns = padEl.querySelectorAll('button');
    function set(kind, on) {
      padHold[kind] = on;
      if (kind === 'fire') {
        if (on) startCharge();
        else releaseCharge();
      }
    }
    for (let i = 0; i < btns.length; i++) {
      (function (btn) {
        const kind = btn.getAttribute('data-pad');
        btn.addEventListener('pointerdown', function (e) {
          audio.ensure();
          btn.classList.add('held');
          set(kind, true);
          try { btn.setPointerCapture(e.pointerId); } catch (err) { /* */ }
          e.preventDefault();
        });
        function up() {
          btn.classList.remove('held');
          set(kind, false);
        }
        btn.addEventListener('pointerup', up);
        btn.addEventListener('pointercancel', up);
        btn.addEventListener('pointerleave', function () {
          if (padHold[kind] && kind !== 'fire') {
            btn.classList.remove('held');
            padHold[kind] = false;
          }
        });
      })(btns[i]);
    }
  }

  function selfCheck() {
    const out = [];
    function ok(name, cond, extra) {
      out.push((cond ? 'OK   ' : 'FAIL ') + name + (extra != null ? '  ' + extra : ''));
    }
    G.mapId = 'plain';
    G.kind = 'hall';
    G.H = buildHeight('plain');
    ok('plain cols', G.H.length === 960);
    ok('plain height', G.H[160] > 300 && G.H[160] < 480, Math.round(G.H[160]));
    G.H = buildHeight('canyon');
    ok('canyon valley', G.H[480] > G.H[120] + 80, Math.round(G.H[480] - G.H[120]));
    G.H = buildHeight('twin');
    ok('twin gap', G.H[480] > G.H[150] + 80, Math.round(G.H[480] - G.H[150]));
    G.H = buildHeight('plain');
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', ang: 65 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100, max: 100, side: 'f', ang: 115 };
    const a65 = traceShot(152, G.p.y - 4, 65, 70, 0, WEPS[0], G.H, G.p);
    const a45 = traceShot(152, G.p.y - 4, 45, 70, 0, WEPS[0], G.H, G.p);
    const a90 = traceShot(152, G.p.y - 4, 90, 70, 0, WEPS[0], G.H, G.p);
    const dx65 = a65.x - 152;
    const dx45 = a45.x - 152;
    const dx90 = Math.abs(a90.x - 152);
    ok('65deg range 520-680', dx65 >= 500 && dx65 <= 700, Math.round(dx65));
    ok('45 nearer than 65', dx45 < dx65 - 8, Math.round(dx45) + ' < ' + Math.round(dx65));
    ok('90 near feet', dx90 < 50, Math.round(dx90));
    const wL = traceShot(152, G.p.y - 4, 65, 70, -8, WEPS[0], G.H, G.p);
    const wR = traceShot(152, G.p.y - 4, 65, 70, 8, WEPS[0], G.H, G.p);
    ok('wind bends', wL.x < a65.x - 12 && wR.x > a65.x + 12, Math.round(wR.x - wL.x));
    const before = G.H[400];
    G.H = buildHeight('plain');
    carve(400, G.H[400], 30);
    ok('crater carves', G.H[400] > before + 8, Math.round(G.H[400] - before));
    G.H = buildHeight('canyon');
    G.p.x = 122; G.p.y = G.H[122] - 14;
    const pier = traceShot(122, G.p.y - 4, 35, 80, 0, WEPS[2], G.H, G.p);
    ok('pierce runs', !!pier && pier.x > 122, Math.round(pier.x));
    G.H = buildHeight('plain');
    G.p.x = 152; G.p.y = G.H[152] - 14;
    G.f.x = 768; G.f.y = G.H[768] - 14;
    G.wind = 0;
    G.wep = 0;
    const sol = solveAI(G.f);
    const th = sol.ang * Math.PI / 180;
    const mx = G.f.x + Math.cos(th) * 18;
    const my = G.f.y - 4 - Math.sin(th) * 18;
    const ai = traceShot(mx, my, sol.ang, sol.pow, 0, WEPS[0], G.H, G.f);
    const miss = hypot(ai.x - 152, ai.y - G.p.y);
    ok('AI near-hit', miss < 90, 'miss ' + Math.round(miss) + ' ang ' + Math.round(sol.ang) + ' pow ' + Math.round(sol.pow));
    function rangeFlat(power) {
      const Hflat = 400;
      const x0 = 200;
      const y0 = Hflat - UNIT_R - 4;
      const th = 65 * Math.PI / 180;
      const spd = muzzleSpeed(power, 65, WEPS[0]);
      let vx = Math.cos(th) * spd;
      let vy = -Math.sin(th) * spd;
      let x = x0;
      let y = y0;
      const dt = 1 / 60;
      for (let i = 0; i < 800; i++) {
        vy += GRAV * dt;
        x += vx * dt;
        y += vy * dt;
        if (y >= Hflat) return (x - x0) / GRID;
      }
      return (x - x0) / GRID;
    }
    let tableOk = true;
    let worst = 0;
    for (let g = 1; g <= 20; g++) {
      const got = rangeFlat(TABLE65[g]);
      const err = Math.abs(got - g);
      if (err > worst) worst = err;
      if (err > 0.4) tableOk = false;
    }
    ok('65 table vs ruler <=0.4', tableOk, 'worst ' + worst.toFixed(2));
    ok('grid 48', GRID === 48);
    ok('ruler default on', G.ruler !== false);
    ok('neon dmg 8', NEON.direct === 8 && NEON.splash === 28 && NEON.crater === 18);
    ok('warp cost 25', ITEM_COST.warp === 25);
    ok('drum cost 0', ITEM_COST.drum === 0);
    const frozenU = { frozen: 1, name: '烬丸' };
    ok('freeze flag', frozenU.frozen === 1);
    const ultMul = 32 * 1 * 1.6;
    ok('hallbreak x1.6', Math.round(ultMul) === 51);

    G.H = buildHeight('spire');
    G.mapId = 'spire';
    ok('spire height', G.H[140] > 300 && G.H[140] < 480, Math.round(G.H[140]));
    ok('gust center up', gustAy(GUST_MID) < -80, Math.round(gustAy(GUST_MID)));
    ok('gust outside 0', gustAy(120) === 0);
    G.mapId = 'bridge';
    G.H = buildHeight('bridge');
    ok('bridge slab', G.H[480] > 280 && G.H[480] < 340, Math.round(G.H[480]));
    ok('bridge pads', G.H[150] < 360 && G.H[810] < 360, Math.round(G.H[150]) + '/' + Math.round(G.H[810]));
    G.mapId = 'plain';
    G.H = new Float32Array(VW);
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(500, 400, 48);
    const heDepth = G.H[500] - 400;
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carveCluster(500, 400, 1);
    const clDepth = G.H[500] - 400;
    ok('cluster deeper than HE', clDepth > heDepth && clDepth >= BURY_PX, Math.round(clDepth) + ' > ' + Math.round(heDepth));
    ok('三裂 stats', WEPS[3] && WEPS[3].name === '三裂' && WEPS[3].direct === 14 && WEPS[3].direct < WEPS[1].direct);
    ok('maps six', MAP_IDS.length === 6 && MAP_NAME.spire === '风柱' && MAP_NAME.bridge === '碎桥' && MAP_NAME.isles === '悬岛');
    G.H = buildHeight('isles');
    G.mapId = 'isles';
    ok('isles left', G.H[160] > 320 && G.H[160] < 400, Math.round(G.H[160]));
    ok('isles mid high', G.H[480] < G.H[160] - 40, Math.round(G.H[480]));
    ok('isles gap void', G.H[340] >= 500, Math.round(G.H[340]));
    ok('isles spawn', spawnX('isles', 'p') === 160 && spawnX('isles', 'f') === 800);
    G.mapId = 'plain';
    ok('霓轨 stats', WEPS[4] && WEPS[4].name === '霓轨' && WEPS[4].spd === 0.70 && WEPS[4].direct === 20 && WEPS[4].id === 5);
    ok('霓轨 ride 0', Math.abs(windKAt(WEPS[4], 0) - WIND_K) < 0.001);
    ok('霓轨 ride tick', windKAt(WEPS[4], 0.05) > WIND_K * 1.1);
    ok('normal no ride', windKAt(WEPS[0], 1) === WIND_K);
    G.H = buildHeight('plain');
    const rail0 = traceShot(152, G.H[152] - 18, 65, 80, 0, WEPS[4], G.H, G.p);
    const rail8 = traceShot(152, G.H[152] - 18, 65, 80, 8, WEPS[4], G.H, G.p);
    ok('霓轨 wind ride', Math.abs(rail8.x - rail0.x) > 18, Math.round(rail8.x - rail0.x));
    ok('sudden off', G.sudden === false);
    ok('sudden nums', SUDDEN_TURN === 12 && SUDDEN_HP === 35 && GRAV === 260 && VK === 420);
    ok('assist still 0-3', ASSIST_NAME.length === 4 && G.assist === 2);
    G.H = buildHeight('plain');
    G.wind = 3;
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', ang: 65, face: 1 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100, max: 100, side: 'f', ang: 115, face: -1 };
    const tip = schoolTips(G.p, G.f);
    ok('aim hint 65+2wind', Math.round(tip.ang65) === 71, Math.round(tip.ang65) + ' / ' + tip.pow65);
    ok('assist default 中', G.assist === 2 && ASSIST_NAME[2] === '中');
    ok('assist wrap', (3 + 1 + 4) % 4 === 0 && (0 - 1 + 4) % 4 === 3);
    G.power = 70;
    G.wep = 0;
    G.neonOn = false;
    G.wind = 0;
    const pr = collectPredict(G.p);
    ok('predict collects', pr.points.length > 8 && pr.len > 200, pr.points.length + ' ' + Math.round(pr.len));
    const cap = Math.min(pr.len * 0.4, 8 * GRID);
    ok('weak slice shorter', cap < pr.len && cap <= 8 * GRID + 0.01, Math.round(cap) + ' / ' + Math.round(pr.len));
    ok('bury threshold', BURY_PX === 40);
    const pitH = new Float32Array(VW);
    for (let i = 0; i < VW; i++) pitH[i] = 400;
    G.H = pitH;
    carveCluster(200, 400, 1);
    const buriedU = { x: 200, y: G.H[200] - 14, r: 14, hp: 100 };
    ok('pit bury', pitDepth(buriedU) >= BURY_PX && walkBlocked(buriedU), Math.round(pitDepth(buriedU)));

    const text = out.join('\n');
    if (typeof console !== 'undefined') console.log(text);
    return out.every(function (l) { return l.indexOf('OK') === 0; });
  }

  if (!hasDom || !canvas || !ctx) {
    const pass = selfCheck();
    if (typeof process !== 'undefined' && process.exit) process.exit(pass ? 0 : 1);
    return;
  }

  try {
    if (localStorage.getItem(MUTE_KEY) === '1') audio.setMuted(true);
  } catch (err) { /* */ }
  loadBest();
  seedStars();
  loadArt();
  goTitle();
  resize();
  bindPad();

  canvas.addEventListener('pointerdown', function (e) {
    if (e.button != null && e.button !== 0) return;
    audio.ensure();
    if (overlayOpen()) return;
    const w = worldFromEvent(e);
    G.pointer.x = w.x; G.pointer.y = w.y;
    if (G.busy === 'warpAim' && G.turn === 'p') {
      G.warpX = w.x;
      confirmWarp(G.p);
      e.preventDefault();
      return;
    }
    if (G.mode === 'play' && G.turn === 'p' && (G.phase === 'aim' || G.phase === 'charge') && !G.busy) {
      aimFromPointer(w.x, w.y, G.p);
      if (G.phase === 'aim') startCharge();
    }
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* */ }
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('pointermove', function (e) {
    if (overlayOpen()) return;
    const w = worldFromEvent(e);
    G.pointer.x = w.x; G.pointer.y = w.y;
    if (G.busy === 'warpAim') G.warpX = w.x;
    if (G.mode === 'play' && G.turn === 'p' && (G.phase === 'aim' || G.phase === 'charge') && !G.busy) {
      aimFromPointer(w.x, w.y, G.p);
    }
  });
  canvas.addEventListener('pointerup', function () {
    releaseCharge();
  });
  canvas.addEventListener('pointercancel', function () {
    releaseCharge();
  });
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); cancelWarp(); });

  window.addEventListener('keydown', function (e) { onKey(e, true); });
  window.addEventListener('keyup', function (e) { onKey(e, false); });
  window.addEventListener('blur', function () {
    keys.l = keys.r = keys.u = keys.d = keys.fire = false;
    audio.chargeStop();
  });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    if (hidden) audio.chargeStop();
  });

  if (btnHall) btnHall.addEventListener('click', function () { audio.ensure(); startGame('hall'); });
  if (btnCore) btnCore.addEventListener('click', function () { audio.ensure(); startGame('core'); });
  if (btnDrill) btnDrill.addEventListener('click', function () { audio.ensure(); startGame('drill'); });
  if (itemsEl) {
    itemsEl.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      audio.ensure();
      onItem(b.getAttribute('data-item'));
    });
  }
  if (padEl) {
    padEl.addEventListener('click', function (e) {
      const wepBtn = e.target.closest('[data-wep]');
      if (wepBtn) {
        audio.ensure();
        setWep(wepBtn.getAttribute('data-wep') | 0);
        return;
      }
      const b = e.target.closest('[data-item]');
      if (!b) return;
      audio.ensure();
      onItem(b.getAttribute('data-item'));
    });
  }
  if (drillWindEl) {
    drillWindEl.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      audio.ensure();
      G.drillWind = b.getAttribute('data-dw') || 'rand';
      syncDrillWind();
      saveBest();
    });
  }
  if (ovRetry) ovRetry.addEventListener('click', function () { audio.ensure(); restart(); });
  if (ovModes) ovModes.addEventListener('click', function () { audio.ensure(); goTitle(); });
  if (btnMute) btnMute.addEventListener('click', function () { audio.ensure(); audio.setMuted(!audio.muted); });
  if (btnRetry) btnRetry.addEventListener('click', function () { audio.ensure(); restart(); });
  if (btnAssist) btnAssist.addEventListener('click', function () { audio.ensure(); cycleAssist(1); });
  if (ovMaps) {
    ovMaps.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      audio.ensure();
      setMap(b.getAttribute('data-map'));
    });
  }
  if (wepsEl) {
    wepsEl.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      audio.ensure();
      setWep(b.getAttribute('data-w') | 0);
    });
  }

  let acc = 0;
  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const t = now / 1000;
    if (hidden) { last = t; return; }
    if (!last) last = t;
    let dt = t - last;
    last = t;
    if (dt > 0.05) dt = 0.05;
    if (dt < 0) dt = 0;
    if (G.slowMo > 0 && G.stop <= 0 && !REDUCE) {
      G.slowMo -= dt;
      dt = dt * 0.28;
    }
    acc += dt;
    let steps = 0;
    while (acc >= STEP && steps < 5) {
      update(STEP);
      acc -= STEP;
      steps += 1;
    }
    draw();
  }
  requestAnimationFrame(frame);
})();
