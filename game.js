'use strict';
/* ================= 魔塔50层 · 精修版 =================
 * HD 素材渲染（assets/img-hd/*：3 倍分辨率增强 + 环境精修）
 * 视觉升级：投影 / 道具浮动发光 / 伤害飘字 / 受击闪光 /
 *          楼层转场 / 画面震动 / 暗角 / 打字机对话
 * 玩法逻辑与 mota.js 引擎保持一致
 * ================================================== */
const M = window.MOTA;
const D = M.DATA;

const CV = document.getElementById('cv');
const ctx = CV.getContext('2d');
ctx.imageSmoothingEnabled = true;
if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
const TILE = 32;               // 逻辑图块尺寸（渲染在 2 倍画布上）
const SAVE_KEY = 'mota50_deluxe_save_v1';

let state = null;
let atlases = {};              // 已加载合图
let walking = null;            // 自动寻路
let heroAnim = null;           // 移动插值
let heroFrame = 0, heroFrameT = 0;
let hover = null;
let flash = null;              // 全屏闪光 {color, t0}
let busyFlags = { dlg: false, modal: false };
let floaters = [];             // 飘字 {x,y,text,color,t0}
let hitFx = null;              // 受击白闪 {x,y,t0}
let fadeFx = null;             // 楼层转场 {t0}
let shakeFx = null;            // 画面震动 {t0,mag}

/* ---------------- 素材加载 ---------------- */
const IMG_DIR = 'assets/img-hd/';
const ASSET_VER = '3.3';   // 与 index.html 资源版本保持一致，破缓存
function loadImg(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error('图片加载失败: ' + src));
    im.src = src + '?v=' + ASSET_VER;
  });
}
let ENV_BY_NAME = {};
async function loadAssets() {
  const names = ['enemys', 'terrains', 'animates', 'npcs', 'items', 'npc48', 'enemy48'];
  const imgs = await Promise.all(names.map(n => loadImg(IMG_DIR + n + '.png')));
  names.forEach((n, i) => atlases[n] = imgs[i]);
  atlases.hero = await loadImg(IMG_DIR + 'hero.png');
  atlases.dragon = await loadImg(IMG_DIR + 'dragon.png');
  atlases.env = await loadImg(IMG_DIR + 'env.png');
  if (window.MOTA_ENV) {
    ENV_BY_NAME = {};
    for (const k in window.MOTA_ENV.index) ENV_BY_NAME[k] = window.MOTA_ENV.index[k];
  }
}

/* 图块精灵：HD 图集（原布局 ×3） */
const ATLAS_META = {
  enemys: { base: 32, scale: 3 }, items: { base: 32, scale: 3 },
  npcs: { base: 32, scale: 3 }, terrains: { base: 32, scale: 3 },
  animates: { base: 32, scale: 3 }, enemy48: { base: 48, scale: 3 },
  npc48: { base: 48, scale: 3 },
};
function atlasCell(cls, id) {
  const ic = D.icons[cls] || {};
  const idx = ic[id];
  if (idx === undefined) return null;
  const meta = ATLAS_META[cls];
  if (meta) {
    const img = atlases[cls];
    const cell = meta.base * meta.scale;
    const rows = Math.floor(img.height / cell);
    const col = Math.floor(idx / rows);
    return { img, sx: col * cell, sy: (idx % rows) * cell, cell };
  }
  // dragon：96 ×2
  const img = atlases.dragon, cell = 192;
  const rows = Math.floor(img.height / cell);
  const col = Math.floor(idx / rows);
  return { img, sx: col * cell, sy: (idx % rows) * cell, cell };
}
function drawSprite(cls, id, dx, dy, dw, dh) {
  const c = atlasCell(cls, id);
  if (!c) return false;
  const size = c.cell / 3;
  ctx.drawImage(c.img, c.sx, c.sy, c.cell, c.cell, dx, dy, dw || size, dh || size);
  return true;
}
/* 精修环境贴图（按图块名覆盖） */
const ENV_NAMES = {
  yellowWall: 'yellowWall', yellowWall2: 'yellowWall2', whiteWall2: 'whiteWall2',
  blueWall2: 'blueWall2', blockWall: 'blockWall', grayWall: 'grayWall',
  unbreakableWall: 'unbreakableWall', fakeWall: 'fakeWall', fakeWall2: 'fakeWall2',
  yellowDoor: 'yellowDoor', blueDoor: 'blueDoor', redDoor: 'redDoor',
  specialDoor: 'specialDoor', steelDoor: 'steelDoor',
  upFloor: 'upFloor', downFloor: 'downFloor',
  'blueShop-left': 'blueShop-left', 'blueShop-right': 'blueShop-right',
  'pinkShop-left': 'pinkShop-left', 'pinkShop-right': 'pinkShop-right',
};
function drawEnv(name, x, y) {
  const i = ENV_BY_NAME[name];
  if (i === undefined || !atlases.env || !window.MOTA_ENV) return false;
  const { cell, cols } = window.MOTA_ENV;
  ctx.drawImage(atlases.env, (i % cols) * cell, Math.floor(i / cols) * cell, cell, cell, x * TILE, y * TILE, TILE, TILE);
  return true;
}
/* 物品发光色（RGB 字符串） */
const ITEM_GLOW = {
  yellowKey: '255,220,110', blueKey: '120,170,255', redKey: '255,120,110',
  redGem: '255,110,90', blueGem: '110,160,255',
  redPotion: '255,110,110', bluePotion: '130,190,255',
  sword1: '200,210,230', sword2: '190,220,255', sword3: '255,210,120',
  sword4: '255,230,140', sword5: '230,170,255',
  shield1: '200,210,230', shield2: '190,220,255', shield3: '255,210,120',
  shield4: '255,230,140', shield5: '160,255,220',
  book: '220,190,255', fly: '170,255,190', pickaxe: '230,190,120',
  bomb: '255,140,90', snow: '170,230,255', cross: '255,240,180',
  knife: '255,170,140', coin: '255,220,90', bigKey: '255,230,150',
  superPotion: '255,180,220', earthquake: '255,200,140',
  upFly: '190,255,210', downFly: '190,220,255', wand: '210,200,255',
  centerFly: '255,230,170',
};
function addFloater(x, y, text, color) {
  floaters.push({ x, y, text, color, t0: performance.now() });
  if (floaters.length > 12) floaters.shift();
}

/* ---------------- 画布尺寸（2x 背景缓冲，Retina 高清） ---------------- */
let canvasReady = false;
function fitCanvas() {
  const narrow = window.innerWidth <= 860;
  const availW = narrow ? Math.min(window.innerWidth - 18, 560)
                        : Math.min(window.innerWidth - 300, 640);
  const availH = narrow ? window.innerHeight - 128 : window.innerHeight - 130;
  const px = Math.max(240, Math.min(availW, availH, 624));
  CV.style.width = px + 'px';
  CV.style.height = px + 'px';
  if (CV.width !== M.W * TILE * 2) {
    CV.width = M.W * TILE * 2;
    CV.height = M.H * TILE * 2;
  }
  // 每次都应用（画布尺寸重置会清空变换状态）
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
  canvasReady = true;
}

/* ---------------- 渲染 ---------------- */
function tileAt(x, y) { return M.rawTile(state, x, y); }

