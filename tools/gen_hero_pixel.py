#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
火影角色像素外形重绘器 —— 从零绘制（非换色）
每个角色拥有专属：发型轮廓、服装版型、特征配饰；四方向 × 四帧。
行走动画为"火影跑"：侧面身体前倾、双臂后摆；正面/背面双臂收于背后、大步幅。
帧布局与游戏一致：row0下 row1左 row2右(左镜像) row3上；col0站立 col1/3跑步 col2站立。
输出 assets/img-hd/hero_<id>.png（32px 格 → HD×3）
"""
import os, importlib.util
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'img-hd')

spec = importlib.util.spec_from_file_location(
    'gen_art', os.path.join(ROOT, 'tools', 'gen_art.py'))
GA = importlib.util.module_from_spec(spec)
spec.loader.exec_module(GA)

# ---------------- 像素画布助手 ----------------
class Px:
    def __init__(self):
        self.im = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
    def P(self, x, y, c): self.d.point((x, y), fill=tuple(c) + (255,))
    def R(self, x0, y0, x1, y1, c): self.d.rectangle([x0, y0, x1, y1], fill=tuple(c) + (255,))
    def E(self, x0, y0, x1, y1, c): self.d.ellipse([x0, y0, x1, y1], fill=tuple(c) + (255,))

def dk(c, k=0.72): return tuple(max(0, int(v * k)) for v in c)
def lt(c, k=1.25): return tuple(min(255, int(v * k)) for v in c)

# ---------------- 各角色定义 ----------------
# pal: skin/hair/hairD(发暗)/outfit/outD/outL/pants/shoe/eye
CH = {
 'naruto': dict(
    skin=(252, 218, 182), hair=(246, 212, 88), hairD=(198, 162, 46),
    outfit=(236, 140, 42), outD=(190, 100, 24), outL=(250, 176, 88),
    pants=(226, 132, 38), shoe=(44, 64, 124), eye=(40, 44, 70),
    band=(38, 44, 66), plate=(202, 206, 220)),
 'sasuke': dict(
    skin=(250, 216, 180), hair=(34, 40, 68), hairD=(22, 26, 48),
    outfit=(66, 88, 164), outD=(46, 62, 122), outL=(96, 122, 198),
    pants=(228, 228, 232), shoe=(48, 52, 70), eye=(30, 34, 56),
    band=(38, 44, 66), plate=(202, 206, 220)),
 'kakashi': dict(
    skin=(246, 212, 182), hair=(202, 208, 218), hairD=(150, 156, 170),
    outfit=(88, 122, 76), outD=(60, 88, 52), outL=(118, 156, 102),
    pants=(52, 64, 110), shoe=(38, 42, 60), eye=(34, 38, 58),
    mask=(40, 48, 84), band=(38, 44, 66), plate=(202, 206, 220)),
 'lee': dict(
    skin=(248, 212, 176), hair=(32, 32, 40), hairD=(20, 20, 26),
    outfit=(64, 134, 72), outD=(44, 98, 52), outL=(96, 170, 104),
    pants=(64, 134, 72), shoe=(38, 42, 56), eye=(30, 32, 40),
    warmer=(228, 120, 42)),
 'gaara': dict(
    skin=(250, 220, 190), hair=(208, 120, 60), hairD=(160, 84, 38),
    outfit=(150, 56, 46), outD=(110, 38, 32), outL=(184, 82, 66),
    pants=(120, 78, 60), shoe=(60, 44, 40), eye=(52, 120, 150),
    collar=(212, 196, 168), mark=(196, 44, 44)),
 'hinata': dict(
    skin=(250, 222, 194), hair=(52, 62, 116), hairD=(36, 44, 88),
    outfit=(206, 200, 226), outD=(168, 158, 198), outL=(228, 224, 244),
    pants=(74, 78, 128), shoe=(48, 52, 88), eye=(150, 150, 208),
    collar=(240, 238, 248)),
}

# ---------------- 基础身体（火影跑） ----------------
def body_down(p, s, run=0):
    """正面：run=0站立 1/3跑（双臂后摆不可见→省略手臂，大步幅）"""
    # 头
    p.R(10, 4, 21, 13, s['skin'])
    # 眼（雏田淡紫大眼；李大圆眼）
    ec = s['eye']
    if s is CH['hinata']:
        p.R(12, 9, 14, 11, ec); p.R(17, 9, 19, 11, ec)
        p.P(13, 10, (255, 255, 255)); p.P(18, 10, (255, 255, 255))
    elif s is CH['lee']:
        p.R(12, 9, 14, 12, ec); p.R(17, 9, 19, 12, ec)
        p.P(13, 10, (255, 255, 255)); p.P(18, 10, (255, 255, 255))
        p.R(12, 8, 14, 8, ec); p.R(17, 8, 19, 8, ec)  # 粗眉
    else:
        p.R(12, 10, 13, 10, ec); p.R(18, 10, 19, 10, ec)
    if s is CH['kakashi']:
        p.R(10, 12, 21, 14, s['mask'])          # 面罩
        p.R(15, 10, 16, 10, ec)                 # 单眼（护额遮左眼由头发画）
    # 躯干（服装）
    p.R(11, 14, 20, 21, s['outfit'])
    p.R(11, 14, 20, 15, s['outL'])              # 领口高光
    if s is CH['naruto']:
        p.R(15, 14, 16, 21, s['outD'])          # 拉链
        p.R(11, 18, 20, 19, s['outD'])          # 横纹
        p.R(9, 14, 11, 18, s['outfit']); p.R(20, 14, 22, 18, s['outfit'])  # 肩
    if s is CH['kakashi']:
        p.R(10, 14, 21, 20, s['outfit'])        # 防弹背心
        p.R(10, 14, 21, 15, s['outD'])
        p.R(13, 16, 14, 19, s['outD']); p.R(17, 16, 18, 19, s['outD'])  # 口袋
        p.R(11, 21, 20, 22, s['pants'])
    if s is CH['gaara']:
        p.R(11, 14, 20, 15, s['collar'])        # 高领
        p.R(11, 16, 20, 17, s['outD'])
    if s is CH['hinata']:
        p.R(11, 14, 20, 15, s['collar'])        # 白领
        p.R(15, 15, 16, 21, s['outD'])          # 衣缝
    if s is CH['sasuke']:
        p.R(15, 14, 16, 21, s['outD'])          # 衣襟
        p.R(9, 14, 11, 18, s['outfit']); p.R(20, 14, 22, 18, s['outfit'])
    # 腿（站立并拢 / 跑步大步）
    if run == 0:
        p.R(11, 22, 14, 28, s['pants']); p.R(17, 22, 20, 28, s['pants'])
        p.R(11, 28, 14, 29, s['shoe']); p.R(17, 28, 20, 29, s['shoe'])
        # 手臂自然下垂
        p.R(8, 15, 10, 20, s['outfit']); p.R(21, 15, 23, 20, s['outfit'])
        p.R(8, 20, 10, 22, s['skin']); p.R(21, 20, 23, 22, s['skin'])
    else:
        lift = 3
        p.R(11, 22, 14, 28 - (lift if run == 1 else 0), s['pants'])
        p.R(17, 22, 20, 28 - (lift if run == 3 else 0), s['pants'])
        p.R(11, 28 - (lift if run == 1 else 0), 14, 29 - (lift if run == 1 else 0), s['shoe'])
        p.R(17, 28 - (lift if run == 3 else 0), 20, 29 - (lift if run == 3 else 0), s['shoe'])

def body_up(p, s, run=0):
    """背面：头发覆盖整头，无脸"""
    body_down(p, s, run)
    # 覆盖脸为头发底色由各角色 hair_back 处理；这里先把眼睛擦掉
    p.R(10, 8, 21, 13, s['hairD'])

def body_side(p, s, run=0, lean=0):
    """侧面（朝左）；lean: 跑步时头/躯干前倾像素"""
    hx = 8 - lean          # 头前移
    p.R(hx + 1, 4, hx + 12, 13, s['skin'])       # 头 12宽
    if s is CH['kakashi']:
        p.R(hx + 1, 11, hx + 12, 14, s['mask'])
        p.R(hx + 4, 9, hx + 6, 10, s['eye'])     # 单眼
    elif s is CH['lee']:
        p.R(hx + 2, 9, hx + 5, 12, s['eye'])
        p.R(hx + 2, 8, hx + 5, 8, (20, 20, 26))
    elif s is CH['hinata']:
        p.R(hx + 2, 9, hx + 4, 11, s['eye'])
    else:
        p.R(hx + 3, 10, hx + 4, 10, s['eye'])
    # 躯干
    p.R(hx + 2, 14, hx + 12, 21, s['outfit'])
    p.R(hx + 2, 14, hx + 12, 15, s['outL'])
    if s is CH['kakashi']:
        p.R(hx + 2, 16, hx + 8, 19, s['outD'])
    if s is CH['naruto'] or s is CH['sasuke']:
        p.R(hx + 7, 14, hx + 8, 21, s['outD'])
    if s is CH['gaara']:
        p.R(hx + 2, 14, hx + 12, 15, s['collar'])
    if s is CH['hinata']:
        p.R(hx + 2, 14, hx + 12, 15, s['collar'])
    if run == 0:
        # 站立：垂臂
        p.R(hx + 9, 15, hx + 11, 20, s['outfit'])
        p.R(hx + 9, 20, hx + 11, 22, s['skin'])
        p.R(hx + 3, 22, hx + 6, 28, s['pants'])
        p.R(hx + 7, 22, hx + 10, 28, s['pants'])
        p.R(hx + 2, 28, hx + 6, 29, s['shoe'])
        p.R(hx + 7, 28, hx + 11, 29, s['shoe'])
    else:
        # 火影跑：双臂后摆（一条后摆臂）+ 大步幅
        ax = hx + 11
        p.R(ax, 13, ax + 4, 15, s['outfit'])          # 后摆臂（向后上）
        p.R(ax + 4, 12, ax + 6, 14, s['skin'])        # 手
        if run == 1:
            p.R(hx - 1, 22, hx + 5, 26, s['pants'])   # 前腿伸出
            p.R(hx - 3, 26, hx + 1, 28, s['pants'])
            p.R(hx - 4, 27, hx, 29, s['shoe'])
            p.R(hx + 7, 22, hx + 10, 25, s['pants'])  # 后腿折叠
            p.R(hx + 10, 24, hx + 12, 26, s['shoe'])
        else:
            p.R(hx + 6, 22, hx + 12, 26, s['pants'])  # 前腿(另一相)
            p.R(hx + 12, 25, hx + 14, 27, s['pants'])
            p.R(hx + 12, 26, hx + 15, 28, s['shoe'])
            p.R(hx, 22, hx + 4, 25, s['pants'])
            p.R(hx - 2, 24, hx + 1, 26, s['shoe'])

def mirror(im):
    return im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

# ---------------- 头发与配饰 ----------------
def hair_naruto(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:   # 下
        p.R(9, 2, 22, 8, b)
        p.R(9, 8, 22, 9, hd)
        for sx in range(10, 22, 3):              # 锯齿刘海
            p.P(sx, 9, hd); p.P(sx + 1, 10, b)
        for sx in (9, 12, 15, 18, 21):           # 顶部尖刺
            p.R(sx, 1, sx + 1, 2, b); p.P(sx, 0, b)
        headband(p, 0, s, y=3)
    elif dr == 3: # 上（背面）
        p.R(9, 2, 22, 9, b)
        p.R(9, 8, 22, 12, hd)
        for sx in (9, 12, 15, 18, 21):
            p.R(sx, 0, sx + 1, 2, b)
    else:         # 侧面（画布朝左）
        lean = 2
        x0 = 8 - lean + 1
        p.R(x0 - 1, 2, x0 + 12, 8, b)
        p.R(x0 + 6, 8, x0 + 12, 13, hd)          # 后脑发
        p.R(x0 - 1, 8, x0 + 4, 9, b)             # 前刘海
        p.P(x0 - 1, 9, hd)
        for sx in (x0 + 1, x0 + 5, x0 + 9):
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 1, s, y=3, lean=lean)

def hair_sasuke(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:
        p.R(9, 2, 22, 8, b)
        p.R(9, 5, 10, 13, b); p.R(21, 5, 22, 13, b)   # 两颊鬓发
        p.R(11, 8, 20, 8, b)
        for sx in (10, 14, 18, 21):                    # 后仰尖刺
            p.R(sx, 1, sx + 1, 2, b)
        headband(p, 0, s, y=3)
    elif dr == 3:
        p.R(9, 2, 22, 8, b)
        p.R(9, 8, 22, 12, hd)
        for sx in (9, 13, 17, 21):                     # 背面鸭屁翘发
            p.R(sx, 0, sx + 1, 3, b)
        p.R(8, 4, 9, 10, b); p.R(22, 4, 23, 10, b)
    else:
        lean = 2
        x0 = 8 - lean + 1
        p.R(x0 - 1, 2, x0 + 12, 8, b)
        p.R(x0 - 1, 3, x0 + 3, 10, b)                  # 前刘海垂下
        p.R(x0 + 7, 8, x0 + 12, 12, hd)                # 后脑
        for sx in (x0 + 4, x0 + 8, x0 + 11):
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 1, s, y=3, lean=lean)

def hair_kakashi(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:
        p.R(9, 2, 22, 7, b)
        p.R(9, 6, 12, 9, b)                # 斜刘海遮左眼
        p.R(9, 6, 12, 7, b)
        for sx in (10, 14, 18, 21):
            p.R(sx, 0, sx + 1, 2, b)
        p.P(11, 8, b); p.P(12, 9, b)
    elif dr == 3:
        p.R(9, 2, 22, 8, b)
        p.R(9, 8, 22, 11, hd)
        for sx in (9, 12, 16, 20):
            p.R(sx, 0, sx + 1, 3, b)
    else:
        lean = 2
        x0 = 8 - lean + 1
        p.R(x0 - 1, 2, x0 + 12, 7, b)
        p.R(x0 + 5, 7, x0 + 12, 11, hd)     # 后脑银发
        p.R(x0 - 1, 6, x0 + 6, 8, b)        # 前斜刘海（遮眼上方）
        for sx in (x0 - 1, x0 + 3, x0 + 7, x0 + 10):
            p.R(sx, 0, sx + 1, 2, b)
    # 护额斜戴（侧/正都画在额上）
    if dr == 0:
        headband(p, 0, s, y=4, slant=True)
    elif dr in (1, 2):
        headband(p, 1, s, y=4, lean=2, slant=True)

def hair_lee(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:
        p.E(8, 0, 23, 10, b)
        p.R(8, 6, 23, 8, b)
        for sx in range(9, 23, 2):
            p.P(sx, 9, hd)                   # 齐眉锅盖边
        p.R(9, 7, 22, 8, b)
    elif dr == 3:
        p.E(8, 0, 23, 9, b)
        p.R(9, 8, 22, 11, hd)
    else:
        lean = 2
        x0 = 8 - lean + 1
        p.E(x0 - 1, 0, x0 + 11, 9, b)
        p.R(x0 - 1, 6, x0 + 11, 8, b)
    # 橙色护腿（仅李）
    if dr == 0:
        if run == 0:
            pass  # 腿已画，叠加护腿
        p.R(11, 24, 14, 27, s['warmer']); p.R(17, 24, 20, 27, s['warmer'])
    elif dr == 3:
        p.R(11, 24, 14, 27, s['warmer']); p.R(17, 24, 20, 27, s['warmer'])
    else:
        lean = 2
        x0 = 8 - lean + 1
        if run == 0:
            p.R(x0 + 2, 24, x0 + 5, 27, s['warmer']); p.R(x0 + 6, 24, x0 + 9, 27, s['warmer'])
        else:
            p.R(x0 - 2, 25, x0 + 2, 28, s['warmer']); p.R(x0 + 7, 24, x0 + 11, 27, s['warmer'])

def hair_gaara(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:
        p.R(9, 2, 22, 7, b)
        p.R(9, 7, 22, 8, hd)
        p.R(10, 8, 12, 9, b); p.R(19, 8, 21, 9, b)   # 短鬓
        p.R(9, 3, 10, 6, b); p.R(21, 3, 22, 6, b)    # 两侧尖
        # 爱之额印（左额）
        p.R(11, 6, 13, 8, s['mark'])
        p.P(12, 7, s['mark'])
    elif dr == 3:
        p.R(9, 2, 22, 8, b)
        p.R(9, 8, 22, 11, hd)
        p.R(9, 3, 10, 6, b); p.R(21, 3, 22, 6, b)
    else:
        lean = 2
        x0 = 8 - lean + 1
        p.R(x0 - 1, 2, x0 + 12, 7, b)
        p.R(x0 + 6, 7, x0 + 12, 11, hd)
        p.R(x0 - 1, 7, x0 + 5, 8, hd)
        p.R(x0 + 1, 5, x0 + 3, 7, s['mark'])          # 额印（侧面在太阳穴）

def hair_hinata(p, s, dr, run=0):
    b, hd = s['hair'], s['hairD']
    if dr == 0:
        p.R(9, 2, 22, 7, b)
        p.R(9, 7, 22, 8, b)                  # 齐刘海
        p.R(8, 3, 10, 16, b)                 # 两侧姬发长鬓
        p.R(21, 3, 23, 16, b)
        p.R(8, 14, 10, 17, hd); p.R(21, 14, 23, 17, hd)
    elif dr == 3:
        p.R(9, 2, 22, 8, b)
        p.R(8, 4, 10, 17, b); p.R(21, 4, 23, 17, b)   # 背面长鬓
        p.R(8, 15, 10, 18, hd); p.R(21, 15, 23, 18, hd)
    else:
        lean = 2
        x0 = 8 - lean + 1
        p.R(x0 - 1, 2, x0 + 12, 7, b)
        p.R(x0 - 1, 7, x0 + 2, 8, b)         # 前额齐刘海（不遮脸）
        p.R(x0 + 7, 7, x0 + 12, 16, b)       # 后发长垂
        p.R(x0 + 7, 14, x0 + 12, 17, hd)

def headband(p, dr, s, y=3, lean=0, slant=False):
    bnd, plate = s['band'], s['plate']
    if dr == 0:
        p.R(9, y, 22, y + 2, bnd)
        p.R(14, y - 1, 18, y + 3, plate)
        p.R(15, y, 17, y + 2, (150, 154, 168))
    else:
        x0 = 8 - lean + 1
        p.R(x0 - 1, y, x0 + 12, y + 2, bnd)
        px0 = x0 - 1 if slant else x0 + 1
        p.R(px0, y - 1, px0 + 5, y + 3, plate)
        p.R(px0 + 1, y, px0 + 4, y + 2, (150, 154, 168))

HAIR = {'naruto': hair_naruto, 'sasuke': hair_sasuke, 'kakashi': hair_kakashi,
        'lee': hair_lee, 'gaara': hair_gaara, 'hinata': hair_hinata}

# ---------------- 组装 ----------------
def build(sid):
    s = CH[sid]
    sheet = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    for row in range(4):          # 0下 1左 2右 3上
        for col in range(4):      # 0站 1跑A 2站 3跑B
            p = Px()
            run = 0 if col in (0, 2) else col
            if row == 0:
                body_down(p, s, run); HAIR[sid](p, s, 0, run)
                if sid == 'gaara' and run == 0:
                    pass
            elif row == 3:
                body_up(p, s, run); HAIR[sid](p, s, 3, run)
                if sid == 'lee':
                    p.R(11, 24, 14, 27, s['warmer']); p.R(17, 24, 20, 27, s['warmer'])
                if sid == 'hinata':
                    # 背面长鬓已由头发处理
                    pass
            else:
                body_side(p, s, run, lean=2 if run else 0)
                HAIR[sid](p, s, 1, run)
                if sid == 'gaara':
                    pass
            cell = p.im if row in (0, 3) else (p.im if row == 1 else mirror(p.im))
            sheet.paste(cell, (col * 32, row * 32))
    return sheet

def main():
    preview = Image.new('RGBA', (96 * 6, 4 * 100 + 8), (34, 36, 52, 255))
    for i, sid in enumerate(['naruto', 'sasuke', 'kakashi', 'lee', 'gaara', 'hinata']):
        sh = build(sid)
        hd = Image.new('RGBA', (384, 384), (0, 0, 0, 0))
        for row in range(4):
            for col in range(4):
                cell = sh.crop((col * 32, row * 32, col * 32 + 32, row * 32 + 32))
                hd.paste(GA.enhance_cell(cell, 3), (col * 96, row * 96))
        hd.save(os.path.join(OUT, 'hero_%s.png' % sid), optimize=True)
        print('重绘:', sid, hd.size)
        for r in range(4):
            cell = hd.crop((0, r * 96, 96, r * 96 + 96))
            preview.alpha_composite(cell, (i * 96, r * 100 + 4))
    preview.convert('RGB').save('/tmp/hero_redraw_preview.png')
    print('预览: /tmp/hero_redraw_preview.png')

if __name__ == '__main__':
    main()
