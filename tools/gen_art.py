#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
魔塔50层 精修版 —— 美术生成管线
1) HD 增强：原版 32px 素材 → 3 倍分辨率（平滑放大 + 饱和度/对比提升 + 锐化 + 描边 + 顶部受光）
2) 环境精修：地面 / 墙体 / 门 / 楼梯 / 商店水晶 等程序化重绘（96×96）
输出：assets/img-hd/*.png（图集布局与原版一致）+ env.png / env.js
"""
import os, json, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'img')
OUT = os.path.join(ROOT, 'assets', 'img-hd')
os.makedirs(OUT, exist_ok=True)

CELL = 96          # 输出单元格尺寸（原 32 的 3 倍）
CELL48 = 144       # 原 48 的 3 倍
random.seed(20260830)

# ----------------------------------------------------------------
# 通用：单元格 HD 增强
# ----------------------------------------------------------------
def enhance_cell(cell: Image.Image, scale=3) -> Image.Image:
    """平滑放大 + 调色 + 锐化 + 描边 + 顶部受光"""
    w, h = cell.size
    tw, th = w * scale, h * scale
    # 1) 平滑放大（LANCZOS 保色彩过渡，稍后再锐化回来）
    im = cell.resize((tw, th), Image.LANCZOS).convert('RGBA')
    r, g, b, a = im.split()
    # 2) 轻微提饱和、提对比（只作用于 RGB）
    rgb = Image.merge('RGB', (r, g, b))
    rgb = ImageEnhance.Color(rgb).enhance(1.18)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.06)
    r, g, b = rgb.split()
    im = Image.merge('RGBA', (r, g, b, a))
    # 3) 锐化（UNSHARP）
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=68, threshold=2))
    # 4) 描边：alpha 膨胀圈，深色描边让角色从背景中跳出来
    alpha = im.getchannel('A')
    dil = alpha.filter(ImageFilter.MaxFilter(7))          # 向外膨胀 3px
    ring = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ring.putalpha(dil.point(lambda v: 235 if v > 8 else 0))
    draw = ImageDraw.Draw(ring)
    draw.rectangle([0, 0, tw - 1, th - 1], fill=(0, 0, 0, 0))  # 防止贴满边的格子溢出
    # 描边颜色：深蓝黑
    outline_layer = Image.new('RGBA', im.size, (16, 14, 26, 255))
    outline_layer.putalpha(ring.getchannel('A').point(lambda v: min(v, 225)))
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    out.alpha_composite(outline_layer)
    out.alpha_composite(im)
    # 5) 顶部受光 / 底部投影（只在角色像素内）
    light = Image.new('L', im.size, 0)
    ld = ImageDraw.Draw(light)
    for yy in range(th):
        v = max(0, int(52 * (1 - yy / th) ** 1.4))
        ld.line([(0, yy), (tw, yy)], fill=v)
    light.putalpha(Image.composite(light, Image.new('L', im.size, 0), im.getchannel('A')))
    white = Image.new('RGBA', im.size, (255, 246, 224, 255))
    out.paste(white, (0, 0), light)
    return out

def enhance_atlas(name, cell_px, scale=3, grid=None):
    im = Image.open(os.path.join(SRC, name + '.png')).convert('RGBA')
    W, H = im.size
    cols = grid[0] if grid else W // cell_px
    rows = grid[1] if grid else H // cell_px
    out = Image.new('RGBA', (cols * cell_px * scale, rows * cell_px * scale), (0, 0, 0, 0))
    for ry in range(rows):
        for cx in range(cols):
            cell = im.crop((cx * cell_px, ry * cell_px, (cx + 1) * cell_px, (ry + 1) * cell_px))
            out.paste(enhance_cell(cell, scale), (cx * cell_px * scale, ry * cell_px * scale))
    out.save(os.path.join(OUT, name + '.png'))
    print('HD 图集:', name, out.size)

# ----------------------------------------------------------------
# 环境贴图程序化绘制（96×96）
# ----------------------------------------------------------------
E = 96  # env 单元尺寸

def noise_patch(d, x0, y0, w, h, base, amp=8, n=140, seed=1):
    rnd = random.Random(seed)
    for _ in range(n):
        x = x0 + rnd.randrange(w); y = y0 + rnd.randrange(h)
        dv = rnd.randint(-amp, amp)
        c = tuple(max(0, min(255, v + dv)) for v in base)
        d.point((x, y), fill=c + (255,))

def make_ground(variant=0):
    """暗色石板地面：细斑点 + 轻微明暗 + 边缘 AO"""
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    base = (42, 46, 64) if variant % 2 == 0 else (46, 50, 70)
    d.rectangle([0, 0, E, E], fill=base + (255,))
    noise_patch(d, 0, 0, E, E, base, amp=8, n=300, seed=variant * 7 + 1)
    # 大块石板缝（每格一块大石板 + 细描边）
    groove = (32, 35, 50)
    d.line([(0, 0), (E, 0)], fill=groove + (255,), width=2)
    d.line([(0, 0), (0, E)], fill=groove + (255,), width=2)
    # 高光斑点
    rnd = random.Random(variant * 13 + 5)
    for _ in range(30):
        x, y = rnd.randrange(E), rnd.randrange(E)
        d.point((x, y), fill=(74, 80, 108, 255))
    # 边缘 AO
    ao = Image.new('L', (E, E), 0)
    ad = ImageDraw.Draw(ao)
    ad.rectangle([0, 0, E - 1, E - 1], outline=64, width=5)
    ao = ao.filter(ImageFilter.GaussianBlur(5))
    dark = Image.new('RGBA', (E, E), (12, 12, 20, 255))
    im.paste(dark, (0, 0), ao)
    return im

def brick_wall(face, dark, lite, mortar, seed=3, cracks=False):
    """砖墙：错缝砖块 + 凹槽 + 顶部高光"""
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, E, E], fill=mortar + (255,))
    rows = 4
    bh = E // rows
    rnd = random.Random(seed)
    for r in range(rows):
        off = (bh if r % 2 else 0) // 2
        x = -off
        while x < E:
            bw = E // 2 - 4
            x0, y0 = x + 2, r * bh + 2
            x1, y1 = min(x + bw, E) - 2, (r + 1) * bh - 2
            if x1 > x0 and y1 > y0:
                # 每块砖轻微明暗差
                k = rnd.randint(-10, 8)
                fc = tuple(max(0, min(255, v + k)) for v in face)
                d.rectangle([x0, y0, x1, y1], fill=fc + (255,))
                d.line([(x0, y0), (x1, y0)], fill=lite + (255,), width=2)          # 顶高光
                d.line([(x0, y0), (x0, y1)], fill=tuple(min(255, v + 16) for v in lite) + (255,), width=1)
                d.line([(x0, y1), (x1, y1)], fill=dark + (255,), width=2)          # 底阴影
            x += bw
    noise_patch(d, 0, 0, E, E, face, amp=6, n=150, seed=seed)
    if cracks:
        rnd = random.Random(seed + 99)
        for _ in range(3):
            x, y = rnd.randrange(8, E - 8), rnd.randrange(8, E - 8)
            pts = [(x, y)]
            for _ in range(4):
                x += rnd.randint(-9, 9); y += rnd.randint(3, 9)
                pts.append((min(E - 2, max(2, x)), min(E - 2, y)))
            d.line(pts, fill=tuple(max(0, v - 46) for v in face) + (160,), width=1)
    # 外缘 AO
    ao = Image.new('L', (E, E), 0)
    ImageDraw.Draw(ao).rectangle([0, 0, E - 1, E - 1], outline=90, width=4)
    ao = ao.filter(ImageFilter.GaussianBlur(3))
    im.paste(Image.new('RGBA', (E, E), (10, 6, 4, 255)), (0, 0), ao)
    return im

def make_stone_wall():
    """不可破坏墙：大块冷灰岩石"""
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    base, dark, lite, mortar = (86, 92, 106), (56, 60, 72), (120, 128, 144), (44, 47, 58)
    d.rectangle([0, 0, E, E], fill=mortar + (255,))
    cells = [(2, 2, 46, 46), (50, 2, 44, 46), (2, 50, 46, 44), (50, 50, 44, 44)]
    rnd = random.Random(11)
    for (x, y, w, h) in cells:
        k = rnd.randint(-8, 8)
        fc = tuple(max(0, min(255, v + k)) for v in base)
        d.rounded_rectangle([x, y, x + w, y + h], 6, fill=fc + (255,))
        d.rounded_rectangle([x, y, x + w, y + h], 6, outline=lite + (255,), width=2)
        d.line([(x + 2, y + h - 3), (x + w - 2, y + h - 3)], fill=dark + (255,), width=2)
    noise_patch(d, 0, 0, E, E, base, amp=7, n=140, seed=23)
    return im

def make_door(key):
    """彩色魔门：金属框 + 门板 + 发光锁孔。key: yellow/blue/red"""
    pal = {'yellow': ((196, 148, 52), (240, 204, 96), (122, 88, 26)),
           'blue':   ((72, 108, 200), (120, 160, 240), (34, 52, 110)),
           'red':    ((188, 62, 62), (232, 108, 96), (110, 30, 34))}[key]
    main, lite, dark = pal
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # 外框（铁灰）
    d.rounded_rectangle([3, 3, E - 4, E - 4], 10, fill=(58, 58, 70, 255))
    d.rounded_rectangle([3, 3, E - 4, E - 4], 10, outline=(96, 98, 116, 255), width=3)
    d.rounded_rectangle([9, 9, E - 10, E - 10], 8, fill=(40, 40, 50, 255))
    # 门板
    d.rounded_rectangle([14, 12, E - 15, E - 12], 7, fill=main + (255,))
    d.rounded_rectangle([14, 12, E - 15, E - 12], 7, outline=dark + (255,), width=3)
    # 门板竖纹
    for i in range(1, 3):
        x = 14 + (E - 29) * i // 3
        d.line([(x, 16), (x, E - 16)], fill=dark + (200,), width=2)
    # 顶部高光
    d.line([(17, 15), (E - 18, 15)], fill=lite + (255,), width=3)
    # 铆钉
    for (x, y) in [(20, 20), (E - 21, 20), (20, E - 21), (E - 21, E - 21)]:
        d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=lite + (255,))
    # 锁孔（发光）
    cx, cy = E // 2, E // 2 + 4
    glow = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for rr, aa in [(26, 60), (18, 110), (11, 170)]:
        gd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=lite + (aa,))
    glow = glow.filter(ImageFilter.GaussianBlur(6))
    im.alpha_composite(glow)
    d.ellipse([cx - 6, cy - 7, cx + 6, cy + 7], fill=(250, 244, 214, 255))
    d.rectangle([cx - 2, cy - 2, cx + 2, cy + 9], fill=(60, 44, 16, 255))
    d.ellipse([cx - 3, cy - 4, cx + 3, cy + 2], fill=(24, 18, 8, 255))
    return im

def make_stairs(up=True):
    """楼梯：上行(向亮处上升) / 下行(向暗处下降)"""
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([2, 2, E - 3, E - 3], 8, fill=(34, 32, 46, 255))
    d.rounded_rectangle([2, 2, E - 3, E - 3], 8, outline=(70, 66, 92, 255), width=3)
    steps = 5
    top, bottom = 12, E - 12
    band = (bottom - top) / steps
    for i in range(steps):
        t = i / (steps - 1)
        shade = int(218 - 118 * t)
        if up:   # 近处(下)亮，远处(上)暗
            y0 = int(bottom - (i + 1) * band) + 2
            y1 = int(bottom - i * band) - 2
        else:    # 洞口(上)亮，深处(下)暗
            y0 = int(top + i * band) + 2
            y1 = int(top + (i + 1) * band) - 2
        if y1 <= y0 + 1:
            continue
        c = tuple(max(28, min(232, shade + (14 if k == 2 else 0))) for k in range(3))
        d.rounded_rectangle([10, y0, E - 10, y1], 4, fill=c + (255,))
        d.line([(12, y0 + 1), (E - 12, y0 + 1)], fill=(min(240, shade + 42),) * 3 + (255,), width=2)
    # 方向光晕
    glow = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gy = 16 if up else E - 16
    for rr, aa in [(30, 46), (20, 84), (12, 130)]:
        gd.ellipse([E // 2 - rr, gy - rr, E // 2 + rr, gy + rr], fill=(255, 240, 190, aa))
    glow = glow.filter(ImageFilter.GaussianBlur(7))
    im.alpha_composite(glow)
    # 箭头
    ad = ImageDraw.Draw(im)
    ax, ay = E // 2, (26 if up else E - 26)
    col = (255, 240, 200, 235)
    if up:
        ad.polygon([(ax - 13, ay + 9), (ax + 13, ay + 9), (ax, ay - 10)], fill=col)
    else:
        ad.polygon([(ax - 13, ay - 9), (ax + 13, ay - 9), (ax, ay + 10)], fill=col)
    return im

def make_shop(color):
    """商店水晶球祭坛：blue / pink"""
    c_main, c_lite = {'blue': ((84, 130, 235), (170, 205, 255)),
                      'pink': ((222, 120, 190), (255, 190, 235))}[color]
    im = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # 底座
    d.rounded_rectangle([18, 62, E - 18, 88], 8, fill=(70, 64, 88, 255))
    d.rounded_rectangle([18, 62, E - 18, 88], 8, outline=(110, 100, 132, 255), width=2)
    d.polygon([(30, 64), (E - 30, 64), (E - 38, 50), (38, 50)], fill=(88, 80, 108, 255))
    # 光晕
    glow = Image.new('RGBA', (E, E), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for rr, aa in [(34, 50), (24, 96), (15, 160)]:
        gd.ellipse([E // 2 - rr, 30 - rr, E // 2 + rr, 30 + rr], fill=c_main + (aa,))
    glow = glow.filter(ImageFilter.GaussianBlur(7))
    im.alpha_composite(glow)
    # 水晶球
    d.ellipse([E // 2 - 22, 8, E // 2 + 22, 52], fill=c_main + (255,))
    d.ellipse([E // 2 - 22, 8, E // 2 + 22, 52], outline=tuple(min(255, v + 40) for v in c_main) + (255,), width=2)
    d.ellipse([E // 2 - 13, 14, E // 2 - 2, 26], fill=c_lite + (220,))
    # 星光
    d.point([(E // 2 + 12, 18), (E // 2 + 15, 15), (E // 2 + 9, 13)], fill=(255, 255, 255, 255))
    return im

def make_fake_wall():
    """暗墙：与砖墙一致但带细微裂纹（提示与众不同）"""
    return brick_wall((142, 96, 52), (104, 66, 32), (176, 124, 72), (72, 48, 24), seed=8, cracks=True)

# ----------------------------------------------------------------
# 环境图集清单
# ----------------------------------------------------------------
def build_env():
    ENV = {}
    cells = []
    def put(name, im):
        ENV[name] = len(cells)
        cells.append(im)
    for v in range(4):
        put('ground%d' % v, make_ground(v))
    put('yellowWall', brick_wall((158, 106, 56), (118, 74, 36), (198, 142, 84), (84, 56, 28), seed=3))
    put('yellowWall2', brick_wall((150, 100, 52), (112, 70, 34), (190, 134, 78), (80, 54, 26), seed=5))
    put('whiteWall2', brick_wall((168, 168, 178), (128, 128, 140), (208, 208, 218), (92, 92, 104), seed=7))
    put('blueWall2', brick_wall((92, 106, 148), (66, 78, 112), (128, 144, 184), (50, 58, 84), seed=9))
    put('blockWall', make_stone_wall())
    put('grayWall', make_stone_wall())
    put('unbreakableWall', make_stone_wall())
    put('fakeWall', make_fake_wall())
    put('fakeWall2', make_fake_wall())
    put('yellowDoor', make_door('yellow'))
    put('blueDoor', make_door('blue'))
    put('redDoor', make_door('red'))
    put('specialDoor', make_door('yellow'))
    put('steelDoor', make_door('blue'))
    put('upFloor', make_stairs(up=True))
    put('downFloor', make_stairs(up=False))
    put('blueShop-left', make_shop('blue'))
    put('blueShop-right', make_shop('blue'))
    put('pinkShop-left', make_shop('pink'))
    put('pinkShop-right', make_shop('pink'))
    # 拼图集
    n = len(cells)
    cols = 8
    rows = (n + cols - 1) // cols
    atlas = Image.new('RGBA', (cols * E, rows * E), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        atlas.paste(c, ((i % cols) * E, (i // cols) * E))
    atlas.save(os.path.join(OUT, 'env.png'))
    js = '/* 精修环境图集清单（由 tools/gen_art.py 生成） */\nwindow.MOTA_ENV = ' + json.dumps(
        {'cell': E, 'cols': cols, 'index': ENV}, ensure_ascii=False) + ';\n'
    open(os.path.join(OUT, 'env.js'), 'w', encoding='utf-8').write(js)
    print('环境图集 env.png:', atlas.size, '单元格:', len(ENV))

# ----------------------------------------------------------------
if __name__ == '__main__':
    print('== 1) HD 增强原版图集 ==')
    enhance_atlas('enemys', 32)
    enhance_atlas('items', 32)
    enhance_atlas('npcs', 32)
    enhance_atlas('terrains', 32)
    enhance_atlas('animates', 32)
    enhance_atlas('hero', 32)
    enhance_atlas('npc48', 48)
    enhance_atlas('enemy48', 48)
    enhance_atlas('dragon', 96, scale=2)
    print('== 2) 环境精修贴图 ==')
    build_env()
    print('完成 →', OUT)
