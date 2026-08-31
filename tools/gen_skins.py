#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
【已废弃】旧版换色皮肤生成器 —— 已被 gen_hero_pixel.py 从零精绘取代。
此文件保留为兼容入口：直接转发到新的精绘管线。
"""
import os, runpy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    print('gen_skins.py 已合并进 gen_hero_pixel.py，正在调用新精绘管线…')
    runpy.run_path(os.path.join(ROOT, 'tools', 'gen_hero_pixel.py'), run_name='__main__')
