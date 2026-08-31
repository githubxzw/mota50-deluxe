#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HD 素材压缩：256 色量化（视觉无损），大幅减小体积提升加载速度"""
import os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
total_before = total_after = 0
for p in sorted(glob.glob(os.path.join(ROOT, 'assets', 'img-hd', '*.png'))):
    before = os.path.getsize(p)
    im = Image.open(p).convert('RGBA')
    q = im.quantize(colors=256, method=Image.FASTOCTREE)
    q.save(p, optimize=True)
    after = os.path.getsize(p)
    total_before += before; total_after += after
    print('%-22s %6d KB -> %6d KB' % (os.path.basename(p), before // 1024, after // 1024))
print('合计: %d KB -> %d KB (-%d%%)' % (total_before // 1024, total_after // 1024,
      100 - total_after * 100 // total_before))
