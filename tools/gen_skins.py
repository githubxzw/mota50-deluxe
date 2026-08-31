#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
火影系列勇者皮肤生成器
方案：以原版勇者贴图为骨架做分组重着色（盔甲蓝→服装色、棕发→发色），
再叠加火影特征（发型/护额/面罩/护腿），最后走 HD 增强管线（×3 + 描边 + 受光）。
输出：assets/img-hd/hero_<id>.png（布局与 hero.png 一致：4方向 × 4帧，32px 格）
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'img', 'hero.png')
OUT = os.path.join(ROOT, 'assets', 'img-hd')

# ---------- 颜色分组 ----------
def classify(p):
    r, g, b, a = p
    if a == 0:
        return None
    if r > 235 and g > 235 and b > 235:
        return 'white'
    if b > r + 18 and b > 120 and g > 90:          # 盔甲蓝系
        return 'armor'
    if r > g > b and r < 190 and g > 50 and b < 95:  # 头发棕系
        return 'hair'
    if r > 175 and 115 < g < 225 and 85 < b < 200 and r > b + 40:  # 皮肤
        return 'skin'
    if abs(r - g) < 14 and abs(g - b) < 14:        # 中性灰（裤腿等）
        return 'gray'
    return 'other'

def shade(rgb, k):
    return tuple(max(0, min(255, int(v * k))) for v in rgb)

def remap_cell(cell, armor, hair, skin=None, gray=None):
    w, h = cell.size
    out = cell.copy()
    px = out.load()
    for y in range(h):
        for x in range(w):
            p = cell.getpixel((x, y))
            kind = classify(p)
            if kind == 'armor':
                k = 0.72 if (p[0] + p[1] + p[2]) < 480 else (1.18 if (p[0] + p[1] + p[2]) > 590 else 1.0)
                px[x, y] = shade(armor, k) + (255,)
            elif kind == 'hair':
                k = 0.7 if (p[0] + p[1] + p[2]) < 290 else (1.25 if (p[0] + p[1] + p[2]) > 400 else 1.0)
                px[x, y] = shade(hair, k) + (255,)
            elif kind == 'skin' and skin:
                px[x, y] = skin + (255,)
            elif kind == 'gray' and gray:
                k = 1.0 if (p[0] + p[1] + p[2]) > 500 else 0.8
                px[x, y] = shade(gray, k) + (255,)
    return out

# ---------- 特征叠加（dirRow: 0=下 1=左 2=右 3=上；头发 y0-7，脸 y8-13，眼 y10） ----------
def head_band(cell, band=(40, 40, 52), plate=(198, 202, 216)):
    d = ImageDraw.Draw(cell)
    r = cell.__dict__.get('_dir', 0)
    if r in (0, 3):      # 正对/背对：横贯额头
        d.rectangle([9, 5, 23, 7], fill=band + (255,))
        d.rectangle([13, 4, 19, 8], fill=plate + (255,))
        d.rectangle([14, 5, 18, 7], fill=(150, 154, 168, 255))
    else:                # 侧面
        x0, x1 = (7, 21) if r == 1 else (11, 25)
        d.rectangle([x0, 4, x1, 6], fill=band + (255,))
        px0 = (x0 + 1) if r == 1 else (x0 - 1)
        d.rectangle([px0, 3, px0 + 6, 7], fill=plate + (255,))
    return cell

def hair_spiky(cell, col):
    d = ImageDraw.Draw(cell)
    c = col + (255,)
    r = cell.__dict__.get('_dir', 0)
    if r == 0:           # 朝下：刘海三撮垂在额头
        for sx in (11, 15, 19, 22):
            d.polygon([(sx - 2, 6), (sx + 1, 6), (sx - 1, 10)], fill=c)
        d.line([(9, 5), (23, 5)], fill=c, width=2)
    elif r in (1, 2):    # 侧面：脑后两撮翘起
        bx = 18 if r == 1 else 8
        for sx in (bx, bx + 4):
            d.polygon([(sx - 2, 4), (sx + 2, 4), (sx, 1)], fill=c)
    else:                # 背面：头顶锯齿
        for sx in (10, 14, 18, 22):
            d.polygon([(sx - 2, 3), (sx + 2, 3), (sx, 0)], fill=c)
    return cell

def hair_bowl(cell, col):
    d = ImageDraw.Draw(cell)
    c = col + (255,)
    r = cell.__dict__.get('_dir', 0)
    if r in (0, 3):
        d.rectangle([8, 0, 24, 6], fill=c)
        for sx in (9, 13, 17, 21):   # 齐刘海锯齿
            d.polygon([(sx - 2, 6), (sx + 2, 6), (sx, 9)], fill=c)
    else:
        x0, x1 = (7, 20) if r == 1 else (11, 24)
        d.rectangle([x0, 0, x1, 7], fill=c)
        d.polygon([(x0, 6), (x0 + 4, 6), (x0 + 1, 9)], fill=c)
    return cell

