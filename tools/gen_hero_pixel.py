#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
勇者 + 火影系列皮肤 像素精绘 v2 —— 从零绘制（非换色）
风格与 gen_npcs.py 统一：Q 版二头身、三阶明暗、内描边、脸部高光。
四方向 × 四帧：row0下 row1左 row2右(左镜像) row3上；col0站立 col1/3跑步 col2站立。
跑步动画：火影跑（侧面前倾 + 双臂后摆 + 大步幅；正面/背面摆臂大步）。
输出：assets/img-hd/hero_<id>.png；默认勇者另写 32px 基图 assets/img/hero.png。
"""
import os, importlib.util
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
OUT = os.path.join(ROOT, 'assets', 'img-hd')

spec = importlib.util.spec_from_file_location(
    'gen_art', os.path.join(ROOT, 'tools', 'gen_art.py'))
GA = importlib.util.module_from_spec(spec)
spec.loader.exec_module(GA)

from pxlib import Px, shade, inner_outline

# ---------------- 通用色板 ----------------
SKIN   = (252, 220, 188)
SKIN_D = (219, 175, 141)
SKIN_L = (255, 240, 216)
EYE    = (44, 40, 60)
BAND   = (40, 44, 62)
PLATE  = (204, 208, 222)
PLATE_D= (150, 154, 172)

# ---------------- 角色定义 ----------------
# skin/hair/top/topD/bottom/shoe/eye + 角色专属键
CH = {
 'hero': dict(  # 经典勇者：钢蓝板甲 + 棕发
    skin=SKIN, hair=(158, 108, 58),
    top=(110, 132, 190), topD=(78, 94, 148), topL=(150, 172, 224),
    bottom=(96, 100, 140), shoe=(94, 64, 42), eye=EYE,
    belt=(70, 52, 36), metal=(196, 204, 224)),
 'naruto': dict(
    skin=SKIN, hair=(246, 212, 88),
    top=(236, 140, 42), topD=(190, 100, 24), topL=(250, 178, 92),
    bottom=(222, 128, 36), shoe=(48, 66, 128), eye=(46, 50, 76),
    belt=(52, 56, 78), whisker=(196, 150, 110)),
 'sasuke': dict(
    skin=(250, 216, 180), hair=(40, 46, 78),
    top=(70, 92, 168), topD=(48, 64, 126), topL=(104, 130, 200),
    bottom=(230, 230, 236), shoe=(52, 56, 76), eye=(34, 38, 62),
    belt=(52, 56, 78), band=(34, 38, 58)),
 'kakashi': dict(
    skin=(246, 212, 182), hair=(204, 210, 220),
    top=(64, 70, 88), topD=(46, 50, 66), topL=(92, 100, 120),   # 内衬深色
    vest=(92, 126, 82), vestD=(62, 90, 56), vestL=(124, 160, 110),
    bottom=(56, 68, 116), shoe=(42, 46, 64), eye=(40, 44, 64),
    mask=(44, 52, 88)),
 'lee': dict(
    skin=(248, 212, 176), hair=(36, 36, 44),
    top=(66, 136, 74), topD=(46, 100, 54), topL=(100, 172, 108),
    bottom=(66, 136, 74), shoe=(44, 48, 60), eye=(34, 36, 46),
    warmer=(228, 120, 42), band=(46, 48, 56), plate=(198, 202, 216)),
 'gaara': dict(
    skin=(250, 220, 190), hair=(212, 122, 62),
    top=(156, 60, 50), topD=(118, 42, 36), topL=(190, 88, 70),
    bottom=(124, 82, 62), shoe=(64, 48, 42), eye=(62, 128, 158),
    collar=(214, 198, 170), mark=(198, 46, 46), belt=(84, 60, 46)),
 'hinata': dict(
    skin=(250, 222, 194), hair=(56, 66, 122),
    top=(210, 204, 230), topD=(172, 164, 202), topL=(232, 228, 246),
    bottom=(78, 82, 132), shoe=(52, 56, 92), eye=(148, 148, 210),
    collar=(242, 240, 250)),
}

# ---------------- 基础身体 ----------------
def head_down(p, s, y0=3):
    """正面头：返回脸参数"""
    p.E(10, y0, 21, y0 + 10, s['skin'])
    p.R(11, y0, 20, y0 + 10, s['skin'])
    p.line([(21, y0 + 3), (21, y0 + 9)], shade(s['skin'], 0.9))   # 右侧背光
    p.line([(12, y0 + 1), (13, y0 + 1)], SKIN_L)                  # 左上高光
    # 耳朵
    p.R(9, y0 + 5, 10, y0 + 7, s['skin']); p.R(21, y0 + 5, 22, y0 + 7, shade(s['skin'], 0.92))
    return y0

def face_down(p, s, y0=3):
    ey = y0 + 6
    if s is CH['kakashi']:
        # 单右眼（左眼被刘海遮住），面罩在 extra 中绘制
        p.R(18, ey, 19, ey + 1, s['eye']); p.P(19, ey, (255, 255, 255))
        p.line([(18, ey - 2), (20, ey - 2)], shade(s['hair'], 0.8))
        return
    big = (s is CH['lee'] or s is CH['hinata'])
    if big:
        p.R(12, ey, 14, ey + 2, s['eye']); p.R(18, ey, 20, ey + 2, s['eye'])
        p.P(14, ey, (255, 255, 255)); p.P(20, ey, (255, 255, 255))
        p.P(12, ey + 2, shade(s['eye'], 1.6)); p.P(18, ey + 2, shade(s['eye'], 1.6))
    else:
        p.R(12, ey, 13, ey + 1, s['eye']); p.R(18, ey, 19, ey + 1, s['eye'])
        p.P(13, ey, (255, 255, 255)); p.P(19, ey, (255, 255, 255))
    p.line([(12, ey - 2), (14, ey - 2)], shade(s['hair'], 0.8))   # 眉
    p.line([(18, ey - 2), (20, ey - 2)], shade(s['hair'], 0.8))
    if s is CH['naruto']:                                          # 六道须
        p.P(11, ey + 2, s['whisker']); p.P(11, ey + 3, s['whisker'])
        p.P(21, ey + 2, s['whisker']); p.P(21, ey + 3, s['whisker'])
    # 嘴
    p.P(15, ey + 4, (188, 116, 100)); p.P(16, ey + 4, (188, 116, 100))

def torso_down(p, s, run=0):
    t, td, tl = s['top'], s['topD'], s['topL']
    p.R(10, 14, 21, 21, t)
    p.line([(10, 14), (21, 14)], tl)                              # 肩线
    p.line([(10, 21), (21, 21)], shade(t, 0.7))
    p.line([(10, 15), (10, 20)], tl if run == 0 else tl)          # 左受光
    p.line([(21, 15), (21, 20)], td)
    p.R(11, 18, 20, 19, s.get('belt', td))                        # 腰带
    p.P(16, 18, (220, 180, 90))

def arms_down(p, s, run=0):
    t = s['top']
    if run == 0:
        p.R(7, 15, 10, 20, t); p.R(21, 15, 24, 20, t)
        p.line([(7, 15), (7, 20)], shade(t, 1.15)); p.line([(24, 15), (24, 20)], shade(t, 0.75))
        p.R(7, 20, 10, 22, s['skin']); p.R(21, 20, 24, 22, s['skin'])
    else:
        # 摆臂：run1 左前右后；run3 右前左后
        f, b = (7, 21) if run == 1 else (21, 7)
        fx = f if f == 7 else f
        p.R(f, 15, f + 3, 18, t); p.R(f + (0 if f == 7 else 0), 18, f + 3, 20, s['skin'])
        p.R(b, 13, b + 3, 16, t)                                   # 后摆抬臂
        if b == 7: p.R(7, 16, 10, 17, t)
        else: p.R(21, 16, 24, 17, t)

def legs_down(p, s, run=0):
    b, sh = s['bottom'], s['shoe']
    if run == 0:
        p.R(12, 22, 15, 27, b); p.R(17, 22, 20, 27, b)
        p.line([(12, 22), (15, 22)], shade(b, 1.15)); p.line([(17, 22), (20, 22)], shade(b, 1.15))
        p.R(12, 27, 15, 29, sh); p.R(17, 27, 20, 29, sh)
        p.line([(12, 29), (15, 29)], shade(sh, 0.7)); p.line([(17, 29), (20, 29)], shade(sh, 0.7))
    else:
        if run == 1:
            p.R(10, 22, 13, 26, b); p.R(9, 26, 12, 28, sh)         # 左腿前迈
            p.R(18, 22, 20, 25, b); p.R(18, 25, 21, 26, sh)        # 右腿后蹬
        else:
            p.R(12, 22, 14, 25, b); p.R(11, 25, 14, 26, sh)
            p.R(16, 22, 19, 26, b); p.R(17, 26, 20, 28, sh)

def body_down(p, s, run=0):
    legs_down(p, s, run)
    torso_down(p, s)
    arms_down(p, s, run)
    head_down(p, s)
    face_down(p, s)

def body_up(p, s, run=0):
    """背面：同正面结构，头后全发"""
    legs_down(p, s, run)
    torso_down(p, s)
    arms_down(p, s, run)
    p.E(10, 3, 21, 13, s['skin']); p.R(11, 3, 20, 13, s['skin'])
    p.line([(21, 6), (21, 12)], shade(s['skin'], 0.9))

def body_side(p, s, run=0, lean=0):
    """侧面（朝左）"""
    hx = 7 - lean                       # 头左缘
    b, sh, t = s['bottom'], s['shoe'], s['top']
    # 腿
    if run == 0:
        p.R(hx + 4, 22, hx + 7, 27, b); p.R(hx + 8, 22, hx + 11, 27, b)
        p.R(hx + 3, 27, hx + 7, 29, sh); p.R(hx + 8, 27, hx + 12, 29, sh)
        p.line([(hx + 3, 29), (hx + 7, 29)], shade(sh, 0.7))
    else:
        if run == 1:
            p.R(hx - 2, 22, hx + 3, 25, b); p.R(hx - 4, 25, hx, 28, b); p.R(hx - 5, 27, hx - 1, 29, sh)
            p.R(hx + 8, 22, hx + 11, 24, b); p.R(hx + 10, 23, hx + 13, 26, sh)
        else:
            p.R(hx + 5, 22, hx + 10, 25, b); p.R(hx + 10, 25, hx + 14, 28, sh)
            p.R(hx + 1, 22, hx + 4, 24, b); p.R(hx - 1, 24, hx + 3, 26, sh)
    # 躯干
    p.R(hx + 2, 14, hx + 13, 21, t)
    p.line([(hx + 2, 14), (hx + 13, 14)], s['topL'])
    p.line([(hx + 13, 15), (hx + 13, 20)], shade(t, 0.7))
    p.R(hx + 3, 18, hx + 12, 19, s.get('belt', s['topD']))
    # 手臂
    if run == 0:
        p.R(hx + 8, 15, hx + 11, 20, t)
        p.line([(hx + 11, 15), (hx + 11, 20)], shade(t, 0.75))
        p.R(hx + 8, 20, hx + 11, 22, s['skin'])
    else:
        p.R(hx + 12, 13, hx + 15, 16, t)                            # 后摆臂
        p.R(hx + 14, 12, hx + 16, 14, s['skin'])
        p.R(hx + 1, 16, hx + 4, 19, shade(t, 0.85))                 # 前摆残影
    # 头
    p.E(hx, 3, hx + 12, 13, s['skin']); p.R(hx + 1, 3, hx + 11, 13, s['skin'])
    p.R(hx - 1, 8, hx, 9, s['skin'])                                # 鼻尖
    p.line([(hx + 11, 6), (hx + 11, 12)], shade(s['skin'], 0.88))
    if s is CH['kakashi']:
        p.R(hx + 3, 9, hx + 5, 10, s['eye'])
        p.R(hx + 2, 12, hx + 12, 14, s['mask'])
    elif s is CH['lee'] or s is CH['hinata']:
        p.R(hx + 2, 8, hx + 4, 10, s['eye']); p.P(hx + 4, 8, (255, 255, 255))
        if s is CH['lee']:
            p.line([(hx + 2, 7), (hx + 4, 7)], (24, 24, 30))
    else:
        p.R(hx + 3, 9, hx + 4, 10, s['eye']); p.P(hx + 4, 9, (255, 255, 255))
    p.R(hx + 6, 15, hx + 7, 15, (188, 116, 100))                    # 下巴嘴角

# ---------------- 头发 ----------------
def hair_naruto(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.76)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 7, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.18))
        for sx in range(9, 22, 3):                                  # 锯齿刘海
            p.P(sx, 8, b); p.R(sx + 1, 7, sx + 2, 8, b)
        for sx in (9, 12, 15, 18, 21):                              # 顶部尖刺
            p.P(sx, 0, b); p.P(sx + 1, 0, b); p.R(sx + 1, 1, sx + 1, 2, b)
        headband(p, 0, s, y=4)
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 10, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.18))
        p.line([(10, 10), (21, 10)], hd)
        for sx in (9, 12, 15, 18, 21):
            p.P(sx, 0, b); p.P(sx + 1, 0, b)
    else:
        x0 = 7 - (2 if run else 0)                     # 与 body_side lean 同步
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0 + 7, 8, x0 + 13, 12, hd)                             # 后脑
        p.line([(x0 + 8, 10), (x0 + 12, 10)], shade(s['hair'], 0.6))
        p.R(x0, 6, x0 + 4, 9, b)                                    # 前刘海
        p.P(x0, 9, hd)
        for sx in (x0 + 1, x0 + 5, x0 + 9):
            p.P(sx, 0, b); p.P(sx + 1, 0, b)
        headband(p, 1, s, y=4, lean=2)

def hair_sasuke(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.72)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 8, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.35))
        p.R(9, 6, 11, 13, b); p.R(21, 6, 23, 13, b)                 # 鬓发
        p.line([(10, 11), (10, 13)], hd)
        for sx in (10, 13, 16, 19, 22):                             # 后仰尖刺
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 0, s, y=3)
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 10, b)
        p.line([(10, 10), (21, 10)], hd)
        for sx in (9, 13, 17, 21):
            p.R(sx, 0, sx + 1, 3, b)                                # 鸭尾翘发
        p.R(8, 5, 9, 11, b); p.R(22, 5, 23, 11, b)
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0, 3, x0 + 4, 11, b)                                   # 前长刘海
        p.line([(x0 + 1, 9), (x0 + 2, 11)], hd)
        p.R(x0 + 7, 8, x0 + 13, 13, hd)                             # 后脑
        for sx in (x0 + 5, x0 + 9, x0 + 12):
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 1, s, y=3, lean=2)

def hair_kakashi(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.74)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 8, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.3))
        p.R(9, 5, 13, 10, b)                                        # 斜刘海遮左眼
        p.R(13, 8, 14, 9, b); p.P(12, 9, hd)
        for sx in (10, 14, 18, 21):
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 0, s, y=3, slant=True)
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 10, b)
        p.line([(10, 10), (21, 10)], hd)
        for sx in (9, 12, 16, 20):
            p.R(sx, 0, sx + 1, 3, b)
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0 + 6, 8, x0 + 13, 12, hd)                             # 后脑银发
        p.R(x0, 5, x0 + 6, 8, b)                                    # 前斜刘海
        p.P(x0, 8, hd)
        for sx in (x0, x0 + 4, x0 + 8, x0 + 11):
            p.R(sx, 0, sx + 1, 2, b)
        headband(p, 1, s, y=3, lean=2, slant=True)

def hair_lee(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.7)
    if dr == 0:
        p.E(8, 0, 23, 9, b); p.R(9, 0, 22, 8, b)
        p.line([(10, 1), (21, 1)], shade(s['hair'], 1.6))
        for sx in range(9, 23, 2):                                  # 锅盖齐眉
            p.P(sx, 8, hd)
        p.line([(9, 6), (22, 6)], b)
    elif dr == 3:
        p.E(8, 0, 23, 9, b); p.R(9, 0, 22, 10, b)
        p.line([(10, 10), (21, 10)], hd)
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 0, x0 + 13, 9, b); p.R(x0 + 1, 0, x0 + 12, 8, b)
        p.line([(x0 + 2, 1), (x0 + 11, 1)], shade(s['hair'], 1.6))
        p.line([(x0 + 1, 7), (x0 + 12, 8)], hd)

def hair_gaara(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.74)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 7, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.25))
        p.R(9, 6, 11, 10, b); p.R(21, 6, 23, 10, b)                 # 短鬓
        p.line([(10, 9), (10, 10)], hd)
        p.R(12, 7, 14, 8, s['mark']); p.P(13, 8, s['mark'])         # 爱之额印
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 10, b)
        p.line([(10, 10), (21, 10)], hd)
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0 + 7, 8, x0 + 13, 11, hd)
        p.R(x0, 6, x0 + 4, 9, b)
        p.R(x0 + 2, 6, x0 + 4, 7, s['mark'])                        # 额印侧面

def hair_hinata(p, s, dr, run=0):
    b, hd = s['hair'], shade(s['hair'], 0.72)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 8, b)
        p.line([(11, 2), (20, 2)], shade(s['hair'], 1.3))
        p.R(9, 6, 21, 8, b)                                         # 齐刘海
        for sx in range(10, 21, 3): p.P(sx, 9, b)
        p.R(7, 4, 9, 17, b); p.R(22, 4, 24, 17, b)                  # 姬发长鬓
        p.line([(8, 14), (8, 17)], hd); p.line([(23, 14), (23, 17)], hd)
        p.R(7, 16, 9, 18, hd); p.R(22, 16, 24, 18, hd)
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 12, b)
        p.line([(10, 10), (21, 12)], hd)
        p.R(7, 4, 9, 18, b); p.R(22, 4, 24, 18, b)
        p.line([(8, 15), (8, 18)], hd); p.line([(23, 15), (23, 18)], hd)
        p.line([(11, 10), (11, 15)], hd); p.line([(20, 10), (20, 15)], hd)  # 背发分缕
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0, 6, x0 + 4, 9, b)                                    # 前刘海不遮眼
        p.R(x0 + 8, 8, x0 + 14, 18, b)                              # 后发长垂
        p.line([(x0 + 10, 14), (x0 + 11, 18)], hd)
        p.R(x0 + 8, 16, x0 + 14, 18, hd)

def hair_hero(p, s, dr, run=0):
    b, hd, hl = s['hair'], shade(s['hair'], 0.72), shade(s['hair'], 1.25)
    if dr == 0:
        p.E(9, 1, 22, 8, b); p.R(10, 1, 21, 8, b)
        p.line([(11, 2), (20, 2)], hl)
        p.R(9, 5, 11, 9, b); p.R(21, 5, 22, 9, b)                   # 侧发贴脸
        p.line([(9, 7), (9, 9)], hd); p.line([(22, 7), (22, 9)], hd)
        for sx in (10, 13, 16, 19, 22):                             # 蓬松刘海
            p.P(sx, 8, b); p.R(sx + 1, 7, sx + 1, 8, hd)
    elif dr == 3:
        p.E(9, 1, 22, 9, b); p.R(10, 1, 21, 12, b)
        p.line([(10, 10), (21, 12)], hd)
        p.line([(11, 2), (20, 2)], hl)
        p.R(9, 5, 10, 12, b); p.R(21, 5, 22, 12, b)
    else:
        x0 = 7 - (2 if run else 0)
        p.E(x0, 1, x0 + 13, 8, b); p.R(x0 + 1, 1, x0 + 12, 8, b)
        p.R(x0 + 7, 8, x0 + 14, 12, hd)                             # 后脑
        p.R(x0, 6, x0 + 4, 9, b)                                    # 前刘海
        p.line([(x0, 7), (x0, 8)], hd)
        for sx in (x0 + 2, x0 + 6, x0 + 10):
            p.R(sx, 0, sx + 1, 2, b)

def headband(p, dr, s, y=3, lean=0, slant=False):
    bnd = s.get('band', BAND); plate = s.get('plate', PLATE)
    if dr == 0:
        p.R(9, y, 22, y + 1, bnd)
        p.line([(9, y), (22, y)], shade(bnd, 1.4))
        p.line([(9, y + 1), (22, y + 1)], shade(bnd, 0.7))
        px0 = 14 if not slant else 12
        p.R(px0, y, px0 + 4, y + 1, plate)
        p.R(px0 + 1, y, px0 + 2, y + 1, PLATE_D)
    else:
        x0 = 7 - lean
        p.R(x0, y, x0 + 13, y + 1, bnd)
        p.line([(x0, y), (x0 + 13, y)], shade(bnd, 1.4))
        p.line([(x0, y + 1), (x0 + 13, y + 1)], shade(bnd, 0.7))
        px0 = x0 + 1 if slant else x0 + 4
        p.R(px0, y, px0 + 4, y + 1, plate)
        p.R(px0 + 1, y, px0 + 2, y + 1, PLATE_D)

# ---------------- 角色专属细节 ----------------
def extra(p, s, dr, run=0):
    sid = [k for k, v in CH.items() if v is s][0]
    if sid == 'hero':
        # 胸甲板线 + 肩甲
        if dr == 0:
            p.R(11, 15, 20, 15, s['topL'])
            p.line([(11, 17), (20, 17)], s['topD'])
            p.line([(16, 18), (16, 21)], s['topD'])
            p.R(9, 14, 12, 16, s['metal']); p.R(19, 14, 22, 16, s['metal'])
            p.line([(9, 14), (12, 14)], shade(s['metal'], 1.15))
            p.line([(19, 14), (22, 14)], shade(s['metal'], 1.15))
        elif dr == 3:
            p.line([(12, 16), (19, 16)], s['topD'])
            p.line([(12, 19), (19, 19)], s['topD'])
            p.R(9, 14, 12, 16, s['metal']); p.R(19, 14, 22, 16, s['metal'])
    elif sid == 'naruto':
        if dr == 0:
            p.R(16, 14, 16, 21, s['topD'])                          # 拉链
            p.P(16, 14, s['topL'])
            p.R(11, 20, 14, 21, s['topD']); p.R(17, 20, 20, 21, s['topD'])
        elif dr == 3:
            p.R(13, 15, 18, 16, s['topD'])                          # 背徽
            p.R(14, 15, 17, 15, shade(s['topD'], 1.3))
    elif sid == 'kakashi':
        v, vd, vl = s['vest'], s['vestD'], s['vestL']
        if dr == 0:
            p.R(10, 12, 21, 14, s['mask'])                          # 面罩遮口鼻
            p.line([(10, 12), (21, 12)], shade(s['mask'], 1.3))
            p.R(10, 15, 21, 20, v)
            p.line([(10, 15), (21, 15)], vl)
            p.line([(10, 20), (21, 20)], vd)
            p.R(12, 16, 14, 18, vd); p.R(17, 16, 19, 18, vd)        # 口袋
            p.line([(12, 16), (14, 16)], vl); p.line([(17, 16), (19, 16)], vl)
            p.line([(10, 15), (10, 20)], (30, 34, 46))              # 拉链边
        elif dr == 3:
            p.R(10, 15, 21, 20, v)
            p.line([(10, 15), (21, 15)], vl)
            p.line([(10, 20), (21, 20)], vd)
            p.R(11, 17, 12, 19, vd)                                 # 卷轴
    elif sid == 'lee':
        w = s['warmer']
        if dr in (0, 3):
            p.R(11, 24, 15, 27, w); p.R(17, 24, 21, 27, w)
            p.line([(11, 24), (15, 24)], shade(w, 1.2))
            p.line([(17, 24), (21, 24)], shade(w, 1.2))
            p.line([(11, 27), (15, 27)], shade(w, 0.7))
            p.line([(17, 27), (21, 27)], shade(w, 0.7))
        else:
            x0 = 7 - (2 if run else 0)
            if run == 0:
                p.R(x0 + 4, 24, x0 + 7, 27, w); p.R(x0 + 8, 24, x0 + 11, 27, w)
                p.line([(x0 + 4, 24), (x0 + 7, 24)], shade(w, 1.2))
                p.line([(x0 + 8, 24), (x0 + 11, 24)], shade(w, 1.2))
            elif run == 1:
                p.R(x0 - 4, 25, x0, 28, w); p.R(x0 + 8, 22, x0 + 11, 24, w)
            else:
                p.R(x0 + 10, 25, x0 + 14, 28, w); p.R(x0 + 1, 22, x0 + 4, 24, w)
    elif sid == 'gaara':
        c = s['collar']
        if dr == 0:
            p.R(10, 14, 21, 15, c)                                  # 高领
            p.line([(10, 14), (21, 14)], shade(c, 1.2))
            p.line([(10, 15), (21, 15)], shade(c, 0.75))
            p.line([(13, 16), (13, 21)], s['topD'])                 # 衣襟
        elif dr == 3:
            p.line([(12, 16), (19, 16)], s['topD'])
            p.line([(12, 19), (19, 19)], s['topD'])
        else:
            x0 = 7 - (2 if run else 0)
            p.R(x0 + 2, 14, x0 + 13, 15, c)
            p.line([(x0 + 2, 15), (x0 + 13, 15)], shade(c, 0.75))
            p.line([(x0 + 9, 16), (x0 + 9, 21)], s['topD'])
    elif sid == 'hinata':
        c = s['collar']
        if dr == 0:
            p.R(10, 14, 21, 15, c)                                  # 白领
            p.line([(10, 15), (21, 15)], shade(c, 0.8))
            p.line([(16, 16), (16, 21)], s['topD'])                 # 衣缝
        elif dr == 3:
            p.line([(12, 16), (12, 21)], s['topD'])
            p.line([(19, 16), (19, 21)], s['topD'])
        else:
            x0 = 7 - (2 if run else 0)
            p.R(x0 + 2, 14, x0 + 13, 15, c)
            p.line([(x0 + 9, 16), (x0 + 9, 21)], s['topD'])

HAIR = {'hero': hair_hero, 'naruto': hair_naruto, 'sasuke': hair_sasuke,
        'kakashi': hair_kakashi, 'lee': hair_lee, 'gaara': hair_gaara,
        'hinata': hair_hinata}

# ---------------- 组装 ----------------
def build(sid):
    s = CH[sid]
    sheet = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    for row in range(4):          # 0下 1左 2右 3上
        for col in range(4):      # 0站 1跑A 2站 3跑B
            p = Px()
            run = 0 if col in (0, 2) else col
            if row == 0:
                body_down(p, s, run); extra(p, s, 0, run); HAIR[sid](p, s, 0)
            elif row == 3:
                body_up(p, s, run); extra(p, s, 3, run); HAIR[sid](p, s, 3)
            else:
                body_side(p, s, run, lean=2 if run else 0)
                extra(p, s, 1, run); HAIR[sid](p, s, 1, run)
            cell = p.im if row != 2 else p.im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            inner_outline(cell)
            sheet.paste(cell, (col * 32, row * 32))
    return sheet

def to_hd(sheet):
    hd = Image.new('RGBA', (384, 384), (0, 0, 0, 0))
    for row in range(4):
        for col in range(4):
            cell = sheet.crop((col * 32, row * 32, col * 32 + 32, row * 32 + 32))
            hd.paste(GA.enhance_cell(cell, 3), (col * 96, row * 96))
    return hd

def main():
    ids = ['hero', 'naruto', 'sasuke', 'kakashi', 'lee', 'gaara', 'hinata']
    prev = Image.new('RGB', (100 * len(ids), 4 * 104 + 8), (34, 36, 52))
    for i, sid in enumerate(ids):
        sh = build(sid)
        hd = to_hd(sh)
        hd.save(os.path.join(OUT, ('hero.png' if sid == 'hero' else 'hero_%s.png' % sid)), optimize=True)
        if sid == 'hero':
            sh.save(os.path.join(IMG, 'hero.png'), optimize=True)   # 32px 基图同步
        print('重绘:', sid)
        for r in range(4):
            cell = hd.crop((0, r * 96, 96, r * 96 + 96)).convert('RGBA')
            prev.paste(cell, (i * 100 + 2, r * 104 + 4), cell)
    prev.save('E:/tmp/hero_v2_preview.png')
    print('预览: E:/tmp/hero_v2_preview.png')

if __name__ == '__main__':
    main()