function draw() {
  if (!state || !atlases.terrains || !canvasReady) return;
  // 画面震动
  ctx.save();
  if (shakeFx) {
    const t = (performance.now() - shakeFx.t0) / 260;
    if (t >= 1) shakeFx = null;
    else {
      const m = shakeFx.mag * (1 - t);
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }
  }
  ctx.clearRect(-4, -4, M.W * TILE + 8, M.H * TILE + 8);
  const f = D.floors[M.floorIndex(state.floor)];
  const now = performance.now();
  // 地面（4 种变体按坐标散布，避免平贴感）
  for (let y = 0; y < M.H; y++) for (let x = 0; x < M.W; x++) {
    drawEnv('ground' + ((x * 7 + y * 13) % 4), x, y);
  }
  // 图块
  for (let y = 0; y < M.H; y++) for (let x = 0; x < M.W; x++) {
    const tid = tileAt(x, y);
    if (!tid) continue;
    const def = M.tileDef(tid);
    if (!def) continue;
    drawTile(def, x, y, now);
  }
  // 幽灵贴图（事件型 NPC，事件完成后消失）
  for (const [gk, gid] of Object.entries(f.ghosts || {})) {
    if (fs().done[gk]) continue;
    const [gx, gy] = gk.split(',').map(Number);
    if (M.tileDef(M.rawTile(state, gx, gy))?.kind === 'npc') continue;
    drawShadow(gx, gy, 0.85);
    const cls = (D.icons.npcs[gid] !== undefined) ? 'npcs' : 'enemys';
    const c = atlasCell(cls, gid);
    if (c) ctx.drawImage(c.img, c.sx, c.sy, c.cell, c.cell, gx * TILE, gy * TILE, TILE, TILE);
  }
  // 大怪物贴图
  for (const big of (f.bigs || [])) {
    const [bx, by] = big.loc;
    if (fs().killed[bx + ',' + by] && big.id !== 'skeletonCaptain') continue;
    drawBig(big);
  }
  // 受击白闪
  if (hitFx) {
    const t = (now - hitFx.t0) / 160;
    if (t >= 1) hitFx = null;
    else {
      ctx.fillStyle = 'rgba(255,255,255,' + (0.75 * (1 - t)).toFixed(3) + ')';
      ctx.fillRect(hitFx.x * TILE, hitFx.y * TILE, TILE, TILE);
    }
  }
  drawHeroSprite();
  // 移动路径点
  if (walking && walking.path) {
    ctx.fillStyle = 'rgba(255,236,170,.4)';
    for (const [cx, cy] of walking.path) {
      ctx.beginPath();
      ctx.arc(cx * TILE + 16, cy * TILE + 16, 2.6, 0, 7);
      ctx.fill();
    }
  }
  // 飘字（伤害/金币/拾取）
  for (let i = floaters.length - 1; i >= 0; i--) {
    const fl = floaters[i];
    const t = (now - fl.t0) / 900;
    if (t >= 1) { floaters.splice(i, 1); continue; }
    const ease = 1 - Math.pow(1 - Math.min(1, t * 1.6), 3);
    ctx.font = 'bold 13px "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    const yy = fl.y * TILE + 10 - ease * 26;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(10,10,18,.85)';
    ctx.strokeText(fl.text, fl.x * TILE + 16, yy);
    ctx.fillStyle = fl.color;
    ctx.fillText(fl.text, fl.x * TILE + 16, yy);
  }
  ctx.textAlign = 'start';
  // 闪光（领域/夹击受击）
  if (flash) {
    const t = (now - flash.t0) / 300;
    if (t >= 1) flash = null;
    else {
      ctx.fillStyle = flash.color.replace('$a', (0.35 * (1 - t)).toFixed(3));
      ctx.fillRect(0, 0, M.W * TILE, M.H * TILE);
    }
  }
  ctx.restore();
  // 暗角（不随震动）
  vignette();
  // 楼层转场
  if (fadeFx) {
    const t = (performance.now() - fadeFx.t0) / 460;
    if (t >= 1) fadeFx = null;
    else {
      const a = t < 0.5 ? t * 2 : (1 - t) * 2;
      ctx.fillStyle = 'rgba(6,6,12,' + a.toFixed(3) + ')';
      ctx.fillRect(0, 0, M.W * TILE, M.H * TILE);
    }
  }
  // 悬停
  if (hover && !busy()) {
    const info = hoverInfo(hover.x, hover.y);
    if (info) {
      ctx.strokeStyle = 'rgba(240,201,78,.85)';
      ctx.lineWidth = 2;
      ctx.strokeRect(hover.x * TILE + 1.5, hover.y * TILE + 1.5, TILE - 3, TILE - 3);
    }
  }
  if (!rafPending) { rafPending = true; requestAnimationFrame(tick); }
}
let rafPending = false;
let lastFrame = 0;
function tick(t) {
  rafPending = false;
  // 仅在有动画元素（飘字/闪光/浮动道具/转场/震动/行走）时重绘
  const animating = floaters.length || flash || hitFx || fadeFx || shakeFx ||
    heroAnim || walking || (state && floorHasAnim(state));
  if (animating) draw();
}
let _animFloor = null, _animHas = false;
function floorHasAnim(state) {
  // 当前层存在道具（浮动动画）就需要持续重绘
  if (_animFloor !== state.floor) {
    _animFloor = state.floor;
    _animHas = false;
    const F = D.floors[M.floorIndex(state.floor)];
    for (let y = 0; y < M.H && !_animHas; y++) for (let x = 0; x < M.W; x++) {
      const tid = M.rawTile(state, x, y);
      const iid = D.tileItem[String(tid)];
      if (iid) { _animHas = true; break; }
    }
  }
  return _animHas;
}
let _vig = null;
function vignette() {
  if (!_vig) {
    _vig = ctx.createRadialGradient(M.W * TILE / 2, M.H * TILE / 2, M.W * TILE * 0.42, M.W * TILE / 2, M.H * TILE / 2, M.W * TILE * 0.78);
    _vig.addColorStop(0, 'rgba(0,0,0,0)');
    _vig.addColorStop(1, 'rgba(4,4,10,.42)');
  }
  ctx.fillStyle = _vig;
  ctx.fillRect(0, 0, M.W * TILE, M.H * TILE);
}
/* 椭圆软投影 */
function drawShadow(x, y, scale) {
  const s = (scale || 1);
  ctx.save();
  ctx.translate(x * TILE + TILE / 2, y * TILE + TILE - 5);
  ctx.scale(1, 0.34);
  const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 12 * s);
  g.addColorStop(0, 'rgba(0,0,0,.4)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 12 * s, 0, 7);
  ctx.fill();
  ctx.restore();
}
function fs() { return state.floors[state.floor]; }