def hair_long(cell, col):
    d = ImageDraw.Draw(cell)
    c = col + (255,)
    r = cell.__dict__.get('_dir', 0)
    if r == 0:      # 正面：两侧垂发
        d.rectangle([7, 6, 9, 17], fill=c)
        d.rectangle([23, 6, 25, 17], fill=c)
    elif r == 3:    # 背面：两束长发垂在背后（不遮身体）
        d.rectangle([8, 4, 11, 16], fill=c)
        d.rectangle([21, 4, 24, 16], fill=c)
    else:           # 侧面：脑后一束
        x0 = 22 if r == 1 else 6
        d.rectangle([x0, 4, x0 + 3, 16], fill=c)
    return cell

def face_mask(cell, col=(44, 52, 84)):
    d = ImageDraw.Draw(cell)
    r = cell.__dict__.get('_dir', 0)
    if r == 0:
        d.rectangle([11, 11, 21, 15], fill=col + (255,))
    elif r in (1, 2):
        x0, x1 = (7, 17) if r == 1 else (14, 24)
        d.rectangle([x0, 11, x1, 15], fill=col + (255,))
    return cell

def leg_warmers(cell, col):
    d = ImageDraw.Draw(cell)
    d.rectangle([10, 25, 15, 30], fill=col + (255,))
    d.rectangle([17, 25, 22, 30], fill=col + (255,))
    return cell

def forehead_mark(cell, col=(200, 44, 44)):
    d = ImageDraw.Draw(cell)
    r = cell.__dict__.get('_dir', 0)
    if r == 0:
        d.rectangle([15, 8, 17, 10], fill=col + (255,))
    return cell

# ---------- 皮肤定义 ----------
SKINS = {
    'naruto': {
        'name': '漩涡鸣人',
        'armor': (232, 140, 40), 'hair': (246, 212, 88),
        'decor': lambda c, dr: head_band(hair_spiky(c, (246, 212, 88))),
    },
    'sasuke': {
        'name': '宇智波佐助',
        'armor': (64, 84, 156), 'hair': (38, 44, 74),
        'decor': lambda c, dr: head_band(hair_spiky(c, (38, 44, 74)), band=(30, 34, 56)),
    },
    'kakashi': {
        'name': '旗木卡卡西',
        'armor': (86, 122, 74), 'hair': (198, 206, 216), 'gray': (52, 62, 96),
        'decor': lambda c, dr: head_band(face_mask(c), band=(40, 44, 62)),
    },
    'lee': {
        'name': '洛克·李',
        'armor': (62, 132, 70), 'hair': (34, 34, 42),
        'decor': lambda c, dr: leg_warmers(hair_bowl(c, (34, 34, 42)), (226, 116, 40)),
    },
    'gaara': {
        'name': '我爱罗',
        'armor': (168, 64, 48), 'hair': (214, 170, 96),
        'decor': lambda c, dr: hair_long(forehead_mark(c, (200, 40, 40)), (214, 170, 96)),
    },
    'hinata': {
        'name': '日向雏田',
        'armor': (172, 156, 208), 'hair': (48, 56, 108),
        'decor': lambda c, dr: hair_long(c, (48, 56, 108)),
    },
}

def build_skin(sid, cfg, sheet_src):
    out = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4):
            cell = sheet_src.crop((col * 32, row * 32, col * 32 + 32, row * 32 + 32))
            cell = remap_cell(cell, cfg['armor'], cfg['hair'],
                              cfg.get('skin'), cfg.get('gray'))
            cell.__dict__['_dir'] = row
            cell = cfg['decor'](cell, row)
            out.paste(cell, (col * 32, row * 32))
    # HD 增强（与 gen_art.py 相同管线）
    import importlib.util
    spec = importlib.util.spec_from_file_location('gen_art', os.path.join(ROOT, 'tools', 'gen_art.py'))
    ga = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ga)
    hd = Image.new('RGBA', (384, 384), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4):
            cell = out.crop((col * 32, row * 32, col * 32 + 32, row * 32 + 32))
            hd.paste(ga.enhance_cell(cell, 3), (col * 96, row * 96))
    hd.save(os.path.join(OUT, 'hero_%s.png' % sid), optimize=True)
    print('皮肤:', cfg['name'], '→ hero_%s.png' % sid, hd.size)
    return hd

if __name__ == '__main__':
    sheet = Image.open(SRC).convert('RGBA')
    preview = Image.new('RGBA', (96 * len(SKINS), 120), (34, 36, 52, 255))
    for i, (sid, cfg) in enumerate(SKINS.items()):
        hd = build_skin(sid, cfg, sheet)
        preview.alpha_composite(hd.crop((0, 0, 96, 96)), (i * 96, 12))
    preview.convert('RGB').save('/tmp/skins_preview.png')
    print('预览: /tmp/skins_preview.png')
