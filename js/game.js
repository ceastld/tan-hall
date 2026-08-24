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
  const TURN_T = 18;
  const TURN_T_CORE = 14;
  const TURN_T_SUDDEN = 11;
  const CLOCK_WARN = 5;
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
  const OPS = '← → 走 · ↑ ↓ 角 · 空格/Z 蓄力 · 1 弹堂 · 2 堂核 · 3 演习场 · 4 对坐 · 5 对堂 · 6 堂座 · R 重开 · M 静音 · H 辅助 · N 地条 · K 残影';
  const OPS_PLAY = 'Q飞步 E影挪 C霓弹 V鼓息 B逆息 G障幕 F殿破 X过 · 堂袋 - = [ ] \\ ; \' · 4三裂 5霓轨 6霓火 7叠珠 8迟雷 · 65°查表 · Tab尺 · N地条 · H辅 · K残影';
  const OPS_DRILL = '演习 · 表随距离变 · 空格仍能打木桩 · N地条 · H辅 · K残影';
  const MINI_W = 160;
  const MINI_H = 48;
  const ASSIST_NAME = ['关', '弱', '中', '强'];
  const AI_NAME = ['易', '中', '狠'];
  const AI_EASY_ITEM_P = 0.18;
  const AI_EASY_HP_ULT = 30;
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
  const CRATE_NAME = '堂匣';
  const CRATE_GOLD_NAME = '金匣';
  const CRATE_R = 9;
  const CRATE_MAX = 2;
  const CRATE_P = 0.28;
  const CRATE_SUDDEN_P = 0.42;
  const CRATE_ITEM_P = 0.50;
  const CRATE_RAGE_P = 0.35;
  const CRATE_GOLD_P = 0.15;
  const CRATE_RAGE = 18;
  const CRATE_GOLD_RAGE = 28;
  const CRATE_WALK = 36;
  const BAG_NAME = { x2: '×2', x3: '×3', p1: '+1', p2: '+2', p3: '+3', p5: '+5', heal: '回春' };
  const BAG_SHORT = { x2: '×2', x3: '×3', p1: '+1', p2: '+2', p3: '+3', p5: '+5', heal: '回' };
  const BAG_TINT = { x2: '#ffe36b', x3: '#dc143c', p1: '#fff3c2', p2: '#ff9a3d', p3: '#ff2d2d', p5: '#ffd24a', heal: '#5dffb2' };
  const BAG_KEYS = ['x2', 'x3', 'p1', 'p2', 'p3', 'p5', 'heal'];
  const BAG_START = 2;
  const BAG_DRILL = 3;
  const BAG_HEAL = 14;
  const BAG_COST = { x2: 40, x3: 40, p1: 20, p2: 20, p3: 25, p5: 40, heal: 15 };
  const BAG_X2_MUL = 0.90;
  const BAG_X3_MUL = 0.60;
  const BAG_P1 = 0.10;
  const BAG_P2 = 0.20;
  const BAG_P3 = 0.30;
  const BAG_P5 = 0.50;
  const BAG_MULTI_WAIT = 0.32;
  const BAG_MULTI_JIT = 1;
  const BAG_CRATE_P = 0.35;
  const BAG_KEY_MAP = { '-': 'x2', '_': 'x2', '=': 'x3', '+': 'x3', '[': 'p1', '{': 'p1', ']': 'p2', '}': 'p2', '\\': 'p3', '|': 'p3', ';': 'p5', ':': 'p5', "'": 'heal', '"': 'heal' };
  const BAG_CODE_MAP = { Minus: 'x2', Equal: 'x3', BracketLeft: 'p1', BracketRight: 'p2', Backslash: 'p3', IntlBackslash: 'p3', Semicolon: 'p5', Quote: 'heal' };
  const MAP_NAME = { plain: '平原', canyon: '峡谷', twin: '双台', spire: '风柱', bridge: '碎桥', isles: '悬岛', ruins: '残垣', vale: '风谷', forge: '熔台', arcade: '廊桥', towers: '双塔', moon: '月池', cliff: '断崖', dune: '沙脊', gate: '石门', frost: '霜泽', cloud: '云台', mirror: '镜廊', well: '井口' };
  const MAP_IDS = ['plain', 'canyon', 'twin', 'spire', 'bridge', 'isles', 'ruins', 'vale', 'forge', 'arcade', 'towers', 'moon', 'cliff', 'dune', 'gate', 'frost', 'cloud', 'mirror', 'well'];
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
  const MOON_CX = 480;
  const MOON_RIM_Y = 246;
  const MOON_DEPTH = 182;
  const MOON_BOWL_HW = 250;
  const MOON_RAD = (MOON_BOWL_HW * MOON_BOWL_HW + MOON_DEPTH * MOON_DEPTH) / (2 * MOON_DEPTH);
  const MOON_CY = MOON_RIM_Y + MOON_DEPTH - MOON_RAD;
  const MOON_WATER_Y = 368;
  const MOON_POOL_Y = MOON_RIM_Y + MOON_DEPTH;
  const MOON_PX = 174;
  const MOON_FX = 786;
  const MOON_P2X = 210;
  const MOON_F2X = 750;
  const MOON_WALK = 0.45;
  const MOON_DMG = 3;
  const CLIFF_TOP_Y = 250;
  const CLIFF_DROP = 180;
  const CLIFF_BEACH_Y = CLIFF_TOP_Y + CLIFF_DROP;
  const CLIFF_EDGE = 508;
  const CLIFF_FACE = 8;
  const CLIFF_POOL0 = 520;
  const CLIFF_POOL1 = 632;
  const CLIFF_POOL_Y = 452;
  const CLIFF_WATER_Y = 438;
  const CLIFF_PX = 168;
  const CLIFF_FX = 772;
  const CLIFF_P2X = 204;
  const CLIFF_F2X = 736;
  const CLIFF_WALK = 0.45;
  const CLIFF_DMG = 2;
  const DUNE_PX = 168;
  const DUNE_FX = 772;
  const DUNE_P2X = 204;
  const DUNE_F2X = 736;
  const DUNE_CREST_Y = 246;
  const DUNE_SADDLE_Y = 394;
  const DUNE_HALF = 204;
  const DUNE_WALK = 0.55;
  const DUNE_CRATER = 1.25;
  const DUNE_WIND_EXTRA = 1;
  const GATE_PX = 168;
  const GATE_FX = 772;
  const GATE_P2X = 204;
  const GATE_F2X = 736;
  const GATE_L_CX = 280;
  const GATE_R_CX = 660;
  const GATE_HW = 54;
  const GATE_L0 = GATE_L_CX - GATE_HW;
  const GATE_L1 = GATE_L_CX + GATE_HW;
  const GATE_R0 = GATE_R_CX - GATE_HW;
  const GATE_R1 = GATE_R_CX + GATE_HW;
  const GATE_LEDGE_Y = 308;
  const GATE_CROWN_Y = 258;
  const GATE_PIT_Y = 476;
  const GATE_CRATER = 0.72;
  const FROST_PX = 168;
  const FROST_FX = 772;
  const FROST_P2X = 204;
  const FROST_F2X = 736;
  const FROST_BANK_Y = 304;
  const FROST_ICE_Y = 408;
  const FROST_ICE0 = 268;
  const FROST_ICE1 = 692;
  const FROST_SLOPE = 72;
  const FROST_WALK = 1.15;
  const FROST_CRATER = 0.55;
  const FROST_SKIP = 28;
  const FROST_SKIP_VY = 0.55;
  const FROST_SKIP_VX = 0.92;
  const FROST_SLIDE_ACC = 210;
  const FROST_SLIDE_DECAY = 1.15;
  const FROST_SLIDE_FRIC = 36;
  const CLOUD_PX = 168;
  const CLOUD_FX = 772;
  const CLOUD_P2X = 204;
  const CLOUD_F2X = 736;
  const CLOUD_BANK_Y = 308;
  const CLOUD_PIT_Y = 468;
  const CLOUD_L1 = 286;
  const CLOUD_R0 = 674;
  const CLOUD_SLAB_Y = 300;
  const CLOUD_SLAB_W = 220;
  const CLOUD_SLAB_HW = 110;
  const CLOUD_THICK = 20;
  const CLOUD_SLAB_BOT = CLOUD_SLAB_Y + CLOUD_THICK;
  const CLOUD_AMP = 90;
  const CLOUD_PERIOD = 7;
  const CLOUD_CX0 = 480;
  const CLOUD_CRATER = 0.8;
  const CLOUD_DEAD_MIN = 6;
  const CLOUD_DEAD_COLS = 48;
  const CLOUD_STORM_P = 0.30;
  const MIRROR_PX = 168;
  const MIRROR_FX = 772;
  const MIRROR_P2X = 204;
  const MIRROR_F2X = 736;
  const MIRROR_BANK_Y = 308;
  const MIRROR_TRENCH_Y = 378;
  const MIRROR_L1 = 292;
  const MIRROR_R0 = 668;
  const MIRROR_CX = 480;
  const MIRROR_W = 18;
  const MIRROR_X0 = MIRROR_CX - 9;
  const MIRROR_X1 = MIRROR_X0 + MIRROR_W - 1;
  const MIRROR_H = 220;
  const MIRROR_TOP_Y = MIRROR_TRENCH_Y - MIRROR_H;
  const MIRROR_CRATER = 0.5;
  const MIRROR_DEAD_H = 0.40;
  const MIRROR_DEAD_COLS = 7;
  const MIRROR_NX = 0.40;
  const MIRROR_STORM_P = 0.30;
  const WELL_PX = 168;
  const WELL_FX = 772;
  const WELL_P2X = 204;
  const WELL_F2X = 736;
  const WELL_CX = 480;
  const WELL_BANK_Y = 308;
  const WELL_LIP_Y = 282;
  const WELL_HW = 120;
  const WELL_LIP_PAD = 28;
  const WELL_LIP0 = WELL_CX - WELL_HW - WELL_LIP_PAD;
  const WELL_LIP1 = WELL_CX + WELL_HW + WELL_LIP_PAD;
  const WELL_SHAFT0 = WELL_CX - WELL_HW;
  const WELL_SHAFT1 = WELL_CX + WELL_HW;
  const WELL_DEPTH = 216;
  const WELL_POOL_Y = WELL_LIP_Y + WELL_DEPTH;
  const WELL_WATER_Y = 458;
  const WELL_WALK = 0.40;
  const WELL_DMG = 4;
  const WELL_LIP_CRATER = 0.75;
  const WELL_MUD_CRATER = 1.15;
  const WELL_STORM_P = 0.30;
  const WELL_CLIMB = 22;
  const STORM_NAME = '雷泽';
  const STORM_P = 0.35;
  const STORM_MIN = 8;
  const STORM_MAX = 14;
  const STORM_WALK = 0.88;
  const STORM_BOLT_MIN = 0.08;
  const STORM_BOLT_MAX = 0.16;
  const DUAL_WAIT = 0.38;
  const DUAL_POW = 0.72;
  const DUAL_JIT = 1.2;
  const DUAL_BLAST = 0.72;
  const MINE_FUSE = 1.6;
  const MINE_HIT = 0.85;
  const ISLE_VOID = 532;
  const ISLE_THICK = 44;
  const BURY_PX = 40;
  const HIT_STOP_DIRECT = 0.14;
  const QUAKE_NAME = '余震';
  const QUAKE_T = 0.28;
  const QUAKE_R = 36;
  const QUAKE_NEAR = 90;
  const QUAKE_LEDGE = 28;
  const QUAKE_SLIP_MIN = 8;
  const QUAKE_SLIP_MAX = 14;
  const QUAKE_SLIP_P = 0.5;
  const QUAKE_CRUMB_MIN = 4;
  const QUAKE_CRUMB_MAX = 7;
  const QUAKE_SHAKE_MIN = 3;
  const QUAKE_SHAKE_MAX = 5;
  const KILL_SLOW = 0.22;
  const KILL_HOLD = 0.40;
  const COACH_MSGS = ['看风', '65° 最远', '高抛埋人'];
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
  const WOOD = [176, 118, 62];
  const WOOD_DK = [96, 58, 28];
  const ICE = [160, 220, 255];
  const RAIL = [100, 255, 210];
  const FIRE = [255, 120, 48];
  const STONE = [196, 156, 112];
  const PEARL = [255, 236, 180];
  const MINE = [255, 176, 64];

  const WEPS = [
    { id: 0, name: '普通弹', direct: 32, splash: 36, crater: 30, spd: 1.00 },
    { id: 1, name: '高爆', direct: 24, splash: 56, crater: 48, spd: 0.88 },
    { id: 2, name: '穿透', direct: 30, splash: 32, crater: 26, spd: 1.06 },
    { id: 4, name: '三裂', direct: 14, splash: 22, crater: 16, spd: 0.96 },
    { id: 5, name: '霓轨', direct: 20, splash: 40, crater: 22, spd: 0.70 },
    { id: 6, name: '霓火', direct: 18, splash: 44, crater: 20, spd: 1.00 },
    { id: 7, name: '叠珠', direct: 32, splash: 36, crater: 30, spd: 1.00 },
    { id: 8, name: '迟雷', direct: 26, splash: 42, crater: 34, spd: 0.94 }
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
  const bagAimTag = el('bag-aim-tag');
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
  const stormLabel = el('storm-label');
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
  const aiTierEl = el('ai-tier');
  const aiLabel = el('ai-label');
  const aimHintEl = el('aim-hint');
  const timeLabel = el('time-label');
  const nextWindEl = el('next-wind');
  const nextWindArr = el('next-wind-arr');
  const nextWindNum = el('next-wind-num');
  const miniCv = el('mini');
  const miniCx = miniCv ? miniCv.getContext('2d') : null;
  const itemDock = el('item-dock');

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
    clockN: 0,
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
    shots: [],
    dual: null,
    queue: [],
    salvoT: 0,
    mines: [],
    charging: false,
    stam: STAM_MAX,
    neonOn: false,
    busy: null,
    busyT: 0,
    ruler: true,
    mini: true,
    ghostOn: true,
    assist: 2,
    ai: 1,
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
    crates: [],
    veils: [],
    lastHit: null,
    windSpinT: 0,
    storm: false,
    stormT: 0,
    stormNext: 8,
    boltT: 0,
    slab: null,
    mirror: null,
    coached: false,
    coachN: 0,
    killName: '',
    killRgb: GOLD,
    killHold: 0,
    killPend: 0,
    killVictim: null,
    quakeT: 0,
    quakeX: 0,
    quakeY: 0,
    quakeR: 0,
    quakeMag: 0
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
  function windMagOf(w) { return Math.abs((w == null ? G.wind : w) | 0); }
  function windDirOf(w) {
    w = (w == null ? G.wind : w) | 0;
    return w > 0 ? 1 : w < 0 ? -1 : 0;
  }
  function silkGale(mag) { return windMagOf(mag) >= 5; }
  function silkCount(mag) {
    mag = windMagOf(mag);
    if (mag <= 0) return 0;
    return Math.min(28, 6 + mag * 2);
  }
  function silkSpeed(mag) {
    mag = windMagOf(mag);
    if (mag <= 0) return 0;
    const gale = mag >= 5;
    return (gale ? 110 : 52) + mag * (gale ? 20 : 12);
  }
  function silkThick(mag) {
    mag = windMagOf(mag);
    if (mag <= 0) return 0;
    return silkGale(mag) ? 2.2 : 1.15;
  }
  function silkMoteCount(mag) {
    mag = windMagOf(mag);
    if (mag <= 0) return 0;
    return Math.min(16, 4 + mag);
  }
  function wrapSpan(n, span) {
    n %= span;
    return n < 0 ? n + span : n;
  }
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
    else if (wepId === 7) d += 35;
    else if (wepId === 8) d += 20;
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
  function isDualWep(wep) { return !!(wep && wep.id === 7); }
  function isMineWep(wep) { return !!(wep && wep.id === 8); }
  function mineHitWep(wep) {
    wep = wep || WEPS[7] || WEPS[0];
    return {
      id: wep.id,
      name: wep.name,
      direct: wep.direct,
      splash: wep.splash * MINE_HIT,
      crater: wep.crater,
      spd: wep.spd,
      craterMul: wep.craterMul,
      craterAdd: wep.craterAdd || 0
    };
  }
  function liveMineOf(side) {
    const list = G.mines;
    if (!list || !list.length) return null;
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].side === side) return list[i];
    }
    return null;
  }
  function dualFollowWep(wep) {
    wep = wep || WEPS[6] || WEPS[0];
    return {
      id: wep.id,
      name: wep.name,
      direct: wep.direct,
      splash: wep.splash * DUAL_BLAST,
      crater: wep.crater * DUAL_BLAST,
      spd: wep.spd,
      craterMul: wep.craterMul,
      craterAdd: wep.craterAdd || 0
    };
  }
  function matchWouldEnd() {
    if (G.kind === 'drill') return false;
    if (G.mode === 'end' || G.phase === 'end') return true;
    return teamDown('p') || teamDown('f');
  }
  function flyStillGoing() {
    if (G.mode !== 'play') return false;
    if (matchWouldEnd()) return false;
    if (G.shots && G.shots.length) return true;
    if (G.queue && G.queue.length) return true;
    if (G.dual && !G.dual.spawned) return true;
    return false;
  }
  function liveMineFuse() {
    const list = G.mines;
    if (!list || !list.length) return false;
    for (let i = 0; i < list.length; i++) {
      if (list[i] && (list[i].fuse || 0) > 0) return true;
    }
    return false;
  }
  function clockPaused() {
    if (overlayOpen()) return true;
    if (flyStillGoing()) return true;
    if (liveMineFuse()) return true;
    return false;
  }
  function clockOn() {
    return G.mode === 'play' && humanTurn() && (G.phase === 'aim' || G.phase === 'charge');
  }
  function makeShell(sx, sy, ang, power, wep, owner, opts) {
    const th = ang * Math.PI / 180;
    const spd = muzzleSpeed(power, ang, wep);
    opts = opts || {};
    return {
      x: sx,
      y: sy,
      vx: Math.cos(th) * spd,
      vy: -Math.sin(th) * spd,
      wep: wep,
      owner: owner,
      pierced: false,
      fuse: 0,
      life: 0,
      ult: !!opts.ult,
      lead: !!opts.lead,
      follow: !!opts.follow,
      extra: !!opts.extra,
      wind: opts.wind != null ? opts.wind : G.wind,
      windMul: opts.windMul != null ? opts.windMul : 1,
      iceSkip: false,
      trail: [{ x: sx, y: sy, a: 1 }]
    };
  }
  function isSeat() { return G.kind === 'seat'; }
  function isHuman(u) {
    if (!u || u.stake) return false;
    if (G.kind === 'seat' || G.kind === 'quad') return true;
    return u.side === 'p';
  }
  function humanTurn() { return isHuman(curUnit()); }
  function ghostPref() { return G.ghostOn !== false; }
  function lastGhost() {
    if (!ghostPref()) return null;
    const gh = G.ghost;
    if (!gh || !gh.points || gh.points.length < 2) return null;
    return gh;
  }
  function ghostVisible() {
    if (G.mode !== 'play') return false;
    if (G.phase !== 'aim' && G.phase !== 'charge') return false;
    return !!lastGhost();
  }
  function commitLastGhost(landX, landY) {
    if (!G.ghostPend) return;
    const pts = G.ghostPend.points ? G.ghostPend.points.slice() : [];
    pts.push({ x: landX, y: landY, a: 1 });
    G.ghost = {
      x: G.ghostPend.x,
      y: G.ghostPend.y,
      ang: G.ghostPend.ang,
      power: G.ghostPend.power,
      wepId: G.ghostPend.wepId,
      wind: G.ghostPend.wind,
      points: pts
    };
    G.ghostPend = null;
  }
  function setGhostOn(on) {
    G.ghostOn = !!on;
    saveBest();
    toast(G.ghostOn ? '残影开' : '残影关', false, false);
    syncHud();
  }
  function kindName() {
    return G.kind === 'core' ? '堂核' : G.kind === 'drill' ? '演习场' : G.kind === 'seat' ? '对坐' : G.kind === 'duo' ? '对堂' : G.kind === 'quad' ? '堂座' : '弹堂';
  }
  function turnTime() {
    if (G.sudden) return TURN_T_SUDDEN;
    if (G.kind === 'core') return TURN_T_CORE;
    return TURN_T;
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
  function bagCount() { return G.kind === 'drill' ? BAG_DRILL : BAG_START; }
  function freshBag() {
    const n = bagCount();
    return { x2: n, x3: n, p1: n, p2: n, p3: n, p5: n, heal: n };
  }
  function zeroBag() { return { x2: 0, x3: 0, p1: 0, p2: 0, p3: 0, p5: 0, heal: 0 }; }
  function freshArmed() {
    return { x2: false, x3: false, p1: false, p2: false, p3: false, p5: false, heal: false };
  }
  function ensureBag(u) {
    if (!u) return;
    if (!u.bag) u.bag = zeroBag();
    if (!u.armed) u.armed = freshArmed();
  }
  function bagArmed(u, id) {
    return !!(u && u.armed && u.armed[id] && u.bag && (u.bag[id] | 0) > 0);
  }
  function anyBagArmed(u) {
    if (!u) return false;
    for (let i = 0; i < BAG_KEYS.length; i++) {
      const k = BAG_KEYS[i];
      if (k !== 'heal' && bagArmed(u, k)) return true;
    }
    return false;
  }
  function bagChipParts(u) {
    const parts = [];
    if (!u) return parts;
    for (let i = 0; i < BAG_KEYS.length; i++) {
      const k = BAG_KEYS[i];
      if (k === 'heal') continue;
      if (bagArmed(u, k)) parts.push(k);
    }
    return parts;
  }
  function bagChipText(u) {
    return bagChipParts(u).map(function (k) { return BAG_SHORT[k]; }).join('+');
  }
  function shakeBagSlot(id) {
    if (!itemDock || !id) return;
    const btn = itemDock.querySelector('[data-bag="' + id + '"]');
    if (!btn) return;
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    setTimeout(function () { btn.classList.remove('shake'); }, 130);
  }
  function hexRgb(h) {
    h = String(h || '#ffe36b').replace('#', '');
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    const n = parseInt(h, 16);
    if (!isFinite(n)) return GOLD.slice();
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function bagRgb(id) {
    return hexRgb(BAG_TINT[id] || '#ffe36b');
  }
  function flashBagSlots(parts) {
    if (!itemDock || !parts || !parts.length) return;
    for (let i = 0; i < parts.length; i++) {
      const btn = itemDock.querySelector('[data-bag="' + parts[i] + '"]');
      if (!btn) continue;
      btn.classList.remove('flash');
      void btn.offsetWidth;
      btn.classList.add('flash');
    }
    setTimeout(function () {
      if (!itemDock) return;
      const list = itemDock.querySelectorAll('.bag-slot.flash');
      for (let i = 0; i < list.length; i++) list[i].classList.remove('flash');
    }, 180);
  }
  function bagMuzzleBurst(x, y, ang, parts) {
    if (REDUCE || !parts || !parts.length) return;
    const th = ang * Math.PI / 180;
    const ux = Math.cos(th);
    const uy = -Math.sin(th);
    for (let i = 0; i < parts.length; i++) {
      const rgb = bagRgb(parts[i]);
      const n = 6;
      for (let j = 0; j < n; j++) {
        const spr = rand(-0.38, 0.38);
        const s = rand(70, 210);
        const life = rand(0.12, 0.2);
        particles.push({
          x: x + ux * rand(0, 10),
          y: y + uy * rand(0, 10),
          vx: Math.cos(th + spr) * s,
          vy: -Math.sin(th + spr) * s - rand(8, 36),
          g: 240,
          life: life,
          max: life,
          r: rand(1.5, 3.8),
          rgb: rgb
        });
      }
    }
  }
  function bagIdFromKey(e) {
    if (!e) return null;
    if (e.code && BAG_CODE_MAP[e.code]) return BAG_CODE_MAP[e.code];
    if (e.key && BAG_KEY_MAP[e.key]) return BAG_KEY_MAP[e.key];
    return null;
  }
  function bagPlusMul(u) {
    let m = 1;
    if (bagArmed(u, 'p1')) m += BAG_P1;
    if (bagArmed(u, 'p2')) m += BAG_P2;
    if (bagArmed(u, 'p3')) m += BAG_P3;
    if (bagArmed(u, 'p5')) m += BAG_P5;
    return m;
  }
  function bagXMul(u) {
    if (bagArmed(u, 'x2')) return BAG_X2_MUL;
    if (bagArmed(u, 'x3')) return BAG_X3_MUL;
    return 1;
  }
  function bagShellMul(u) {
    return bagXMul(u) * bagPlusMul(u);
  }
  function bagExtraCount(u) {
    if (bagArmed(u, 'x3')) return 2;
    if (bagArmed(u, 'x2')) return 1;
    return 0;
  }
  function bagFireCost(u) {
    let c = 0;
    if (!u) return 0;
    for (let i = 0; i < BAG_KEYS.length; i++) {
      const k = BAG_KEYS[i];
      if (k === 'heal') continue;
      if (bagArmed(u, k)) c += BAG_COST[k] || 0;
    }
    return c;
  }
  function bagCanFire(u) {
    return bagFireCost(u) <= ((u && u.stam) || 0);
  }
  function disarmBagToAfford(u) {
    if (!u) return;
    ensureBag(u);
    const order = ['p5', 'x3', 'x2', 'p3', 'p2', 'p1'];
    while (bagFireCost(u) > (u.stam || 0)) {
      let dropped = false;
      for (let i = 0; i < order.length; i++) {
        if (u.armed[order[i]]) {
          u.armed[order[i]] = false;
          dropped = true;
          break;
        }
      }
      if (!dropped) break;
    }
  }
  function exclusiveBag(u, id) {
    if (!u || !u.armed) return;
    if (id === 'x2') u.armed.x3 = false;
    if (id === 'x3') u.armed.x2 = false;
  }
  function bagWep(wep, mods) {
    wep = wep || WEPS[0];
    mods = mods || {};
    const dmg = mods.dmgMul != null ? mods.dmgMul : 1;
    const sm = mods.splashMul != null ? mods.splashMul : 1;
    const cm = mods.craterMul != null ? mods.craterMul : 1;
    return {
      id: wep.id,
      name: wep.name,
      direct: wep.direct * dmg,
      splash: wep.splash * sm,
      crater: wep.crater * cm,
      spd: wep.spd,
      craterMul: cm,
      craterAdd: mods.craterAdd || 0
    };
  }
  function grantBagItem(owner, id) {
    if (!owner || owner.stake) return null;
    ensureBag(owner);
    const k = id && BAG_NAME[id] ? id : BAG_KEYS[irand(0, BAG_KEYS.length - 1)];
    owner.bag[k] = (owner.bag[k] || 0) + 1;
    return { kind: 'bag', toast: CRATE_NAME + ' · ' + BAG_NAME[k], id: k, name: BAG_NAME[k] };
  }
  function maybeBagCrate(kind, r) {
    if (kind === 'gold') return kind;
    if ((r == null ? Math.random() : r) < BAG_CRATE_P) return 'bag';
    return kind;
  }
  function consumeBagOnFire(u) {
    const mods = { dmgMul: 1, splashMul: 1, craterMul: 1, extra: 0, xMul: 1, plusMul: 1, shellMul: 1 };
    if (!u) return mods;
    ensureBag(u);
    const plus = bagPlusMul(u);
    const xMul = bagXMul(u);
    const extra = bagExtraCount(u);
    const cost = bagFireCost(u);
    const names = [];
    mods.plusMul = plus;
    mods.xMul = xMul;
    mods.shellMul = xMul * plus;
    mods.dmgMul = mods.shellMul;
    mods.splashMul = xMul;
    mods.craterMul = xMul;
    mods.extra = extra;
    function eat(id) {
      if (!bagArmed(u, id)) return;
      u.bag[id] = (u.bag[id] | 0) - 1;
      names.push(BAG_NAME[id]);
      if (u.bag[id] <= 0) u.armed[id] = false;
    }
    eat('x2');
    eat('x3');
    eat('p1');
    eat('p2');
    eat('p3');
    eat('p5');
    if (cost > 0) u.stam = Math.max(0, (u.stam || 0) - cost);
    if (names.length) toast(names.join(' · '), false, true);
    return mods;
  }
  function consumeBagOnSkip(u) {
    return u;
  }
  function useHeal(u) {
    if (!u || G.phase !== 'aim' || G.busy) return false;
    ensureBag(u);
    if ((u.bag.heal | 0) <= 0) { if (isHuman(u)) toastDeny('空袋'); return false; }
    if ((u.stam || 0) < BAG_COST.heal) { if (isHuman(u)) toastDeny('体不够'); return false; }
    u.bag.heal -= 1;
    u.stam = Math.max(0, (u.stam || 0) - BAG_COST.heal);
    u.hp = Math.min(u.max || u.hp, (u.hp || 0) + BAG_HEAL);
    toast('回春 +14', false, true);
    floatText(u.x, u.y - 24, '+14', [93, 255, 178], false);
    audio.ensure();
    audio.beep(420, 0.08, 'sine', 0.03, 720);
    audio.beep(620, 0.1, 'triangle', 0.024, 980);
    burst(u.x, u.y, [93, 255, 178], 8, 70, 0.22);
    syncHud();
    return true;
  }
  function armBagSilent(u, id) {
    if (!u || !id || id === 'heal') return false;
    ensureBag(u);
    if ((u.bag[id] | 0) <= 0) return false;
    u.armed[id] = true;
    exclusiveBag(u, id);
    return true;
  }
  function toggleBag(id) {
    if (G.mode !== 'play') return false;
    if (!humanTurn()) return false;
    if (G.phase !== 'aim' && G.phase !== 'charge') return false;
    if (G.busy) return false;
    const u = curUnit();
    if (!u || u.hp <= 0) return false;
    ensureBag(u);
    if (!BAG_NAME[id]) return false;
    if ((u.bag[id] | 0) <= 0) {
      shakeBagSlot(id);
      if (id === 'heal' && isHuman(u)) toastDeny('空袋');
      return false;
    }
    if (id === 'heal') return useHeal(u);
    const on = !u.armed[id];
    u.armed[id] = on;
    if (on) exclusiveBag(u, id);
    audio.ensure();
    audio.beep(on ? 380 : 220, 0.05, 'square', 0.018, on ? 620 : 140);
    syncHud();
    return true;
  }
  function resetItems(u) {
    if (!u) return;
    u.items = freshItems();
    u.bag = freshBag();
    u.armed = freshArmed();
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

  function moonBowlY(x) {
    const d = x - MOON_CX;
    const inner = MOON_RAD * MOON_RAD - d * d;
    if (inner <= 0) return MOON_RIM_Y;
    return MOON_CY + Math.sqrt(inner);
  }

  function isMoonRim(x) {
    if (G.mapId !== 'moon' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    if (G.H[i] >= MOON_WATER_Y - 8) return false;
    const d = Math.abs(i - MOON_CX);
    return d >= MOON_BOWL_HW - 40 && d <= MOON_BOWL_HW + 90;
  }

  function inMoonWater(u) {
    if (G.mapId !== 'moon' || !u) return false;
    return groundAt(u.x) >= MOON_WATER_Y;
  }

  function wellBowlY(x) {
    const d = Math.abs(x - WELL_CX);
    if (d >= WELL_HW) return WELL_LIP_Y;
    const t = d / WELL_HW;
    return lerp(WELL_POOL_Y, WELL_LIP_Y, Math.pow(t, 3.2));
  }

  function isWellShaft(x) {
    if (G.mapId !== 'well' || !G.H) return false;
    const i = x | 0;
    if (i < WELL_SHAFT0 || i > WELL_SHAFT1) return false;
    return G.H[i] > WELL_LIP_Y + 36;
  }

  function isWellLipX(x) {
    if (G.mapId !== 'well' || !G.H) return false;
    const i = x | 0;
    if (i < WELL_LIP0 || i > WELL_LIP1) return false;
    if (i > WELL_SHAFT0 && i < WELL_SHAFT1) return false;
    return G.H[i] < WELL_WATER_Y - 8;
  }

  function isWellMudX(x) {
    if (G.mapId !== 'well' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    return G.H[i] >= WELL_WATER_Y;
  }

  function isWellBank(x) {
    if (G.mapId !== 'well' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    if (isWellShaft(i) || isWellLipX(i)) return false;
    return G.H[i] < WELL_BANK_Y + 36 && G.H[i] < WELL_WATER_Y;
  }

  function inWellWater(u) {
    if (G.mapId !== 'well' || !u) return false;
    return groundAt(u.x) >= WELL_WATER_Y;
  }

  function inWell(u) {
    if (!u) return false;
    return inWellWater(u) || isWellShaft(u.x);
  }

  function wellExitX(foe) {
    if (!foe) return WELL_SHAFT0 - 18;
    return foe.x < WELL_CX ? WELL_SHAFT0 - 18 : WELL_SHAFT1 + 18;
  }

  function wellExitDist(foe) {
    if (!foe) return 1e9;
    if (!inWell(foe) && !isWellShaft(foe.x)) return 1e9;
    return Math.min(Math.abs(foe.x - WELL_SHAFT0), Math.abs(foe.x - WELL_SHAFT1));
  }

  function wellBlocksClimb(x, nx) {
    if (G.mapId !== 'well') return false;
    const dir = nx >= x ? 1 : -1;
    const sample = clamp(x + dir * 10, 0, VW - 1);
    const rise = groundAt(x) - groundAt(sample);
    return rise > WELL_CLIMB;
  }

  function wellR(r, x) {
    if (r <= 0) return r;
    if (isWellLipX(x)) return r * WELL_LIP_CRATER;
    if (isWellMudX(x)) return r * WELL_MUD_CRATER;
    return r;
  }

  function inCliffWater(u) {
    if (G.mapId !== 'cliff' || !u) return false;
    if ((u.x | 0) <= CLIFF_EDGE) return false;
    return groundAt(u.x) >= CLIFF_WATER_Y;
  }

  function isCliffPlateau(x) {
    if (G.mapId !== 'cliff' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    return i <= CLIFF_EDGE + 2 && G.H[i] < CLIFF_TOP_Y + 36;
  }

  function isCliffBeach(x) {
    if (G.mapId !== 'cliff' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    return i > CLIFF_EDGE + CLIFF_FACE && G.H[i] < CLIFF_WATER_Y && G.H[i] > CLIFF_TOP_Y + 80;
  }

  function duneHillY(x, peak) {
    const d = Math.abs(x - peak) / DUNE_HALF;
    if (d >= 1) return DUNE_SADDLE_Y;
    const k = 0.5 * (1 + Math.cos(Math.PI * d));
    return lerp(DUNE_SADDLE_Y, DUNE_CREST_Y, Math.pow(k, 0.72));
  }

  function isDuneCrest(x) {
    if (G.mapId !== 'dune' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    if (G.H[i] > DUNE_CREST_Y + 36) return false;
    return (i < 320 && Math.abs(i - DUNE_PX) <= 92) || (i > 640 && Math.abs(i - DUNE_FX) <= 92);
  }

  function isDuneSaddle(x) {
    if (G.mapId !== 'dune' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    return i > 360 && i < 600 && G.H[i] > DUNE_SADDLE_Y - 28;
  }

  function onSand(u) {
    if (G.mapId !== 'dune' || !u) return false;
    return !isDeathVoid(u.x);
  }

  function onGrass(u) {
    if (!u) return false;
    if (isDeathVoid(u.x)) return false;
    if (G.mapId === 'forge' || G.mapId === 'dune') return false;
    if (G.mapId === 'gate' && isGateStoneX(u.x)) return false;
    if (G.mapId === 'frost' && isFrostIce(u.x)) return false;
    if (G.mapId === 'cloud' && isCloudSlabX(u.x)) return false;
    if (G.mapId === 'mirror' && isMirrorStoneX(u.x)) return false;
    if (G.mapId === 'well' && (isWellLipX(u.x) || inWellWater(u))) return false;
    if (inMoonWater(u) || inCliffWater(u)) return false;
    return true;
  }

  function sandR(r) {
    if (G.mapId !== 'dune' || r <= 0) return r;
    return r * DUNE_CRATER;
  }

  function isGateStoneX(x) {
    if (G.mapId !== 'gate') return false;
    const i = x | 0;
    return (i >= GATE_L0 && i <= GATE_L1) || (i >= GATE_R0 && i <= GATE_R1);
  }

  function isGateCrown(x) {
    if (G.mapId !== 'gate' || !G.H) return false;
    const i = x | 0;
    if (!isGateStoneX(i)) return false;
    return G.H[i] < GATE_CROWN_Y + 36;
  }

  function isGateCorridor(x) {
    if (G.mapId !== 'gate' || !G.H) return false;
    const i = x | 0;
    if (i <= GATE_L1 || i >= GATE_R0) return false;
    return G.H[i] > GATE_CROWN_Y + 80;
  }

  function isGateLedge(x) {
    if (G.mapId !== 'gate' || !G.H) return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    if (isGateStoneX(i) || isGateCorridor(i)) return false;
    return G.H[i] < GATE_LEDGE_Y + 36;
  }

  function stoneR(r, x) {
    if (!isGateStoneX(x) || r <= 0) return r;
    return r * GATE_CRATER;
  }

  function isFrostIce(x) {
    if (G.mapId !== 'frost') return false;
    const i = x | 0;
    return i >= FROST_ICE0 && i <= FROST_ICE1;
  }

  function isFrostBank(x) {
    if (G.mapId !== 'frost') return false;
    const i = x | 0;
    if (i < 0 || i >= VW) return false;
    return !isFrostIce(i) && !isDeathVoid(i);
  }

  function onIce(u) {
    if (G.mapId !== 'frost' || !u) return false;
    return isFrostIce(u.x) && !isDeathVoid(u.x);
  }

  function cratePitAt(x) {
    const g = groundAt(x);
    const gl = groundAt(clamp(x - 48, 0, VW - 1));
    const gr = groundAt(clamp(x + 48, 0, VW - 1));
    return g - (gl + gr) * 0.5;
  }

  function crateGroundOk(x) {
    if (x < 40 || x > VW - 40) return false;
    if (!G.H) return false;
    if (isDeathVoid(x)) return false;
    if (isFrostIce(x)) return false;
    if (G.sudden && (x < G.safeL + 16 || x > G.safeR - 16)) return false;
    const gy = groundAt(x);
    if (gy >= VH - 16) return false;
    if (G.mapId === 'moon' && gy >= MOON_WATER_Y) return false;
    if (G.mapId === 'cliff' && (x | 0) > CLIFF_EDGE && gy >= CLIFF_WATER_Y) return false;
    if (G.mapId === 'forge' && gy > 400) return false;
    if (G.mapId === 'cloud' && (isCloudSlabX(x) || isCloudPitX(x))) return false;
    if (G.mapId === 'mirror' && (isMirrorStoneX(x) || isMirrorTrenchX(x))) return false;
    if (G.mapId === 'well' && (isWellShaft(x) || isWellLipX(x) || isWellMudX(x))) return false;
    if (cratePitAt(x) >= BURY_PX) return false;
    if (Math.abs(groundAt(clamp(x - 8, 0, VW - 1)) - groundAt(clamp(x + 8, 0, VW - 1))) > 28) return false;
    if (inWall(x, gy - 8) || inWall(x, gy - 18)) return false;
    return true;
  }

  function iceR(r, x) {
    if (!isFrostIce(x) || r <= 0) return r;
    return r * FROST_CRATER;
  }

  function makeCloudSlab() {
    const col = new Float32Array(CLOUD_SLAB_W);
    for (let i = 0; i < CLOUD_SLAB_W; i++) col[i] = CLOUD_SLAB_Y + Math.sin(i * 0.11) * 0.6;
    return { cx: CLOUD_CX0, t: 0, vx: 0, live: true, col: col };
  }

  function slabLeft() {
    if (!G.slab) return CLOUD_CX0 - CLOUD_SLAB_HW;
    return G.slab.cx - CLOUD_SLAB_HW;
  }

  function slabTopAt(x) {
    if (G.mapId !== 'cloud' || !G.slab || !G.slab.col) return null;
    const i = (x - slabLeft()) | 0;
    if (i < 0 || i >= CLOUD_SLAB_W) return null;
    const y = G.slab.col[i];
    if (!(y < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN)) return null;
    return y;
  }

  function isCloudBank(x) {
    if (G.mapId !== 'cloud') return false;
    const i = x | 0;
    return i <= CLOUD_L1 || i >= CLOUD_R0;
  }

  function isCloudPitX(x) {
    if (G.mapId !== 'cloud') return false;
    const i = x | 0;
    return i > CLOUD_L1 && i < CLOUD_R0;
  }

  function isCloudSlabX(x) {
    return slabTopAt(x) != null;
  }

  function onCloudSlab(u) {
    if (G.mapId !== 'cloud' || !u || u.hp <= 0 || !u.grounded) return false;
    const top = slabTopAt(u.x);
    if (top == null) return false;
    return Math.abs((u.y + (u.r || UNIT_R)) - top) <= 8;
  }

  function cloudSolidCount() {
    if (!G.slab || !G.slab.col) return 0;
    let n = 0;
    for (let i = 0; i < CLOUD_SLAB_W; i++) {
      if (G.slab.col[i] < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN) n += 1;
    }
    return n;
  }

  function refreshCloudLive() {
    if (!G.slab || !G.slab.live) return;
    let n = 0;
    let maxRemain = 0;
    for (let i = 0; i < CLOUD_SLAB_W; i++) {
      const remain = CLOUD_SLAB_BOT - G.slab.col[i];
      if (remain >= CLOUD_DEAD_MIN) {
        n += 1;
        if (remain > maxRemain) maxRemain = remain;
      }
    }
    if (n < CLOUD_DEAD_COLS || maxRemain < 8) {
      G.slab.live = false;
      G.slab.vx = 0;
    }
  }

  function carveCloud(cx, cy, r) {
    if (G.mapId !== 'cloud' || !G.slab || !G.slab.col || r <= 0) return;
    const rr = r * CLOUD_CRATER;
    const r2 = rr * rr;
    const left = slabLeft();
    const x0 = Math.max(0, Math.floor(cx - rr));
    const x1 = Math.min(VW - 1, Math.ceil(cx + rr));
    let any = false;
    for (let x = x0; x <= x1; x++) {
      const i = (x - left) | 0;
      if (i < 0 || i >= CLOUD_SLAB_W) continue;
      const top = G.slab.col[i];
      if (!(top < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN)) continue;
      const dx = x - cx;
      const inn = r2 - dx * dx;
      if (inn <= 0) continue;
      if (cy - rr > CLOUD_SLAB_BOT + 1) continue;
      if (cy + rr < top - 1) continue;
      const bot = cy + Math.sqrt(inn);
      if (top < bot) {
        G.slab.col[i] = Math.min(CLOUD_SLAB_BOT, bot);
        any = true;
      }
    }
    if (any) refreshCloudLive();
  }

  function rideCloud(dx) {
    if (!dx) return;
    eachUnit(function (u) {
      if (!u || u.hp <= 0 || !u.grounded) return;
      if (!onCloudSlab(u)) return;
      u.x = clamp(u.x + dx, 22, VW - 22);
      if (slabTopAt(u.x) != null) {
        u.y = groundAt(u.x, u.y) - u.r;
        u.grounded = true;
        u.vy = 0;
      } else {
        ungroundIfAir(u);
      }
      tryPickCrates(u);
    });
    const mines = G.mines;
    if (mines) {
      for (let i = 0; i < mines.length; i++) {
        const m = mines[i];
        if (!m || !isCloudSlabX(m.x)) continue;
        m.x = clamp(m.x + dx, 2, VW - 2);
        const top = slabTopAt(m.x);
        if (top != null) m.y = top;
      }
    }
    const fires = G.fires;
    if (fires) {
      for (let i = 0; i < fires.length; i++) {
        const f = fires[i];
        if (!f || !isCloudSlabX(f.x)) continue;
        f.x = clamp(f.x + dx, 4, VW - 4);
        const top = slabTopAt(f.x);
        if (top != null) f.y = Math.min(f.y, top);
      }
    }
    const crates = G.crates;
    if (crates) {
      for (let i = 0; i < crates.length; i++) {
        const c = crates[i];
        if (!c || !isCloudSlabX(c.x)) continue;
        c.x = clamp(c.x + dx, 8, VW - 8);
        const top = slabTopAt(c.x);
        if (top != null) {
          c.y = top - c.r;
          c.landY = c.y;
        }
      }
    }
  }

  function tickSlab(dt) {
    if (G.mapId !== 'cloud' || !G.slab) return;
    if (!G.slab.live) {
      G.slab.vx = 0;
      return;
    }
    const old = G.slab.cx;
    G.slab.t += dt;
    G.slab.cx = CLOUD_CX0 + CLOUD_AMP * Math.sin(G.slab.t * TAU / CLOUD_PERIOD);
    const dx = G.slab.cx - old;
    G.slab.vx = dt > 1e-8 ? dx / dt : 0;
    rideCloud(dx);
  }

  function makeMirrorWall() {
    const col = new Float32Array(MIRROR_W);
    for (let i = 0; i < MIRROR_W; i++) col[i] = MIRROR_TOP_Y + Math.sin(i * 0.37) * 0.5;
    return { live: true, col: col, bot: MIRROR_TRENCH_Y, origH: MIRROR_H };
  }

  function isMirrorBank(x) {
    if (G.mapId !== 'mirror') return false;
    const i = x | 0;
    return i <= MIRROR_L1 || i >= MIRROR_R0;
  }

  function isMirrorTrenchX(x) {
    if (G.mapId !== 'mirror') return false;
    const i = x | 0;
    return i > MIRROR_L1 && i < MIRROR_R0;
  }

  function mirrorTopAt(x) {
    if (G.mapId !== 'mirror' || !G.mirror || !G.mirror.col) return null;
    const i = (x - MIRROR_X0) | 0;
    if (i < 0 || i >= MIRROR_W) return null;
    const top = G.mirror.col[i];
    if (!(top < G.mirror.bot - 4)) return null;
    return top;
  }

  function isMirrorStoneX(x) {
    return mirrorTopAt(x) != null;
  }

  function inMirror(x, y) {
    const top = mirrorTopAt(x);
    if (top == null) return false;
    return y >= top && y < G.mirror.bot;
  }

  function mirrorNormal(x, y) {
    const top = mirrorTopAt(x);
    if (top == null) return { nx: 0, ny: -1 };
    const distTop = y - top;
    const distL = x - MIRROR_X0;
    const distR = MIRROR_X1 - x;
    if (distTop < 10 && distTop <= distL + 1 && distTop <= distR + 1) return { nx: 0, ny: -1 };
    if (distL <= distR) return { nx: -1, ny: 0 };
    return { nx: 1, ny: 0 };
  }

  function wantMirrorBounce(s, x, y) {
    if (!s || s.mirrorBounce) return false;
    if (!G.mirror || !G.mirror.live) return false;
    if (!inMirror(x, y)) return false;
    const n = mirrorNormal(x, y);
    return Math.abs(n.nx) >= MIRROR_NX;
  }

  function applyMirrorBounce(s) {
    if (!s) return s;
    s.mirrorBounce = true;
    s.vx *= -1;
    const n = mirrorNormal(s.x, s.y);
    const push = n.nx !== 0 ? n.nx : (s.vx >= 0 ? 1 : -1);
    s.x += push * 8;
    let g = 0;
    while (inMirror(s.x, s.y) && g < 14) {
      s.x += push * 2;
      g += 1;
    }
    burst(s.x, s.y, ICE, REDUCE ? 3 : 8, 70, 0.16);
    burst(s.x, s.y, WHT, REDUCE ? 1 : 4, 40, 0.12);
    if (audio && audio.beep) audio.beep(1480, 0.04, 'triangle', 0.016, 2100);
    return s;
  }

  function mirrorSolidCount() {
    if (!G.mirror || !G.mirror.col) return 0;
    let n = 0;
    for (let i = 0; i < MIRROR_W; i++) {
      if (G.mirror.col[i] < G.mirror.bot - 4) n += 1;
    }
    return n;
  }

  function mirrorMaxRemain() {
    if (!G.mirror || !G.mirror.col) return 0;
    let maxRemain = 0;
    for (let i = 0; i < MIRROR_W; i++) {
      const remain = G.mirror.bot - G.mirror.col[i];
      if (remain > maxRemain) maxRemain = remain;
    }
    return maxRemain;
  }

  function collapseMirror() {
    if (!G.mirror) return;
    G.mirror.live = false;
    for (let i = 0; i < MIRROR_W; i++) {
      const remain = Math.max(0, G.mirror.bot - G.mirror.col[i]);
      const rubble = Math.min(26, remain * 0.32);
      const x = MIRROR_X0 + i;
      if (G.H) G.H[x] = Math.max(88, G.H[x] - rubble);
      G.mirror.col[i] = G.mirror.bot;
    }
    terrainDirty = true;
    burst(MIRROR_CX, G.mirror.bot - 18, STONE, REDUCE ? 8 : 18, 120, 0.4);
    burst(MIRROR_CX, G.mirror.bot - 24, DIRT, REDUCE ? 4 : 10, 90, 0.28);
    if (audio && audio.dirt) audio.dirt();
  }

  function refreshMirrorLive() {
    if (!G.mirror || !G.mirror.live) return;
    const origH = G.mirror.origH || MIRROR_H;
    if (mirrorMaxRemain() < origH * MIRROR_DEAD_H || mirrorSolidCount() < MIRROR_DEAD_COLS) {
      collapseMirror();
    }
  }

  function carveMirror(cx, cy, r) {
    if (G.mapId !== 'mirror' || !G.mirror || !G.mirror.col || r <= 0) return;
    const r2 = r * r;
    let any = false;
    for (let i = 0; i < MIRROR_W; i++) {
      const x = MIRROR_X0 + i;
      const dx = x - cx;
      if (dx * dx >= r2) continue;
      const top = G.mirror.col[i];
      const bot = G.mirror.bot;
      if (!(top < bot - 2)) continue;
      const half = Math.sqrt(r2 - dx * dx);
      const y0 = cy - half;
      const y1 = cy + half;
      const o0 = Math.max(top, y0);
      const o1 = Math.min(bot, y1);
      if (o1 > o0) {
        G.mirror.col[i] = Math.min(bot, top + (o1 - o0));
        any = true;
      }
    }
    if (any) refreshMirrorLive();
  }

  function mirrorR(r, x) {
    if (!isMirrorStoneX(x) || r <= 0) return r;
    return r * MIRROR_CRATER;
  }

  function iceImpactDeg(vx, vy) {
    return Math.atan2(Math.abs(vy), Math.abs(vx) + 1e-9) * 180 / Math.PI;
  }

  function wantIceSkip(s, x) {
    if (!s || s.iceSkip) return false;
    if (!isFrostIce(x)) return false;
    return iceImpactDeg(s.vx, s.vy) < FROST_SKIP;
  }

  function applyIceSkip(s) {
    if (!s) return s;
    s.iceSkip = true;
    s.vy = -Math.abs(s.vy) * FROST_SKIP_VY;
    s.vx *= FROST_SKIP_VX;
    const gy = groundAt(s.x);
    if (s.y >= gy - 1) s.y = gy - 4;
    let g = 0;
    while (inGround(s.x, s.y) && g < 8) {
      s.y -= 2;
      g += 1;
    }
    burst(s.x, s.y, ICE, REDUCE ? 4 : 10, 90, 0.22);
    burst(s.x, s.y, WHT, REDUCE ? 2 : 5, 50, 0.16);
    if (audio && audio.beep) audio.beep(920, 0.05, 'triangle', 0.018, 1680);
    return s;
  }

  function iceMove(u, dir, dt, canWalk) {
    if (!u || !u.grounded || walkBlocked(u) || !onIce(u)) {
      if (u) u.slideVx = 0;
      return 0;
    }
    const max = walkSpd(u);
    let input = 0;
    if (dir && canWalk && G.walk > 0 && u.stam > 0) input = dir > 0 ? 1 : -1;
    if (input) {
      const target = input * max;
      if ((u.slideVx || 0) * input < 0) {
        u.slideVx = approach(u.slideVx || 0, target, FROST_SLIDE_ACC * dt);
      } else {
        u.slideVx = target;
      }
      u.face = input;
    } else {
      u.slideVx = (u.slideVx || 0) * Math.exp(-FROST_SLIDE_DECAY * dt);
      if (u.slideVx > 0) u.slideVx = Math.max(0, u.slideVx - FROST_SLIDE_FRIC * dt);
      else u.slideVx = Math.min(0, u.slideVx + FROST_SLIDE_FRIC * dt);
      if (Math.abs(u.slideVx) < 5) {
        u.slideVx = 0;
        return 0;
      }
    }
    const dx = u.slideVx * dt;
    const lo = G.sudden ? G.safeL + 18 : 22;
    const hi = G.sudden ? G.safeR - 18 : VW - 22;
    const nx = clamp(u.x + dx, lo, hi);
    if (wallBlocksWalk(nx, u.y, u.r)) {
      u.slideVx = 0;
      return 0;
    }
    if (input) {
      const used = Math.min(Math.abs(nx - u.x), G.walk, u.stam);
      G.walk -= used;
      u.stam -= used;
    }
    u.x = nx;
    u.walkT = 0.12;
    ungroundIfAir(u);
    tryPickCrates(u);
    if (!onIce(u)) u.slideVx = 0;
    return dx;
  }

  function stormForced(id) {
    id = id || G.mapId;
    return id === 'vale' || id === 'cliff' || id === 'dune';
  }

  function stormBanned(id) {
    return (id || G.mapId) === 'forge';
  }

  function pickStorm(id) {
    id = id || G.mapId;
    if (stormBanned(id)) return false;
    if (stormForced(id)) return true;
    if (id === 'cloud') return Math.random() < CLOUD_STORM_P;
    if (id === 'mirror') return Math.random() < MIRROR_STORM_P;
    if (id === 'well') return Math.random() < WELL_STORM_P;
    return Math.random() < STORM_P;
  }

  function nudgeStormWind(dir) {
    const cap = windMax();
    const d = dir < 0 ? -1 : 1;
    G.wind = clamp((G.wind | 0) + d, -cap, cap);
    return G.wind;
  }

  function strikeStorm() {
    if (!G.storm) return false;
    if (overlayOpen()) return false;
    nudgeStormWind(Math.random() < 0.5 ? -1 : 1);
    G.boltT = REDUCE ? 0 : rand(STORM_BOLT_MIN, STORM_BOLT_MAX);
    G.stormNext = G.stormT + rand(STORM_MIN, STORM_MAX);
    syncHud();
    return true;
  }

  function walkSpd(u) {
    const base = isHuman(u) ? 90 : 78;
    let spd;
    if (inMoonWater(u)) spd = base * MOON_WALK;
    else if (inWellWater(u)) spd = base * WELL_WALK;
    else if (inCliffWater(u)) spd = base * CLIFF_WALK;
    else if (onSand(u)) spd = base * DUNE_WALK;
    else if (onIce(u)) spd = base * FROST_WALK;
    else spd = base;
    if (G.storm && (onSand(u) || onGrass(u))) spd *= STORM_WALK;
    return spd;
  }

  function tickMoonWater(u) {
    if (!u || u.hp <= 0 || !inMoonWater(u)) return 0;
    const dmg = Math.max(1, Math.round(MOON_DMG));
    hurt(u, dmg, 'water');
    burst(u.x, u.y + (u.r || 14), ICE, 8, 50, 0.28);
    floatText(u.x, u.y - 26, '浸', ICE, false);
    audio.beep(240, 0.09, 'sine', 0.03, 90);
    return dmg;
  }

  function tickCliffWater(u) {
    if (!u || u.hp <= 0 || !inCliffWater(u)) return 0;
    const dmg = Math.max(1, Math.round(CLIFF_DMG));
    hurt(u, dmg, 'water');
    burst(u.x, u.y + (u.r || 14), ICE, 8, 50, 0.28);
    floatText(u.x, u.y - 26, '浸', ICE, false);
    audio.beep(220, 0.08, 'sine', 0.03, 80);
    return dmg;
  }

  function tickWellWater(u) {
    if (!u || u.hp <= 0 || !inWellWater(u)) return 0;
    const dmg = Math.max(1, Math.round(WELL_DMG));
    hurt(u, dmg, 'water');
    burst(u.x, u.y + (u.r || 14), ICE, 8, 50, 0.28);
    floatText(u.x, u.y - 26, '浸', ICE, false);
    audio.beep(200, 0.09, 'sine', 0.03, 70);
    return dmg;
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

  function setCamImpact(x, y, punch) {
    G.camHold = true;
    G.impactX = x;
    G.impactY = y;
    cam.tx = clamp(x, 140, VW - 140);
    cam.ty = clamp(y, 90, VH - 70);
    cam.tz = punch ? 1.32 : 1.18;
  }

  function dirtAt(x) {
    const H = G.H;
    if (!H) return VH - 8;
    const i = clamp(x, 0, VW - 1.001);
    const a = i | 0;
    const b = a + 1 < VW ? a + 1 : a;
    const t = i - a;
    return H[a] * (1 - t) + H[b] * t;
  }

  function groundAt(x, yHint) {
    const dirt = dirtAt(x);
    let best = dirt;
    const top = slabTopAt(x);
    if (top != null && !(yHint != null && yHint > top + CLOUD_THICK + 8)) {
      if (top < best) best = top;
    }
    const mt = mirrorTopAt(x);
    if (mt != null && !(yHint != null && yHint > mt + 12)) {
      if (mt < best) best = mt;
    }
    return best;
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
    } else if (id === 'moon') {
      for (let x = 0; x < VW; x++) {
        const edge = Math.min(x, VW - 1 - x);
        const outer = clamp((70 - edge) / 70, 0, 1);
        let yy = MOON_RIM_Y + Math.sin(x * 0.07) * 1.6 + Math.sin(x * 0.19) * 0.7;
        if (Math.abs(x - MOON_CX) <= MOON_BOWL_HW) {
          yy = moonBowlY(x) + Math.sin(x * 0.11) * 1.2;
        }
        yy = lerp(yy, 318, outer * outer);
        h[x] = yy;
      }
    } else if (id === 'cliff') {
      for (let x = 0; x < VW; x++) {
        let yy;
        if (x <= CLIFF_EDGE) {
          yy = CLIFF_TOP_Y + Math.sin(x * 0.07) * 1.4 + Math.sin(x * 0.19) * 0.5;
        } else if (x <= CLIFF_EDGE + CLIFF_FACE) {
          const k = (x - CLIFF_EDGE) / CLIFF_FACE;
          const sm = k * k * (3 - 2 * k);
          yy = CLIFF_TOP_Y + sm * CLIFF_DROP;
        } else {
          yy = CLIFF_BEACH_Y + Math.sin(x * 0.08) * 1.6 + Math.sin(x * 0.21) * 0.6;
        }
        if (x >= CLIFF_POOL0 && x <= CLIFF_POOL1) {
          const e = Math.min(x - CLIFF_POOL0, CLIFF_POOL1 - x);
          const r = clamp(e / 18, 0, 1);
          const sm = r * r * (3 - 2 * r);
          yy = lerp(yy, CLIFF_POOL_Y, sm);
        }
        h[x] = yy;
      }
      padFlat(h, 48, 240, CLIFF_TOP_Y);
      padFlat(h, 700, 910, CLIFF_BEACH_Y);
    } else if (id === 'dune') {
      for (let x = 0; x < VW; x++) {
        let yy = Math.min(duneHillY(x, DUNE_PX), duneHillY(x, DUNE_FX));
        const mid = 1 - clamp(Math.abs(x - 480) / 118, 0, 1);
        yy += mid * mid * 10;
        yy += Math.sin(x * 0.08) * 2.0 + Math.sin(x * 0.19) * 0.9;
        h[x] = yy;
      }
      padFlat(h, 88, 248, DUNE_CREST_Y);
      padFlat(h, 712, 872, DUNE_CREST_Y);
    } else if (id === 'gate') {
      for (let x = 0; x < VW; x++) {
        h[x] = GATE_PIT_Y + Math.sin(x * 0.08) * 2.4 + Math.sin(x * 0.19) * 1.1;
        const mid = 1 - clamp(Math.abs(x - 480) / 118, 0, 1);
        h[x] += mid * mid * 8;
      }
      function gateBand(x0, x1, y, edge) {
        for (let x = x0; x <= x1; x++) {
          const er = Math.min(x - x0, x1 - x);
          const ramp = clamp(er / Math.max(1, edge), 0, 1);
          const sm = ramp * ramp * (3 - 2 * ramp);
          const yy = y + Math.sin(x * 0.08) * 1.1 + Math.sin(x * 0.21) * 0.45;
          h[x] = lerp(h[x], yy, sm);
        }
      }
      function gateCol(x0, x1, y, edgeOut, edgeIn, inward) {
        for (let x = x0; x <= x1; x++) {
          const eOut = inward > 0 ? (x - x0) : (x1 - x);
          const eIn = inward > 0 ? (x1 - x) : (x - x0);
          const ramp = clamp(Math.min(eOut / Math.max(1, edgeOut), eIn / Math.max(1, edgeIn)), 0, 1);
          const sm = ramp * ramp * (3 - 2 * ramp);
          const yy = y + Math.sin(x * 0.07) * 0.8;
          h[x] = lerp(h[x], yy, sm);
        }
      }
      gateBand(20, GATE_L0 + 36, GATE_LEDGE_Y, 16);
      gateBand(GATE_R1 - 36, 940, GATE_LEDGE_Y, 16);
      gateCol(GATE_L0, GATE_L1, GATE_CROWN_Y, 18, 7, 1);
      gateCol(GATE_R0, GATE_R1, GATE_CROWN_Y, 18, 7, -1);
      padFlat(h, 88, 216, GATE_LEDGE_Y);
      padFlat(h, 744, 872, GATE_LEDGE_Y);
      padFlat(h, GATE_L_CX - 26, GATE_L_CX + 26, GATE_CROWN_Y);
      padFlat(h, GATE_R_CX - 26, GATE_R_CX + 26, GATE_CROWN_Y);
    } else if (id === 'frost') {
      for (let x = 0; x < VW; x++) {
        let yy;
        if (x < FROST_ICE0) {
          const k = clamp((FROST_ICE0 - x) / FROST_SLOPE, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(FROST_ICE_Y, FROST_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.2 + Math.sin(x * 0.19) * 0.5;
        } else if (x > FROST_ICE1) {
          const k = clamp((x - FROST_ICE1) / FROST_SLOPE, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(FROST_ICE_Y, FROST_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.2 + Math.sin(x * 0.19) * 0.5;
        } else {
          yy = FROST_ICE_Y + Math.sin(x * 0.11) * 0.45 + Math.sin(x * 0.23) * 0.18;
        }
        h[x] = yy;
      }
      padFlat(h, 72, 200, FROST_BANK_Y);
      padFlat(h, 760, 888, FROST_BANK_Y);
    } else if (id === 'cloud') {
      for (let x = 0; x < VW; x++) {
        let yy;
        if (x <= CLOUD_L1) {
          const k = clamp((CLOUD_L1 - x) / 22, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(CLOUD_PIT_Y, CLOUD_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.3 + Math.sin(x * 0.19) * 0.5;
        } else if (x >= CLOUD_R0) {
          const k = clamp((x - CLOUD_R0) / 22, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(CLOUD_PIT_Y, CLOUD_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.3 + Math.sin(x * 0.19) * 0.5;
        } else {
          yy = CLOUD_PIT_Y + Math.sin(x * 0.09) * 2.2 + Math.sin(x * 0.21) * 1.0;
        }
        h[x] = yy;
      }
      padFlat(h, 72, 220, CLOUD_BANK_Y);
      padFlat(h, 740, 888, CLOUD_BANK_Y);
    } else if (id === 'mirror') {
      for (let x = 0; x < VW; x++) {
        let yy;
        if (x <= MIRROR_L1) {
          const k = clamp((MIRROR_L1 - x) / 22, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(MIRROR_TRENCH_Y, MIRROR_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.2 + Math.sin(x * 0.19) * 0.5;
        } else if (x >= MIRROR_R0) {
          const k = clamp((x - MIRROR_R0) / 22, 0, 1);
          const sm = k * k * (3 - 2 * k);
          yy = lerp(MIRROR_TRENCH_Y, MIRROR_BANK_Y, sm);
          yy += Math.sin(x * 0.07) * 1.2 + Math.sin(x * 0.19) * 0.5;
        } else {
          yy = MIRROR_TRENCH_Y + Math.sin(x * 0.09) * 1.6 + Math.sin(x * 0.21) * 0.7;
        }
        h[x] = yy;
      }
      padFlat(h, 72, 220, MIRROR_BANK_Y);
      padFlat(h, 740, 888, MIRROR_BANK_Y);
    } else if (id === 'well') {
      for (let x = 0; x < VW; x++) {
        const edge = Math.min(x, VW - 1 - x);
        const outer = clamp((70 - edge) / 70, 0, 1);
        let yy = WELL_BANK_Y + Math.sin(x * 0.07) * 1.4 + Math.sin(x * 0.19) * 0.55;
        const d = Math.abs(x - WELL_CX);
        if (d <= WELL_HW) {
          yy = wellBowlY(x) + Math.sin(x * 0.13) * 0.9;
        } else if (d <= WELL_HW + WELL_LIP_PAD) {
          const u = (d - WELL_HW) / WELL_LIP_PAD;
          const sm = u * u * (3 - 2 * u);
          yy = lerp(WELL_LIP_Y, WELL_BANK_Y, sm) + Math.sin(x * 0.21) * 0.35;
        }
        yy = lerp(yy, 318, outer * outer);
        h[x] = yy;
      }
      padFlat(h, 72, 220, WELL_BANK_Y);
      padFlat(h, 740, 888, WELL_BANK_Y);
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
    if (id === 'moon') return side === 'p' ? MOON_PX : MOON_FX;
    if (id === 'cliff') return side === 'p' ? CLIFF_PX : CLIFF_FX;
    if (id === 'dune') return side === 'p' ? DUNE_PX : DUNE_FX;
    if (id === 'gate') return side === 'p' ? GATE_PX : GATE_FX;
    if (id === 'frost') return side === 'p' ? FROST_PX : FROST_FX;
    if (id === 'cloud') return side === 'p' ? CLOUD_PX : CLOUD_FX;
    if (id === 'mirror') return side === 'p' ? MIRROR_PX : MIRROR_FX;
    if (id === 'well') return side === 'p' ? WELL_PX : WELL_FX;
    return side === 'p' ? 152 : 768;
  }

  function spawnAt(side, slot) {
    if (G.mapId === 'towers' && slot) return side === 'p' ? TOWERS_P2X : TOWERS_F2X;
    if (G.mapId === 'moon' && slot) return side === 'p' ? MOON_P2X : MOON_F2X;
    if (G.mapId === 'cliff' && slot) return side === 'p' ? CLIFF_P2X : CLIFF_F2X;
    if (G.mapId === 'dune' && slot) return side === 'p' ? DUNE_P2X : DUNE_F2X;
    if (G.mapId === 'gate' && slot) return side === 'p' ? GATE_P2X : GATE_F2X;
    if (G.mapId === 'frost' && slot) return side === 'p' ? FROST_P2X : FROST_F2X;
    if (G.mapId === 'cloud' && slot) return side === 'p' ? CLOUD_P2X : CLOUD_F2X;
    if (G.mapId === 'mirror' && slot) return side === 'p' ? MIRROR_P2X : MIRROR_F2X;
    if (G.mapId === 'well' && slot) return side === 'p' ? WELL_P2X : WELL_F2X;
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
    r = r || UNIT_R;
    const x0 = Math.max(0, (x - r + 2) | 0);
    const x1 = Math.min(VW - 1, (x + r - 2) | 0);
    for (let i = x0; i <= x1; i++) {
      if (G.walls && G.walls.length && (inWall(i, y) || inWall(i, y + r * 0.45))) return true;
      if (inMirror(i, y) || inMirror(i, y + r * 0.45)) return true;
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
      slideVx: 0,
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
      items: freshItems(),
      bag: freshBag(),
      armed: freshArmed()
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
    const cap = windMax();
    const m = cap + (G.mapId === 'dune' ? DUNE_WIND_EXTRA : 0);
    let w;
    if (G.kind === 'core' && Math.random() < 0.55) {
      w = (Math.random() < 0.5 ? -1 : 1) * irand(8, m);
    } else {
      w = irand(-m, m);
    }
    if (w === 0 && Math.random() < 0.35) w = Math.random() < 0.5 ? -1 : 1;
    return clamp(w, -cap, cap);
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
    carveCloud(cx, cy, r);
    carveMirror(cx, cy, r);
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

  function snapMoon(cx, r, wep) {
    if (G.mapId !== 'moon' || !G.H || !wep) return;
    if (wep.id !== 1) return;
    const x0 = Math.max(0, Math.floor(cx - r - 10));
    const x1 = Math.min(VW - 1, Math.ceil(cx + r + 10));
    let any = false;
    for (let x = x0; x <= x1; x++) {
      const d = Math.abs(x - MOON_CX);
      if (d > MOON_BOWL_HW + 90) continue;
      if (G.H[x] >= MOON_WATER_Y - 8) continue;
      G.H[x] = MOON_POOL_Y;
      any = true;
    }
    if (any) terrainDirty = true;
  }

  function carveCluster(cx, cy, mul, add) {
    const hits = [];
    const extra = add || 0;
    for (let i = 0; i < CLUSTER.length; i++) {
      const pop = CLUSTER[i];
      const px = clamp(cx + pop.dx, 4, VW - 4);
      const py = groundAt(cx) + pop.dy;
      const r = Math.round(pop.r * (mul || 1)) + extra;
      carve(px, py, r);
      hits.push({ x: px, y: py, r: r });
    }
    return hits;
  }

  function inGround(x, y) {
    if (x < 0 || x >= VW) return true;
    const top = slabTopAt(x);
    if (top != null && y >= top && y <= CLOUD_SLAB_BOT + 0.8) return true;
    return y >= dirtAt(x);
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
    let iceSkip = false;
    let mirrorBounce = false;
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
        return { x: clamp(x, 0, VW - 1), y: Math.min(y, VH), t: t, hit: null, air: y < VH, iceSkip: iceSkip, mirrorBounce: mirrorBounce };
      }
      const u = unitAt(x, y, skip);
      if (u) {
        if (Hsave) G.H = old;
        return { x: x, y: y, t: t, hit: u, air: false, iceSkip: iceSkip, mirrorBounce: mirrorBounce };
      }
      if (inGround(x, y) || inWall(x, y) || inMirror(x, y)) {
        if (!mirrorBounce && G.mirror && G.mirror.live && inMirror(x, y)) {
          const n = mirrorNormal(x, y);
          if (Math.abs(n.nx) >= MIRROR_NX) {
            mirrorBounce = true;
            vx *= -1;
            const push = n.nx !== 0 ? n.nx : (vx >= 0 ? 1 : -1);
            x += push * 8;
            let gm = 0;
            while (inMirror(x, y) && gm < 14) {
              x += push * 2;
              gm += 1;
            }
            continue;
          }
        }
        if (wep && wep.id === 2 && !pierced && !mirrorBounce) {
          pierced = true;
          fuse = 0.18;
          const s = hypot(vx, vy) || 1;
          const ux = vx / s;
          const uy = vy / s;
          x += ux * 46;
          y += uy * 46;
          let g = 0;
          while ((inGround(x, y) || inWall(x, y) || inMirror(x, y)) && g < 18) {
            x += ux * 3;
            y += uy * 3;
            g += 1;
          }
          continue;
        }
        if (!iceSkip && isFrostIce(x) && iceImpactDeg(vx, vy) < FROST_SKIP) {
          iceSkip = true;
          vy = -Math.abs(vy) * FROST_SKIP_VY;
          vx *= FROST_SKIP_VX;
          const gy = groundAt(x);
          if (y >= gy - 1) y = gy - 4;
          let g2 = 0;
          while (inGround(x, y) && g2 < 8) {
            y -= 2;
            g2 += 1;
          }
          continue;
        }
        if (Hsave) G.H = old;
        return { x: x, y: y, t: t, hit: null, air: false, pierced: pierced, iceSkip: iceSkip, mirrorBounce: mirrorBounce };
      }
      if (pierced) {
        fuse -= dt;
        if (fuse <= 0) {
          if (Hsave) G.H = old;
          return { x: x, y: y, t: t, hit: null, air: true, pierced: true, iceSkip: iceSkip, mirrorBounce: mirrorBounce };
        }
      }
    }
    if (Hsave) G.H = old;
    return { x: x, y: y, t: t, hit: hitU, air: true, iceSkip: iceSkip, mirrorBounce: mirrorBounce };
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
      if (wep && wep.id === 7) this.beep(260, 0.16, 'sine', 0.04, 70);
      if (wep && wep.id === 8) this.beep(90, 0.28, 'triangle', 0.05, 36);
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


  function toast(msg, warn, gold, tint) {
    const tiny = gold === 'tiny';
    G.toastT = tiny ? 1.15 : 1.4;
    toastTok += 1;
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle('warn', !!warn);
    const ice = gold === 'ice';
    const bagTint = tint && !warn ? tint : '';
    toastEl.classList.toggle('ice', ice && !warn);
    toastEl.classList.toggle('gold', !!gold && !ice && !warn && !tiny && !bagTint);
    toastEl.classList.toggle('tiny', tiny);
    toastEl.classList.toggle('bag-tint', !!bagTint);
    if (bagTint) toastEl.style.setProperty('--bag-tint', bagTint);
    else toastEl.style.removeProperty('--bag-tint');
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
    toastEl.classList.remove('tiny');
    toastEl.classList.remove('bag-tint');
    toastEl.style.removeProperty('--bag-tint');
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
      if (aiTierEl) aiTierEl.classList.remove('gone');
    } else {
      if (ovStart) ovStart.classList.add('gone');
      if (ovEnd) ovEnd.classList.remove('gone');
      if (ovMaps) ovMaps.style.display = 'none';
      if (aiTierEl) aiTierEl.classList.add('gone');
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
      if (o.ghost === false) G.ghostOn = false;
      else G.ghostOn = true;
      const ast = parseInt(o.assist, 10);
      if (ast === 0 || ast === 1 || ast === 2 || ast === 3) G.assist = ast;
      else G.assist = 2;
      if (o.drillWind === '0' || o.drillWind === '4l' || o.drillWind === '4r' || o.drillWind === 'rand') {
        G.drillWind = o.drillWind;
      }
      G.coached = !!o.coached;
      const ai = parseInt(o.ai, 10);
      if (ai === 0 || ai === 1 || ai === 2) G.ai = ai;
      else G.ai = 1;
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
        ghost: G.ghostOn !== false,
        assist: clamp(G.assist | 0, 0, 3),
        drillWind: G.drillWind || 'rand',
        coached: !!G.coached,
        ai: clamp(G.ai | 0, 0, 2)
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
    if (stormLabel) {
      const on = (G.mode === 'play' || G.mode === 'end') && !!G.storm;
      stormLabel.classList.toggle('gone', !on);
      stormLabel.textContent = STORM_NAME;
    }
    if (aiLabel) {
      const noAi = G.mode === 'play' && (G.kind === 'drill' || G.kind === 'seat' || isQuad());
      aiLabel.textContent = aiHud();
      aiLabel.classList.toggle('gone', !!noAi);
    }
    const gale = silkGale();
    if (windLabel) windLabel.classList.toggle('gale', gale);
    if (windArr) {
      windArr.textContent = G.wind > 0 ? (gale ? '→→' : '→') : G.wind < 0 ? (gale ? '←←' : '←') : '·';
    }
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
    if (bagAimTag) {
      const aiming = G.mode === 'play' && (G.phase === 'aim' || G.phase === 'charge');
      const showBag = aiming && anyBagArmed(u);
      bagAimTag.classList.toggle('gone', !showBag);
      bagAimTag.setAttribute('aria-hidden', showBag ? 'false' : 'true');
    }
    const stam = u && u.stam != null ? u.stam : G.stam;
    if (walkLabel) walkLabel.textContent = '体 ' + Math.max(0, Math.round(stam));
    if (rageLabel) rageLabel.textContent = '怒 ' + Math.max(0, Math.round((u && u.rage) || 0));
    if (ghostLabel) {
      const gh = lastGhost();
      if (gh && ghostVisible()) {
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
    syncBag();
    syncAssist();
    syncAiTier();
    syncDrillHud();
    if (comboEl) {
      if (G.combo >= 2 && G.mode === 'play') {
        comboEl.hidden = false;
        comboEl.textContent = '连堂 ×' + G.combo;
      } else comboEl.hidden = true;
    }
    if (timeLabel) {
      if (clockOn()) {
        const left = Math.max(0, Math.ceil(G.timeout));
        const warn = left <= CLOCK_WARN && G.timeout > 0;
        timeLabel.textContent = '时 ' + left;
        timeLabel.classList.toggle('warn', warn);
        timeLabel.classList.toggle('pulse', warn && !clockPaused());
        timeLabel.classList.remove('gone');
      } else {
        timeLabel.classList.add('gone');
        timeLabel.classList.remove('pulse');
        timeLabel.classList.remove('warn');
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

  function syncBag() {
    if (!itemDock) return;
    const play = G.mode === 'play';
    itemDock.classList.toggle('gone', !play);
    const actor = curUnit() || G.p;
    if (actor) ensureBag(actor);
    for (let i = 0; i < BAG_KEYS.length; i++) {
      const k = BAG_KEYS[i];
      const btn = itemDock.querySelector('[data-bag="' + k + '"]');
      if (!btn) continue;
      const n = actor && actor.bag ? (actor.bag[k] | 0) : 0;
      const badge = btn.querySelector('.bag-n');
      if (badge) badge.textContent = String(n);
      btn.classList.toggle('empty', n <= 0);
      btn.classList.toggle('armed', !!(actor && actor.armed && actor.armed[k] && n > 0 && k !== 'heal'));
    }
    const chips = el('bag-chips');
    if (chips) {
      const parts = play ? bagChipParts(actor) : [];
      const sig = parts.join('+');
      chips.classList.toggle('gone', !parts.length);
      chips.setAttribute('aria-hidden', parts.length ? 'false' : 'true');
      if (chips.getAttribute('data-sig') !== sig) {
        chips.setAttribute('data-sig', sig);
        let html = '';
        for (let i = 0; i < parts.length; i++) {
          if (i) html += '<span class="bag-chip-join">+</span>';
          html += '<span class="bag-chip bag-chip-' + parts[i] + '">' + BAG_SHORT[parts[i]] + '</span>';
        }
        chips.innerHTML = html;
      }
    }
  }

  function syncDrillWind() {
    if (!drillWindEl) return;
    const btns = drillWindEl.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-dw') === G.drillWind);
    }
  }

  function syncAiTier() {
    if (!aiTierEl) return;
    const t = String(aiTier());
    const btns = aiTierEl.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-ai') === t);
    }
  }

  function setAi(n) {
    G.ai = clamp(n | 0, 0, 2);
    saveBest();
    syncAiTier();
    syncHud();
    toast('烬丸 · ' + aiName(), false, G.ai >= 1);
  }

  function aiTier() { return clamp(G.ai | 0, 0, 2); }
  function aiEasy() { return aiTier() === 0; }
  function aiHard() { return aiTier() === 2; }
  function aiName() { return AI_NAME[aiTier()]; }
  function aiHud() { return '烬 · ' + aiName(); }
  function aiJitterBase() {
    if (aiEasy()) return { ang: 8, pow: 6 };
    if (aiHard()) return { ang: 2, pow: 2 };
    return G.kind === 'core' ? { ang: 1.5, pow: 2 } : { ang: 3, pow: 4 };
  }
  function aiMayItem(force) {
    if (force) return true;
    if (aiEasy()) return Math.random() < AI_EASY_ITEM_P;
    return true;
  }
  function aiWantUlt(from, score, rageReady) {
    if (!from) return false;
    const rage = rageReady != null ? rageReady : (from.rage || 0);
    if (rage < 100) return false;
    if (aiEasy()) return (from.hp || 0) < AI_EASY_HP_ULT && score >= 5000;
    if (aiHard()) return score >= 1500;
    return score >= 5000;
  }
  function delayNext(from, wepId, ult) {
    if (!isDuo() || !from) return null;
    const extra = delayCost(wepId, !!ult, false);
    const live = liveActors();
    if (!live.length) return null;
    return sortByDelay(live, from, extra)[0] || null;
  }
  function delayKeepsTurn(from, wepId, ult) {
    const n = delayNext(from, wepId, ult);
    return !!(n && n === from);
  }
  function delayKeepsSide(from, wepId, ult) {
    const n = delayNext(from, wepId, ult);
    return !!(n && n.side === from.side);
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
    G.punch = Math.max(G.punch, 1 + Math.min(0.16, mag * 0.012));
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

  function dirtGeyser(x, y) {
    const n = REDUCE ? 8 : 24;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * 0.5 + rand(-0.62, 0.62);
      const s = rand(180, 380);
      const life = rand(0.42, 0.82);
      particles.push({
        x: x + rand(-10, 10),
        y: y + rand(-4, 8),
        vx: Math.cos(a) * s * 0.42,
        vy: Math.sin(a) * s,
        g: 640,
        life: life,
        max: life,
        r: rand(2.2, 5.8),
        rgb: i % 3 === 0 ? STONE : DIRT
      });
    }
    ringAt(x, y, DIRT, 52);
    burst(x, y, STONE, REDUCE ? 4 : 10, 110, 0.4);
  }

  function shouldCoach() {
    if (G.coached) return false;
    if (G.kind !== 'hall') return false;
    if (isSquad()) return false;
    return true;
  }

  function coachOnFire(u) {
    if (!shouldCoach()) return;
    if (!isHuman(u)) return;
    const n = G.coachN | 0;
    if (n >= 3) {
      G.coached = true;
      saveBest();
      return;
    }
    toast(COACH_MSGS[n], false, 'tiny');
    G.coachN = n + 1;
    if (G.coachN >= 3) {
      G.coached = true;
      saveBest();
    }
  }

  function armKillCam(u) {
    if (!u) return;
    G.killName = u.name || '';
    G.killRgb = unitRgb(u);
    if (REDUCE) {
      floatText(u.x, u.y - 42, G.killName, G.killRgb, true);
      G.killHold = 0;
      G.killPend = 0;
      return;
    }
    G.slowMo = Math.max(G.slowMo || 0, KILL_SLOW);
    G.killPend = KILL_HOLD;
    G.killHold = 0;
    setCamImpact(u.x, u.y, true);
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
    const was = u.hp;
    u.hp = Math.max(0, u.hp - dmg);
    if (was > 0 && u.hp <= 0 && why === 'blast') G.killVictim = u;
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

  function applyBlast(x, y, wep, shooter, ultOn) {
    const mul = dmgMul();
    let any = false;
    if (ultOn == null) ultOn = !!(shooter && shooter.ult);
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
      if (ultOn) dmg *= 1.6;
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
    const gy = groundAt(u.x, u.y) - u.r;
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
    const gy = groundAt(u.x, u.y) - u.r;
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
      const land = groundAt(u.x, u.y) - u.r;
      if (u.y >= land) {
        u.y = land;
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
    clearCrates(true);
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
    G.clockN = 0;
    G.shot = null;
    G.shots = [];
    G.dual = null;
    G.queue = [];
    G.salvoT = 0;
    G.neonOn = false;
    G.actDelay = { skip: false, wepId: 0, ult: false };
    trail.length = 0;
    if (u) {
      u.stam = STAM_MAX;
      u.slideVx = 0;
      if (G.kind === 'drill') resetItems(u);
      if (u.wep != null) G.wep = u.wep;
      ensureBag(u);
    }
    G.stam = u ? u.stam : STAM_MAX;
    rollWind();
    if (u && u.id === 'p') G.turns += 1;
    maybeSudden();
    G.timeout = turnTime();
    audio.chargeStop();
    if (u && u.hp > 0) {
      tickMoonWater(u);
      tickCliffWater(u);
      tickWellWater(u);
    }
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
      consumeBagOnSkip(u);
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
    const actor = curUnit();
    if (actor && !bagCanFire(actor)) {
      toastDeny('体不够');
      return;
    }
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
    if (!bagCanFire(u)) {
      if (isHuman(u)) {
        toastDeny('体不够');
        G.phase = 'aim';
        G.charging = false;
        audio.chargeStop();
        syncHud();
        return;
      }
      disarmBagToAfford(u);
    }
    const parts = bagChipParts(u);
    const mods = consumeBagOnFire(u);
    const ang = u.ang;
    const wep = bagWep(wepOf(), mods);
    const th = ang * Math.PI / 180;
    const nose = 18;
    const sx = u.x + Math.cos(th) * nose;
    const sy = u.y - 4 - Math.sin(th) * nose;
    const shotWind = G.wind | 0;
    const windMul = 1;
    if (G.neonOn) {
      if (u.items && u.items.neon > 0) u.items.neon -= 1;
      G.neonOn = false;
    }
    G.actDelay = { skip: false, wepId: wep.id, ult: !!u.ult };
    const shell = makeShell(sx, sy, ang, G.power, wep, u, { ult: !!u.ult, lead: true, wind: shotWind, windMul: windMul });
    G.shot = shell;
    G.shots = [shell];
    G.queue = [];
    G.salvoT = 0;
    const extra = mods.extra || 0;
    const dual = isDualWep(wep);
    if (dual) {
      G.queue.push({
        at: DUAL_WAIT, follow: true, ang: ang, power: G.power * DUAL_POW, wep: dualFollowWep(wep),
        jitter: DUAL_JIT, owner: u, sx: sx, sy: sy, ult: !!u.ult, wind: shotWind, windMul: windMul
      });
    }
    for (let i = 1; i <= extra; i++) {
      const at = i * BAG_MULTI_WAIT;
      G.queue.push({
        at: at, lead: true, extra: true, ang: ang, power: G.power, wep: wep,
        jitter: BAG_MULTI_JIT, owner: u, sx: sx, sy: sy, ult: !!u.ult, wind: shotWind, windMul: windMul
      });
      if (dual) {
        G.queue.push({
          at: at + DUAL_WAIT, follow: true, ang: ang, power: G.power * DUAL_POW, wep: dualFollowWep(wep),
          jitter: DUAL_JIT, owner: u, sx: sx, sy: sy, ult: !!u.ult, wind: shotWind, windMul: windMul
        });
      }
    }
    G.dual = (extra > 0 || dual) ? {
      spawned: G.queue.length === 0,
      owner: u,
      hit: false,
      comboDone: false
    } : null;
    G.ghostPend = { x: sx, y: sy, ang: ang, power: Math.round(G.power), wepId: wep.id, wind: shotWind, points: [{ x: sx, y: sy, a: 1 }] };
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
    if (wep.id === 7) {
      audio.beep(340, 0.08, 'sine', 0.034, 620);
      audio.beep(510, 0.1, 'triangle', 0.028, 880);
    }
    if (wep.id === 8) {
      fizzleSideMine(u && u.side);
      audio.beep(160, 0.12, 'sawtooth', 0.036, 70);
      audio.beep(280, 0.1, 'triangle', 0.03, 420);
    }
    if (u.ult) audio.beep(90, 0.28, 'sine', 0.06, 36);
    flashBagSlots(parts);
    bagMuzzleBurst(sx, sy, ang, parts);
    burst(sx, sy, u.ult ? GOLD : (wep.id === 3 ? ICE : (wep.id === 8 ? MINE : (wep.id === 7 ? PEARL : (wep.id === 6 ? FIRE : (wep.id === 5 ? RAIL : unitRgb(u)))))), 8, 80, 0.25);
    u.walkT = 0;
    spawnFruits();
    queueNextWind();
    coachOnFire(u);
    syncHud();
  }

  function nextQueueIdx() {
    const q = G.queue;
    if (!q || !q.length) return -1;
    let best = 0;
    for (let i = 1; i < q.length; i++) {
      if (q[i].at < q[best].at) best = i;
    }
    return best;
  }

  function spawnFromQueue(next) {
    if (!next) return;
    if (G.dual) G.dual.spawned = !(G.queue && G.queue.length);
    if (matchWouldEnd() || G.mode !== 'play' || G.phase === 'end') {
      if (!G.shots || !G.shots.length) finishFly();
      return;
    }
    const jit = next.jitter ? rand(-next.jitter, next.jitter) : 0;
    const ang = clamp(next.ang + jit, 0, 180);
    const wep2 = next.wep;
    const shell = makeShell(next.sx, next.sy, ang, next.power, wep2, next.owner, {
      ult: !!next.ult,
      lead: !!next.lead,
      follow: !!next.follow,
      extra: !!next.extra,
      wind: next.wind,
      windMul: next.windMul != null ? next.windMul : 1
    });
    if (!G.shots) G.shots = [];
    G.shots.push(shell);
    G.shot = shell;
    G.phase = 'fly';
    audio.fire(wep2);
    audio.beep(next.follow ? 420 : 360, 0.07, 'sine', 0.028, next.follow ? 760 : 640);
    burst(next.sx, next.sy, next.ult ? GOLD : (next.follow ? PEARL : (wep2 && wep2.id === 7 ? PEARL : GOLD)), 6, 70, 0.22);
    syncHud();
  }

  function tickQueue(dt) {
    if (!G.queue || !G.queue.length) {
      if (G.dual) G.dual.spawned = true;
      return;
    }
    G.salvoT = (G.salvoT || 0) + dt;
    while (G.queue && G.queue.length) {
      const i = nextQueueIdx();
      if (i < 0 || G.queue[i].at > G.salvoT) break;
      const next = G.queue.splice(i, 1)[0];
      spawnFromQueue(next);
      if (G.phase === 'end' || G.mode !== 'play') break;
    }
    if (G.dual) G.dual.spawned = !(G.queue && G.queue.length);
  }

  function spawnDualFollow() {
    tickQueue(0);
  }

  function finishFly() {
    const owner = (G.dual && G.dual.owner) || (G.shot && G.shot.owner) || curUnit();
    if (owner && owner.ult) owner.ult = false;
    G.dual = null;
    G.queue = [];
    G.salvoT = 0;
    G.shots = [];
    G.shot = null;
    trail.length = 0;
    G.phase = 'settle';
    G.settleT = 0.22;
    tickFires();
    eachUnit(refreshBury);
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
    if (inGround(x, y) || inWall(x, y) || inMirror(x, y)) return true;
    const gy = groundAt(x);
    if (!(gy - y >= 56)) return true;
    for (let a = 0; a < 8; a++) {
      const th = a * TAU / 8;
      const wx = x + Math.cos(th) * FRUIT_WALL;
      const wy = y + Math.sin(th) * FRUIT_WALL;
      if (inWall(wx, wy) || inMirror(wx, wy)) return true;
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

  function crateModeOk() {
    if (G.kind === 'drill') return false;
    if (G.kind !== 'hall' && G.kind !== 'core' && G.kind !== 'seat' && G.kind !== 'duo' && G.kind !== 'quad') return false;
    return true;
  }

  function crateLate() {
    return !!G.sudden;
  }

  function liveCrateCount() {
    return (G.crates && G.crates.length) ? G.crates.length : 0;
  }

  function rollCrateKind(r) {
    r = r == null ? Math.random() : r;
    if (r < CRATE_ITEM_P) return 'item';
    if (r < CRATE_ITEM_P + CRATE_RAGE_P) return 'rage';
    return 'gold';
  }

  function crateBlocked(x) {
    if (!crateGroundOk(x)) return true;
    const gy = groundAt(x);
    const bodies = allUnits();
    for (let bi = 0; bi < bodies.length; bi++) {
      const u = bodies[bi];
      if (!u || u.hp <= 0) continue;
      if (hypot(x - u.x, gy - u.r - u.y) < 48) return true;
    }
    const list = G.crates;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (Math.abs(x - list[i].x) < 56) return true;
      }
    }
    return false;
  }

  function pickCrateSpot() {
    for (let i = 0; i < 48; i++) {
      const x = rand(48, VW - 48);
      if (!crateBlocked(x)) return { x: x, y: groundAt(x) };
    }
    for (let x = 80; x < VW - 80; x += 24) {
      if (!crateBlocked(x)) return { x: x, y: groundAt(x) };
    }
    return null;
  }

  function spawnCrateAt(x) {
    if (!G.crates) G.crates = [];
    const gy = groundAt(x) - CRATE_R;
    const snap = !!REDUCE;
    G.crates.push({
      x: x,
      y: snap ? gy : 22,
      vy: 0,
      r: CRATE_R,
      bounce: snap ? 0 : 1,
      landY: gy
    });
    if (!snap) {
      burst(x, 28, WOOD, REDUCE ? 2 : 6, 40, 0.18);
    }
    return G.crates[G.crates.length - 1];
  }

  function maybeDropCrate(force) {
    G.crates = G.crates || [];
    if (!crateModeOk()) return null;
    if ((G.turns | 0) < 1) return null;
    if (G.crates.length >= CRATE_MAX) return null;
    if (!force && Math.random() >= (crateLate() ? CRATE_SUDDEN_P : CRATE_P)) return null;
    const p = pickCrateSpot();
    if (!p) return null;
    return spawnCrateAt(p.x);
  }

  function clearCrates(puff) {
    const list = G.crates;
    if (list && puff) {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        burst(c.x, c.y, WOOD, REDUCE ? 3 : 6, 40, 0.16);
      }
    }
    if (list) list.length = 0;
  }

  function grantCrate(owner, kind) {
    if (!owner || owner.stake) return null;
    if (!owner.items) owner.items = { leap: 0, warp: 0, neon: 0, drum: 0, nixi: 0, veil: 0 };
    ensureBag(owner);
    if (kind === 'gold') {
      addRage(owner, CRATE_GOLD_RAGE);
      return { kind: 'gold', toast: CRATE_GOLD_NAME };
    }
    if (kind === 'bag') return grantBagItem(owner);
    if (kind === 'item') {
      const open = [];
      for (let i = 0; i < ITEM_KEYS.length; i++) {
        const k = ITEM_KEYS[i];
        if ((owner.items[k] || 0) < fruitCap(k)) open.push(k);
      }
      if (open.length) {
        const k = open[irand(0, open.length - 1)];
        owner.items[k] = (owner.items[k] || 0) + 1;
        return { kind: 'item', toast: CRATE_NAME + ' · 术', id: k, name: ITEM_NAME[k] };
      }
      kind = 'rage';
    }
    addRage(owner, CRATE_RAGE);
    return { kind: 'rage', toast: CRATE_NAME + ' · 怒' };
  }

  function collectCrate(idx, owner) {
    const list = G.crates;
    if (!list || idx < 0 || idx >= list.length) return;
    const c = list[idx];
    list.splice(idx, 1);
    burst(c.x, c.y, WOOD, REDUCE ? 6 : 14, 120, 0.36);
    burst(c.x, c.y, GOLD, REDUCE ? 3 : 7, 80, 0.22);
    ringAt(c.x, c.y, WOOD, 22);
    audio.ensure();
    audio.beep(240, 0.07, 'square', 0.03, 180);
    audio.beep(420, 0.08, 'triangle', 0.024, 720);
    const got = grantCrate(owner, maybeBagCrate(rollCrateKind()));
    if (got && got.kind === 'gold') {
      toast(CRATE_GOLD_NAME, false, true);
      floatText(c.x, c.y - 14, '+' + CRATE_GOLD_RAGE, GOLD, false);
    } else if (got && got.kind === 'rage') {
      toast(CRATE_NAME + ' · 怒', false, true);
      floatText(c.x, c.y - 14, '+' + CRATE_RAGE, GOLD, false);
    } else if (got && got.kind === 'item') {
      toast(CRATE_NAME + ' · 术', false, false);
      floatText(c.x, c.y - 14, got.name || '术', HOT, false);
    } else if (got && got.kind === 'bag') {
      toast(got.toast || (CRATE_NAME + ' · ' + (got.name || '袋')), false, false, BAG_TINT[got.id]);
      floatText(c.x, c.y - 14, got.name || '袋', GOLD, false);
    } else {
      toast(CRATE_NAME, false, false);
    }
    syncHud();
  }

  function crateAt(x, y) {
    const list = G.crates;
    if (!list || !list.length) return null;
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (hypot(x - c.x, y - c.y) <= c.r + 5) return c;
    }
    return null;
  }

  function blastCrates(x, y, splash, owner) {
    const list = G.crates;
    if (!list || !list.length) return;
    const r = splash || 0;
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      const d = hypot(x - c.x, y - c.y);
      if (d <= r || d <= c.r + 5) collectCrate(i, owner);
    }
  }

  function tryPickCrates(u) {
    if (!u || u.hp <= 0) return;
    const list = G.crates;
    if (!list || !list.length) return;
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      if (hypot(u.x - c.x, u.y - c.y) <= (u.r || UNIT_R) + c.r) collectCrate(i, u);
    }
  }

  function tickCrates(dt) {
    const list = G.crates;
    if (!list || !list.length) return;
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      if (isDeathVoid(c.x) || groundAt(c.x) >= VH - 12) {
        burst(c.x, c.y, WOOD, REDUCE ? 3 : 6, 40, 0.16);
        list.splice(i, 1);
        continue;
      }
      const gy = groundAt(c.x) - c.r;
      c.landY = gy;
      if (REDUCE) {
        c.y = gy;
        c.vy = 0;
        c.bounce = 0;
        continue;
      }
      if (c.y < gy - 0.4) {
        c.vy += GRAV * dt;
        c.y += c.vy * dt;
        if (c.y >= gy) {
          c.y = gy;
          if (c.bounce > 0 && c.vy > 50) {
            c.vy = -c.vy * 0.34;
            c.bounce -= 1;
          } else {
            c.vy = 0;
            c.bounce = 0;
          }
        }
      } else {
        c.y = gy;
        if (c.vy > 0) c.vy = 0;
      }
    }
    eachUnit(tryPickCrates);
  }

  function crateWalkBias(from, walkTo, best) {
    const list = G.crates;
    if (!from || !list || !list.length) return walkTo;
    const foe = otherUnit(from);
    if (!foe || foe.hp <= 0) return walkTo;
    if ((from.hp || 0) < 40) return walkTo;
    if (best && best.score >= 10000) return walkTo;
    if (foe.hp <= 24 && best && best.score >= 4800) return walkTo;
    let crate = null;
    let cd = 1e9;
    for (let i = 0; i < list.length; i++) {
      const d = Math.abs(list[i].x - from.x);
      if (d < cd) {
        cd = d;
        crate = list[i];
      }
    }
    if (!crate) return walkTo;
    const fd = Math.abs(foe.x - from.x);
    if (!(cd < fd)) return walkTo;
    const dir = crate.x >= from.x ? 1 : -1;
    let nx = clamp((walkTo == null ? from.x : walkTo) + dir * CRATE_WALK, 28, VW - 28);
    if (isDeathVoid(nx)) return walkTo;
    if (wallBlocksWalk(nx, groundAt(nx) - (from.r || UNIT_R), from.r || UNIT_R)) return walkTo;
    if (G.sudden && (nx < G.safeL + 16 || nx > G.safeR - 16)) return walkTo;
    if (Math.abs(nx - from.x) > WALK_PX) nx = from.x + Math.sign(nx - from.x) * WALK_PX;
    return nx;
  }

  function explode(x, y, wep, owner, fromHit, shot, opts) {
    opts = opts || {};
    if (shot === undefined) shot = G.shot;
    const keepPhase = !!opts.keepPhase;
    G.killVictim = null;
    let crater = wep.crater;
    const wasUlt = opts.ult != null ? !!opts.ult : !!(shot ? shot.ult : (owner && owner.ult));
    const ultMul = wasUlt ? 1.35 : 1;
    if (wasUlt) crater = Math.round(crater * 1.35);
    crater = Math.round(sandR(crater));
    crater = Math.round(stoneR(crater, x));
    crater = Math.round(iceR(crater, x));
    crater = Math.round(mirrorR(crater, x));
    crater = Math.round(wellR(crater, x));
    crater = (crater || 0) + (wep.craterAdd || 0);
    let hit = !!fromHit;
    if (wep.id === 4) {
      const terrainMul = G.mapId === 'dune' ? DUNE_CRATER : (isGateStoneX(x) ? GATE_CRATER : (isFrostIce(x) ? FROST_CRATER : (isMirrorStoneX(x) ? MIRROR_CRATER : (isWellLipX(x) ? WELL_LIP_CRATER : (isWellMudX(x) ? WELL_MUD_CRATER : 1)))));
      const pops = carveCluster(x, y, ultMul * terrainMul * (wep.craterMul || 1), wep.craterAdd || 0);
      for (let i = 0; i < pops.length; i++) {
        const pop = pops[i];
        snapBridge(pop.x, pop.r, wep);
        snapForge(pop.x, pop.r);
        snapArcade(pop.x, pop.r, wep);
        snapMoon(pop.x, pop.r, wep);
        punchCover(pop.x, pop.y, pop.r, wep);
        if (applyBlast(pop.x, pop.y, wep, owner, wasUlt)) hit = true;
        blastCrates(pop.x, pop.y, wep.splash, owner);
        burst(pop.x, pop.y, hit ? HOT : DIRT, hit ? 12 : 8, 160, 0.4);
        ringAt(pop.x, pop.y, HOT, pop.r * 1.5);
      }
      burst(x, y, GOLD, hit ? 8 : 3, 120, 0.32);
    } else {
      carve(x, y, crater);
      snapBridge(x, crater, wep);
      snapForge(x, crater);
      snapArcade(x, crater, wep);
      snapMoon(x, crater, wep);
      punchCover(x, y, crater, wep);
      if (wep.id === 2 && shot && shot.pierced) {
        const s = hypot(shot.vx, shot.vy) || 1;
        const ux = shot.vx / s;
        const uy = shot.vy / s;
        for (let s2 = 0; s2 <= 46; s2 += 4) {
          const px = x - ux * s2;
          const py = y - uy * s2;
          carve(px, py, 12);
          punchWall(px, py, 12);
        }
      }
      hit = applyBlast(x, y, wep, owner, wasUlt) || hit;
      blastCrates(x, y, wep.splash, owner);
      const rgb = wep.id === 8 ? MINE : (wep.id === 7 ? PEARL : (wep.id === 6 ? FIRE : (hit ? unitRgb(owner) : DIRT)));
      burst(x, y, rgb, hit ? 28 : 16, hit ? 260 : 180, 0.55);
      burst(x, y, wep.id === 8 ? MINE : (wep.id === 7 ? PEARL : (wep.id === 6 ? FIRE : GOLD)), hit ? 10 : 4, 140, 0.35);
      ringAt(x, y, wep.id === 8 ? MINE : (wep.id === 7 ? PEARL : (wep.id === 6 ? FIRE : (hit ? GOLD : HOT))), crater * 1.6);
    }
    if (wep.id === 6) plantFire(x, y, wasUlt, owner);
    dirtBurst(x, y, hit ? 14 : 20);
    audio.boom(hit, wep, wasUlt);
    setCamImpact(x, y, !!fromHit);
    if (wasUlt && (!shot || (shot.lead && !shot.extra) || !G.dual)) {
      floatText(x, y - 48, '殿破', GOLD, true);
      screenFlash(GOLD, 0.45);
      hitStop(0.12);
      kick(6.5);
    }
    if (!keepPhase && G.shots && shot) {
      const ix = G.shots.indexOf(shot);
      if (ix >= 0) G.shots.splice(ix, 1);
    }
    if (!keepPhase && G.shot === shot) G.shot = (G.shots && G.shots[0]) || null;
    if (!keepPhase && G.dual && hit) G.dual.hit = true;
    const more = flyStillGoing();
    if (hit) {
      audio.hit();
      hitStop(fromHit ? HIT_STOP_DIRECT : 0.09);
      if (fromHit && !REDUCE) G.slowMo = Math.max(G.slowMo || 0, 0.10);
      kick(fromHit ? 10.5 : 5.6);
      if (fromHit && !REDUCE) {
        G.punch = Math.max(G.punch, 1.14);
        cam.tz = Math.max(cam.tz, 1.30);
      }
      screenFlash(wasUlt ? GOLD : (wep.id === 7 ? PEARL : unitRgb(owner)), wasUlt ? 0.45 : 0.28);
      if (!G.dual || !G.dual.comboDone) {
        G.combo += 1;
        if (G.dual) G.dual.comboDone = true;
        if (G.combo >= 2) {
          floatText(x, y - 36, '连堂 ×' + G.combo, GOLD, true);
          audio.combo(G.combo);
          if (comboEl) {
            comboEl.classList.remove('hot');
            void comboEl.offsetWidth;
            comboEl.classList.add('hot');
          }
        }
      }
    } else if (!more) {
      if (!(G.dual && G.dual.hit)) G.combo = 0;
      audio.dirt();
      kick(2.8);
    } else {
      audio.dirt();
      kick(2.8);
    }
    if (G.killVictim) {
      armKillCam(G.killVictim);
      G.killVictim = null;
    }
    if (!keepPhase && (!shot || shot.lead)) commitLastGhost(x, y);
    eachUnit(ungroundIfAir);
    eachUnit(refreshBury);
    triggerQuake(x, y, wep, wep && wep.id === 4 ? QUAKE_R : crater);
    if (keepPhase) {
      if (G.mode === 'play') checkEnd();
      syncHud();
      return;
    }
    if (more) {
      G.phase = 'fly';
      syncHud();
      return;
    }
    finishFly();
  }

  function fizzleMine(m, silent) {
    if (!m) return;
    const list = G.mines;
    if (list) {
      const ix = list.indexOf(m);
      if (ix >= 0) list.splice(ix, 1);
    }
    burst(m.x, m.y, DIRT, REDUCE ? 4 : 8, 50, 0.22);
    ringAt(m.x, m.y, MINE, 16);
    if (!silent) {
      audio.ensure();
      audio.beep(180, 0.08, 'sine', 0.028, 70);
      toast('迟雷熄了', false, false);
    }
  }

  function fizzleSideMine(side, silent) {
    const old = liveMineOf(side);
    if (old) fizzleMine(old, silent);
  }

  function plantMine(s) {
    if (!s) return;
    const owner = s.owner;
    const side = owner && owner.side ? owner.side : 'p';
    fizzleSideMine(side, true);
    const mx = clamp(s.x, 2, VW - 2);
    let my = s.y;
    if (inGround(mx, my)) my = groundAt(mx);
    if (!G.mines) G.mines = [];
    G.mines.push({
      x: mx,
      y: my,
      side: side,
      owner: owner,
      wep: s.wep,
      fuse: MINE_FUSE,
      max: MINE_FUSE,
      ult: !!s.ult,
      t: 0
    });
    if (G.shots) {
      const ix = G.shots.indexOf(s);
      if (ix >= 0) G.shots.splice(ix, 1);
    }
    if (G.shot === s) G.shot = (G.shots && G.shots[0]) || null;
    if (!s.follow) commitLastGhost(mx, my);
    toast('迟雷', false, true);
    audio.ensure();
    audio.beep(140, 0.1, 'triangle', 0.032, 90);
    audio.beep(320, 0.08, 'sine', 0.024, 520);
    burst(mx, my, MINE, REDUCE ? 5 : 10, 70, 0.28);
    ringAt(mx, my, MINE, 22);
    if (flyStillGoing()) {
      G.phase = 'fly';
      syncHud();
      return;
    }
    finishFly();
  }

  function detonateMine(m) {
    if (!m) return;
    const list = G.mines;
    if (list) {
      const ix = list.indexOf(m);
      if (ix >= 0) list.splice(ix, 1);
    }
    const wep = m.wep || WEPS[7] || WEPS[0];
    explode(m.x, m.y, wep, m.owner, false, null, { keepPhase: true, ult: !!m.ult });
  }

  function tickMines(dt) {
    if (G.mode !== 'play') return;
    const list = G.mines;
    if (!list || !list.length) return;
    const snap = list.slice();
    for (let i = 0; i < snap.length; i++) {
      const m = snap[i];
      if (!m || list.indexOf(m) < 0) continue;
      m.t = (m.t || 0) + dt;
      m.fuse -= dt;
      if (m.fuse <= 0) detonateMine(m);
    }
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

  function stepOneShot(s, dt) {
    if (!s) return;
    const sw = s.wind != null ? s.wind : G.wind;
    const wm = s.windMul != null ? s.windMul : 1;
    s.vx += sw * windKAt(s.wep, s.life) * wm * dt;
    s.vy += (GRAV + gustAy(s.x)) * dt;
    const ox = s.x;
    const oy = s.y;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life += dt;
    if (!s.trail) s.trail = [];
    s.trail.push({ x: s.x, y: s.y, a: 1 });
    if (s.trail.length > 42) s.trail.shift();
    if (s.lead) {
      trail.push({ x: s.x, y: s.y, a: 1 });
      if (trail.length > 42) trail.shift();
      if (G.ghostPend) G.ghostPend.points.push({ x: s.x, y: s.y, a: 1 });
    }
    sweepFruits(ox, oy, s.x, s.y, s.owner);
    if (s.x < 2 || s.x > VW - 2 || s.y > VH + 20) {
      explode(clamp(s.x, 2, VW - 2), Math.min(s.y, VH - 4), s.wep, s.owner, false, s);
      return;
    }
    if (crateAt(s.x, s.y)) {
      if (isMineWep(s.wep)) explode(s.x, s.y, mineHitWep(s.wep), s.owner, false, s);
      else explode(s.x, s.y, s.wep, s.owner, false, s);
      return;
    }
    const u = unitAt(s.x, s.y, s.owner);
    if (u) {
      if (isMineWep(s.wep)) explode(s.x, s.y, mineHitWep(s.wep), s.owner, true, s);
      else explode(s.x, s.y, s.wep, s.owner, true, s);
      return;
    }
    if (inGround(s.x, s.y) || inWall(s.x, s.y) || inMirror(s.x, s.y)) {
      if (wantMirrorBounce(s, s.x, s.y)) {
        applyMirrorBounce(s);
        return;
      }
      if (wantIceSkip(s, s.x)) {
        applyIceSkip(s);
        return;
      }
      if (isMineWep(s.wep)) {
        if (isDeathVoid(s.x) || s.y > VH || inMirror(s.x, s.y)) explode(clamp(s.x, 2, VW - 2), Math.min(s.y, VH - 4), s.wep, s.owner, false, s);
        else plantMine(s);
        return;
      }
      if (s.wep.id === 2 && !s.pierced && !s.mirrorBounce) {
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
        while ((inGround(s.x, s.y) || inWall(s.x, s.y) || inMirror(s.x, s.y)) && g < 18) {
          s.x += ux * 3;
          s.y += uy * 3;
          g += 1;
        }
        sweepFruits(px, py, s.x, s.y, s.owner);
        burst(s.x, s.y, HOT, 10, 120, 0.3);
        audio.tick();
        return;
      }
      explode(s.x, s.y, s.wep, s.owner, false, s);
      return;
    }
    if (s.pierced) {
      s.fuse -= dt;
      if (s.fuse <= 0) explode(s.x, s.y, s.wep, s.owner, false, s);
    }
  }

  function stepShot(dt) {
    tickQueue(dt);
    if (G.phase !== 'fly') return;
    const list = G.shots && G.shots.length ? G.shots.slice() : (G.shot ? [G.shot] : []);
    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (G.shots && G.shots.indexOf(s) < 0) continue;
      if (G.phase !== 'fly') return;
      G.shot = s;
      stepOneShot(s, dt);
    }
    if (G.phase === 'fly') {
      const live = (G.shots && G.shots[0]) || G.shot;
      if (live) setCamShot(live);
      else if (G.queue && G.queue.length && G.queue[0].owner) setCamShooter(G.queue[0].owner);
      else if (G.dual && !G.dual.spawned && G.dual.owner) setCamShooter(G.dual.owner);
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
      tryPickCrates(L.u);
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
    tryPickCrates(u);
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
    const needWind = aiHard() ? 2 : NIXI_WIND;
    if (Math.abs(G.wind) < needWind) return false;
    if (!aiHard() && score >= NIXI_MISS) return false;
    const old = G.wind;
    G.wind = -old;
    const rev = solveAI(from).score;
    G.wind = old;
    const gain = aiHard() ? 120 : 400;
    return rev > score + gain;
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
    maybeDropCrate();
    if (G.kind === 'drill') beginTurn('p');
    else if (isSquad()) {
      applyActDelay(actor);
      beginTurn(pickNextId());
    } else beginTurn(G.turn === 'p' ? 'f' : 'p');
  }

  function aiWantVeil(from) {
    if (aiEasy()) return false;
    if (!from || !from.items || (from.items.veil | 0) <= 0) return false;
    if ((from.stam || 0) < ITEM_COST.veil) return false;
    const foe = otherUnit(from);
    if (!foe) return false;
    const dist = Math.abs(from.x - foe.x);
    if (aiHard()) return (from.hp || 0) < 70 || dist < 12 * GRID;
    if ((from.hp || 0) >= VEIL_HP) return false;
    return dist < VEIL_GRIDS * GRID;
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

  function skipTurn(fromClock) {
    if (G.mode !== 'play') return false;
    if (!humanTurn()) return false;
    if (fromClock) {
      if (G.phase !== 'aim' && G.phase !== 'charge') return false;
      if (G.busy === 'leap') return false;
    } else if (G.phase !== 'aim' || G.busy) return false;
    if (G.busy === 'warpAim') G.busy = null;
    const u = curUnit();
    if (u && u.ult) u.ult = false;
    consumeBagOnSkip(u);
    G.neonOn = false;
    G.combo = 0;
    G.charging = false;
    G.busy = null;
    G.actDelay = { skip: true, wepId: 0, ult: false };
    audio.chargeStop();
    if (fromClock) {
      audio.ensure();
      audio.beep(240, 0.09, 'square', 0.028, 80);
      toast('时尽', true, false);
    } else toast('跳过', false, false);
    G.phase = 'settle';
    G.settleT = 0.10;
    tickFires();
    syncHud();
    return true;
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
      dirtGeyser(u.x, u.y + (u.r || 14));
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

  function dirtUnderFeet(u) {
    if (!u) return 999;
    const g0 = groundAt(u.x, u.y);
    let solid = 0;
    for (let dx = -UNIT_R; dx <= UNIT_R; dx++) {
      const g = groundAt(clamp(u.x + dx, 0, VW - 1), u.y);
      if (g <= g0 + 8) solid += 1;
    }
    return solid;
  }

  function quakeLedge(u) {
    if (!u || u.hp <= 0 || !u.grounded || u.buried) return false;
    if (thinLedge(u)) return true;
    return dirtUnderFeet(u) < QUAKE_LEDGE;
  }

  function wantQuake(wep, crater) {
    const id = wep && wep.id;
    if (id === 1 || id === 4 || id === 8) return true;
    return (crater || 0) >= QUAKE_R;
  }

  function quakeSlip(u, cx, force) {
    if (!u || !quakeLedge(u)) return 0;
    if (Math.abs(u.x - cx) > QUAKE_NEAR) return 0;
    if (!force && Math.random() >= QUAKE_SLIP_P) return 0;
    let dir = u.x < cx ? 1 : (u.x > cx ? -1 : 0);
    if (!dir) {
      const gl = groundAt(clamp(u.x - 20, 0, VW - 1), u.y);
      const gr = groundAt(clamp(u.x + 20, 0, VW - 1), u.y);
      dir = gr > gl + 1 ? 1 : (gl > gr + 1 ? -1 : (u.face || 1));
    }
    const dist = rand(QUAKE_SLIP_MIN, QUAKE_SLIP_MAX);
    const nx = clamp(u.x + dir * dist, 22, VW - 22);
    if (wallBlocksWalk(nx, u.y, u.r || UNIT_R)) return 0;
    u.x = nx;
    ungroundIfAir(u);
    return dist;
  }

  function spawnQuakeCrumbs(cx, cy, crater) {
    const n = REDUCE ? 2 : irand(QUAKE_CRUMB_MIN, QUAKE_CRUMB_MAX);
    const r = Math.max(18, crater || QUAKE_R);
    for (let i = 0; i < n; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const px = clamp(cx + side * r * rand(0.86, 1.08) + rand(-6, 6), 4, VW - 4);
      const gy = G.H ? groundAt(px) : cy;
      spawnCrumbs(px, gy - rand(6, 16), 1);
    }
    return n;
  }

  function triggerQuake(x, y, wep, crater, opts) {
    opts = opts || {};
    if (!wantQuake(wep, crater) && !opts.force) return false;
    G.quakeT = QUAKE_T;
    G.quakeX = x;
    G.quakeY = y;
    G.quakeR = crater || QUAKE_R;
    G.quakeMag = REDUCE ? 0 : rand(QUAKE_SHAKE_MIN, QUAKE_SHAKE_MAX);
    spawnQuakeCrumbs(x, y, G.quakeR);
    eachUnit(function (u) { quakeSlip(u, x, !!opts.force); });
    return true;
  }

  let AI = { wait: 0, walked: false, ang: 65, pow: 70, wep: 0, stage: 0 };

  function denyZoneDist(foe) {
    if (!foe) return 1e9;
    if (G.mapId === 'gate') {
      if (isGateCorridor(foe.x)) return 0;
      if (!isGateLedge(foe.x)) return 1e9;
      const enter = foe.x < 480 ? GATE_L1 : GATE_R0;
      return Math.abs(enter - foe.x);
    }
    if (G.mapId === 'dune') {
      if (isDuneSaddle(foe.x)) return 0;
      if (!isDuneCrest(foe.x)) return 1e9;
      const enter = foe.x < 480 ? 360 : 600;
      return Math.abs(enter - foe.x);
    }
    if (G.mapId === 'frost') {
      if (!isFrostIce(foe.x)) return 1e9;
      return Math.min(Math.abs(foe.x - FROST_ICE0), Math.abs(foe.x - FROST_ICE1));
    }
    if (G.mapId === 'well') {
      return wellExitDist(foe);
    }
    return 1e9;
  }

  function denySpotX(from, foe) {
    const sideLeft = foe ? foe.x < 480 : true;
    if (G.mapId === 'gate') return sideLeft ? GATE_L1 + 36 : GATE_R0 - 36;
    if (G.mapId === 'dune') return sideLeft ? 400 : 560;
    if (G.mapId === 'frost') {
      const leftLip = foe ? Math.abs(foe.x - FROST_ICE0) <= Math.abs(foe.x - FROST_ICE1) : true;
      return leftLip ? FROST_ICE0 - 22 : FROST_ICE1 + 22;
    }
    if (G.mapId === 'well') return wellExitX(foe);
    return 0;
  }

  function wantChiLei(from, foe) {
    if (aiEasy()) return false;
    if ((G.turns | 0) < 2) return false;
    if (!from || !foe || foe.hp <= 0) return false;
    if (foe.hp <= 24) return false;
    if (liveMineOf(from.side)) return false;
    if (G.mapId !== 'gate' && G.mapId !== 'dune' && G.mapId !== 'frost' && G.mapId !== 'well') return false;
    if (G.mapId === 'gate' && isGateCorridor(foe.x)) return false;
    if (G.mapId === 'dune' && isDuneSaddle(foe.x)) return false;
    if (G.mapId === 'frost' && !isFrostIce(foe.x)) return false;
    if (G.mapId === 'well' && !inWell(foe)) return false;
    if (G.mapId === 'well' && wellExitDist(foe) > 48) return false;
    const dist = denyZoneDist(foe);
    if (dist >= 1e8) return false;
    const reach = aiHard() ? WALK_PX * 2.2 : WALK_PX * 1.4;
    return dist > 8 && dist <= reach;
  }

  function pickAIWeapon(from) {
    from = from || curUnit() || G.f;
    const foes = foesOf(from);
    const foe = foes[0] || otherUnit(from) || G.p;
    if (foe) {
      const pit = pitDepth(foe);
      if (foe.buried || walkBlocked(foe)) return 6;
      if (wantChiLei(from, foe)) return 7;
      if (pit > (aiHard() ? 8 : 16)) return 6;
      if (thinLedge(foe)) return 3;
      if (G.mapId === 'bridge' && liveBridge(foe.x)) return 3;
      if (G.mapId === 'forge' && isForgeCrust(foe.x) && !isDeathVoid(foe.x)) return 3;
      if (G.mapId === 'arcade' && liveArcade(foe.x)) return 3;
      if (G.mapId === 'towers' && isTowersLedge(foe.x)) return 3;
      if (G.mapId === 'moon' && isMoonRim(foe.x)) return 1;
      if (G.mapId === 'cliff' && isCliffPlateau(foe.x)) return 1;
      if (G.mapId === 'cliff' && isCliffBeach(foe.x)) return 3;
      if (G.mapId === 'dune' && isDuneSaddle(foe.x)) return 1;
      if (G.mapId === 'gate' && isGateCorridor(foe.x)) return 1;
      if (G.mapId === 'gate' && isGateCrown(foe.x) && Math.abs(foe.x - from.x) > 6 * GRID) return 0;
      if (G.mapId === 'frost' && isFrostIce(foe.x)) return 1;
      if (G.mapId === 'cloud' && isCloudSlabX(foe.x)) return 0;
      if (G.mapId === 'well' && inWell(foe)) return 1;
      if (G.mapId === 'well' && isWellBank(foe.x) && Math.abs(foe.x - from.x) > 6 * GRID) return 0;
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

  function scoreOne(imp, wep, from, t, ang) {
    let tx = t.x;
    if (G.mapId === 'cloud' && G.slab && G.slab.live && isCloudSlabX(t.x)) {
      tx = t.x + (G.slab.vx || 0) * (imp.t || 0);
    }
    const d = hypot(imp.x - tx, imp.y - t.y);
    const feet = hypot(imp.x - tx, imp.y - (t.y + t.r));
    const mid = Math.abs(imp.x - (from.x + tx) * 0.5);
    let score = 200 - d * 0.45 - mid * 0.05;
    if (imp.hit === t) score = 12000 - imp.t * 40;
    else if (d < wep.splash) score = 5000 - d * 28;
    else if (feet < 40) score = 1800 - feet * 16;
    let bury = 0;
    const feetX = Math.abs(imp.x - tx);
    const craterEff = wep.id === 4 ? 54 : wep.crater;
    if (feetX < 34 && craterEff >= 30) bury += 900 + craterEff * 0.7 * 8;
    if (pitDepth(t) > 16 && feetX < 50 && wep.id === 4) bury += 1600;
    if ((pitDepth(t) > 16 || t.buried) && feetX < 56 && wep.id === 7) bury += 2000;
    if (pitDepth(t) > 28 && feetX < 50) bury += 1400;
    if (G.mapId === 'bridge' && liveBridge(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 800;
    if (G.mapId === 'ruins' && (wep.id === 1 || wep.id === 4) && inWall(imp.x, imp.y)) bury += 600;
    if (G.mapId === 'forge' && isForgeCrust(imp.x) && G.H && G.H[imp.x | 0] < FORGE_VOID - 20) bury += 900;
    if (G.mapId === 'arcade' && liveArcade(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 800;
    if (G.mapId === 'moon' && isMoonRim(imp.x) && wep.id === 1) bury += 800;
    if (G.mapId === 'cliff' && isCliffPlateau(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 700;
    if (G.mapId === 'cliff' && isCliffBeach(imp.x) && wep.id === 4) bury += 600;
    if (G.mapId === 'towers' && inWall(imp.x, imp.y) && (wep.id === 1 || wep.id === 4)) bury += 600;
    if (G.mapId === 'towers' && inWall(imp.x, imp.y) && wep.id === 2) bury += 500;
    if (G.mapId === 'dune' && isDuneSaddle(t.x)) {
      const e = ang != null ? elev(ang) : 0;
      if (e >= 78) score += 1600;
      else if (e >= 70) score += 700;
      if (feetX < 52) bury += 900;
    }
    if (G.mapId === 'dune' && isDuneSaddle(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 700;
    if (G.mapId === 'gate' && isGateCorridor(t.x)) {
      const e = ang != null ? elev(ang) : 0;
      if (e >= 78) score += 1600;
      else if (e >= 70) score += 700;
      if (wep.id === 1) score += 500;
    }
    if (G.mapId === 'gate' && isGateCrown(t.x)) {
      const far = Math.abs(t.x - from.x) > 6 * GRID;
      const e = ang != null ? elev(ang) : 0;
      if (far && e >= 58 && e <= 72) score += 1400;
      else if (!far && e >= 78) score += 1200;
    }
    if (G.mapId === 'gate' && isGateCorridor(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 700;
    if (G.mapId === 'frost' && isFrostIce(t.x)) {
      const e = ang != null ? elev(ang) : 0;
      if (e >= 78) score += 1600;
      else if (e >= 58 && e <= 72) score += 1400;
      else if (e < 32) score -= 900;
    }
    if (G.mapId === 'frost' && isFrostIce(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 700;
    if (G.mapId === 'cloud' && (isCloudSlabX(t.x) || isCloudSlabX(imp.x))) {
      const e = ang != null ? elev(ang) : 0;
      if (e >= 58 && e <= 72) score += 1400;
      else if (e >= 50 && e <= 78) score += 400;
      if (isCloudSlabX(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 500;
    }
    if (G.mapId === 'mirror') {
      const e = ang != null ? elev(ang) : 0;
      const live = !!(G.mirror && G.mirror.live);
      const far = isMirrorBank(from.x) && isMirrorBank(t.x) && ((from.x < 480) !== (t.x < 480));
      const landD = Math.abs(imp.x - t.x);
      if (far && live) {
        if (imp.mirrorBounce) {
          if (landD < 90) score += 2400;
          else if (landD < 150) score += 1000;
          else score -= 400;
          if (e >= 40 && e <= 55) score += 800;
        } else {
          if (e >= 58 && e <= 72) score += 1400;
          else if (e >= 50 && e <= 78) score += 400;
        }
      } else if (live && imp.mirrorBounce) {
        if (landD < 80) score += 1600;
        if (e >= 40 && e <= 55) score += 600;
      }
      if (isMirrorTrenchX(imp.x) && (wep.id === 1 || wep.id === 4)) bury += 500;
    }
    if (G.mapId === 'well' && inWell(t)) {
      const e = ang != null ? elev(ang) : 0;
      if (e >= 78) score += 1600;
      else if (e >= 70) score += 700;
      if (wep.id === 1) score += 500;
      if (wep.id === 8) score += 400;
    }
    if (G.mapId === 'well' && isWellBank(t.x)) {
      const far = Math.abs(t.x - from.x) > 6 * GRID;
      const e = ang != null ? elev(ang) : 0;
      if (far && e >= 58 && e <= 72) score += 1400;
      else if (!far && e >= 78) score += 1200;
      else if (e >= 28 && e <= 36) score += 200;
    }
    if (G.mapId === 'well' && isWellMudX(imp.x) && (wep.id === 1 || wep.id === 4 || wep.id === 8)) bury += 700;
    if (G.mapId === 'well' && isWellLipX(imp.x) && wep.id === 1) bury += 500;
    if (wep.id === 8) {
      const spot = denySpotX(from, t);
      if (spot) {
        const dx = Math.abs(imp.x - spot);
        score += 5200 - dx * 8;
        if (imp.hit) score -= 3600;
        else if (G.mapId === 'gate' && isGateCorridor(imp.x)) score += 900;
        else if (G.mapId === 'dune' && isDuneSaddle(imp.x)) score += 900;
        else if (G.mapId === 'frost' && isFrostBank(imp.x)) score += 900;
        else if (G.mapId === 'well' && isWellLipX(imp.x)) score += 900;
      }
    }
    score += bury;
    return score;
  }

  function scoreImpact(imp, wep, from, ang) {
    if (!imp || !from) return -1e9;
    const foes = foesOf(from);
    if (!foes.length) return -1e9;
    let score = -1e9;
    for (let i = 0; i < foes.length; i++) {
      const sc = scoreOne(imp, wep, from, foes[i], ang);
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
        const sc = scoreImpact(imp, wep, from, ang);
        if (sc > best.score) best = { score: sc, ang: ang, pow: pow };
      }
    }
    for (let ang = best.ang - 3; ang <= best.ang + 3; ang += 1) {
      for (let pow = best.pow - 4; pow <= best.pow + 4; pow += 1) {
        if (ang < 8 || ang > 172 || pow < 14 || pow > 100) continue;
        const m = muzzle(ang);
        const imp = traceShot(m.x, m.y, ang, pow, G.wind, wep, G.H, from);
        const sc = scoreImpact(imp, wep, from, ang);
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
    walkTo = crateWalkBias(from, walkTo, best);
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

  function pickDelayWep(from, curIdx, score, ult) {
    if (!aiHard() || !isDuo() || !from) return curIdx;
    const curId = (WEPS[curIdx] || WEPS[0]).id;
    if (score >= 10000) return curIdx;
    if (delayKeepsTurn(from, curId, ult)) return curIdx;
    const saved = G.wep;
    const order = [0, 2, 3];
    let picked = curIdx;
    for (let i = 0; i < order.length; i++) {
      const idx = order[i];
      const id = WEPS[idx].id;
      if (delayCost(id, ult) >= delayCost(curId, ult)) continue;
      if (!delayKeepsTurn(from, id, ult) && !delayKeepsSide(from, id, ult)) continue;
      G.wep = idx;
      const sc = solveAI(from).score;
      if (sc >= score * 0.45 || sc >= 4000) {
        picked = idx;
        break;
      }
    }
    G.wep = saved;
    return picked;
  }

  function startAI() {
    const from = curUnit() || G.f;
    G.wep = pickAIWeapon(from);
    G.neonOn = false;
    syncWeps();
    if (aiHard() && G.wep !== 6 && G.wep !== 7) {
      const cur = G.wep;
      const scoreNow = solveAI(from).score;
      G.wep = 3;
      const tri = solveAI(from).score;
      if (tri <= scoreNow + 200) G.wep = cur;
    }
    const plan = { drum: false, warp: 0, leap: 0, neon: false, ult: false, nixi: false, veil: false, heal: false, bag: [] };
    const score0 = solveAI(from).score;
    const buried = pitDepth(from) >= 40;
    if (aiMayItem(false) && from.items && from.items.drum > 0) {
      if (from.rage <= 50) plan.drum = true;
      else if (from.rage < 100 && score0 >= 8000 && from.rage + 50 >= 100) plan.drum = true;
    }
    const warpX = pickAIWarp(from);
    if (warpX && aiMayItem(buried)) plan.warp = warpX;
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
      if (!leapDir && !aiEasy() && Math.random() < 0.30) {
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
      if (leapDir && !aiMayItem(buried)) leapDir = 0;
      plan.leap = leapDir;
    }
    let moved = planAIMove(from);
    let best = moved.best;
    if (aiMayItem(false) && aiWantNixi(from, best.score)) plan.nixi = true;
    if (aiWantVeil(from)) plan.veil = true;
    const mark = otherUnit(from) || G.p;
    if (aiMayItem(false) && from.items && from.items.neon > 0 && G.turns - G.aiLastNeonTurn >= 2 && mark && mark.hp > 12 && best.score >= 4000) {
      const lead = from.hp - mark.hp >= 15;
      const breakRage = mark.rage >= 80;
      const ledge = thinLedge(mark);
      if (lead || breakRage || ledge) plan.neon = true;
    }
    ensureBag(from);
    if ((from.hp || 0) < 40 && (from.bag.heal | 0) > 0 && (from.stam || 0) >= BAG_COST.heal) {
      if (aiHard() || (!aiEasy() && Math.random() < 0.45) || Math.random() < 0.08) plan.heal = true;
    }
    if (!aiEasy()) {
      const hard = aiHard();
      const wepIdx = G.wep;
      const mark2 = otherUnit(from) || G.p;
      const dist = mark2 ? Math.abs((from.x || 0) - (mark2.x || 0)) : 999;
      const close = dist < 6 * GRID;
      const exposed = mark2 && pitDepth(mark2) < BURY_PX;
      if (hard && wepIdx === 1 && exposed) {
        if (close && (from.bag.x3 | 0) > 0) plan.bag.push('x3');
        else if ((from.bag.x2 | 0) > 0) plan.bag.push('x2');
        if ((from.bag.p3 | 0) > 0) plan.bag.push('p3');
      } else if (!hard && wepIdx === 1 && exposed && (from.bag.x2 | 0) > 0 && Math.random() < 0.28) {
        plan.bag.push('x2');
      }
    }
    const rageReady = (from.rage >= 100) || (plan.drum && from.rage + 50 >= 100) ? 100 : (from.rage || 0);
    if (aiWantUlt(from, best.score, rageReady)) plan.ult = true;
    const delayIdx = pickDelayWep(from, G.wep, best.score, plan.ult);
    if (delayIdx !== G.wep) {
      G.wep = delayIdx;
      syncWeps();
      moved = planAIMove(from);
      best = moved.best;
    }
    const fogK = veilAimMul(mark);
    const jit = aiJitterBase();
    const aj = jit.ang * fogK;
    const pj = jit.pow * fogK;
    best.ang = clamp(best.ang + rand(-aj, aj), 5, 175);
    let toasted = false;
    if (!aiEasy() && !aiHard() && Math.abs(elev(best.ang) - 65) <= 8) {
      const j65 = rand(0.05, 0.08) * fogK * (Math.random() < 0.5 ? -1 : 1);
      best.pow = clamp(best.pow * (1 + j65), 16, 100);
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
      if (plan.heal) { useHeal(u); plan.heal = false; AI.wait = 0.16; return; }
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
      if (onIce(u) && u.grounded) {
        const dx = AI.walkTo - u.x;
        const close = Math.abs(dx) <= 4;
        const dir = (!close && G.walk > 0 && u.stam > 0) ? (dx > 0 ? 1 : -1) : 0;
        iceMove(u, dir, dt, true);
        if (close && Math.abs(u.slideVx || 0) < 14) {
          AI.stage = 2;
          AI.wait = 0.12;
        }
        return;
      }
      const dx = AI.walkTo - u.x;
      if (Math.abs(dx) > 2 && G.walk > 0 && u.stam > 0) {
        const dir = dx > 0 ? 1 : -1;
        const step = Math.min(G.walk, u.stam, walkSpd(u) * dt, Math.abs(dx));
        const lo = G.sudden ? G.safeL + 18 : 22;
        const hi = G.sudden ? G.safeR - 18 : VW - 22;
        const nx = clamp(u.x + dir * step, lo, hi);
        if (wallBlocksWalk(nx, u.y, u.r) || wellBlocksClimb(u.x, nx)) {
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
        tryPickCrates(u);
      } else {
        AI.stage = 2;
        AI.wait = 0.12;
      }
      return;
    }
    if (AI.stage === 2) {
      const plan = AI.plan || {};
      if (plan.bag && plan.bag.length) {
        let cost = 0;
        for (let i = 0; i < plan.bag.length; i++) {
          const id = plan.bag[i];
          const c = BAG_COST[id] || 0;
          if (((u.stam || 0) - cost) < c) continue;
          if (armBagSilent(u, id)) cost += c;
        }
        plan.bag = [];
        syncHud();
      }
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
    if (!humanTurn() || G.busy) return;
    if (G.phase !== 'aim' && G.phase !== 'charge') return;
    const u = curUnit();
    if (!u) return;
    let dir = 0;
    if (G.phase === 'aim') {
      if (keys.l || padHold.l) dir -= 1;
      if (keys.r || padHold.r) dir += 1;
    }
    if (onIce(u) && u.grounded && !walkBlocked(u)) {
      iceMove(u, dir, dt, G.phase === 'aim');
      return;
    }
    u.slideVx = 0;
    if (G.phase !== 'aim') return;
    if (!dir || G.walk <= 0 || u.stam <= 0) return;
    if (walkBlocked(u)) {
      if (G.toastT <= 0.2) toast('埋了 · 飞步或影挪', true, false);
      return;
    }
    const step = Math.min(G.walk, u.stam, walkSpd(u) * dt);
    const nx = clamp(u.x + dir * step, 22, VW - 22);
    if (wallBlocksWalk(nx, u.y, u.r)) return;
    if (wellBlocksClimb(u.x, nx)) {
      if (G.toastT <= 0.2) toast('井沿 · 飞步或砸坡', true, false);
      return;
    }
    u.x = nx;
    G.walk -= step;
    u.stam -= step;
    u.face = dir;
    u.walkT = 0.12;
    ungroundIfAir(u);
    tryPickCrates(u);
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
    G.slab = G.mapId === 'cloud' ? makeCloudSlab() : null;
    G.mirror = G.mapId === 'mirror' ? makeMirrorWall() : null;
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
    G.shots = [];
    G.dual = null;
    G.queue = [];
    G.salvoT = 0;
    G.mines = [];
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
    G.crates = [];
    G.veils = [];
    G.lastHit = null;
    G.coachN = 0;
    G.killName = '';
    G.killHold = 0;
    G.killPend = 0;
    G.killVictim = null;
    G.quakeT = 0;
    G.quakeX = 0;
    G.quakeY = 0;
    G.quakeR = 0;
    G.quakeMag = 0;
    G.ctrlSide = null;
    G.windSpinT = 0;
    G.nextWind = null;
    G.teaseWind = false;
    G.storm = false;
    G.stormT = 0;
    G.stormNext = STORM_MIN;
    G.boltT = 0;
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
    G.storm = pickStorm(G.mapId);
    G.stormT = 0;
    G.stormNext = rand(STORM_MIN, STORM_MAX);
    G.boltT = 0;
    hideOverlay();
    audio.start();
    beginTurn(isSquad() ? pickNextId() : 'p');
    const msg = G.kind === 'core' ? '堂核 · 薄血狂风'
      : G.kind === 'drill' ? '演习场 · 对着表练'
      : G.kind === 'seat' ? '对坐 · 岚丸先手'
      : isDuo() ? '对堂 · 岚霜出手'
      : isQuad() ? '堂座 · 把键盘给岚丸'
      : '弹堂 · 看风拉角';
    const stormBit = G.storm ? ' · ' + STORM_NAME : '';
    if (!isSquad()) toast(msg + ' · ' + MAP_NAME[G.mapId] + stormBit, G.kind === 'core', G.kind !== 'core');
    saveBest();
    syncHud();
    syncDrillWind();
    syncAiTier();
  }

  function goTitle() {
    G.mode = 'title';
    G.phase = 'aim';
    resetWorld();
    rollWind();
    audio.chargeStop();
    showOverlay('title', '弹堂', '看风，拉满或点射，把对面从石殿上轰下去。');
    setHint('1 / 回车 / 空格 弹堂 · 2 堂核 · 3 演习场 · 4 对坐 · 5 对堂 · 6 堂座 · 点地图换地形 · H 辅助 · N 地条 · K 残影');
    syncMaps();
    syncDrillWind();
    syncAiTier();
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
    const w = WEPS[n];
    toast(w.id === 7 ? (w.name + ' · 两发') : (w.id === 8 ? (w.name + ' · 迟爆') : w.name), false, n === 1 || w.id === 7 || w.id === 8);
  }


  function updateFx(dt) {
    if (G.quakeT > 0) {
      G.quakeT = Math.max(0, G.quakeT - dt);
      if (G.quakeT <= 0) G.quakeMag = 0;
    }
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
    if (G.boltT > 0) G.boltT = Math.max(0, G.boltT - dt);
    if (G.killHold > 0) {
      G.killHold -= dt;
      if (G.stop > 0) G.stop -= dt;
      return;
    }
    updateFx(dt);
    if (G.stop > 0) {
      G.stop -= dt;
      return;
    }
    tickSlab(dt);
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

    if (G.storm && !overlayOpen()) {
      G.stormT += dt;
      if (G.stormT >= G.stormNext) strikeStorm();
    }
    tickMines(dt);
    tickCrates(dt);

    if (G.phase === 'frozenWait') {
      G.frozenT -= dt;
      if (G.frozenT <= 0) {
        continueAfterAction();
      }
      return;
    }
    if (G.busy === 'leap') stepLeap(dt);
    if (G.phase === 'aim' || G.phase === 'charge') {
      if (humanTurn() && !clockPaused()) {
        G.timeout -= dt;
        if (G.timeout <= CLOCK_WARN && G.timeout > 0) {
          const n = Math.max(1, Math.ceil(G.timeout));
          if (G.clockN !== n) {
            G.clockN = n;
            audio.tick();
          }
        }
        if (G.timeout <= 0) {
          G.timeout = 0;
          if (skipTurn(true)) return;
        }
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
    const top = G.mapId === 'canyon' ? '#5ad6ff' : G.mapId === 'twin' ? '#ffe36b' : G.mapId === 'spire' ? '#9af0ff' : G.mapId === 'bridge' ? '#e8c090' : G.mapId === 'isles' ? '#c8f0ff' : G.mapId === 'ruins' ? '#e0c090' : G.mapId === 'vale' ? '#7cf6ff' : G.mapId === 'forge' ? '#ff8a40' : G.mapId === 'arcade' ? '#e4d2a8' : G.mapId === 'towers' ? '#d8c4a0' : G.mapId === 'moon' ? '#c8eeff' : G.mapId === 'cliff' ? '#ffc078' : G.mapId === 'dune' ? '#f0c878' : G.mapId === 'gate' ? '#d8c8a8' : G.mapId === 'frost' ? '#d4f2ff' : G.mapId === 'cloud' ? '#e8d8b8' : G.mapId === 'mirror' ? '#c8e8ff' : G.mapId === 'well' ? '#c8b898' : '#7dffc6';
    const mid = G.mapId === 'canyon' ? '#2a1a48' : G.mapId === 'twin' ? '#2a1840' : G.mapId === 'spire' ? '#143044' : G.mapId === 'bridge' ? '#2a2018' : G.mapId === 'isles' ? '#182438' : G.mapId === 'ruins' ? '#2a1c18' : G.mapId === 'vale' ? '#142038' : G.mapId === 'forge' ? '#3a140c' : G.mapId === 'arcade' ? '#241c18' : G.mapId === 'towers' ? '#221810' : G.mapId === 'moon' ? '#122436' : G.mapId === 'cliff' ? '#3a2214' : G.mapId === 'dune' ? '#4a3018' : G.mapId === 'gate' ? '#2a2218' : G.mapId === 'frost' ? '#143044' : G.mapId === 'cloud' ? '#241c28' : G.mapId === 'mirror' ? '#182030' : G.mapId === 'well' ? '#141018' : '#162436';
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
    if (G.mapId === 'moon') {
      const water = g.createLinearGradient(0, MOON_WATER_Y - 24, 0, VH);
      water.addColorStop(0, 'rgba(190,232,255,0.22)');
      water.addColorStop(0.12, 'rgba(90,170,220,0.42)');
      water.addColorStop(0.42, 'rgba(28,80,120,0.68)');
      water.addColorStop(1, '#0a1826');
      g.fillStyle = water;
      for (let x = 0; x < VW; x++) {
        if (H[x] > MOON_WATER_Y + 1) g.fillRect(x, MOON_WATER_Y, 1, H[x] - MOON_WATER_Y);
      }
      g.strokeStyle = 'rgba(200,236,255,0.55)';
      g.lineWidth = 1.4;
      g.beginPath();
      let drawing = false;
      for (let x = 0; x < VW; x++) {
        if (H[x] <= MOON_WATER_Y + 1) {
          if (drawing) { g.stroke(); drawing = false; }
          continue;
        }
        if (!drawing) { g.beginPath(); g.moveTo(x, MOON_WATER_Y); drawing = true; }
        else g.lineTo(x, MOON_WATER_Y);
      }
      if (drawing) g.stroke();
      g.fillStyle = 'rgba(220,244,255,0.16)';
      g.beginPath();
      g.ellipse(MOON_CX, MOON_WATER_Y + 8, 168, 14, 0, 0, TAU);
      g.fill();
    }
    if (G.mapId === 'cliff') {
      const water = g.createLinearGradient(0, CLIFF_WATER_Y - 18, 0, VH);
      water.addColorStop(0, 'rgba(160,220,230,0.20)');
      water.addColorStop(0.16, 'rgba(70,150,170,0.40)');
      water.addColorStop(0.48, 'rgba(24,70,88,0.62)');
      water.addColorStop(1, '#0a161c');
      g.fillStyle = water;
      for (let x = CLIFF_EDGE; x < VW; x++) {
        if (H[x] > CLIFF_WATER_Y + 1) g.fillRect(x, CLIFF_WATER_Y, 1, H[x] - CLIFF_WATER_Y);
      }
      g.strokeStyle = 'rgba(190,236,240,0.50)';
      g.lineWidth = 1.3;
      g.beginPath();
      let drawing = false;
      for (let x = CLIFF_EDGE; x < VW; x++) {
        if (H[x] <= CLIFF_WATER_Y + 1) {
          if (drawing) { g.stroke(); drawing = false; }
          continue;
        }
        if (!drawing) { g.beginPath(); g.moveTo(x, CLIFF_WATER_Y); drawing = true; }
        else g.lineTo(x, CLIFF_WATER_Y);
      }
      if (drawing) g.stroke();
      g.fillStyle = 'rgba(24,12,8,0.22)';
      g.fillRect(CLIFF_EDGE - 2, CLIFF_TOP_Y, 6, CLIFF_DROP + 24);
    }
    if (G.mapId === 'dune') {
      g.fillStyle = 'rgba(240, 200, 120, 0.08)';
      g.fillRect(360, DUNE_SADDLE_Y - 12, 240, 18);
      g.strokeStyle = 'rgba(255, 220, 150, 0.22)';
      g.lineWidth = 1.1;
      g.beginPath();
      g.moveTo(120, H[120] + 8);
      for (let x = 120; x <= 840; x += 4) g.lineTo(x, H[x] + 7 + Math.sin(x * 0.05) * 1.4);
      g.stroke();
    }
    if (G.mapId === 'gate') {
      g.fillStyle = 'rgba(16, 12, 20, 0.34)';
      g.fillRect(GATE_L1, GATE_CROWN_Y + 8, GATE_R0 - GATE_L1, VH - GATE_CROWN_Y - 8);
      g.strokeStyle = 'rgba(216, 196, 160, 0.42)';
      g.lineWidth = 1.3;
      g.beginPath();
      g.moveTo(GATE_L0, H[GATE_L0]);
      for (let x = GATE_L0; x <= GATE_L1; x++) g.lineTo(x, H[x]);
      g.stroke();
      g.beginPath();
      g.moveTo(GATE_R0, H[GATE_R0]);
      for (let x = GATE_R0; x <= GATE_R1; x++) g.lineTo(x, H[x]);
      g.stroke();
      g.fillStyle = 'rgba(200, 180, 140, 0.12)';
      g.fillRect(GATE_L0, GATE_CROWN_Y - 2, GATE_L1 - GATE_L0, 6);
      g.fillRect(GATE_R0, GATE_CROWN_Y - 2, GATE_R1 - GATE_R0, 6);
    }
    if (G.mapId === 'frost') {
      const sheen = g.createLinearGradient(0, FROST_ICE_Y - 18, 0, FROST_ICE_Y + 36);
      sheen.addColorStop(0, 'rgba(210, 240, 255, 0.28)');
      sheen.addColorStop(0.45, 'rgba(154, 216, 255, 0.16)');
      sheen.addColorStop(1, 'rgba(80, 140, 190, 0.10)');
      g.fillStyle = sheen;
      for (let x = FROST_ICE0; x <= FROST_ICE1; x++) {
        g.fillRect(x, H[x], 1, 10);
      }
      g.strokeStyle = 'rgba(220, 244, 255, 0.62)';
      g.lineWidth = 1.6;
      g.beginPath();
      g.moveTo(FROST_ICE0, H[FROST_ICE0]);
      for (let x = FROST_ICE0; x <= FROST_ICE1; x++) g.lineTo(x, H[x]);
      g.stroke();
      g.fillStyle = 'rgba(90, 64, 44, 0.18)';
      g.fillRect(40, FROST_BANK_Y - 4, FROST_ICE0 - 56, 8);
      g.fillRect(FROST_ICE1 + 16, FROST_BANK_Y - 4, 900 - FROST_ICE1, 8);
    }
    if (G.mapId === 'cloud') {
      const pit = g.createLinearGradient(0, CLOUD_BANK_Y, 0, VH);
      pit.addColorStop(0, 'rgba(12, 8, 20, 0.08)');
      pit.addColorStop(0.18, 'rgba(18, 12, 28, 0.42)');
      pit.addColorStop(0.55, '#100c18');
      pit.addColorStop(1, '#080610');
      g.fillStyle = pit;
      g.fillRect(CLOUD_L1, CLOUD_BANK_Y + 6, CLOUD_R0 - CLOUD_L1, VH - CLOUD_BANK_Y - 6);
      g.fillStyle = 'rgba(90, 64, 44, 0.22)';
      g.fillRect(48, CLOUD_BANK_Y - 4, CLOUD_L1 - 64, 8);
      g.fillRect(CLOUD_R0 + 16, CLOUD_BANK_Y - 4, 900 - CLOUD_R0, 8);
    }
    if (G.mapId === 'mirror') {
      const ditch = g.createLinearGradient(0, MIRROR_BANK_Y, 0, VH);
      ditch.addColorStop(0, 'rgba(12, 10, 22, 0.08)');
      ditch.addColorStop(0.22, 'rgba(18, 16, 32, 0.36)');
      ditch.addColorStop(0.6, '#101018');
      ditch.addColorStop(1, '#080610');
      g.fillStyle = ditch;
      g.fillRect(MIRROR_L1, MIRROR_BANK_Y + 6, MIRROR_R0 - MIRROR_L1, VH - MIRROR_BANK_Y - 6);
      g.fillStyle = 'rgba(90, 64, 44, 0.22)';
      g.fillRect(48, MIRROR_BANK_Y - 4, MIRROR_L1 - 64, 8);
      g.fillRect(MIRROR_R0 + 16, MIRROR_BANK_Y - 4, 900 - MIRROR_R0, 8);
    }
    if (G.mapId === 'well') {
      const water = g.createLinearGradient(0, WELL_WATER_Y - 28, 0, VH);
      water.addColorStop(0, 'rgba(40, 70, 88, 0.18)');
      water.addColorStop(0.14, 'rgba(18, 42, 62, 0.52)');
      water.addColorStop(0.46, 'rgba(8, 18, 32, 0.82)');
      water.addColorStop(1, '#05080e');
      g.fillStyle = water;
      for (let x = WELL_SHAFT0; x <= WELL_SHAFT1; x++) {
        if (H[x] > WELL_WATER_Y + 1) g.fillRect(x, WELL_WATER_Y, 1, H[x] - WELL_WATER_Y);
      }
      g.strokeStyle = 'rgba(80, 120, 150, 0.42)';
      g.lineWidth = 1.3;
      g.beginPath();
      let drawing = false;
      for (let x = WELL_SHAFT0; x <= WELL_SHAFT1; x++) {
        if (H[x] <= WELL_WATER_Y + 1) {
          if (drawing) { g.stroke(); drawing = false; }
          continue;
        }
        if (!drawing) { g.beginPath(); g.moveTo(x, WELL_WATER_Y); drawing = true; }
        else g.lineTo(x, WELL_WATER_Y);
      }
      if (drawing) g.stroke();
      g.fillStyle = 'rgba(18, 36, 52, 0.55)';
      g.beginPath();
      g.ellipse(WELL_CX, WELL_WATER_Y + 10, 78, 11, 0, 0, TAU);
      g.fill();
      g.fillStyle = 'rgba(8, 14, 22, 0.35)';
      g.beginPath();
      g.ellipse(WELL_CX, WELL_WATER_Y + 14, 54, 7, 0, 0, TAU);
      g.fill();
      g.fillStyle = 'rgba(196, 156, 112, 0.22)';
      g.fillRect(WELL_LIP0, WELL_LIP_Y - 3, WELL_SHAFT0 - WELL_LIP0, 7);
      g.fillRect(WELL_SHAFT1, WELL_LIP_Y - 3, WELL_LIP1 - WELL_SHAFT1, 7);
      g.strokeStyle = 'rgba(216, 184, 140, 0.55)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(WELL_LIP0, H[WELL_LIP0]);
      for (let x = WELL_LIP0; x <= WELL_SHAFT0; x++) g.lineTo(x, H[x]);
      g.stroke();
      g.beginPath();
      g.moveTo(WELL_SHAFT1, H[WELL_SHAFT1]);
      for (let x = WELL_SHAFT1; x <= WELL_LIP1; x++) g.lineTo(x, H[x]);
      g.stroke();
      g.fillStyle = 'rgba(90, 64, 44, 0.20)';
      g.fillRect(48, WELL_BANK_Y - 4, WELL_LIP0 - 64, 8);
      g.fillRect(WELL_LIP1 + 16, WELL_BANK_Y - 4, 900 - WELL_LIP1, 8);
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
    if (G.mapId === 'moon') {
      const glow = g.createRadialGradient(480, 70, 8, 480, 92, 220);
      glow.addColorStop(0, 'rgba(255,244,200,0.22)');
      glow.addColorStop(1, 'rgba(255,244,200,0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, VW, VH);
      const pool = g.createRadialGradient(MOON_CX, MOON_WATER_Y + 40, 20, MOON_CX, MOON_WATER_Y + 80, 280);
      pool.addColorStop(0, 'rgba(80,180,230,0.16)');
      pool.addColorStop(1, 'rgba(80,180,230,0)');
      g.fillStyle = pool;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'cliff') {
      const heat = g.createRadialGradient(780, 80, 10, 820, 120, 280);
      heat.addColorStop(0, 'rgba(255,180,80,0.16)');
      heat.addColorStop(1, 'rgba(255,180,80,0)');
      g.fillStyle = heat;
      g.fillRect(0, 0, VW, VH);
      const mist = g.createRadialGradient(CLIFF_EDGE + 40, CLIFF_BEACH_Y, 12, CLIFF_EDGE + 80, CLIFF_BEACH_Y + 40, 220);
      mist.addColorStop(0, 'rgba(80,180,190,0.14)');
      mist.addColorStop(1, 'rgba(80,180,190,0)');
      g.fillStyle = mist;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'dune') {
      const heat = g.createRadialGradient(480, 70, 10, 480, 120, 320);
      heat.addColorStop(0, 'rgba(255,190,90,0.16)');
      heat.addColorStop(1, 'rgba(255,190,90,0)');
      g.fillStyle = heat;
      g.fillRect(0, 0, VW, VH);
      const bowl = g.createRadialGradient(480, DUNE_SADDLE_Y, 16, 480, DUNE_SADDLE_Y + 40, 240);
      bowl.addColorStop(0, 'rgba(210,150,70,0.12)');
      bowl.addColorStop(1, 'rgba(210,150,70,0)');
      g.fillStyle = bowl;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'frost') {
      const chill = g.createRadialGradient(480, FROST_ICE_Y, 20, 480, FROST_ICE_Y + 40, 320);
      chill.addColorStop(0, 'rgba(160, 220, 255, 0.16)');
      chill.addColorStop(1, 'rgba(160, 220, 255, 0)');
      g.fillStyle = chill;
      g.fillRect(0, 0, VW, VH);
      const polar = g.createRadialGradient(480, 70, 8, 480, 110, 260);
      polar.addColorStop(0, 'rgba(200, 236, 255, 0.14)');
      polar.addColorStop(1, 'rgba(200, 236, 255, 0)');
      g.fillStyle = polar;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'cloud') {
      const mist = g.createRadialGradient(480, 80, 12, 480, 140, 300);
      mist.addColorStop(0, 'rgba(232, 220, 200, 0.16)');
      mist.addColorStop(1, 'rgba(232, 220, 200, 0)');
      g.fillStyle = mist;
      g.fillRect(0, 0, VW, VH);
      const bowl = g.createRadialGradient(480, CLOUD_PIT_Y, 20, 480, CLOUD_PIT_Y + 50, 280);
      bowl.addColorStop(0, 'rgba(24, 16, 32, 0.28)');
      bowl.addColorStop(1, 'rgba(24, 16, 32, 0)');
      g.fillStyle = bowl;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'mirror') {
      const gleam = g.createRadialGradient(480, 90, 10, 480, 140, 280);
      gleam.addColorStop(0, 'rgba(200, 232, 255, 0.16)');
      gleam.addColorStop(1, 'rgba(200, 232, 255, 0)');
      g.fillStyle = gleam;
      g.fillRect(0, 0, VW, VH);
      const ditch = g.createRadialGradient(480, MIRROR_TRENCH_Y, 16, 480, MIRROR_TRENCH_Y + 40, 240);
      ditch.addColorStop(0, 'rgba(20, 18, 32, 0.26)');
      ditch.addColorStop(1, 'rgba(20, 18, 32, 0)');
      g.fillStyle = ditch;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'well') {
      const pit = g.createRadialGradient(WELL_CX, WELL_WATER_Y + 20, 16, WELL_CX, WELL_WATER_Y + 70, 220);
      pit.addColorStop(0, 'rgba(8, 16, 28, 0.42)');
      pit.addColorStop(1, 'rgba(8, 16, 28, 0)');
      g.fillStyle = pit;
      g.fillRect(0, 0, VW, VH);
      const rim = g.createRadialGradient(WELL_CX, WELL_LIP_Y, 20, WELL_CX, WELL_LIP_Y + 40, 180);
      rim.addColorStop(0, 'rgba(196, 156, 112, 0.10)');
      rim.addColorStop(1, 'rgba(196, 156, 112, 0)');
      g.fillStyle = rim;
      g.fillRect(0, 0, VW, VH);
    }
    if (G.mapId === 'gate') {
      const shade = g.createRadialGradient(480, 380, 20, 480, 430, 300);
      shade.addColorStop(0, 'rgba(24,16,28,0.28)');
      shade.addColorStop(1, 'rgba(24,16,28,0)');
      g.fillStyle = shade;
      g.fillRect(0, 0, VW, VH);
      const stoneL = g.createRadialGradient(GATE_L_CX, GATE_CROWN_Y, 8, GATE_L_CX, GATE_CROWN_Y + 40, 140);
      stoneL.addColorStop(0, 'rgba(216,196,160,0.12)');
      stoneL.addColorStop(1, 'rgba(216,196,160,0)');
      g.fillStyle = stoneL;
      g.fillRect(0, 0, VW, VH);
      const stoneR = g.createRadialGradient(GATE_R_CX, GATE_CROWN_Y, 8, GATE_R_CX, GATE_CROWN_Y + 40, 140);
      stoneR.addColorStop(0, 'rgba(216,196,160,0.12)');
      stoneR.addColorStop(1, 'rgba(216,196,160,0)');
      g.fillStyle = stoneR;
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
    if (G.storm) {
      g.fillStyle = 'rgba(6, 8, 22, 0.32)';
      g.fillRect(0, 0, VW, VH);
    }
  }

  function drawStormRain(g) {
    if (!G.storm || REDUCE) return;
    const n = 64;
    const dir = windDirOf() || 1;
    g.save();
    g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const fall = wrapSpan(G.t * 380 + i * 71, VH + 50) - 20;
      const x = wrapSpan(i * 53 + dir * G.t * 46, VW + 24) - 12;
      const len = 11 + (i % 5) * 2;
      const a = 0.10 + 0.10 * ((i % 4) / 3);
      g.strokeStyle = 'rgba(186,214,255,' + a + ')';
      g.lineWidth = i % 7 === 0 ? 1.4 : 0.9;
      g.beginPath();
      g.moveTo(x, fall);
      g.lineTo(x + dir * 5, fall + len);
      g.stroke();
    }
    g.restore();
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
    if (REDUCE) return;
    const mag = windMagOf();
    const dir = windDirOf();
    if (!mag || !dir) return;
    const n = silkCount(mag);
    const spd = silkSpeed(mag);
    const gale = silkGale(mag);
    const thick0 = silkThick(mag);
    const span = VW + 180;
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (let i = 0; i < n; i++) {
      const y = 22 + (i / Math.max(1, n - 1)) * 248 + Math.sin(G.t * 0.65 + i * 1.31) * 7;
      const len = (gale ? 58 : 36) + mag * 4 + (i % 5) * 10;
      const travel = G.t * spd * (0.70 + (i % 5) * 0.08);
      const x = wrapSpan(dir * travel + i * 83, span) - 90;
      const wave = Math.sin(G.t * 2.2 + i * 0.9) * (gale ? 5 : 3);
      const a = (gale ? 0.34 : 0.18) + 0.14 * (0.5 + 0.5 * Math.sin(G.t * 1.6 + i * 0.7));
      g.strokeStyle = (i % 3 !== 1) ? rgba(GOLD, a) : 'rgba(210,236,255,' + a + ')';
      g.lineWidth = thick0 + (i % 4) * (gale ? 0.35 : 0.12);
      g.beginPath();
      g.moveTo(x, y + wave);
      g.quadraticCurveTo(x + dir * len * 0.46, y - wave - (gale ? 5 : 3), x + dir * len, y - wave * 0.3);
      g.stroke();
    }
    g.restore();
  }

  function drawWindMotes(g) {
    if (REDUCE) return;
    if (G.mode === 'title') return;
    const mag = windMagOf();
    const dir = windDirOf();
    if (!mag || !dir || !G.H) return;
    const n = silkMoteCount(mag);
    const spd = silkSpeed(mag) * 0.48;
    const gale = silkGale(mag);
    g.save();
    for (let i = 0; i < n; i++) {
      const travel = G.t * spd * (0.75 + (i % 4) * 0.1);
      const x = wrapSpan(dir * travel + i * 119, VW + 36) - 18;
      const gy = groundAt(x);
      if (gy >= VH - 4) continue;
      const hop = 6 + (i % 6) * 4 + Math.sin(G.t * 3.4 + i) * 3.2;
      const y = gy - hop;
      const a = 0.20 + 0.22 * (0.5 + 0.5 * Math.sin(G.t * 2.5 + i * 1.1));
      if (i % 4 === 0) {
        g.fillStyle = rgba(GOLD, a);
        g.beginPath();
        g.ellipse(x, y, gale ? 2.6 : 1.8, gale ? 1.2 : 0.8, dir * 0.55, 0, TAU);
        g.fill();
      } else {
        g.fillStyle = 'rgba(168,124,72,' + a + ')';
        g.beginPath();
        g.arc(x, y, gale ? 1.6 : 1.1, 0, TAU);
        g.fill();
      }
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
    if (!clockOn()) return;
    if (G.timeout > CLOCK_WARN) return;
    const n = Math.max(0, Math.ceil(G.timeout));
    const pulse = REDUCE || clockPaused() ? 1 : 1 + 0.14 * Math.sin(G.t * 11);
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

  function drawMoon(g) {
    if (G.mapId !== 'moon') return;
    g.save();
    const t = G.t;
    const wy = MOON_WATER_Y + 6 + Math.sin(t * 1.1) * 1.4;
    g.fillStyle = 'rgba(255,244,200,0.10)';
    g.beginPath();
    g.ellipse(MOON_CX, wy + 10, 22, 7, 0, 0, TAU);
    g.fill();
    g.fillStyle = 'rgba(255,250,220,0.22)';
    g.beginPath();
    g.ellipse(MOON_CX, wy + 10, 11, 3.4, 0, 0, TAU);
    g.fill();
    for (let i = 0; i < 12; i++) {
      const x = MOON_CX - 160 + i * 28 + Math.sin(t * 0.8 + i) * 10;
      const y = wy + 8 + Math.sin(t * 1.3 + i * 0.6) * 4;
      g.fillStyle = 'rgba(180,230,255,' + (0.06 + 0.08 * Math.sin(t * 1.8 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 26 + (i % 3) * 8, 5, 0, 0, TAU);
      g.fill();
    }
    g.restore();
  }

  function drawCliff(g) {
    if (G.mapId !== 'cliff') return;
    g.save();
    const t = G.t;
    const wy = CLIFF_WATER_Y + 4 + Math.sin(t * 1.2) * 1.2;
    for (let i = 0; i < 8; i++) {
      const x = CLIFF_POOL0 + 12 + i * 14 + Math.sin(t * 0.7 + i) * 6;
      const y = wy + 6 + Math.sin(t * 1.4 + i * 0.5) * 3;
      g.fillStyle = 'rgba(170,230,235,' + (0.06 + 0.08 * Math.sin(t * 1.7 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 18 + (i % 3) * 6, 4, 0, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 5; k++) {
      const px = CLIFF_EDGE + 6 + k * 9;
      const glow = 0.08 + 0.07 * (0.5 + 0.5 * Math.sin(t * 2.4 + k));
      g.fillStyle = 'rgba(255,200,120,' + glow + ')';
      g.fillRect(px, CLIFF_TOP_Y + 8 + k * 22, 3, 10);
    }
    g.restore();
  }

  function drawDune(g) {
    if (G.mapId !== 'dune') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 10; i++) {
      const x = 140 + i * 72 + Math.sin(t * 0.55 + i) * 10;
      const y = groundAt(x) - 10 - (i % 3) * 6 + Math.sin(t * 0.9 + i * 0.6) * 3;
      g.fillStyle = 'rgba(240,200,120,' + (0.06 + 0.07 * Math.sin(t * 1.5 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 16 + (i % 3) * 5, 3.4, 0, 0, TAU);
      g.fill();
    }
    g.restore();
  }

  function drawFrost(g) {
    if (G.mapId !== 'frost') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 14; i++) {
      const x = FROST_ICE0 + 18 + i * 30 + Math.sin(t * 0.45 + i) * 8;
      const y = groundAt(x) + 5 + Math.sin(t * 1.1 + i * 0.5) * 1.6;
      g.fillStyle = 'rgba(220,244,255,' + (0.06 + 0.08 * Math.sin(t * 1.6 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 22 + (i % 3) * 6, 3.2, 0, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 6; k++) {
      const px = (k < 3 ? 120 + k * 28 : 780 + (k - 3) * 28);
      const glow = 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(t * 2.0 + k));
      g.fillStyle = 'rgba(210, 170, 120,' + glow + ')';
      g.fillRect(px, FROST_BANK_Y + 8 + (k % 3) * 10, 3, 8);
    }
    g.restore();
  }

  function drawCloud(g) {
    if (G.mapId !== 'cloud' || !G.slab || !G.slab.col) return;
    g.save();
    const t = G.t;
    const left = slabLeft();
    const live = !!G.slab.live;
    const topCol = live ? 'rgba(232, 214, 176, 0.92)' : 'rgba(150, 128, 104, 0.88)';
    const fillCol = live ? 'rgba(176, 148, 108, 0.92)' : 'rgba(110, 90, 72, 0.90)';
    const botCol = live ? 'rgba(200, 176, 132, 0.55)' : 'rgba(120, 100, 82, 0.50)';
    g.fillStyle = fillCol;
    g.beginPath();
    let started = false;
    let lastX = left;
    for (let i = 0; i < CLOUD_SLAB_W; i++) {
      const top = G.slab.col[i];
      if (!(top < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN)) {
        if (started) {
          g.lineTo(lastX + 1, CLOUD_SLAB_BOT);
          g.lineTo(left + i, CLOUD_SLAB_BOT);
          g.closePath();
          g.fill();
          started = false;
        }
        continue;
      }
      const x = left + i;
      if (!started) {
        g.beginPath();
        g.moveTo(x, CLOUD_SLAB_BOT);
        g.lineTo(x, top);
        started = true;
      } else g.lineTo(x, top);
      lastX = x;
    }
    if (started) {
      g.lineTo(lastX + 1, CLOUD_SLAB_BOT);
      g.closePath();
      g.fill();
    }
    g.strokeStyle = topCol;
    g.lineWidth = live ? 2.0 : 1.4;
    g.shadowColor = live ? 'rgba(255, 236, 200, 0.35)' : 'rgba(0,0,0,0)';
    g.shadowBlur = live ? 8 : 0;
    g.beginPath();
    let drawing = false;
    for (let i = 0; i < CLOUD_SLAB_W; i++) {
      const top = G.slab.col[i];
      if (!(top < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN)) {
        if (drawing) { g.stroke(); drawing = false; }
        continue;
      }
      const x = left + i;
      if (!drawing) { g.beginPath(); g.moveTo(x, top); drawing = true; }
      else g.lineTo(x, top);
    }
    if (drawing) g.stroke();
    g.shadowBlur = 0;
    g.strokeStyle = botCol;
    g.lineWidth = 1.2;
    g.beginPath();
    drawing = false;
    for (let i = 0; i < CLOUD_SLAB_W; i++) {
      const top = G.slab.col[i];
      if (!(top < CLOUD_SLAB_BOT - CLOUD_DEAD_MIN)) {
        if (drawing) { g.stroke(); drawing = false; }
        continue;
      }
      const x = left + i;
      if (!drawing) { g.beginPath(); g.moveTo(x, CLOUD_SLAB_BOT); drawing = true; }
      else g.lineTo(x, CLOUD_SLAB_BOT);
    }
    if (drawing) g.stroke();
    if (!REDUCE) {
      for (let k = 0; k < 7; k++) {
        const x = left + 18 + k * 30 + Math.sin(t * 0.5 + k) * 10;
        const y = CLOUD_SLAB_Y - 14 - (k % 3) * 6 + Math.sin(t * 0.8 + k * 0.7) * 3;
        g.fillStyle = 'rgba(244, 236, 220,' + (0.05 + 0.06 * (0.5 + 0.5 * Math.sin(t * 1.2 + k))) + ')';
        g.beginPath();
        g.ellipse(x, y, 22 + (k % 3) * 6, 5, 0, 0, TAU);
        g.fill();
      }
    }
    g.restore();
  }

  function drawMirror(g) {
    if (G.mapId !== 'mirror' || !G.mirror || !G.mirror.col) return;
    g.save();
    const t = G.t;
    const live = !!G.mirror.live;
    const bot = G.mirror.bot;
    for (let i = 0; i < MIRROR_W; i++) {
      const top = G.mirror.col[i];
      if (!(top < bot - 4)) continue;
      const x = MIRROR_X0 + i;
      const h = bot - top;
      g.fillStyle = live ? 'rgba(120, 168, 210, 0.92)' : 'rgba(110, 96, 82, 0.88)';
      g.fillRect(x, top, 1, h);
      g.fillStyle = live ? 'rgba(220, 244, 255, 0.78)' : 'rgba(170, 150, 128, 0.45)';
      g.fillRect(x, top, 1, Math.min(4, h));
    }
    if (live && !REDUCE) {
      const sheen = 0.10 + 0.10 * (0.5 + 0.5 * Math.sin(t * 2.2));
      g.fillStyle = 'rgba(230, 248, 255,' + sheen + ')';
      g.fillRect(MIRROR_X0 + 3, MIRROR_TOP_Y + 16, 4, MIRROR_H - 36);
      g.fillStyle = 'rgba(180, 220, 255,' + (0.08 + 0.08 * (0.5 + 0.5 * Math.sin(t * 1.6 + 1))) + ')';
      g.fillRect(MIRROR_X0 + 10, MIRROR_TOP_Y + 28, 3, MIRROR_H - 52);
    }
    g.restore();
  }

  function drawGate(g) {
    if (G.mapId !== 'gate') return;
    g.save();
    const t = G.t;
    for (let i = 0; i < 8; i++) {
      const x = GATE_L1 + 16 + i * 28 + Math.sin(t * 0.55 + i) * 8;
      const y = GATE_PIT_Y - 22 + Math.sin(t * 0.9 + i * 0.7) * 6;
      g.fillStyle = 'rgba(32,22,40,' + (0.08 + 0.08 * Math.sin(t * 1.4 + i)) + ')';
      g.beginPath();
      g.ellipse(x, y, 22 + (i % 3) * 6, 6, 0, 0, TAU);
      g.fill();
    }
    for (let k = 0; k < 4; k++) {
      const px = (k < 2 ? GATE_L_CX : GATE_R_CX) + (k % 2 ? 18 : -18);
      const glow = 0.08 + 0.07 * (0.5 + 0.5 * Math.sin(t * 2.1 + k));
      g.fillStyle = 'rgba(232,210,160,' + glow + ')';
      g.fillRect(px, GATE_CROWN_Y + 10 + k * 16, 3, 9);
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
      else if (G.phase === 'fly' && curUnit() === u) fr = heroFrames[1 * 6 + 3];
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

  function shotRgb(s) {
    if (!s) return WHT;
    if (s.ult) return GOLD;
    const id = s.wep && s.wep.id;
    if (id === 3) return ICE;
    if (id === 4) return HOT;
    if (id === 8) return MINE;
    if (id === 7) return PEARL;
    if (id === 6) return FIRE;
    if (id === 5) return RAIL;
    return unitRgb(s.owner);
  }

  function drawOneShot(g, s) {
    if (!s) return;
    const rgb = shotRgb(s);
    const pts = (s.trail && s.trail.length > 1) ? s.trail : trail;
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (let i = 1; i < pts.length; i++) {
      const a = i / pts.length;
      g.strokeStyle = rgba(rgb, a * 0.32);
      g.lineWidth = 6.2 + a * 4.4;
      g.beginPath();
      g.moveTo(pts[i - 1].x, pts[i - 1].y);
      g.lineTo(pts[i].x, pts[i].y);
      g.stroke();
      g.strokeStyle = rgba(rgb, a * 0.88);
      g.lineWidth = 2.6 + a * 3.2;
      g.beginPath();
      g.moveTo(pts[i - 1].x, pts[i - 1].y);
      g.lineTo(pts[i].x, pts[i].y);
      g.stroke();
    }
    g.fillStyle = rgba(WHT, 0.95);
    g.shadowColor = rgba(rgb, 0.9);
    g.shadowBlur = 12;
    const id = s.wep && s.wep.id;
    g.beginPath();
    g.arc(s.x, s.y, id === 1 ? 5.2 : (id === 8 ? 4.6 : (id === 7 ? 3.8 : (id === 4 ? 4.4 : (id === 6 ? 4.2 : (id === 5 ? 4.0 : 3.6))))), 0, TAU);
    g.fill();
    g.restore();
  }

  function drawShot(g) {
    const list = G.shots && G.shots.length ? G.shots : (G.shot ? [G.shot] : []);
    for (let i = 0; i < list.length; i++) drawOneShot(g, list[i]);
  }

  function drawMines(g) {
    const list = G.mines;
    if (!list || !list.length) return;
    if (G.mode !== 'play' && G.mode !== 'end') return;
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      if (!m) continue;
      const max = m.max || MINE_FUSE;
      const left = clamp(m.fuse / max, 0, 1);
      const pulse = REDUCE ? 1 : (1 + 0.14 * Math.sin((G.t || 0) * 9.2 + (m.t || 0)));
      const rgb = m.side === 'p' ? MINE : MAG;
      const r = 5.4 * (REDUCE ? 1 : pulse);
      g.save();
      g.shadowColor = rgba(rgb, REDUCE ? 0.35 : 0.55 + 0.25 * (pulse - 1) * 4);
      g.shadowBlur = REDUCE ? 6 : 14;
      g.fillStyle = rgba(rgb, 0.92);
      g.beginPath();
      g.arc(m.x, m.y - 3, r, 0, TAU);
      g.fill();
      g.fillStyle = rgba(WHT, 0.55);
      g.beginPath();
      g.arc(m.x - 1.6, m.y - 4.6, r * 0.32, 0, TAU);
      g.fill();
      g.shadowBlur = 0;
      g.strokeStyle = rgba(GOLD, REDUCE ? 0.7 : 0.55 + 0.35 * left);
      g.lineWidth = 2.2;
      g.beginPath();
      g.arc(m.x, m.y - 3, r + 6, -Math.PI * 0.5, -Math.PI * 0.5 + TAU * left, false);
      g.stroke();
      g.strokeStyle = rgba(rgb, 0.28);
      g.lineWidth = 1.2;
      g.beginPath();
      g.arc(m.x, m.y - 3, r + 6, 0, TAU);
      g.stroke();
      g.restore();
    }
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

  function drawCrates(g) {
    const list = G.crates;
    if (!list || !list.length) return;
    if (G.mode !== 'play' && G.mode !== 'end') return;
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (!c) continue;
      const hw = 8;
      const hh = 7;
      const x = c.x;
      const y = c.y;
      g.save();
      g.shadowColor = rgba(WOOD, REDUCE ? 0.2 : 0.4);
      g.shadowBlur = REDUCE ? 4 : 10;
      g.fillStyle = rgba(WOOD, 0.96);
      g.fillRect(x - hw, y - hh, hw * 2, hh * 2);
      g.shadowBlur = 0;
      g.strokeStyle = rgba(WOOD_DK, 0.95);
      g.lineWidth = 1.4;
      g.strokeRect(x - hw + 0.5, y - hh + 0.5, hw * 2 - 1, hh * 2 - 1);
      g.beginPath();
      g.moveTo(x - hw + 1, y - hh + 4.5);
      g.lineTo(x + hw - 1, y - hh + 4.5);
      g.moveTo(x - hw + 1, y);
      g.lineTo(x + hw - 1, y);
      g.moveTo(x, y - hh + 4.5);
      g.lineTo(x, y + hh - 1);
      g.stroke();
      g.strokeStyle = rgba(GOLD, 0.45);
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x - 3.2, y - hh + 1.4);
      g.lineTo(x + 3.2, y - hh + 1.4);
      g.stroke();
      g.fillStyle = rgba(WOOD_DK, 0.7);
      g.fillRect(x - 1.2, y - hh - 2.4, 2.4, 2.6);
      g.restore();
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
    if (!ghostVisible()) return;
    const ghost = lastGhost();
    if (!ghost) return;
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
    const ang = u.ang;
    const th = ang * Math.PI / 180;
    let x = u.x + Math.cos(th) * 18;
    let y = u.y - 4 - Math.sin(th) * 18;
    const spd = muzzleSpeed(G.power, ang, wep);
    let vx = Math.cos(th) * spd;
    let vy = -Math.sin(th) * spd;
    const dt = 1 / 60;
    const predWind = G.wind | 0;
    const predMul = 1;
    pts.push({ x: x, y: y });
    let len = 0;
    let t = 0;
    let sBounce = false;
    for (let i = 0; i < 420; i++) {
      vx += predWind * windKAt(wep, t) * predMul * dt;
      vy += (GRAV + gustAy(x)) * dt;
      const nx = x + vx * dt;
      const ny = y + vy * dt;
      len += hypot(nx - x, ny - y);
      x = nx;
      y = ny;
      t += dt;
      pts.push({ x: x, y: y });
      if (x < 2 || x > VW - 2 || y > VH + 8) break;
      if (inGround(x, y) || inWall(x, y) || inMirror(x, y)) {
        if (!sBounce && G.mirror && G.mirror.live && inMirror(x, y)) {
          const n = mirrorNormal(x, y);
          if (Math.abs(n.nx) >= MIRROR_NX) {
            sBounce = true;
            vx *= -1;
            const push = n.nx !== 0 ? n.nx : (vx >= 0 ? 1 : -1);
            x += push * 8;
            let gm = 0;
            while (inMirror(x, y) && gm < 14) {
              x += push * 2;
              gm += 1;
            }
            continue;
          }
        }
        break;
      }
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
    let sx = G.shake && !REDUCE ? rand(-G.shake, G.shake) * 0.35 : 0;
    let sy = G.shake && !REDUCE ? rand(-G.shake, G.shake) * 0.25 : 0;
    if (G.quakeT > 0 && !REDUCE) {
      const qm = G.quakeMag || 4;
      sx += rand(-qm, qm);
      sy += rand(-qm, qm) * 0.72;
    }
    ctx.translate(VW * 0.5 + sx, VH * 0.5 + sy);
    ctx.scale(cam.z * (G.punch || 1), cam.z * (G.punch || 1));
    ctx.translate(-cam.x, -cam.y);

    drawSky(ctx);
    drawStormRain(ctx);
    drawWind(ctx);
    if (terrainDirty) paintTerrain();
    if (terrainCv) ctx.drawImage(terrainCv, 0, 0);
    drawLava(ctx);
    drawArcade(ctx);
    drawTowers(ctx);
    drawMoon(ctx);
    drawCliff(ctx);
    drawDune(ctx);
    drawGate(ctx);
    drawFrost(ctx);
    drawCloud(ctx);
    drawMirror(ctx);
    drawWalls(ctx);
    drawFires(ctx);
    drawCrumbs(ctx);
    drawGust(ctx);
    drawWindMotes(ctx);
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
    drawCrates(ctx);

    eachUnit(function (u) {
      if (u.hp <= 0) return;
      drawSpriteUnit(ctx, u);
      drawCannon(ctx, u);
      drawUnitHp(ctx, u);
      drawChargeBar(ctx, u);
    });
    drawShot(ctx);
    drawMines(ctx);
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
    if (G.quakeT > 0 && !REDUCE) {
      const k = clamp(G.quakeT / QUAKE_T, 0, 1);
      const vw = VW * view.scale;
      const vh = VH * view.scale;
      const band = Math.max(5, 7 * view.scale);
      ctx.fillStyle = 'rgba(92,68,48,' + (0.16 * k) + ')';
      ctx.fillRect(view.ox, view.oy + vh - band, vw, band);
      ctx.fillRect(view.ox, view.oy, band * 0.42, vh);
      ctx.fillRect(view.ox + vw - band * 0.42, view.oy, band * 0.42, vh);
      ctx.fillStyle = 'rgba(120,88,58,' + (0.28 * k) + ')';
      for (let i = 0; i < 9; i++) {
        const px = view.ox + ((i * 107 + G.t * 90) % vw);
        const py = view.oy + vh - 3 - (i % 4) * 2.2;
        ctx.fillRect(px, py, 2.1, 1.5);
      }
    }
    if (G.storm && !REDUCE && G.boltT > 0) {
      const k = clamp(G.boltT / STORM_BOLT_MIN, 0, 1);
      ctx.fillStyle = 'rgba(220,236,255,' + (0.18 + k * 0.38) + ')';
      ctx.fillRect(view.ox, view.oy, VW * view.scale, VH * view.scale);
    }
    if (G.flash > 0) {
      ctx.fillStyle = rgba(G.flashRgb, G.flash * 0.35);
      ctx.fillRect(view.ox, view.oy, VW * view.scale, VH * view.scale);
    }
    if (G.killHold > 0 && G.killName) {
      const fade = G.killHold < 0.08 ? G.killHold / 0.08 : 1;
      const cx = view.ox + VW * view.scale * 0.5;
      const cy = view.oy + VH * view.scale * 0.36;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 ' + Math.round(46 * view.scale) + 'px Segoe UI, PingFang SC, Noto Sans SC, sans-serif';
      ctx.fillStyle = rgba(G.killRgb || GOLD, fade);
      ctx.shadowColor = rgba(G.killRgb || GOLD, 0.55 * fade);
      ctx.shadowBlur = 22;
      ctx.fillText(G.killName, cx, cy);
      ctx.restore();
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
    if (k === 'k' || k === 'K') {
      e.preventDefault();
      setGhostOn(!G.ghostOn);
      return;
    }
    if (G.mode === 'play') {
      const bagId = bagIdFromKey(e);
      if (bagId) {
        e.preventDefault();
        toggleBag(bagId);
        return;
      }
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
    if (k === '7') setWep(6);
    if (k === '8') setWep(7);
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
    G.storm = false;
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
    ok('maps eighteen', MAP_IDS.length === 19 && MAP_NAME.spire === '风柱' && MAP_NAME.bridge === '碎桥' && MAP_NAME.isles === '悬岛' && MAP_NAME.ruins === '残垣' && MAP_NAME.vale === '风谷' && MAP_NAME.forge === '熔台' && MAP_NAME.arcade === '廊桥' && MAP_NAME.towers === '双塔' && MAP_NAME.moon === '月池' && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门' && MAP_NAME.frost === '霜泽' && MAP_NAME.cloud === '云台' && MAP_NAME.mirror === '镜廊' && MAP_NAME.well === '井口');
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
    ok('时尽 18 not 20', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
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
    G.H = buildHeight('moon');
    G.mapId = 'moon';
    ok('moon spawn', spawnX('moon', 'p') === MOON_PX && spawnX('moon', 'f') === MOON_FX);
    ok('moon spawn on rim', G.H[MOON_PX] < MOON_WATER_Y - 40 && G.H[MOON_FX] < MOON_WATER_Y - 40, Math.round(G.H[MOON_PX]) + '/' + Math.round(G.H[MOON_FX]));
    ok('moon rim high', G.H[MOON_PX] < 280 && G.H[MOON_FX] < 280, Math.round(G.H[MOON_PX]));
    ok('moon pool deep', G.H[MOON_CX] > G.H[MOON_PX] + 80 && G.H[MOON_CX] >= MOON_WATER_Y, Math.round(G.H[MOON_CX]));
    ok('moon pool wet', G.H[MOON_CX] >= MOON_WATER_Y);
    ok('moon spawn dry', G.H[MOON_PX] < MOON_WATER_Y && G.H[MOON_FX] < MOON_WATER_Y);
    ok('moon no void', !isDeathVoid(MOON_PX) && !isDeathVoid(MOON_FX) && !isDeathVoid(MOON_CX));
    ok('moon walk 0.45', MOON_WALK === 0.45 && MOON_DMG === 3);
    ok('moon rim flag', isMoonRim(MOON_PX) && isMoonRim(MOON_FX) && !isMoonRim(MOON_CX));
    const mpx = spawnX('moon', 'p');
    const mpy = G.H[mpx | 0] - UNIT_R;
    const mth65 = 65 * Math.PI / 180;
    const mth90 = 90 * Math.PI / 180;
    const ms65 = traceShot(mpx + Math.cos(mth65) * 18, mpy - 4 - Math.sin(mth65) * 18, 65, 70, 0, WEPS[0], G.H, null);
    const ms90 = traceShot(mpx + Math.cos(mth90) * 18, mpy - 4 - Math.sin(mth90) * 18, 90, 95, 0, WEPS[0], G.H, null);
    ok('moon 65 rim to rim', ms65.x > MOON_CX && Math.abs(ms65.x - MOON_FX) < 90, Math.round(ms65.x));
    ok('moon 90 dunk', Math.abs(ms90.x - mpx) < 50, Math.round(ms90.x - mpx));
    const rimX = MOON_PX;
    ok('moon rim before', G.H[rimX] < MOON_WATER_Y - 40);
    snapMoon(rimX, 48, WEPS[1]);
    ok('moon 高爆 collapse', G.H[rimX] >= MOON_WATER_Y, Math.round(G.H[rimX]));
    ok('moon collapse is pool', G.H[rimX] >= MOON_POOL_Y - 4);
    G.H = buildHeight('moon');
    G.mapId = 'moon';
    snapMoon(MOON_PX, 30, WEPS[0]);
    ok('moon 普通 no collapse', G.H[MOON_PX] < MOON_WATER_Y - 40, Math.round(G.H[MOON_PX]));
    snapMoon(MOON_FX, 22, WEPS[3]);
    ok('moon 三裂 no collapse', G.H[MOON_FX] < MOON_WATER_Y - 40, Math.round(G.H[MOON_FX]));
    G.H = buildHeight('moon');
    G.mapId = 'moon';
    G.kind = 'hall';
    const wet = { x: MOON_CX, y: G.H[MOON_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    const dry = { x: MOON_PX, y: G.H[MOON_PX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('moon in water', inMoonWater(wet) === true && inMoonWater(dry) === false);
    ok('moon walk slow', Math.abs(walkSpd(wet) - 90 * MOON_WALK) < 0.01, walkSpd(wet));
    ok('moon walk dry full', Math.abs(walkSpd(dry) - 78) < 0.01, walkSpd(dry));
    tickMoonWater(wet);
    ok('moon turn dmg 3', wet.hp === 97, wet.hp);
    tickMoonWater(dry);
    ok('moon dry no dmg', dry.hp === 100);
    G.kind = 'duo';
    const mdx0 = spawnAt('p', 0);
    const mdx1 = spawnAt('p', 1);
    const mdr0 = spawnAt('f', 0);
    const mdr1 = spawnAt('f', 1);
    ok('moon duo extras on rim', isMoonRim(mdx1) && isMoonRim(mdr1), mdx1 + '/' + mdr1);
    ok('moon duo tops', mdx0 === MOON_PX && mdr0 === MOON_FX);
    ok('moon duo extras along', Math.abs(mdx1 - mdx0) >= 20 && Math.abs(mdx1 - mdx0) <= 50, Math.round(Math.abs(mdx1 - mdx0)));
    ok('moon duo extras dry', G.H[mdx1 | 0] < MOON_WATER_Y && G.H[mdr1 | 0] < MOON_WATER_Y);
    ok('moon duo not void', !isDeathVoid(mdx0) && !isDeathVoid(mdx1) && !isDeathVoid(mdr0) && !isDeathVoid(mdr1));
    G.H = buildHeight('cliff');
    G.mapId = 'cliff';
    G.kind = 'hall';
    ok('cliff spawn', spawnX('cliff', 'p') === CLIFF_PX && spawnX('cliff', 'f') === CLIFF_FX);
    ok('cliff spawn plateau/beach', isCliffPlateau(CLIFF_PX) && isCliffBeach(CLIFF_FX), Math.round(G.H[CLIFF_PX]) + '/' + Math.round(G.H[CLIFF_FX]));
    ok('cliff drop ~180', Math.abs((G.H[CLIFF_FX] - G.H[CLIFF_PX]) - CLIFF_DROP) < 16, Math.round(G.H[CLIFF_FX] - G.H[CLIFF_PX]));
    ok('cliff sheer', G.H[CLIFF_EDGE + CLIFF_FACE + 2] > G.H[CLIFF_EDGE] + 140, Math.round(G.H[CLIFF_EDGE + CLIFF_FACE + 2] - G.H[CLIFF_EDGE]));
    ok('cliff no void', !isDeathVoid(CLIFF_PX) && !isDeathVoid(CLIFF_FX) && !isDeathVoid(CLIFF_EDGE + 6));
    ok('cliff spawn dry', G.H[CLIFF_PX] < CLIFF_WATER_Y && G.H[CLIFF_FX] < CLIFF_WATER_Y);
    ok('cliff pool wet', G.H[(CLIFF_POOL0 + CLIFF_POOL1) >> 1] >= CLIFF_WATER_Y);
    ok('cliff water 2', CLIFF_DMG === 2 && CLIFF_WALK === 0.45);
    const cEdge = CLIFF_EDGE - 14;
    const cey = G.H[cEdge | 0] - UNIT_R;
    const cgrids = Math.round((CLIFF_FX - cEdge) / GRID);
    const c90 = 90 - cgrids;
    const cth90 = c90 * Math.PI / 180;
    const cs90 = traceShot(cEdge + Math.cos(cth90) * 18, cey - 4 - Math.sin(cth90) * 18, c90, 95, 0, WEPS[0], G.H, null);
    ok('cliff 90 dunk', cs90.x > CLIFF_EDGE + CLIFF_FACE && Math.abs(cs90.x - CLIFF_FX) < 90, Math.round(cs90.x) + ' a' + c90);
    const cfx = spawnX('cliff', 'f');
    const cfy = G.H[cfx | 0] - UNIT_R;
    const cth30 = 150 * Math.PI / 180;
    const cs30 = traceShot(cfx + Math.cos(cth30) * 18, cfy - 4 - Math.sin(cth30) * 18, 150, 70, 0, WEPS[0], G.H, null);
    ok('cliff 30 undercut', cs30.x > CLIFF_EDGE - 48 && cs30.x < CLIFF_EDGE + 48 && !cs30.air, Math.round(cs30.x));
    const cpoolX = (CLIFF_POOL0 + CLIFF_POOL1) >> 1;
    const cwet = { x: cpoolX, y: G.H[cpoolX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    const cdry = { x: CLIFF_FX, y: G.H[CLIFF_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('cliff in water', inCliffWater(cwet) === true && inCliffWater(cdry) === false);
    ok('cliff walk slow', Math.abs(walkSpd(cwet) - 90 * CLIFF_WALK) < 0.01, walkSpd(cwet));
    ok('cliff walk dry full', Math.abs(walkSpd(cdry) - 78) < 0.01, walkSpd(cdry));
    tickCliffWater(cwet);
    ok('cliff turn dmg 2', cwet.hp === 98, cwet.hp);
    tickCliffWater(cdry);
    ok('cliff dry no dmg', cdry.hp === 100);
    const cfall = { x: CLIFF_EDGE + 6, y: G.H[CLIFF_PX] - 14, r: 14, hp: 100, max: 100, grounded: false, vy: 0, fall: 0, side: 'p', id: 'p', rage: 0 };
    for (let ci = 0; ci < 360 && !cfall.grounded && cfall.hp > 0; ci++) stepUnitPhys(cfall, 1 / 60);
    ok('cliff fall dmg not death', cfall.hp < 100 && cfall.hp > 0 && cfall.grounded, cfall.hp);
    G.kind = 'duo';
    const cdx0 = spawnAt('p', 0);
    const cdx1 = spawnAt('p', 1);
    const cdr0 = spawnAt('f', 0);
    const cdr1 = spawnAt('f', 1);
    ok('cliff duo extras same', isCliffPlateau(cdx0) && isCliffPlateau(cdx1) && isCliffBeach(cdr0) && isCliffBeach(cdr1), cdx1 + '/' + cdr1);
    ok('cliff duo tops', cdx0 === CLIFF_PX && cdr0 === CLIFF_FX);
    ok('cliff duo extras along', Math.abs(cdx1 - cdx0) >= 20 && Math.abs(cdr1 - cdr0) >= 20, Math.round(Math.abs(cdx1 - cdx0)));
    ok('cliff duo extras dry', G.H[cdx1 | 0] < CLIFF_WATER_Y && G.H[cdr1 | 0] < CLIFF_WATER_Y);
    ok('cliff duo not void', !isDeathVoid(cdx0) && !isDeathVoid(cdx1) && !isDeathVoid(cdr0) && !isDeathVoid(cdr1));
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
    ok('随图 pool 19', MAP_IDS.length === 19 && MAP_IDS.every(function (id) { return !!MAP_NAME[id]; }) && MAP_IDS.indexOf('moon') === 11 && MAP_IDS.indexOf('cliff') === 12 && MAP_IDS.indexOf('dune') === 13 && MAP_IDS.indexOf('gate') === 14 && MAP_IDS.indexOf('frost') === 15 && MAP_IDS.indexOf('cloud') === 16 && MAP_IDS.indexOf('mirror') === 17 && MAP_IDS.indexOf('well') === 18);
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
    ok('direct stop 140', HIT_STOP_DIRECT === 0.14);
    ok('kill slow 220', KILL_SLOW === 0.22 && KILL_HOLD === 0.40);
    ok('coach msgs', COACH_MSGS[0] === '看风' && COACH_MSGS[1] === '65° 最远' && COACH_MSGS[2] === '高抛埋人');
    ok('coach no banned', COACH_MSGS.join('').indexOf('传送') < 0 && COACH_MSGS.join('').indexOf('飞行') < 0 && COACH_MSGS.join('').indexOf('三叉戟') < 0 && COACH_MSGS.join('').indexOf('激怒') < 0);
    G.kind = 'hall';
    G.coached = false;
    G.coachN = 0;
    ok('coach hall first', shouldCoach() === true);
    G.kind = 'duo';
    ok('coach skip 对堂', shouldCoach() === false);
    G.kind = 'quad';
    ok('coach skip 堂座', shouldCoach() === false);
    G.kind = 'core';
    ok('coach skip 堂核', shouldCoach() === false);
    G.kind = 'seat';
    ok('coach skip 对坐', shouldCoach() === false);
    G.kind = 'hall';
    G.coached = false;
    G.coachN = 0;
    const pupil = { id: 'p', name: '岚丸', side: 'p' };
    coachOnFire(pupil);
    ok('coach shot1', G.coachN === 1 && G.coached === false);
    coachOnFire(pupil);
    ok('coach shot2', G.coachN === 2 && G.coached === false);
    coachOnFire(pupil);
    ok('coach shot3 persist', G.coachN === 3 && G.coached === true);
    coachOnFire(pupil);
    ok('coach never again', G.coachN === 3 && shouldCoach() === false);
    G.kind = 'duo';
    G.coached = false;
    G.coachN = 0;
    coachOnFire(pupil);
    ok('coach 对堂 silent', G.coachN === 0 && G.coached === false);
    G.kind = 'quad';
    coachOnFire(pupil);
    ok('coach 堂座 silent', G.coachN === 0);
    G.kind = 'hall';
    G.coached = true;
    ok('coach persist skip', shouldCoach() === false);
    ok('geyser exists', typeof dirtGeyser === 'function');
    ok('kill cam exists', typeof armKillCam === 'function');
    G.kind = 'hall';
    G.coached = false;
    G.coachN = 0;
    ok('g vk v17', GRAV === 260 && VK === 420);

    ok('ai names 易中狠', AI_NAME[0] === '易' && AI_NAME[1] === '中' && AI_NAME[2] === '狠' && AI_NAME.length === 3);
    ok('ai default 中', (G.ai | 0) === 1 && aiName() === '中' && aiHud() === '烬 · 中');
    ok('ai no banned', AI_NAME.join('').indexOf('传送') < 0 && AI_NAME.join('').indexOf('飞行') < 0 && AI_NAME.join('').indexOf('三叉戟') < 0 && AI_NAME.join('').indexOf('激怒') < 0);
    G.ai = 0; G.kind = 'hall';
    ok('easy jitter 8/6', aiJitterBase().ang === 8 && aiJitterBase().pow === 6);
    ok('easy ult hp40 no', aiWantUlt({ rage: 100, hp: 40 }, 8000) === false);
    ok('easy ult hp20 yes', aiWantUlt({ rage: 100, hp: 20 }, 8000) === true);
    G.p = { x: 152, hp: 100, side: 'p', id: 'p' };
    G.f = { x: 152 + 7 * GRID, hp: 20, side: 'f', id: 'f', items: freshItems(), stam: 100 };
    ok('easy never 障幕', aiWantVeil(G.f) === false);
    G.ai = 1; G.kind = 'hall';
    ok('mid hall jitter 3/4', aiJitterBase().ang === 3 && aiJitterBase().pow === 4);
    G.kind = 'core';
    ok('mid core jitter keep', aiJitterBase().ang === 1.5 && aiJitterBase().pow === 2);
    ok('mid ult 5000', aiWantUlt({ rage: 100, hp: 80 }, 5000) === true);
    ok('mid ult low score no', aiWantUlt({ rage: 100, hp: 80 }, 4000) === false);
    G.f.hp = 30; G.f.x = 152 + 7 * GRID; G.f.items = freshItems(); G.f.stam = 100;
    ok('mid veil still', aiWantVeil(G.f) === true);
    G.ai = 2; G.kind = 'hall';
    ok('hard jitter 2', aiJitterBase().ang === 2 && aiJitterBase().pow === 2);
    ok('hard ult greedy', aiWantUlt({ rage: 100, hp: 80 }, 1600) === true);
    G.f.hp = 65; G.f.x = 152 + 10 * GRID;
    ok('hard veil greedy', aiWantVeil(G.f) === true);
    G.kind = 'duo';
    G.p = { id: 'p', name: '岚丸', side: 'p', hp: 100, delay: 200, ord: 0 };
    G.p2 = { id: 'p2', name: '霜丸', side: 'p', hp: 100, delay: 180, ord: 2 };
    G.f = { id: 'f', name: '烬丸', side: 'f', hp: 100, delay: 90, ord: 1 };
    G.f2 = { id: 'f2', name: '霆丸', side: 'f', hp: 100, delay: 210, ord: 3 };
    ok('delay 普通 not double', delayKeepsTurn(G.f, 0, false) === false);
    ok('delay 霓弹 double', delayKeepsTurn(G.f, 3, false) === true);
    ok('delay 高爆 not double', delayKeepsTurn(G.f, 1, false) === false);
    ok('cheap wep 普通 < 霓轨', delayCost(0) < delayCost(5) && delayCost(3) < delayCost(0));
    G.H = new Float32Array(VW);
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    for (let i = 188; i <= 212; i++) G.H[i] = 412;
    G.mapId = 'plain';
    G.wind = 0;
    G.p = { x: 200, y: G.H[200] - 14, r: 14, hp: 100, side: 'p', id: 'p' };
    G.f = { x: 620, y: 386, r: 14, hp: 100, side: 'f', id: 'f' };
    G.p2 = null; G.f2 = null;
    G.kind = 'hall';
    G.ai = 1;
    ok('mid shallow no 三裂', pickAIWeapon(G.f) !== 3);
    G.ai = 2;
    ok('hard shallow 叠珠 finish', pickAIWeapon(G.f) === 6);
    G.ai = 1;
    G.kind = 'quad';
    ok('堂座 still no AI', isHuman({ id: 'f', side: 'f' }) === true && isQuad() === true);
    G.kind = 'duo';
    ok('对堂 right AI uses slider', isHuman({ id: 'f', side: 'f' }) === false && isHuman({ id: 'f2', side: 'f' }) === false);
    G.kind = 'hall';
    G.p2 = null;
    G.f2 = null;
    ok('hud 烬 · 中', aiHud() === '烬 · 中');
    ok('g vk v18', GRAV === 260 && VK === 420);
    ok('assist still 中 after ai', G.assist === 2 && ASSIST_NAME[2] === '中');
    ok('g vk v19', GRAV === 260 && VK === 420);
    ok('月池 name locked', MAP_NAME.moon === '月池' && MAP_IDS[11] === 'moon');
    ok('no banned moon', MAP_NAME.moon.indexOf('传送') < 0 && MAP_NAME.moon.indexOf('飞行') < 0);
    ok('ghost default on', G.ghostOn !== false && ghostPref() === true);
    ok('ghost first null', G.ghost == null && lastGhost() == null && ghostVisible() === false);
    G.mode = 'play';
    G.phase = 'aim';
    G.kind = 'hall';
    G.turn = 'p';
    G.ghostOn = true;
    G.ghostPend = { x: 10, y: 20, ang: 65, power: 70, wepId: 0, wind: 2, points: [{ x: 10, y: 20, a: 1 }, { x: 40, y: 18, a: 1 }] };
    commitLastGhost(80, 40);
    ok('ghost stores polyline', !!(G.ghost && G.ghost.points && G.ghost.points.length === 3 && G.ghost.ang === 65 && G.ghost.power === 70));
    ok('ghost land point', G.ghost.points[2].x === 80 && G.ghost.points[2].y === 40);
    ok('ghost pend cleared', G.ghostPend == null);
    ok('ghost next aimer 岚丸', ghostVisible() === true && lastGhost().ang === 65);
    G.turn = 'f';
    ok('ghost everyone 烬丸 aim', ghostVisible() === true && lastGhost().power === 70);
    G.kind = 'duo';
    G.turn = 'p2';
    ok('ghost everyone 霜丸', ghostVisible() === true);
    G.kind = 'quad';
    G.turn = 'f2';
    ok('ghost everyone 霆丸', ghostVisible() === true);
    G.kind = 'hall';
    G.turn = 'p';
    G.phase = 'fly';
    ok('ghost hide fly', ghostVisible() === false && lastGhost() && lastGhost().ang === 65);
    G.phase = 'settle';
    ok('ghost hide settle', ghostVisible() === false);
    G.phase = 'charge';
    ok('ghost show charge', ghostVisible() === true);
    G.phase = 'aim';
    G.ghostOn = false;
    ok('ghost K off', ghostPref() === false && lastGhost() == null && ghostVisible() === false);
    G.ghostOn = true;
    ok('ghost K on', ghostVisible() === true);
    G.p = { id: 'p', ghost: { ang: 10, power: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] } };
    G.f = { id: 'f', ghost: null };
    ok('ghost is last shot not self', lastGhost().ang === 65 && lastGhost().power === 70);
    const skipKeep = G.ghost;
    G.phase = 'settle';
    ok('skip keeps last shot', G.ghost === skipKeep && G.ghost.ang === 65);
    G.phase = 'aim';
    G.ghost = null;
    G.ghostPend = null;
    G.ghostOn = true;
    ok('ghost match only', G.ghost == null);
    ok('g vk v20', GRAV === 260 && VK === 420);
    ok('maps still 14 after ghost', MAP_IDS.length === 19 && MAP_NAME.moon === '月池' && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊');
    ok('no banned ghost', '残影开残影关上 65°/70'.indexOf('传送') < 0 && '残影'.indexOf('飞行') < 0 && OPS.indexOf('K 残影') >= 0);
    ok('断崖 name locked', MAP_NAME.cliff === '断崖' && MAP_IDS[12] === 'cliff');
    ok('no banned cliff', MAP_NAME.cliff.indexOf('传送') < 0 && MAP_NAME.cliff.indexOf('飞行') < 0 && MAP_NAME.cliff.indexOf('三叉戟') < 0 && MAP_NAME.cliff.indexOf('激怒') < 0);
    ok('g vk v21', GRAV === 260 && VK === 420);
    ok('ghost K still', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk zero', silkCount(0) === 0 && silkSpeed(0) === 0 && silkThick(0) === 0 && silkMoteCount(0) === 0);
    ok('silk count scales', silkCount(1) >= 6 && silkCount(1) < silkCount(4) && silkCount(8) > silkCount(4) && silkCount(14) <= 28);
    ok('silk gale 5', silkGale(4) === false && silkGale(5) === true && silkGale(-7) === true);
    ok('silk gale faster thicker', silkSpeed(5) > silkSpeed(4) && silkThick(5) > silkThick(4));
    ok('silk dir sign', windDirOf(3) === 1 && windDirOf(-4) === -1 && windDirOf(0) === 0);
    ok('silk motes scale', silkMoteCount(2) >= 4 && silkMoteCount(2) < silkMoteCount(8) && silkMoteCount(14) <= 16);
    ok('silk wrap', Math.abs(wrapSpan(-10, 100) - 90) < 0.001 && wrapSpan(110, 100) === 10);
    ok('silk visual only', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    G.H = buildHeight('plain');
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', ang: 65 };
    const silkPhys = traceShot(152, G.p.y - 4, 65, 70, 3, WEPS[0], G.H, G.p);
    const silkPhys2 = traceShot(152, G.p.y - 4, 65, 70, 3, WEPS[0], G.H, G.p);
    ok('silk no physics drift', Math.abs(silkPhys.x - silkPhys2.x) < 0.01 && Math.abs(silkPhys.y - silkPhys2.y) < 0.01);
    ok('maps still 14 after silk', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.moon === '月池' && MAP_NAME.dune === '沙脊');
    ok('ghost K still after silk', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('no banned silk', '风丝'.indexOf('传送') < 0 && '风丝'.indexOf('飞行') < 0 && '风丝'.indexOf('三叉戟') < 0 && '风丝'.indexOf('激怒') < 0);
    ok('g vk v22', GRAV === 260 && VK === 420);
    G.H = buildHeight('dune');
    G.mapId = 'dune';
    G.kind = 'hall';
    ok('dune spawn', spawnX('dune', 'p') === DUNE_PX && spawnX('dune', 'f') === DUNE_FX);
    ok('dune spawn on crest', isDuneCrest(DUNE_PX) && isDuneCrest(DUNE_FX), Math.round(G.H[DUNE_PX]) + '/' + Math.round(G.H[DUNE_FX]));
    ok('dune crests high', G.H[DUNE_PX] < 280 && G.H[DUNE_FX] < 280, Math.round(G.H[DUNE_PX]));
    ok('dune saddle shallow', G.H[480] > G.H[DUNE_PX] + 80 && G.H[480] < 460, Math.round(G.H[480]));
    ok('dune no void', !isDeathVoid(DUNE_PX) && !isDeathVoid(DUNE_FX) && !isDeathVoid(480));
    ok('dune walk 0.55', DUNE_WALK === 0.55 && DUNE_CRATER === 1.25 && DUNE_WIND_EXTRA === 1);
    ok('dune saddle flag', isDuneSaddle(480) && !isDuneSaddle(DUNE_PX) && !isDuneSaddle(DUNE_FX));
    const dLip = 258;
    const dey = G.H[dLip | 0] - UNIT_R;
    const dSaddle = 480;
    const dgrids = Math.round((dSaddle - dLip) / GRID);
    const d90 = 90 - dgrids;
    const dth90 = d90 * Math.PI / 180;
    const ds90 = traceShot(dLip + Math.cos(dth90) * 18, dey - 4 - Math.sin(dth90) * 18, d90, 95, 0, WEPS[0], G.H, null);
    ok('dune 90 dunk', isDuneSaddle(ds90.x) && !ds90.air, Math.round(ds90.x) + ' a' + d90);
    const dpx = spawnX('dune', 'p');
    const dpy = G.H[dpx | 0] - UNIT_R;
    const dth30 = 30 * Math.PI / 180;
    const ds30 = traceShot(dpx + Math.cos(dth30) * 18, dpy - 4 - Math.sin(dth30) * 18, 30, 70, 0, WEPS[0], G.H, null);
    ok('dune 30 undercut', ds30.x > 600 && ds30.x < DUNE_FX + 24 && !ds30.air && G.H[ds30.x | 0] < DUNE_SADDLE_Y - 16, Math.round(ds30.x));
    const dsand = { x: DUNE_PX, y: G.H[DUNE_PX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    const dsandF = { x: DUNE_FX, y: G.H[DUNE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('dune on sand', onSand(dsand) === true && onSand(dsandF) === true);
    ok('dune walk slow', Math.abs(walkSpd(dsand) - 90 * DUNE_WALK) < 0.01, walkSpd(dsand));
    ok('dune walk ai sand', Math.abs(walkSpd(dsandF) - 78 * DUNE_WALK) < 0.01, walkSpd(dsandF));
    G.mapId = 'plain';
    const flatH = new Float32Array(VW);
    for (let i = 0; i < VW; i++) flatH[i] = 400;
    G.H = flatH;
    carve(500, 400, 30);
    const plainDepth = G.H[500] - 400;
    G.mapId = 'dune';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(500, 400, sandR(30));
    const duneDepth = G.H[500] - 400;
    ok('dune crater ~1.25', duneDepth > plainDepth * 1.15 && Math.abs(duneDepth / plainDepth - DUNE_CRATER) < 0.08, Math.round(duneDepth) + '/' + Math.round(plainDepth));
    G.kind = 'hall';
    G.mapId = 'dune';
    ok('dune wind extra cap', windMax() === 8 && DUNE_WIND_EXTRA === 1);
    G.kind = 'core';
    ok('dune core wind still cap', windMax() === 14);
    G.kind = 'hall';
    G.H = buildHeight('dune');
    G.mapId = 'dune';
    G.p = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: DUNE_FX, y: G.H[DUNE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    const dimp = { x: 480, y: G.H[480], t: 1, hit: null };
    const scHigh = scoreOne(dimp, WEPS[0], G.f, G.p, 88);
    const scLow = scoreOne(dimp, WEPS[0], G.f, G.p, 30);
    ok('dune AI prefer dunk', scHigh > scLow + 400, Math.round(scHigh) + '>' + Math.round(scLow));
    ok('dune AI saddle 高爆', pickAIWeapon(G.f) === 1);
    G.kind = 'duo';
    const ddx0 = spawnAt('p', 0);
    const ddx1 = spawnAt('p', 1);
    const ddr0 = spawnAt('f', 0);
    const ddr1 = spawnAt('f', 1);
    ok('dune duo extras crest', isDuneCrest(ddx0) && isDuneCrest(ddx1) && isDuneCrest(ddr0) && isDuneCrest(ddr1), ddx1 + '/' + ddr1);
    ok('dune duo tops', ddx0 === DUNE_PX && ddr0 === DUNE_FX);
    ok('dune duo extras along', Math.abs(ddx1 - ddx0) >= 20 && Math.abs(ddr1 - ddr0) >= 20, Math.round(Math.abs(ddx1 - ddx0)));
    ok('dune duo not void', !isDeathVoid(ddx0) && !isDeathVoid(ddx1) && !isDeathVoid(ddr0) && !isDeathVoid(ddr1));
    G.kind = 'hall';
    ok('沙脊 name locked', MAP_NAME.dune === '沙脊' && MAP_IDS[13] === 'dune');
    ok('no banned dune', MAP_NAME.dune.indexOf('传送') < 0 && MAP_NAME.dune.indexOf('飞行') < 0 && MAP_NAME.dune.indexOf('三叉戟') < 0 && MAP_NAME.dune.indexOf('激怒') < 0);
    ok('g vk v23', GRAV === 260 && VK === 420);
    ok('cliff moon silk ghost kept', MAP_NAME.cliff === '断崖' && MAP_NAME.moon === '月池' && G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);

    ok('叠珠 is 7', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7 && WEPS.length === 8);
    ok('叠珠 stats 普通', WEPS[6].direct === 32 && WEPS[6].splash === 36 && WEPS[6].crater === 30 && WEPS[6].spd === 1);
    ok('1-6 names stay', WEPS[0].name === '普通弹' && WEPS[1].name === '高爆' && WEPS[2].name === '穿透' && WEPS[3].name === '三裂' && WEPS[4].name === '霓轨' && WEPS[5].name === '霓火');
    ok('1-6 ids stay', WEPS[0].id === 0 && WEPS[1].id === 1 && WEPS[2].id === 2 && WEPS[3].id === 4 && WEPS[4].id === 5 && WEPS[5].id === 6);
    ok('dual nums', DUAL_WAIT === 0.38 && DUAL_POW === 0.72 && DUAL_JIT === 1.2 && DUAL_BLAST === 0.72);
    ok('dual follow blast', Math.abs(dualFollowWep(WEPS[6]).splash - 36 * 0.72) < 0.001 && Math.abs(dualFollowWep(WEPS[6]).crater - 30 * 0.72) < 0.001);
    ok('dual follow same dmg', dualFollowWep(WEPS[6]).direct === 32 && dualFollowWep(WEPS[6]).id === 7);
    ok('dual delay', delayCost(7) === 135 && delayCost(0) === 100 && delayCost(6) === 125);
    ok('no banned 叠珠', WEPS[6].name.indexOf('传送') < 0 && WEPS[6].name.indexOf('飞行') < 0 && WEPS[6].name.indexOf('三叉戟') < 0 && WEPS[6].name.indexOf('激怒') < 0);
    G.H = new Float32Array(VW);
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    for (let i = 176; i <= 224; i++) G.H[i] = 452;
    G.mapId = 'plain';
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.p = { x: 200, y: G.H[200] - 14, r: 14, hp: 100, side: 'p', id: 'p', buried: true };
    G.f = { x: 620, y: 386, r: 14, hp: 100, side: 'f', id: 'f' };
    G.p2 = null; G.f2 = null;
    ok('AI 叠珠 buried', pickAIWeapon(G.f) === 6 && pitDepth(G.p) >= BURY_PX, Math.round(pitDepth(G.p)));
    G.p.buried = false;
    ok('AI 叠珠 pit', pickAIWeapon(G.f) === 6);
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    G.p = { x: 200, y: 386, r: 14, hp: 100, side: 'p', id: 'p' };
    ok('AI open not 叠珠', pickAIWeapon(G.f) !== 6);
    ok('maps still 14 after 叠珠', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊');
    ok('ghost K still after 叠珠', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('g vk v24', GRAV === 260 && VK === 420);

    ok('雷泽 name', STORM_NAME === '雷泽');
    ok('storm odds', STORM_P === 0.35 && STORM_MIN === 8 && STORM_MAX === 14 && STORM_WALK === 0.88);
    ok('storm bolt ms', STORM_BOLT_MIN === 0.08 && STORM_BOLT_MAX === 0.16);
    ok('storm always vale/cliff/dune', stormForced('vale') && stormForced('cliff') && stormForced('dune') && !stormForced('plain') && !stormForced('forge') && !stormForced('gate'));
    ok('storm never 熔台', stormBanned('forge') && !stormBanned('vale') && pickStorm('forge') === false);
    ok('storm forced maps', pickStorm('vale') === true && pickStorm('cliff') === true && pickStorm('dune') === true);
    ok('maps not renamed by 雷泽', MAP_NAME.vale === '风谷' && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.forge === '熔台' && MAP_NAME.plain === '平原');
    G.kind = 'hall';
    G.storm = false;
    G.H = buildHeight('plain');
    G.mapId = 'plain';
    const grassU = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('grass dry full', onGrass(grassU) === true && Math.abs(walkSpd(grassU) - 90) < 0.01, walkSpd(grassU));
    G.storm = true;
    ok('wet grass 0.88', Math.abs(walkSpd(grassU) - 90 * STORM_WALK) < 0.01, walkSpd(grassU));
    G.H = buildHeight('dune');
    G.mapId = 'dune';
    const wetSand = { x: DUNE_PX, y: G.H[DUNE_PX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('wet sand 0.88', onSand(wetSand) === true && !onGrass(wetSand) && Math.abs(walkSpd(wetSand) - 90 * DUNE_WALK * STORM_WALK) < 0.01, walkSpd(wetSand));
    G.H = buildHeight('moon');
    G.mapId = 'moon';
    const stormWet = { x: MOON_CX, y: G.H[MOON_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('storm water no extra', inMoonWater(stormWet) === true && !onGrass(stormWet) && Math.abs(walkSpd(stormWet) - 90 * MOON_WALK) < 0.01, walkSpd(stormWet));
    ok('leap unchanged in 雷泽', LEAP_DX === 80 && LEAP_H === 56 && LEAP_T === 0.34);
    G.kind = 'hall';
    G.wind = 8;
    ok('storm wind clamp high', nudgeStormWind(1) === 8);
    ok('storm wind minus', nudgeStormWind(-1) === 7);
    G.wind = -8;
    ok('storm wind clamp low', nudgeStormWind(-1) === -8);
    ok('storm wind plus', nudgeStormWind(1) === -7);
    G.kind = 'core';
    G.wind = 14;
    ok('storm core clamp', nudgeStormWind(1) === 14 && windMax() === 14);
    G.kind = 'hall';
    G.storm = true;
    G.mode = 'play';
    ok('storm hud name stays', STORM_NAME === '雷泽' && MAP_NAME.vale === '风谷');
    G.storm = false;
    ok('叠珠 still 7 after 雷泽', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7 && WEPS.length === 8);
    ok('maps still 14 after 雷泽', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.vale === '风谷');
    ok('ghost K still after 雷泽', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('no banned 雷泽', STORM_NAME.indexOf('传送') < 0 && STORM_NAME.indexOf('飞行') < 0 && STORM_NAME.indexOf('三叉戟') < 0 && STORM_NAME.indexOf('激怒') < 0);
    ok('g vk v25', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    G.H = buildHeight('gate');
    G.mapId = 'gate';
    G.kind = 'hall';
    G.storm = false;
    G.walls = [];
    ok('gate spawn', spawnX('gate', 'p') === GATE_PX && spawnX('gate', 'f') === GATE_FX);
    ok('gate spawn on ledges', isGateLedge(GATE_PX) && isGateLedge(GATE_FX), Math.round(G.H[GATE_PX]) + '/' + Math.round(G.H[GATE_FX]));
    ok('gate pillars at 280/660', isGateStoneX(GATE_L_CX) && isGateStoneX(GATE_R_CX) && isGateCrown(GATE_L_CX) && isGateCrown(GATE_R_CX), Math.round(G.H[GATE_L_CX]) + '/' + Math.round(G.H[GATE_R_CX]));
    ok('gate crowns high', G.H[GATE_L_CX] < GATE_LEDGE_Y - 20 && G.H[GATE_R_CX] < GATE_LEDGE_Y - 20, Math.round(G.H[GATE_L_CX]));
    ok('gate corridor pit', isGateCorridor(480) && G.H[480] > G.H[GATE_L_CX] + 120, Math.round(G.H[480] - G.H[GATE_L_CX]));
    ok('gate no void', !isDeathVoid(GATE_PX) && !isDeathVoid(GATE_FX) && !isDeathVoid(480) && !isDeathVoid(GATE_L_CX));
    ok('gate crater 0.72', GATE_CRATER === 0.72);
    ok('gate spawn not stone', !isGateStoneX(GATE_PX) && !isGateStoneX(GATE_FX));
    const gpx = spawnX('gate', 'p');
    const gpy = G.H[gpx | 0] - UNIT_R;
    const gth30 = 30 * Math.PI / 180;
    const gs30 = traceShot(gpx + Math.cos(gth30) * 18, gpy - 4 - Math.sin(gth30) * 18, 30, 70, 0, WEPS[0], G.H, null);
    ok('gate 30 thread', gs30.x > GATE_L1 && gs30.x < GATE_FX && !gs30.air, Math.round(gs30.x));
    const gth65 = 65 * Math.PI / 180;
    const gs65 = traceShot(gpx + Math.cos(gth65) * 18, gpy - 4 - Math.sin(gth65) * 18, 65, 62, 0, WEPS[0], G.H, null);
    ok('gate 65 clip lip', isGateStoneX(gs65.x) && gs65.x > 480 && !gs65.air, Math.round(gs65.x));
    const gLip = 220;
    const gey = G.H[gLip | 0] - UNIT_R;
    const ggrids = Math.round((GATE_L_CX - gLip) / GRID);
    const g90 = 90 - ggrids;
    const gth90 = g90 * Math.PI / 180;
    const gs90 = traceShot(gLip + Math.cos(gth90) * 18, gey - 4 - Math.sin(gth90) * 18, g90, 95, 0, WEPS[0], G.H, null);
    ok('gate 90 dunk', isGateCrown(gs90.x) && !gs90.air, Math.round(gs90.x) + ' a' + g90);
    const gcrownU = { x: GATE_L_CX, y: G.H[GATE_L_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    const gledgeU = { x: GATE_PX, y: G.H[GATE_PX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('gate crown walk full', Math.abs(walkSpd(gcrownU) - 90) < 0.01, walkSpd(gcrownU));
    ok('gate ledge walk full', Math.abs(walkSpd(gledgeU) - 78) < 0.01, walkSpd(gledgeU));
    G.storm = true;
    ok('gate crown dry in 雷泽', !onGrass(gcrownU) && Math.abs(walkSpd(gcrownU) - 90) < 0.01, walkSpd(gcrownU));
    ok('gate ledge wet grass', onGrass(gledgeU) && Math.abs(walkSpd(gledgeU) - 78 * STORM_WALK) < 0.01, walkSpd(gledgeU));
    G.storm = false;
    const flatG = new Float32Array(VW);
    for (let i = 0; i < VW; i++) flatG[i] = 400;
    G.H = flatG;
    G.mapId = 'plain';
    carve(500, 400, 30);
    const dirtDepth = G.H[500] - 400;
    G.mapId = 'gate';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(GATE_L_CX, 400, stoneR(30, GATE_L_CX));
    const stoneDepth = G.H[GATE_L_CX] - 400;
    ok('gate stone crater ~0.72', stoneDepth < dirtDepth * 0.85 && Math.abs(stoneDepth / dirtDepth - GATE_CRATER) < 0.08, Math.round(stoneDepth) + '/' + Math.round(dirtDepth));
    G.H = buildHeight('gate');
    G.mapId = 'gate';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(168, 400, stoneR(30, 168));
    const gateDirtDepth = G.H[168] - 400;
    ok('gate dirt crater normal', Math.abs(gateDirtDepth - dirtDepth) < 0.5, Math.round(gateDirtDepth));
    G.H = buildHeight('gate');
    G.mapId = 'gate';
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.p = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: GATE_FX, y: G.H[GATE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('gate AI corridor 高爆', isGateCorridor(G.p.x) && pickAIWeapon(G.f) === 1);
    const gimp = { x: 480, y: G.H[480], t: 1, hit: null };
    const gsc90 = scoreOne(gimp, WEPS[1], G.f, G.p, 88);
    const gsc30 = scoreOne(gimp, WEPS[1], G.f, G.p, 30);
    ok('gate AI prefer dunk', gsc90 > gsc30 + 400, Math.round(gsc90) + '>' + Math.round(gsc30));
    G.p = { x: GATE_L_CX, y: G.H[GATE_L_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: GATE_R_CX, y: G.H[GATE_R_CX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    ok('gate AI far crown 普通', isGateCrown(G.f.x) && pickAIWeapon(G.p) === 0);
    const gimpC = { x: GATE_R_CX, y: G.H[GATE_R_CX], t: 1, hit: null };
    const gsc65 = scoreOne(gimpC, WEPS[0], G.p, G.f, 65);
    const gscLow = scoreOne(gimpC, WEPS[0], G.p, G.f, 30);
    ok('gate AI prefer 65 on far crown', gsc65 > gscLow + 400, Math.round(gsc65) + '>' + Math.round(gscLow));
    G.kind = 'duo';
    const gdx0 = spawnAt('p', 0);
    const gdx1 = spawnAt('p', 1);
    const gdr0 = spawnAt('f', 0);
    const gdr1 = spawnAt('f', 1);
    ok('gate duo extras ledge', isGateLedge(gdx0) && isGateLedge(gdx1) && isGateLedge(gdr0) && isGateLedge(gdr1), gdx1 + '/' + gdr1);
    ok('gate duo tops', gdx0 === GATE_PX && gdr0 === GATE_FX);
    ok('gate duo extras along', Math.abs(gdx1 - gdx0) >= 20 && Math.abs(gdr1 - gdr0) >= 20, Math.round(Math.abs(gdx1 - gdx0)));
    ok('gate duo not in gate', !isGateCorridor(gdx1) && !isGateCorridor(gdr1) && !isGateStoneX(gdx1) && !isGateStoneX(gdr1));
    ok('gate duo not void', !isDeathVoid(gdx0) && !isDeathVoid(gdx1) && !isDeathVoid(gdr0) && !isDeathVoid(gdr1));
    G.kind = 'hall';
    ok('gate storm roll not forced', !stormForced('gate') && !stormBanned('gate') && STORM_P === 0.35);
    ok('石门 name locked', MAP_NAME.gate === '石门' && MAP_IDS[14] === 'gate');
    ok('no banned gate', MAP_NAME.gate.indexOf('传送') < 0 && MAP_NAME.gate.indexOf('飞行') < 0 && MAP_NAME.gate.indexOf('三叉戟') < 0 && MAP_NAME.gate.indexOf('激怒') < 0);
    ok('maps 15 with 石门', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门');
    ok('叠珠 still 7 after 石门', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('ghost K still after 石门', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 石门', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('g vk v26', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    ok('迟雷 is 8', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8 && WEPS.length === 8);
    ok('迟雷 stats', WEPS[7].direct === 26 && WEPS[7].splash === 42 && WEPS[7].crater === 34 && WEPS[7].spd === 0.94);
    ok('迟雷 fuse 1.6', MINE_FUSE === 1.6 && MINE_HIT === 0.85);
    ok('迟雷 hit splash 0.85', Math.abs(mineHitWep(WEPS[7]).splash - 42 * 0.85) < 0.001 && mineHitWep(WEPS[7]).crater === 34);
    ok('迟雷 delay 120', delayCost(8) === 120 && delayCost(7) === 135 && delayCost(0) === 100);
    ok('1-7 names stay', WEPS[0].name === '普通弹' && WEPS[1].name === '高爆' && WEPS[2].name === '穿透' && WEPS[3].name === '三裂' && WEPS[4].name === '霓轨' && WEPS[5].name === '霓火' && WEPS[6].name === '叠珠');
    ok('no banned 迟雷', WEPS[7].name.indexOf('传送') < 0 && WEPS[7].name.indexOf('飞行') < 0 && WEPS[7].name.indexOf('三叉戟') < 0 && WEPS[7].name.indexOf('激怒') < 0);
    ok('isMineWep', isMineWep(WEPS[7]) === true && isMineWep(WEPS[6]) === false && isDualWep(WEPS[6]) === true);
    G.H = buildHeight('gate');
    G.mapId = 'gate';
    G.kind = 'hall';
    G.storm = false;
    G.wind = 0;
    G.ai = 1;
    G.turns = 1;
    G.mines = [];
    G.p = { x: 210, y: G.H[210] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: GATE_FX, y: G.H[GATE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('AI opener not 迟雷', (G.turns | 0) < 2 && pickAIWeapon(G.f) !== 7);
    G.turns = 3;
    ok('gate approach on ledge', isGateLedge(210) && !isGateCorridor(210) && denyZoneDist(G.p) > 8 && denyZoneDist(G.p) <= WALK_PX * 1.4);
    ok('AI 迟雷 deny 石门', wantChiLei(G.f, G.p) === true && pickAIWeapon(G.f) === 7);
    G.ai = 0;
    ok('easy never 迟雷', wantChiLei(G.f, G.p) === false && pickAIWeapon(G.f) !== 7);
    G.ai = 1;
    G.p = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('gate already in 廊 still 高爆', isGateCorridor(G.p.x) && pickAIWeapon(G.f) === 1);
    G.H = buildHeight('dune');
    G.mapId = 'dune';
    G.turns = 3;
    G.ai = 1;
    let duneX = DUNE_PX;
    for (let x = 190; x <= 310; x += 2) {
      if (!isDuneCrest(x) || isDuneSaddle(x)) continue;
      const d = Math.abs(360 - x);
      if (d > 8 && d <= WALK_PX * 1.4) { duneX = x; break; }
    }
    G.p = { x: duneX, y: G.H[duneX | 0] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: DUNE_FX, y: G.H[DUNE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    ok('dune approach crest', isDuneCrest(duneX) && !isDuneSaddle(duneX) && denyZoneDist(G.p) > 8 && denyZoneDist(G.p) <= WALK_PX * 1.4, duneX);
    ok('AI 迟雷 deny 沙脊', wantChiLei(G.f, G.p) === true && pickAIWeapon(G.f) === 7);
    G.p = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('dune already in 鞍 still 高爆', isDuneSaddle(G.p.x) && pickAIWeapon(G.f) === 1);
    G.H = new Float32Array(VW);
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    for (let i = 176; i <= 224; i++) G.H[i] = 452;
    G.mapId = 'plain';
    G.turns = 4;
    G.p = { x: 200, y: G.H[200] - 14, r: 14, hp: 100, side: 'p', id: 'p', buried: true };
    G.f = { x: 620, y: 386, r: 14, hp: 100, side: 'f', id: 'f' };
    ok('AI 叠珠 over 迟雷', pickAIWeapon(G.f) === 6 && pitDepth(G.p) >= BURY_PX);
    G.H = buildHeight('gate');
    G.mapId = 'gate';
    G.turns = 3;
    G.mines = [];
    G.p = { x: 210, y: G.H[210] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: GATE_FX, y: G.H[GATE_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    G.mines = [{ x: 400, y: 400, side: 'f', fuse: 1, max: 1.6, owner: G.f, wep: WEPS[7] }];
    ok('AI no second 迟雷', liveMineOf('f') && pickAIWeapon(G.f) !== 7);
    G.mines = [{ x: 200, y: 300, side: 'p', fuse: 1.2, max: 1.6, owner: G.p, wep: WEPS[7] }];
    fizzleSideMine('p', true);
    ok('replace fizzle', !liveMineOf('p') && G.mines.length === 0);
    G.mines = [
      { x: 200, y: 300, side: 'p', fuse: 1.2, max: 1.6, owner: G.p, wep: WEPS[7] },
      { x: 700, y: 300, side: 'f', fuse: 0.8, max: 1.6, owner: G.f, wep: WEPS[7] }
    ];
    ok('one live per side', !!liveMineOf('p') && !!liveMineOf('f') && G.mines.length === 2);
    fizzleSideMine('p', true);
    ok('fizzle only own side', !liveMineOf('p') && !!liveMineOf('f') && G.mines.length === 1);
    G.mines = [];
    G.H = buildHeight('gate');
    G.mapId = 'gate';
    G.p = { x: 210, y: G.H[210] - 14, r: 14, hp: 100, side: 'p', id: 'p' };
    G.f = { x: GATE_FX, y: G.H[GATE_FX] - 14, r: 14, hp: 100, side: 'f', id: 'f' };
    const gimpM = { x: GATE_L1 + 36, y: G.H[(GATE_L1 + 36) | 0], t: 1.1, hit: null };
    const mscDeny = scoreOne(gimpM, WEPS[7], G.f, G.p, 45);
    const mscHit = scoreOne({ x: 210, y: G.p.y, t: 0.6, hit: G.p }, WEPS[7], G.f, G.p, 45);
    ok('迟雷 prefer deny stick', mscDeny > 2000, Math.round(mscDeny) + '/' + Math.round(mscHit));
    ok('叠珠 still 7 after 迟雷', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7 && WEPS.length === 8);
    ok('maps 15 after 迟雷', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门');
    ok('ghost K still after 迟雷', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 迟雷', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('雷泽 still after 迟雷', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune'));
    ok('g vk v27', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    G.H = buildHeight('frost');
    G.mapId = 'frost';
    G.kind = 'hall';
    G.storm = false;
    G.walls = [];
    G.ai = 1;
    G.turns = 3;
    G.mines = [];
    G.walk = WALK_PX;
    ok('frost spawn', spawnX('frost', 'p') === FROST_PX && spawnX('frost', 'f') === FROST_FX);
    ok('frost spawn on banks', isFrostBank(FROST_PX) && isFrostBank(FROST_FX), Math.round(G.H[FROST_PX]) + '/' + Math.round(G.H[FROST_FX]));
    ok('frost lake low flat', G.H[480] > G.H[FROST_PX] + 60 && G.H[480] < 460 && Math.abs(G.H[480] - FROST_ICE_Y) < 8, Math.round(G.H[480]));
    ok('frost ice band', isFrostIce(480) && isFrostIce(FROST_ICE0 + 4) && !isFrostIce(FROST_PX) && !isFrostIce(FROST_FX));
    ok('frost no void', !isDeathVoid(FROST_PX) && !isDeathVoid(FROST_FX) && !isDeathVoid(480));
    ok('frost nums', FROST_WALK === 1.15 && FROST_CRATER === 0.55 && FROST_SKIP === 28 && FROST_SKIP_VY === 0.55 && FROST_SKIP_VX === 0.92);
    const fIceU = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true, stam: 100, slideVx: 0, face: 1 };
    const fBankU = { x: FROST_PX, y: G.H[FROST_PX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true, stam: 100, slideVx: 0, face: 1 };
    const fBankAI = { x: FROST_FX, y: G.H[FROST_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('frost on ice', onIce(fIceU) === true && onIce(fBankU) === false);
    ok('frost ice walk 1.15', Math.abs(walkSpd(fIceU) - 90 * FROST_WALK) < 0.01, walkSpd(fIceU));
    ok('frost bank walk full', Math.abs(walkSpd(fBankU) - 90) < 0.01, walkSpd(fBankU));
    ok('frost bank ai full', Math.abs(walkSpd(fBankAI) - 78) < 0.01, walkSpd(fBankAI));
    G.storm = true;
    ok('frost ice not wet grass', !onGrass(fIceU) && Math.abs(walkSpd(fIceU) - 90 * FROST_WALK) < 0.01, walkSpd(fIceU));
    ok('frost bank wet grass', onGrass(fBankU) && Math.abs(walkSpd(fBankU) - 90 * STORM_WALK) < 0.01, walkSpd(fBankU));
    G.storm = false;
    G.walk = WALK_PX;
    const fSlide = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, grounded: true, stam: 100, slideVx: 0, face: 1 };
    const fSlideX0 = fSlide.x;
    for (let i = 0; i < 30; i++) iceMove(fSlide, 1, 1 / 60, true);
    ok('frost ice faster walk', fSlide.x > fSlideX0 + 90 * FROST_WALK * 0.5 * 0.85, Math.round(fSlide.x - fSlideX0));
    const fSlideX1 = fSlide.x;
    const fSlideV = fSlide.slideVx;
    G.walk = 0;
    for (let i = 0; i < 24; i++) iceMove(fSlide, 0, 1 / 60, true);
    ok('frost slide after release', fSlide.x > fSlideX1 + 10 && fSlideV > 40, Math.round(fSlide.x - fSlideX1) + ' v' + Math.round(fSlideV));
    const skipS = { x: 480, y: G.H[480] - 2, vx: 360, vy: 80, iceSkip: false };
    ok('frost skip angle', iceImpactDeg(360, 80) < FROST_SKIP);
    ok('frost skip want', wantIceSkip(skipS, 480) === true);
    applyIceSkip(skipS);
    ok('frost skip once', skipS.iceSkip === true && skipS.vy < 0 && Math.abs(skipS.vx - 360 * FROST_SKIP_VX) < 0.02);
    ok('frost skip second no', wantIceSkip(skipS, 480) === false);
    const steepS = { x: 480, y: G.H[480] - 2, vx: 80, vy: 360, iceSkip: false };
    ok('frost steep no skip', iceImpactDeg(80, 360) > FROST_SKIP && wantIceSkip(steepS, 480) === false);
    const bankSkip = { x: FROST_PX, y: G.H[FROST_PX] - 2, vx: 360, vy: 80, iceSkip: false };
    ok('frost bank no skip', wantIceSkip(bankSkip, FROST_PX) === false);
    const iceMx = 320;
    const iceMy = G.H[iceMx] - 6;
    const fts20 = traceShot(iceMx, iceMy, 8, 88, 0, WEPS[0], G.H, null);
    ok('frost trace skip', fts20.iceSkip === true, Math.round(fts20.x) + ' skip=' + fts20.iceSkip);
    const fts90 = traceShot(iceMx, iceMy, 90, 95, 0, WEPS[0], G.H, null);
    ok('frost trace dunk no skip', !fts90.iceSkip && isFrostIce(fts90.x), Math.round(fts90.x));
    const flatF = new Float32Array(VW);
    for (let i = 0; i < VW; i++) flatF[i] = 400;
    G.H = flatF;
    G.mapId = 'plain';
    carve(500, 400, 30);
    const frostDirt = G.H[500] - 400;
    G.mapId = 'frost';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(480, 400, iceR(30, 480));
    const frostIceDepth = G.H[480] - 400;
    ok('frost ice crater ~0.55', frostIceDepth < frostDirt * 0.7 && Math.abs(frostIceDepth / frostDirt - FROST_CRATER) < 0.08, Math.round(frostIceDepth) + '/' + Math.round(frostDirt));
    G.H = buildHeight('frost');
    G.mapId = 'frost';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    carve(168, 400, iceR(30, 168));
    const frostBankDepth = G.H[168] - 400;
    ok('frost bank crater normal', Math.abs(frostBankDepth - frostDirt) < 0.5, Math.round(frostBankDepth));
    G.H = buildHeight('frost');
    G.mapId = 'frost';
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.turns = 3;
    G.mines = [];
    G.p = { x: 480, y: G.H[480] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: FROST_FX, y: G.H[FROST_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('frost AI lake 高爆', isFrostIce(G.p.x) && pickAIWeapon(G.f) === 1);
    const fimp = { x: 480, y: G.H[480], t: 1, hit: null };
    const fsc90 = scoreOne(fimp, WEPS[1], G.f, G.p, 88);
    const fsc65 = scoreOne(fimp, WEPS[1], G.f, G.p, 65);
    const fsc20 = scoreOne(fimp, WEPS[1], G.f, G.p, 20);
    ok('frost AI prefer dunk', fsc90 > fsc20 + 400 && fsc65 > fsc20 + 400, Math.round(fsc90) + '/' + Math.round(fsc65) + '>' + Math.round(fsc20));
    const lipX = FROST_ICE0 + 40;
    G.p = { x: lipX, y: G.H[lipX | 0] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    ok('frost lip on ice', isFrostIce(lipX) && denyZoneDist(G.p) > 8 && denyZoneDist(G.p) <= WALK_PX * 1.4, denyZoneDist(G.p));
    ok('frost AI 迟雷 lip', wantChiLei(G.f, G.p) === true && pickAIWeapon(G.f) === 7);
    G.ai = 0;
    ok('frost easy never 迟雷', wantChiLei(G.f, G.p) === false && pickAIWeapon(G.f) !== 7);
    G.ai = 1;
    G.kind = 'duo';
    const fdx0 = spawnAt('p', 0);
    const fdx1 = spawnAt('p', 1);
    const fdr0 = spawnAt('f', 0);
    const fdr1 = spawnAt('f', 1);
    ok('frost duo extras bank', isFrostBank(fdx0) && isFrostBank(fdx1) && isFrostBank(fdr0) && isFrostBank(fdr1), fdx1 + '/' + fdr1);
    ok('frost duo tops', fdx0 === FROST_PX && fdr0 === FROST_FX);
    ok('frost duo extras along', Math.abs(fdx1 - fdx0) >= 20 && Math.abs(fdr1 - fdr0) >= 20, Math.round(Math.abs(fdx1 - fdx0)));
    ok('frost duo not ice', !isFrostIce(fdx1) && !isFrostIce(fdr1));
    ok('frost duo not void', !isDeathVoid(fdx0) && !isDeathVoid(fdx1) && !isDeathVoid(fdr0) && !isDeathVoid(fdr1));
    G.kind = 'hall';
    ok('frost storm roll not forced', !stormForced('frost') && !stormBanned('frost') && STORM_P === 0.35);
    ok('霜泽 name locked', MAP_NAME.frost === '霜泽' && MAP_IDS[15] === 'frost');
    ok('no banned frost', MAP_NAME.frost.indexOf('传送') < 0 && MAP_NAME.frost.indexOf('飞行') < 0 && MAP_NAME.frost.indexOf('三叉戟') < 0 && MAP_NAME.frost.indexOf('激怒') < 0);
    ok('maps 16 with 霜泽', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门' && MAP_NAME.frost === '霜泽');
    ok('叠珠 still 7 after 霜泽', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('迟雷 still 8 after 霜泽', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8);
    ok('ghost K still after 霜泽', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 霜泽', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('雷泽 still after 霜泽', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune'));
    ok('g vk v28', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    G.mapId = 'plain';
    G.H = buildHeight('plain');
    G.walls = [];
    G.kind = 'hall';
    G.mode = 'play';
    G.phase = 'aim';
    G.sudden = false;
    G.turns = 0;
    G.turn = 'p';
    G.crates = [];
    G.fruits = [];
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', items: freshItems(), rage: 10, stam: 100 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', items: freshItems(), rage: 10, stam: 100, ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('crate names locked', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('crate table 50/35/15', CRATE_ITEM_P === 0.5 && CRATE_RAGE_P === 0.35 && CRATE_GOLD_P === 0.15 && Math.abs(CRATE_ITEM_P + CRATE_RAGE_P + CRATE_GOLD_P - 1) < 1e-9);
    ok('crate rage nums', CRATE_RAGE === 18 && CRATE_GOLD_RAGE === 28 && CRATE_MAX === 2 && CRATE_R === 9);
    ok('crate roll 术', rollCrateKind(0.49) === 'item');
    ok('crate roll 怒', rollCrateKind(0.50) === 'rage' && rollCrateKind(0.84) === 'rage');
    ok('crate roll 金匣', rollCrateKind(0.85) === 'gold');
    ok('first turn no crate', maybeDropCrate(true) == null && liveCrateCount() === 0);
    G.turns = 2;
    const drop1 = maybeDropCrate(true);
    ok('crate drops on dirt', !!drop1 && crateGroundOk(drop1.x) && liveCrateCount() === 1);
    G.crates = [];
    spawnCrateAt(220);
    spawnCrateAt(420);
    ok('crate cap 2', liveCrateCount() === 2);
    maybeDropCrate(true);
    ok('crate cap holds', liveCrateCount() === 2);
    G.mapId = 'frost';
    G.H = buildHeight('frost');
    ok('crate not ice', crateGroundOk(480) === false && crateGroundOk(FROST_PX) === true);
    G.mapId = 'forge';
    G.H = buildHeight('forge');
    ok('crate not lava/void', crateGroundOk(270) === false && crateGroundOk(148) === true);
    G.mapId = 'isles';
    G.H = buildHeight('isles');
    ok('crate not void gap', crateGroundOk(330) === false && crateGroundOk(160) === true);
    G.mapId = 'moon';
    G.H = buildHeight('moon');
    ok('crate not moon pit', crateGroundOk(MOON_CX) === false && crateGroundOk(MOON_PX) === true);
    G.mapId = 'plain';
    G.H = buildHeight('plain');
    G.walls = [];
    const pitX = 400;
    carve(pitX, G.H[pitX], 48);
    ok('crate not pit', crateGroundOk(pitX) === false);
    G.H = buildHeight('plain');
    G.kind = 'drill';
    G.turns = 4;
    G.crates = [];
    ok('drill no crate', crateModeOk() === false && maybeDropCrate(true) == null);
    G.kind = 'hall';
    G.turns = 3;
    ok('hall can crate', crateModeOk() === true);
    const bagI = { items: { leap: 2, warp: 1, neon: 2, drum: 1, nixi: 1, veil: 1 }, rage: 10, stake: false };
    const gi = grantCrate(bagI, 'item');
    ok('crate grant 术', gi && gi.kind === 'item' && gi.toast === '堂匣 · 术' && bagI.items[gi.id] === ITEM_MAX[gi.id] + 1);
    const bagR = { items: freshItems(), rage: 40, stake: false };
    const gr = grantCrate(bagR, 'rage');
    ok('crate grant 怒 +18', gr && gr.kind === 'rage' && gr.toast === '堂匣 · 怒' && bagR.rage === 58);
    const bagG = { items: freshItems(), rage: 40, stake: false };
    const gg = grantCrate(bagG, 'gold');
    ok('crate grant 金匣 +28', gg && gg.kind === 'gold' && gg.toast === '金匣' && bagG.rage === 68);
    const bagHeld = { items: { leap: 3, warp: 2, neon: 3, drum: 2, nixi: 1, veil: 1 }, rage: 10, stake: false };
    const gf = grantCrate(bagHeld, 'item');
    ok('crate 术 full → 怒', gf && gf.kind === 'rage' && bagHeld.rage === 28);
    G.kind = 'seat';
    ok('seat can crate', crateModeOk() === true);
    G.kind = 'duo';
    ok('duo can crate', crateModeOk() === true);
    G.kind = 'quad';
    ok('quad can crate', crateModeOk() === true);
    G.kind = 'core';
    ok('core can crate', crateModeOk() === true);
    G.kind = 'hall';
    G.mapId = 'plain';
    G.H = buildHeight('plain');
    G.walls = [];
    G.p = { x: 200, y: G.H[200] - 14, r: 14, hp: 80, max: 100, side: 'p', id: 'p' };
    G.f = { x: 700, y: G.H[700] - 14, r: 14, hp: 80, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    G.crates = [{ x: 640, y: G.H[640] - 9, r: 9, vy: 0, bounce: 0 }];
    const biasWalk = crateWalkBias(G.f, G.f.x, { score: 1800 });
    ok('AI extra walk to nearer crate', biasWalk < G.f.x && Math.abs(G.f.x - biasWalk - CRATE_WALK) < 2, Math.round(biasWalk));
    const biasKill = crateWalkBias(G.f, G.f.x, { score: 12000 });
    ok('AI never skip kill for crate', biasKill === G.f.x);
    G.f.hp = 22;
    const biasHp = crateWalkBias(G.f, G.f.x, { score: 1800 });
    ok('AI crate only if HP safe', biasHp === G.f.x);
    G.f.hp = 80;
    G.crates = [{ x: 100, y: G.H[100] - 9, r: 9, vy: 0, bounce: 0 }];
    const biasFar = crateWalkBias(G.f, G.f.x, { score: 1800 });
    ok('AI crate must be nearer than foe', biasFar === G.f.x);
    G.crates = [];
    G.p = { x: 400, y: G.H[400] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', items: freshItems(), rage: 0 };
    G.crates = [{ x: 400, y: G.H[400] - 14, r: 9, vy: 0, bounce: 0 }];
    tryPickCrates(G.p);
    ok('walk pickup crate', liveCrateCount() === 0);
    G.crates = [{ x: 480, y: G.H[480] - 9, r: 9, vy: 0, bounce: 0 }];
    blastCrates(480, G.H[480], 36, G.p);
    ok('splash breaks crate', liveCrateCount() === 0);
    G.crates = [];
    spawnCrateAt(200);
    ok('REDUCE still spawns', liveCrateCount() === 1);
    G.crates = [];
    G.sudden = true;
    ok('crate late is 殿塌', crateLate() === true && CRATE_SUDDEN_P > CRATE_P);
    G.sudden = false;
    ok('no 9th wep', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('maps still 16 after 堂匣', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门' && MAP_NAME.frost === '霜泽');
    ok('locked names after 堂匣', MAP_NAME.cliff === '断崖' && STORM_NAME === '雷泽' && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('ghost K still after 堂匣', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 堂匣', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('no banned crate words', CRATE_NAME.indexOf('传送') < 0 && CRATE_NAME.indexOf('飞行') < 0 && CRATE_GOLD_NAME.indexOf('三叉戟') < 0 && CRATE_GOLD_NAME.indexOf('激怒') < 0);
    ok('g vk v29', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    G.kind = 'hall';
    G.sudden = false;
    ok('时尽 hall 18', turnTime() === 18 && TURN_T === 18);
    G.kind = 'core';
    ok('时尽 堂核 14', turnTime() === 14);
    G.sudden = true;
    ok('时尽 殿塌 11', turnTime() === 11);
    G.kind = 'hall';
    ok('时尽 殿塌 covers 弹堂', turnTime() === 11);
    G.kind = 'core';
    ok('时尽 殿塌 covers 堂核', turnTime() === 11);
    G.sudden = false;
    G.kind = 'seat';
    ok('时尽 对坐 18', turnTime() === 18);
    G.kind = 'duo';
    ok('时尽 对堂 18', turnTime() === 18);
    G.kind = 'quad';
    ok('时尽 堂座 18', turnTime() === 18);
    G.kind = 'drill';
    ok('时尽 演习 18', turnTime() === 18);
    G.kind = 'hall';
    G.mode = 'play';
    G.phase = 'aim';
    G.p = { x: 152, y: 400, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: 768, y: 400, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    G.p2 = null;
    G.f2 = null;
    G.shots = [];
    G.dual = null;
    G.mines = [];
    ok('clock free empty', clockPaused() === false);
    G.mines = [{ x: 400, y: 400, fuse: 1.2, side: 'p' }];
    ok('clock pause 迟雷', clockPaused() === true);
    G.mines = [{ x: 400, y: 400, fuse: 0, side: 'p' }];
    ok('clock free dead 迟雷', clockPaused() === false);
    G.mines = [];
    G.shots = [{ x: 200, y: 200 }];
    ok('clock pause shell', clockPaused() === true);
    G.shots = [];
    ok('clock free after shell', clockPaused() === false);
    ok('maps still 16 after 时尽', MAP_IDS.length === 19 && MAP_NAME.cliff === '断崖' && MAP_NAME.dune === '沙脊' && MAP_NAME.gate === '石门' && MAP_NAME.frost === '霜泽');
    ok('locked names after 时尽', MAP_NAME.cliff === '断崖' && STORM_NAME === '雷泽' && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('no banned 时尽', '时尽'.indexOf('传送') < 0 && '时尽'.indexOf('飞行') < 0 && '时尽'.indexOf('三叉戟') < 0 && '时尽'.indexOf('激怒') < 0);
    ok('g vk v30', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    ok('no 9th wep after 时尽', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');

    G.H = buildHeight('cloud');
    G.mapId = 'cloud';
    G.slab = makeCloudSlab();
    G.kind = 'hall';
    G.storm = false;
    G.walls = [];
    G.ai = 1;
    G.turns = 3;
    G.mines = [];
    G.walk = WALK_PX;
    ok('cloud spawn', spawnX('cloud', 'p') === CLOUD_PX && spawnX('cloud', 'f') === CLOUD_FX);
    ok('cloud spawn on banks', isCloudBank(CLOUD_PX) && isCloudBank(CLOUD_FX), Math.round(G.H[CLOUD_PX]) + '/' + Math.round(G.H[CLOUD_FX]));
    ok('cloud banks high', G.H[CLOUD_PX] < 340 && G.H[CLOUD_FX] < 340, Math.round(G.H[CLOUD_PX]));
    ok('cloud pit low', G.H[480] > G.H[CLOUD_PX] + 80 && Math.abs(G.H[480] - CLOUD_PIT_Y) < 16, Math.round(G.H[480]));
    ok('cloud no void pit', !isDeathVoid(CLOUD_PX) && !isDeathVoid(CLOUD_FX) && !isDeathVoid(480));
    ok('cloud nums', CLOUD_SLAB_W === 220 && CLOUD_AMP === 90 && CLOUD_PERIOD === 7 && CLOUD_CRATER === 0.8 && GRAV === 260 && VK === 420);
    ok('cloud slab mid', isCloudSlabX(480) && Math.abs(slabTopAt(480) - CLOUD_SLAB_Y) < 3, slabTopAt(480));
    ok('cloud slab width', isCloudSlabX(480 - 100) && isCloudSlabX(480 + 100) && !isCloudSlabX(480 - 130) && !isCloudSlabX(480 + 130));
    const cBankU = { x: CLOUD_PX, y: G.H[CLOUD_PX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true, stam: 100 };
    const cSlabU = { x: 480, y: CLOUD_SLAB_Y - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true, stam: 100 };
    ok('cloud on slab', onCloudSlab(cSlabU) === true && onCloudSlab(cBankU) === false);
    ok('cloud bank not slab', !isCloudSlabX(CLOUD_PX) && isCloudBank(CLOUD_PX));
    for (let i = 0; i < 105; i++) tickSlab(CLOUD_PERIOD / 420);
    ok('cloud slab slides', Math.abs(G.slab.cx - (CLOUD_CX0 + CLOUD_AMP)) < 6, Math.round(G.slab.cx));
    ok('cloud slab vx', Math.abs(G.slab.vx) < 12, Math.round(G.slab.vx));
    G.slab = makeCloudSlab();
    G.p = { x: 480, y: CLOUD_SLAB_Y - 14, r: 14, hp: 100, grounded: true, stam: 100, side: 'p', id: 'p' };
    G.f = { x: CLOUD_FX, y: G.H[CLOUD_FX] - 14, r: 14, hp: 100, grounded: true, side: 'f', id: 'f' };
    G.p2 = null; G.f2 = null;
    G.mines = []; G.fires = []; G.crates = [];
    const rideX0 = G.p.x;
    tickSlab(0.12);
    ok('cloud ride inherit vx', Math.abs(G.p.x - rideX0) > 2 && onCloudSlab(G.p), Math.round(G.p.x - rideX0));
    G.slab = makeCloudSlab();
    const midI = (CLOUD_SLAB_W / 2) | 0;
    const slabY0 = G.slab.col[midI];
    carve(G.slab.cx, CLOUD_SLAB_Y, 30);
    ok('cloud slab crater 0.8', G.slab.col[midI] > slabY0 + 8 && G.slab.col[midI] < slabY0 + 30, Math.round(G.slab.col[midI] - slabY0));
    G.H = buildHeight('plain');
    G.mapId = 'plain';
    G.slab = null;
    carve(500, 400, 30);
    const cloudDirt = G.H[500] - 400;
    G.H = buildHeight('cloud');
    G.mapId = 'cloud';
    G.slab = makeCloudSlab();
    const pitBefore = G.H[480];
    carve(480, CLOUD_SLAB_Y, 30);
    ok('cloud pit not carved from slab hit', Math.abs(G.H[480] - pitBefore) < 0.5, Math.round(G.H[480] - pitBefore));
    G.slab = makeCloudSlab();
    for (let k = -2; k <= 2; k++) {
      for (let n = 0; n < 3; n++) carve(CLOUD_CX0 + k * 40, CLOUD_SLAB_Y, 48);
    }
    ok('cloud rubble stops', G.slab.live === false && G.slab.vx === 0, cloudSolidCount() + '/' + G.slab.live);
    G.slab = makeCloudSlab();
    G.H = buildHeight('cloud');
    G.mapId = 'cloud';
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.p = { x: 480, y: CLOUD_SLAB_Y - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true };
    G.f = { x: CLOUD_FX, y: G.H[CLOUD_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('cloud AI slab 普通', isCloudSlabX(G.p.x) && pickAIWeapon(G.f) === 0);
    const cimp = { x: 480, y: CLOUD_SLAB_Y, t: 1.1, hit: null };
    const csc65 = scoreOne(cimp, WEPS[0], G.f, G.p, 65);
    const csc20 = scoreOne(cimp, WEPS[0], G.f, G.p, 20);
    ok('cloud AI prefer 65', csc65 > csc20 + 400, Math.round(csc65) + '>' + Math.round(csc20));
    G.slab.live = true;
    G.slab.vx = 80;
    const leadImp = { x: 480 + 80 * 1.1, y: CLOUD_SLAB_Y, t: 1.1, hit: null };
    const nowImp = { x: 480, y: CLOUD_SLAB_Y, t: 1.1, hit: null };
    const leadSc = scoreOne(leadImp, WEPS[0], G.f, G.p, 65);
    const nowSc = scoreOne(nowImp, WEPS[0], G.f, G.p, 65);
    ok('cloud AI lead vx*tof', leadSc > nowSc, Math.round(leadSc) + '>' + Math.round(nowSc));
    G.kind = 'duo';
    const cloudDx0 = spawnAt('p', 0);
    const cloudDx1 = spawnAt('p', 1);
    const cloudDr0 = spawnAt('f', 0);
    const cloudDr1 = spawnAt('f', 1);
    ok('cloud duo extras bank', isCloudBank(cloudDx0) && isCloudBank(cloudDx1) && isCloudBank(cloudDr0) && isCloudBank(cloudDr1), cloudDx1 + '/' + cloudDr1);
    ok('cloud duo tops', cloudDx0 === CLOUD_PX && cloudDr0 === CLOUD_FX);
    ok('cloud duo extras along', Math.abs(cloudDx1 - cloudDx0) >= 20 && Math.abs(cloudDr1 - cloudDr0) >= 20, Math.round(Math.abs(cloudDx1 - cloudDx0)));
    ok('cloud duo not slab', !isCloudSlabX(cloudDx0) && !isCloudSlabX(cloudDx1) && !isCloudSlabX(cloudDr0) && !isCloudSlabX(cloudDr1));
    ok('cloud duo not void', !isDeathVoid(cloudDx0) && !isDeathVoid(cloudDx1) && !isDeathVoid(cloudDr0) && !isDeathVoid(cloudDr1));
    G.kind = 'hall';
    G.slab = makeCloudSlab();
    ok('crate not slab', crateGroundOk(480) === false && crateGroundOk(CLOUD_PX) === true);
    const fallU = { x: 480, y: CLOUD_SLAB_Y - 14, r: 14, hp: 100, max: 100, grounded: false, vy: 0, fall: 0 };
    G.slab.col[(CLOUD_SLAB_W / 2) | 0] = CLOUD_SLAB_BOT;
    fallU.x = CLOUD_CX0;
    for (let i = 0; i < 90; i++) stepUnitPhys(fallU, 1 / 60);
    ok('cloud fall to pit not void', fallU.grounded && fallU.hp > 0 && fallU.hp < 100 && Math.abs(fallU.y + 14 - G.H[fallU.x | 0]) < 8, fallU.hp + '@' + Math.round(fallU.y));
    ok('cloud storm ~30', !stormForced('cloud') && !stormBanned('cloud') && CLOUD_STORM_P === 0.30 && STORM_P === 0.35);
    ok('云台 name locked', MAP_NAME.cloud === '云台' && MAP_IDS[16] === 'cloud');
    ok('no banned cloud', MAP_NAME.cloud.indexOf('传送') < 0 && MAP_NAME.cloud.indexOf('飞行') < 0 && MAP_NAME.cloud.indexOf('三叉戟') < 0 && MAP_NAME.cloud.indexOf('激怒') < 0);
    ok('maps 17 with 云台', MAP_IDS.length === 19 && MAP_NAME.frost === '霜泽' && MAP_NAME.cloud === '云台' && MAP_NAME.cliff === '断崖');
    ok('叠珠 still 7 after 云台', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('迟雷 still 8 after 云台', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8);
    ok('ghost K still after 云台', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 云台', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('时尽 still after 云台', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
    ok('堂匣 still after 云台', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('雷泽 still after 云台', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune') && stormBanned('forge'));
    ok('g vk v31', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    ok('no 9th wep after 云台', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    G.slab = null;
    G.mapId = 'plain';
    G.H = buildHeight('plain');

    G.H = buildHeight('mirror');
    G.mapId = 'mirror';
    G.mirror = makeMirrorWall();
    G.kind = 'hall';
    G.storm = false;
    G.walls = [];
    G.ai = 1;
    G.turns = 3;
    G.mines = [];
    G.walk = WALK_PX;
    ok('mirror spawn', spawnX('mirror', 'p') === MIRROR_PX && spawnX('mirror', 'f') === MIRROR_FX);
    ok('mirror spawn on banks', isMirrorBank(MIRROR_PX) && isMirrorBank(MIRROR_FX), Math.round(G.H[MIRROR_PX]) + '/' + Math.round(G.H[MIRROR_FX]));
    ok('mirror banks high', G.H[MIRROR_PX] < 340 && G.H[MIRROR_FX] < 340, Math.round(G.H[MIRROR_PX]));
    ok('mirror trench low', G.H[480] > G.H[MIRROR_PX] + 40 && Math.abs(G.H[480] - MIRROR_TRENCH_Y) < 16, Math.round(G.H[480]));
    ok('mirror no void', !isDeathVoid(MIRROR_PX) && !isDeathVoid(MIRROR_FX) && !isDeathVoid(480));
    ok('mirror nums', MIRROR_W === 18 && MIRROR_H === 220 && MIRROR_CRATER === 0.5 && MIRROR_DEAD_H === 0.40 && GRAV === 260 && VK === 420);
    ok('mirror wall mid', inMirror(MIRROR_CX, MIRROR_TOP_Y + 40) && isMirrorStoneX(MIRROR_CX));
    ok('mirror wall thin', isMirrorStoneX(MIRROR_X0) && isMirrorStoneX(MIRROR_X1) && !isMirrorStoneX(MIRROR_X0 - 2) && !isMirrorStoneX(MIRROR_X1 + 2));
    ok('mirror wall tall', inMirror(MIRROR_CX, MIRROR_TOP_Y + 8) && inMirror(MIRROR_CX, MIRROR_TRENCH_Y - 8) && !inMirror(MIRROR_CX, MIRROR_TOP_Y - 8));
    const mBankU = { x: MIRROR_PX, y: G.H[MIRROR_PX] - 14, r: 14, hp: 100, grounded: true };
    ok('mirror walk into wall', wallBlocksWalk(MIRROR_CX, (MIRROR_TOP_Y + MIRROR_TRENCH_Y) * 0.5, 14) === true);
    ok('mirror bank walk open', wallBlocksWalk(MIRROR_PX, mBankU.y, 14) === false);
    const sideS = { x: MIRROR_X0 + 1, y: MIRROR_TOP_Y + 90, vx: 220, vy: 40, mirrorBounce: false };
    ok('mirror side bounce want', wantMirrorBounce(sideS, sideS.x, sideS.y) === true);
    const oldVx = sideS.vx;
    applyMirrorBounce(sideS);
    ok('mirror bounce vx', sideS.mirrorBounce === true && Math.abs(sideS.vx + oldVx) < 0.02, sideS.vx);
    ok('mirror bounce once', wantMirrorBounce(sideS, MIRROR_X0 + 1, MIRROR_TOP_Y + 90) === false);
    const topS = { x: MIRROR_CX, y: MIRROR_TOP_Y + 2, vx: 30, vy: 280, mirrorBounce: false };
    ok('mirror top no bounce', wantMirrorBounce(topS, topS.x, topS.y) === false && Math.abs(mirrorNormal(topS.x, topS.y).nx) < MIRROR_NX);
    G.p = { x: MIRROR_PX, y: G.H[MIRROR_PX] - 18, r: 14, hp: 100, side: 'p', id: 'p' };
    const bounceTr = traceShot(MIRROR_PX, G.H[MIRROR_PX] - 18, 42, 58, 0, WEPS[0], G.H, G.p);
    ok('mirror trace bounce', bounceTr.mirrorBounce === true, Math.round(bounceTr.x) + ' bounce=' + bounceTr.mirrorBounce);
    const dunkTr = traceShot(MIRROR_CX, MIRROR_TOP_Y - 40, 90, 70, 0, WEPS[0], G.H, G.p);
    ok('mirror trace top no bounce', !dunkTr.mirrorBounce && isMirrorStoneX(dunkTr.x), Math.round(dunkTr.x));
    G.H = buildHeight('plain');
    G.mapId = 'plain';
    G.mirror = null;
    carve(500, 400, 30);
    const mirrorDirt = G.H[500] - 400;
    G.H = buildHeight('mirror');
    G.mapId = 'mirror';
    G.mirror = makeMirrorWall();
    const top0 = G.mirror.col[(MIRROR_W / 2) | 0];
    carve(MIRROR_CX, MIRROR_TOP_Y, mirrorR(30, MIRROR_CX));
    const chip = G.mirror.col[(MIRROR_W / 2) | 0] - top0;
    ok('mirror crater ~0.5', chip > 4 && chip < mirrorDirt * 0.85, Math.round(chip) + '/' + Math.round(mirrorDirt));
    G.H = buildHeight('plain');
    G.mapId = 'plain';
    G.mirror = null;
    carve(168, 400, 30);
    const bankDirt = G.H[168] - 400;
    G.H = buildHeight('mirror');
    G.mapId = 'mirror';
    G.mirror = makeMirrorWall();
    const bankBefore = G.H[MIRROR_PX];
    carve(MIRROR_PX, bankBefore, 30);
    const bankChip = G.H[MIRROR_PX] - bankBefore;
    ok('mirror bank crater full', Math.abs(bankChip - bankDirt) < 0.6, Math.round(bankChip));
    G.mirror = makeMirrorWall();
    for (let i = 0; i < MIRROR_W; i++) G.mirror.col[i] = G.mirror.bot - 20;
    refreshMirrorLive();
    ok('mirror collapse rubble', G.mirror.live === false && !wantMirrorBounce({ vx: 200, vy: 10, mirrorBounce: false }, MIRROR_CX, MIRROR_TOP_Y + 80), mirrorSolidCount() + '/' + G.mirror.live);
    G.H = buildHeight('mirror');
    G.mapId = 'mirror';
    G.mirror = makeMirrorWall();
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.p = { x: MIRROR_FX, y: G.H[MIRROR_FX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p', grounded: true };
    G.f = { x: MIRROR_PX, y: G.H[MIRROR_PX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 65 };
    G.p2 = null; G.f2 = null;
    const overImp = { x: MIRROR_FX, y: MIRROR_BANK_Y, t: 1.2, hit: null, mirrorBounce: false };
    const bounceNear = { x: MIRROR_FX, y: MIRROR_BANK_Y, t: 1.2, hit: null, mirrorBounce: true };
    const bounceFar = { x: 220, y: MIRROR_BANK_Y, t: 1.2, hit: null, mirrorBounce: true };
    const msc65 = scoreOne(overImp, WEPS[0], G.f, G.p, 65);
    const msc20 = scoreOne(overImp, WEPS[0], G.f, G.p, 20);
    const mscBounce = scoreOne(bounceNear, WEPS[0], G.f, G.p, 48);
    const mscBounceMiss = scoreOne(bounceFar, WEPS[0], G.f, G.p, 48);
    ok('mirror AI prefer 65 over', msc65 > msc20 + 400, Math.round(msc65) + '>' + Math.round(msc20));
    ok('mirror AI bounce closer', mscBounce > msc65 && mscBounce > mscBounceMiss, Math.round(mscBounce) + '>' + Math.round(msc65));
    G.kind = 'duo';
    const mirDx0 = spawnAt('p', 0);
    const mirDx1 = spawnAt('p', 1);
    const mirDr0 = spawnAt('f', 0);
    const mirDr1 = spawnAt('f', 1);
    ok('mirror duo extras bank', isMirrorBank(mirDx0) && isMirrorBank(mirDx1) && isMirrorBank(mirDr0) && isMirrorBank(mirDr1), mirDx1 + '/' + mirDr1);
    ok('mirror duo tops', mirDx0 === MIRROR_PX && mirDr0 === MIRROR_FX);
    ok('mirror duo extras along', Math.abs(mirDx1 - mirDx0) >= 20 && Math.abs(mirDr1 - mirDr0) >= 20, Math.round(Math.abs(mirDx1 - mirDx0)));
    ok('mirror duo not wall', !isMirrorStoneX(mirDx0) && !isMirrorStoneX(mirDx1) && !isMirrorStoneX(mirDr0) && !isMirrorStoneX(mirDr1));
    ok('mirror duo not void', !isDeathVoid(mirDx0) && !isDeathVoid(mirDx1) && !isDeathVoid(mirDr0) && !isDeathVoid(mirDr1));
    G.kind = 'hall';
    ok('crate not trench', crateGroundOk(480) === false && crateGroundOk(MIRROR_PX) === true);
    const fallU2 = { x: 420, y: MIRROR_BANK_Y - 14, r: 14, hp: 100, max: 100, grounded: false, vy: 0, fall: 0 };
    for (let i = 0; i < 90; i++) stepUnitPhys(fallU2, 1 / 60);
    ok('mirror fall trench not void', fallU2.grounded && fallU2.hp > 0 && fallU2.hp < 100 && Math.abs(fallU2.y + 14 - G.H[fallU2.x | 0]) < 10, fallU2.hp + '@' + Math.round(fallU2.y));
    ok('mirror storm ~30', !stormForced('mirror') && !stormBanned('mirror') && MIRROR_STORM_P === 0.30 && STORM_P === 0.35);
    ok('镜廊 name locked', MAP_NAME.mirror === '镜廊' && MAP_IDS[17] === 'mirror');
    ok('no banned mirror', MAP_NAME.mirror.indexOf('传送') < 0 && MAP_NAME.mirror.indexOf('飞行') < 0 && MAP_NAME.mirror.indexOf('三叉戟') < 0 && MAP_NAME.mirror.indexOf('激怒') < 0);
    ok('maps 18 with 镜廊', MAP_IDS.length === 19 && MAP_NAME.cloud === '云台' && MAP_NAME.mirror === '镜廊' && MAP_NAME.cliff === '断崖');
    ok('叠珠 still 7 after 镜廊', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('迟雷 still 8 after 镜廊', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8);
    ok('ghost K still after 镜廊', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 镜廊', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('时尽 still after 镜廊', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
    ok('堂匣 still after 镜廊', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('云台 still after 镜廊', MAP_NAME.cloud === '云台' && MAP_IDS[16] === 'cloud');
    ok('雷泽 still after 镜廊', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune') && stormBanned('forge'));
    ok('g vk v32', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    ok('no 9th wep after 镜廊', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    G.mirror = null;
    G.mapId = 'plain';
    G.H = buildHeight('plain');

    ok('余震 name', QUAKE_NAME === '余震' && QUAKE_T === 0.28 && QUAKE_R === 36 && QUAKE_NEAR === 90 && QUAKE_LEDGE === 28);
    ok('余震 slip 8-14', QUAKE_SLIP_MIN === 8 && QUAKE_SLIP_MAX === 14 && QUAKE_SLIP_P === 0.5);
    ok('余震 crumbs 4-7', QUAKE_CRUMB_MIN === 4 && QUAKE_CRUMB_MAX === 7 && QUAKE_SHAKE_MIN === 3 && QUAKE_SHAKE_MAX === 5);
    ok('余震 no banned', QUAKE_NAME.indexOf('传送') < 0 && QUAKE_NAME.indexOf('飞行') < 0 && QUAKE_NAME.indexOf('三叉戟') < 0 && QUAKE_NAME.indexOf('激怒') < 0);
    ok('quake skip 普通 30', wantQuake(WEPS[0], 30) === false);
    ok('quake at 36', wantQuake(WEPS[0], 36) === true);
    ok('quake 高爆 always', wantQuake(WEPS[1], 20) === true && WEPS[1].name === '高爆' && WEPS[1].crater === 48);
    ok('quake 三裂 always', wantQuake(WEPS[3], 16) === true && WEPS[3].name === '三裂');
    ok('quake 迟雷 always', wantQuake(WEPS[7], 10) === true && WEPS[7].name === '迟雷' && WEPS[7].crater === 34);
    ok('quake not 霓火', wantQuake(WEPS[5], 20) === false && WEPS[5].name === '霓火');
    G.H = buildHeight('plain');
    G.mapId = 'plain';
    G.p2 = null;
    G.f2 = null;
    G.walls = [];
    G.mirror = null;
    const qCx = 400;
    carve(qCx, G.H[qCx], 48);
    const rim = qCx + 52;
    G.p = { x: rim, y: G.H[rim | 0] - 14, r: 14, hp: 100, grounded: true, vy: 0, fall: 0, buried: false, side: 'p', id: 'p', face: 1 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100, grounded: true, vy: 0, fall: 0, buried: false, side: 'f', id: 'f', face: -1 };
    ok('quake rim ledge', quakeLedge(G.p) === true, dirtUnderFeet(G.p) + '/' + thinLedge(G.p));
    ok('quake foe far skip', Math.abs(G.f.x - qCx) > QUAKE_NEAR);
    const xWas = G.p.x;
    const slid = quakeSlip(G.p, qCx, true);
    ok('quake slip toward hole', slid >= 8 && slid <= 14 && G.p.x < xWas && G.p.x >= xWas - 14.05, slid + ' ' + Math.round(G.p.x - xWas));
    ok('quake slip not teleport', Math.abs(G.p.x - qCx) > 20 && Math.abs(G.p.x - xWas) <= 14.05);
    crumbs.length = 0;
    G.quakeT = 0.05;
    const nCrumbs = spawnQuakeCrumbs(qCx, G.H[qCx], 48);
    ok('quake crumbs count', nCrumbs >= 4 && nCrumbs <= 7 && crumbs.length === nCrumbs, nCrumbs + '/' + crumbs.length);
    const armed = triggerQuake(qCx, G.H[qCx], WEPS[1], 48);
    ok('quake one at a time refresh', armed === true && Math.abs(G.quakeT - QUAKE_T) < 0.001 && G.quakeMag >= 3 && G.quakeMag <= 5);
    ok('direct stop still 140 after 余震', HIT_STOP_DIRECT === 0.14);
    ok('maps still 18 after 余震', MAP_IDS.length === 19 && MAP_NAME.mirror === '镜廊' && MAP_NAME.cloud === '云台' && MAP_NAME.cliff === '断崖');
    ok('叠珠 still 7 after 余震', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('迟雷 still 8 after 余震', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8);
    ok('ghost K still after 余震', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 余震', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('时尽 still after 余震', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
    ok('堂匣 still after 余震', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('雷泽 still after 余震', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune') && stormBanned('forge'));
    ok('no 9th wep after 余震', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('g vk v33', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    G.quakeT = 0;
    G.quakeMag = 0;
    crumbs.length = 0;

    G.H = buildHeight('well');
    G.mapId = 'well';
    G.kind = 'hall';
    G.storm = false;
    G.walls = [];
    G.mirror = null;
    G.slab = null;
    G.ai = 1;
    G.turns = 3;
    G.mines = [];
    G.walk = WALK_PX;
    ok('well spawn', spawnX('well', 'p') === WELL_PX && spawnX('well', 'f') === WELL_FX);
    ok('well spawn on rims', isWellBank(WELL_PX) && isWellBank(WELL_FX), Math.round(G.H[WELL_PX]) + '/' + Math.round(G.H[WELL_FX]));
    ok('well rims high', G.H[WELL_PX] < 340 && G.H[WELL_FX] < 340, Math.round(G.H[WELL_PX]));
    ok('well opening ~240', Math.abs((WELL_SHAFT1 - WELL_SHAFT0 + 1) - 241) <= 2, WELL_SHAFT1 - WELL_SHAFT0 + 1);
    ok('well deep', G.H[WELL_CX] > G.H[WELL_PX] + 120 && G.H[WELL_CX] >= WELL_WATER_Y, Math.round(G.H[WELL_CX]));
    ok('well narrower than moon', WELL_HW < MOON_BOWL_HW && WELL_DEPTH > MOON_DEPTH);
    ok('well no void', !isDeathVoid(WELL_PX) && !isDeathVoid(WELL_FX) && !isDeathVoid(WELL_CX));
    ok('well spawn dry', G.H[WELL_PX] < WELL_WATER_Y && G.H[WELL_FX] < WELL_WATER_Y);
    ok('well pool wet', G.H[WELL_CX] >= WELL_WATER_Y);
    ok('well nums', WELL_WALK === 0.40 && WELL_DMG === 4 && WELL_LIP_CRATER === 0.75 && WELL_MUD_CRATER === 1.15 && GRAV === 260 && VK === 420);
    ok('well lip flag', isWellLipX(WELL_SHAFT0 - 8) && isWellLipX(WELL_SHAFT1 + 8) && !isWellLipX(WELL_PX) && !isWellLipX(WELL_CX));
    ok('well shaft flag', isWellShaft(WELL_CX) && !isWellShaft(WELL_PX) && !isWellShaft(WELL_FX));
    const wpx = spawnX('well', 'p');
    const wpy = G.H[wpx | 0] - UNIT_R;
    const wLip = WELL_SHAFT0 - 22;
    const wey = G.H[wLip | 0] - UNIT_R;
    const wgrids = Math.round((WELL_CX - wLip) / GRID);
    const w90 = 90 - wgrids;
    const wth90 = w90 * Math.PI / 180;
    const ws90 = traceShot(wLip + Math.cos(wth90) * 18, wey - 4 - Math.sin(wth90) * 18, w90, 95, 0, WEPS[0], G.H, null);
    ok('well 90 dunk', isWellMudX(ws90.x) && !ws90.air, Math.round(ws90.x) + ' a' + w90);
    const wth30 = 30 * Math.PI / 180;
    const ws30 = traceShot(wpx + Math.cos(wth30) * 18, wpy - 4 - Math.sin(wth30) * 18, 30, 82, 0, WEPS[0], G.H, null);
    ok('well 30 skip far rim', isWellBank(ws30.x) && ws30.x > WELL_SHAFT1 && !ws30.air, Math.round(ws30.x));
    const wth65 = 65 * Math.PI / 180;
    const ws65 = traceShot(wpx + Math.cos(wth65) * 18, wpy - 4 - Math.sin(wth65) * 18, 65, 36, 0, WEPS[0], G.H, null);
    ok('well 65 clip near lip', isWellLipX(ws65.x) && ws65.x < WELL_CX && !ws65.air, Math.round(ws65.x));
    const wwet = { x: WELL_CX, y: G.H[WELL_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    const wdry = { x: WELL_PX, y: G.H[WELL_PX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f' };
    ok('well in water', inWellWater(wwet) === true && inWellWater(wdry) === false);
    ok('well walk 0.40', Math.abs(walkSpd(wwet) - 90 * WELL_WALK) < 0.01, walkSpd(wwet));
    ok('well walk dry full', Math.abs(walkSpd(wdry) - 78) < 0.01, walkSpd(wdry));
    tickWellWater(wwet);
    ok('well turn dmg 4', wwet.hp === 96, wwet.hp);
    tickWellWater(wdry);
    ok('well dry no dmg', wdry.hp === 100);
    ok('well climb blocked', wellBlocksClimb(WELL_SHAFT0 + 24, WELL_PX) === true);
    ok('well rim not climb', wellBlocksClimb(WELL_PX, WELL_PX + 20) === false);
    G.storm = true;
    ok('well water no storm extra', inWellWater(wwet) && !onGrass(wwet) && Math.abs(walkSpd(wwet) - 90 * WELL_WALK) < 0.01, walkSpd(wwet));
    G.storm = false;
    const flatW = new Float32Array(VW);
    for (let i = 0; i < VW; i++) flatW[i] = 400;
    G.H = flatW;
    G.mapId = 'plain';
    carve(500, 400, 30);
    const wellDirt = G.H[500] - 400;
    G.mapId = 'well';
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    G.H[WELL_SHAFT0 - 8] = WELL_LIP_Y;
    carve(WELL_SHAFT0 - 8, WELL_LIP_Y, wellR(30, WELL_SHAFT0 - 8));
    const lipDepth = G.H[WELL_SHAFT0 - 8] - WELL_LIP_Y;
    ok('well lip crater ~0.75', lipDepth < wellDirt * 0.90 && Math.abs(lipDepth / wellDirt - WELL_LIP_CRATER) < 0.08, Math.round(lipDepth) + '/' + Math.round(wellDirt));
    for (let i = 0; i < VW; i++) G.H[i] = 400;
    G.H[WELL_CX] = WELL_POOL_Y;
    carve(WELL_CX, WELL_POOL_Y, wellR(30, WELL_CX));
    const mudDepth = G.H[WELL_CX] - WELL_POOL_Y;
    ok('well mud crater ~1.15', mudDepth > wellDirt * 1.05 && Math.abs(mudDepth / wellDirt - WELL_MUD_CRATER) < 0.08, Math.round(mudDepth) + '/' + Math.round(wellDirt));
    G.H = buildHeight('well');
    G.mapId = 'well';
    G.kind = 'hall';
    G.wind = 0;
    G.ai = 1;
    G.p = { x: WELL_CX, y: G.H[WELL_CX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: WELL_FX, y: G.H[WELL_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    G.p2 = null; G.f2 = null;
    ok('well AI in well 高爆', inWell(G.p) && pickAIWeapon(G.f) === 1);
    const wimp = { x: WELL_CX, y: G.H[WELL_CX], t: 1, hit: null };
    const wsc90 = scoreOne(wimp, WEPS[1], G.f, G.p, 88);
    const wsc30 = scoreOne(wimp, WEPS[1], G.f, G.p, 30);
    ok('well AI prefer 90 dunk', wsc90 > wsc30 + 400, Math.round(wsc90) + '>' + Math.round(wsc30));
    G.p = { x: WELL_SHAFT0 + 18, y: G.H[WELL_SHAFT0 + 18] - 14, r: 14, hp: 40, max: 100, side: 'p', id: 'p' };
    ok('well AI exit 迟雷', inWell(G.p) && wellExitDist(G.p) <= 48 && wantChiLei(G.f, G.p) === true && pickAIWeapon(G.f) === 7);
    G.p = { x: WELL_PX, y: G.H[WELL_PX] - 14, r: 14, hp: 100, max: 100, side: 'p', id: 'p' };
    G.f = { x: WELL_FX, y: G.H[WELL_FX] - 14, r: 14, hp: 100, max: 100, side: 'f', id: 'f', ang: 115 };
    ok('well AI far rim 普通', isWellBank(G.p.x) && pickAIWeapon(G.f) === 0);
    const wimpR = { x: WELL_PX, y: G.H[WELL_PX], t: 1, hit: null };
    const wsc65 = scoreOne(wimpR, WEPS[0], G.f, G.p, 65);
    const wscLow = scoreOne(wimpR, WEPS[0], G.f, G.p, 30);
    ok('well AI prefer 65 far rim', wsc65 > wscLow + 400, Math.round(wsc65) + '>' + Math.round(wscLow));
    const heMud = Math.round(wellR(WEPS[1].crater, WELL_CX));
    ok('well dunk 余震', wantQuake(WEPS[1], heMud) === true && heMud >= QUAKE_R, heMud);
    G.kind = 'duo';
    const wdx0 = spawnAt('p', 0);
    const wdx1 = spawnAt('p', 1);
    const wdr0 = spawnAt('f', 0);
    const wdr1 = spawnAt('f', 1);
    ok('well duo extras rim', isWellBank(wdx0) && isWellBank(wdx1) && isWellBank(wdr0) && isWellBank(wdr1), wdx1 + '/' + wdr1);
    ok('well duo tops', wdx0 === WELL_PX && wdr0 === WELL_FX);
    ok('well duo extras along', Math.abs(wdx1 - wdx0) >= 20 && Math.abs(wdr1 - wdr0) >= 20, Math.round(Math.abs(wdx1 - wdx0)));
    ok('well duo not in well', !isWellShaft(wdx1) && !isWellShaft(wdr1) && !inWellWater({ x: wdx1 }) && !inWellWater({ x: wdr1 }));
    ok('well duo not void', !isDeathVoid(wdx0) && !isDeathVoid(wdx1) && !isDeathVoid(wdr0) && !isDeathVoid(wdr1));
    G.kind = 'hall';
    ok('crate not well', crateGroundOk(WELL_CX) === false && crateGroundOk(WELL_PX) === true);
    ok('well storm ~30', !stormForced('well') && !stormBanned('well') && WELL_STORM_P === 0.30 && STORM_P === 0.35);
    ok('井口 name locked', MAP_NAME.well === '井口' && MAP_IDS[18] === 'well');
    ok('no banned well', MAP_NAME.well.indexOf('传送') < 0 && MAP_NAME.well.indexOf('飞行') < 0 && MAP_NAME.well.indexOf('三叉戟') < 0 && MAP_NAME.well.indexOf('激怒') < 0);
    ok('maps 19 with 井口', MAP_IDS.length === 19 && MAP_NAME.mirror === '镜廊' && MAP_NAME.well === '井口' && MAP_NAME.cloud === '云台');
    ok('叠珠 still 7 after 井口', WEPS[6] && WEPS[6].name === '叠珠' && WEPS[6].id === 7);
    ok('迟雷 still 8 after 井口', WEPS[7] && WEPS[7].name === '迟雷' && WEPS[7].id === 8);
    ok('ghost K still after 井口', G.ghostOn !== false && OPS.indexOf('K 残影') >= 0);
    ok('silk still after 井口', typeof silkCount === 'function' && silkCount(0) === 0);
    ok('时尽 still after 井口', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
    ok('堂匣 still after 井口', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('云台 still after 井口', MAP_NAME.cloud === '云台' && MAP_IDS[16] === 'cloud');
    ok('镜廊 still after 井口', MAP_NAME.mirror === '镜廊' && MAP_IDS[17] === 'mirror');
    ok('余震 still after 井口', QUAKE_NAME === '余震' && HIT_STOP_DIRECT === 0.14);
    ok('雷泽 still after 井口', STORM_NAME === '雷泽' && stormForced('vale') && stormForced('cliff') && stormForced('dune') && stormBanned('forge'));
    ok('no 9th wep after 井口', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('g vk v34', GRAV === 260 && VK === 420 && WIND_K === 2.05);

    G.kind = 'hall';
    G.phase = 'aim';
    G.busy = null;
    G.walk = WALK_PX;
    const bagHall = freshBag();
    ok('bag start 2', bagHall.x2 === 2 && bagHall.x3 === 2 && bagHall.p1 === 2 && bagHall.p2 === 2 && bagHall.p3 === 2 && bagHall.p5 === 2 && bagHall.heal === 2);
    G.kind = 'drill';
    const bagDrill = freshBag();
    ok('bag drill 3', bagDrill.x2 === 3 && bagDrill.x3 === 3 && bagDrill.p5 === 3 && bagDrill.heal === 3);
    G.kind = 'hall';
    ok('bag names locked', BAG_NAME.x2 === '×2' && BAG_NAME.x3 === '×3' && BAG_NAME.p1 === '+1' && BAG_NAME.p2 === '+2' && BAG_NAME.p3 === '+3' && BAG_NAME.p5 === '+5' && BAG_NAME.heal === '回春');
    ok('bag keys 7', BAG_KEYS.length === 7 && BAG_KEYS[0] === 'x2' && BAG_KEYS[1] === 'x3' && BAG_KEYS[5] === 'p5' && BAG_KEYS[6] === 'heal');
    ok('bag nums', BAG_HEAL === 14 && BAG_COST.x2 === 40 && BAG_COST.x3 === 40 && BAG_COST.p1 === 20 && BAG_COST.p2 === 20 && BAG_COST.p3 === 25 && BAG_COST.p5 === 40 && BAG_COST.heal === 15 && BAG_X2_MUL === 0.90 && BAG_X3_MUL === 0.60 && BAG_MULTI_WAIT === 0.32 && BAG_MULTI_JIT === 1 && BAG_CRATE_P === 0.35);
    const plusU = { bag: { x2: 1, x3: 0, p1: 1, p2: 1, p3: 1, p5: 1, heal: 0 }, armed: { x2: false, x3: false, p1: true, p2: true, p3: true, p5: true, heal: false }, stam: 100 };
    ok('plus add', Math.abs(bagPlusMul(plusU) - 2.1) < 1e-9);
    const x2p5 = { bag: { x2: 1, x3: 0, p1: 0, p2: 0, p3: 0, p5: 1, heal: 0 }, armed: { x2: true, x3: false, p1: false, p2: false, p3: false, p5: true, heal: false }, stam: 100 };
    ok('x2++5 shell 1.35', Math.abs(bagShellMul(x2p5) - 0.9 * 1.5) < 1e-9);
    ok('x2++5 total 2.7', Math.abs(2 * bagShellMul(x2p5) - 2.7) < 1e-9);
    ok('x2 extra 1', bagExtraCount(x2p5) === 1);
    const x3u = { bag: { x2: 1, x3: 1, p1: 0, p2: 0, p3: 0, p5: 0, heal: 0 }, armed: { x2: false, x3: true, p1: false, p2: false, p3: false, p5: false, heal: false }, stam: 100 };
    ok('x3 extra 2 mul 0.6', bagExtraCount(x3u) === 2 && bagXMul(x3u) === 0.60);
    ok('x2++5 cost 80', bagFireCost(x2p5) === 80 && bagCanFire(x2p5) === true);
    const poor = { bag: { x2: 1, p5: 1 }, armed: { x2: true, p5: true }, stam: 79 };
    ok('body block', bagCanFire(poor) === false && bagFireCost(poor) === 80);
    const stacked = { bag: { x2: 2, x3: 2, p1: 1, p2: 1, p3: 1, p5: 1, heal: 2 }, armed: { x2: true, x3: false, p1: false, p2: true, p3: true, p5: false, heal: false }, hp: 80, max: 100, x: 160, y: 400, stam: 100 };
    ok('chip ×2++2++3', bagChipText(stacked) === '×2++2++3');
    const sm = consumeBagOnFire(stacked);
    ok('stack shell', Math.abs(sm.shellMul - 0.9 * 1.5) < 1e-9 && sm.extra === 1 && sm.xMul === 0.9 && Math.abs(sm.plusMul - 1.5) < 1e-9);
    ok('stack consume 1', stacked.bag.x2 === 1 && stacked.bag.p2 === 0 && stacked.bag.p3 === 0 && stacked.bag.heal === 2 && stacked.bag.p5 === 1);
    ok('stack stam 40+20+25', stacked.stam === 15);
    ok('empty cannot keep arm', stacked.armed.p2 === false && stacked.armed.x2 === true);
    const bw = bagWep(WEPS[0], sm);
    ok('bag wep dmg splash crater', Math.abs(bw.direct - 32 * 0.9 * 1.5) < 1e-9 && Math.abs(bw.splash - 36 * 0.9) < 1e-9 && Math.abs(bw.crater - 30 * 0.9) < 1e-9);
    const emptyU = { bag: zeroBag(), armed: freshArmed(), hp: 50, max: 100, x: 100, y: 400, stam: 100 };
    ok('empty no arm', armBagSilent(emptyU, 'x2') === false && emptyU.armed.x2 === false);
    const ex = { bag: { x2: 1, x3: 1, p1: 0, p2: 0, p3: 0, p5: 0, heal: 0 }, armed: freshArmed(), stam: 100 };
    ok('arm x2', armBagSilent(ex, 'x2') === true && ex.armed.x2 === true);
    ok('x2 x3 exclusive', armBagSilent(ex, 'x3') === true && ex.armed.x3 === true && ex.armed.x2 === false);
    G.phase = 'aim';
    G.busy = null;
    const hu = { bag: { x2: 0, x3: 0, p1: 0, p2: 0, p3: 0, p5: 0, heal: 2 }, armed: freshArmed(), hp: 90, max: 100, x: 152, y: 400, stam: 100 };
    ok('heal +14 cost 15', useHeal(hu) === true && hu.hp === 100 && hu.bag.heal === 1 && hu.stam === 85);
    ok('heal cap', useHeal(hu) === true && hu.hp === 100 && hu.bag.heal === 0 && hu.stam === 70);
    const broke = { bag: { x2: 0, x3: 0, p1: 0, p2: 0, p3: 0, p5: 0, heal: 1 }, armed: freshArmed(), hp: 50, max: 100, x: 152, y: 400, stam: 10 };
    ok('heal 体不够', useHeal(broke) === false && broke.bag.heal === 1 && broke.hp === 50);
    ok('crate bag instead of 术', maybeBagCrate('item', 0.34) === 'bag');
    ok('crate bag miss 术', maybeBagCrate('item', 0.35) === 'item');
    ok('crate bag instead of 怒', maybeBagCrate('rage', 0.0) === 'bag');
    ok('crate gold stays', maybeBagCrate('gold', 0) === 'gold');
    const bagC = { items: freshItems(), bag: freshBag(), rage: 10, stake: false };
    const gb = grantCrate(bagC, 'bag');
    ok('crate grant 袋', gb && gb.kind === 'bag' && BAG_NAME[gb.id] && bagC.bag[gb.id] === BAG_START + 1);
    ok('crate bag toast 堂匣 · 名', gb && gb.toast === CRATE_NAME + ' · ' + BAG_NAME[gb.id]);
    const bagGold2 = grantCrate({ items: freshItems(), bag: freshBag(), rage: 40, stake: false }, 'gold');
    ok('crate gold still 金匣', bagGold2 && bagGold2.kind === 'gold' && bagGold2.toast === '金匣');
    ok('hotkeys map 7', bagIdFromKey({ key: '-', code: 'Minus' }) === 'x2' && bagIdFromKey({ key: '=', code: 'Equal' }) === 'x3' && bagIdFromKey({ key: '[', code: 'BracketLeft' }) === 'p1' && bagIdFromKey({ key: ']', code: 'BracketRight' }) === 'p2' && bagIdFromKey({ key: '\\', code: 'Backslash' }) === 'p3' && bagIdFromKey({ key: ';', code: 'Semicolon' }) === 'p5' && bagIdFromKey({ key: "'", code: 'Quote' }) === 'heal');
    ok('hotkeys no old ,.', bagIdFromKey({ key: ',', code: 'Comma' }) == null && bagIdFromKey({ key: '.', code: 'Period' }) == null);
    ok('hotkeys no steal 1-8', bagIdFromKey({ key: '1', code: 'Digit1' }) == null && bagIdFromKey({ key: '8', code: 'Digit8' }) == null);
    ok('hotkeys no steal QECVBGFX', bagIdFromKey({ key: 'q', code: 'KeyQ' }) == null && bagIdFromKey({ key: 'e', code: 'KeyE' }) == null && bagIdFromKey({ key: 'c', code: 'KeyC' }) == null && bagIdFromKey({ key: 'v', code: 'KeyV' }) == null && bagIdFromKey({ key: 'b', code: 'KeyB' }) == null && bagIdFromKey({ key: 'g', code: 'KeyG' }) == null && bagIdFromKey({ key: 'f', code: 'KeyF' }) == null && bagIdFromKey({ key: 'x', code: 'KeyX' }) == null);
    ok('no 9th wep after 堂袋', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('叠珠 stays weapon', WEPS[6].id === 7 && BAG_KEYS.indexOf('x2') >= 0 && WEPS[6].name !== BAG_NAME.x2);
    ok('maps 19 after 堂袋', MAP_IDS.length === 19 && MAP_NAME.well === '井口' && MAP_NAME.mirror === '镜廊' && MAP_NAME.cloud === '云台');
    ok('skills stay QECVBGFX', ITEM_NAME.leap === '飞步' && ITEM_NAME.warp === '影挪' && ITEM_NAME.neon === '霓弹' && ITEM_NAME.drum === '鼓息' && ITEM_NAME.nixi === '逆息' && ITEM_NAME.veil === '障幕');
    ok('堂匣 still after 堂袋', CRATE_NAME === '堂匣' && CRATE_GOLD_NAME === '金匣');
    ok('时尽 still after 堂袋', TURN_T === 18 && TURN_T_CORE === 14 && TURN_T_SUDDEN === 11);
    ok('余震 still after 堂袋', QUAKE_NAME === '余震' && HIT_STOP_DIRECT === 0.14);
    ok('井口 still after 堂袋', MAP_NAME.well === '井口' && MAP_IDS[18] === 'well');
    ok('no banned bag words', BAG_NAME.x2.indexOf('传送') < 0 && BAG_NAME.x3.indexOf('飞行') < 0 && BAG_NAME.p1.indexOf('三叉戟') < 0 && BAG_NAME.p5.indexOf('激怒') < 0 && BAG_NAME.heal.indexOf('天使') < 0 && BAG_NAME.p3.indexOf('恶魔') < 0);
    ok('g vk v40', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    ok('bag short glyphs', BAG_SHORT.x2 === '×2' && BAG_SHORT.x3 === '×3' && BAG_SHORT.p1 === '+1' && BAG_SHORT.p2 === '+2' && BAG_SHORT.p3 === '+3' && BAG_SHORT.p5 === '+5' && BAG_SHORT.heal === '回');
    const chipU = { bag: { x2: 1, x3: 0, p1: 0, p2: 1, p3: 1, p5: 0, heal: 0 }, armed: { x2: true, x3: false, p1: false, p2: true, p3: true, p5: false, heal: false } };
    ok('chip ×2++2++3', bagChipText(chipU) === '×2++2++3');
    ok('any armed true', anyBagArmed(chipU) === true);
    const idleU = { bag: freshBag(), armed: freshArmed() };
    ok('any armed false', anyBagArmed(idleU) === false);
    ok('bag tints 7', !!BAG_TINT.x2 && !!BAG_TINT.x3 && !!BAG_TINT.p1 && !!BAG_TINT.p2 && !!BAG_TINT.p3 && !!BAG_TINT.p5 && !!BAG_TINT.heal);
    ok('bag 7 v40', BAG_KEYS.length === 7 && WEPS.length === 8);
    ok('maps 19 after v40', MAP_IDS.length === 19 && MAP_NAME.well === '井口');
    ok('no 9th wep after v40', WEPS.length === 8 && WEPS[6].name === '叠珠' && WEPS[7].name === '迟雷');
    ok('tints gold crimson cream orange scarlet foil leaf', BAG_TINT.x2 === '#ffe36b' && BAG_TINT.x3 === '#dc143c' && BAG_TINT.p1 === '#fff3c2' && BAG_TINT.p2 === '#ff9a3d' && BAG_TINT.p3 === '#ff2d2d' && BAG_TINT.p5 === '#ffd24a' && BAG_TINT.heal === '#5dffb2');
    ok('tints distinct', BAG_TINT.x2 !== BAG_TINT.x3 && BAG_TINT.p1 !== BAG_TINT.p2 && BAG_TINT.p2 !== BAG_TINT.p3 && BAG_TINT.p5 !== BAG_TINT.x3 && BAG_TINT.heal !== BAG_TINT.x2);
    ok('hexRgb gold', hexRgb('#ffe36b')[0] === 255 && hexRgb('#ffe36b')[1] === 227 && hexRgb('#ffe36b')[2] === 107);
    ok('bagRgb crimson', bagRgb('x3')[0] === 220 && bagRgb('x3')[1] === 20 && bagRgb('x3')[2] === 60);
    ok('g vk v41', GRAV === 260 && VK === 420 && WIND_K === 2.05);
    ok('stack math still v40', BAG_X2_MUL === 0.90 && BAG_X3_MUL === 0.60 && BAG_COST.x2 === 40 && BAG_COST.p5 === 40 && BAG_KEYS.length === 7);

    G.mapId = 'plain';
    G.H = buildHeight('plain');
    G.p = { x: 152, y: G.H[152] - 14, r: 14, hp: 100, max: 100, side: 'p', ang: 65 };
    G.f = { x: 768, y: G.H[768] - 14, r: 14, hp: 100, max: 100, side: 'f', ang: 115 };
    carve(450, G.H[450], 40);
    const ledgeU = { x: 400, y: G.H[400] - 14, r: 14, hp: 100, grounded: true, face: 1 };
    ok('thin ledge still', thinLedge(ledgeU) === true);

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
  if (itemDock) {
    itemDock.addEventListener('click', function (e) {
      const b = e.target.closest('[data-bag]');
      if (!b) return;
      audio.ensure();
      toggleBag(b.getAttribute('data-bag'));
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
  if (aiTierEl) {
    aiTierEl.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      audio.ensure();
      setAi(b.getAttribute('data-ai') | 0);
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
    if (G.slowMo > 0 && G.stop <= 0 && G.killHold <= 0 && !REDUCE) {
      G.slowMo -= dt;
      dt = dt * 0.28;
    }
    if (G.slowMo <= 0 && G.killPend > 0 && G.stop <= 0) {
      G.killHold = G.killPend;
      G.stop = Math.max(G.stop, G.killPend);
      G.killPend = 0;
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