function drawTile(def, x, y, now) {
  const px = x * TILE, py = y * TILE;
  if (def.kind === 'star') return; // 空气墙：隐形
  // 精修环境覆盖
  if (ENV_NAMES[def.id] && drawEnv(ENV_NAMES[def.id], x, y)) return;
  if (def.cls === 'animates' || def.cls === 'terrains') {
    const list = def.cls === 'animates' ? D.icons.animates : D.icons.terrains;
    if (list[def.id] !== undefined) {
      drawSprite(def.cls, def.id, px, py);
      return;
    }
  }
  if (def.cls === 'items') {
    // 道具：呼吸浮动 + 柔光
    const iid = D.tileItem[String(tileAt(x, y))];
    const glowC = ITEM_GLOW[iid] || '255,230,160';
    const bob = Math.sin(now / 420 + (x * 13 + y * 7)) * 2.2;
    const pulse = 0.5 + 0.5 * Math.sin(now / 520 + (x * 5 + y * 3));
    ctx.save();
    const g = ctx.createRadialGradient(px + 16, py + 16 + bob, 2, px + 16, py + 16 + bob, 17 + pulse * 3);
    g.addColorStop(0, 'rgba(' + glowC + ',' + (0.30 + pulse * 0.12).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(' + glowC + ',0)');
    ctx.fillStyle = g;
    ctx.fillRect(px - 6, py - 10, TILE + 12, TILE + 14);
    drawShadow(x, y, 0.8);
    drawSprite('items', def.id, px, py + bob);
    ctx.restore();
    return;
  }
  if (def.cls === 'npcs') { drawShadow(x, y, 0.95); drawSprite('npcs', def.id, px, py); return; }
  if (def.cls === 'enemy48') { drawShadow(x, y, 1.1); drawSprite('enemy48', def.id, px, py - 16); return; }
  if (def.cls === 'enemys') { drawShadow(x, y, 0.95); drawSprite('enemys', def.id, px, py); return; }
}

function drawBig(big) {
  const [bx, by] = big.loc;
  const cx = bx * TILE + 16, cy = by * TILE + 16;
  drawShadow(bx, by, 1.6);
  if (big.id === 'magicDragon' || big.id === 'octopus') {
    const frame = Math.floor(performance.now() / 260) % 4;
    ctx.drawImage(atlases.dragon, frame * 192, (big.id === 'octopus' ? 96 : 0) * 2, 192, 192, cx - 48, cy - 48, 96, 96);
  } else {
    const c = atlasCell('enemys', big.id);
    if (c) ctx.drawImage(c.img, c.sx, c.sy, c.cell, c.cell, cx - 48, cy - 48, 96, 96);
  }
}

function drawHeroSprite() {
  let px = state.x * TILE, py = state.y * TILE;
  if (heroAnim) {
    const p = Math.min(1, (performance.now() - heroAnim.t0) / 130);
    const e = 1 - Math.pow(1 - p, 3);
    px = (heroAnim.fx + (heroAnim.tx - heroAnim.fx) * e) * TILE;
    py = (heroAnim.fy + (heroAnim.ty - heroAnim.fy) * e) * TILE;
    if (p >= 1) heroAnim = null;
  }
  const row = { down: 0, left: 1, right: 2, up: 3 }[state.dir] || 0;
  let frame = 0;
  if (heroAnim || walking) {
    frame = Math.floor(performance.now() / 130) % 4;
    if (frame === 2) frame = 0;
  }
  drawShadow(state.x, state.y, 1);
  // HD hero 图集：每格 96
  ctx.drawImage(atlases.hero, frame * 96, row * 96, 96, 96, px, py, TILE, TILE);
}

/* ---------------- UI 基础 ---------------- */
const $ = id => document.getElementById(id);
function logMsg(text, cls) {
  const box = $('log');
  const line = document.createElement('div');
  line.className = 'line' + (cls ? ' ' + cls : '');
  line.textContent = text;
  box.appendChild(line);
  while (box.children.length > 6) box.removeChild(box.firstChild);
}
function openModal(html) {
  $('modalBox').innerHTML = html;
  $('modal').classList.remove('hidden');
  busyFlags.modal = true;
}
function closeModal() {
  $('modal').classList.add('hidden');
  busyFlags.modal = false;
  pump();
}
function busy() {
  // 防御性自愈：旗标卡死（对应界面实际未显示）时自动复位，
  // 避免历史崩溃遗留的标志导致键盘被静默吞掉
  if (busyFlags.dlg && $('dlg').classList.contains('hidden')) busyFlags.dlg = false;
  if (busyFlags.modal && $('modal').classList.contains('hidden')) busyFlags.modal = false;
  return busyFlags.dlg || busyFlags.modal;
}

/* ---------------- 事件队列泵 ---------------- */
let queue = [];              // 待运行的事件列表 [{acts, key}]
let runner = null;           // 当前运行器

function enqueue(entry, key) {
  if (!entry) return;
  const e = Array.isArray(entry) ? { acts: entry, key } : entry;
  if (!e.acts || !e.acts.length) return;
  queue.push({ acts: e.acts.slice(), key: e.key || key, sticky: !!e.sticky, floor: e.floor });
  pump();
}

function pump() {
  if (!state) return;
  if (busy()) return;
  // 结束当前 runner
  if (runner && runner.i >= runner.q.length) {
    if (runner.key) M.markStepDone(state, runner.key, runner.effective, runner.sticky, runner.floor);
    runner = null;
  }
  if (!runner) {
    const next = queue.shift();
    if (!next) { afterEvents(); return; }
    runner = { state, q: next.acts, i: 0, effective: false, key: next.key, sticky: next.sticky, floor: next.floor };
  }
  // 处理直到需要等待
  while (runner && runner.i < runner.q.length) {
    const n = runner.q[runner.i++];
    const r = M.applyNode(runner, n, uiHandlers);
    if (r === 'wait') { updatePanel(); draw(); return; }
  }
  updatePanel(); draw();
  pump();
}

function afterEvents() {
  updatePanel(); draw(); save();
  if (state.hp <= 0 && !state.win) { showGameOver(); }
}

const uiHandlers = {
  text(n) {
    busyFlags.dlg = true;
    const dlg = $('dlg');
    dlg.classList.remove('hidden');
    $('dlgName').textContent = n.who || '';
    drawDlgFace(n.img);
    // 打字机效果
    const full = n.text || '';
    const el = $('dlgText');
    el.textContent = '';
    $('dlgNext').style.visibility = 'hidden';
    if (window.__twTimer) clearInterval(window.__twTimer);
    let i = 0;
    window.__twTimer = setInterval(() => {
      i += 2;
      el.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(window.__twTimer);
        window.__twTimer = null;
        $('dlgNext').style.visibility = 'visible';
      }
    }, 22);
    dlg.onclick = () => {
      if (window.__twTimer) {   // 打字未完：先补全
        clearInterval(window.__twTimer);
        window.__twTimer = null;
        el.textContent = full;
        $('dlgNext').style.visibility = 'visible';
        return;
      }
      dlg.classList.add('hidden');
      busyFlags.dlg = false;
      dlg.onclick = null;
      pump();
    };
  },
  tip(t) { logMsg(t); },
  sfx(name) { sfx(name); },
  zoneHit(n) {
    flash = { color: 'rgba(200,40,40,$a)', t0: performance.now() };
    sfx('zone');
    logMsg('受到' + (M.DATA.monsters[n.mid] || {}).name + '的魔法攻击！生命 -' + n.value, 'warn');
  },
  pincer() {
    flash = { color: 'rgba(200,40,40,$a)', t0: performance.now() };
    sfx('zone');
    logMsg('被两只魔法警卫夹击！生命减半！', 'warn');
  },
  poisonTick(n) {
    logMsg('中毒发作！生命 -' + n.value, 'warn');
  },
  shop(id) { openShop(id); },
  trader(fid) { openTrader(fid); },
  oldman(fid) { openOldman(fid); },
  battle(n) { openForcedBattle(n); },
  win(te) { showVictory(te); },
  gameOver() { showGameOver(); },
};

