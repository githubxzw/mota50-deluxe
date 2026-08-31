#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
像素画共享助手：画布 + 图元 + 内描边 + 明暗工具
所有角色生成脚本（NPC / 勇士 / 皮肤）共用，保证风格统一。
风格约定：光源左上 → 每种材质三阶色（亮 base*1.18 / 基准 / 暗 base*0.7），
最后 outline() 沿轮廓内圈压深一圈，HD 管线再叠加外描边。
"""
from PIL import Image, ImageDraw

def clamp(v): return 0 if v < 0 else (255 if v > 255 else int(v))

def shade(c, k):
    """亮度系数着色"""
    return (clamp(c[0] * k), clamp(c[1] * k), clamp(c[2] * k))

def mix(c1, c2, t):
    return tuple(clamp(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

class Px:
    """RGBA 画布，坐标越界自动裁剪"""
    def __init__(self, w=32, h=32):
        self.w, self.h = w, h
        self.im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def P(self, x, y, c, a=255):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.d.point((x, y), fill=tuple(c)[:3] + (a,))

    def R(self, x0, y0, x1, y1, c, a=255):
        self.d.rectangle([x0, y0, x1, y1], fill=tuple(c)[:3] + (a,))

    def E(self, x0, y0, x1, y1, c, a=255):
        self.d.ellipse([x0, y0, x1, y1], fill=tuple(c)[:3] + (a,))

    def poly(self, pts, c, a=255):
        self.d.polygon(pts, fill=tuple(c)[:3] + (a,))

    def line(self, pts, c, w=1, a=255):
        self.d.line(pts, fill=tuple(c)[:3] + (a,), width=w)

    # ---- 材质块：自动带顶亮 / 底暗 ----
    def cloth(self, x0, y0, x1, y1, c):
        """布料块：主体 + 左上提亮 + 右下压暗"""
        self.R(x0, y0, x1, y1, c)
        self.line([(x0, y0), (x1, y0)], shade(c, 1.18))
        self.line([(x0, y0), (x0, y1)], shade(c, 1.08))
        self.line([(x0, y1), (x1, y1)], shade(c, 0.72))
        self.line([(x1, y0), (x1, y1)], shade(c, 0.78))

    def metal(self, x0, y0, x1, y1, c):
        """金属块：强高光带"""
        self.R(x0, y0, x1, y1, c)
        self.line([(x0, y0), (x1, y0)], shade(c, 1.45))
        self.line([(x0 + 1, y0 + 1), (x1, y0 + 1)], shade(c, 1.2))
        self.line([(x0, y1), (x1, y1)], shade(c, 0.55))
        self.line([(x1, y0), (x1, y1)], shade(c, 0.7))

def inner_outline(im, k=0.42, alpha_only=True):
    """沿透明边界内圈压深一圈（经典像素画勾边）"""
    px = im.load()
    w, h = im.size
    edges = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                continue
            if (x == 0 or y == 0 or x == w - 1 or y == h - 1
                    or px[x - 1, y][3] == 0 or px[x + 1, y][3] == 0
                    or px[x, y - 1][3] == 0 or px[x, y + 1][3] == 0):
                edges.append((x, y))
    for x, y in edges:
        r, g, b, a = px[x, y]
        if a:
            px[x, y] = (clamp(r * k), clamp(g * k), clamp(b * k), 255)
    return im

def sparkle(d_layer_px, x, y, c=(255, 255, 255)):
    d_layer_px[x, y] = tuple(c) + (255,)
