/* ============================================================
 * 魔塔50层 —— 游戏引擎（纯逻辑，浏览器与 Node 通用）
 * 数据来源：《魔塔50层》Flash 原版（h5mota 官方复刻数据），见 mota-data.js
 * 战斗公式与特殊属性均按原版实现（对照 h5mota 51_maze functions.js）：
 *   伤害 = 战前伤害 + (回合数-1)×每回合伤害 + 回合数×反击伤害（勇士先攻）
 *   魔攻(无视防御)、连击、坚固、反击、先攻、破甲、吸血、
 *   领域(巫师，神圣盾免疫)、阻击、夹击(同种魔法警卫×2，神圣盾免疫)、
 *   中毒(每步-10)/衰弱(攻防-20)/诅咒(战斗无金币)
 *   十字架克兽人/兽人武士/吸血鬼，屠龙匕克魔龙
 * ============================================================ */
(function (global) {
  'use strict';

  const D = global.MOTA_DATA;
  if (!D) throw new Error('mota-data.js 未加载');
  const VERSION = '2.1.0';

  const W = 13, H = 13;

  /* ---------------- 基础查询 ---------------- */
  const FLOOR_IDX = {};
  D.floors.forEach((f, i) => { FLOOR_IDX[f.id] = i; });
  function floorIndex(fid) { return FLOOR_IDX[fid] !== undefined ? FLOOR_IDX[fid] : -1; }
  function floorById(fid) {
    const i = FLOOR_IDX[fid];
    return i === undefined ? null : D.floors[i];
  }
  function resolveFloorRef(ref, curFid) {
    if (ref === ':next' || ref === ':before') {
      const idx = FLOOR_IDX[curFid];
      return D.floors[ref === ':next' ? idx + 1 : idx - 1] || null;
    }
    return floorById(ref);
  }
  function tileDef(tid) { return D.tiles[String(tid)] || null; }

  /* ---------------- 状态 ---------------- */
  function createState() {
    const floors = {};
    for (const F of D.floors) {
      floors[F.id] = { killed: {}, picked: {}, opened: {}, done: {}, blocks: {}, override: null };
    }
    return {
      version: VERSION,
      floor: D.meta.startFloor,
      x: D.meta.startLoc[0], y: D.meta.startLoc[1], dir: 'down',
      hp: D.meta.hero.hp, atk: D.meta.hero.atk, def: D.meta.hero.def,
      money: D.meta.hero.money,
      yellowKey: 0, blueKey: 0, redKey: 0,
      items: {},        // 工具/圣物计数
      flags: {},        // 剧情与机关旗标
      introDone: false, // 3F 剧情后属性重置
      floors: floors,
      steps: 0, kills: 0,
      win: false, te: false,
      visited: {},      // 到访过的楼层（楼传用）
      log: [],
    };
  }

  function cloneState(s) { return JSON.parse(JSON.stringify(s)); }

  function fs(state) { return state.floors[state.floor]; }
  function F(state) { return floorById(state.floor); }

  function rawTile(state, x, y) {
    const f = fs(state);
    const k = x + ',' + y;
    if (k in f.blocks) return f.blocks[k];
    return F(state).map[y][x];
  }

  function monsterAt(state, x, y) {
    const tid = rawTile(state, x, y);
    const def = tileDef(tid);
    if (!def || def.kind !== 'enemy') return null;
    const m = D.monsters[def.id];
    if (!m) return null;
    const ov = fs(state).override;
    if (ov && ov.id === def.id) return Object.assign({}, m, ov.value);
    return m;
  }

  function itemAt(state, x, y) {
    const tid = rawTile(state, x, y);
    const iid = D.tileItem[String(tid)];
    return iid ? D.items[iid] : null;
  }

  /* ---------------- 战斗计算（原版公式） ---------------- */
  function hasSpecial(mon, code) {
    const sp = mon.special;
    if (Array.isArray(sp)) return sp.indexOf(code) >= 0;
    return sp === code;
  }

  // mult: 十字架/屠龙匕首等攻击倍率
  // 原版公式（h5mota getDamageInfo）：dmg = init + (turn-1)×per + turn×counter
  // 勇士先攻，最后一回合怪物死亡不再出手；坚固以基础攻击（不含十字架倍率）判定
  function battleCalc(hero, mon, opts) {
    opts = opts || {};
    const baseAtk = hero.atk;
    let hatk = baseAtk * (opts.atkMult || 1);
    let mdef = mon.def;
    // 坚固：防御不小于角色攻击-1（按基础攻击）
    if (hasSpecial(mon, 3)) mdef = Math.max(mdef, baseAtk - 1);
    let hper = Math.max(0, hatk - mdef);
    if (hper <= 0) return { canKill: false };
    const turn = Math.ceil(mon.hp / hper);

    let per = mon.atk - hero.def;
    if (hasSpecial(mon, 2)) per = mon.atk; // 魔攻：无视防御
    if (per < 0) per = 0;
    if (hasSpecial(mon, 4)) per *= 2;
    if (hasSpecial(mon, 5)) per *= 3;
    if (hasSpecial(mon, 6)) per *= (mon.n || 4);

    let init = 0;
    if (hasSpecial(mon, 1)) init += per;                              // 先攻
    if (hasSpecial(mon, 7)) init += Math.floor(0.9 * hero.def);       // 破甲
    if (hasSpecial(mon, 11)) init += Math.floor(hero.hp * (mon.value || 0)); // 吸血

    let counter = 0;
    if (hasSpecial(mon, 8)) counter = Math.floor(0.1 * hatk);         // 反击（每回合）

    const dmg = init + (turn - 1) * per + turn * counter;
    return { canKill: true, turn: turn, per: per, dmg: dmg, loss: dmg };
  }

  // 依据怪物 id 判断攻击倍率（十字架/屠龙匕首，原版 functions.js）
  function multForId(state, mid) {
    if (state.items.cross && (mid === 'zombie' || mid === 'zombieKnight' || mid === 'vampire')) return 2;
    if (state.items.knife && mid === 'magicDragon') return 2;
    return 1;
  }

  let _fightMid = null;
  function monsterIdAt(state, x, y) {
    const tid = rawTile(state, x, y);
    const def = tileDef(tid);
    return def && def.kind === 'enemy' ? def.id : null;
  }

  function fightCalc(state, x, y) {
    const mid = monsterIdAt(state, x, y);
    if (!mid) return null;
    const m = monsterAt(state, x, y);
    return { mid: mid, mon: m, calc: battleCalc(state, m, { atkMult: multForId(state, mid) }) };
  }

  /* ---------------- 战斗执行 ---------------- */
  function doFight(state, x, y, forced) {
    const info = fightCalc(state, x, y);
    if (!info) return { ok: false, msg: '这里没有怪物' };
    const { mid, mon, calc } = info;
    const fk = x + ',' + y;
    if (!forced && fs(state).killed[fk]) return { ok: false, msg: '怪物已被击败' };
    if (!calc.canKill) return { ok: false, msg: '无法破防，不能战胜「' + mon.name + '」！' };
    if (calc.dmg >= state.hp && !(forced && state.hp > 0)) {
      return { ok: false, dead: true, msg: '你会被击败！先提升实力再来挑战吧。' };
    }
    state.hp -= calc.dmg;
    if (state.hp <= 0) { state.hp = 0; return { ok: false, dead: true, msg: '你倒下了……' }; }
    fs(state).killed[fk] = true;
    setBlock(state, x, y, 0); // 怪物消失
    state.kills++;
    let gold = mon.money * (state.items.coin ? 2 : 1);
    if (state.flags.curse) gold = 0; // 诅咒：战斗无法获得金币
    state.money += gold;
    const res = { ok: true, dmg: calc.dmg, gold: gold, mid: mid, mon: mon };
    // 中毒/衰弱/诅咒（衰弱：攻防永久下降20点，原版 weakValue=20）
    if (hasSpecial(mon, 12)) { state.flags.poison = true; res.debuff = '中毒'; }
    if (hasSpecial(mon, 13)) {
      if (!state.flags.weak) { state.atk = Math.max(0, state.atk - 20); state.def = Math.max(0, state.def - 20); }
      state.flags.weak = true; res.debuff = '衰弱';
    }
    if (hasSpecial(mon, 14)) { state.flags.curse = true; res.debuff = '诅咒'; }
    return res;
  }

  /* ---------------- 道具拾取 ---------------- */
  function ratioOf(state) { return F(state).ratio || 1; }

  function pickup(state, x, y) {
    const tid = rawTile(state, x, y);
    const iid = D.tileItem[String(tid)];
    if (!iid) return [];
    const it = D.items[iid];
    const msgs = [];
    const r = ratioOf(state);
    if (it.cls === 'key') {
      if (iid === 'yellowKey') state.yellowKey++;
      else if (iid === 'blueKey') state.blueKey++;
      else state.redKey++;
      msgs.push('获得 ' + it.name);
    } else if (it.cls === 'gem') {
      if (it.atk) { state.atk += it.atk * r; msgs.push('攻击 +' + (it.atk * r)); }
      if (it.def) { state.def += it.def * r; msgs.push('防御 +' + (it.def * r)); }
    } else if (it.cls === 'potion') {
      state.hp += it.hp * r; msgs.push('生命 +' + (it.hp * r));
    } else if (it.cls === 'equip') {
      if (it.atk) state.atk += it.atk;
      if (it.def) state.def += it.def;
      state.flags['equip_' + iid] = true;
      if (it.magicImmune) state.flags.magicImmune = true;
      msgs.push('获得「' + it.name + '」：' + it.desc);
    } else {
      state.items[iid] = (state.items[iid] || 0) + 1;
      msgs.push('获得「' + it.name + '」：' + it.desc);
    }
    fs(state).picked[x + ',' + y] = true;
    setBlock(state, x, y, 0); // 道具消失（否则贴图留在原地且可重复拾取）
    return msgs;
  }

  /* ---------------- 钥匙与门 ---------------- */
  function keyOfDoor(tid) {
    const def = tileDef(tid);
    if (!def || def.kind !== 'door') return null;
    if (def.key === 'yellowKey') return 'yellowKey';
    if (def.key === 'blueKey') return 'blueKey';
    if (def.key === 'redKey') return 'redKey';
    return null; // 机关门/铁门：无钥匙可开
  }

  function setBlock(state, x, y, tid) {
    const f = fs(state);
    const k = x + ',' + y;
    if (tid === 0 || tid === null) { if (k in f.blocks) delete f.blocks[k]; f.blocks[k] = 0; }
    else f.blocks[k] = tid;
  }

  /* ---------------- 条件 ---------------- */
  function evalCond(state, c) {
    if (!c) return true;
    switch (c.k) {
      case 'true': return true;
      case 'flag': {
        const v = state.flags[c.name];
        if (c.op === '>=') return (v || 0) >= c.v;
        if (c.op === '==') return v == c.v; // eslint-disable-line eqeqeq
        return !!v === !!c.v;
      }
      case 'and': return c.of.every(x => evalCond(state, x));
      case 'or': return c.of.some(x => evalCond(state, x));
      case 'not': return !evalCond(state, c.of);
      case 'dead': return c.locs.every(l => !!fs(state).killed[l[0] + ',' + l[1]]);
      case 'alive': return c.locs.every(l => {
        const mid = monsterIdAt(state, l[0], l[1]);
        return !!mid && !fs(state).killed[l[0] + ',' + l[1]];
      });
      case 'visited': return !!state.visited[c.floor];
      default: return true;
    }
  }

  /* ---------------- 事件运行器 ----------------
   * 引擎把事件翻译成"运行队列"，由前端逐节点播放：
   *  - 展示型节点(text/tip/sfx/sleep/battle/shop...)由 UI 呈现后调用 next()
   *  - 变更型节点立即生效并自动继续
   * ------------------------------------------------ */
  function makeRunner(state, acts, onDone) {
    return { state, q: acts.slice(), i: 0, effective: false, onDone };
  }

  function stepRunner(runner, ui) {
    while (runner.i < runner.q.length) {
      const n = runner.q[runner.i++];
      const r = applyNode(runner, n, ui);
      if (r === 'wait') return false; // UI 异步展示中
    }
    if (runner.onDone) runner.onDone(runner.effective);
    return true;
  }

  function applyNode(runner, n, ui) {
    const state = runner.state;
    switch (n.t) {
      case 'text': runner.effective = true; ui.text(n); return 'wait';
      case 'tip': runner.effective = true; ui.tip(n.text); return 0;
      case 'sfx': ui.sfx(n.name); return 0;
      case 'sleep': return 0;
      case 'open': {
        for (const l of n.loc) setBlock(state, l[0], l[1], 0);
        fs(state).opened[n.loc.map(l => l.join(',')).join(';')] = true;
        runner.effective = true; return 0;
      }
      case 'close': {
        for (const l of [].concat(n.loc)) setBlock(state, l[0], l[1], n.n || 85);
        runner.effective = true; return 0;
      }
      case 'set': {
        for (const l of n.loc) {
          setBlock(state, l[0], l[1], n.n);
          if (n.n === 0) fs(state).killed[l[0] + ',' + l[1]] = true;
        }
        runner.effective = true; return 0;
      }
      case 'hide': {
        for (const l of n.loc) setBlock(state, l[0], l[1], 0);
        runner.effective = true; return 0;
      }
      case 'show': { for (const l of n.loc) delete fs(state).blocks[l[0] + ',' + l[1]]; runner.effective = true; return 0; }
      case 'setFloor': {
        const f2 = floorById(n.floor);
        for (const l of n.loc) {
          if (n.n === 0) delete state.floors[n.floor].blocks[l[0] + ',' + l[1]];
          else state.floors[n.floor].blocks[l[0] + ',' + l[1]] = n.n;
        }
        runner.effective = true; return 0;
      }
      case 'showFloor': {
        for (const l of n.loc) delete state.floors[n.floor].blocks[l[0] + ',' + l[1]];
        runner.effective = true; return 0;
      }
      case 'flag': state.flags[n.name] = n.v; runner.effective = true; return 0;
      case 'flagAdd': state.flags[n.name] = (state.flags[n.name] || 0) + (n.v || 1); runner.effective = true; return 0;
      case 'giveItem': {
        state.items[n.item] = (state.items[n.item] || 0) + 1;
        runner.effective = true;
        ui.tip('获得「' + D.items[n.item].name + '」'); return 0;
      }
      case 'bless': {
        const a = Math.round(state.atk * n.pct / 100), d = Math.round(state.def * n.pct / 100);
        state.atk += a; state.def += d;
        runner.effective = true;
        ui.tip('受到祝福：攻击 +' + a + '，防御 +' + d); return 0;
      }
      case 'monsterOverride': {
        state.floors[n.floor].override = { id: n.id, value: n.value };
        runner.effective = true; return 0;
      }
      case 'setHero': {
        if (n.hp !== undefined) state.hp = n.hp;
        if (n.atk !== undefined) state.atk = n.atk;
        if (n.def !== undefined) state.def = n.def;
        if (n.intro) state.introDone = true;
        runner.effective = true; return 0;
      }
      case 'goto': changeFloor(state, n.floor, n.loc); runner.effective = true; return 0;
      case 'exitNext': {
        const idx = floorIndex(state.floor);
        changeFloor(state, D.floors[idx + 1].id, null);
        runner.effective = true; return 0;
      }
      case 'shop': runner.effective = true; ui.shop(n.id); return 'wait';
      case 'trader': runner.effective = true; ui.trader(n.fid); return 'wait';
      case 'oldman': runner.effective = true; ui.oldman(n.fid); return 'wait';
      case 'battle': runner.effective = true; ui.battle(n); return 'wait';
      case 'cutscene': {
        const cs = D.cutscenes[n.id];
        if (cs) runner.q.splice(runner.i, 0, ...cs.map(c => c));
        return 0;
      }
      case 'if': {
        const branch = evalCond(state, n.cond) ? n.act : (n.else || []);
        runner.q.splice(runner.i, 0, ...branch);
        return 0;
      }
      case 'win': runner.effective = true; ui.win(!!state.flags['剧情_TE']); return 'wait';
      case 'gameover': runner.effective = true; ui.gameOver(); return 'wait';
      case 'zoneHit': runner.effective = true; ui.zoneHit(n); return 0;
      case 'pincer': runner.effective = true; ui.pincer(); return 0;
      case 'poisonTick': runner.effective = true; ui.poisonTick(n); return 0;
      case 'deadcheck': if (state.hp <= 0) { state.hp = 0; runner.effective = true; ui.gameOver(); return 'wait'; } return 0;
      default: return 0;
    }
  }

  /* ---------------- 楼层切换 ---------------- */
  function landAt(fid, stairName) {
    const f = floorById(fid);
    if (!f) return null;
    if (stairName === 'upFloor') {
      if (f.up) return f.up.loc.slice();
      return [6, 11];
    }
    if (f.down) return f.down.loc.slice();
    if (f.up) return f.up.loc.slice();
    return [6, 6];
  }

  function changeFloor(state, to, loc) {
    const target = typeof to === 'number' ? D.floors[to].id : to;
    state.floor = target;
    state.visited[target] = true;
    if (loc) { state.x = loc[0]; state.y = loc[1]; }
    else {
      const p = landAt(target, 'downFloor');
      state.x = p[0]; state.y = p[1];
    }
    const f = F(state);
    const firstArrive = !state.flags['_arrived_' + target];
    state.flags['_arrived_' + target] = true;
    return firstArrive ? (f.first || []) : [];
  }

  /* ---------------- 移动 ---------------- */
  // 返回 {type:...}，UI 据此呈现
  function tryMove(state, dx, dy) {
    if (dx < 0) state.dir = 'left'; else if (dx > 0) state.dir = 'right';
    else if (dy < 0) state.dir = 'up'; else if (dy > 0) state.dir = 'down';
    const nx = state.x + dx, ny = state.y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) return { type: 'blocked' };
    const tid = rawTile(state, nx, ny);
    const def = tileDef(tid) || {};
    const kind = def.kind || 'empty';

    if (kind === 'wall' || kind === 'star' || kind === 'lava' || kind === 'deco') {
      const evk = nx + ',' + ny;
      const ev = F(state).step[evk];
      if (kind !== 'star' && kind !== 'lava' && ev && !fs(state).done[evk]) {
        return { type: 'bump', x: nx, y: ny };
      }
      return { type: 'blocked', star: kind === 'star' };
    }
    if (kind === 'fakeWall2') {
      const evk = nx + ',' + ny;
      const ev = F(state).step[evk];
      if (ev && !fs(state).done[evk]) return { type: 'bump', x: nx, y: ny };
      return { type: 'blocked', fakeWall2: true };
    }

    if (kind === 'fakeWall') {
      setBlock(state, nx, ny, 0);
      state.x = nx; state.y = ny; state.steps++;
      return { type: 'fakeWall', x: nx, y: ny };
    }
    if (kind === 'door') {
      const key = keyOfDoor(tid);
      if (key) {
        if (state[key] <= 0) {
          const kn = key === 'yellowKey' ? '黄' : key === 'blueKey' ? '蓝' : '红';
          return { type: 'blocked', msg: '需要' + kn + '钥匙才能打开这扇门！' };
        }
        state[key]--;
      } else {
        return { type: 'blocked', msg: '这扇门无法用钥匙打开。' };
      }
      setBlock(state, nx, ny, 0);
      state.x = nx; state.y = ny; state.steps++;
      const after = afterOpenDoor(state, nx, ny);
      return { type: 'door', x: nx, y: ny, key: key, after: after };
    }
    if (kind === 'enemy') {
      return { type: 'battle', x: nx, y: ny, info: fightCalc(state, nx, ny) };
    }
    if (kind === 'npc') {
      return { type: 'talk', x: nx, y: ny };
    }
    if (kind === 'up' || kind === 'down') {
      const st = kind === 'up' ? F(state).up : F(state).down;
      if (st && st.to) {
        const target = resolveFloorRef(st.to, state.floor);
        if (target) {
          const land = landAt(target.id, st.stair || (kind === 'up' ? 'downFloor' : 'upFloor'));
          const firstActs = changeFloor(state, target.id, land);
          state.steps++;
          return { type: 'stairs', to: target.id, first: firstActs };
        }
      }
      return { type: 'blocked' };
    }
    // 空地 / 道具
    state.x = nx; state.y = ny; state.steps++;
    const ev = { type: 'move', x: nx, y: ny };
    if (kind === 'item') ev.pickups = pickup(state, nx, ny);
    return ev;
  }

  function afterOpenDoor(state, x, y) {
    const trap = F(state).doorTrap;
    if (trap && trap.loc[0] === x && trap.loc[1] === y && !state.flags['_trap_' + x + '_' + y]) {
      state.flags['_trap_' + x + '_' + y] = true;
      return trap.act;
    }
    return null;
  }

  /* ---------------- 移动后的地形/事件结算 ---------------- */
  // 返回需要 UI 处理的队列数组（可能为空）
  function afterStep(state) {
    const queues = [];
    const f = F(state);

    // 中毒：每走一步损失 10 点生命（原版 poisonDamage=10），可能致死
    if (state.flags.poison && state.hp > 0) {
      state.hp -= 10;
      queues.push({ acts: [{ t: 'poisonTick', value: 10 }] });
    }
    // 领域/阻击
    if (!state.flags.magicImmune) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (Math.abs(x - state.x) + Math.abs(y - state.y) !== 1) continue;
        const mid = monsterIdAt(state, x, y);
        if (!mid || fs(state).killed[x + ',' + y]) continue;
        const mon = D.monsters[mid];
        if (mon && (mon.special === 15 || mon.special === 18)) {
          state.hp -= (mon.value || 0);
          queues.push({ acts: [{ t: 'zoneHit', value: mon.value, mid, x, y, push: mon.special === 18 }] });
        }
      }
    }
    // 夹击：两侧（或上下）为两只相同的夹击怪；神圣盾可免疫；生命>1 才会触发
    if (!state.flags.magicImmune && state.hp > 1) {
      const lk = monsterIdAt(state, state.x - 1, state.y), rk = monsterIdAt(state, state.x + 1, state.y);
      const uk = monsterIdAt(state, state.x, state.y - 1), dk = monsterIdAt(state, state.x, state.y + 1);
      const alive = (mid, x, y2) => mid && !fs(state).killed[x + ',' + y2];
      const pincerPair = (a, ax, ay, b, bx, by) => a === b && alive(a, ax, ay) && alive(b, bx, by);
      if (pincerPair(lk, state.x - 1, state.y, rk, state.x + 1, state.y) ||
          pincerPair(uk, state.x, state.y - 1, dk, state.x, state.y + 1)) {
        state.hp = Math.floor(state.hp / 2);
        queues.push({ acts: [{ t: 'pincer' }] });
      }
    }
    if (state.hp <= 0) { state.hp = 0; queues.push({ acts: [{ t: 'deadcheck' }] }); }

    // 落格事件
    const key = state.x + ',' + state.y;
    const evRaw = f.step[key];
    const evActs = evRaw ? (Array.isArray(evRaw) ? evRaw : evRaw.acts) : null;
    const evSticky = evRaw ? !Array.isArray(evRaw) && !!evRaw.sticky : false;
    if (evActs && !fs(state).done[key]) {
      queues.push({ acts: evActs, key, sticky: evSticky, floor: state.floor });
    }
    // 自动事件
    for (const au of (f.auto || [])) {
      if (au.once && state.flags[au.once]) continue;
      if (evalCond(state, au.cond)) {
        if (au.once) state.flags[au.once] = true;
        queues.push({ acts: au.act });
      }
    }
    return queues;
  }

  function markStepDone(state, key, effective, sticky, floor) {
    if (sticky) return;
    if (!effective) return;
    const f = floor ? state.floors[floor] : fs(state);
    f.done[key] = true;
  }

  /* ---------------- 战斗后事件结算 ---------------- */
  function afterBattleQueues(state, x, y) {
    const queues = [];
    const f = F(state);
    const key = x + ',' + y;
    const acts = f.after[key];
    if (acts) queues.push({ acts });
    for (const au of (f.auto || [])) {
      if (au.once && state.flags[au.once]) continue;
      if (evalCond(state, au.cond)) {
        if (au.once) state.flags[au.once] = true;
        queues.push({ acts: au.act });
      }
    }
    return queues;
  }

  /* ---------------- 对话触发 ---------------- */
  function talkAt(state, x, y) {
    const f = F(state);
    const key = x + ',' + y;
    if (f.talk[key]) return { kind: 'acts', acts: f.talk[key], key };
    const evRaw = f.step[key];
    const acts = evRaw ? (Array.isArray(evRaw) ? evRaw : evRaw.acts) : null;
    if (acts && !fs(state).done[key]) return { kind: 'acts', acts, key };
    return null;
  }

  /* ---------------- 商店 ---------------- */
  function shrineInfo(state, sid) {
    const sh = D.shrines[sid];
    const t = state.flags.shrineTimes || 0;
    const price = 20 + 10 * (t + 1) * t;
    return {
      ratio: sh.ratio,
      price,
      hpGain: 100 * (t + 1),
      atkGain: 2 * sh.ratio,
      defGain: 4 * sh.ratio,
      times: t,
    };
  }
  // 由 UI 直接调用，kind: hp/atk/def
  function shrinePurchase(state, sid, kind) {
    const sh = D.shrines[sid];
    const t = state.flags.shrineTimes || 0;
    const price = 20 + 10 * (t + 1) * t;
    if (state.money < price) return { ok: false, msg: '你的金币不足' + price + '枚，无法供奉！' };
    state.money -= price;
    if (kind === 'hp') state.hp += 100 * (t + 1);
    if (kind === 'atk') state.atk += 2 * sh.ratio;
    if (kind === 'def') state.def += 4 * sh.ratio;
    state.flags.shrineTimes = t + 1;
    return { ok: true, price };
  }

  function traderBuy(state, fid) {
    const td = D.traders[String(fid)];
    if (!td) return { ok: false, msg: '……' };
    if (state.flags['trader_' + fid]) return { ok: false, msg: '商人已经离开。' };
    if (state.money < td.cost) return { ok: false, msg: '你的金币不足' + td.cost + '枚！' };
    state.money -= td.cost;
    state.flags['trader_' + fid] = true;
    const parts = [];
    if (td.give.yellowKey) { state.yellowKey += td.give.yellowKey; parts.push('黄钥匙×' + td.give.yellowKey); }
    if (td.give.blueKey) { state.blueKey += td.give.blueKey; parts.push('蓝钥匙×' + td.give.blueKey); }
    if (td.give.redKey) { state.redKey += td.give.redKey; parts.push('红钥匙×' + td.give.redKey); }
    if (td.give.hp) { state.hp += td.give.hp; parts.push('生命+' + td.give.hp); }
    if (td.give.item) { state.items[td.give.item] = (state.items[td.give.item] || 0) + 1; parts.push(D.items[td.give.item].name); }
    return { ok: true, msg: '购得 ' + parts.join('、') };
  }

  /* ---------------- 工具 ---------------- */
  function useItem(state, iid) {
    const it = D.items[iid];
    if (!it || !state.items[iid]) return { ok: false, msg: '没有该道具' };
    if (iid === 'superPotion') {
      const hp = Math.round(7.4 * (state.atk + state.def)); // 原版公式
      state.hp += hp;
      state.items[iid]--;
      return { ok: true, msg: '使用圣水，生命 +' + hp };
    }
    if (iid === 'bigKey') {
      let n = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (rawTile(state, x, y) === 81) { setBlock(state, x, y, 0); n++; }
      }
      if (!n) return { ok: false, msg: '本层没有黄门' };
      state.items[iid]--;
      return { ok: true, msg: '魔法钥匙打开了本层 ' + n + ' 扇黄门！' };
    }
    if (iid === 'pickaxe') {
      let n = 0;
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = state.x + d[0], y = state.y + d[1];
        const tid = rawTile(state, x, y);
        const def = tileDef(tid);
        if (def && (def.kind === 'wall' && def.breakable || def.kind === 'fakeWall')) { setBlock(state, x, y, 0); n++; }
      }
      if (!n) return { ok: false, msg: '周围没有可以破坏的墙' };
      state.items[iid]--;
      return { ok: true, msg: '镐破坏了 ' + n + ' 面墙！' };
    }
    if (iid === 'earthquake') {
      let n = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const def = tileDef(rawTile(state, x, y));
        if (def && (def.breakable || def.kind === 'fakeWall')) { setBlock(state, x, y, 0); n++; }
      }
      if (!n) return { ok: false, msg: '本层没有可破坏的墙' };
      state.items[iid]--;
      return { ok: true, msg: '地震卷轴摧毁了本层 ' + n + ' 面墙！' };
    }
    if (iid === 'bomb') {
      let n = 0, money = 0;
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = state.x + d[0], y = state.y + d[1];
        const info = fightCalc(state, x, y);
        if (info && !fs(state).killed[x + ',' + y]) { // 原版：可炸死任意相邻敌人
          fs(state).killed[x + ',' + y] = true;
          let g = info.mon.money * (state.items.coin ? 2 : 1);
          if (state.flags.curse) g = 0;
          money += g;
          n++;
        }
      }
      if (!n) return { ok: false, msg: '周围没有可以炸死的敌人' };
      state.money += money;
      state.items[iid]--;
      return { ok: true, msg: '炸弹炸死了 ' + n + ' 个敌人，获得 ' + money + ' 金币！', bombed: true };
    }
    if (iid === 'snow') {
      let n = 0;
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = state.x + d[0], y = state.y + d[1];
        if (tileDef(rawTile(state, x, y))?.kind === 'lava') { setBlock(state, x, y, 0); n++; }
      }
      if (!n) return { ok: false, msg: '周围没有岩浆' };
      state.items[iid]--;
      return { ok: true, msg: '冰魔法冻结了 ' + n + ' 处岩浆！' };
    }
    if (iid === 'centerFly') {
      // 原版瞬移：传送到本层中心对称的位置（h5mota centerFly）
      const tx = W - 1 - state.x, ty = H - 1 - state.y;
      const tid2 = rawTile(state, tx, ty);
      const kd = tid2 === 0 ? null : tileDef(tid2);
      if (kd && !['ground', 'item'].includes(kd.kind)) return { ok: false, msg: '对称的位置无法立足' };
      state.x = tx; state.y = ty;
      state.items[iid]--;
      return { ok: true, msg: '使用瞬移，传送到了中心对称的位置！', moved: true };
    }
    if (iid === 'upFly' || iid === 'downFly') {
      const idx = floorIndex(state.floor);
      const tIdx = iid === 'upFly' ? idx + 1 : idx - 1;
      if (tIdx < 0 || tIdx >= D.floors.length) return { ok: false, msg: iid === 'upFly' ? '你已在最高层' : '你已在最低层' };
      const target = D.floors[tIdx];
      if (rawTile(state, state.x, state.y) !== 0 && tileDef(rawTile(state, state.x, state.y))?.kind !== 'ground') {
        // 位置会被占用的判断交给前端提示
      }
      const tid2 = target.map[state.y][state.x];
      const kd = tileDef(tid2);
      if (tid2 !== 0 && kd && kd.kind !== 'ground' && kd.kind !== 'item') {
        return { ok: false, msg: (iid === 'upFly' ? '上一' : '下一') + '层此位置有东西' };
      }
      changeFloor(state, target.id, [state.x, state.y]);
      return { ok: true, msg: (iid === 'upFly' ? '向上' : '向下') + '传送到第 ' + tIdx + ' 层！', moved: true };
    }
    return { ok: false, msg: '这个道具不能直接使用' };
  }

  /* ---------------- 序列化 ---------------- */
  function serialize(state) { state._v = 2; return JSON.stringify(state); }
  function deserialize(json) {
    try {
      const s = JSON.parse(json);
      if (!s || !s.floors || !s.floor) return null;
      for (const F of D.floors) {
        if (!s.floors[F.id]) s.floors[F.id] = { killed: {}, picked: {}, opened: {}, done: {}, blocks: {}, override: null };
      }
      return s;
    } catch (e) { return null; }
  }

  /* ---------------- BFS 寻路（不穿门/怪） ---------------- */
  function pathTo(state, tx, ty) {
    if (tx === state.x && ty === state.y) return [];
    const seen = new Set([state.x + ',' + state.y]);
    const prev = new Map();
    const q = [[state.x, state.y]];
    for (let head = 0; head < q.length; head++) {
      const [cx, cy] = q[head];
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + d[0], ny = cy + d[1];
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const k = nx + ',' + ny;
        if (seen.has(k)) continue;
        const kind = (tileDef(rawTile(state, nx, ny)) || {}).kind || 'empty';
        if (kind === 'wall' || kind === 'star' || kind === 'lava' || kind === 'deco' ||
            kind === 'door' || kind === 'fakeWall' || kind === 'fakeWall2' ||
            kind === 'enemy' || kind === 'npc') continue;
        if ((kind === 'up' || kind === 'down') && !(nx === tx && ny === ty)) continue;
        seen.add(k);
        prev.set(k, cx + ',' + cy);
        if (nx === tx && ny === ty) {
          const path = [];
          let ck = k;
          while (ck !== state.x + ',' + state.y) {
            const [a, b] = ck.split(',').map(Number);
            path.unshift([a, b]);
            ck = prev.get(ck);
          }
          return path;
        }
        q.push([nx, ny]);
      }
    }
    return null;
  }

  global.MOTA = {
    VERSION, W, H,
    DATA: D,
    createState, cloneState,
    floorById, floorIndex, tileDef,
    rawTile, monsterAt, itemAt, monsterIdAt,
    battleCalc, fightCalc, doFight, hasSpecial, multForId,
    pickup, tryMove, afterStep, talkAt, markStepDone, afterBattleQueues,
    makeRunner, stepRunner, applyNode, evalCond,
    changeFloor, landAt,
    shrineInfo, shrinePurchase, traderBuy, useItem,    pathTo, serialize, deserialize, setBlock,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.MOTA;
})(typeof window !== 'undefined' ? window : global);