/* ---------------- 战斗 ---------------- */
function spriteCanvasFor(mid, px) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
  const cell = atlasCell('enemys', mid);
  if (cell) g.drawImage(cell.img, cell.sx, cell.sy, cell.cell, cell.cell, 0, 0, 128, 128);
  return c;
}
/* 对话头像：优先 NPC 图集，其次怪物图集 */
function drawDlgFace(img) {
  const face = $('dlgFace');
  if (!face) return;
  const g = face.getContext('2d');
  g.clearRect(0, 0, face.width, face.height);
  if (!img) { face.style.display = 'none'; return; }
  let cell = atlasCell('npcs', img);
  if (!cell) cell = atlasCell('enemys', img);
  if (!cell) { face.style.display = 'none'; return; }
  face.style.display = '';
  g.drawImage(cell.img, cell.sx, cell.sy, cell.cell, cell.cell, 0, 0, face.width, face.height);
}

function openBattle(x, y) {
  const info = M.fightCalc(state, x, y);
  if (!info) return;
  const { mon, calc } = info;
  const hasBook = !!state.items.book;
  let html = '<h2>' + mon.name + '</h2>' +
    '<div class="battle-head" id="bh"></div>' +
    '<div class="mrow"><span class="lab">生命</span><span class="vv">' + mon.hp + '</span></div>' +
    '<div class="mrow"><span class="lab">攻击</span><span class="vv">' + mon.atk + '</span></div>' +
    '<div class="mrow"><span class="lab">防御</span><span class="vv">' + mon.def + '</span></div>' +
    '<div class="mrow"><span class="lab">金币</span><span class="vv">' + mon.money + '</span></div>';
  if (hasBook) {
    if (calc.canKill) {
      const dmgText = calc.dmg > 0 ? '-' + calc.dmg : '0';
      html += '<div class="mrow"><span class="lab">预计损失</span><span class="vv" style="color:var(--hp)">' + dmgText + '</span></div>' +
        '<div class="mrow"><span class="lab">回合</span><span class="vv">' + calc.turn + '</span></div>';
    } else {
      html += '<div class="desc" style="color:var(--hp);text-align:center">无法破防！</div>';
    }
  } else {
    html += '<div class="desc dim" style="text-align:center">（获得怪物手册后可查看战斗预判）</div>';
  }
  const can = calc.canKill && calc.dmg < state.hp;
  html += '<div class="btns">' +
    '<button onclick="closeModal()">离开</button>' +
    (can ? '<button class="primary" onclick="confirmFight(' + x + ',' + y + ')">战斗</button>' : '') +
    '</div>';
  openModal(html);
  const bh = document.getElementById('bh');
  bh.appendChild(spriteCanvasFor(info.mid));
  window._pendingBattle = { x, y, mid: info.mid };
}
window.confirmFight = function (x, y) {
  const r = M.doFight(state, x, y, false);
  window._pendingBattle = null;
  closeModal();
  if (!r.ok) {
    if (r.dead) { updatePanel(); draw(); save(); showGameOver(); return; }
    logMsg(r.msg, 'warn');
    afterEvents();
    return;
  }
  sfx('battle');
  // 打击反馈：白闪 + 飘字 + 重伤震动
  hitFx = { x, y, t0: performance.now() };
  addFloater(x, y, '-' + r.dmg, '#ff7a7a');
  addFloater(state.x, state.y, '+' + r.gold + '金币', '#ffd76a');
  if (r.dmg > 0 && r.dmg >= Math.max(200, state.hp * 0.15)) shakeFx = { t0: performance.now(), mag: 7 };
  logMsg('击败「' + r.mon.name + '」！损失生命 ' + r.dmg + '，获得金币 ' + r.gold);
  // 战后事件
  const queues = M.afterBattleQueues(state, x, y);
  for (const q of queues) enqueue(q);
  if (!queues.length) afterEvents();
  else pump();
};

/* 剧情战斗（32F 骑士队长） */
function openForcedBattle(n) {
  window._forcedBattle = n;
  const mon = D.monsters[n.id];
  const mult = M.multForId(state, n.id);
  const calc = M.battleCalc(state, mon, { atkMult: mult });
  let html = '<h2>' + mon.name + '</h2>' +
    '<div class="battle-head"></div>' +
    '<div class="mrow"><span class="lab">生命</span><span class="vv">' + mon.hp + '</span></div>' +
    '<div class="mrow"><span class="lab">攻击</span><span class="vv">' + mon.atk + '</span></div>' +
    '<div class="mrow"><span class="lab">防御</span><span class="vv">' + mon.def + '</span></div>';
  if (!calc.canKill || calc.dmg >= state.hp) {
    html += '<div class="desc" style="color:var(--hp);text-align:center">你毫无还手之力……</div>' +
      '<div class="btns"><button class="danger" onclick="forcedBattleLose()">……</button></div>';
  } else {
    html += '<div class="mrow"><span class="lab">预计损失</span><span class="vv" style="color:var(--hp)">-' + calc.dmg + '</span></div>' +
      '<div class="btns"><button class="primary" onclick="forcedBattleWin()">决斗！</button></div>';
  }
  openModal(html);
  const bh = document.querySelector('#modalBox .battle-head');
  if (bh) bh.appendChild(spriteCanvasFor(n.id));
}
window.forcedBattleWin = function () {
  const n = window._forcedBattle || { id: 'yellowKnight' };
  const mon = D.monsters[n.id];
  const calc = M.battleCalc(state, mon, { atkMult: M.multForId(state, n.id) });
  state.hp -= calc.dmg;
  state.kills++;
  if (n.loc) { fs().killed[n.loc[0] + ',' + n.loc[1]] = true; }
  window._forcedBattle = null;
  sfx('battle');
  logMsg('击败「' + mon.name + '」！损失生命 ' + calc.dmg);
  closeModal();
  pump();
};
window.forcedBattleLose = function () {
  state.hp = 0;
  closeModal();
  showGameOver();
};

