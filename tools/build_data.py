#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
魔塔50层 —— 原版数据转换器
从 h5mota 官方原版复刻数据（三原塔翻新小组《50层魔塔》Ver3.0，即 Flash 原版的忠实移植）
生成 mota-data.js，包含：楼层地图（13×13 原版布局）、怪物表、道具表、
楼梯连接、机关事件、商店、老人提示、大怪物贴图位置等。

用法: python3 tools/build_data.py   (在项目根目录执行)
参考数据位于 tools/floors_src、tools/maps.js、tools/enemys.js、tools/events.js、tools/icons_ref.js
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'tools')

def load_json_file(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])

MAPS = load_json_file(os.path.join(SRC, 'maps.js'))
ENEMYS = load_json_file(os.path.join(SRC, 'enemys.js'))
EVENTS_ALL = load_json_file(os.path.join(SRC, 'events.js'))
ICONS = load_json_file(os.path.join(SRC, 'icons_ref.js'))
FLOORS_SRC = {i: load_json_file(os.path.join(SRC, 'floors_src', f'MT{i}.js')) for i in range(51)}

# ---------------------------------------------------------------
# 图块注册表（语义取自原版 maps.js）
# cls: wall/fakeWall/fakeWall2/lava/star/door/stair/item/npc/enemy/ground
# ---------------------------------------------------------------
TERRAIN_WALLS = {'yellowWall2': 1, 'unbreakableWall': 1}  # 额外墙体 id -> 视墙
def tile_entry(tid, m):
    cid = m['id']; cls = m['cls']
    e = {'id': cid, 'cls': cls, 'name': m.get('name', cid)}
    if cls == 'animates':
        if cid == 'yellowWall': e['kind'] = 'wall'; e['breakable'] = True
        elif cid == 'unbreakableWall': e['kind'] = 'wall'
        elif cid == 'fakeWall': e['kind'] = 'fakeWall'
        elif cid == 'fakeWall2': e['kind'] = 'fakeWall2'
        elif cid == 'star': e['kind'] = 'star'
        elif cid == 'lava': e['kind'] = 'lava'
        elif cid.endswith('Door'):
            e['kind'] = 'door'
            keys = m.get('doorInfo', {}).get('keys', {})
            e['key'] = next(iter(keys.keys())) if keys else None
        else: e['kind'] = 'deco'
    elif cls == 'terrains':
        if cid in ('upFloor',): e['kind'] = 'up'
        elif cid in ('downFloor',): e['kind'] = 'down'
        elif cid in ('blueShop-left', 'blueShop-right', 'pinkShop-left', 'pinkShop-right'): e['kind'] = 'shopTile'
        elif cid.startswith('ground') or cid in ('grass', 'grass2', 'snowGround', 'sand', 'soil', 'white'): e['kind'] = 'ground'
        elif cid in ('yellowWall2', 'whiteWall2', 'blueWall2', 'blockWall', 'grayWall'): e['kind'] = 'wall'
        elif cid == 'flower': e['kind'] = 'deco'
        else: e['kind'] = 'deco'
    elif cls == 'items': e['kind'] = 'item'
    elif cls == 'npcs': e['kind'] = 'npc'
    elif cls in ('enemys', 'enemy48'): e['kind'] = 'enemy'
    return e

TILES = {}
for tid, m in MAPS.items():
    TILES[int(tid)] = tile_entry(int(tid), m)
# 原版地图里出现但 maps.js 未定义的 17 号：大怪物贴图占位（可通行空地）
TILES[17] = {'id': 'bigImage', 'cls': 'terrains', 'kind': 'ground', 'name': 'bigImageZone'}

def kind_of(tid):
    if tid == 0: return 'empty'
    return TILES.get(tid, {}).get('kind', 'empty')

def wall_like(tid):
    return kind_of(tid) in ('wall',)

# ---------------------------------------------------------------
# 怪物表（原版数值 + 特殊属性）
# special: 15=领域(value), 18=阻击(value), 16=夹击, 2=魔攻, 12=中毒, 13=衰弱, 14=诅咒, 8=反击, 6=N连击(n)
# ---------------------------------------------------------------
monsters = {}
for mid, m in ENEMYS.items():
    sp = m.get('special', 0)
    if isinstance(sp, list):
        keep = [s for s in sp if s in (2, 3)]
    else:
        keep = sp if sp in (15, 18, 16, 2, 3, 12, 13, 14, 8, 6) else 0
    ent = {'name': m['name'], 'hp': m['hp'], 'atk': m['atk'], 'def': m['def'],
           'money': m['money'], 'special': keep}
    if keep == 15 or keep == 18 or (isinstance(keep, list)):
        if m.get('value') is not None: ent['value'] = m['value']
    if keep == 6: ent['n'] = m.get('n', 4)
    if m.get('bigImage'): ent['bigImage'] = m['bigImage']
    monsters[mid] = ent
# 邪恶蝙蝠 special [2,3]
monsters['evilBat']['special'] = [2, 3]

