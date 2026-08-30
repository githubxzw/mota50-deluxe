main.floors.MT42=
{
    "floorId": "MT42",
    "title": "魔塔 第42层",
    "name": "第 42 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 87,  0,  0,  1,  0,  0, 23,  1, 21, 22, 21,  1],
    [  1,  0,  0,204,  1,  0,  0,  0,  1, 21, 21, 21,  1],
    [  1,  1,  1, 81,  1,  0,  0,  0,  1,  1,  0,  1,  1],
    [  1,121,  0,  0,  1,  1,228,  1,  1,219,  0,220,  1],
    [  1,  0,  0,204, 81,  0,  0,  0, 81,  0,  0,  0,  1],
    [  1, 81,  1,  1,  1,  1,  0,  1,  1,  0,  0,219,  1],
    [  1,  0,  0,  0,  1,  0,  0,  0,  1,  1,  0,  1,  1],
    [  1,  1,  1,207,  1,  0,  0,  0,  1,246,  0,246,  1],
    [  1, 32, 21, 21,  1,  1,  0,  1,  1,  1,  0,  1,  1],
    [  1,207,  1,  1,  1,  0,226,  0,  1, 21, 21, 21,  1],
    [  1, 21, 21, 28,  1,  0, 88,  0,  1, 21, 22, 21,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 5,
    "defaultGround": "ground",
    "bgm": "section5.mp3",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "5,10": [
            "\t[yellowKnight]啊！又是你！！”（转身逃跑）",
            {
                "type": "move",
                "loc": [
                    6,
                    10
                ],
                "time": 200,
                "keep": true,
                "steps": [
                    "up:2"
                ]
            },
            {
                "type": "setBlock",
                "number": "redKing",
                "loc": [
                    [
                        6,
                        6
                    ]
                ],
                "time": 500
            },
            "\t[redKing]你敢临阵脱逃！",
            "\t[yellowKnight]哦，大王，我打不过这个勇士，不得不逃，绕了我吧？",
            "\t[redKing]你说什么？你敢再说一次！你象个胆小鬼一样逃离你负责的区域,并说出那样的话。魔塔不需要象你这样的败类，来人给我杀了。",
            {
                "type": "setBlock",
                "number": "whiteKing",
                "loc": [
                    [
                        6,
                        7
                    ],
                    [
                        5,
                        8
                    ],
                    [
                        7,
                        8
                    ],
                    [
                        6,
                        9
                    ]
                ],
                "time": 500
            },
            "\t[yellowKnight]大王，饶了我吧，再给我一次机会阿.....",
            {
                "type": "playSound",
                "name": "攻击"
            },
            {
                "type": "function",
                "function": "function(){\ncore.drawImage(\"animate\", core.statusBar.icons.battle, 0, 0, 32, 32, (6 - 1) * 32, (8 - 1) * 32, 32, 32);\nsetTimeout(function () {\n\tcore.clearMap(\"animate\", (6 - 1) * 32, (8 - 1) * 32, 32, 32);\n}, 100);\n}"
            },
            {
                "type": "hide",
                "loc": [
                    [
                        6,
                        8
                    ]
                ],
                "remove": true,
                "time": 500
            },
            "\t[redKing]虽然我刚才态度异常，但别担心在决斗时，我不会像刚才这个无用的家伙一样让手下一拥而上。我期待着与你决斗。",
            {
                "type": "hide",
                "loc": [
                    [
                        6,
                        6
                    ],
                    [
                        6,
                        7
                    ],
                    [
                        5,
                        8
                    ],
                    [
                        7,
                        8
                    ],
                    [
                        6,
                        9
                    ]
                ],
                "remove": true,
                "time": 500
            },
            {
                "type": "hide",
                "remove": true,
                "time": 0
            }
        ],
        "6,10": {
            "trigger": "action",
            "enable": true,
            "noPass": null,
            "displayDamage": true,
            "opacity": 1,
            "filter": {
                "blur": 0,
                "hue": 0,
                "grayscale": 0,
                "invert": false,
                "shadow": 0
            },
            "data": []
        }
    },
    "changeFloor": {
        "1,1": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "6,11": {
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
        1,
        2
    ],
    "downFloor": [
        5,
        11
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}