/* ---------------- 商店 ---------------- */
function openShop(sid) {
  if (sid === 'keyTrader12') {
    const afford = state.money >= 1000;
    openModal(
      '<h2>🔑 黄钥匙商人</h2>' +
      '<div class="desc">「我有许多黄钥匙，1000个金币一把，你要吗？」</div>' +
      '<div class="shop-opt"><span>黄钥匙 ×1</span><span>💰 1000</span>' +
      '<button class="primary" ' + (afford ? '' : 'disabled') + ' onclick="buyKey12()">购买</button></div>' +
      '<div class="desc dim" style="font-size:12px">你的金币：' + state.money + '</div>' +
      '<div class="btns"><button onclick="closeModal()">离开</button></div>');
    return;
  }
  if (sid === 'recycler28') {
    openModal(
      '<h2>🔑 钥匙商人</h2>' +
      '<div class="desc">「你有多余的钥匙想要出售吗？」</div>' +
      '<div class="shop-opt"><span>出售黄钥匙 ×1</span><span>💰 +10</span>' +
      '<button class="primary" ' + (state.yellowKey > 0 ? '' : 'disabled') + ' onclick="sellKey28(\'yellowKey\')">出售</button></div>' +
      '<div class="shop-opt"><span>出售蓝钥匙 ×1</span><span>💰 +50</span>' +
      '<button class="primary" ' + (state.blueKey > 0 ? '' : 'disabled') + ' onclick="sellKey28(\'blueKey\')">出售</button></div>' +
      '<div class="desc dim" style="font-size:12px">你的金币：' + state.money + '，黄钥匙：' + state.yellowKey + '，蓝钥匙：' + state.blueKey + '</div>' +
      '<div class="btns"><button onclick="closeModal()">离开</button></div>');
    return;
  }
  const inf = M.shrineInfo(state, sid);
  const afford = state.money >= inf.price;
  openModal(
    '<h2>⛩️ 祭坛</h2>' +
    '<div class="desc">「如果供奉 ' + inf.price + ' 金币，便可以增加你的力量，你想要什么呢…」</div>' +
    '<div class="shop-opt"><span>生命 +' + inf.hpGain + '</span><span>💰 ' + inf.price + '</span>' +
    '<button class="primary" ' + (afford ? '' : 'disabled') + ' onclick="buyShrine(\'' + sid + '\',\'hp\')">供奉</button></div>' +
    '<div class="shop-opt"><span>攻击 +' + inf.atkGain + '</span><span>💰 ' + inf.price + '</span>' +
    '<button class="primary" ' + (afford ? '' : 'disabled') + ' onclick="buyShrine(\'' + sid + '\',\'atk\')">供奉</button></div>' +
    '<div class="shop-opt"><span>防御 +' + inf.defGain + '</span><span>💰 ' + inf.price + '</span>' +
    '<button class="primary" ' + (afford ? '' : 'disabled') + ' onclick="buyShrine(\'' + sid + '\',\'def\')">供奉</button></div>' +
    '<div class="desc dim" style="font-size:12px">已供奉 ' + inf.times + ' 次 · 下次价格 ' + (20 + 10 * (inf.times + 2) * (inf.times + 1)) + ' 金币 · 你的金币：' + state.money + '</div>' +
    '<div class="btns"><button onclick="closeModal()">离开</button></div>');
}
window.buyShrine = function (sid, kind) {
  const r = M.shrinePurchase(state, sid, kind);
  if (r.ok) { sfx('item'); logMsg('供奉成功！'); }
  openShop(sid);
};
window.buyKey12 = function () {
  if (state.money < 1000) return;
  state.money -= 1000; state.yellowKey++;
  sfx('item'); logMsg('购得 黄钥匙×1');
  openShop('keyTrader12');
};
window.sellKey28 = function (kind) {
  if (kind === 'blueKey') {
    if (state.blueKey <= 0) return;
    state.blueKey--; state.money += 50;
    sfx('item'); logMsg('出售蓝钥匙，获得 50 金币');
  } else {
    if (state.yellowKey <= 0) return;
    state.yellowKey--; state.money += 10;
    sfx('item'); logMsg('出售黄钥匙，获得 10 金币');
  }
  openShop('recycler28');
};

function openTrader(fid) {
  const td = D.traders[String(fid)];
  if (!td) { pump(); return; }
  if (state.flags['trader_' + fid]) {
    // 原版：购买后再与商人对话，他会告诉你重要的消息
    const hint = D.oldmanHints[String(fid)];
    const text = hint && hint.trader;
    uiHandlers.text({ who: '商人', img: 'trader', text: text || '很高兴和你交易，后会有齐。' });
    return;
  }
  const afford = state.money >= td.cost;
  const gives = [];
  if (td.give.yellowKey) gives.push('黄钥匙×' + td.give.yellowKey);
  if (td.give.blueKey) gives.push('蓝钥匙×' + td.give.blueKey);
  if (td.give.redKey) gives.push('红钥匙×' + td.give.redKey);
  if (td.give.hp) gives.push('生命+' + td.give.hp);
  if (td.give.item) gives.push(D.items[td.give.item].name);
  openModal(
    '<h2>💰 商人</h2>' +
    '<div class="desc">「' + td.text + '」</div>' +
    '<div class="shop-opt"><span>' + gives.join('、') + '</span><span>💰 ' + td.cost + '</span>' +
    '<button class="primary" ' + (afford ? '' : 'disabled') + ' onclick="buyTrader(' + fid + ')">购买</button></div>' +
    '<div class="desc dim" style="font-size:12px">你的金币：' + state.money + '</div>' +
    '<div class="btns"><button onclick="closeModal()">离开</button></div>');
}
window.buyTrader = function (fid) {
  const r = M.traderBuy(state, fid);
  if (r.ok) { sfx('item'); logMsg(r.msg); }
  closeModal();
};

function openOldman(fid) {
  const hint = D.oldmanHints[String(fid)];
  const text = hint ? (hint.oldman || hint.text) : null;
  if (!text) {
    uiHandlers.text({ who: '老人', img: 'oldman', text: '……（老人缓缓离去）' });
    return;
  }
  state.flags['oldman_' + fid] = true;
  if (hint.gift) {
    if (hint.gift.money) state.money += hint.gift.money;
    if (hint.gift.item) state.items[hint.gift.item] = (state.items[hint.gift.item] || 0) + 1;
  }
  uiHandlers.text({ who: '老人', img: 'oldman', text });
  if (hint.gift) {
    const g = hint.gift.money ? '获得 1000 金币' : '获得「' + D.items[hint.gift.item].name + '」';
    logMsg(g);
    sfx('item');
  }
  // 老人对话后消失
  M.setBlock(state, oldmanLoc(fid)[0], oldmanLoc(fid)[1], 0);
}
function oldmanLoc(fid) {
  // 找到本层老人位置（对话触发时勇士与其相邻）
  const f = D.floors[M.floorIndex(state.floor)];
  for (let y = 0; y < M.H; y++) for (let x = 0; x < M.W; x++) {
    const def = M.tileDef(M.rawTile(state, x, y));
    if (def && def.id === 'oldman') {
      if (Math.abs(x - state.x) + Math.abs(y - state.y) === 1) return [x, y];
    }
  }
  return [-1, -1];
}

/* ---------------- 怪物手册 ---------------- */
function openBook() {
  if (!state.items.book) { logMsg('你还没有怪物手册（3楼老人会赠送）'); return; }
  const f = D.floors[M.floorIndex(state.floor)];
  const seen = new Map();
  for (let y = 0; y < M.H; y++) for (let x = 0; x < M.W; x++) {
    const mid = M.monsterIdAt(state, x, y);
    if (mid && !fs().killed[x + ',' + y]) seen.set(mid, true);
  }
  let rows = '';
  for (const mid of seen.keys()) {
    const mon = D.monsters[mid];
    const calc = M.battleCalc(state, mon, { atkMult: M.multForId(state, mid) });
    const spText = specialText(mon);
    rows += '<div class="book-row ' + (!calc.canKill ? 'danger' : 'ok') + '">' +
      '<span class="sp"></span><span class="bn">' + mon.name + '</span>' +
      '<span class="bs">生命 ' + mon.hp + ' · 攻 ' + mon.atk + ' · 防 ' + mon.def + '</span>' +
      '<span class="bs">' + (calc.canKill ? '损失 ' + calc.dmg : '无法破防') + '</span></div>';
  }
  if (!rows) rows = '<div class="desc dim">本层视野内没有怪物。</div>';
  openModal('<h2>📜 怪物手册 —— 第 ' + (M.floorIndex(state.floor)) + ' 层</h2>' +
    '<div class="book-grid">' + rows + '</div>' +
    '<div class="btns"><button onclick="closeModal()">关闭</button></div>');
  document.querySelectorAll('#modalBox .book-row .sp').forEach((el, i) => {
    const mid = Array.from(seen.keys())[i];
    el.replaceWith(spriteCanvasFor(mid));
  });
}
function specialText(mon) {
  const sp = mon.special;
  const map = { 2: '魔攻', 15: '领域', 18: '阻击', 16: '夹击', 12: '中毒', 13: '衰弱', 14: '诅咒', 8: '反击', 6: '连击', 3: '坚固' };
  const arr = Array.isArray(sp) ? sp : (sp ? [sp] : []);
  return arr.map(s => map[s]).filter(Boolean).join('/');
}

