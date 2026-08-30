main.floors.MT3=
{
    "floorId": "MT3",
    "title": "魔塔 第03层",
    "name": "第 3 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 21, 28,  1, 21, 32, 21,  1,  0,  1,  0, 31,  1],
    [  1,  0, 31,  1, 32, 21, 32,  1,  0, 81,205,  0,  1],
    [  1,217,  0,  1, 21, 22, 21,  1,  0,  1,  1,  1,  1],
    [  1, 81,  1,  1,  1,  0,  1,  1,  0,  1,  0,121,  1],
    [  1,  0,  0,205,  0,  0,  0,201,  0,  0,  0,  0,  1],
    [  1, 81,  1,  1,  0,  0,  0,  1,  0,  1,  1,  1,  1],
    [  1,209,  0,  1,  1,321,  1,  1,  0,  1,  0, 31,  1],
    [  1,  0, 21,  1,  0,  0,  0,  1,  0, 81,217, 21,  1],
    [  1, 31, 27,  1,  0,  0,  0,  1,  0,  1,  1,  1,  1],
    [  1,  1,  1,  1,  1,  0,  1,  1,202,  1,  0,  0,  1],
    [  1, 88,  0,  0,  0,  0,  0,  1,  0, 81,  0, 87,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 1,
    "defaultGround": "ground",
    "bgm": "section1.mp3",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "5,9": [
            {
                "type": "setValue",
                "name": "flag:03",
                "value": "1"
            },
            {
                "type": "playSound",
                "name": "3F.mp3"
            },
            {
                "type": "setBlock",
                "number": "redKing",
                "loc": [
                    [
                        5,
                        7
                    ]
                ],
                "time": 500
            },
            "\t[魔王,redKing]欢迎来到魔塔，你是第一百位挑战者。你若能打败我所有的手下，我就与你一对一的决斗。现在你必须接受我的安排。",
            {
                "type": "setBlock",
                "number": "whiteKing",
                "loc": [
                    [
                        5,
                        8
                    ],
                    [
                        4,
                        9
                    ],
                    [
                        6,
                        9
                    ],
                    [
                        5,
                        10
                    ]
                ],
                "time": 500
            },
            "\t[hero]什么？",
            {
                "type": "function",
                "function": "function(){\n// 四方向相对于格子中心的原始“图心”偏移（单位：像素）\nconst groupOffsets = {\n\tup: { x: 0, y: -8 },\n\tright: { x: 8, y: 0 },\n\tdown: { x: 0, y: 8 },\n\tleft: { x: -8, y: 0 }\n};\n\n// 可复用的旋转函数（旋转向量 (vx,vy) by angle radians）\nfunction rotateVec(vx, vy, angle) {\n\tvar c = Math.cos(angle),\n\t\ts = Math.sin(angle);\n\treturn { x: vx * c - vy * s, y: vx * s + vy * c };\n}\n\n/**\n * 在格子中心作为枢轴，让四张图一起顺时针旋转 180°（默认）。\n * x,y 为格子坐标（格子左上角为 x*32,y*32）\n * duration 毫秒，rotateSelf: 是否让每张图自身也跟着旋转（true = 图也自转）\n */\nfunction showGroupPivotRotatingDamage(x, y, duration = 500) {\n\tvar image = core.material.images.images['85.png'];\n\tif (!image) return;\n\tvar start = Date.now();\n\tvar dirs = ['up', 'right', 'down', 'left'];\n\tvar tileCX = x * 32 + 16; // 格子中心 x (像素)\n\tvar tileCY = y * 32 + 16; // 格子中心 y (像素)\n\tvar w = 16,\n\t\th = 16; // 绘制大小（图大小或你想要的大小）\n\n\t// 如果你想让初始状态是四方向都存在（如用户所说），就直接开始绘制\n\tfunction frame() {\n\t\tvar now = Date.now();\n\t\tvar p = (now - start) / duration;\n\t\tif (p > 1) p = 1;\n\n\t\t// 顺时针旋转角度从 0 到 PI (180°)\n\t\tvar baseAngle = p * Math.PI;\n\n\t\t// 清空 event2 层（只清该层以免破坏其他层）\n\t\tcore.clearMap('event2');\n\n\t\t// 对每个方向计算旋转后的位置并绘制\n\t\tdirs.forEach(function (dir) {\n\t\t\tvar off = groupOffsets[dir];\n\t\t\t// 先把原向量绕格子中心旋转 baseAngle（顺时针 -> 用正角）\n\t\t\tvar r = rotateVec(off.x, off.y, baseAngle);\n\n\t\t\t// 求出图像的目标左上角，使图心放在 (tileCX + r.x, tileCY + r.y)\n\t\t\tvar destCenterX = tileCX + r.x;\n\t\t\tvar destCenterY = tileCY + r.y;\n\t\t\tvar x1 = Math.round(destCenterX - w / 2);\n\t\t\tvar y1 = Math.round(destCenterY - h / 2);\n\n\t\t\t// 如果要让图自身也旋转（和组一起转），设 angleSelf；否则 angleSelf = 0\n\t\t\tvar angleSelf = 0;\n\t\t\t// 让图的朝向也随组旋转：原本朝向角（up 为 0，其它按 baseDirectionAngles） + baseAngle\n\t\t\tvar baseDirAngle = (dir === 'up' ? 0 : dir === 'right' ? Math.PI / 2 : dir === 'down' ? Math.PI : Math.PI * 3 / 2);\n\t\t\tangleSelf = baseDirAngle + baseAngle;\n\n\t\t\t// 使用你已有的 core.drawImage 的参数签名：\n\t\t\t// core.drawImage(name, image, sx, sy, sw, sh, dx, dy, dw, dh, angle)\n\t\t\t// 这里假设素材整张就是 16x16（若不是请调整 sx,sy,sw,sh）\n\t\t\tcore.drawImage(\n\t\t\t\t'event2',\n\t\t\t\timage,\n\t\t\t\t0, 0, w, h,\n\t\t\t\tx1, y1, w, h,\n\t\t\t\tangleSelf // 旋转围绕每张图的自身中心（注意：我们的位移已完成“围绕格子中心”的旋转）\n\t\t\t);\n\t\t});\n\n\t\tif (p < 1) {\n\t\t\trequestAnimationFrame(frame);\n\t\t} else {\n\t\t\t// 动画结束：如果想保留最后一帧短时显示，可取消下面清除\n\t\t\t// core.clearMap('event2');\n\t\t\tcore.drawMap(); // 确保其他层正确覆盖\n\t\t}\n\t}\n\n\trequestAnimationFrame(frame);\n}\nshowGroupPivotRotatingDamage(core.getHeroLoc('x'), core.getHeroLoc('y'))\n}"
            },
            {
                "type": "sleep",
                "time": 500
            },
            {
                "type": "setCurtain",
                "color": [
                    0,
                    0,
                    0,
                    1
                ],
                "time": 1000,
                "keep": true,
                "async": true
            },
            {
                "type": "playSound",
                "name": "阻激夹域",
                "stop": true
            },
            {
                "type": "sleep",
                "time": 300
            },
            {
                "type": "playSound",
                "name": "阻激夹域"
            },
            {
                "type": "sleep",
                "time": 150
            },
            {
                "type": "playSound",
                "name": "阻激夹域"
            },
            {
                "type": "sleep",
                "time": 300
            },
            {
                "type": "playSound",
                "name": "阻激夹域"
            },
            {
                "type": "sleep",
                "time": 150
            },
            {
                "type": "playSound",
                "name": "阻激夹域"
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "setValue",
                "name": "status:hp",
                "value": "400"
            },
            {
                "type": "setValue",
                "name": "status:atk",
                "value": "10"
            },
            {
                "type": "setValue",
                "name": "status:def",
                "value": "10"
            },
            {
                "type": "setValue",
                "name": "flag:03",
                "value": "1"
            },
            {
                "type": "setValue",
                "name": "flag:nowWeapon",
                "value": "null"
            },
            {
                "type": "setValue",
                "name": "flag:nowShield",
                "value": "null"
            },
            {
                "type": "setValue",
                "name": "flag:魔法免疫",
                "value": "false"
            },
            {
                "type": "hide",
                "loc": [
                    [
                        5,
                        7
                    ],
                    [
                        5,
                        8
                    ],
                    [
                        4,
                        9
                    ],
                    [
                        6,
                        9
                    ],
                    [
                        5,
                        10
                    ],
                    [
                        5,
                        9
                    ]
                ],
                "remove": true,
                "time": 0
            },
            {
                "type": "changeFloor",
                "floorId": "MT2",
                "loc": [
                    3,
                    8
                ],
                "direction": "down",
                "time": 0
            },
            {
                "type": "sleep",
                "time": 500
            },
            "------",
            "------ 喂！",
            "------ 喂！醒醒！",
            {
                "type": "setCurtain",
                "time": 500
            }
        ]
    },
    "changeFloor": {
        "11,11": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "1,11": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {},
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "bgmap": [
    [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
],
    "fgmap": [

],
    "upFloor": [
        10,
        11
    ],
    "downFloor": [
        2,
        11
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}