# ---------------------------------------------------------------
# 道具表（cls: key/gem/potion/equip/tool/const）
# ---------------------------------------------------------------
items = {
    'yellowKey': {'name': '黄钥匙', 'cls': 'key', 'desc': '可以打开一扇黄门'},
    'blueKey':   {'name': '蓝钥匙', 'cls': 'key', 'desc': '可以打开一扇蓝门'},
    'redKey':    {'name': '红钥匙', 'cls': 'key', 'desc': '可以打开一扇红门'},
    'redGem':    {'name': '红宝石', 'cls': 'gem', 'atk': 1, 'desc': '攻击力提升（随区域倍增）'},
    'blueGem':   {'name': '蓝宝石', 'cls': 'gem', 'def': 1, 'desc': '防御力提升（随区域倍增）'},
    'redPotion':   {'name': '红血瓶', 'cls': 'potion', 'hp': 50, 'desc': '生命提升（随区域倍增）'},
    'bluePotion':  {'name': '蓝血瓶', 'cls': 'potion', 'hp': 200, 'desc': '生命提升（随区域倍增）'},
    'sword1': {'name': '铁剑',   'cls': 'equip', 'atk': 10,  'desc': '攻击+10'},
    'sword2': {'name': '银剑',   'cls': 'equip', 'atk': 20,  'desc': '攻击+20'},
    'sword3': {'name': '骑士剑', 'cls': 'equip', 'atk': 40,  'desc': '攻击+40'},
    'sword4': {'name': '圣剑',   'cls': 'equip', 'atk': 50,  'desc': '攻击+50'},
    'sword5': {'name': '神圣剑', 'cls': 'equip', 'atk': 100, 'desc': '攻击+100'},
    'shield1': {'name': '铁盾',   'cls': 'equip', 'def': 10,  'desc': '防御+10'},
    'shield2': {'name': '银盾',   'cls': 'equip', 'def': 20,  'desc': '防御+20'},
    'shield3': {'name': '骑士盾', 'cls': 'equip', 'def': 40,  'desc': '防御+40'},
    'shield4': {'name': '圣盾',   'cls': 'equip', 'def': 50,  'desc': '防御+50'},
    'shield5': {'name': '神圣盾', 'cls': 'equip', 'def': 100, 'magicImmune': True, 'desc': '防御+100，免疫魔法攻击'},
    'book':    {'name': '怪物手册', 'cls': 'const', 'desc': '查看怪物属性与战斗预判（X 键）'},
    'fly':     {'name': '魔杖(楼传)', 'cls': 'tool', 'desc': '飞往去过的楼层（需在楼梯边）'},
    'cross':   {'name': '十字架', 'cls': 'const', 'desc': '对兽人、兽人武士、吸血鬼攻击力加倍'},
    'knife':   {'name': '屠龙匕首', 'cls': 'const', 'desc': '对魔龙攻击力加倍'},
    'coin':    {'name': '幸运金币', 'cls': 'const', 'desc': '战斗后获得双倍金钱'},
    'superPotion': {'name': '圣水', 'cls': 'tool', 'desc': '增加 round(7.4×(攻击+防御)) 点生命'},
    'bigKey':  {'name': '魔法钥匙', 'cls': 'tool', 'desc': '打开本层所有黄门'},
    'pickaxe': {'name': '镐', 'cls': 'tool', 'desc': '破坏周围可破坏的墙'},
    'bomb':    {'name': '炸弹', 'cls': 'tool', 'desc': '炸死周围生命低于500的敌人并获得金币'},
    'snow':    {'name': '冰魔法', 'cls': 'tool', 'desc': '冻结周围的岩浆'},
    'upFly':   {'name': '上传送', 'cls': 'tool', 'desc': '传送到楼上对应位置'},
    'downFly': {'name': '下传送', 'cls': 'tool', 'desc': '传送到楼下对应位置'},
    'centerFly': {'name': '瞬移', 'cls': 'tool', 'desc': '传送到本层中心对称的位置'},
    'earthquake': {'name': '地震卷轴', 'cls': 'tool', 'desc': '破坏本层所有可破坏的墙'},
    'wand':    {'name': '备忘录', 'cls': 'const', 'desc': '自动记录重要谈话'},
}
# 地图上直接出现的 item 图块号 -> 道具 id
TILE_ITEM = {21: 'yellowKey', 22: 'blueKey', 23: 'redKey', 26: 'bigKey',
             27: 'redGem', 28: 'blueGem', 31: 'redPotion', 32: 'bluePotion',
             35: 'sword1', 36: 'shield1', 37: 'sword2', 38: 'shield2',
             39: 'sword3', 40: 'shield3', 41: 'sword4', 42: 'shield4',
             43: 'sword5', 44: 'shield5', 46: 'fly', 47: 'pickaxe', 49: 'bomb',
             51: 'upFly', 52: 'downFly', 53: 'coin', 54: 'snow', 55: 'cross', 62: 'knife', 73: 'wand',
             331: 'centerFly'}

# ---------------------------------------------------------------
# 老人提示（原版"对话"公共事件，arg1=楼层号）
# text: 通用；oldman/trader: 同层两 NPC 各自的原话（arg4 区分）
# ---------------------------------------------------------------
OLDMAN_HINTS = {
    2:  {'text': '谢谢你救了我，为了感谢你的帮助请收下这些礼物。', 'gift': {'money': 1000}},
    3:  {'text': '我可以给你怪物手册。你可以用快捷键 X 去使用它。它能预测出当前楼层各类怪物对你的伤害。', 'gift': {'item': 'book'}},
    4:  {'text': '有些门不能用钥匙打开，只有当你打败它的守卫后才会自动打开。'},
    6:  {'oldman': '你购买了礼物后再与商人对话，他会告诉你一些重要的消息。',
         'trader': '魔塔一共50层，每10层为一个区域。如果不打败此区域的头目就不能到更高的地方。'},
    7:  {'text': '在商店里你最好选择提升防御，只有在攻击力低于敌人的防御力时才提升攻击力。'},
    12: {'text': '你是否注意到 5,9,14,16,18 楼有的墙与众不同？'},
    15: {'text': '如果你持有十字架，面对兽人和吸血鬼时你的攻击力加倍。在没有十字架的情况下你不可能打败吸血鬼。十字架被藏在高于15楼的墙内。'},
    16: {'text': '我听说在塔内有2把隐藏的红钥匙。'},
    18: {'text': '在这区域不多次提升攻击力，就不能打败石头人。切记前人教训！'},
    21: {'text': '大法师住在25楼，他是魔塔的主人。以你现在的状态去攻击他简直就是自杀。你应当在取得更高级别的道具后再去打败他。'},
    23: {'text': '我没有什么可说的，但有一个确切的消息藏在这个楼层里。'},
    27: {'text': '如果你到27楼时状态为：生命1500，攻击80，防御98，拥有1蓝钥匙，5黄钥匙。那么祝贺你，你前期是比较成功的。'},
    31: {'oldman': '双手剑士的攻击力太高了，你最好到能对他一击必杀时再与他战斗。',
         'trader': '魔塔有50层高，但似乎你不能直接到50楼。'},
    33: {'text': '别匆忙，放慢速度。'},
    36: {'text': '如果你能用好4种移动宝物，你不用与强敌作战就能上楼。'},
    37: {'text': '你需要用地震卷轴取出37楼仓库内的所有宝物。'},
    38: {'text': '存放圣剑的房间的门坏了，你必须用镐破墙而入。'},
    39: {'oldman': '谜题："在3点，拥有传送功能的密宝 就会出现。',
         'trader': '塔内有个幸运金币。拥有它在打败敌人后能获得2倍的金钱。'},
    42: {'text': '巫师会用魔法攻击路过的人，在2个魔法警卫间通过会使你的生命减少一半。'},
    45: {'oldman': '神圣盾能防御魔法攻击，但它被藏在异空间的楼层内。',
         'trader': '44楼被藏在异空间，你只能用密宝才能到达'},
    46: {'text': '41楼事实上是左右对称的。'},
    47: {'text': '如果要打败魔龙你需要圣剑、圣盾、屠龙匕或更高等级的装备。'},
    48: {'text': '象骰子上5的形状是一种封印魔法，你最好记住它在你与49楼假魔王战斗时有用。'},
}