/* ---------------- 工具箱 ---------------- */
function openToolbox() {
  const tools = ['superPotion', 'bigKey', 'pickaxe', 'bomb', 'snow', 'earthquake', 'upFly', 'downFly'];
  let rows = '';
  for (const t of tools) {
    const n = state.items[t];
    if (!n) continue;
    const it = D.items[t];
    rows += '<div class="tool-row"><span class="ti"></span>' +
      '<span class="tn">' + it.name + ' ×' + n + '<small>' + it.desc + '</small></span>' +
      '<button class="primary" onclick="useTool(\'' + t + '\')">使用</button></div>';
  }
  if (!rows) rows = '<div class="desc dim">（没有可使用的道具）</div>';
  openModal('<h2>🎒 工具箱</h2>' + rows +
    '<div class="btns"><button onclick="closeModal()">关闭</button></div>');
  document.querySelectorAll('#modalBox .tool-row .ti').forEach((el, i) => {
    const t = tools.filter(t2 => state.items[t2])[i];
    const cv2 = document.createElement('canvas');
    cv2.width = 32; cv2.height = 32;
    const g = cv2.getContext('2d');
    g.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
    const cell = atlasCell('items', t);
    if (cell) g.drawImage(cell.img, cell.sx, cell.sy, cell.cell, cell.cell, 0, 0, 32, 32);
    el.replaceWith(cv2);
  });
}
window.useTool = function (t) {
  const r = M.useItem(state, t);
  if (r.ok) {
    sfx('item');
    logMsg(r.msg);
    closeModal();
    if (r.moved) { updatePanel(); draw(); afterEvents(); return; }
    if (r.bombed) {
      // 炸弹炸死怪物后结算本层机关（如49楼封印、33楼骑士剑门）
      const queues = M.afterBattleQueues(state, -1, -1);
      for (const q of queues) enqueue(q);
    }
    updatePanel(); draw(); save();
    pump();
  } else {
    logMsg(r.msg, 'warn');
  }
};

/* ---------------- 楼传 ---------------- */
// 原版 flyNearStair=true：楼传需站在楼梯旁才能使用
function nearStair() {
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const k = (M.tileDef(M.rawTile(state, state.x + dx, state.y + dy)) || {}).kind;
    if (k === 'up' || k === 'down') return true;
  }
  return false;
}
function openFly() {
  if (!state.items.fly) { logMsg('你还没有楼传（1楼出口附近可获得）'); return; }
  if (!nearStair()) { logMsg('楼传需要在楼梯旁才能使用'); return; }
  let rows = '';
  for (let i = 0; i < D.floors.length; i++) {
    const f = D.floors[i];
    if (!state.visited[f.id] && i !== 0) continue;
    const cur = f.id === state.floor;
    rows += '<button ' + (cur ? 'disabled' : '') + ' style="margin:3px" onclick="doFly(\'' + f.id + '\')">' +
      (i === 0 ? '地下' : i + '层') + (cur ? '（当前）' : '') + '</button>';
  }
  openModal('<h2>🪄 楼传</h2><div class="desc">飞往去过的楼层</div><div style="text-align:center">' + rows + '</div>' +
    '<div class="btns"><button onclick="closeModal()">关闭</button></div>');
}
window.doFly = function (fid) {
  const land = M.landAt(fid, 'downFloor');
  M.changeFloor(state, fid, land);
  closeModal();
  sfx('stairs');
  fadeFx = { t0: performance.now() };
  _animFloor = null;
  logMsg('飞到了第 ' + M.floorIndex(fid) + ' 层');
  const first = !state.flags['_arrived_' + fid];
  state.flags['_arrived_' + fid] = true;
  updatePanel(); draw(); save();
  if (first) {
    const f = D.floors[M.floorIndex(fid)];
    if (f.first && f.first.length) enqueue(f.first);
  }
};

/* ---------------- 结局 ---------------- */
function showGameOver() {
  stopWalk();
  busyFlags.modal = true;
  openModal(
    '<h2>💀 勇者倒下了…</h2>' +
    '<div class="desc">你倒在了第 ' + M.floorIndex(state.floor) + ' 层。魔塔的黑暗仍在蔓延。<br>但是没关系，勇士可以再次出发！</div>' +
    '<div class="btns"><button class="primary" onclick="restartGame()">重新开始</button>' +
    '<button onclick="loadLastSave()">读取存档</button></div>');
}
window.loadLastSave = function () {
  const s = loadSave();
  if (s) { state = s; closeModal(); busyFlags.modal = false; updatePanel(); draw(); }
  else { location.reload(); }
};
function showVictory(te) {
  stopWalk();
  state.win = true;
  state.te = !!te;
  save();
  busyFlags.modal = true;
  openModal(
    '<h2>🏆 通关！</h2>' +
    '<div class="desc">魔塔的黑暗彻底消散，阳光第一次照进塔内。<br><br>' +
    '最终战绩：击杀 ' + state.kills + ' 只怪物，共 ' + state.steps + ' 步。<br>' +
    (state.te ? '<b style="color:var(--gold)">真结局（TE）</b>' : '普通结局（NE）') + '</div>' +
    '<div class="btns"><button class="primary" onclick="restartGame()">再来一次</button></div>');
  logMsg('🎉 通关！');
}
window.restartGame = function () {
  state = M.createState();
  localStorage.removeItem(SAVE_KEY);
  queue = []; runner = null;
  closeModal(); busyFlags.modal = false;
  updatePanel(); draw();
  logMsg('勇者，欢迎来到魔塔！');
};

/* ---------------- 面板 ---------------- */
function fmt(n) { return (n || 0).toLocaleString('zh-CN'); }
function updatePanel() {
  $('floorNo').textContent = M.floorIndex(state.floor);
  $('pFloor').textContent = M.floorIndex(state.floor);
  $('stHp').textContent = fmt(state.hp);
  $('stAtk').textContent = state.atk;
  $('stDef').textContent = state.def;
  $('stMoney').textContent = fmt(state.money);
  $('stKy').textContent = state.yellowKey;
  $('stKb').textContent = state.blueKey;
  $('stKr').textContent = state.redKey;
  $('stKills').textContent = state.kills;
  $('stSteps').textContent = state.steps;
  // 圣物
  const relics = [];
  const relicDefs = [['book', 'book'], ['cross', 'cross'], ['knife', 'knife'], ['coin', 'coin'], ['fly', 'fly'], ['wand', 'wand']];
  for (const [iid, label] of relicDefs) {
    if (state.items[iid]) relics.push('<span class="rl">' + D.items[iid].name + '</span>');
  }
  $('stRelics').innerHTML = relics.length ? relics.join('') : '<span class="dim">（暂无）</span>';
}

/* ---------------- 音效（WebAudio 合成） ---------------- */
let AC = null;
function sfx(name) {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    const t = AC.currentTime;
    const conf = {
      battle: [180, 90, 'square'], item: [660, 120, 'sine'], door: [320, 90, 'triangle'],
      stairs: [440, 140, 'sine'], zone: [110, 200, 'sawtooth'], pick: [880, 80, 'sine'],
    }[name] || [440, 80, 'sine'];
    o.type = conf[2];
    o.frequency.setValueAtTime(conf[0], t);
    o.frequency.exponentialRampToValueAtTime(Math.max(40, conf[0] * 0.6), t + conf[1] / 1000);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + conf[1] / 1000);
    o.start(t); o.stop(t + conf[1] / 1000 + 0.02);
  } catch (e) {}
}

