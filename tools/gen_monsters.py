#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
怪物像素重绘器 —— 家族模板 + 专属调色/变体
覆盖地图上实际出场的全部 30 种怪物，从零绘制 32px，HD 增强后覆写 enemys 图集。
家族：史莱姆 / 蝙蝠 / 骷髅 / 骑士 / 法师(僧侣) / 卫兵 / 兽人 / 特殊(幽灵·石魔·剑士·魔王…)
"""
import os, importlib.util, json, re
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'img-hd')
spec = importlib.util.spec_from_file_location(
    'gen_art', os.path.join(ROOT, 'tools', 'gen_art.py'))
GA = importlib.util.module_from_spec(spec)
spec.loader.exec_module(GA)

class Px:
    def __init__(self):
        self.im = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
    def P(self, x, y, c): self.d.point((x, y), fill=tuple(c) + (255,))
    def R(self, x0, y0, x1, y1, c): self.d.rectangle([x0, y0, x1, y1], fill=tuple(c) + (255,))
    def E(self, x0, y0, x1, y1, c): self.d.ellipse([x0, y0, x1, y1], fill=tuple(c) + (255,))
    def poly(self, pts, c): self.d.polygon(pts, fill=tuple(c) + (255,))

def dk(c, k=0.72): return tuple(max(0, int(v * k)) for v in c)
def lt(c, k=1.3): return tuple(min(255, int(v * k)) for v in c)

# ============ 家族模板 ============
def slime(body, crown=False, big=False, silver=False):
    p = Px()
    x0, x1 = (7, 25) if big else (9, 23)
    h1, h2 = (10, 27), (13, 27)
    p.E(x0, h1[0], x1, h1[1], body)
    p.R(x0 + 1, h2[0] - 2, x1 - 1, h2[1], body)             # 底座
    p.R(x0 + 2, 26, x1 - 2, 27, dk(body))
    p.E(x0 + 3, h1[0] + 1, x0 + 8, h1[0] + 4, lt(body))     # 高光
    ey = 16 if big else 17
    p.R(x0 + 4, ey, x0 + 6, ey + 2, (20, 22, 30)); p.R(x1 - 6, ey, x1 - 4, ey + 2, (20, 22, 30))
    p.P(x0 + 4, ey, (255, 255, 255)); p.P(x1 - 6, ey, (255, 255, 255))
    p.R(15, ey + 4, 17, ey + 4, dk(body, 0.55))              # 嘴
    if silver:
        p.R(x0 + 4, ey, x0 + 6, ey + 2, (140, 200, 255)); p.R(x1 - 6, ey, x1 - 4, ey + 2, (140, 200, 255))
    if crown:
        p.R(13, 4, 19, 7, (238, 196, 74))
        p.P(13, 3, (238, 196, 74)); p.P(16, 2, (238, 196, 74)); p.P(19, 3, (238, 196, 74))
        p.P(16, 5, (230, 80, 90))
    return p.im

def bat(body, big=False, glow=False):
    p = Px()
    wy0, wy1 = (8, 15), (17, 24)
    s = 1 if big else 0
    # 双翼
    p.poly([(15, 12), (3 + s, 8 + s), (5 + s, 16), (15, 18)], dk(body, 0.85))
    p.poly([(17, 12), (29 - s, 8 + s), (27 - s, 16), (17, 18)], dk(body, 0.85))
    p.R(4 + s, 15, 6 + s, 16, dk(body, 0.6)); p.R(8 + s, 16, 10 + s, 17, dk(body, 0.6))
    p.R(26 - s, 15, 28 - s, 16, dk(body, 0.6)); p.R(22 - s, 16, 24 - s, 17, dk(body, 0.6))
    # 身体
    p.E(12, 11, 20, 20, body)
    p.E(13, 12, 16, 15, lt(body))
    # 耳
    p.poly([(12, 12), (14, 12), (12, 7)], body); p.poly([(18, 12), (20, 12), (20, 7)], body)
    # 眼（红/亮）
    ec = (255, 120, 90) if glow else (255, 220, 90)
    p.R(13, 14, 14, 15, ec); p.R(18, 14, 19, 15, ec)
    # 獠牙
    p.P(14, 18, (255, 255, 255)); p.P(18, 18, (255, 255, 255))
    return p.im

def skeleton(helmet=False, horn=False, sword=0, shield=False, ghost=False, priest=False):
    p = Px()
    bone = (226, 226, 224) if not ghost else (168, 190, 232)
    bd = dk(bone, 0.78)
    # 头骨
    p.E(11, 3, 21, 12, bone)
    p.R(13, 8, 15, 9, (24, 24, 32)); p.R(17, 8, 19, 9, (24, 24, 32))
    if ghost:
        p.R(13, 8, 15, 9, (90, 60, 200)); p.R(17, 8, 19, 9, (90, 60, 200))
    p.R(14, 11, 18, 12, bd)                                   # 牙缝
    # 脊柱与肋
    p.R(15, 12, 17, 21, bone)
    p.R(11, 14, 21, 15, bone); p.R(12, 17, 20, 18, bone); p.R(12, 20, 20, 21, bone)
    # 盆骨与腿
    p.R(12, 21, 20, 23, bone)
    p.R(12, 23, 14, 28, bd); p.R(18, 23, 20, 28, bd)
    p.R(11, 28, 14, 29, bd); p.R(18, 28, 21, 29, bd)
    # 臂
    p.R(8, 14, 10, 20, bone); p.R(22, 14, 24, 20, bone)
    if helmet:
        p.R(10, 1, 22, 6, (150, 154, 168)); p.R(10, 6, 22, 7, (110, 114, 128))
        p.R(13, 3, 19, 5, (90, 94, 108))                      # 面甲缝
        if horn:
            p.poly([(9, 3), (11, 1), (11, 5)], (226, 222, 210))
            p.poly([(23, 3), (21, 1), (21, 5)], (226, 222, 210))
    if priest:  # 骷髅法师：兜帽+法杖
        p.poly([(9, 1), (23, 1), (21, 12), (11, 12)], (60, 70, 110))
        p.R(12, 6, 15, 8, (140, 220, 255)); p.R(17, 6, 20, 8, (140, 220, 255))
        p.R(26, 6, 27, 28, (110, 80, 50)); p.E(24, 2, 29, 8, (140, 220, 255))
    if sword:   # 佩剑
        if sword == 2:  # 大剑
            p.R(23, 6, 25, 20, (210, 214, 224)); p.R(22, 20, 26, 21, (150, 130, 70))
            p.R(23, 21, 25, 25, (120, 90, 50))
        else:
            p.R(23, 12, 24, 22, (210, 214, 224)); p.R(22, 22, 25, 23, (150, 130, 70))
    if shield:
        p.R(5, 13, 10, 21, (130, 100, 60)); p.R(6, 14, 9, 20, (160, 126, 74))
        p.P(7, 16, (230, 210, 150)); p.P(8, 18, (230, 210, 150))
    return p.im

def knight(armor, plume=None, big_sword=False, dark=False):
    p = Px()
    ad, al = dk(armor, 0.7), lt(armor, 1.22)
    # 盔：圆盔+面缝
    p.E(10, 1, 22, 11, armor)
    p.R(10, 7, 22, 9, (20, 22, 30))
    p.R(11, 8, 12, 8, (255, 120, 90)); p.R(20, 8, 21, 8, (255, 120, 90))  # 目缝红光
    if plume:
        p.R(14, 0, 18, 2, plume); p.R(15, 2, 17, 4, plume)
    else:
        p.R(14, 0, 18, 2, ad)
    # 肩甲
    p.E(6, 11, 11, 16, al); p.E(21, 11, 26, 16, al)
    # 胸甲
    p.R(10, 12, 22, 22, armor)
    p.R(10, 12, 22, 13, al)
    p.R(15, 14, 17, 20, ad)                                   # 中缝
    p.R(12, 19, 20, 20, dk(armor, 0.55))                      # 腰
    p.P(13, 15, (235, 238, 246))
    # 腿甲
    p.R(11, 22, 15, 28, ad); p.R(17, 22, 21, 28, ad)
    p.R(10, 28, 15, 29, dk(armor, 0.5)); p.R(17, 28, 22, 29, dk(armor, 0.5))
    # 武器
    if big_sword:
        p.R(25, 4, 27, 22, (216, 220, 230)); p.R(24, 22, 28, 23, (170, 140, 70))
        p.R(25, 23, 27, 27, (110, 90, 55))
    else:
        p.R(25, 10, 26, 24, (216, 220, 230)); p.R(24, 24, 27, 25, (170, 140, 70))
        p.R(4, 12, 7, 26, (200, 120, 60))                     # 盾
        p.R(4, 12, 7, 13, dk((200, 120, 60)))
    if dark:
        p.R(11, 8, 12, 8, (255, 60, 60)); p.R(20, 8, 21, 8, (255, 60, 60))
    return p.im

def mage(robe, hat=True, orb=(255, 220, 120), priest=False):
    p = Px()
    rd = dk(robe, 0.72)
    # 尖帽
    if hat:
        p.poly([(10, 8), (22, 8), (17, 0)], robe)
        p.R(9, 7, 23, 9, rd)
        p.P(17, 1, orb)
    else:  # 僧侣：头巾
        p.poly([(10, 4), (22, 4), (21, 12), (11, 12)], robe)
        p.R(12, 7, 14, 9, (24, 24, 32)); p.R(18, 7, 20, 9, (24, 24, 32))
    # 脸（戴帽时露出）
    if hat:
        p.R(12, 9, 20, 15, SKIN := (248, 214, 180))
        p.R(13, 11, 14, 12, (26, 26, 36)); p.R(18, 11, 19, 12, (26, 26, 36))
        p.R(16, 8, 16, 13, (210, 180, 150))                   # 鼻侧影
    # 长袍
    p.poly([(11, 14), (21, 14), (25, 29), (7, 29)], robe)
    p.poly([(11, 14), (15, 14), (11, 29), (7, 29)], rd)
    p.R(9, 27, 24, 29, rd)
    p.R(14, 17, 18, 18, orb)                                  # 胸饰
    # 法杖
    p.R(25, 5, 26, 28, (120, 88, 52))
    p.E(23, 1, 29, 7, orb)
    p.P(25, 3, (255, 255, 255))
    return p.im

def guard(armor):
    p = Px()
    ad, al = dk(armor, 0.72), lt(armor, 1.2)
    p.E(11, 2, 21, 10, armor)                                 # 头盔
    p.R(12, 5, 20, 7, (18, 20, 28))                           # 目缝
    p.R(14, 0, 18, 3, ad)                                     # 盔顶
    p.R(11, 10, 21, 21, armor)                                # 胸甲
    p.R(11, 10, 21, 11, al)
    p.R(15, 12, 17, 19, ad)
    p.R(7, 11, 11, 16, al); p.R(21, 11, 25, 16, al)           # 肩甲
    p.R(11, 22, 15, 28, ad); p.R(17, 22, 21, 28, ad)
    p.R(10, 28, 15, 29, dk(armor, 0.5)); p.R(17, 28, 22, 29, dk(armor, 0.5))
    # 长矛
    p.R(27, 2, 28, 28, (140, 100, 56))
    p.poly([(25, 0), (31 - 1, 0), (27, 6)], (222, 226, 236))
    return p.im

def orc(armor=False):
    p = Px()
    skin = (124, 168, 84); sd = dk(skin, 0.72)
    # 头
    p.E(11, 3, 21, 12, skin)
    p.R(13, 7, 15, 9, (230, 60, 60)); p.R(17, 7, 19, 9, (230, 60, 60))   # 红眼
    p.P(13, 7, (255, 200, 120)); p.P(19, 7, (255, 200, 120))
    p.R(12, 11, 20, 12, (96, 128, 62))                    # 嘴
    p.P(13, 11, (250, 244, 220)); p.P(19, 11, (250, 244, 220))           # 獠牙
    # 耳
    p.poly([(10, 6), (12, 5), (10, 9)], skin); p.poly([(22, 6), (20, 5), (22, 9)], skin)
    # 裸上身肌肉
    p.R(10, 13, 22, 22, skin)
    p.R(15, 14, 17, 21, sd)                               # 腹肌
    p.R(10, 13, 22, 14, lt(skin, 1.15))
    # 臂（粗）
    p.R(6, 14, 10, 21, skin); p.R(22, 14, 26, 21, skin)
    p.E(5, 20, 10, 24, sd); p.E(22, 20, 27, 24, sd)       # 拳
    if armor:
        p.R(10, 13, 22, 19, (110, 116, 132)); p.R(10, 13, 22, 14, (140, 146, 160))
        p.R(14, 15, 18, 18, (84, 90, 104))
        p.R(25, 8, 26, 24, (210, 214, 224)); p.R(24, 24, 27, 25, (150, 130, 70))  # 斧柄→剑
    # 腿（兽皮裤）
    p.R(11, 22, 15, 28, (110, 84, 54)); p.R(17, 22, 21, 28, (110, 84, 54))
    p.R(10, 28, 15, 29, (86, 64, 40)); p.R(17, 28, 22, 29, (86, 64, 40))
    return p.im

def golem(tint=(128, 132, 142)):
    p = Px()
    t, td, tl = tint, dk(tint, 0.7), lt(tint, 1.25)
    p.R(8, 4, 24, 13, t)                                  # 头（方块）
    p.R(11, 7, 14, 9, (255, 140, 60)); p.R(18, 7, 21, 9, (255, 140, 60))  # 发光眼
    p.R(9, 4, 24, 5, tl)
    p.R(6, 13, 26, 23, t)                                 # 巨躯
    p.R(6, 13, 26, 14, tl)
    p.R(13, 16, 19, 22, td)                               # 核心裂纹
    p.P(15, 17, (255, 140, 60)); p.P(17, 19, (255, 140, 60))
    p.R(3, 14, 7, 22, td); p.R(25, 14, 29, 22, td)        # 岩臂
    p.R(10, 23, 15, 29, td); p.R(17, 23, 22, 29, td)
    p.R(9, 29, 15, 30, td); p.R(17, 29, 23, 30, td)
    return p.im

def ghost(tint):
    p = Px()
    td = dk(tint, 0.75)
    p.E(9, 4, 23, 16, tint)                               # 头
    p.R(9, 14, 23, 22, tint)                              # 身
    # 波浪下摆
    for i, x in enumerate(range(9, 22, 4)):
        p.poly([(x, 22), (x + 4, 22), (x + 2, 26 + (i % 2) * 2)], tint)
    p.E(11, 14, 23, 16, lt(tint, 1.2))
    p.R(12, 9, 14, 12, (30, 32, 48)); p.R(18, 9, 20, 12, (30, 32, 48))
    p.P(13, 10, (255, 255, 255)); p.P(19, 10, (255, 255, 255))
    p.R(14, 14, 18, 14, td)
    return p.im

def swordsman(robe_c=None):
    p = Px()
    skin = (246, 208, 172)
    p.R(12, 3, 20, 11, skin)                              # 头
    p.R(12, 3, 20, 5, (60, 52, 48))                       # 束发
    p.R(11, 4, 12, 8, (60, 52, 48)); p.R(20, 4, 21, 8, (60, 52, 48))
    p.R(13, 7, 14, 8, (40, 36, 44)); p.R(18, 7, 19, 8, (40, 36, 44))
    # 双手巨剑横扛
    p.R(4, 6, 24, 9, (222, 226, 236))
    p.R(4, 6, 24, 7, (245, 248, 252))
    p.R(23, 5, 25, 10, (170, 140, 70)); p.R(26, 4, 29, 11, (150, 120, 60))  # 柄头
    # 武装衣
    p.R(10, 12, 22, 22, robe_c or (150, 60, 56))
    p.R(10, 12, 22, 13, lt(robe_c or (150, 60, 56), 1.2))
    p.R(9, 13, 12, 18, skin); p.R(21, 13, 24, 18, skin)   # 手臂扶柄
    p.R(11, 22, 15, 28, (70, 64, 74)); p.R(17, 22, 21, 28, (70, 64, 74))
    p.R(10, 28, 15, 29, (48, 44, 54)); p.R(17, 28, 22, 29, (48, 44, 54))
    return p.im

def demon_king(body, crown=True, horns=True):
    p = Px()
    bd = dk(body, 0.7)
    # 角
    if horns:
        p.poly([(9, 6), (7, 0), (12, 4)], (230, 224, 210))
        p.poly([(23, 6), (25, 0), (20, 4)], (230, 224, 210))
    # 头（披兜）
    p.E(10, 3, 22, 13, body)
    p.R(12, 7, 14, 9, (255, 60, 50)); p.R(18, 7, 20, 9, (255, 60, 50))   # 红瞳
    p.P(13, 8, (255, 220, 120)); p.P(19, 8, (255, 220, 120))
    if crown:
        p.R(13, 1, 19, 3, (238, 196, 74))
        p.P(13, 0, (238, 196, 74)); p.P(16, -0, (238, 196, 74)); p.P(19, 0, (238, 196, 74))
    # 披风大氅
    p.poly([(9, 13), (23, 13), (27, 30), (5, 30)], body)
    p.poly([(9, 13), (14, 13), (9, 30), (5, 30)], bd)
    p.R(12, 15, 20, 16, bd)
    p.R(13, 18, 19, 20, (238, 196, 74))                   # 金扣
    p.P(16, 19, (230, 80, 90))
    return p.im

def archmage():
    p = Px()
    robe = (86, 60, 150); rd = dk(robe)
    p.poly([(10, 7), (22, 7), (17, -1)], robe)            # 高尖帽
    p.R(9, 6, 23, 8, rd)
    p.P(17, 0, (250, 230, 140))
    p.R(12, 8, 20, 15, (238, 200, 170))                   # 脸
    p.R(13, 10, 14, 11, (150, 60, 220)); p.R(18, 10, 19, 11, (150, 60, 220))  # 紫瞳
    # 长髯
    p.poly([(13, 13), (19, 13), (18, 20), (14, 20)], (232, 232, 238))
    p.poly([(10, 14), (22, 14), (26, 30), (6, 30)], robe)
    p.poly([(10, 14), (15, 14), (10, 30), (6, 30)], rd)
    p.R(14, 18, 18, 20, (250, 230, 140))
    p.R(4, 4, 5, 29, (110, 80, 50))
    p.E(2, 0, 8, 6, (170, 120, 255)); p.P(4, 2, (245, 235, 255))
    return p.im

def vampire():
    p = Px()
    p.R(11, 3, 21, 12, (226, 210, 216))                   # 苍白脸
    p.R(12, 2, 20, 5, (40, 38, 56))                       # 黑发中分
    p.R(11, 3, 13, 9, (40, 38, 56)); p.R(19, 3, 21, 9, (40, 38, 56))
    p.R(13, 7, 14, 8, (220, 50, 50)); p.R(18, 7, 19, 8, (220, 50, 50))   # 红瞳
    p.P(14, 10, (255, 255, 255)); p.P(18, 10, (255, 255, 255))           # 獠牙
    p.R(15, 11, 17, 11, (180, 60, 80))
    # 高领披风
    p.poly([(8, 12), (12, 9), (12, 30), (6, 30)], (60, 30, 50))
    p.poly([(24, 12), (20, 9), (20, 30), (26, 30)], (60, 30, 50))
    p.R(12, 13, 20, 22, (36, 34, 52))                     # 马甲
    p.R(14, 14, 18, 21, (255, 250, 240))                  # 衬衫
    p.R(13, 13, 19, 14, (160, 40, 60))
    p.R(11, 22, 15, 28, (36, 34, 52)); p.R(17, 22, 21, 28, (36, 34, 52))
    p.R(10, 28, 15, 29, (24, 22, 34)); p.R(17, 28, 22, 29, (24, 22, 34))
    return p.im

SKIN = (248, 214, 180)

# ============ 怪物映射 ============
M = {
 'greenSlime': lambda: slime((110, 190, 92)),
 'redSlime': lambda: slime((222, 96, 88)),
 'blackSlime': lambda: slime((96, 84, 130), big=True),
 'slimelord': lambda: slime((96, 190, 110), crown=True, big=True),
 'silverSlime': lambda: slime((196, 204, 216), silver=True),
 'bat': lambda: bat((142, 122, 190)),
 'bigBat': lambda: bat((104, 88, 158), big=True),
 'redBat': lambda: bat((198, 74, 84), big=True),
 'poisonBat': lambda: bat((150, 90, 190), glow=True),
 'evilBat': lambda: bat((150, 52, 60), big=True, glow=True),
 'skeleton': lambda: skeleton(),
 'skeletonSoldier': lambda: skeleton(helmet=True, sword=1),
 'skeletonCaptain': lambda: skeleton(helmet=True, horn=True, sword=2, shield=True),
 'ghostSkeleton': lambda: skeleton(ghost=True, helmet=True, sword=1),
 'skeletonPriest': lambda: skeleton(priest=True),
 'zombie': lambda: orc(),
 'zombieKnight': lambda: orc(armor=True),
 'poisonZombie': lambda: orc(armor=True),
 'rock': lambda: golem((128, 132, 142)),
 'steelRock': lambda: golem((110, 130, 156)),
 'bluePriest': lambda: mage((80, 110, 200), hat=False, orb=(140, 190, 255)),
 'redPriest': lambda: mage((200, 70, 70), hat=False, orb=(255, 150, 120)),
 'brownWizard': lambda: mage((140, 96, 54), orb=(255, 200, 90)),
 'redWizard': lambda: mage((168, 54, 60), orb=(255, 110, 90)),
 'yellowGuard': lambda: guard((196, 168, 74)),
 'blueGuard': lambda: guard((84, 112, 186)),
 'redGuard': lambda: guard((186, 74, 70)),
 'swordsman': lambda: swordsman((150, 60, 56)),
 'redSwordsman': lambda: swordsman((190, 70, 60)),
 'soldier': lambda: swordsman((96, 118, 92)),
 'yellowKnight': lambda: knight((206, 174, 78), plume=(220, 70, 70)),
 'redKnight': lambda: knight((178, 66, 66), plume=(220, 200, 160)),
 'darkKnight': lambda: knight((64, 62, 82), plume=(40, 38, 56), big_sword=True, dark=True),
 'blueKnight': lambda: knight((80, 108, 190), plume=(220, 220, 240)),
 'whiteKing': lambda: knight((216, 218, 228), plume=(120, 190, 255)),
 'slimeMan': lambda: ghost((150, 160, 210)),
 'vampire': lambda: vampire(),
 'blackKing': lambda: demon_king((52, 50, 70), crown=False, horns=False),
 'redKing': lambda: demon_king((150, 44, 52)),
 'blackMagician': lambda: archmage(),
}

if __name__ == '__main__':
    data = open(os.path.join(ROOT, 'mota-data.js'), encoding='utf-8').read()
    m = re.search(r'"enemys":\{.*?\n\s*\}', data, re.S)
    # 直接从 JS 提取索引
    js = '''
const fs=require('fs');global.window={};
eval(fs.readFileSync(process.argv[1],'utf8'));
process.stdout.write(JSON.stringify(window.MOTA_DATA.icons.enemys));
''' 
    import subprocess, sys
    r = subprocess.run(['node', '-e', js, os.path.join(ROOT, 'mota-data.js')],
                       capture_output=True, text=True)
    idx = json.loads(r.stdout)
    atlas = Image.open(os.path.join(OUT, 'enemys.png')).convert('RGBA')
    cell = 96
    rows = 61  # 5856/96
    done = []
    for name, fn in M.items():
        if name not in idx:
            print('跳过(无索引):', name); continue
        i = idx[name]
        col, row = i // rows, i % rows
        im32 = fn()
        hd = GA.enhance_cell(im32, 3)
        atlas.paste(hd, (col * cell, row * cell))
        done.append(name)
    atlas.save(os.path.join(OUT, 'enemys.png'))
    q = atlas.quantize(colors=256, method=Image.FASTOCTREE)
    q.save(os.path.join(OUT, 'enemys.png'), optimize=True)
    print('重绘怪物数:', len(done))
    # 联络表预览（8列）
    import math
    n = len(done)
    cols = 8
    rows_p = math.ceil(n / cols)
    prev = Image.new('RGBA', (cols * 100, rows_p * 100 + 4), (34, 36, 52, 255))
    for k, name in enumerate(done):
        i = idx[name]
        c, r2 = i // rows, i % rows
        cc = atlas.crop((c * cell, r2 * cell, c * cell + cell, r2 * cell + cell))
        prev.alpha_composite(cc, ((k % cols) * 100 + 2, (k // cols) * 100 + 2))
    prev.convert('RGB').save('/tmp/monsters_preview.png')
    print('预览: /tmp/monsters_preview.png')