# ---------------------------------------------------------------
# 商人（原版"商人"公共事件，arg1=楼层号，一次性买卖）
# ---------------------------------------------------------------
TRADERS = {
    6:  {'cost': 50,   'text': '我有一把蓝钥匙，你出50个金币就卖给你。', 'give': {'blueKey': 1}},
    7:  {'cost': 50,   'text': '我有五把黄钥匙，你出50个金币就卖给你。', 'give': {'yellowKey': 5}},
    12: {'cost': 800,  'text': '我有一把红钥匙，你出800个金币就卖给你。', 'give': {'redKey': 1}},
    15: {'cost': 200,  'text': '我有一把蓝钥匙，你出200个金币就卖给你。', 'give': {'blueKey': 1}},
    31: {'cost': 1000, 'text': '我有四把黄钥匙一把蓝钥匙，你出1000个金币就都给你。', 'give': {'yellowKey': 4, 'blueKey': 1}},
    38: {'cost': 200,  'text': '我有3把黄钥匙，你出200个金币就都给你。', 'give': {'yellowKey': 3}},
    39: {'cost': 2000, 'text': '我有3把蓝钥匙，你出2000个金币就都给你。', 'give': {'blueKey': 3}},
    45: {'cost': 1000, 'text': '给我1000个金币我就提升你的生命2000点。', 'give': {'hp': 2000}},
    47: {'cost': 4000, 'text': '给我4000个金币我就给你地震卷轴，它可摧毁一层楼所有的墙。', 'give': {'item': 'earthquake'}},
}

# 祭坛（蓝商店）：共享购买次数，价格 20+10*n*(n-1)，区 ratio 决定攻防增量
SHRINES = {
    'MT4':  {'ratio': 1, 'loc': [6, 1]},
    'MT12': {'ratio': 2, 'loc': [6, 9]},
    'MT32': {'ratio': 4, 'loc': [10, 10]},
    'MT46': {'ratio': 5, 'loc': [6, 1]},
}

# ---------------------------------------------------------------
# 事件辅助
# ---------------------------------------------------------------
def T(text):
    """拆解原版 '\t[名字,图]内容' 对话为节点"""
    m = re.match(r'^\t?\[(^[\]]*)\]', text)
    mm = re.match(r'^\t?\[([^\],]+),([^\]]+)\](.*)$', text, re.S)
    if mm:
        return {'t': 'text', 'who': mm.group(1), 'img': mm.group(2),
                'text': mm.group(3).strip()}
    return {'t': 'text', 'text': text.strip()}

def tx(who, img, text):
    return {'t': 'text', 'who': who, 'img': img, 'text': text}

def STEP(F, x, y, acts, sticky=False, ghost=None):
    """登记一个踩格事件；sticky=可重复触发；ghost=该格显示的幽灵贴图"""
    F['step'][f'{x},{y}'] = {'acts': acts, 'sticky': sticky}
    if ghost:
        F.setdefault('ghosts', {})[f'{x},{y}'] = ghost
    # 事件覆盖原版地图块：NPC/门图块需清空为可通行（原版事件块不可见）
    tid = F['map'][y][x]
    def_ = TILES.get(tid)
    if def_ and def_.get('kind') in ('npc', 'door'):
        F['map'][y][x] = 0


def L(*acts):
    return [a for a in acts if a is not None]

def openL(*locs):  return {'t': 'open', 'loc': [list(l) for l in locs]}
def closeL(loc, tid=None):
    e = {'t': 'close', 'loc': list(loc)}
    if tid is not None: e['n'] = tid
    return e
def setL(tid, *locs): return {'t': 'set', 'n': tid, 'loc': [list(l) for l in locs]}
def hideL(*locs):   return {'t': 'hide', 'loc': [list(l) for l in locs]}
def showL(*locs):   return {'t': 'show', 'loc': [list(l) for l in locs]}
def flagL(name, v=True): return {'t': 'flag', 'name': name, 'v': v}
def gotoL(floor, loc): return {'t': 'goto', 'floor': floor, 'loc': list(loc)}
def tipL(text): return {'t': 'tip', 'text': text}
def shopL(sid): return {'t': 'shop', 'id': sid}
def traderL(fid): return {'t': 'trader', 'fid': fid}
def battleL(mid, loc): return {'t': 'battle', 'id': mid, 'loc': list(loc)}
def cond_flag(name, op='==', v=True): return {'k': 'flag', 'name': name, 'op': op, 'v': v}
def cond_and(*ofs): return {'k': 'and', 'of': list(ofs)}
def cond_or(*ofs): return {'k': 'or', 'of': list(ofs)}
def cond_not(c): return {'k': 'not', 'of': c}
def cond_true(): return {'k': 'true'}
def ifL(cond, act, els=None): return {'t': 'if', 'cond': cond, 'act': act, 'else': els or []}
def sfxL(name): return {'t': 'sfx', 'name': name}