/* ---------------- 移动与事件 ---------------- */
let lastMoveT = 0;
function moveDir(dx, dy) {
  if (!state || busy()) return;
  // 必须先打断自动寻路，再做人机限速——否则限速期间的按键
  // 不会取消行走，勇士会沿着点击的路线继续移动
  stopWalk();
  const now = performance.now();
  if (now - lastMoveT < 100) return;
  lastMoveT = now;
  const r = M.tryMove(state, dx, dy);
  heroAnim = { fx: state.x - dx, fy: state.y - dy, tx: state.x, ty: state.y, t0: performance.now() };
  switch (r.type) {
    case 'blocked':
      if (r.msg) logMsg(r.msg);
      else if (r.fakeWall2) { sfx('door'); logMsg('这面墙似乎与众不同……'); }
      heroAnim = null;
      break;
    case 'bump': {
      heroAnim = null;
      const evRaw = D.floors[M.floorIndex(state.floor)].step[r.x + ',' + r.y];
      const acts = Array.isArray(evRaw) ? evRaw : evRaw.acts;
      const sticky = !Array.isArray(evRaw) && !!evRaw.sticky;
      sfx('door');
      enqueue({ acts, key: r.x + ',' + r.y, sticky });
      break;
    }
    case 'fakeWall':
      sfx('door');
      logMsg('暗墙被撞开了！');
      afterMoveCommon(r);
      break;
    case 'door':
      sfx('door');
      if (r.key) {
        const kn = r.key === 'yellowKey' ? '黄' : r.key === 'blueKey' ? '蓝' : '红';
        logMsg('消耗1把' + kn + '钥匙');
      }
      afterMoveCommon(r);
      break;
    case 'battle':
      heroAnim = null;
      openBattle(r.x, r.y);
      break;
    case 'talk': {
      heroAnim = null;
      const t = M.talkAt(state, r.x, r.y);
      if (t) { sfx('item'); enqueue(t.acts, t.key); }
      break;
    }
    case 'stairs':
      sfx('stairs');
      fadeFx = { t0: performance.now() };
      _animFloor = null;
      logMsg('来到第 ' + M.floorIndex(state.floor) + ' 层');
      updatePanel();
      if (r.first && r.first.length) { enqueue(r.first); }
      afterMoveCommon(r);
      break;
    case 'move':
      afterMoveCommon(r);
      break;
  }
  updatePanel();
  draw();
  save();
}
function afterMoveCommon(r) {
  // 拾取提示 + 飘字
  if (r.pickups && r.pickups.length) {
    sfx('pick');
    for (const msg of r.pickups) {
      logMsg(msg);
      const color = msg.includes('生命') ? '#7ef0a0' : msg.includes('攻击') ? '#ffb066'
        : msg.includes('防御') ? '#6ab8ff' : (msg.includes('钥匙')) ? '#ffd76a' : '#f2ecdc';
      addFloater(state.x, state.y, msg.replace(/^获得 /, ''), color);
    }
  }
  // 落格事件与地形结算
  const queues = M.afterStep(state);
  for (const q of queues) enqueue(q);
}

/* 空格/回车：与相邻 NPC 对话 */
function interact() {
  if (!state) return;
  if (busyFlags.dlg) { $('dlg').click(); return; }
  if (busyFlags.modal) return;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = state.x + dx, ny = state.y + dy;
    const t = M.talkAt(state, nx, ny);
    if (t) {
      const def = M.tileDef(M.rawTile(state, nx, ny));
      if (def && def.kind === 'npc' || (def && def.kind !== 'npc' && D.floors[M.floorIndex(state.floor)].talk[nx + ',' + ny])) {
        sfx('item');
        enqueue(t.acts, t.key);
        return;
      }
    }
  }
}

/* ---------------- 点击寻路 ---------------- */
function cellFromEvent(e) {
  const r = CV.getBoundingClientRect();
  const t = r.width / M.W;
  const x = Math.floor((e.clientX - r.left) / t);
  const y = Math.floor((e.clientY - r.top) / t);
  if (x < 0 || x >= M.W || y < 0 || y >= M.H) return null;
  return { x, y };
}
function hoverInfo(x, y) {
  const tid = M.rawTile(state, x, y);
  const def = M.tileDef(tid);
  if (!def) return null;
  if (['wall', 'star', 'empty'].includes(def.kind)) return null;
  return def;
}
CV.addEventListener('click', e => {
  if (!state || busy()) return;
  const c = cellFromEvent(e);
  if (!c) return;
  stopWalk();
  const def = M.tileDef(M.rawTile(state, c.x, c.y));
  if (def && def.kind === 'enemy' && !fs().killed[c.x + ',' + c.y]) {
    // 相邻则直接战斗，否则走到怪物相邻格再触发战斗
    if (Math.abs(c.x - state.x) + Math.abs(c.y - state.y) === 1) {
      openBattle(c.x, c.y);
    } else {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const p = M.pathTo(state, c.x + dx, c.y + dy);
        if (p) { p.push([c.x, c.y]); startWalk(p, true); return; }
      }
    }
    return;
  }
  if (def && def.kind === 'npc') {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = c.x + dx, ny = c.y + dy;
      const p = M.pathTo(state, nx, ny);
      if (p) { startWalk(p, false, [c.x, c.y]); return; }
    }
    return;
  }
  // 门：走到门相邻格再撞开门
  if (def && def.kind === 'door') {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const p = M.pathTo(state, c.x + dx, c.y + dy);
      if (p) { p.push([c.x, c.y]); startWalk(p, true); return; }
    }
    return;
  }
  const p = M.pathTo(state, c.x, c.y);
  if (p) startWalk(p, true);
});
CV.addEventListener('mousemove', e => {
  hover = cellFromEvent(e);
  draw();
});
CV.addEventListener('mouseleave', () => { hover = null; draw(); });

function startWalk(path, stopOnArrive, talkTarget) {
  walking = { path: path.slice(), timer: 0, stopOnArrive, talkTarget };
  const step = () => {
    if (!walking || !state) return;
    if (!walking.path.length) {
      const tt = walking.talkTarget;
      const sa = walking.stopOnArrive;
      walking = null;
      if (tt) {
        const t = M.talkAt(state, tt[0], tt[1]);
        if (t) { sfx('item'); enqueue(t.acts, t.key); }
      } else if (sa) afterEvents();
      return;
    }
    const [nx, ny] = walking.path.shift();
    const r = M.tryMove(state, nx - state.x, ny - state.y);
    heroAnim = { fx: state.x - (nx - state.x), fy: state.y - (ny - state.y), tx: state.x, ty: state.y, t0: performance.now() };
    if (r.type === 'blocked') { walking = null; return; }
    if (r.type === 'battle') {
      walking = null;
      openBattle(r.x, r.y);
      return;
    }
    if (r.type === 'talk') {
      walking = null;
      const t = M.talkAt(state, r.x, r.y);
      if (t) { sfx('item'); enqueue(t.acts, t.key); }
      return;
    }
    if (r.type === 'stairs') {
      sfx('stairs');
      fadeFx = { t0: performance.now() };
      _animFloor = null;
      updatePanel();
      const queues = M.afterStep(state);
      walking = null;
      for (const q of queues) enqueue(q);
      draw(); save();
      return;
    }
    if (r.type === 'fakeWall') { sfx('door'); }
    if (r.type === 'door') sfx('door');
    // 落格事件（发生即停）
    const queues = M.afterStep(state);
    if (queues.length) {
      walking = null;
      for (const q of queues) enqueue(q);
      draw(); save();
      return;
    }
    updatePanel(); draw();
  };
  walking.timer = setInterval(step, 140);
}
function stopWalk() {
  if (walking && walking.timer) { clearInterval(walking.timer); walking = null; }
}

