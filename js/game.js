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
  const OPS = '← → 走 · ↑ ↓ 角 · 空格/Z 蓄力 · 1 弹堂 · 2 堂核 · 3 演习场 · 4 对坐 · 5 对堂 · 6 堂座 · R 重开 · M 静音 · H 辅助 · N 地条';
  const OPS_PLAY = 'Q飞步 E影挪 C霓弹 V鼓息 B逆息 G障幕 F殿破 X过 · 4三裂 5霓轨 6霓火 · 65°查表 · Tab尺 · N地条 · H辅';
  const OPS_DRILL = '演习 · 表随距离变 · 空格仍能打木桩 · N地条 · H辅';
  const MINI_W = 160;
  const MINI_H = 48;
  const ASSIST_NAME = ['关', '弱', '中', '强'];
  const TABLE65 = [0, 20, 28, 34, 39, 44, 48, 52, 55, 59, 62, 65, 68, 71, 73, 76, 78, 81, 83, 85, 88];
  const ITEM_MAX = { leap: 2, warp: 1, neon: 2, drum: 1, nixi: 1, veil: 1 };
  const ITEM_COST = { leap: 35, warp: 25, neon: 0, drum: 0, nixi: 15, veil: 20 };
  const ITEM_KEYS = ['leap', 'warp', 'neon', 'drum'];
  const ITEM_NAME = { leap: '飞步', warp: '影挪', neon: '霓弹', drum: '鼓息', nixi: '逆息', veil: '障幕' };
  const NIXI_WIND = 5;
  const NIXI_MISS = 4000;
  const VEIL_R = 70;
  const VEIL_HP = 40;
  const VEIL_GRIDS = 8;
  const VEIL_ERR = 0.12;
  const FRUIT_R = 12;
  const FRUIT_GOLD_P = 0.15;
  const FRUIT_RAGE = 25;
  const FRUIT_WALL = 36;
  const MAP_NAME = { plain: '平原', canyon: '峡谷', twin: '双台', spire: '风柱', bridge: '碎桥', isles: '悬岛', ruins: '残垣', vale: '风谷', forge: '熔台', arcade: '廊桥', towers: '双塔' };
  const MAP_IDS = ['plain', 'canyon', 'twin', 'spire', 'bridge', 'isles', 'ruins', 'vale', 'forge', 'arcade', 'towers'];
  const WALL_MAXH = 160;
  const FIRE_R = 28;
  const FIRE_DMG = 8;
  const FIRE_LIFE = 2;
  const GUST_MID = 480;
  const GUST_HW = 80;
  const GUST_AY = -150;
  const VALE_MID = 480;
  const VALE_HW = 96;
  const VALE_AY = -240;
  const FORGE_VOID = 532;
  const FORGE_THICK = 16;
  const FORGE_PAD_THICK = 50;
  const FORGE_PAD_Y = 268;
  const FORGE_CRUST_Y = 294;
  const FORGE_L0 = 36;
  const FORGE_L1 = 252;
  const FORGE_C0 = 292;
  const FORGE_C1 = 668;
  const FORGE_R0 = 708;
  const FORGE_R1 = 924;
  const BRIDGE_X0 = 360;
  const BRIDGE_X1 = 600;
  const BRIDGE_Y = 310;
  const BRIDGE_THICK = 22;
  const BRIDGE_VOID = 528;
  const ARCADE_VOID = 532;
  const ARCADE_THICK = 28;
  const ARCADE_PAD_THICK = 52;
  const ARCADE_PAD_Y = 310;
  const ARCADE_RISE = 130;
  const ARCADE_L0 = 28;
  const ARCADE_A0 = 248;
  const ARCADE_A1 = 712;
  const ARCADE_R1 = 932;
  const ARCADE_MID = 480;
  const ARCADE_HALF = (ARCADE_A1 - ARCADE_A0) * 0.5;
  const ARCADE_RAD = (ARCADE_HALF * ARCADE_HALF + ARCADE_RISE * ARCADE_RISE) / (2 * ARCADE_RISE);
  const ARCADE_CY = ARCADE_PAD_Y - ARCADE_RISE + ARCADE_RAD;
  const TOWERS_GAP = 180;
  const TOWERS_TOP_Y = 210;
  const TOWERS_LEDGE_Y = 312;
  const TOWERS_YARD_Y = 434;
  const TOWERS_L0 = 52;
  const TOWERS_L_DECK = 318;
  const TOWERS_L_INNER = 390;
  const TOWERS_R_INNER = 570;
  const TOWERS_R_DECK = 642;
  const TOWERS_R1 = 908;
  const TOWERS_LW0 = 304;
  const TOWERS_LW1 = 340;
  const TOWERS_RW0 = 620;
  const TOWERS_RW1 = 656;
  const TOWERS_PX = 186;
  const TOWERS_FX = 774;
  const TOWERS_P2X = 366;
  const TOWERS_F2X = 594;
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
  const FIRE = [255, 120, 48];
  const STONE = [196, 156, 112];

  const WEPS = [
    { id: 0, name: '普通弹', direct: 32, splash: 36, crater: 30, spd: 1.00 },
    { id: 1, name: '高爆', direct: 24, splash: 56, crater: 48, spd: 0.88 },
    { id: 2, name: '穿透', direct: 30, splash: 32, crater: 26, spd: 1.06 },
    { id: 4, name: '三裂', direct: 14, splash: 22, crater: 16, spd: 0.96 },
    { id: 5, name: '霓轨', direct: 20, splash: 40, crater: 22, spd: 0.70 },
    { id: 6, name: '霓火', direct: 18, splash: 44, crater: 20, spd: 1.00 }
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
  const windArr = el('wind-arr');
  const windNum = el('wind-num');
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
  const btnSeat = el('btn-seat');
  const btnDuo = el('btn-duo');
  const btnQuad = el('btn-quad');
  const turnLabel = el('turn-label');
  const delayRow = el('delay-row');
  const hpRow = el('hp-row');
  const hpP2 = el('hp-p2');
  const hpF2 = el('hp-f2');
  const hpP2N = el('hp-p2-n');
  const hpF2N = el('hp-f2-n');
  const stP2 = el('st-p2');
  const stF2 = el('st-f2');
  const rgP2 = el('rg-p2');
  const rgF2 = el('rg-f2');
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
  const timeLabel = el('time-label');
  const nextWindEl = el('next-wind');
  const nextWindArr = el('next-wind-arr');
  const nextWindNum = el('next-wind-num');
  const miniCv = el('mini');
  const miniCx = miniCv ? miniCv.getContext('2d') : null;

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
    p2: null,
    f2: null,
    actDelay: { skip: false, wepId: 0, ult: false },
    shot: null,
    charging: false,
    stam: STAM_MAX,
    neonOn: false,
    busy: null,
    busyT: 0,
    ruler: true,
    mini: true,
    assist: 2,
    drillWind: 'rand',
    nextWind: null,
    teaseWind: false,
    ghost: null,
    ghostPend: null,
    pointer: { x: 480, y: 200 },
    warpX: 0,
    ctrlSide: null,
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
    slowMo: 0,
    fires: [],
    walls: [],
    fruits: [],
    veils: [],
    lastHit: null,
    windSpinT: 0
  };

  const particles = [];
  const floats = [];
  const rings = [];
  const stars = [];
  const trail = [];
  const crumbs = [];

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
  function isDuo() { return G.kind === 'duo'; }
  function isQuad() { return G.kind === 'quad'; }
  function isSquad() { return G.kind === 'duo' || G.kind === 'quad'; }
  function passToastFor(side) { return side === 'f' ? '把键盘给烬丸' : '把键盘给岚丸'; }
  function allUnits() {
    const a = [G.p, G.p2, G.f, G.f2];
    const out = [];
    for (let i = 0; i < 4; i++) if (a[i]) out.push(a[i]);
    return out;
  }
  function eachUnit(fn) {
    const a = allUnits();
    for (let i = 0; i < a.length; i++) fn(a[i]);
  }
  function unitById(id) {
    if (id && typeof id === 'object') return id;
    if (id === 'p2') return G.p2;
    if (id === 'f2') return G.f2;
    if (id === 'f') return G.f;
    return G.p;
  }
  function curUnit() { return unitById(G.turn); }
  function foesOf(u) {
    const out = [];
    const a = allUnits();
    for (let i = 0; i < a.length; i++) {
      const o = a[i];
      if (o && u && o.hp > 0 && o.side !== u.side) out.push(o);
    }
    return out;
  }
  function otherUnit(u) {
    const foes = foesOf(u);
    if (!foes.length) return u === G.p ? G.f : G.p;
    let best = foes[0];
    for (let i = 1; i < foes.length; i++) {
      const o = foes[i];
      if (o.hp < best.hp - 0.5) best = o;
      else if (Math.abs(o.hp - best.hp) < 0.5 && u && Math.abs(o.x - u.x) < Math.abs(best.x - u.x)) best = o;
    }
    return best;
  }
  function teamDown(side) {
    const a = allUnits();
    let saw = false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].side !== side) continue;
      saw = true;
      if (a[i].hp > 0) return false;
    }
    return true;
  }
  function unitRgb(u) {
    if (!u) return CYN;
    if (u.id === 'p2') return ICE;
    if (u.id === 'f2') return HOT;
    return u.side === 'p' ? CYN : MAG;
  }
  function unitShort(u) {
    if (!u) return '';
    if (u.id === 'p2' || u.name === '霜丸') return '霜';
    if (u.id === 'f2' || u.name === '霆丸') return '霆';
    if (u.stake) return '俑';
    if (u.side === 'p') return '岚';
    return '烬';
  }
  function delayCost(wepId, ult, skip) {
    if (skip) return 80;
    let d = 100;
    if (wepId === 1) d += 30;
    else if (wepId === 2) d += 10;
    else if (wepId === 3) d = 90;
    else if (wepId === 4) d += 20;
    else if (wepId === 5) d += 40;
    else if (wepId === 6) d += 25;
    if (ult) d += 20;
    return d;
  }
  function pendingDelayAmount() {
    const a = G.actDelay || {};
    return delayCost(a.wepId || 0, !!a.ult, !!a.skip);
  }
  function applyActDelay(u) {
    if (!isSquad() || !u) return;
    u.delay = (u.delay || 0) + pendingDelayAmount();
  }
  function liveActors() {
    const out = [];
    const a = allUnits();
    for (let i = 0; i < a.length; i++) if (a[i].hp > 0) out.push(a[i]);
    return out;
  }
  function sortByDelay(list, extraU, extraN) {
    const arr = list.slice();
    arr.sort(function (a, b) {
      const da = (a.delay || 0) + (a === extraU ? extraN : 0);
      const db = (b.delay || 0) + (b === extraU ? extraN : 0);
      return da - db || (a.ord || 0) - (b.ord || 0);
    });
    return arr;
  }
  function pickNextId() {
    const live = liveActors();
    if (!live.length) return 'p';
    return sortByDelay(live)[0].id || 'p';
  }
  function peekNext() {
    if (!isSquad()) return G.turn === 'p' ? G.f : G.p;
    const live = liveActors();
    if (!live.length) return curUnit();
    return sortByDelay(live, curUnit(), pendingDelayAmount())[0];
  }
  function wepOf() { return G.neonOn ? NEON : (WEPS[G.wep] || WEPS[0]); }
  function isSeat() { return G.kind === 'seat'; }
  function isHuman(u) {
    if (!u || u.stake) return false;
    if (G.kind === 'seat' || G.kind === 'quad') return true;
    return u.side === 'p';
  }
  function humanTurn() { return isHuman(curUnit()); }
  function actorGhost() {
    const u = curUnit();
    if (!u || !u.ghost) return null;
    if (!isHuman(u)) return null;
    return u.ghost;
  }
  function kindName() {
    return G.kind === 'core' ? '堂核' : G.kind === 'drill' ? '演习场' : G.kind === 'seat' ? '对坐' : G.kind === 'duo' ? '对堂' : G.kind === 'quad' ? '堂座' : '弹堂';
  }
  function addRage(u, n) {
    if (!u || u.stake) return;
    u.rage = clamp((u.rage || 0) + n, 0, 100);
    if (u.rage >= 100 && !u.ragedPrompted) {
      u.ragedPrompted = true;
      toast('怒满 · F 殿破', false, true);
    }
  }
  function freshItems() {
    return { leap: ITEM_MAX.leap, warp: ITEM_MAX.warp, neon: ITEM_MAX.neon, drum: ITEM_MAX.drum, nixi: ITEM_MAX.nixi, veil: ITEM_MAX.veil };
  }
  function resetItems(u) {
    if (!u) return;
    u.items = freshItems();
  }
  function noteLastHit(shooter, victim) {
    if (!shooter || !victim || shooter === victim) return;
    if (victim.side && shooter.side && victim.side === shooter.side) return;
    G.lastHit = shooter;
  }
  function duoFinisherName() {
    if (G.lastHit && G.lastHit.name) return G.lastHit.name;
    const u = curUnit();
    return (u && u.name) || '';
  }
  function facingOf(u) {
    if (!u) return 1;
    if (u.face === -1 || u.face === 1) return u.face;
    return u.ang > 90 ? -1 : 1;
  }

  function gustAy(x) {
    let mid;
    let hw;
    let ay;
    if (G.mapId === 'spire') {
      mid = GUST_MID;
      hw = GUST_HW;
      ay = GUST_AY;
    } else if (G.mapId === 'vale') {
      mid = VALE_MID;
      hw = VALE_HW;
      ay = VALE_AY;
    } else return 0;
    const d = Math.abs(x - mid);
    if (d >= hw) return 0;
    const k = 1 - d / hw;
    return ay * k * k;
  }

  function windKAt(wep, t) {
    if (!wep || wep.id !== 5) return WIND_K;
    const ticks = Math.min(8, Math.floor((t || 0) / 0.05));
    return WIND_K * Math.pow(1.15, ticks);
  }

  function isDeathVoid(x) {
    if (!G.H) return false;
    if ((G.mapId === 'isles' || G.mapId === 'forge' || G.mapId === 'arcade') && groundAt(x) >= VH - 14) return true;
    if (G.sudden && (x < G.safeL || x > G.safeR)) return true;
    return false;
  }

  function isForgeCrust(x) {
    if (G.mapId !== 'forge') return false;
    const i = x | 0;
    return i >= FORGE_C0 && i <= FORGE_C1;
  }

  function isBridgeCol(x) {
    return G.mapId === 'bridge' && x >= BRIDGE_X0 && x <= BRIDGE_X1;
  }

  function liveBridge(x) {
    return isBridgeCol(x) && G.H && G.H[x | 0] < BRIDGE_VOID - 20;
  }

  function isArcadeArch(x) {
    const i = x | 0;
    return G.mapId === 'arcade' && i >= ARCADE_A0 && i <= ARCADE_A1;
  }

  function liveArcade(x) {
    return isArcadeArch(x) && G.H && G.H[x | 0] < ARCADE_VOID - 20;
  }

  function arcadeDeckY(x) {
    const d = x - ARCADE_MID;
    const inner = ARCADE_RAD * ARCADE_RAD - d * d;
    if (inner <= 0) return ARCADE_PAD_Y;
    return ARCADE_CY - Math.sqrt(inner);
  }

  function setCamFighters() {
    cam.tx = VW * 0.5;
    cam.ty = VH * 0.5;
    cam.tz = 1;
    G.camHold = false;
  }

  function setCamShooter(u) {
    if (!u) { setCamFighters(); return; }
    cam.tx = clamp(u.x, 200, VW - 200);
    cam.ty = clamp(u.y * 0.28 + VH * 0.36, 130, VH - 90);
    cam.tz = 1.08;
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
    } else if (id === 'ruins') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        h[x] = 396 + Math.sin(t * Math.PI * 2.05) * 14 + Math.sin(t * Math.PI * 5.1) * 6 + Math.sin(t * Math.PI * 12.4) * 3.2;
        const nearL = Math.max(0, 1 - Math.abs(x - 308) / 48);
        const nearR = Math.max(0, 1 - Math.abs(x - 652) / 48);
        h[x] -= (nearL + nearR) * 8;
      }
    } else if (id === 'vale') {
      for (let x = 0; x < VW; x++) {
        const t = x / (VW - 1);
        const v = Math.pow(Math.sin(t * Math.PI), 1.45);
        h[x] = 272 + v * 252 + Math.sin(t * 15.4) * 6 + Math.sin(t * 37) * 2.6;
      }
      padFlat(h, 56, 200, 286);
      padFlat(h, 760, 904, 286);
    } else if (id === 'forge') {
      for (let x = 0; x < VW; x++) h[x] = FORGE_VOID;
      function forgeBand(x0, x1, y) {
        for (let x = x0; x <= x1; x++) {
          const edge = Math.min(x - x0, x1 - x);
          const ramp = clamp(edge / 12, 0, 1);
          const sm = ramp * ramp * (3 - 2 * ramp);
          const yy = y + Math.sin(x * 0.10) * 2.2 + Math.sin(x * 0.23) * 1.1;
          h[x] = lerp(FORGE_VOID, yy, sm);
        }
      }
      forgeBand(FORGE_L0, FORGE_L1, FORGE_PAD_Y);
      forgeBand(FORGE_C0, FORGE_C1, FORGE_CRUST_Y);
      forgeBand(FORGE_R0, FORGE_R1, FORGE_PAD_Y);
    } else if (id === 'arcade') {
      for (let x = 0; x < VW; x++) h[x] = ARCADE_VOID;
      for (let x = ARCADE_L0; x <= ARCADE_R1; x++) {
        const edge = Math.min(x - ARCADE_L0, ARCADE_R1 - x);
        const ramp = clamp(edge / 14, 0, 1);
        const sm = ramp * ramp * (3 - 2 * ramp);
        let yy = ARCADE_PAD_Y;
        if (x >= ARCADE_A0 && x <= ARCADE_A1) yy = arcadeDeckY(x);
        yy += Math.sin(x * 0.09) * 1.4 + Math.sin(x * 0.21) * 0.6;
        h[x] = lerp(ARCADE_VOID, yy, sm);
      }
    } else if (id === 'towers') {
      for (let x = 0; x < VW; x++) {
        h[x] = TOWERS_YARD_Y + Math.sin(x * 0.07) * 2.4 + Math.sin(x * 0.19) * 1.1;
      }
      function towersBand(x0, x1, y, edge) {
        for (let x = x0; x <= x1; x++) {
          const er = Math.min(x - x0, x1 - x);
          const ramp = clamp(er / Math.max(1, edge), 0, 1);
          const sm = ramp * ramp * (3 - 2 * ramp);
          const yy = y + Math.sin(x * 0.08) * 1.2 + Math.sin(x * 0.21) * 0.5;
          h[x] = lerp(h[x], yy, sm);
        }
      }
      towersBand(TOWERS_L0, TOWERS_L_DECK, TOWERS_TOP_Y, 8);
      towersBand(TOWERS_L_DECK, TOWERS_L_INNER, TOWERS_LEDGE_Y, 6);
      towersBand(TOWERS_R_INNER, TOWERS_R_DECK, TOWERS_LEDGE_Y, 6);
      towersBand(TOWERS_R_DECK, TOWERS_R1, TOWERS_TOP_Y, 8);
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
    if (id === 'ruins') return side === 'p' ? 140 : 820;
    if (id === 'vale') return side === 'p' ? 128 : 832;
    if (id === 'forge') return side === 'p' ? 148 : 812;
    if (id === 'arcade') return side === 'p' ? 140 : 820;
    if (id === 'towers') return side === 'p' ? TOWERS_PX : TOWERS_FX;
    return side === 'p' ? 152 : 768;
  }

  function spawnAt(side, slot) {
    if (G.mapId === 'towers' && slot) return side === 'p' ? TOWERS_P2X : TOWERS_F2X;
    const base = spawnX(G.mapId, side);
    if (!slot) return base;
    const inward = side === 'p' ? 1 : -1;
    const tries = [36, 28, 22, 16, 10, 6];
    for (let i = 0; i < tries.length; i++) {
      const x = clamp(base + inward * tries[i], 22, VW - 22);
      if (isDeathVoid(x)) continue;
      const gy = groundAt(x);
      const g0 = groundAt(base);
      if (gy >= VH - 20) continue;
      if (Math.abs(gy - g0) > 28) continue;
      return x;
    }
    return base;
  }

  function buildWalls(id, H) {
    G.walls = [];
    if (!H) return;
    let specs = null;
    if (id === 'ruins') {
      specs = [
        { x0: 288, x1: 328, kind: 'ruins' },
        { x0: 632, x1: 672, kind: 'ruins' }
      ];
    } else if (id === 'towers') {
      specs = [
        { x0: TOWERS_LW0, x1: TOWERS_LW1, kind: 'towers' },
        { x0: TOWERS_RW0, x1: TOWERS_RW1, kind: 'towers' }
      ];
    } else return;
    for (let s = 0; s < specs.length; s++) {
      const spec = specs[s];
      const w = spec.x1 - spec.x0 + 1;
      const tops = new Int16Array(w);
      const bots = new Int16Array(w);
      const mask = new Uint8Array(w * WALL_MAXH);
      for (let i = 0; i < w; i++) {
        const x = spec.x0 + i;
        const bot = Math.round(H[x]);
        let top;
        if (spec.kind === 'towers') {
          const cren = (i % 16) < 10;
          const crown = TOWERS_TOP_Y - (cren ? 46 : 20);
          top = Math.max(88, Math.min(bot - 8, crown)) | 0;
        } else {
          let hh = 112 + Math.sin(x * 0.31) * 10 + Math.sin(x * 0.73) * 7;
          if ((i % 17) === 9) hh -= 24;
          if ((i % 23) === 4) hh -= 14;
          top = Math.max(88, bot - hh) | 0;
        }
        tops[i] = top;
        bots[i] = bot;
        for (let y = top; y < bot && (y - top) < WALL_MAXH; y++) {
          const ly = y - top;
          let solid = true;
          if (spec.kind !== 'towers') {
            const notch = (i > w * 0.42 && i < w * 0.58 && ly > 36 && ly < 56);
            const crack = (i === ((w * 0.3) | 0) && ly > 18 && ly < 34);
            solid = !notch && !crack;
          }
          if (solid) mask[i * WALL_MAXH + ly] = 1;
        }
      }
      G.walls.push({ x0: spec.x0, x1: spec.x1, tops: tops, bots: bots, mask: mask });
    }
  }

  function isTowersLedge(x) {
    if (G.mapId !== 'towers') return false;
    const i = x | 0;
    return (i >= TOWERS_L_DECK && i <= TOWERS_L_INNER) || (i >= TOWERS_R_INNER && i <= TOWERS_R_DECK);
  }

  function inWall(x, y) {
    if (!G.walls || !G.walls.length) return false;
    const xi = x | 0;
    const yi = y | 0;
    for (let w = 0; w < G.walls.length; w++) {
      const wall = G.walls[w];
      if (xi < wall.x0 || xi > wall.x1) continue;
      const i = xi - wall.x0;
      const top = wall.tops[i];
      const bot = wall.bots[i];
      if (yi < top || yi >= bot) continue;
      const ly = yi - top;
      if (ly >= 0 && ly < WALL_MAXH && wall.mask[i * WALL_MAXH + ly]) return true;
    }
    return false;
  }

  function punchWall(cx, cy, r) {
    if (!G.walls || !G.walls.length || r <= 0) return false;
    const r2 = r * r;
    let any = false;
    for (let w = 0; w < G.walls.length; w++) {
      const wall = G.walls[w];
      const x0 = Math.max(wall.x0, Math.floor(cx - r));
      const x1 = Math.min(wall.x1, Math.ceil(cx + r));
      for (let x = x0; x <= x1; x++) {
        const i = x - wall.x0;
        const top = wall.tops[i];
        const bot = wall.bots[i];
        const y0 = Math.max(top, Math.floor(cy - r));
        const y1 = Math.min(bot - 1, Math.ceil(cy + r));
        for (let y = y0; y <= y1; y++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy > r2) continue;
          const ly = y - top;
          if (ly >= 0 && ly < WALL_MAXH && wall.mask[i * WALL_MAXH + ly]) {
            wall.mask[i * WALL_MAXH + ly] = 0;
            any = true;
          }
        }
      }
    }
    return any;
  }

  function punchCover(cx, cy, r, wep) {
    if (!wep || (wep.id !== 1 && wep.id !== 4)) return;
    if (punchWall(cx, cy, r)) {
      burst(cx, cy, STONE, REDUCE ? 6 : 12, 130, 0.36);
      audio.dirt();
    }
  }

  function clearWallCol(x) {
    if (!G.walls || !G.walls.length) return;
    const xi = x | 0;
    for (let w = 0; w < G.walls.length; w++) {
      const wall = G.walls[w];
      if (xi < wall.x0 || xi > wall.x1) continue;
      const i = xi - wall.x0;
      const top = wall.tops[i];
      const bot = wall.bots[i];
      for (let y = top; y < bot && (y - top) < WALL_MAXH; y++) {
        wall.mask[i * WALL_MAXH + (y - top)] = 0;
      }
    }
  }

  function wallBlocksWalk(x, y, r) {
    if (!G.walls || !G.walls.length) return false;
    r = r || UNIT_R;
    const x0 = Math.max(0, (x - r + 2) | 0);
    const x1 = Math.min(VW - 1, (x + r - 2) | 0);
    for (let i = x0; i <= x1; i++) {
      if (inWall(i, y) || inWall(i, y + r * 0.45)) return true;
    }
    return false;
  }

  function coverBetween(a, b) {
    if (!a || !b || !G.walls || !G.walls.length) return false;
    const x0 = Math.min(a.x, b.x);
    const x1 = Math.max(a.x, b.x);
    const y = (a.y + b.y) * 0.5;
    for (let x = x0; x <= x1; x += 4) {
      if (inWall(x, y) || inWall(x, b.y)) return true;
    }
    return false;
  }

  function makeUnit(side, spec) {
    spec = spec || {};
    const slot = spec.slot || 0;
    const x = spawnAt(side, slot);
    const stake = G.kind === 'drill' && side === 'f';
    const id = spec.id || (side === 'p' ? 'p' : 'f');
    const u = {
      id: id,
      side: side,
      name: spec.name || (side === 'p' ? '岚丸' : (stake ? '石俑' : '烬丸')),
      stake: stake,
      ai: !!spec.ai,
      delay: spec.delay || 0,
      ord: spec.ord != null ? spec.ord : (side === 'p' ? 0 : 1),
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
      wep: 0,
      ghost: null,
      items: freshItems()
    };
    u.y = groundAt(u.x) - u.r;
    return u;
  }

  function pickWindValue() {
    if (G.kind === 'drill') {
      if (G.drillWind === '0') return 0;
      if (G.drillWind === '4r') return 4;
      if (G.drillWind === '4l') return -4;
    }
    const m = windMax();
    let w;
    if (G.kind === 'core' && Math.random() < 0.55) {
      w = (Math.random() < 0.5 ? -1 : 1) * irand(8, m);
    } else {
      w = irand(-m, m);
    }
    if (w === 0 && Math.random() < 0.35) w = Math.random() < 0.5 ? -1 : 1;
    return w;
  }

  function rollWind() {
    if (G.kind === 'drill' && G.nextWind != null) {
      G.wind = G.nextWind;
      G.nextWind = null;
      G.teaseWind = false;
      return;
    }
    G.nextWind = null;
    G.teaseWind = false;
    G.wind = pickWindValue();
  }

  function queueNextWind() {
    if (G.kind !== 'drill') {
      G.nextWind = null;
      G.teaseWind = false;
      return;
    }
    if (G.nextWind == null) G.nextWind = pickWindValue();
    G.teaseWind = true;
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

  function snapForge(cx, r) {
    if (G.mapId !== 'forge' || !G.H) return;
    const x0 = Math.max(FORGE_C0, Math.floor(cx - r - 8));
    const x1 = Math.min(FORGE_C1, Math.ceil(cx + r + 8));
    let any = false;
    for (let x = x0; x <= x1; x++) {
      if (G.H[x] < FORGE_VOID - 20 && G.H[x] > FORGE_CRUST_Y + 6) {
        G.H[x] = FORGE_VOID;
        any = true;
      }
    }
    if (any) terrainDirty = true;
  }

  function snapArcade(cx, r, wep) {
    if (G.mapId !== 'arcade' || !G.H || !wep) return;
    if (wep.id !== 1 && wep.id !== 4) return;
    const x0 = Math.max(ARCADE_A0, Math.floor(cx - r - 10));
    const x1 = Math.min(ARCADE_A1, Math.ceil(cx + r + 10));
    let any = false;
    for (let x = x0; x <= x1; x++) {
      if (G.H[x] < ARCADE_VOID - 20) {
        G.H[x] = ARCADE_VOID;
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
    const list = allUnits();
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
      if (inGround(x, y) || inWall(x, y)) {
        if (wep && wep.id === 2 && !pierced) {
          pierced = true;
          fuse = 0.18;
          const s = hypot(vx, vy) || 1;
          const ux = vx / s;
          const uy = vy / s;
          x += ux * 46;
          y += uy * 46;
          let g = 0;
          while ((inGround(x, y) || inWall(x, y)) && g < 18) {
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
      this.noise(hit ? 0.24 : 0.14, hit ? 0.11 : 0.05, hit ? 160 : 280);
      this.beep(hit ? 150 : 110, 0.26, 'sine', hit ? 0.10 : 0.04, 36);
      if (hit) this.beep(72, 0.18, 'triangle', 0.055, 28);
      if (wep && wep.id === 1) this.beep(70, 0.28, 'triangle', 0.05, 32);
      if (wep && wep.id === 5) this.beep(210, 0.16, 'sine', 0.045, 90);
      if (wep && wep.id === 6) this.beep(140, 0.2, 'sawtooth', 0.045, 50);
      if (ult) {
        this.noise(0.42, 0.16, 70);
        this.beep(48, 0.5, 'sine', 0.14, 24);
        this.beep(86, 0.36, 'triangle', 0.1, 28);
        this.beep(36, 0.28, 'square', 0.06, 20);
      }
    },
    thump() {
      this.ensure();
      this.beep(48, 0.36, 'sine', 0.12, 22);
      this.beep(36, 0.22, 'square', 0.045, 20);
      this.noise(0.2, 0.07, 70);
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
    const ice = gold === 'ice';
    toastEl.classList.toggle('ice', ice && !warn);
    toastEl.classList.toggle('gold', !!gold && !ice && !warn);
    toastEl.classList.remove('pass');
    toastEl.classList.remove('hidden');
  }

  function toastPass(side) {
    const mag = side === 'f';
    G.toastT = 2.6;
    toastTok += 1;
    if (!toastEl) return;
    toastEl.textContent = passToastFor(side);
    toastEl.classList.toggle('warn', mag);
    toastEl.classList.remove('ice');
    toastEl.classList.toggle('gold', !mag);
    toastEl.classList.add('pass');
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
      if (o.mini === false) G.mini = false;
      else G.mini = true;
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
        mini: G.mini !== false,
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
    if (turnLabel) {
      if (G.mode === 'play') {
        const actor = curUnit();
        const pTurn = G.kind === 'drill' || (actor && actor.side === 'p');
        let lab;
        if (G.kind === 'drill') lab = '岚丸的回合';
        else if (isSquad()) {
          const nm = (actor && actor.name) || '岚丸';
          lab = isHuman(actor) ? (nm + '出手') : (nm + '瞄准中');
        } else {
          lab = pTurn ? '岚丸的回合' : '烬丸的回合';
        }
        turnLabel.textContent = lab;
        turnLabel.classList.remove('gone');
        const isP2 = isSquad() && actor && actor.id === 'p2';
        const isF2 = isSquad() && actor && actor.id === 'f2';
        turnLabel.classList.toggle('p', pTurn && !isP2);
        turnLabel.classList.toggle('p2', !!isP2);
        turnLabel.classList.toggle('f', !pTurn && !isF2);
        turnLabel.classList.toggle('f2', !!isF2);
      } else {
        turnLabel.classList.add('gone');
      }
    }
    const hpPWrap = hasDom ? document.querySelector('.hp-p') : null;
    const hpFWrap = hasDom ? document.querySelector('.hp-f') : null;
    const hpP2Wrap = el('hp-p2-wrap');
    const hpF2Wrap = el('hp-f2-wrap');
    const actorNow = curUnit();
    if (hpRow) hpRow.classList.toggle('duo', G.mode === 'play' && isSquad());
    const inhabitP = G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'p' && isHuman(actorNow);
    const inhabitP2 = G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'p2' && isHuman(actorNow);
    const inhabitF = G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'f' && isHuman(actorNow);
    const inhabitF2 = G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'f2' && isHuman(actorNow);
    if (hpPWrap) {
      hpPWrap.classList.toggle('on', G.mode === 'play' && !!actorNow && actorNow.id === 'p');
      hpPWrap.classList.toggle('inhabit', inhabitP);
    }
    if (hpFWrap) {
      hpFWrap.classList.toggle('on', G.mode === 'play' && G.kind !== 'drill' && !!actorNow && actorNow.id === 'f');
      hpFWrap.classList.toggle('inhabit', inhabitF);
    }
    if (hpP2Wrap) {
      hpP2Wrap.classList.toggle('gone', !(G.mode === 'play' && isSquad()));
      hpP2Wrap.classList.toggle('on', G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'p2');
      hpP2Wrap.classList.toggle('inhabit', inhabitP2);
    }
    if (hpF2Wrap) {
      hpF2Wrap.classList.toggle('gone', !(G.mode === 'play' && isSquad()));
      hpF2Wrap.classList.toggle('on', G.mode === 'play' && isSquad() && !!actorNow && actorNow.id === 'f2');
      hpF2Wrap.classList.toggle('inhabit', inhabitF2);
    }
    if (delayRow) {
      if (G.mode === 'play' && isSquad()) {
        delayRow.classList.remove('gone');
        delayRow.setAttribute('aria-hidden', 'false');
        const live = allUnits();
        const order = sortByDelay(liveActors());
        const nextId = order.length ? order[0].id : 'p';
        let html = '';
        let sig = '';
        for (let i = 0; i < live.length; i++) {
          const u = live[i];
          const dead = u.hp <= 0;
          const rank = dead ? -1 : order.indexOf(u);
          const isNow = !dead && u.id === G.turn;
          const isNext = !dead && u.id === nextId;
          const cls = 'dly ' + u.id + (isNow ? ' now' : '') + (isNext ? ' next' : '') + (dead ? ' dead' : '');
          let pips = '<span class="pips">';
          for (let k = 0; k < 4; k++) pips += '<em class="' + (!dead && k === rank ? 'on' : '') + '"></em>';
          pips += '</span>';
          html += '<span class="' + cls + '"><i>' + unitShort(u) + '</i><b>' + Math.round(u.delay || 0) + '</b>' + pips + '</span>';
          sig += u.id + ':' + Math.round(u.delay || 0) + ':' + (dead ? 'x' : rank) + ':' + (isNow ? 't' : '') + '|';
        }
        if (delayRow.getAttribute('data-sig') !== sig) {
          delayRow.setAttribute('data-sig', sig);
          delayRow.innerHTML = html;
        }
      } else {
        delayRow.classList.add('gone');
        delayRow.setAttribute('aria-hidden', 'true');
        delayRow.innerHTML = '';
      }
    }
    if (mapLabel) mapLabel.textContent = MAP_NAME[G.mapId] || '平原';
    if (windArr) windArr.textContent = G.wind > 0 ? '→' : G.wind < 0 ? '←' : '·';
    if (windNum) windNum.textContent = String(Math.abs(G.wind | 0));
    else if (windLabel) windLabel.textContent = '风 ' + windText();
    if (nextWindEl) {
      const tease = G.kind === 'drill' && G.teaseWind && G.nextWind != null && G.mode === 'play'
        && (G.phase === 'fly' || G.phase === 'settle');
      nextWindEl.classList.toggle('gone', !tease);
      nextWindEl.setAttribute('aria-hidden', tease ? 'false' : 'true');
      if (tease) {
        const nw = G.nextWind | 0;
        if (nextWindArr) nextWindArr.textContent = nw > 0 ? '→' : nw < 0 ? '←' : '·';
        if (nextWindNum) nextWindNum.textContent = String(Math.abs(nw));
      }
    }
    const u = curUnit() || G.p;
    if (angLabel) angLabel.textContent = '角 ' + Math.round((u && u.ang) || 65) + '°';
    if (powLabel) powLabel.textContent = '力 ' + Math.round(G.power);
    const stam = u && u.stam != null ? u.stam : G.stam;
    if (walkLabel) walkLabel.textContent = '体 ' + Math.max(0, Math.round(stam));
    if (rageLabel) rageLabel.textContent = '怒 ' + Math.max(0, Math.round((u && u.rage) || 0));
    if (ghostLabel) {
      const gh = actorGhost();
      if (gh && G.mode === 'play') {
        ghostLabel.classList.remove('gone');
        ghostLabel.textContent = '上 ' + Math.round(gh.ang) + '°/' + Math.round(gh.power);
      } else {
        ghostLabel.classList.add('gone');
      }
    }
    if (foeNameEl) foeNameEl.textContent = G.f && G.f.stake ? '石俑' : '烬丸';
    function bar(node, t) { if (node) node.style.transform = 'scaleX(' + clamp(t, 0, 1) + ')'; }
    function syncBars(u, st, rg, hpN, hpB) {
      if (!u) return;
      bar(st, (u.stam || 0) / STAM_MAX);
      bar(rg, (u.rage || 0) / 100);
      if (hpN) hpN.textContent = String(Math.max(0, Math.ceil(u.hp)));
      if (hpB) hpB.style.transform = 'scaleX(' + clamp(u.hp / u.max, 0, 1) + ')';
    }
    syncBars(G.p, stP, rgP, hpPN, hpP);
    syncBars(G.f, stF, rgF, hpFN, hpF);
    if (isSquad()) {
      syncBars(G.p2, stP2, rgP2, hpP2N, hpP2);
      syncBars(G.f2, stF2, rgF2, hpF2N, hpF2);
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
    if (timeLabel) {
      const ticking = G.mode === 'play' && (G.phase === 'aim' || G.phase === 'charge');
      if (ticking) {
        const left = Math.max(0, Math.ceil(G.timeout));
        timeLabel.textContent = '时 ' + left;
        timeLabel.classList.toggle('pulse', left <= 5 && G.timeout > 0);
        timeLabel.classList.remove('gone');
      } else {
        timeLabel.classList.add('gone');
        timeLabel.classList.remove('pulse');
      }
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
    syncWeps();
  }

  function syncItems() {
    const actor = curUnit() || G.p;
    const bag = actor && actor.items ? actor.items : ITEM_MAX;
    const map = { leap: 'n-leap', warp: 'n-warp', neon: 'n-neon', drum: 'n-drum', nixi: 'n-nixi', veil: 'n-veil' };
    const btnId = { leap: 'btn-leap', warp: 'btn-warp', neon: 'btn-neon', drum: 'btn-drum', nixi: 'btn-nixi', veil: 'btn-veil' };
    Object.keys(map).forEach(function (k) {
      const n = el(map[k]);
      if (n) n.textContent = String(bag[k] != null ? bag[k] : 0);
      const btn = el(btnId[k]);
      if (btn) {
        const left = bag[k] || 0;
        const cost = ITEM_COST[k];
        const stam = actor ? actor.stam : 0;
        btn.classList.toggle('empty', left <= 0 || stam < cost);
        btn.classList.toggle('on', k === 'neon' && G.neonOn);
      }
    });
    if (el('btn-ult')) {
      el('btn-ult').classList.toggle('armed', !!(actor && (actor.rage >= 100 || actor.ult)));
      el('btn-ult').classList.toggle('empty', !(actor && (actor.rage >= 100 || actor.ult)));
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

  function setMini(on) {
    G.mini = !!on;
    saveBest();
    toast(G.mini ? '地条开' : '地条关', false, false);
    drawMini();
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
    floatText(u.x, u.y - 22, '-' + dmg, unitRgb(u), true);
    const wrapSel = u.id === 'p2' ? '.hp-p2' : u.id === 'f2' ? '.hp-f2' : (u.side === 'p' ? '.hp-p' : '.hp-f');
    const wrap = hasDom ? document.querySelector(wrapSel) : null;
    if (wrap) {
      wrap.classList.remove('flash');
      void wrap.offsetWidth;
      wrap.classList.add('flash');
    }
    if (why !== 'fall' && why !== 'void') addRage(u, Math.floor(dmg * 0.55));
    if (why === 'fall') addRage(u, Math.floor(dmg * 0.55));
    audio.hit();
    return dmg;
  }

  function applyBlast(x, y, wep, shooter) {
    const mul = dmgMul();
    let any = false;
    const list = allUnits();
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
          noteLastHit(shooter, u);
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
      if (u.y > VH + 40 || ((G.mapId === 'forge' || G.mapId === 'arcade') && isDeathVoid(u.x) && u.y > 400)) {
        addRage(u, 20);
        u.hp = 0;
        u.rage = 0;
        floatText(u.x, Math.min(u.y, VH - 40), '坠亡', MAG, true);
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
    const list = allUnits();
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      if (u.hp > 0 && !(u.grounded && Math.abs(u.vy) < 4)) return false;
    }
    return true;
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
    const pd = teamDown('p');
    const fd = teamDown('f');
    if (!pd && !fd) return false;
    G.mode = 'end';
    G.phase = 'end';
    clearFruits(true);
    audio.chargeStop();
    const turns = G.turns;
    if (pd && fd) {
      if (G.kind !== 'seat' && !isSquad()) G.winStreak = 0;
      saveBest();
      audio.lose();
      toast('对坠', true, false);
      showOverlay('draw', '对坠', (G.kind === 'seat' || isSquad()) ? ('同烬。本局 ' + turns + ' 回合') : ('同烬。本局 ' + turns + ' 回合 · 连胜清零'));
      setHint('对坠 · R 再来', 'warn');
    } else if (fd) {
      if (G.kind === 'seat' || isQuad()) {
        saveBest();
        audio.win();
        screenFlash(GOLD, 0.55);
        toast('岚丸胜', false, true);
        showOverlay('win', '岚丸胜', isQuad() ? ('岚丸与霜丸胜。' + turns + ' 回合') : ('岚丸胜。' + turns + ' 回合'));
        setHint('岚丸胜 · R 再来', 'hot');
      } else if (isDuo()) {
        G.winStreak += 1;
        if (!G.bestTurns || turns < G.bestTurns) G.bestTurns = turns;
        saveBest();
        audio.win();
        popStreak(1);
        screenFlash(GOLD, 0.55);
        toast('堂破了', false, true);
        {
          const who = duoFinisherName();
          const hit = who ? who + '收击。' : '';
          showOverlay('win', '堂破了', '烬丸与霆丸倒了。' + hit + turns + ' 回合 · 连胜 ' + G.winStreak + (G.bestTurns ? ' · 最快 ' + G.bestTurns + ' 回' : ''));
        }
        setHint('堂破了 · R 再来', 'hot');
      } else {
        G.winStreak += 1;
        if (!G.bestTurns || turns < G.bestTurns) G.bestTurns = turns;
        saveBest();
        audio.win();
        popStreak(1);
        screenFlash(GOLD, 0.55);
        showOverlay('win', '堂破了', '烬丸倒了。' + turns + ' 回合 · 连胜 ' + G.winStreak + (G.bestTurns ? ' · 最快 ' + G.bestTurns + ' 回' : ''));
        setHint('堂破了 · R 再来', 'hot');
      }
    } else {
      if (G.kind === 'seat' || isQuad()) {
        saveBest();
        audio.win();
        screenFlash(MAG, 0.5);
        toast('烬丸胜', false, true);
        showOverlay('win', '烬丸胜', isQuad() ? ('烬丸与霆丸胜。' + turns + ' 回合') : ('烬丸胜。' + turns + ' 回合'));
        setHint('烬丸胜 · R 再来', 'hot');
      } else if (isDuo()) {
        G.winStreak = 0;
        saveBest();
        audio.lose();
        screenFlash(MAG, 0.5);
        showOverlay('lose', '落堂了', '岚丸与霜丸倒下。本局 ' + turns + ' 回合');
        setHint('落堂了 · R 再来', 'warn');
      } else {
        G.winStreak = 0;
        saveBest();
        audio.lose();
        screenFlash(MAG, 0.5);
        showOverlay('lose', '落堂了', '岚丸倒下。本局 ' + turns + ' 回合');
        setHint('落堂了 · R 再来', 'warn');
      }
    }
    syncHud();
    return true;
  }

  function beginTurn(who) {
    clearFruits(true);
    if (G.kind === 'drill') who = 'p';
    const u = unitById(who);
    G.turn = u && u.id ? u.id : (who === 'f' ? 'f' : 'p');
    G.phase = 'aim';
    G.charging = false;
    G.busy = null;
    G.busyT = 0;
    G.power = TAP_POW;
    G.walk = WALK_PX;
    G.timeout = TURN_T;
    G.shot = null;
    G.neonOn = false;
    G.actDelay = { skip: false, wepId: 0, ult: false };
    trail.length = 0;
    if (u) {
      u.stam = STAM_MAX;
      if (G.kind === 'drill') resetItems(u);
      if (u.wep != null) G.wep = u.wep;
    }
    G.stam = u ? u.stam : STAM_MAX;
    G.ghost = (u && u.ghost) || null;
    rollWind();
    if (u && u.id === 'p') G.turns += 1;
    maybeSudden();
    audio.chargeStop();
    if (u && u.hp <= 0) {
      if (checkEnd()) return;
      if (isSquad()) {
        const nxt = pickNextId();
        const nu = unitById(nxt);
        if (!nu || nu === u || nu.hp <= 0) return;
        beginTurn(nxt);
      } else beginTurn(G.turn === 'p' ? 'f' : 'p');
      return;
    }
    if (u && u.frozen) {
      toast(u.name + ' 被冻结', true, false);
      G.phase = 'frozenWait';
      G.frozenT = 0.55;
      u.frozen = 0;
      if (u.ult) u.ult = false;
      G.actDelay = { skip: true, wepId: 0, ult: false };
      syncHud();
      return;
    }
    const human = isHuman(u);
    const nm = (u && u.name) || (G.turn === 'p' ? '岚丸' : '烬丸');
    if (isQuad() && human) {
      if (G.ctrlSide && G.ctrlSide !== u.side) toastPass(u.side);
      else toast(nm + '出手', false, u && u.id === 'p2' ? 'ice' : (u && u.side === 'p'));
      G.ctrlSide = u.side;
    } else if (isDuo() && human) toast(nm + '出手', false, u && u.id === 'p2' ? 'ice' : true);
    else if (human) toast(nm + '的回合 · 风 ' + windText(), false, u && u.side === 'p');
    else toast(nm + '瞄准中 · 风 ' + windText(), false, false);
    setHint(G.kind === 'drill' ? OPS_DRILL : (human ? OPS_PLAY : (nm + '拉炮…')), human ? '' : 'warn');
    if (!human && G.kind !== 'drill' && !isQuad()) startAI();
    syncHud();
    if (G.kind === 'seat' || isSquad()) setCamShooter(u);
    else setCamFighters();
  }

  function spawnCrumbs(x, y0, n) {
    const count = REDUCE ? Math.min(1, n) : n;
    for (let i = 0; i < count; i++) {
      crumbs.push({
        x: x + rand(-4, 4),
        y: y0 + rand(-10, 6),
        vx: rand(-50, 50),
        vy: rand(20, 110),
        g: 480,
        r: rand(1.8, 4.2),
        rgb: DIRT,
        life: 1.8
      });
    }
  }

  function dropCol(x) {
    if (!G.H || x < 0 || x >= VW) return;
    const oldY = G.H[x];
    G.H[x] = VH - 8;
    clearWallCol(x);
    if ((x % 6) === 0) spawnCrumbs(x, oldY, REDUCE ? 1 : 2);
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
    eachUnit(ungroundIfAir);
  }

  function maybeSudden() {
    if (G.kind === 'drill' || G.mode !== 'play') return;
    if (G.sudden) {
      crumbleBand();
      return;
    }
    const live = liveActors();
    const both = live.length >= 2 && live.every(function (u) { return u.hp <= SUDDEN_HP; });
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
    if (G.mode !== 'play' || G.phase !== 'aim' || !humanTurn()) return;
    if (G.busy) return;
    G.phase = 'charge';
    G.charging = true;
    G.power = TAP_POW;
    audio.ensure();
    audio.chargeStart();
  }

  function releaseCharge() {
    if (G.mode !== 'play') return;
    if (G.phase === 'charge' && humanTurn() && G.charging) {
      fire(curUnit());
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
    G.actDelay = { skip: false, wepId: wep.id, ult: !!u.ult };
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
    u.ghostPend = { x: sx, y: sy, ang: u.ang, power: Math.round(G.power), wepId: wep.id, wind: G.wind, points: [] };
    G.ghostPend = u.ghostPend;
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
    if (wep.id === 6) {
      audio.beep(240, 0.12, 'sawtooth', 0.036, 90);
      audio.beep(420, 0.1, 'sine', 0.03, 180);
    }
    if (u.ult) audio.beep(90, 0.28, 'sine', 0.06, 36);
    burst(sx, sy, u.ult ? GOLD : (wep.id === 3 ? ICE : (wep.id === 6 ? FIRE : (wep.id === 5 ? RAIL : unitRgb(u)))), 8, 80, 0.25);
    u.walkT = 0;
    spawnFruits();
    queueNextWind();
    syncHud();
  }

  function fruitModeOk() {
    if (G.kind === 'drill') return false;
    if (G.kind !== 'hall' && G.kind !== 'core' && G.kind !== 'seat' && G.kind !== 'duo' && G.kind !== 'quad') return false;
    if ((G.turns | 0) <= 1 && G.turn === 'p') return false;
    return true;
  }

  function fruitCap(k) {
    return (ITEM_MAX[k] || 0) + 1;
  }

  function rollFruitN() {
    const r = Math.random();
    if (r < 0.34) return 0;
    if (r < 0.82) return 1;
    return 2;
  }

  function fruitBlocked(x, y) {
    if (x < 90 || x > VW - 90 || y < 52 || y > VH - 80) return true;
    if (inGround(x, y) || inWall(x, y)) return true;
    const gy = groundAt(x);
    if (!(gy - y >= 56)) return true;
    for (let a = 0; a < 8; a++) {
      const th = a * TAU / 8;
      const wx = x + Math.cos(th) * FRUIT_WALL;
      const wy = y + Math.sin(th) * FRUIT_WALL;
      if (inWall(wx, wy)) return true;
    }
    const bodies = allUnits();
    for (let bi = 0; bi < bodies.length; bi++) {
      if (hypot(x - bodies[bi].x, y - bodies[bi].y) < 80) return true;
    }
    const list = G.fruits;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (hypot(x - list[i].x, y - list[i].y) < 72) return true;
      }
    }
    return false;
  }

  function pickFruitSpot() {
    for (let i = 0; i < 36; i++) {
      const x = rand(110, VW - 110);
      const gy = groundAt(x);
      const yHi = Math.min(gy - 56, 340);
      const yLo = 64;
      if (yHi <= yLo + 8) continue;
      const y = rand(yLo, yHi);
      if (!fruitBlocked(x, y)) return { x: x, y: y };
    }
    return null;
  }

  function spawnFruits(forceN) {
    G.fruits = G.fruits || [];
    G.fruits.length = 0;
    if (!fruitModeOk()) return;
    const n = clamp(forceN != null ? forceN : rollFruitN(), 0, 2);
    for (let i = 0; i < n; i++) {
      const p = pickFruitSpot();
      if (!p) continue;
      G.fruits.push({
        x: p.x,
        y: p.y,
        r: FRUIT_R,
        gold: Math.random() < FRUIT_GOLD_P,
        ph: rand(0, TAU)
      });
    }
  }

  function clearFruits(puff) {
    const list = G.fruits;
    if (list && puff) {
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        burst(f.x, f.y, f.gold ? GOLD : HOT, REDUCE ? 3 : 6, 46, 0.18);
      }
    }
    if (list) list.length = 0;
  }

  function grantFruit(owner, gold) {
    if (!owner || owner.stake) return null;
    if (!owner.items) owner.items = { leap: 0, warp: 0, neon: 0, drum: 0, nixi: 0, veil: 0 };
    if (gold) {
      addRage(owner, FRUIT_RAGE);
      return { gold: true, name: '怒' };
    }
    const open = [];
    for (let i = 0; i < ITEM_KEYS.length; i++) {
      const k = ITEM_KEYS[i];
      if ((owner.items[k] || 0) < fruitCap(k)) open.push(k);
    }
    if (!open.length) return { gold: false, name: '' };
    const k = open[irand(0, open.length - 1)];
    owner.items[k] = (owner.items[k] || 0) + 1;
    return { gold: false, name: ITEM_NAME[k], id: k };
  }

  function collectFruit(idx, owner) {
    const list = G.fruits;
    if (!list || idx < 0 || idx >= list.length) return;
    const f = list[idx];
    list.splice(idx, 1);
    const rgb = f.gold ? GOLD : HOT;
    burst(f.x, f.y, rgb, REDUCE ? 8 : 18, 150, 0.4);
    burst(f.x, f.y, WHT, REDUCE ? 4 : 8, 90, 0.22);
    ringAt(f.x, f.y, rgb, 30);
    audio.ensure();
    audio.beep(f.gold ? 660 : 540, 0.08, 'sine', 0.042, 1040);
    audio.beep(f.gold ? 880 : 760, 0.1, 'triangle', 0.03, 1400);
    const got = grantFruit(owner, f.gold);
    if (got && got.gold) {
      toast('殿果 · 怒', false, true);
      floatText(f.x, f.y - 14, '+25', GOLD, false);
    } else if (got && got.name) {
      toast('殿果 · ' + got.name, false, false);
      floatText(f.x, f.y - 14, got.name, HOT, false);
    } else {
      toast('殿果', false, false);
    }
    syncHud();
  }

  function fruitHitAt(x, y, owner) {
    const list = G.fruits;
    if (!list || !list.length) return;
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      if (hypot(x - f.x, y - f.y) <= f.r + 6) collectFruit(i, owner);
    }
  }

  function sweepFruits(x0, y0, x1, y1, owner) {
    const list = G.fruits;
    if (!list || !list.length) return;
    const d = hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.ceil(d / 6));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      fruitHitAt(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, owner);
    }
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
        snapForge(pop.x, pop.r);
        snapArcade(pop.x, pop.r, wep);
        punchCover(pop.x, pop.y, pop.r, wep);
        if (applyBlast(pop.x, pop.y, wep, owner)) hit = true;
        burst(pop.x, pop.y, hit ? HOT : DIRT, hit ? 12 : 8, 160, 0.4);
        ringAt(pop.x, pop.y, HOT, pop.r * 1.5);
      }
      burst(x, y, GOLD, hit ? 8 : 3, 120, 0.32);
    } else {
      carve(x, y, crater);
      snapBridge(x, crater, wep);
      snapForge(x, crater);
      snapArcade(x, crater, wep);
      punchCover(x, y, crater, wep);
      if (wep.id === 2 && G.shot && G.shot.pierced) {
        const s = hypot(G.shot.vx, G.shot.vy) || 1;
        const ux = G.shot.vx / s;
        const uy = G.shot.vy / s;
        for (let s2 = 0; s2 <= 46; s2 += 4) {
          const px = x - ux * s2;
          const py = y - uy * s2;
          carve(px, py, 12);
          punchWall(px, py, 12);
        }
      }
      hit = applyBlast(x, y, wep, owner) || hit;
      const rgb = wep.id === 6 ? FIRE : (hit ? unitRgb(owner) : DIRT);
      burst(x, y, rgb, hit ? 28 : 16, hit ? 260 : 180, 0.55);
      burst(x, y, wep.id === 6 ? FIRE : GOLD, hit ? 10 : 4, 140, 0.35);
      ringAt(x, y, wep.id === 6 ? FIRE : (hit ? GOLD : HOT), crater * 1.6);
    }
    if (wep.id === 6) plantFire(x, y, wasUlt, owner);
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
      screenFlash(wasUlt ? GOLD : unitRgb(owner), wasUlt ? 0.45 : 0.28);
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
      const ghost = {
        x: G.ghostPend.x, y: G.ghostPend.y,
        ang: G.ghostPend.ang, power: G.ghostPend.power,
        wepId: G.ghostPend.wepId, wind: G.ghostPend.wind,
        points: pts
      };
      G.ghost = ghost;
      if (owner) owner.ghost = ghost;
      G.ghostPend = null;
    }
    eachUnit(ungroundIfAir);
    G.shot = null;
    G.phase = 'settle';
    G.settleT = 0.22;
    tickFires();
    eachUnit(refreshBury);
    syncHud();
  }

  function plantFire(x, y, ult, owner) {
    const gx = clamp(x, 4, VW - 4);
    const gy = groundAt(gx);
    G.fires.push({
      x: gx,
      y: Math.min(y, gy),
      r: FIRE_R,
      life: FIRE_LIFE,
      ult: !!ult,
      owner: owner || null
    });
    burst(gx, gy, FIRE, REDUCE ? 8 : 16, 90, 0.4);
    ringAt(gx, gy, FIRE, FIRE_R * 1.2);
    audio.beep(180, 0.16, 'sawtooth', 0.04, 70);
  }

  function tickFires() {
    if (!G.fires || !G.fires.length) return;
    const mul = dmgMul();
    for (let i = G.fires.length - 1; i >= 0; i--) {
      const f = G.fires[i];
      const list = allUnits();
      for (let j = 0; j < list.length; j++) {
        const u = list[j];
        if (!u || u.hp <= 0) continue;
        if (hypot(u.x - f.x, u.y - f.y) < f.r) {
          let dmg = FIRE_DMG * mul;
          if (f.ult) dmg *= 1.6;
          hurt(u, dmg, 'fire');
          if (f.owner) noteLastHit(f.owner, u);
          burst(u.x, u.y, FIRE, 8, 70, 0.28);
          floatText(u.x, u.y - 26, '烧', FIRE, false);
          audio.beep(210, 0.08, 'sawtooth', 0.03, 80);
        }
      }
      f.life -= 1;
      if (f.life <= 0) G.fires.splice(i, 1);
    }
  }

  function stepShot(dt) {
    const s = G.shot;
    if (!s) return;
    s.vx += G.wind * windKAt(s.wep, s.life) * dt;
    s.vy += (GRAV + gustAy(s.x)) * dt;
    const ox = s.x;
    const oy = s.y;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life += dt;
    trail.push({ x: s.x, y: s.y, a: 1 });
    if (trail.length > 42) trail.shift();
    if (G.ghostPend) G.ghostPend.points = trail.slice();
    setCamShot(s);
    sweepFruits(ox, oy, s.x, s.y, s.owner);
    if (s.x < 2 || s.x > VW - 2 || s.y > VH + 20) {
      explode(clamp(s.x, 2, VW - 2), Math.min(s.y, VH - 4), s.wep, s.owner, false);
      return;
    }
    const u = unitAt(s.x, s.y, s.owner);
    if (u) {
      explode(s.x, s.y, s.wep, s.owner, true);
      return;
    }
    if (inGround(s.x, s.y) || inWall(s.x, s.y)) {
      if (s.wep.id === 2 && !s.pierced) {
        s.pierced = true;
        s.fuse = 0.18;
        const sp = hypot(s.vx, s.vy) || 1;
        const ux = s.vx / sp;
        const uy = s.vy / sp;
        for (let k = 0; k <= 46; k += 4) {
          const bx = s.x + ux * k;
          const by = s.y + uy * k;
          carve(bx, by, 11);
          punchWall(bx, by, 12);
        }
        const px = s.x;
        const py = s.y;
        s.x += ux * 46;
        s.y += uy * 46;
        let g = 0;
        while ((inGround(s.x, s.y) || inWall(s.x, s.y)) && g < 18) {
          s.x += ux * 3;
          s.y += uy * 3;
          g += 1;
        }
        sweepFruits(px, py, s.x, s.y, s.owner);
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
    return G.mode === 'play' && humanTurn() && G.phase === 'aim' && !G.busy;
  }

  function toastDeny(msg) { toast(msg, true, false); }

  function useLeap(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (u.frozen) return false;
    if (!u.grounded) { if (isHuman(u)) toastDeny('空中不能飞步'); return false; }
    if (!u.items || u.items.leap <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.leap) { if (isHuman(u)) toastDeny('体力不足'); return false; }
    let dir = facingOf(u);
    if (isHuman(u)) {
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
    if (!u.items || u.items.warp <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.warp) { if (isHuman(u)) toastDeny('体力不足'); return false; }
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
    if (!u.items || u.items.neon <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
    G.neonOn = !G.neonOn;
    toast(G.neonOn ? '霓弹 · 本发' : '卸下霓弹', false, G.neonOn);
    syncHud();
    return true;
  }

  function spinWindArrow() {
    G.windSpinT = 0.55;
    if (REDUCE || !windArr) return;
    windArr.classList.remove('spin');
    void windArr.offsetWidth;
    windArr.classList.add('spin');
  }

  function reverseWind() {
    G.wind = -(G.wind || 0);
    spinWindArrow();
  }

  function useNixi(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (u.frozen) return false;
    if (!u.items || (u.items.nixi | 0) <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.nixi) { if (isHuman(u)) toastDeny('体力不足'); return false; }
    if (!G.wind) { if (isHuman(u)) toastDeny('无风'); return false; }
    u.items.nixi -= 1;
    u.stam -= ITEM_COST.nixi;
    reverseWind();
    toast('逆息', false, true);
    audio.ensure();
    audio.beep(240, 0.1, 'sine', 0.04, 620);
    audio.beep(520, 0.14, 'triangle', 0.03, 180);
    burst(u.x, u.y, GOLD, 8, 80, 0.22);
    kick(2.4);
    syncHud();
    return true;
  }

  function aiWantNixi(from, score) {
    if (!from || !from.items || (from.items.nixi | 0) <= 0) return false;
    if ((from.stam || 0) < ITEM_COST.nixi) return false;
    if (Math.abs(G.wind) < NIXI_WIND) return false;
    if (score >= NIXI_MISS) return false;
    const old = G.wind;
    G.wind = -old;
    const rev = solveAI(from).score;
    G.wind = old;
    return rev > score + 400;
  }

  function veilCovering(x, y) {
    const list = G.veils;
    if (!list || !list.length) return null;
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      if (hypot(x - v.x, y - v.y) <= (v.r || VEIL_R)) return v;
    }
    return null;
  }

  function inVeil(x, y) {
    return !!veilCovering(x, y);
  }

  function hideAssistLand(viewer, x, y) {
    const v = veilCovering(x, y);
    if (!v || !viewer) return false;
    return v.side !== viewer.side;
  }

  function veilAimMul(to) {
    if (!to || !inVeil(to.x, to.y)) return 1;
    return 1 + VEIL_ERR;
  }

  function useVeil(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (u.frozen) return false;
    if (!u.items || (u.items.veil | 0) <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
    if (u.stam < ITEM_COST.veil) { if (isHuman(u)) toastDeny('体力不足'); return false; }
    u.items.veil -= 1;
    u.stam -= ITEM_COST.veil;
    G.veils = G.veils || [];
    G.veils.push({ x: u.x, y: u.y, r: VEIL_R, side: u.side, owner: u.id, wait: 1 });
    toast('障幕', false, 'ice');
    audio.ensure();
    audio.beep(180, 0.16, 'sine', 0.036, 90);
    audio.beep(420, 0.18, 'triangle', 0.022, 220);
    burst(u.x, u.y, CYN, REDUCE ? 6 : 14, 70, 0.32);
    ringAt(u.x, u.y, CYN, 28);
    syncHud();
    return true;
  }

  function tickVeils(actor) {
    const list = G.veils;
    if (!list || !list.length || !actor) return;
    const keep = [];
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      const oppose = G.kind === 'drill' ? true : (actor.side !== v.side);
      if (!oppose) {
        keep.push(v);
        continue;
      }
      v.wait = (v.wait | 0) - 1;
      if (v.wait > 0) keep.push(v);
    }
    G.veils = keep;
  }

  function continueAfterAction() {
    const actor = curUnit();
    tickVeils(actor);
    if (G.kind === 'drill') beginTurn('p');
    else if (isSquad()) {
      applyActDelay(actor);
      beginTurn(pickNextId());
    } else beginTurn(G.turn === 'p' ? 'f' : 'p');
  }

  function aiWantVeil(from) {
    if (!from || !from.items || (from.items.veil | 0) <= 0) return false;
    if ((from.stam || 0) < ITEM_COST.veil) return false;
    if ((from.hp || 0) >= VEIL_HP) return false;
    const foe = otherUnit(from);
    if (!foe) return false;
    return Math.abs(from.x - foe.x) < VEIL_GRIDS * GRID;
  }

  function useDrum(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    if (!u.items || u.items.drum <= 0) { if (isHuman(u)) toastDeny('本局已用完'); return false; }
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
    if ((u.rage || 0) < 100) { if (isHuman(u)) toastDeny('怒气未满'); return false; }
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
    if (!humanTurn()) return;
    const u = curUnit();
    if (u && u.ult) u.ult = false;
    G.neonOn = false;
    G.combo = 0;
    G.charging = false;
    G.actDelay = { skip: true, wepId: 0, ult: false };
    audio.chargeStop();
    toast('跳过', false, false);
    G.phase = 'settle';
    G.settleT = 0.10;
    tickFires();
    syncHud();
  }

  function onItem(id) {
    if (G.mode !== 'play') return;
    if (!humanTurn()) return;
    const u = curUnit();
    if (id === 'leap') useLeap(u);
    else if (id === 'warp') {
      if (G.busy === 'warpAim') confirmWarp(u);
      else beginWarp(u);
    } else if (id === 'neon') toggleNeon(u);
    else if (id === 'drum') useDrum(u);
    else if (id === 'nixi') useNixi(u);
    else if (id === 'veil') useVeil(u);
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
      audio.thump();
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

  function pickAIWeapon(from) {
    from = from || curUnit() || G.f;
    const foes = foesOf(from);
    const foe = foes[0] || otherUnit(from) || G.p;
    if (foe) {
      if (thinLedge(foe) || pitDepth(foe) > 16) return 3;
      if (G.mapId === 'bridge' && liveBridge(foe.x)) return 3;
      if (G.mapId === 'forge' && isForgeCrust(foe.x) && !isDeathVoid(foe.x)) return 3;
      if (G.mapId === 'arcade' && liveArcade(foe.x)) return 3;
      if (G.mapId === 'towers' && isTowersLedge(foe.x)) return 3;
    }
    if (Math.abs(G.wind) >= 4) return 4;
    if (G.mapId === 'canyon') return 2;
    if (G.mapId === 'ruins' && from && foe && coverBetween(from, foe)) return 1;
    if (G.mapId === 'towers' && from && foe && coverBetween(from, foe)) return 2;
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

  function scoreOne(imp, wep, from, t) {
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
    if (G.mapId === 'ruins' && (wep.id === 1 || wep.id === 4) && inWall(imp.x, imp.y)) bury += 600;
    if (G.mapId === 'forge' && isForgeCrust(imp.x) && G.H && G.H[imp.x | 0] < FORGE_VOID - 20) bury += 900;
    if (G.mapId === 'arcade' && liveArcade(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 800;
    if (G.mapId === 'towers' && inWall(imp.x, imp.y) && (wep.id === 1 || wep.id === 4)) bury += 600;
    if (G.mapId === 'towers' && inWall(imp.x, imp.y) && wep.id === 2) bury += 500;
    score += bury;
    return score;
  }

  function scoreImpact(imp, wep, from) {
    if (!imp || !from) return -1e9;
    const foes = foesOf(from);
    if (!foes.length) return -1e9;
    let score = -1e9;
    for (let i = 0; i < foes.length; i++) {
      const sc = scoreOne(imp, wep, from, foes[i]);
      if (sc > score) score = sc;
    }
    const selfD = hypot(imp.x - from.x, imp.y - from.y);
    if (selfD < wep.splash * 0.45) {
      const fall = Math.pow(1 - selfD / wep.splash, 1.1);
      const spl = wep.direct * 0.72 * fall * dmgMul();
      if (from.hp <= spl) score -= 20000;
    }
    const mates = allUnits();
    for (let i = 0; i < mates.length; i++) {
      const m = mates[i];
      if (!m || m === from || m.hp <= 0 || m.side !== from.side) continue;
      const md = hypot(imp.x - m.x, imp.y - m.y);
      if (imp.hit === m) score -= 8000;
      else if (md < wep.splash * 0.5) score -= 2500;
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
      if (wallBlocksWalk(nx, groundAt(nx) - from.r, from.r)) continue;
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
    const foe = otherUnit(from) || G.p;
    if (!foe) return 0;
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
    const from = curUnit() || G.f;
    G.wep = pickAIWeapon(from);
    G.neonOn = false;
    syncWeps();
    const plan = { drum: false, warp: 0, leap: 0, neon: false, ult: false, nixi: false, veil: false };
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
      const threat = otherUnit(from) || G.p;
      if (G.kind === 'core' && from.hp <= 18 && threat && threat.rage >= 80) {
        leapDir = from.x < threat.x ? -1 : 1;
      }
      if (G.sudden) {
        if (from.x > G.safeR - 28 && !isDeathVoid(from.x - LEAP_DX)) leapDir = -1;
        else if (from.x < G.safeL + 28 && !isDeathVoid(from.x + LEAP_DX)) leapDir = 1;
      }
      plan.leap = leapDir;
    }
    const moved = planAIMove(from);
    let best = moved.best;
    if (aiWantNixi(from, best.score)) plan.nixi = true;
    if (aiWantVeil(from)) plan.veil = true;
    const mark = otherUnit(from) || G.p;
    if (from.items && from.items.neon > 0 && G.turns - G.aiLastNeonTurn >= 2 && mark && mark.hp > 12 && best.score >= 4000) {
      const lead = from.hp - mark.hp >= 15;
      const breakRage = mark.rage >= 80;
      const ledge = thinLedge(mark);
      if (lead || breakRage || ledge) plan.neon = true;
    }
    if ((from.rage >= 100 || (plan.drum && from.rage + 50 >= 100)) && best.score >= 5000) plan.ult = true;
    const loose = G.kind === 'core' ? 0 : 1;
    const fogK = veilAimMul(mark);
    const aj = (loose ? 3 : 1.5) * fogK;
    const pj = (loose ? 4 : 2) * fogK;
    best.ang = clamp(best.ang + rand(-aj, aj), 5, 175);
    let toasted = false;
    if (Math.abs(elev(best.ang) - 65) <= 8) {
      const jit = rand(0.05, 0.08) * fogK * (Math.random() < 0.5 ? -1 : 1);
      best.pow = clamp(best.pow * (1 + jit), 16, 100);
      if (Math.random() < 0.16) {
        toast((from.name || '烬丸') + '补角', false, false);
        toasted = true;
      }
    } else {
      best.pow = clamp(best.pow + rand(-pj, pj), 16, 100);
    }
    if (!toasted && Math.random() < 0.10 && best.score >= 4000) toast((from.name || '烬丸') + '冷笑', false, true);
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
    const u = curUnit();
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
      if (plan.nixi) {
        useNixi(u);
        plan.nixi = false;
        const moved = planAIMove(u);
        AI.walkTo = moved.walkTo;
        AI.ang = moved.best.ang;
        AI.pow = moved.best.pow;
        AI.score = moved.best.score;
        AI.wait = 0.16;
        return;
      }
      if (plan.veil) {
        useVeil(u);
        plan.veil = false;
        AI.walkTo = u.x;
        AI.wait = 0.16;
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
      const plan = AI.plan || {};
      if (plan.nixi) {
        useNixi(u);
        plan.nixi = false;
      }
      if (plan.veil) {
        useVeil(u);
        plan.veil = false;
        AI.walkTo = u.x;
        const aimed = planAIMove(u);
        AI.ang = aimed.best.ang;
        AI.pow = aimed.best.pow;
        AI.score = aimed.best.score;
        AI.stage = 0;
        AI.wait = 0.12;
        return;
      }
      const moved = planAIMove(u);
      AI.walkTo = moved.walkTo;
      AI.ang = moved.best.ang;
      AI.pow = moved.best.pow;
      AI.score = moved.best.score;
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
        const nx = clamp(u.x + dir * step, lo, hi);
        if (wallBlocksWalk(nx, u.y, u.r)) {
          AI.stage = 2;
          AI.wait = 0.08;
          return;
        }
        u.x = nx;
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
    if (!humanTurn() || G.phase !== 'aim' || G.busy) return;
    const u = curUnit();
    if (!u) return;
    let dir = 0;
    if (keys.l || padHold.l) dir -= 1;
    if (keys.r || padHold.r) dir += 1;
    if (!dir || G.walk <= 0 || u.stam <= 0) return;
    if (walkBlocked(u)) {
      if (G.toastT <= 0.2) toast('埋了 · 飞步或影挪', true, false);
      return;
    }
    const step = Math.min(G.walk, u.stam, 90 * dt);
    const nx = clamp(u.x + dir * step, 22, VW - 22);
    if (wallBlocksWalk(nx, u.y, u.r)) return;
    u.x = nx;
    G.walk -= step;
    u.stam -= step;
    u.face = dir;
    u.walkT = 0.12;
    ungroundIfAir(u);
  }

  function aimPlayer(dt) {
    if (!humanTurn() || G.busy || (G.phase !== 'aim' && G.phase !== 'charge')) return;
    const u = curUnit();
    if (!u) return;
    let dir = 0;
    if (keys.u || padHold.u) dir += 1;
    if (keys.d || padHold.d) dir -= 1;
    if (!dir) return;
    u.ang = clamp(u.ang + dir * 70 * dt, 0, 180);
  }

  function assistSnap(dt) {
    if ((G.assist | 0) < 3 || !humanTurn() || G.busy) return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    const from = curUnit();
    const to = otherUnit(from);
    if (!from || !to) return;
    const tip = schoolTips(from, to);
    const holdAng = keys.u || keys.d || padHold.u || padHold.d;
    if (!holdAng && Math.abs(from.ang - tip.ang65) <= 3) {
      from.ang = clamp(approach(from.ang, tip.ang65, 40 * dt), 0, 180);
    }
  }

  function applyCharge(dt) {
    const rate = (100 - TAP_POW) / CHARGE_T;
    const from = curUnit();
    const to = otherUnit(from);
    if ((G.assist | 0) >= 3 && from && to) {
      const tip = schoolTips(from, to);
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
    buildWalls(G.mapId, G.H);
    G.fires = [];
    crumbs.length = 0;
    terrainDirty = true;
    G.p = makeUnit('p', { id: 'p', name: '岚丸', delay: 0, ord: 0, slot: 0 });
    G.f = makeUnit('f', { id: 'f', name: G.kind === 'drill' ? '石俑' : '烬丸', delay: isSquad() ? 8 : 0, ord: 1, slot: 0 });
    if (isSquad()) {
      G.p2 = makeUnit('p', { id: 'p2', name: '霜丸', delay: 16, ord: 2, slot: 1 });
      G.f2 = makeUnit('f', { id: 'f2', name: '霆丸', delay: 24, ord: 3, slot: 1, ai: isDuo() });
    } else {
      G.p2 = null;
      G.f2 = null;
    }
    G.actDelay = { skip: false, wepId: 0, ult: false };
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
    G.fruits = [];
    G.veils = [];
    G.lastHit = null;
    G.ctrlSide = null;
    G.windSpinT = 0;
    G.nextWind = null;
    G.teaseWind = false;
    if (windArr) windArr.classList.remove('spin');
  }

  function startGame(kind) {
    if (kind === 'drill') G.kind = 'drill';
    else if (kind === 'core') { G.kind = 'core'; G.lastKind = 'core'; }
    else if (kind === 'seat') G.kind = 'seat';
    else if (kind === 'duo') G.kind = 'duo';
    else if (kind === 'quad') G.kind = 'quad';
    else { G.kind = 'hall'; G.lastKind = 'hall'; }
    G.mode = 'play';
    resetWorld();
    hideOverlay();
    audio.start();
    beginTurn(isSquad() ? pickNextId() : 'p');
    const msg = G.kind === 'core' ? '堂核 · 薄血狂风'
      : G.kind === 'drill' ? '演习场 · 对着表练'
      : G.kind === 'seat' ? '对坐 · 岚丸先手'
      : isDuo() ? '对堂 · 岚霜出手'
      : isQuad() ? '堂座 · 把键盘给岚丸'
      : '弹堂 · 看风拉角';
    if (!isSquad()) toast(msg + ' · ' + MAP_NAME[G.mapId], G.kind === 'core', G.kind !== 'core');
    saveBest();
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
    setHint('1 / 回车 / 空格 弹堂 · 2 堂核 · 3 演习场 · 4 对坐 · 5 对堂 · 6 堂座 · 点地图换地形 · H 辅助 · N 地条');
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

  function pickRandomMap() {
    if (!MAP_IDS.length) return;
    let id = MAP_IDS[irand(0, MAP_IDS.length - 1)];
    if (id === G.mapId && MAP_IDS.length > 1) {
      id = MAP_IDS[irand(0, MAP_IDS.length - 1)];
      if (id === G.mapId) {
        const i = MAP_IDS.indexOf(G.mapId);
        id = MAP_IDS[(i + 1 + irand(0, MAP_IDS.length - 2)) % MAP_IDS.length];
      }
    }
    setMap(id);
    toast(MAP_NAME[id] || '随图', false, true);
  }

  function setWep(n) {
    n = n | 0;
    if (n < 0 || n >= WEPS.length) return;
    if (G.mode === 'play' && G.phase !== 'aim' && G.phase !== 'charge') return;
    G.wep = n;
    const actor = curUnit();
    if (actor && G.mode === 'play') actor.wep = n;
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
    for (let i = crumbs.length - 1; i >= 0; i--) {
      const q = crumbs[i];
      q.vy += q.g * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.life -= dt;
      const gy = groundAt(q.x);
      if (q.y >= gy) {
        landDust(q.x, gy);
        crumbs.splice(i, 1);
      } else if (q.life <= 0) {
        crumbs.splice(i, 1);
      }
    }
  }

  function landDust(x, y) {
    burst(x, y, DIRT, REDUCE ? 3 : 8, 90, 0.32);
    const extra = REDUCE ? 1 : 4;
    for (let i = 0; i < extra; i++) {
      particles.push({
        x: x + rand(-8, 8),
        y: y + rand(-2, 4),
        vx: rand(-70, 70),
        vy: rand(-50, 20),
        g: 380,
        life: 0.38,
        max: 0.38,
        r: rand(1.4, 3.4),
        rgb: DIRT
      });
    }
  }

  function update(dt) {
    G.clock += dt;
    G.t += dt;
    if (G.windSpinT > 0) {
      G.windSpinT -= dt;
      if (G.windSpinT <= 0) {
        G.windSpinT = 0;
        if (windArr) windArr.classList.remove('spin');
      }
    }
    updateFx(dt);
    if (G.stop > 0) {
      G.stop -= dt;
      return;
    }
    eachUnit(function (u) { stepUnitPhys(u, dt); });
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
      if (checkEnd()) return;
      const actor = curUnit();
      if (isSquad() && actor && actor.hp <= 0 && G.phase !== 'frozenWait') {
        beginTurn(pickNextId());
        return;
      }
    }
    if (G.mode === 'title') {
      eachUnit(function (u, i) {
        const wob = 6;
        u.ang = (u.side === 'p' ? 65 : 115) + Math.sin(G.t * (0.55 + (u.ord || 0) * 0.12) + (u.ord || 0)) * wob;
      });
      return;
    }
    if (G.mode !== 'play') return;

    if (G.phase === 'frozenWait') {
      G.frozenT -= dt;
      if (G.frozenT <= 0) {
        continueAfterAction();
      }
      return;
    }
    if (G.busy === 'leap') stepLeap(dt);
    if (G.phase === 'aim' || G.phase === 'charge') {
      G.timeout -= dt;
      if (G.timeout <= 0 && !G.busy) {
        G.power = 50;
        fire(curUnit());
        toast('超时 · 半力打出', true, false);
        return;
      }
      if (humanTurn()) {
        if (!G.busy) {
          walkPlayer(dt);
          aimPlayer(dt);
          assistSnap(dt);
        }
        if (G.phase === 'charge' && !G.busy) {
          applyCharge(dt);
          audio.chargeTick(G.power);
        }
        if ((G.kind === 'seat' || isSquad()) && (G.phase === 'aim' || G.phase === 'charge')) setCamShooter(curUnit());
      } else if (G.kind !== 'drill' && !isQuad()) {
        stepAI(dt);
      }
      syncHud();
    } else if (G.phase === 'fly') {
      stepShot(dt);
    } else if (G.phase === 'settle') {
      eachUnit(refreshBury);
      G.settleT -= dt;
      if (G.settleT < 0.12) {
        if (G.kind === 'seat' || isSquad()) setCamShooter(peekNext());
        else setCamFighters();
      }
      if (G.settleT <= 0 && unitsSettled()) {
        if (checkEnd()) return;
        continueAfterAction();
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
    const top = G.mapId === 'canyon' ? '#5ad6ff' : G.mapId === 'twin' ? '#ffe36b' : G.mapId === 'spire' ? '#9af0ff' : G.mapId === 'bridge' ? '#e8c090' : G.mapId === 'isles' ? '#c8f0ff' : G.mapId === 'ruins' ? '#e0c090' : G.mapId === 'vale' ? '#7cf6ff' : G.mapId === 'forge' ? '#ff8a40' : G.mapId === 'arcade' ? '#e4d2a8' : G.mapId === 'towers' ? '#d8c4a0' : '#7dffc6';
    const mid = G.mapId === 'canyon' ? '#2a1a48' : G.mapId === 'twin' ? '#2a1840' : G.mapId === 'spire' ? '#143044' : G.mapId === 'bridge' ? '#2a2018' : G.mapId === 'isles' ? '#182438' : G.mapId === 'ruins' ? '#2a1c18' : G.mapId === 'vale' ? '#142038' : G.mapId === 'forge' ? '#3a140c' : G.mapId === 'arcade' ? '#241c18' : G.mapId === 'towers' ? '#221810' : '#162436';
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
    if (G.mapId === 'forge') {
      g.save();
      g.globalCompositeOperation = 'destination-out';
      for (let x = 0; x < VW; x++) {
        if (H[x] >= FORGE_VOID - 8) {
          g.fillRect(x, 0, 1, VH);
        } else {
          const thick = (x >= FORGE_C0 && x <= FORGE_C1) ? FORGE_THICK : FORGE_PAD_THICK;
          const holeY = H[x] + thick;
          const holeH = Math.max(0, VH - holeY);
          if (holeH > 4) g.fillRect(x, holeY, 1, holeH);
        }
      }
      g.restore();
      const lava = g.createLinearGradient(0, 318, 0, VH);
      lava.addColorStop(0, 'rgba(255,90,24,0.12)');
      lava.addColorStop(0.12, 'rgba(255,80,20,0.55)');
      lava.addColorStop(0.38, '#c42810');
      lava.addColorStop(0.74, '#6a1008');
      lava.addColorStop(1, '#1a0608');
      g.fillStyle = lava;
      g.fillRect(0, 318, VW, VH - 318);
      g.fillStyle = 'rgba(255,170,50,0.32)';
      for (let x = 0; x < VW; x += 3) {
        const y = 332 + Math.sin(x * 0.07) * 6 + Math.sin(x * 0.19) * 3;
        g.fillRect(x, y, 3, 4);
      }
    }
    if (G.mapId === 'arcade') {
      g.save();
      g.globalCompositeOperation = 'destination-out';
      for (let x = 0; x < VW; x++) {
        if (H[x] >= ARCADE_VOID - 8) {
          g.fillRect(x, 0, 1, VH);
        } else {
          const thick = (x >= ARCADE_A0 && x <= ARCADE_A1) ? ARCADE_THICK : ARCADE_PAD_THICK;
          const holeY = H[x] + thick;
          const holeH = Math.max(0, VH - holeY);
          if (holeH > 4) g.fillRect(x, holeY, 1, holeH);
        }
      }
      g.restore();
      const pit = g.createLinearGradient(0, 300, 0, VH);
      pit.addColorStop(0, 'rgba(8,6,16,0.08)');
      pit.addColorStop(0.18, 'rgba(12,8,22,0.55)');
      pit.addColorStop(0.55, '#0c0816');
      pit.addColorStop(1, '#06040c');
      g.fillStyle = pit;
      g.fillRect(ARCADE_A0, 300, ARCADE_A1 - ARCADE_A0 + 1, VH - 300);
      g.strokeStyle = 'rgba(228,210,168,0.50)';
      g.lineWidth = 1.4;
      g.beginPath();
      let drawing = false;
      for (let x = ARCADE_A0; x <= ARCADE_A1; x++) {
        if (H[x] >= ARCADE_VOID - 20) {
          if (drawing) { g.stroke(); drawing = false; }
          continue;
        }
        const yb = H[x] + ARCADE_THICK;
        if (!drawing) { g.beginPath(); g.moveTo(x, yb); drawing = true; }
        else g.lineTo(x, yb);
      }
      if (drawing) g.stroke();
    }
    if (G.mapId === 'towers') {
      g.fillStyle = 'rgba(12,8,18,0.28)';
      g.fillRect(TOWERS_L_INNER, TOWERS_LEDGE_Y + 8, TOWERS_GAP, VH - TOWERS_LEDGE_Y - 8);
      g.strokeStyle = 'rgba(216,196,160,0.42)';
      g.lineWidth = 1.3;
      g.beginPath();
      g.moveTo(TOWERS_L_INNER, H[TOWERS_L_INNER]);
      for (let x = TOWERS_L_INNER; x <= TOWERS_R_INNER; x++) g.lineTo(x, H[x]);
      g.stroke();
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
    if (G.mapId === 'forge') {
      const heat = g.createRadialGradient(480, VH, 20, 480, VH, 340);
      heat.addColorStop(0, 'rgba(255,80,20,0.22)');
      heat.addColorStop(1, 'rgba(255,80,20,0)');
      g.fillStyle = heat;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'vale') {
      const lift = g.createRadialGradient(VALE_MID, 220, 10, VALE_MID, 240, 200);
      lift.addColorStop(0, 'rgba(120,240,255,0.12)');
      lift.addColorStop(1, 'rgba(120,240,255,0)');
      g.fillStyle = lift;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'arcade') {
      const mist = g.createRadialGradient(480, VH, 20, 480, VH, 320);
      mist.addColorStop(0, 'rgba(40,24,48,0.28)');
      mist.addColorStop(1, 'rgba(40,24,48,0)');
      g.fillStyle = mist;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'towers') {
      const shade = g.createRadialGradient(480, 360, 20, 480, 400, 280);
      shade.addColorStop(0, 'rgba(24,16,28,0.22)');
      shade.addColorStop(1, 'rgba(24,16,28,0)');
      g.fillStyle = shade;
      g.fillRect(0, 0, VW, VH);
    }
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

  function drawMini() {
    if (!miniCv || !miniCx) return;
    const show = !!G.mini && (G.mode === 'play' || G.mode === 'end');
    miniCv.classList.toggle('gone', !show);
    if (!show) return;
    const g = miniCx;
    const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
    const bw = (MINI_W * dpr) | 0;
    const bh = (MINI_H * dpr) | 0;
    if (miniCv.width !== bw || miniCv.height !== bh) {
      miniCv.width = bw;
      miniCv.height = bh;
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, MINI_W, MINI_H);
    g.fillStyle = 'rgba(8,6,16,0.78)';
    g.fillRect(0, 0, MINI_W, MINI_H);
    if (G.H && G.H.length) {
      g.beginPath();
      g.moveTo(0, MINI_H);
      for (let i = 0; i < MINI_W; i++) {
        const wx = (i / Math.max(1, MINI_W - 1)) * (VW - 1);
        const gy = G.H[wx | 0];
        const my = clamp((gy / VH) * MINI_H, 0, MINI_H);
        if (i === 0) g.lineTo(0, my);
        else g.lineTo(i + 1, my);
      }
      g.lineTo(MINI_W, MINI_H);
      g.closePath();
      g.fillStyle = 'rgba(196,156,112,0.58)';
      g.fill();
      g.strokeStyle = 'rgba(255,227,107,0.42)';
      g.lineWidth = 1;
      g.stroke();
    }
    const units = allUnits();
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (!u) continue;
      const mx = clamp((u.x / VW) * MINI_W, 2, MINI_W - 2);
      const my = clamp((u.y / VH) * MINI_H, 3, MINI_H - 3);
      const rgb = u.side === 'p' ? CYN : MAG;
      const live = u.hp > 0;
      const now = live && u.id === G.turn;
      g.fillStyle = live ? rgba(rgb, now ? 1 : 0.88) : 'rgba(244,238,255,0.22)';
      g.beginPath();
      g.arc(mx, my, live ? (now ? 3.1 : 2.4) : 1.6, 0, TAU);
      g.fill();
      if (now && live) {
        g.strokeStyle = rgba(GOLD, 0.85);
        g.lineWidth = 1;
        g.beginPath();
        g.arc(mx, my, 4.2, 0, TAU);
        g.stroke();
      }
    }
    const veils = G.veils;
    if (veils) {
      for (let i = 0; i < veils.length; i++) {
        const v = veils[i];
        const mx = clamp((v.x / VW) * MINI_W, 2, MINI_W - 2);
        const my = clamp((v.y / VH) * MINI_H, 3, MINI_H - 3);
        const rr = Math.max(3.2, (v.r / VW) * MINI_W);
        g.strokeStyle = 'rgba(0,232,255,0.55)';
        g.lineWidth = 1;
        g.beginPath();
        g.arc(mx, my, rr, 0, TAU);
        g.stroke();
        g.fillStyle = 'rgba(0,232,255,0.12)';
        g.fill();
      }
    }
  }

  function drawWind(g) {
    if (!G.wind && !(G.windSpinT > 0)) return;
    g.save();
    g.globalAlpha = 0.35;
    const mag = Math.abs(G.wind) || 1;
    const dir = G.wind >= 0 ? 1 : -1;
    const n = Math.min(10, 3 + mag);
    const spin = (!REDUCE && G.windSpinT > 0) ? (1 - G.windSpinT / 0.55) * TAU : 0;
    for (let i = 0; i < n; i++) {
      const y = 70 + i * 28 + (G.t * 30 * dir + i * 13) % 20;
      const x = ((G.t * (40 + mag * 8) * dir) + i * 90) % (VW + 80) - 40;
      const len = 18 + mag;
      g.strokeStyle = rgba(GOLD, 0.45);
      g.lineWidth = 1.2;
      g.save();
      g.translate(x + dir * len * 0.5, y);
      if (spin) g.rotate(spin);
      g.beginPath();
      g.moveTo(-dir * len * 0.5, 0);
      g.lineTo(dir * len * 0.5, 0);
      g.stroke();
      g.restore();
    }
    g.restore();
  }

  function drawWalls(g) {
    if (!G.walls || !G.walls.length) return;
    g.save();
    for (let w = 0; w < G.walls.length; w++) {
      const wall = G.walls[w];
      const ww = wall.x1 - wall.x0 + 1;
      for (let i = 0; i < ww; i++) {
        const x = wall.x0 + i;
        const top = wall.tops[i];
        const bot = wall.bots[i];
        let run = -1;
        for (let y = top; y <= bot; y++) {
          const ly = y - top;
          const solid = y < bot && ly >= 0 && ly < WALL_MAXH && wall.mask[i * WALL_MAXH + ly];
          if (solid) {
            if (run < 0) run = y;
          } else if (run >= 0) {
            const h = y - run;
            g.fillStyle = '#3a2a22';
            g.fillRect(x, run, 1, h);
            g.fillStyle = 'rgba(224,192,144,0.55)';
            g.fillRect(x, run, 1, Math.min(3, h));
            run = -1;
          }
        }
      }
    }
    g.restore();
  }

  function drawFires(g) {
    if (!G.fires || !G.fires.length) return;
    g.save();
    for (let i = 0; i < G.fires.length; i++) {
      const f = G.fires[i];
      const flick = 0.55 + 0.35 * Math.sin(G.t * 9 + i * 2.1);
      g.fillStyle = 'rgba(255,80,24,' + (0.22 + flick * 0.18) + ')';
      g.beginPath();
      g.ellipse(f.x, f.y + 2, f.r, f.r * 0.38, 0, 0, TAU);
      g.fill();
      g.strokeStyle = 'rgba(255,180,70,' + (0.4 + flick * 0.35) + ')';
      g.lineWidth = 1.4;
      g.beginPath();
      g.ellipse(f.x, f.y + 2, f.r, f.r * 0.38, 0, 0, TAU);
      g.stroke();
      for (let k = 0; k < 5; k++) {
        const a = (G.t * 2.4 + k * 1.3 + i) % TAU;
        const px = f.x + Math.cos(a) * (6 + (k * 4) % 18);
        const py = f.y - ((G.t * 38 + k * 11) % 22);
        g.fillStyle = 'rgba(255,170,60,' + (0.35 + 0.3 * Math.sin(G.t * 8 + k)) + ')';
        g.fillRect(px, py, 2.2, 4 + (k % 3));
      }
    }
    g.restore();
  }

  function drawCrumbs(g) {
    for (let i = 0; i < crumbs.length; i++) {
      const q = crumbs[i];
      g.fillStyle = rgba(q.rgb, clamp(q.life / 1.8, 0.25, 0.95));
      g.beginPath();
      g.arc(q.x, q.y, q.r, 0, TAU);
      g.fill();
    }
  }

  function drawClock(g) {
    if (G.mode !== 'play') return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    if (G.timeout > 5) return;
    const n = Math.max(0, Math.ceil(G.timeout));
    const pulse = REDUCE ? 1 : 1 + 0.14 * Math.sin(G.t * 11);
    g.save();
    g.translate(VW * 0.5, 34);
    g.scale(pulse, pulse);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = rgba(MAG, 0.92);
    g.font = 'bold 26px Segoe UI, PingFang SC, sans-serif';
    g.shadowColor = 'rgba(255,61,184,0.55)';
    g.shadowBlur = 12;
    g.fillText(String(n), 0, 0);
    g.restore();
  }

  function drawGust(g) {
    if (G.mapId !== 'spire' && G.mapId !== 'vale') return;
    const mid = G.mapId === 'vale' ? VALE_MID : GUST_MID;
    const hw = G.mapId === 'vale' ? VALE_HW : GUST_HW;
    const strong = G.mapId === 'vale';
    g.save();
    const veil = g.createLinearGradient(mid - hw, 0, mid + hw, 0);
    veil.addColorStop(0, 'rgba(154,240,255,0)');
    veil.addColorStop(0.5, strong ? 'rgba(154,240,255,0.16)' : 'rgba(154,240,255,0.10)');
    veil.addColorStop(1, 'rgba(154,240,255,0)');
    g.fillStyle = veil;
    g.fillRect(mid - hw, 0, hw * 2, VH);
    const n = strong ? 26 : 18;
    for (let i = 0; i < n; i++) {
      const span = hw * 2;
      const x = mid - hw + ((i * 41 + G.t * (strong ? 36 : 28)) % span);
      const y = VH - 40 - ((G.t * (strong ? 110 : 78) + i * 31) % (VH - 60));
      const a = (strong ? 0.22 : 0.16) + 0.14 * Math.sin(G.t * 3.2 + i);
      g.fillStyle = 'rgba(180,244,255,' + a + ')';
      g.fillRect(x, y, strong ? 2.6 : 2.2, (strong ? 14 : 11) + (i % 4) * 3);
    }
    g.restore();
  }

  function drawArcade(g) {
    if (G.mapId !== 'arcade') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 10; i++) {
      const x = ARCADE_A0 + 24 + i * 44 + Math.sin(t * 0.7 + i) * 10;
      const y = 348 + Math.sin(t * 1.1 + i * 0.8) * 8;
      g.fillStyle = 'rgba(40,24,56,' + (0.10 + 0.10 * Math.sin(t * 1.6 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 36 + (i % 3) * 10, 8, 0, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 6; k++) {
      const px = ARCADE_A0 + 40 + k * 72;
      const glow = 0.10 + 0.08 * (0.5 + 0.5 * Math.sin(t * 2.2 + k));
      g.fillStyle = 'rgba(255,210,120,' + glow + ')';
      g.beginPath();
      g.arc(px, 332, 5, 0, TAU);
      g.fill();
    }
    g.restore();
  }

  function drawTowers(g) {
    if (G.mapId !== 'towers') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 8; i++) {
      const x = TOWERS_L_INNER + 16 + i * 22 + Math.sin(t * 0.6 + i) * 8;
      const y = TOWERS_YARD_Y - 18 + Math.sin(t * 0.9 + i * 0.7) * 6;
      g.fillStyle = 'rgba(32,22,40,' + (0.08 + 0.08 * Math.sin(t * 1.4 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 22 + (i % 3) * 6, 6, 0, 0, TAU);
      g.fill();
    }
    g.restore();
  }

  function drawLava(g) {
    if (G.mapId !== 'forge') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 14; i++) {
      const x = 40 + i * 66 + Math.sin(t * 1.4 + i) * 18;
      const y = 338 + Math.sin(t * 2.1 + i * 0.7) * 7;
      g.fillStyle = 'rgba(255,' + (110 + ((i * 17) % 80)) + ',30,' + (0.16 + 0.12 * Math.sin(t * 3 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 28 + (i % 3) * 8, 6, 0, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 10; k++) {
      const px = 80 + ((k * 97 + t * 40) % 800);
      const py = 352 - ((t * 28 + k * 19) % 36);
      g.fillStyle = 'rgba(255,190,70,' + (0.22 + 0.2 * Math.sin(t * 6 + k)) + ')';
      g.fillRect(px, py, 2, 5 + (k % 3));
    }
    g.restore();
  }

  function drawProcUnit(g, u) {
    const rgb = unitRgb(u);
    g.save();
    g.translate(u.x, u.y + Math.sin(u.bob) * 1.4);
    if (u.hitT > 0) g.translate(rand(-2, 2), 0);
    const inhabit = isSquad() && G.mode === 'play' && curUnit() === u && isHuman(u)
      && (G.phase === 'aim' || G.phase === 'charge');
    g.fillStyle = rgba(rgb, inhabit ? 0.42 : 0.18);
    g.beginPath();
    g.arc(0, 2, inhabit ? 18 : 16, 0, TAU);
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
    g.fillStyle = u.side === 'p' ? '#083038' : '#380818';
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
      else if (G.phase === 'charge' && curUnit() === u) fr = heroFrames[1 * 6 + 2];
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
    const inhabit = isSquad() && G.mode === 'play' && curUnit() === u && isHuman(u)
      && (G.phase === 'aim' || G.phase === 'charge');
    if (u.id === 'p2' || u.id === 'f2' || inhabit) {
      g.fillStyle = rgba(unitRgb(u), inhabit ? 0.46 : 0.28);
      g.beginPath();
      g.ellipse(0, 2, inhabit ? 18 : 15, inhabit ? 21 : 18, 0, 0, TAU);
      g.fill();
    }
    g.drawImage(fr, -w * 0.5, -h * 0.62, w, h);
    g.restore();
  }

  function drawCannon(g, u) {
    const th = u.ang * Math.PI / 180;
    const rgb = unitRgb(u);
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
    if (G.mode === 'play' && curUnit() === u && (G.phase === 'aim' || G.phase === 'charge')) {
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
    if (actorGhost() && curUnit() === u && (G.phase === 'aim' || G.phase === 'charge')) {
      const gh = actorGhost().ang * Math.PI / 180;
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
    if (isSquad() && G.mode === 'play' && curUnit() === u && (G.phase === 'aim' || G.phase === 'charge')) {
      const ring = isHuman(u) ? unitRgb(u) : GOLD;
      g.strokeStyle = rgba(ring, 0.88);
      g.lineWidth = isHuman(u) ? 2.2 : 1.6;
      g.beginPath();
      g.arc(u.x, u.y, 22, 0, TAU);
      g.stroke();
    }
  }

  function drawUnitHp(g, u) {
    const w = 28;
    const x = u.x - w * 0.5;
    const y = u.y - 28;
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.fillRect(x, y, w, 4);
    g.fillStyle = rgba(unitRgb(u), 0.95);
    g.fillRect(x, y, w * clamp(u.hp / u.max, 0, 1), 4);
    if (isSquad() && G.mode === 'play') {
      g.font = 'bold 10px Segoe UI, PingFang SC, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'bottom';
      const next = peekNext();
      g.fillStyle = (curUnit() === u || next === u) ? rgba(GOLD, 0.95) : rgba(unitRgb(u), 0.85);
      g.fillText(unitShort(u) + ' ' + Math.round(u.delay || 0), u.x, y - 2);
    }
  }

  function drawShot(g) {
    const s = G.shot;
    if (!s) return;
    const rgb = s.ult ? GOLD : (s.wep && s.wep.id === 3 ? ICE : (s.wep && s.wep.id === 4 ? HOT : (s.wep && s.wep.id === 6 ? FIRE : (s.wep && s.wep.id === 5 ? RAIL : unitRgb(s.owner)))));
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
    g.arc(s.x, s.y, s.wep.id === 1 ? 5.2 : (s.wep.id === 4 ? 4.4 : (s.wep.id === 6 ? 4.2 : (s.wep.id === 5 ? 4.0 : 3.6))), 0, TAU);
    g.fill();
    g.restore();
  }

  function drawFruits(g) {
    const list = G.fruits;
    if (!list || !list.length) return;
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      const bob = REDUCE ? 0 : Math.sin(G.t * 3.4 + f.ph) * 3.2;
      const y = f.y + bob;
      const rgb = f.gold ? GOLD : HOT;
      const glow = REDUCE ? 0.35 : (0.42 + 0.28 * (0.5 + 0.5 * Math.sin(G.t * 4.1 + f.ph)));
      g.save();
      g.shadowColor = rgba(rgb, glow);
      g.shadowBlur = REDUCE ? 8 : 18;
      g.fillStyle = rgba(rgb, 0.92);
      g.beginPath();
      g.arc(f.x, y, f.r, 0, TAU);
      g.fill();
      g.fillStyle = rgba(WHT, 0.55);
      g.beginPath();
      g.arc(f.x - 3.2, y - 3.4, f.r * 0.34, 0, TAU);
      g.fill();
      g.restore();
      g.strokeStyle = rgba(rgb, 0.28 + glow * 0.45);
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(f.x, y, f.r + 3 + glow * 3.2, 0, TAU);
      g.stroke();
    }
  }

  function drawChargeBar(g, u) {
    if (!(G.phase === 'charge' && curUnit() === u)) return;
    const w = 52;
    const x = u.x - w * 0.5;
    const y = u.y + 20;
    g.fillStyle = 'rgba(0,0,0,0.55)';
    g.fillRect(x, y, w, 7);
    const t = G.power / 100;
    g.fillStyle = t > 0.92 ? rgba(GOLD, 1) : rgba(unitRgb(u), 0.95);
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
    const ghost = actorGhost();
    if (!ghost || G.mode !== 'play') return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    const pts = ghost.points;
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

  function drawVeils(g) {
    if (G.mode !== 'play' && G.mode !== 'end') return;
    const list = G.veils;
    if (!list || !list.length) return;
    g.save();
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      const t = G.t || 0;
      const grd = g.createRadialGradient(v.x, v.y, 6, v.x, v.y, v.r);
      grd.addColorStop(0, 'rgba(0,232,255,0.22)');
      grd.addColorStop(0.42, 'rgba(90,220,255,0.16)');
      grd.addColorStop(1, 'rgba(0,232,255,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(v.x, v.y, v.r, 0, TAU);
      g.fill();
      if (REDUCE) continue;
      g.lineWidth = 1.6;
      for (let k = 0; k < 4; k++) {
        const a0 = t * (0.85 + k * 0.18) + k * 1.1;
        g.strokeStyle = 'rgba(0,232,255,' + (0.16 + 0.08 * (k % 2)) + ')';
        g.beginPath();
        g.ellipse(
          v.x + Math.cos(a0) * 7,
          v.y + Math.sin(a0 * 1.25) * 5,
          v.r * (0.36 + (k % 2) * 0.16),
          v.r * 0.20,
          a0,
          0,
          TAU
        );
        g.stroke();
      }
      for (let k = 0; k < 6; k++) {
        const a = t * 1.35 + k * TAU / 6;
        const rr = v.r * (0.32 + 0.30 * (0.5 + 0.5 * Math.sin(t * 1.6 + k)));
        const wx = v.x + Math.cos(a) * rr;
        const wy = v.y + Math.sin(a * 1.12) * rr * 0.7;
        g.fillStyle = 'rgba(170,255,255,' + (0.07 + 0.10 * (0.5 + 0.5 * Math.sin(t * 2.1 + k))) + ')';
        g.beginPath();
        g.arc(wx, wy, 9 + (k % 3) * 3, 0, TAU);
        g.fill();
      }
    }
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
      if (inGround(x, y) || inWall(x, y)) break;
      if (unitAt(x, y, u)) break;
    }
    return { points: pts, len: len };
  }

  function drawPredict(g) {
    if (G.mode !== 'play') return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    if (!humanTurn()) return;
    const lv = G.assist | 0;
    if (lv <= 0) return;
    const u = curUnit();
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
      if (!hideAssistLand(u, land.x, land.y)) {
        const pulse = (!REDUCE && lv >= 2) ? (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(G.t * 4.4))) : 1;
        g.strokeStyle = 'rgba(255,227,107,' + (0.58 + 0.28 * pulse) + ')';
        g.lineWidth = 1.2 + 0.6 * pulse;
        const s = 4.2 + 1.1 * pulse;
        g.beginPath();
        g.moveTo(land.x - s, land.y - s);
        g.lineTo(land.x + s, land.y + s);
        g.moveTo(land.x + s, land.y - s);
        g.lineTo(land.x - s, land.y + s);
        g.stroke();
        g.beginPath();
        g.arc(land.x, land.y, 5.2 + 2.2 * pulse, 0, TAU);
        g.stroke();
      }
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
    drawLava(ctx);
    drawArcade(ctx);
    drawTowers(ctx);
    drawWalls(ctx);
    drawFires(ctx);
    drawCrumbs(ctx);
    drawGust(ctx);
    if (G.sudden) {
      ctx.fillStyle = 'rgba(8, 4, 12, 0.42)';
      if (G.safeL > 0) ctx.fillRect(0, 0, G.safeL, VH);
      if (G.safeR < VW - 1) ctx.fillRect(G.safeR, 0, VW - G.safeR, VH);
    }
    drawRuler(ctx);
    drawGhostPath(ctx);
    drawVeils(ctx);
    drawPredict(ctx);
    drawWarpAim(ctx);
    drawFruits(ctx);

    eachUnit(function (u) {
      if (u.hp <= 0) return;
      drawSpriteUnit(ctx, u);
      drawCannon(ctx, u);
      drawUnitHp(ctx, u);
      drawChargeBar(ctx, u);
    });
    drawShot(ctx);
    drawClock(ctx);

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
    drawMini();
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
    if (k === 'n' || k === 'N') {
      e.preventDefault();
      setMini(!G.mini);
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
      if (k === '4') { startGame('seat'); return; }
      if (k === '5') { startGame('duo'); return; }
      if (k === '6') { startGame('quad'); return; }
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
    if (k === 'b' || k === 'B') { onItem('nixi'); return; }
    if (k === 'g' || k === 'G') { onItem('veil'); return; }
    if (k === 'f' || k === 'F') { onItem('ult'); return; }
    if (k === 'x' || k === 'X') { onItem('skip'); return; }
    if (k === '1') setWep(0);
    if (k === '2') setWep(1);
    if (k === '3') setWep(2);
    if (k === '4') setWep(3);
    if (k === '5') setWep(4);
    if (k === '6') setWep(5);
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
    ok('maps eleven', MAP_IDS.length === 11 && MAP_NAME.spire === '风柱' && MAP_NAME.bridge === '碎桥' && MAP_NAME.isles === '悬岛' && MAP_NAME.ruins === '残垣' && MAP_NAME.vale === '风谷' && MAP_NAME.forge === '熔台' && MAP_NAME.arcade === '廊桥' && MAP_NAME.towers === '双塔');
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

    ok('霓火 stats', WEPS[5] && WEPS[5].name === '霓火' && WEPS[5].id === 6 && WEPS[5].direct === 18 && WEPS[5].splash === 44 && WEPS[5].crater === 20 && WEPS[5].spd === 1);
    ok('霓火 crater < 高爆', WEPS[5].crater < WEPS[1].crater, WEPS[5].crater + ' < ' + WEPS[1].crater);
    ok('fire burn 8', FIRE_DMG === 8 && FIRE_R === 28 && FIRE_LIFE === 2);
    G.kind = 'hall';
    ok('fire tick dmg', Math.round(FIRE_DMG * dmgMul()) === 8);
    ok('fire ult dmg', Math.round(FIRE_DMG * dmgMul() * 1.6) === 13);
    G.fires = [{ x: 152, y: 400, r: FIRE_R, life: 2, ult: false }];
    G.p = { x: 10, y: 10, hp: 0, r: 14 };
    G.f = { x: 10, y: 10, hp: 0, r: 14 };
    tickFires();
    ok('fire life 1 after settle', G.fires.length === 1 && G.fires[0].life === 1);
    tickFires();
    ok('fire gone after 2 settles', G.fires.length === 0);
    G.H = buildHeight('ruins');
    G.mapId = 'ruins';
    buildWalls('ruins', G.H);
    ok('ruins spawn', spawnX('ruins', 'p') === 140 && spawnX('ruins', 'f') === 820);
    ok('ruins height', G.H[140] > 300 && G.H[140] < 480, Math.round(G.H[140]));
    const wl = 308;
    const wr = 652;
    ok('ruins left wall', inWall(wl, G.H[wl] - 40), Math.round(G.H[wl] - 40));
    ok('ruins right wall', inWall(wr, G.H[wr] - 40), Math.round(G.H[wr] - 40));
    ok('ruins mid open', !inWall(480, G.H[480] - 40));
    const holeY = G.H[wl] - 40;
    punchCover(wl, holeY, 28, WEPS[1]);
    ok('ruins punch 高爆', !inWall(wl, holeY));
    G.H = buildHeight('ruins');
    buildWalls('ruins', G.H);
    const still = inWall(wr, G.H[wr] - 40);
    punchCover(wr, G.H[wr] - 40, 20, WEPS[5]);
    ok('霓火 no punch', still && inWall(wr, G.H[wr] - 40));
    G.H = buildHeight('ruins');
    buildWalls('ruins', G.H);
    punchCover(wr, G.H[wr] - 40, 22, WEPS[3]);
    ok('ruins punch 三裂', !inWall(wr, G.H[wr] - 40));
    ok('timeout half still', TURN_T === 20);
    ok('assist keep 0-3', ASSIST_NAME.length === 4 && G.assist === 2);
    ok('g vk locked', GRAV === 260 && VK === 420);
    G.kind = 'seat';
    ok('seat name', kindName() === '对坐');
    ok('seat hp 100', maxHp('p') === 100 && maxHp('f') === 100);
    ok('seat wind 8', windMax() === 8);
    ok('seat dmg x1', dmgMul() === 1);
    ok('seat human 烬丸', isHuman({ side: 'f', stake: false }) === true);
    ok('isSeat', isSeat() === true);
    G.kind = 'hall';
    ok('hall AI 烬丸', isHuman({ side: 'f' }) === false);
    ok('hall human 岚丸', isHuman({ side: 'p' }) === true);
    ok('hall not seat', isSeat() === false);
    ok('assist still default 中', G.assist === 2 && ASSIST_NAME[2] === '中');
    G.H = buildHeight('vale');
    G.mapId = 'vale';
    ok('vale spawn', spawnX('vale', 'p') === 128 && spawnX('vale', 'f') === 832);
    ok('vale spawn safe', G.H[128] > 240 && G.H[128] < 360 && G.H[832] > 240 && G.H[832] < 360, Math.round(G.H[128]) + '/' + Math.round(G.H[832]));
    ok('vale deep V', G.H[480] > G.H[128] + 120, Math.round(G.H[480] - G.H[128]));
    ok('vale gust stronger', gustAy(VALE_MID) < GUST_AY && gustAy(VALE_MID) < -180, Math.round(gustAy(VALE_MID)));
    ok('vale gust pad 0', gustAy(128) === 0);
    G.p = { x: 128, y: G.H[128] - 14, r: 14, hp: 100, max: 100, side: 'p', ang: 65 };
    G.f = { x: 832, y: G.H[832] - 14, r: 14, hp: 100, max: 100, side: 'f', ang: 115 };
    const vale65 = traceShot(128, G.p.y - 4, 65, 70, 0, WEPS[0], G.H, G.p);
    ok('vale 65 high toss', vale65.x > 420, Math.round(vale65.x));
    G.mapId = 'spire';
    const spireLift = gustAy(GUST_MID);
    G.mapId = 'vale';
    ok('vale lift > 风柱', gustAy(VALE_MID) < spireLift, Math.round(gustAy(VALE_MID)) + ' < ' + Math.round(spireLift));
    G.H = buildHeight('forge');
    G.mapId = 'forge';
    ok('forge spawn', spawnX('forge', 'p') === 148 && spawnX('forge', 'f') === 812);
    ok('forge pads high', G.H[148] < 320 && G.H[812] < 320, Math.round(G.H[148]) + '/' + Math.round(G.H[812]));
    ok('forge crust thin', G.H[480] > G.H[148] && G.H[480] < FORGE_VOID - 80, Math.round(G.H[480]));
    ok('forge gap void', G.H[270] >= FORGE_VOID - 8, Math.round(G.H[270]));
    ok('forge spawn not void', !isDeathVoid(148) && !isDeathVoid(812));
    ok('forge gap death', isDeathVoid(270));
    const crust0 = G.H[480];
    carve(480, crust0, 22);
    snapForge(480, 22);
    ok('forge snap lava', G.H[480] >= FORGE_VOID - 8, Math.round(G.H[480]));
    ok('forge leap onto crust', FORGE_L1 + LEAP_DX > FORGE_C0 && FORGE_L1 + LEAP_DX < FORGE_C1, FORGE_L1 + LEAP_DX);
    ok('forge leap onto pad', FORGE_C1 + LEAP_DX > FORGE_R0 && FORGE_C1 + LEAP_DX < FORGE_R1, FORGE_C1 + LEAP_DX);
    G.H = buildHeight('arcade');
    G.mapId = 'arcade';
    ok('arcade spawn', spawnX('arcade', 'p') === 140 && spawnX('arcade', 'f') === 820);
    ok('arcade spawn on bank', spawnX('arcade', 'p') < ARCADE_A0 && spawnX('arcade', 'f') > ARCADE_A1);
    ok('arcade pads high', G.H[140] < 340 && G.H[820] < 340, Math.round(G.H[140]) + '/' + Math.round(G.H[820]));
    ok('arcade arch high', G.H[480] < G.H[140] - 80, Math.round(G.H[480]) + ' vs ' + Math.round(G.H[140]));
    ok('arcade arch stand', G.H[480] > 88 && G.H[480] < ARCADE_VOID - 80, Math.round(G.H[480]));
    ok('arcade edge void', G.H[10] >= ARCADE_VOID - 8 && G.H[950] >= ARCADE_VOID - 8);
    ok('arcade spawn not void', !isDeathVoid(140) && !isDeathVoid(820));
    ok('arcade side death', isDeathVoid(10));
    ok('arcade thick punchable', ARCADE_THICK < WEPS[1].crater && ARCADE_THICK > 16, ARCADE_THICK);
    const arch0 = G.H[480];
    carve(480, arch0, 30);
    snapArcade(480, 30, WEPS[0]);
    ok('arcade 普通 no snap', G.H[480] < ARCADE_VOID - 80, Math.round(G.H[480]));
    G.H = buildHeight('arcade');
    G.mapId = 'arcade';
    carve(480, G.H[480], 48);
    snapArcade(480, 48, WEPS[1]);
    ok('arcade 高爆 hole', G.H[480] >= ARCADE_VOID - 8, Math.round(G.H[480]));
    ok('arcade hole death', isDeathVoid(480));
    G.H = buildHeight('arcade');
    G.mapId = 'arcade';
    carveCluster(480, G.H[480], 1);
    snapArcade(480, 22, WEPS[3]);
    ok('arcade 三裂 hole', G.H[480] >= ARCADE_VOID - 8, Math.round(G.H[480]));
    G.H = buildHeight('arcade');
    G.mapId = 'arcade';
    const apx = spawnX('arcade', 'p');
    const apy = G.H[apx | 0] - UNIT_R;
    const th30 = 30 * Math.PI / 180;
    const th65 = 65 * Math.PI / 180;
    const s30 = traceShot(apx + Math.cos(th30) * 18, apy - 4 - Math.sin(th30) * 18, 30, 70, 0, WEPS[0], G.H, null);
    const s65 = traceShot(apx + Math.cos(th65) * 18, apy - 4 - Math.sin(th65) * 18, 65, 70, 0, WEPS[0], G.H, null);
    ok('arcade 30 punch', s30.x > ARCADE_A0 && s30.x < ARCADE_A1 && !s30.air, Math.round(s30.x));
    ok('arcade 65 over', s65.x > ARCADE_A1 && s65.x < ARCADE_R1, Math.round(s65.x));
    G.H = buildHeight('towers');
    G.mapId = 'towers';
    buildWalls('towers', G.H);
    ok('towers spawn', spawnX('towers', 'p') === TOWERS_PX && spawnX('towers', 'f') === TOWERS_FX);
    ok('towers spawn on top', G.H[TOWERS_PX] < 250 && G.H[TOWERS_FX] < 250, Math.round(G.H[TOWERS_PX]) + '/' + Math.round(G.H[TOWERS_FX]));
    ok('towers gap 180', TOWERS_R_INNER - TOWERS_L_INNER === TOWERS_GAP, TOWERS_R_INNER - TOWERS_L_INNER);
    ok('towers yard below', G.H[480] > G.H[TOWERS_PX] + 80, Math.round(G.H[480] - G.H[TOWERS_PX]));
    ok('towers ledge nest', G.H[TOWERS_P2X] > G.H[TOWERS_PX] + 40 && G.H[TOWERS_P2X] < G.H[480] - 40, Math.round(G.H[TOWERS_P2X]));
    ok('towers no void', !isDeathVoid(TOWERS_PX) && !isDeathVoid(TOWERS_FX) && !isDeathVoid(480));
    ok('towers yard landable', G.H[480] < VH - 20, Math.round(G.H[480]));
    const twL = (TOWERS_LW0 + TOWERS_LW1) >> 1;
    const twR = (TOWERS_RW0 + TOWERS_RW1) >> 1;
    ok('towers inner wall', inWall(twL, TOWERS_LEDGE_Y - 40) && inWall(twR, TOWERS_LEDGE_Y - 40));
    ok('towers nest open', !inWall(TOWERS_P2X, G.H[TOWERS_P2X] - 14) && !inWall(TOWERS_F2X, G.H[TOWERS_F2X] - 14));
    const merlonY = TOWERS_TOP_Y - 28;
    ok('towers battlement', inWall(twL, merlonY));
    punchCover(twL, merlonY, 48, WEPS[1]);
    ok('towers 高爆 nibble', !inWall(twL, merlonY));
    G.H = buildHeight('towers');
    buildWalls('towers', G.H);
    const stillMerlon = inWall(twR, merlonY);
    punchCover(twR, merlonY, 30, WEPS[0]);
    ok('towers 普通 no nibble', stillMerlon && inWall(twR, merlonY));
    G.H = buildHeight('towers');
    buildWalls('towers', G.H);
    punchCover(twR, merlonY, 22, WEPS[3]);
    ok('towers 三裂 nibble', !inWall(twR, merlonY));
    G.H = buildHeight('towers');
    buildWalls('towers', G.H);
    const winY = TOWERS_LEDGE_Y - 48;
    ok('towers window closed', inWall(twL, winY));
    punchWall(twL, winY, 12);
    ok('towers 穿透 window', !inWall(twL, winY));
    G.H = buildHeight('towers');
    G.mapId = 'towers';
    buildWalls('towers', G.H);
    const tpx = spawnX('towers', 'p');
    const tpy = G.H[tpx | 0] - UNIT_R;
    const tth65 = 65 * Math.PI / 180;
    const tth90 = 90 * Math.PI / 180;
    const ts65 = traceShot(tpx + Math.cos(tth65) * 18, tpy - 4 - Math.sin(tth65) * 18, 65, 70, 0, WEPS[0], G.H, null);
    const ts90 = traceShot(tpx + Math.cos(tth90) * 18, tpy - 4 - Math.sin(tth90) * 18, 90, 95, 0, WEPS[0], G.H, null);
    ok('towers 65 cross', ts65.x > TOWERS_R_INNER, Math.round(ts65.x));
    ok('towers 90 dunk', Math.abs(ts90.x - tpx) < 50, Math.round(ts90.x - tpx));
    G.kind = 'duo';
    const tdx0 = spawnAt('p', 0);
    const tdx1 = spawnAt('p', 1);
    const tdr0 = spawnAt('f', 0);
    const tdr1 = spawnAt('f', 1);
    ok('towers duo extras on ledge', isTowersLedge(tdx1) && isTowersLedge(tdr1), tdx1 + '/' + tdr1);
    ok('towers duo tops', tdx0 === TOWERS_PX && tdr0 === TOWERS_FX);
    ok('towers duo not void', !isDeathVoid(tdx0) && !isDeathVoid(tdx1) && !isDeathVoid(tdr0) && !isDeathVoid(tdr1));
    G.kind = 'hall';
    G.mapId = 'plain';
    G.walls = [];
    ok('g vk still locked', GRAV === 260 && VK === 420);
    ok('assist keep default 中', G.assist === 2);
    ok('fruit names', ITEM_NAME.leap === '飞步' && ITEM_NAME.warp === '影挪' && ITEM_NAME.neon === '霓弹' && ITEM_NAME.drum === '鼓息');
    ok('fruit gold 15', FRUIT_GOLD_P === 0.15 && FRUIT_RAGE === 25 && FRUIT_R === 12);
    ok('fruit cap +1', fruitCap('leap') === 3 && fruitCap('warp') === 2 && fruitCap('neon') === 3 && fruitCap('drum') === 2);
    const bagFull = { items: { leap: 3, warp: 2, neon: 3, drum: 2 }, rage: 10, stake: false };
    const fullGot = grantFruit(bagFull, false);
    ok('fruit cap blocks', fullGot && !fullGot.name && bagFull.items.leap === 3);
    const bagOpen = { items: { leap: 2, warp: 1, neon: 2, drum: 1 }, rage: 10, stake: false };
    const openGot = grantFruit(bagOpen, false);
    ok('fruit grant +1', openGot && openGot.id && bagOpen.items[openGot.id] === ITEM_MAX[openGot.id] + 1);
    const bagGold = { items: { leap: 0, warp: 0, neon: 0, drum: 0 }, rage: 40, stake: false };
    const goldGot = grantFruit(bagGold, true);
    ok('gold fruit +25', goldGot && goldGot.gold && bagGold.rage === 65);
    const bagRage = { items: { leap: 0, warp: 0, neon: 0, drum: 0 }, rage: 90, stake: false };
    grantFruit(bagRage, true);
    ok('gold fruit rage cap', bagRage.rage === 100);
    G.kind = 'hall';
    G.turns = 1;
    G.turn = 'p';
    G.fruits = [];
    spawnFruits(2);
    ok('first turn no fruit', G.fruits.length === 0);
    G.kind = 'drill';
    G.turns = 4;
    G.turn = 'p';
    spawnFruits(2);
    ok('drill no fruit', G.fruits.length === 0);
    G.kind = 'hall';
    G.turns = 2;
    G.turn = 'p';
    G.mapId = 'plain';
    G.H = buildHeight('plain');
    G.walls = [];
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100 };
    spawnFruits(2);
    ok('fruit max 2', G.fruits.length <= 2);
    ok('fruit spawn midair', G.fruits.length >= 1 && G.fruits.every(function (f) { return groundAt(f.x) - f.y >= 56 && !inWall(f.x, f.y); }));
    G.kind = 'seat';
    G.turns = 2;
    G.turn = 'f';
    spawnFruits(2);
    ok('seat can fruit', fruitModeOk() && G.fruits.length <= 2);
    G.kind = 'core';
    ok('core can fruit', fruitModeOk());
    G.mapId = 'ruins';
    G.H = buildHeight('ruins');
    buildWalls('ruins', G.H);
    G.p = { x: 140, y: G.H[140] - 14, r: 14, hp: 100 };
    G.f = { x: 820, y: G.H[820] - 14, r: 14, hp: 100 };
    G.fruits = [];
    ok('fruit not near wall', fruitBlocked(308, G.H[308] - 50) === true);
    ok('assist still 0-3 after fruit', ASSIST_NAME.length === 4 && G.assist === 2);
    ok('g vk fruit locked', GRAV === 260 && VK === 420);
    G.mapId = 'plain';
    G.walls = [];
    G.fires = [];
    G.fruits = [];
    G.kind = 'hall';
    G.p2 = null;
    G.f2 = null;

    ok('delay 普通 100', delayCost(0) === 100);
    ok('delay 高爆 130', delayCost(1) === 130);
    ok('delay 穿透 110', delayCost(2) === 110);
    ok('delay 霓弹 90', delayCost(3) === 90);
    ok('delay 三裂 120', delayCost(4) === 120);
    ok('delay 霓轨 140', delayCost(5) === 140);
    ok('delay 霓火 125', delayCost(6) === 125);
    ok('delay 殿破 +20', delayCost(0, true) === 120);
    ok('delay 高爆殿破 150', delayCost(1, true) === 150);
    ok('delay skip 80', delayCost(0, false, true) === 80);
    ok('item delay 0', delayCost(0, false, false) === 100);
    G.kind = 'duo';
    ok('duo name', kindName() === '对堂');
    ok('duo hp 100', maxHp('p') === 100 && maxHp('f') === 100);
    ok('duo wind 8', windMax() === 8);
    ok('duo dmg x1', dmgMul() === 1);
    ok('duo 岚丸 human', isHuman({ id: 'p', side: 'p' }) === true);
    ok('duo 霜丸 human', isHuman({ id: 'p2', side: 'p' }) === true);
    ok('duo 烬丸 AI', isHuman({ id: 'f', side: 'f' }) === false);
    ok('duo 霆丸 AI', isHuman({ id: 'f2', side: 'f' }) === false);
    G.p = { id: 'p', name: '岚丸', side: 'p', hp: 100 };
    G.p2 = { id: 'p2', name: '霜丸', side: 'p', hp: 100 };
    G.f = { id: 'f', name: '烬丸', side: 'f', hp: 100 };
    G.turn = 'p2';
    ok('duo 霜丸 humanTurn', humanTurn() === true);
    G.turn = 'f';
    ok('duo 烬丸 not humanTurn', humanTurn() === false);
    G.turn = 'p';
    G.kind = 'seat';
    ok('seat still 1v1 human', isHuman({ side: 'f', stake: false }) === true && isSeat() === true);
    G.kind = 'hall';
    ok('hall still 1v1 AI', isHuman({ side: 'f' }) === false && isHuman({ side: 'p' }) === true && isDuo() === false);
    G.kind = 'duo';
    G.p = { id: 'p', name: '岚丸', side: 'p', hp: 100, delay: 100, ord: 0 };
    G.p2 = { id: 'p2', name: '霜丸', side: 'p', hp: 100, delay: 16, ord: 2 };
    G.f = { id: 'f', name: '烬丸', side: 'f', hp: 100, delay: 8, ord: 1 };
    G.f2 = { id: 'f2', name: '霆丸', side: 'f', hp: 0, delay: 0, ord: 3 };
    ok('next lowest delay', pickNextId() === 'f');
    ok('fallen skip queue', liveActors().length === 3 && liveActors().every(function (u) { return u.hp > 0; }));
    G.f.hp = 0;
    ok('win both foes down', teamDown('f') === true && teamDown('p') === false);
    G.f.hp = 40;
    G.f2.hp = 40;
    ok('one foe live no win', teamDown('f') === false);
    G.kind = 'duo';
    G.mapId = 'forge';
    G.H = buildHeight('forge');
    const fx0 = spawnAt('p', 0);
    const fx1 = spawnAt('p', 1);
    const rx0 = spawnAt('f', 0);
    const rx1 = spawnAt('f', 1);
    ok('forge duo on pad', !isDeathVoid(fx0) && !isDeathVoid(fx1) && !isDeathVoid(rx0) && !isDeathVoid(rx1));
    ok('forge duo stagger', Math.abs(fx1 - fx0) >= 6 && Math.abs(fx1 - fx0) <= 40, Math.round(Math.abs(fx1 - fx0)));
    ok('forge duo right stagger', Math.abs(rx1 - rx0) >= 6 && Math.abs(rx1 - rx0) <= 40, Math.round(Math.abs(rx1 - rx0)));
    G.mapId = 'arcade';
    G.H = buildHeight('arcade');
    const ax0 = spawnAt('p', 0);
    const ax1 = spawnAt('p', 1);
    const ar0 = spawnAt('f', 0);
    const ar1 = spawnAt('f', 1);
    ok('arcade duo on bank', ax0 < ARCADE_A0 && ax1 < ARCADE_A0 && ar0 > ARCADE_A1 && ar1 > ARCADE_A1);
    ok('arcade duo not void', !isDeathVoid(ax0) && !isDeathVoid(ax1) && !isDeathVoid(ar0) && !isDeathVoid(ar1));
    ok('arcade duo stagger', Math.abs(ax1 - ax0) >= 6 && Math.abs(ax1 - ax0) <= 40, Math.round(Math.abs(ax1 - ax0)));
    ok('arcade duo right stagger', Math.abs(ar1 - ar0) >= 6 && Math.abs(ar1 - ar0) <= 40, Math.round(Math.abs(ar1 - ar0)));
    G.mapId = 'plain';
    G.H = buildHeight('plain');
    const px0 = spawnAt('p', 0);
    const px1 = spawnAt('p', 1);
    ok('plain duo stagger', Math.abs(px1 - px0) >= 20, Math.round(Math.abs(px1 - px0)));
    ok('duo names locked', G.p2.name === '霜丸' && G.f2.name === '霆丸');
    const frostU = makeUnit('p', { id: 'p2', name: '霜丸', delay: 16, ord: 2, slot: 1 });
    ok('duo 霜丸 spawn human', isHuman(frostU) === true && frostU.ai === false && frostU.name === '霜丸');
    const boltU = makeUnit('f', { id: 'f2', name: '霆丸', delay: 24, ord: 3, slot: 1, ai: true });
    ok('duo 霆丸 still AI', isHuman(boltU) === false && boltU.ai === true && boltU.name === '霆丸');
    G.kind = 'duo';
    G.turns = 2;
    G.turn = 'p';
    ok('duo can fruit', fruitModeOk() === true);
    G.kind = 'hall';
    G.p2 = null;
    G.f2 = null;
    ok('g vk duo locked', GRAV === 260 && VK === 420);
    ok('assist still 中', G.assist === 2 && ASSIST_NAME[2] === '中');
    G.kind = 'drill';
    G.mapId = 'plain';
    G.H = buildHeight('plain');
    const stakeU = makeUnit('f', { id: 'f', name: '石俑' });
    ok('drill still 石俑', stakeU.stake === true && stakeU.name === '石俑' && isHuman(stakeU) === false);
    G.kind = 'hall';
    G.p2 = null;
    G.f2 = null;

    ok('nixi 逆息', ITEM_NAME.nixi === '逆息' && ITEM_MAX.nixi === 1 && ITEM_COST.nixi === 15);
    ok('nixi not fruit', ITEM_KEYS.indexOf('nixi') < 0 && ITEM_KEYS.length === 4);
    ok('nixi bag', freshItems().nixi === 1 && freshItems().leap === 2);
    G.phase = 'aim';
    G.busy = null;
    G.wind = 6;
    const nu = { items: freshItems(), stam: 100, frozen: 0, x: 120, y: 200 };
    const used = useNixi(nu);
    ok('nixi use flip', used === true && G.wind === -6 && nu.items.nixi === 0 && nu.stam === 85);
    ok('nixi once', useNixi(nu) === false && G.wind === -6);
    G.wind = 0;
    const nu2 = { items: freshItems(), stam: 100, frozen: 0, x: 120, y: 200 };
    ok('nixi no wind', useNixi(nu2) === false && nu2.items.nixi === 1);
    const nu3 = { items: freshItems(), stam: 10, frozen: 0, x: 120, y: 200 };
    G.wind = 5;
    ok('nixi stam gate', useNixi(nu3) === false && nu3.items.nixi === 1);
    ok('nixi ai gate', NIXI_WIND === 5 && NIXI_MISS === 4000);
    ok('veil 障幕', ITEM_NAME.veil === '障幕' && ITEM_MAX.veil === 1 && ITEM_COST.veil === 20);
    ok('veil not fruit', ITEM_KEYS.indexOf('veil') < 0 && ITEM_KEYS.length === 4);
    ok('veil bag', freshItems().veil === 1 && freshItems().nixi === 1);
    ok('veil r 70', VEIL_R === 70 && VEIL_HP === 40 && VEIL_GRIDS === 8 && VEIL_ERR === 0.12);
    G.phase = 'aim';
    G.busy = null;
    G.veils = [];
    G.kind = 'hall';
    const vu = { items: freshItems(), stam: 100, frozen: 0, x: 200, y: 300, side: 'p', id: 'p' };
    const vUsed = useVeil(vu);
    ok('veil use', vUsed === true && vu.items.veil === 0 && vu.stam === 80 && G.veils.length === 1 && G.veils[0].r === 70);
    ok('veil once', useVeil(vu) === false && G.veils.length === 1);
    ok('veil disk', inVeil(200, 300) === true && inVeil(200 + 70, 300) === true && inVeil(200 + 71, 300) === false);
    ok('veil hide foe land', hideAssistLand({ side: 'f' }, 200, 300) === true);
    ok('veil own land shown', hideAssistLand({ side: 'p' }, 200, 300) === false);
    const vu2 = { items: freshItems(), stam: 19, frozen: 0, x: 200, y: 300, side: 'p', id: 'p' };
    ok('veil stam gate', useVeil(vu2) === false && vu2.items.veil === 1 && G.veils.length === 1);
    G.veils = [{ x: 200, y: 300, r: 70, side: 'p', wait: 1 }];
    tickVeils({ side: 'p', id: 'p' });
    ok('veil keep same side', G.veils.length === 1);
    tickVeils({ side: 'f', id: 'f' });
    ok('veil expire after foe', G.veils.length === 0);
    G.kind = 'duo';
    G.veils = [{ x: 100, y: 100, r: 70, side: 'p', wait: 1 }];
    tickVeils({ side: 'p', id: 'p2' });
    ok('veil keep teammate', G.veils.length === 1);
    tickVeils({ side: 'f', id: 'f' });
    ok('veil expire 1 foe act', G.veils.length === 0);
    G.kind = 'hall';
    G.p = { x: 152, hp: 100, side: 'p', id: 'p' };
    G.f = { x: 152 + 7 * GRID, hp: 30, side: 'f', id: 'f', items: freshItems(), stam: 100 };
    ok('ai want veil close low hp', aiWantVeil(G.f) === true);
    G.f.hp = 40;
    ok('ai veil hp 40 no', aiWantVeil(G.f) === false);
    G.f.hp = 30;
    G.f.x = 152 + 8 * GRID;
    ok('ai veil dist 8 no', aiWantVeil(G.f) === false);
    G.veils = [{ x: 152, y: 300, r: 70, side: 'p', wait: 1 }];
    G.p.x = 152; G.p.y = 300;
    ok('veil aim +12', Math.abs(veilAimMul(G.p) - 1.12) < 0.001);
    G.p.x = 800; G.p.y = 300;
    ok('veil aim clear', veilAimMul(G.p) === 1);
    G.veils = [];
    G.kind = 'hall';
    ok('g vk veil locked', GRAV === 260 && VK === 420);
    G.lastHit = { id: 'p2', name: '霜丸', side: 'p' };
    ok('duo 收击', duoFinisherName() === '霜丸');
    const sh = { id: 'p', name: '岚丸', side: 'p' };
    noteLastHit(sh, { id: 'f', name: '烬丸', side: 'f' });
    ok('last hit enemy', G.lastHit === sh && duoFinisherName() === '岚丸');
    noteLastHit(sh, { id: 'p2', name: '霜丸', side: 'p' });
    ok('last hit skip mate', G.lastHit === sh);
    ok('随图 pool 11', MAP_IDS.length === 11 && MAP_IDS.every(function (id) { return !!MAP_NAME[id]; }) && MAP_IDS.indexOf('towers') === 10);
    ok('g vk v1', GRAV === 260 && VK === 420);
    ok('mini size', MINI_W === 160 && MINI_H === 48);
    ok('mini default on', G.mini !== false);
    G.kind = 'hall';
    G.nextWind = 7;
    G.teaseWind = true;
    queueNextWind();
    ok('hall no next leak', G.nextWind == null && G.teaseWind === false);
    G.kind = 'core';
    G.nextWind = 3;
    G.teaseWind = true;
    queueNextWind();
    ok('core no next leak', G.nextWind == null && G.teaseWind === false);
    G.kind = 'seat';
    queueNextWind();
    ok('seat no next leak', G.nextWind == null && G.teaseWind === false);
    G.kind = 'duo';
    queueNextWind();
    ok('duo no next leak', G.nextWind == null && G.teaseWind === false);
    G.kind = 'drill';
    G.drillWind = '4r';
    G.nextWind = null;
    G.teaseWind = false;
    queueNextWind();
    ok('drill tease next', G.teaseWind === true && G.nextWind === 4);
    G.wind = 0;
    rollWind();
    ok('drill apply tease', G.wind === 4 && G.nextWind == null && G.teaseWind === false);
    G.drillWind = 'rand';
    G.kind = 'hall';
    ok('thump exists', typeof audio.thump === 'function');
    ok('g vk still locked v11', GRAV === 260 && VK === 420);
    G.kind = 'quad';
    ok('quad name', kindName() === '堂座');
    ok('quad hp 100', maxHp('p') === 100 && maxHp('f') === 100);
    ok('quad wind 8', windMax() === 8);
    ok('quad dmg x1', dmgMul() === 1);
    ok('quad 岚丸 human', isHuman({ id: 'p', side: 'p' }) === true);
    ok('quad 霜丸 human', isHuman({ id: 'p2', side: 'p' }) === true);
    ok('quad 烬丸 human', isHuman({ id: 'f', side: 'f' }) === true);
    ok('quad 霆丸 human', isHuman({ id: 'f2', side: 'f' }) === true);
    ok('quad not duo', isQuad() === true && isDuo() === false && isSquad() === true);
    G.p = { id: 'p', name: '岚丸', side: 'p', hp: 100 };
    G.p2 = { id: 'p2', name: '霜丸', side: 'p', hp: 100 };
    G.f = { id: 'f', name: '烬丸', side: 'f', hp: 100 };
    G.f2 = { id: 'f2', name: '霆丸', side: 'f', hp: 100 };
    G.turn = 'f';
    ok('quad 烬丸 humanTurn', humanTurn() === true);
    G.turn = 'f2';
    ok('quad 霆丸 humanTurn', humanTurn() === true);
    G.turn = 'p2';
    ok('quad 霜丸 humanTurn', humanTurn() === true);
    ok('pass 烬丸', passToastFor('f') === '把键盘给烬丸');
    ok('pass 岚丸', passToastFor('p') === '把键盘给岚丸');
    ok('pass side not unit', passToastFor('f') !== '把键盘给霆丸' && passToastFor('p') !== '把键盘给霜丸');
    G.p = { id: 'p', name: '岚丸', side: 'p', hp: 100, delay: 0, ord: 0 };
    G.p2 = { id: 'p2', name: '霜丸', side: 'p', hp: 100, delay: 16, ord: 2 };
    G.f = { id: 'f', name: '烬丸', side: 'f', hp: 100, delay: 8, ord: 1 };
    G.f2 = { id: 'f2', name: '霆丸', side: 'f', hp: 100, delay: 24, ord: 3 };
    ok('quad first 岚丸', pickNextId() === 'p');
    G.p.delay = 100;
    ok('quad next 烬丸 same delay as 对堂', pickNextId() === 'f');
    G.actDelay = { skip: false, wepId: 1, ult: false };
    applyActDelay(G.f);
    ok('quad delay 高爆', G.f.delay === 138);
    G.kind = 'duo';
    ok('对堂 stays PvE', isHuman({ id: 'f', side: 'f' }) === false && isHuman({ id: 'f2', side: 'f' }) === false && isDuo() === true && isQuad() === false);
    G.turn = 'f';
    ok('对堂 烬丸 still AI turn', humanTurn() === false);
    G.kind = 'quad';
    const quadBolt = makeUnit('f', { id: 'f2', name: '霆丸', delay: 24, ord: 3, slot: 1 });
    ok('quad 霆丸 spawn human', isHuman(quadBolt) === true && quadBolt.ai === false && quadBolt.name === '霆丸');
    G.kind = 'duo';
    const duoBolt = makeUnit('f', { id: 'f2', name: '霆丸', delay: 24, ord: 3, slot: 1, ai: true });
    ok('对堂 霆丸 still AI spawn', isHuman(duoBolt) === false && duoBolt.ai === true);
    G.kind = 'quad';
    G.turns = 2;
    G.turn = 'f';
    ok('quad can fruit', fruitModeOk() === true);
    G.kind = 'quad';
    queueNextWind();
    ok('quad no next leak', G.nextWind == null && G.teaseWind === false);
    G.kind = 'hall';
    G.p2 = null;
    G.f2 = null;
    ok('g vk quad locked', GRAV === 260 && VK === 420);
    ok('assist still 中 after 堂座', G.assist === 2 && ASSIST_NAME[2] === '中');
    ok('OPS 堂座', OPS.indexOf('6 堂座') >= 0 && OPS.indexOf('5 对堂') >= 0);
    G.wind = 0;
    G.windSpinT = 0;
    G.lastHit = null;
    G.phase = 'aim';

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
    if (G.busy === 'warpAim' && humanTurn()) {
      G.warpX = w.x;
      confirmWarp(curUnit());
      e.preventDefault();
      return;
    }
    if (G.mode === 'play' && humanTurn() && (G.phase === 'aim' || G.phase === 'charge') && !G.busy) {
      aimFromPointer(w.x, w.y, curUnit());
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
    if (G.mode === 'play' && humanTurn() && (G.phase === 'aim' || G.phase === 'charge') && !G.busy) {
      aimFromPointer(w.x, w.y, curUnit());
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
  if (btnSeat) btnSeat.addEventListener('click', function () { audio.ensure(); startGame('seat'); });
  if (btnDuo) btnDuo.addEventListener('click', function () { audio.ensure(); startGame('duo'); });
  if (btnQuad) btnQuad.addEventListener('click', function () { audio.ensure(); startGame('quad'); });
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
      if (b.id === 'btn-rand-map') {
        pickRandomMap();
        return;
      }
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