# ---------------------------------------------------------------
# 逐层构建
# ---------------------------------------------------------------
def parse_dialog_nodes(data):
    """把原版事件 data 粗翻译成对话+动作；仅用于挑出 text 节点"""
    out = []
    for n in data:
        if isinstance(n, str):
            out.append(T(n))
    return out

floors = []
unhandled = []

for i in range(51):
    fid = f'MT{i}'
    d = FLOORS_SRC[i]
    F = {
        'id': fid, 'n': i, 'name': d.get('name', f'第{i}层'), 'ratio': d.get('ratio', 1),
        'map': d['map'],
        'step': {}, 'talk': {}, 'after': {}, 'first': [], 'auto': [],
        'up': None, 'down': None, 'bigs': [], 'ghosts': {},
    }
    events = d.get('events') or {}
    ev_keys = set(events.keys())

    # ---- 楼梯 ----
    cf = d.get('changeFloor') or {}
    for locs, c in cf.items():
        x, y = map(int, locs.split(','))
        stair = {'loc': [x, y], 'to': c.get('floorId'), 'stair': c.get('stair')}
        tid = d['map'][y][x]
        if tid == 87: F['up'] = stair
        elif tid == 88: F['down'] = stair
        else:
            # 特殊：楼梯由事件创建（如40F），记录备用
            F.setdefault('extraStairs', {})[locs] = stair

    def rm(locs):
        for l in locs: ev_keys.discard(f'{l[0]},{l[1]}')

    # ---- 手工翻译各层特殊事件 ----
    if fid == 'MT1':
        # 起始层。(2,11) 为魔杖(楼传)。作者 NPC 保留一句问候。
        F['talk']['7,10'] = L(
            tx('作者', 'king', '欢迎来到《魔塔50层》原版复刻。祝你好运，勇士！'))
        rm([(7, 10)])

    if fid == 'MT2':
        STEP(F, 3, 7, L(
            tx('小偷', 'thief', '你清醒了吗？你到监狱时还处在昏迷中，魔法警卫把你扔到我这个房间。但你很幸运，我刚完成逃跑的暗道你就醒了，我们一起越狱吧。'),
            openL((2, 7)), flagL('剧情_越狱')), ghost='thief')
        rm([(3, 7)])
        STEP(F, 1, 9, L(
            ifL(cond_flag('剧情_越狱'), L(
                tx('小偷', 'thief', '我们终于逃出来了。你的剑和盾被警卫拿走了，你必须先找到武器。我知道铁剑在5楼，铁盾在9楼，你最好先取到它们。我现在有事要做没法帮你，再见。')))), ghost='thief')
        rm([(1, 9)])
        STEP(F, 10, 11, L(
            tx('小偷', 'thief', '哈哈，我们又见面了! 谢谢你救了我。我可以帮你在魔龙前打开一条暗道，我现在就去35楼。'),
            {'t': 'setFloor', 'floor': 'MT35', 'n': 0, 'loc': [[4, 9]]},
            flagL('剧情_35楼暗道')), ghost='thief')
        rm([(10, 11)])
        # 祝福商人（一次性 +3% 攻防）
        STEP(F, 11, 7, L(
            ifL(cond_not(cond_flag('祝福_2楼')), L(
                tx('商人', 'specialTrader', '谢谢你救了我，我能用祝福魔法提升你 3% 的攻击力和防御力。现在就提升吗？'),
                {'t': 'bless', 'pct': 3},
                flagL('祝福_2楼')))), ghost='specialTrader')
        rm([(11, 7)])
        for loc in ('6,2', '8,2'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_2楼门')), L(
                    openL((5, 5), (5, 8), (5, 11), (9, 5), (9, 8), (9, 11)),
                    flagL('机关_2楼门'))))
        rm([(6, 2), (8, 2)])

    if fid == 'MT3':
        # 3F：经典开场剧情（魔王出现 → 被打晕 → 2楼监狱醒来，属性重置 400/10/10）
        STEP(F, 5, 9, [{'t': 'cutscene', 'id': 'intro3f'}])
        rm([(5, 9)])

    if fid == 'MT4':
        STEP(F, 6, 1, [{'t': 'shop', 'id': 'MT4'}], sticky=True)
        rm([(6, 1)])

    if fid == 'MT8':
        for loc in ('9,5', '11,5'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_8楼')), L(openL((10, 4)), flagL('机关_8楼'))))
        rm([(9, 5), (11, 5)])

    if fid == 'MT10':
        STEP(F, 6, 5, [{'t': 'cutscene', 'id': 'mt10ambush'}])
        rm([(6, 5)])
        # (6,2) 首领喊话已按用户要求移除，仅保留贴图
        rm([(6, 2)])
        STEP(F, 6, 9, L(
            ifL(cond_flag('机关_10楼胜利'), L(
                {'t': 'cutscene', 'id': 'mt10thief'}))))
        rm([(6, 9)])
        F['after']['6,4'] = [{'t': 'cutscene', 'id': 'mt10win'}]
        rm([(6, 1), (6, 4)])
        F['bigs'].append({'loc': [6, 4], 'id': 'skeletonCaptain', 'size': 3})

    if fid == 'MT11':
        for loc in ('1,5', '3,5'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_11楼')), L(openL((2, 4)), flagL('机关_11楼'))))
        rm([(1, 5), (3, 5)])

    if fid == 'MT12':
        # (11,1) 不可破暗墙后藏着黄钥匙商人
        STEP(F, 11, 1, L(
            ifL(cond_not(cond_flag('机关_12楼商人')), L(
                sfxL('door'), openL((11, 1)), flagL('机关_12楼商人')))))
        rm([(11, 1)])
        F['talk']['11,1'] = L({'t': 'shop', 'id': 'keyTrader12'})
        STEP(F, 6, 9, [{'t': 'shop', 'id': 'MT12'}], sticky=True)
        rm([(6, 9)])

    if fid == 'MT14':
        F['auto'].append({
            'cond': cond_and({'k': 'dead', 'locs': [[1, 1], [3, 1], [2, 2]]}),
            'act': L(openL((1, 3)), setL(23, (1, 3))),
            'once': '机关_14楼红钥匙'})
        # 事件块清理
        ev_keys.clear()

    if fid == 'MT15':
        STEP(F, 9, 1, L(
            tx('小偷', 'thief', '阿哈! 你还好吗? 这大章鱼挡住了我前进的道路，现在暗道终于完工了，你现在最好也躲开它。我要走了，再见。'),
            openL((8, 1))), ghost='thief')
        rm([(9, 1)])
        F['after']['6,6'] = L(
            hideL((5, 4), (5, 5), (5, 6), (7, 4), (7, 5), (7, 6), (6, 4)),
            openL((6, 3)))
        rm([(6, 6)])
        F['bigs'].append({'loc': [6, 5], 'id': 'octopus', 'size': 3})

    if fid == 'MT16':
        STEP(F, 11, 11, L(
            ifL(cond_flag('机关_10楼开关A'), L(
                tx('老人', 'oldman', '很好，你居然找到了我，做为奖励我将给你一瓶圣水。喝了它将按你的攻击和防御力的总和增加你的生命点数，你越晚用它效果越好。'),
                {'t': 'giveItem', 'item': 'superPotion'}))), ghost='oldman')
        rm([(11, 11)])

    if fid == 'MT17':
        pairs = [('1,8', (2, 7), '机关_17a'), ('3,8', (2, 7), '机关_17a'),
                 ('1,5', (2, 4), '机关_17b'), ('3,5', (2, 4), '机关_17b'),
                 ('9,8', (10, 7), '机关_17c'), ('11,8', (10, 7), '机关_17c'),
                 ('9,5', (10, 4), '机关_17d'), ('11,5', (10, 4), '机关_17d')]
        for loc, door, fl in pairs:
            F['after'][loc] = L(ifL(cond_not(cond_flag(fl)), L(openL(door), flagL(fl))))
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT20':
        STEP(F, 6, 8, [{'t': 'cutscene', 'id': 'mt20vampire'}])
        rm([(6, 8)])
        F['after']['6,6'] = [{'t': 'cutscene', 'id': 'mt20win'}]
        rm([(6, 6)])

    if fid == 'MT23':
        # 单向迷宫：走过即封墙（step 事件 closeDoor yellowWall）
        for locs, e in events.items():
            x, y = map(int, locs.split(','))
            data = e.get('data', [])
            if any(isinstance(n, dict) and n.get('type') == 'closeDoor' for n in data):
                F['step'][locs] = [{'t': 'closeWall', 'loc': [x, y]}]
                ev_keys.discard(locs)

    if fid == 'MT24':
        STEP(F, 6, 2, L(
            ifL(cond_flag('剧情_营救公主'), L(gotoL('MT50', [6, 7])))), sticky=True)
        rm([(6, 2)])

    if fid == 'MT25':
        STEP(F, 6, 9, L(
            tx('', 'blackMagician', '-杀-死-入-侵-者-')), ghost='blackMagician')
        rm([(6, 9)])
        F['after']['6,6'] = L(
            sfxL('door'),
            setL(23, (4, 8), (5, 8), (7, 8), (8, 8)))
        rm([(6, 6)])

    if fid == 'MT26':
        STEP(F, 6, 6, L(
            ifL(cond_not(cond_flag('剧情_营救公主')), L(
                tx('洋娃娃', 'princess', '时间到了，你已被命运选中。如果你不怕死亡，你最终将通过时空来到我这里。'),
                tx('勇士', 'hero', '哦! 什么? 这只是个洋娃娃!'),
                tx('洋娃娃', 'princess', '时间到了，你已被命运选中。如果你不怕死亡，你最终将通过时空来到我这里。'),
                tx('勇士', 'hero', '哦! 什么? 这只是个洋娃娃!'),
                {'t': 'setFloor', 'floor': 'MT24', 'n': 321, 'loc': [[6, 1]]},
                {'t': 'setFloor', 'floor': 'MT24', 'n': 1, 'loc': [[5, 1], [7, 1]]},
                {'t': 'setFloor', 'floor': 'MT24', 'n': 0, 'loc': [[6, 2], [6, 3], [6, 4]]},
                flagL('剧情_营救公主')))), ghost='princess')
        rm([(6, 6)])

    if fid == 'MT28':
        STEP(F, 8, 4, [{'t': 'shop', 'id': 'recycler28'}], sticky=True, ghost='specialTrader')
        rm([(8, 4)])

    if fid == 'MT29':
        STEP(F, 6, 2, L(
            tx('小偷', 'thief', '哦，我刚完成暗道。你每次都及时赶到，看在朋友的份上，你可以免费使用。好了下次见。'),
            openL((6, 3)), flagL('剧情_29楼暗道')), ghost='thief')
        rm([(6, 2)])

    if fid == 'MT30':
        for loc in ('5,5', '3,5', '4,5', '7,5', '8,5', '9,5'):
            F['after'][loc] = L(
                ifL(cond_flag('计数_30楼', '>=', 5), L(openL((6, 4)), flagL('机关_30楼'))),
                {'t': 'flagAdd', 'name': '计数_30楼', 'v': 1})
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT32':
        STEP(F, 10, 10, [{'t': 'shop', 'id': 'MT32'}], sticky=True)
        rm([(10, 10)])
        STEP(F, 6, 10, [{'t': 'cutscene', 'id': 'mt32knight'}])
        rm([(6, 10)])
        for loc in ('1,10', '3,10'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_32楼')), L(openL((2, 9)), flagL('机关_32楼'))))
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT33':
        STEP(F, 10, 5, L(
            ifL(cond_not(cond_flag('机关_33楼骑士剑')), L(
                closeL((11, 4), 1),
                ifL(cond_and({'k': 'dead', 'locs': [[9, 5], [11, 5], [9, 7], [11, 7]]}), L(
                    {'t': 'set', 'n': 85, 'loc': [[10, 4], [10, 8]]},
                    flagL('机关_33楼骑士剑')))))), sticky=True)
        rm([(10, 5)])

    if fid == 'MT34':
        F['auto'].append({
            'cond': cond_and({'k': 'dead', 'locs': [[5, 4], [7, 4], [9, 4], [11, 4], [5, 8], [7, 8], [9, 8], [11, 8]]}),
            'act': L(hideL((2, 6)), setL(21, (1, 5), (3, 5), (1, 7), (3, 7)), setL(23, (2, 6))),
            'once': '机关_34楼钥匙'})
        ev_keys.clear()

    if fid == 'MT35':
        STEP(F, 5, 10, L(
            tx('小偷', 'thief', '你好，暗道已挖好，你可用它绕过魔龙。'),
            tx('小偷', 'thief', '我听说骑士队长（本区的头目）实力差又爱吹牛，所以被魔法警卫们讨厌。'),
            tx('小偷', 'thief', '这魔塔太危险了，我可不想再次被抓，我要离塔回去了，再见。')), ghost='thief')
        rm([(5, 10)])
        F['after']['6,7'] = L(
            openL((6, 3)), hideL((5, 7), (7, 7)))
        rm([(6, 7)])
        F['bigs'].append({'loc': [6, 7], 'id': 'magicDragon', 'size': 3, 'frames': 4})

    if fid == 'MT38':
        for loc in ('1,10', '3,10'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_38楼')), L(openL((2, 9)), flagL('机关_38楼'))))
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT39':
        F['auto'].append({
            'cond': cond_and({'k': 'dead', 'locs': [[4, 2], [6, 4]]},
                             {'k': 'alive', 'locs': [[2, 2], [6, 2], [2, 4], [2, 6], [4, 6], [6, 6]]}),
            'act': L(openL((4, 4)), setL(331, (4, 4))),
            'once': '机关_39楼瞬移'})
        ev_keys.clear()

    if fid == 'MT40':
        STEP(F, 6, 7, [{'t': 'cutscene', 'id': 'mt40knight'}])
        rm([(6, 7)])
        STEP(F, 6, 1, L(ifL(cond_flag('机关_40楼通过'), L({'t': 'exitNext'}))), sticky=True)
        rm([(6, 1)])

    if fid == 'MT41':
        # 打败左侧红巫师后来到右侧墙边（并到过42层），右侧红巫师现身
        F['after']['2,2'] = L(flagL('机关_41楼左', True))
        rm([(2, 2)])
        STEP(F, 9, 2, L(
            ifL(cond_and(cond_flag('机关_41楼左'), cond_flag('剧情_到过42楼')), L(
                setL(220, (10, 2)), tipL('右侧的红巫师现身了！')))))
        rm([(9, 2)])
        F['after']['10,2'] = L(
            closeL((5, 6), 1), closeL((6, 6), 1), closeL((7, 6), 1),
            openL((5, 7), (7, 7)),
            setL(52, (6, 5)), closeL((7, 1), 1),
            tipL('降临之翼出现了'))
        rm([(10, 2)])

    if fid == 'MT42':
        F['first'] = L(flagL('剧情_到过42楼'))
        STEP(F, 5, 10, [{'t': 'cutscene', 'id': 'mt42story'}], ghost='yellowKnight')
        rm([(5, 10)])
        rm([(6, 10)])

    if fid == 'MT43':
        # 打开 (8,1) 黄门惊动魔法警卫，两侧通道被封
        F['doorTrap'] = {'loc': [8, 1], 'act': L(
            closeL((8, 2), 1), closeL((10, 2), 1),
            sfxL('door'),
            tipL('魔法警卫被惊动了！'))}
        F['after']['9,1'] = L(closeL((8, 2), 1), closeL((10, 2), 1))
        rm([(9, 1), (8, 1)])

    if fid == 'MT44':
        for loc in ('5,9', '7,9'):
            F['after'][loc] = L(
                ifL(cond_not(cond_flag('机关_44楼')), L(openL((6, 8)), flagL('机关_44楼'))))
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT45':
        pairs = [('8,9', (7, 10), '机关_45a'), ('8,11', (7, 10), '机关_45a'),
                 ('5,9', (4, 10), '机关_45b'), ('5,11', (4, 10), '机关_45b')]
        for loc, door, fl in pairs:
            F['after'][loc] = L(ifL(cond_not(cond_flag(fl)), L(openL(door), flagL(fl))))
            rm([tuple(map(int, loc.split(',')))])

    if fid == 'MT46':
        STEP(F, 6, 1, [{'t': 'shop', 'id': 'MT46'}], sticky=True)
        rm([(6, 1)])

    if fid == 'MT49':
        STEP(F, 6, 6, [{'t': 'cutscene', 'id': 'mt49fakeking'}])
        rm([(6, 6)])
        pairs = [('5,10', (6, 9), '机关_49a'), ('7,10', (6, 9), '机关_49a'),
                 ('5,8', (6, 7), '机关_49b'), ('7,8', (6, 7), '机关_49b')]
        for loc, door, fl in pairs:
            F['after'][loc] = L(ifL(cond_not(cond_flag(fl)), L(openL(door), flagL(fl))))
            rm([tuple(map(int, loc.split(',')))])
        F['after']['6,3'] = [{'t': 'cutscene', 'id': 'mt49win'}]
        rm([(6, 3)])
        # 骰子"5"封印机关：杀掉十字线上四只魔法警卫、保留四角，
        # 假魔王被封印（攻防血降为一成），若先与50层小偷对话则达成TE
        F['auto'].append({
            'cond': cond_and({'k': 'alive', 'locs': [[5, 2], [7, 2], [5, 4], [7, 4]]},
                             {'k': 'dead', 'locs': [[6, 2], [5, 3], [7, 3], [6, 4]]}),
            'act': L(
                ifL(cond_flag('剧情_与50层小偷对话'), L(flagL('剧情_TE'))),
                {'t': 'monsterOverride', 'floor': 'MT49', 'id': 'redKing',
                 'value': {'hp': 800, 'atk': 500, 'def': 100}},
                tx('魔王', 'redKing', '啊！我怎么被封印了，我只剩下一成的功力了！！！')),
            'once': '机关_49楼封印'})

    if fid == 'MT50':
        STEP(F, 6, 5, [{'t': 'cutscene', 'id': 'mt50reveal'}], ghost='thief')
        rm([(6, 5)])
        F['after']['6,5'] = [{'t': 'cutscene', 'id': 'mt50win'}]
        rm([(6, 5)])

    # ---- 商人 NPC（trigger=trader，一次性买卖）----
    for locs in list(ev_keys):
        pass
    for y in range(13):
        for x in range(13):
            tid = d['map'][y][x]
            if tid in (122,):
                if f'{x},{y}' in F['talk'] or f'{x},{y}' in F['step']: continue
                F['talk'][f'{x},{y}'] = L({'t': 'trader', 'fid': i})
            elif tid == 121:
                if f'{x},{y}' in F['talk'] or f'{x},{y}' in F['step']: continue
                F['talk'][f'{x},{y}'] = [{'t': 'oldman', 'fid': i}]

    # ---- 剩余未处理事件（告警）----
    for locs in sorted(ev_keys):
        e = events[locs]
        data = e.get('data', [])
        kinds = [n.get('type') for n in data if isinstance(n, dict)]
        unhandled.append((fid, locs, e.get('trigger'), kinds[:6]))

    floors.append(F)

# ---------------------------------------------------------------
# 剧情脚本（按原版事件手工还原）
# ---------------------------------------------------------------
CUTSCENES = {
    # 3F：经典开场 —— 魔王现身，勇士被打晕，2楼监狱醒来（属性重置 400/10/10）
    'intro3f': [
        sfxL('zone'),
        setL(245, (5, 7)),
        tx('魔王', 'redKing', '欢迎来到魔塔，你是第一百位挑战者。你若能打败我所有的手下，我就与你一对一的决斗。现在你必须接受我的安排。'),
        setL(246, (5, 8), (4, 9), (6, 9), (5, 10)),
        tx('勇士', 'hero', '什么？'),
        {'t': 'sleep', 'ms': 600},
        {'t': 'setHero', 'hp': 400, 'atk': 10, 'def': 10, 'intro': True},
        hideL((5, 7), (5, 8), (4, 9), (6, 9), (5, 10), (5, 9)),
        gotoL('MT2', [3, 8]),
        {'t': 'sleep', 'ms': 500},
        tx('', '', '------ 喂！'),
        tx('', '', '------ 喂！醒醒！'),
        flagL('剧情_开场', True),
    ],
    # 10F：骷髅队长伏击
    'mt10ambush': [
        closeL((6, 7), 85),
        sfxL('door'),
        openL((4, 4), (8, 4), (5, 6), (7, 6)),
        hideL((5, 4), (6, 3), (7, 4), (5, 5), (7, 5)),
        tipL('骷髅队长的埋伏！弟兄们一拥而上。'),
        closeL((6, 3), 85),
        closeL((4, 4), 85),
        closeL((8, 4), 85),
        flagL('机关_10楼开关A', True),
        flagL('机关_10楼机关', True),
    ],
    'mt10win': [
        tx('骷髅队长', 'skeletonCaptain', '不,这是不可能的，你怎么会打败我！你别太得意，后面还有许多强大的对手和机关存在，你稍有疏忽就必死无疑。'),
        sfxL('door'),
        setL(27, (1, 3), (2, 3), (3, 3)),
        setL(28, (9, 3), (10, 3), (11, 3)),
        setL(32, (1, 4), (2, 4), (3, 4)),
        setL(21, (9, 4), (10, 4), (11, 4)),
        openL((4, 4), (6, 7), (8, 4)),
        flagL('机关_10楼胜利', True),
    ],
    'mt10thief': [
        tx('小偷', 'thief', '嘿！我们又见面了！非常感谢你打败了此区域的头目。我正苦恼于如何到更高的楼层，现在我终于可以上去了。我听说银盾在11楼，银剑在17楼，这消息不知道对你是否有用。'),
    ],
    # 20F：蝙蝠合成吸血鬼
    'mt20vampire': [
        setL(85, (6, 9)),
        sfxL('zone'),
        setL(206, (5, 5), (6, 5), (7, 5), (5, 6), (7, 6), (5, 7), (6, 7), (7, 7)),
        {'t': 'sleep', 'ms': 800},
        tipL('蝙蝠群汇聚成了吸血鬼！'),
        hideL((5, 5), (6, 5), (7, 5), (5, 6), (7, 6), (5, 7), (6, 7), (7, 7)),
        setL(208, (6, 6)),
    ],
    'mt20win': [
        tx('吸血鬼', 'vampire', '上帝阿!我做梦也没想到我会被别人打败。毫无疑问你是比我强。但以你现在的状态对于大法师来说又太弱了，你仅仅取得了一个暂时的胜利。'),
        sfxL('door'),
        setL(21, (5, 4), (6, 4), (7, 4)),
        setL(27, (4, 5), (4, 6), (4, 7)),
        setL(28, (8, 5), (8, 6), (8, 7)),
        setL(32, (5, 8), (6, 8), (7, 8)),
        openL((6, 3), (6, 9)),
    ],
    # 32F：骑士队长决斗（剧情战斗）
    'mt32knight': [
        tipL('骑士队长拦住了你的去路！'),
        battleL('yellowKnight', (6, 10)),
        tx('骑士队长', 'yellowKnight', '你以为你已非常强大了吗？嘿嘿错了，只是我今天状态不佳而已。我走了，有本事到40楼与我再打一次。'),
    ],
    # 40F：骑士队长与鬼战士伏击（战后留下宝物与通道）
    'mt40knight': [
        tipL('骑士队长与鬼战士的伏击！'),
        sfxL('battle'),
        setL(21, (2, 2), (3, 2), (4, 2)),
        setL(27, (8, 2), (9, 2), (10, 2)),
        setL(32, (3, 4), (4, 4), (5, 4)),
        setL(28, (7, 4), (8, 4), (9, 4)),
        setL(87, (6, 1)),
        flagL('机关_40楼通过', True),
        hideL((6, 7)),
    ],
    # 42F：魔王处决逃跑的骑士队长
    'mt42story': [
        tx('骑士队长', 'yellowKnight', '啊！又是你！！（转身逃跑）'),
        setL(245, (6, 6)),
        tx('魔王', 'redKing', '你敢临阵脱逃！'),
        tx('骑士队长', 'yellowKnight', '哦，大王，我打不过这个勇士，不得不逃，绕了我吧？'),
        tx('魔王', 'redKing', '你说什么？你敢再说一次！你象个胆小鬼一样逃离你负责的区域，并说出那样的话。魔塔不需要象你这样的败类，来人给我杀了。'),
        setL(246, (6, 7), (5, 8), (7, 8), (6, 9)),
        tx('骑士队长', 'yellowKnight', '大王，饶了我吧，再给我一次机会阿.....'),
        sfxL('battle'),
        hideL((6, 8)),
        tx('魔王', 'redKing', '虽然我刚才态度异常，但别担心在决斗时，我不会像刚才这个无用的家伙一样让手下一拥而上。我期待着与你决斗。'),
        hideL((6, 6), (6, 7), (5, 8), (7, 8), (6, 9)),
    ],
    # 49F：假魔王现身
    'mt49fakeking': [
        setL(85, (6, 7)),
        setL(245, (6, 3)),
        tx('魔王', 'redKing', '你终于来了，我很想与你立刻决斗，但我的部下不同意。'),
        setL(246, (5, 2), (5, 3), (5, 4), (6, 4), (7, 4), (7, 3), (7, 2), (6, 2)),
    ],
    'mt49win': [
        tx('魔王', 'redKing', '哈哈哈，很好，你是个合格的战士。'),
        hideL((5, 2), (6, 2), (7, 2), (5, 3), (6, 3), (7, 3), (5, 4), (6, 4), (7, 4)),
        setL(23, (5, 2)),
        setL(62, (7, 2)),
        setL(27, (2, 4), (3, 4), (4, 4)),
        setL(28, (8, 4), (9, 4), (10, 4)),
        setL(32, (5, 5), (6, 5), (7, 5)),
        openL((6, 7), (6, 9)),
        ifL(cond_flag('剧情_TE'), L(tipL('假魔王被封印，真魔王的力量也被削弱了一成！'))),
    ],
    # 50F：小偷 revealing 真魔王
    'mt50reveal': [
        tx('勇士', 'hero', '你怎会在这里！你到底是谁？'),
        tx('小偷', 'thief', '我在这里只有一个理由，那就是……'),
        hideL((6, 5)),
        {'t': 'monsterOverride', 'floor': 'MT50', 'id': 'redKing', 'value': {'hp': 5000, 'atk': 1580, 'def': 190}},
        setL(245, (6, 5)),
        {'t': 'sleep', 'ms': 500},
        tx('勇士', 'hero', '啊！你就是魔王！你怎么还活着？'),
        tx('魔王', 'redKing', '我是不会死的。以前我只是对你的能力做测试而已。'),
        tx('勇士', 'hero', '什么？你这是什么意思？你为什么要做这样的事情？'),
        tx('魔王', 'redKing', '神圣剑就是你装备的武器，智慧权杖是我所装备的武器。先知说过无论谁使用它们都必需要有足够的智慧，且剑只能被真正的战士使用。'),
        tx('勇士', 'hero', '如你所说，我就是那个战士。'),
        tx('魔王', 'redKing', '是的，你是最合适的人选。但你刚到魔塔时，你的能力还不足以支配神圣剑。因此我在塔内安排了各类机关，让你通过战斗直到可以控制神圣剑。'),
        tx('勇士', 'hero', '很好，那么外面传说有一个公主被困在魔塔，就是为了把我骗到这里。是这样的吗？'),
        tx('魔王', 'redKing', '是的。现在如果我们能够合作，那么这场闹剧就结束了。现在让我们一起用权杖破坏神圣剑，这样伟大的时代就要降临了。'),
        flagL('剧情_与50层小偷对话', True),
    ],
    'mt50win': [
        tx('', '', '祝贺你顺利过关！'),
        ifL(cond_flag('剧情_TE'), L(
            tx('', '', '真结局（TE）：你识破了一切，封印了假魔王，也战胜了失去一成功力的真魔王。魔塔的黑暗彻底消散。')),
            L(tx('', '', '普通结局（NE）：你战胜了魔王，魔塔的黑暗彻底消散。'))),
        {'t': 'win'},
    ],
}

# ---------------------------------------------------------------
# MT19 十字架（原版藏在十字形墙中央的暗墙后；bump 两层暗墙取得）
# ---------------------------------------------------------------
for F in floors:
    if F['id'] == 'MT19':
        F['map'][3][6] = 3   # fakeWall2 (保持)
        F['map'][4][6] = 3   # fakeWall (保持)
        # 撞开外层(6,4)后，再撞(6,3)取得十字架
        F['step']['6,3'] = L(
            openL((6, 3)), setL(55, (6, 3)), tipL('暗墙后藏着什么……'))

data = {
    'meta': {
        'title': '魔塔50层',
        'startFloor': 'MT1', 'startLoc': [6, 11],
        'hero': {'hp': 1000, 'atk': 100, 'def': 100, 'money': 0,
                 'yellowKey': 0, 'blueKey': 0, 'redKey': 0},
        'resetAfterIntro': {'hp': 400, 'atk': 10, 'def': 10},
    },
    'tiles': {str(k): v for k, v in sorted(TILES.items())},
    'monsters': monsters,
    'items': items,
    'tileItem': {str(k): v for k, v in TILE_ITEM.items()},
    'oldmanHints': {str(k): v for k, v in OLDMAN_HINTS.items()},
    'traders': {str(k): v for k, v in TRADERS.items()},
    'shrines': SHRINES,
    'cutscenes': CUTSCENES,
    'icons': ICONS,
    'floors': floors,
}

out = os.path.join(ROOT, 'mota-data.js')
with open(out, 'w', encoding='utf-8') as f:
    f.write('/* 魔塔50层 —— 原版数据（由 tools/build_data.py 从 h5mota 官方原版复刻数据生成，请勿手改） */\n')
    f.write('window.MOTA_DATA = ')
    f.write(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    f.write(';\n')
print(f'written {out} ({os.path.getsize(out)} bytes)')
print('unhandled events:', len(unhandled))
for u in unhandled:
    print('  ', u)