/* ---------------- 存档 ---------------- */
function save() {
  try { localStorage.setItem(SAVE_KEY, M.serialize(state)); } catch (e) {}
}
function loadSave() {
  try {
    const j = localStorage.getItem(SAVE_KEY);
    if (j) return M.deserialize(j);
  } catch (e) {}
  return null;
}

/* ---------------- 输入 ---------------- */
window.addEventListener('keydown', e => {
  const k = e.key;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) e.preventDefault();
  if (!state) return;
  // 对话框可见时：任意方向键/空格/回车都推进对话
  if (busyFlags.dlg) {
    if (!$('dlg').classList.contains('hidden')) {
      if (k === ' ' || k === 'Enter' || k.startsWith('Arrow')) { $('dlg').click(); }
      return;
    }
    busyFlags.dlg = false; // 旗标卡死自愈
  }
  if (busyFlags.modal) { if (k === 'Escape') closeModal(); return; }
  switch (k) {
    case 'ArrowUp': case 'w': case 'W': moveDir(0, -1); break;
    case 'ArrowDown': case 's': case 'S': moveDir(0, 1); break;
    case 'ArrowLeft': case 'a': case 'A': moveDir(-1, 0); break;
    case 'ArrowRight': case 'd': case 'D': moveDir(1, 0); break;
    case ' ': case 'Enter': interact(); break;
    case 'x': case 'X': openBook(); break;
    case 't': case 'T': openToolbox(); break;
    case 'f': case 'F': openFly(); break;
  }
});
/* 手机方向键：点按一步，长按连续移动 */
document.querySelectorAll('#dpad button').forEach(btn => {
  let timer = null;
  const [dx, dy] = btn.dataset.d.split(',').map(Number);
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  btn.addEventListener('pointerdown', e => {
    e.preventDefault();
    moveDir(dx, dy);
    stop();
    timer = setInterval(() => moveDir(dx, dy), 130);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener('contextmenu', e => e.preventDefault());
});

/* 画布滑动手势：向四个方向轻扫移动一步；轻点则交给 click 寻路 */
let touchStart = null;
CV.addEventListener('touchstart', e => {
  if (!state || busy()) { touchStart = null; return; }
  const t = e.changedTouches[0];
  touchStart = { x: t.clientX, y: t.clientY, t: performance.now() };
}, { passive: true });
CV.addEventListener('touchend', e => {
  const ts = touchStart;
  touchStart = null;
  if (!ts || !state || busy()) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - ts.x, dy = t.clientY - ts.y;
  if (Math.hypot(dx, dy) < 18 || performance.now() - ts.t > 700) return; // 轻点=点击寻路
  e.preventDefault();
  stopWalk();
  // 斜向滑动容易带横向漂移：纵向分量达到横向的 0.8 倍即判定为纵向
  if (Math.abs(dx) * 0.8 > Math.abs(dy)) moveDir(dx > 0 ? 1 : -1, 0);
  else moveDir(0, dy > 0 ? 1 : -1);
}, { passive: false });
CV.addEventListener('touchcancel', () => { touchStart = null; });
$('btnBook').onclick = openBook;
$('btnToolbox').onclick = openToolbox;
$('btnFly').onclick = openFly;
$('btnHelp').onclick = showHelp;
$('btnReset').onclick = () => {
  openModal('<h2>重新开始？</h2><div class="desc">将清空当前存档，从第1层重新开始。确定吗？</div>' +
    '<div class="btns"><button onclick="closeModal()">取消</button>' +
    '<button class="danger" onclick="restartGame()">重新开始</button></div>');
};
window.addEventListener('resize', () => { fitCanvas(); });

function showHelp() {
  openModal(
    '<h2>📜 操作说明</h2>' +
    '<div class="desc">' +
    '🗡 方向键 / WASD 移动，空格与相邻 NPC 对话<br>' +
    '🖱 点击地面自动寻路，点击怪物战斗<br>' +
    '📜 X 怪物手册 · 🎒 T 工具箱 · 🪄 F 楼传<br><br>' +
    '<b style="color:var(--gold)">原版提示</b>\n' +
    '· 每 10 层为一个区域，击败区域头目才能继续上楼\n' +
    '· 宝石与血瓶的数值随区域倍增（2区×2 … 5区×5）\n' +
    '· 有些墙是暗墙，走上前撞一撞试试\n' +
    '· 有些门没有钥匙孔，击败守卫后自动打开\n' +
    '· 巫师会用领域魔法攻击路过的人\n' +
    '· 站到两只魔法警卫中间会被夹击（生命减半）\n' +
    '· 3楼老人赠送怪物手册（X 键查看战斗预判）\n' +
    '· 游戏自动存档\n</div>' +
    '<div class="btns"><button onclick="closeModal()">知道了</button></div>');
}

/* ---------------- 启动 ---------------- */
function drawHeroPanel() {
  const cv2 = $('heroCv');
  const g = cv2.getContext('2d');
  g.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
  g.clearRect(0, 0, 64, 96);
  if (atlases.hero) g.drawImage(atlases.hero, 0, 0, 96, 96, 0, 16, 64, 64);
}
function drawKeyIcons() {
  const map = [['kIconY', 'yellowKey'], ['kIconB', 'blueKey'], ['kIconR', 'redKey']];
  for (const [id, iid] of map) {
    const cv2 = $(id);
    const g = cv2.getContext('2d');
    g.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
    const cell = atlasCell('items', iid);
    if (cell) g.drawImage(cell.img, cell.sx, cell.sy, cell.cell, cell.cell, 0, 0, 32, 32);
  }
}

async function boot() {
  try {
    fitCanvas();
    await loadAssets();
    drawHeroPanel();
    drawKeyIcons();
    const saved = loadSave();
    if (saved) {
      state = saved;
      logMsg('读取存档：第 ' + M.floorIndex(state.floor) + ' 层');
      if (state.win) logMsg('（该存档已通关，可重新开始挑战）');
    } else {
      state = M.createState();
      state.visited[state.floor] = true;
      logMsg('勇者，欢迎来到魔塔50层！');
      setTimeout(() => {
        openModal(
          '<h2>🏰 魔塔50层 · 精修版</h2>' +
          '<div class="desc">传说塔顶住着魔王，他囚禁了整个王国的人民。\n' +
          '年轻的勇士啊，拿起剑，踏上50层的征途吧！\n\n' +
          '<span class="dim">方向键/WASD移动 · 点击寻路 · 空格对话 · X手册 · T工具 · F楼传</span></div>' +
          '<div class="btns"><button class="primary" onclick="closeModal()">出发！</button>' +
          '<button onclick="closeModal(); showHelp()">操作说明</button></div>');
      }, 200);
    }
    document.querySelector('.ver').textContent = '精修版 v3.0';
    updatePanel();
    draw();
  } catch (e) {
    document.body.insertAdjacentHTML('beforeend',
      '<div style="position:fixed;inset:auto 12px 12px 12px;z-index:99;background:#3a1420;color:#ffb8c0;' +
      'border:1px solid #a04050;border-radius:10px;padding:10px 14px;font-size:13px">启动失败：' +
      (e && e.message ? e.message : e) + '</div>');
  }
}
boot();
