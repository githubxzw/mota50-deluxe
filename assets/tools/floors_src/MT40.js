main.floors.MT40=
{
    "floorId": "MT40",
    "title": "魔塔 第40层",
    "name": "第 40 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,226,  0,  0,  0,  0,  0,  1],
    [  1,  0,224,224,224,  0,  0,  0,227,227,227,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,212,212,212,  0,225,225,225,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1],
    [  1,  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1],
    [  1,  1,  1,  1,  1,  1, 83,  1,  1,  1,  1,  1,  1],
    [  1, 28, 21,  0,  1,216,  0,216,  1, 31,224,  0,  1],
    [  1, 32,  0,  0,  1,  0,  0,  0,  1,225,  0,  0,  1],
    [  1, 27,  0,227, 82,  0,  0,  0, 81,  0,  0, 88,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 4,
    "defaultGround": "ground",
    "bgm": "section4.mp3",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "6,1": [
            {
                "type": "if",
                "condition": "flag:402",
                "true": [
                    {
                        "type": "changeFloor",
                        "floorId": ":next",
                        "stair": "downFloor",
                        "time": 0
                    }
                ],
                "false": []
            }
        ],
        "6,7": [
            {
                "type": "playBgm",
                "name": "Knight.mp3"
            },
            {
                "type": "setEnemy",
                "id": "ghostSkeleton",
                "name": "special",
                "value": "1"
            },
            {
                "type": "setEnemy",
                "id": "soldier",
                "name": "special",
                "value": "1"
            },
            {
                "type": "setEnemy",
                "id": "swordsman",
                "name": "special",
                "value": "1"
            },
            {
                "type": "setEnemy",
                "id": "redKnight",
                "name": "special",
                "value": "1"
            },
            {
                "type": "setEnemy",
                "id": "yellowKnight",
                "name": "special",
                "value": "1"
            },
            "\t[骑士队长,yellowKnight]我还在担心你不能来了。我确信这次我一定能杀了你。鬼战士给我上！",
            {
                "type": "function",
                "function": "function(){\nvar targetX = 6,\n\ttargetY = 7;\n\nvar a = new Array(\n\t[5, 4], [4, 4], [3, 4], [7, 4], [8, 4], [9, 4],\n\t[4, 2], [3, 2], [2, 2], [8, 2], [9, 2], [10, 2], [6, 1]\n);\n\nfunction getSteps(x, y, tx, ty) {\n\tlet steps = [];\n\n\t// 水平移动：x → tx\n\tlet dx = tx - x;\n\tif (dx !== 0) {\n\t\tlet dir = dx > 0 ? \"right\" : \"left\";\n\t\tsteps.push(`${dir}:${Math.abs(dx)}`);\n\t}\n\n\t// 竖直移动：y → ty\n\tlet dy = ty - y;\n\tif (dy !== 0) {\n\t\tlet dir = dy > 0 ? \"down\" : \"up\";\n\t\tsteps.push(`${dir}:${Math.abs(dy)}`);\n\t}\n\n\treturn steps;\n}\nlet todo = [];\n\nfor (var i = 0; i <= 12; i++) {\n\tvar x = a[i][0],\n\t\ty = a[i][1];\n\n\tif (core.getBlockId(x, y) !== null) {\n\t\t// 生成 steps\n\t\tvar steps = getSteps(x, y, targetX, targetY);\n\t\t// 移动动画\n\t\tcore.push(todo, [\n\t\t\t{ \"type\": \"sleep\", \"time\": 50 },\n\t\t\t{\n\t\t\t\t\"type\": \"move\",\n\t\t\t\t\"loc\": [x, y],\n\t\t\t\t\"time\": 100,\n\t\t\t\t\"keep\": true,\n\t\t\t\t\"steps\": steps\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"type\": \"battle\",\n\t\t\t\t\"loc\": [targetX, targetY]\n\t\t\t}\n\t\t]);\n\t}\n\tif (i === 2) core.push(todo, '\\t[yellowKnight]哼，没关系，士兵们给我上！');\n\telse if (i === 5) core.push(todo, '\\t[yellowKnight]真正的战斗才刚开始，让我们继续，双手剑士给我上！');\n\telse if (i === 8) core.push(todo, '\\t[yellowKnight]哼，你们这战怎么打得？骑士们给我冲！');\n\telse if (i === 11) core.push(todo, '\\t[yellowKnight]你怎会击败我所有的手下？我和你誓不两立我决不认输。（骑士队长失去了理智）');\n\telse if (i === 12) {\n\t\tcore.push(todo, {\n\t\t\t\"type\": \"setBlock\",\n\t\t\t\"number\": \"upFloor\",\n\t\t\t\"loc\": [\n\t\t\t\t[6, 1]\n\t\t\t]\n\t\t});\n\t\tcore.push(todo, {\n\t\t\t\"type\": \"setBlock\",\n\t\t\t\"number\": \"yellowKnight\",\n\t\t\t\"loc\": [\n\t\t\t\t[targetX, targetY]\n\t\t\t]\n\t\t});\n\t\tcore.push(todo, \"\\t[yellowKnight]这次先饶了你，下次碰到我会和你正式的决斗，你最好投降。（骑士队长逃走了）\");\n\t\tcore.push(todo, {\n\t\t\t\"type\": \"move\",\n\t\t\t\"loc\": [targetX, targetY],\n\t\t\t\"time\": 50,\n\t\t\t\"keep\": false,\n\t\t\t\"steps\": ['up:6']\n\t\t});\n\t}\n\n}\ncore.insertAction(todo);\n}"
            },
            {
                "type": "setEnemy",
                "id": "ghostSkeleton",
                "name": "special",
                "value": "0"
            },
            {
                "type": "setEnemy",
                "id": "soldier",
                "name": "special",
                "value": "0"
            },
            {
                "type": "setEnemy",
                "id": "swordsman",
                "name": "special",
                "value": "0"
            },
            {
                "type": "setEnemy",
                "id": "redKnight",
                "name": "special",
                "value": "0"
            },
            {
                "type": "setEnemy",
                "id": "yellowKnight",
                "name": "special",
                "value": "0"
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        2,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        3,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        4,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        8,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        9,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        10,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        3,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        4,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        5,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        7,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        8,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        9,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "87",
                "loc": [
                    [
                        6,
                        1
                    ]
                ]
            },
            {
                "type": "setValue",
                "name": "flag:402",
                "value": "true"
            },
            {
                "type": "show",
                "loc": [
                    [
                        6,
                        1
                    ]
                ],
                "time": 0
            },
            {
                "type": "hide",
                "loc": [
                    [
                        6,
                        7
                    ]
                ],
                "remove": true,
                "time": 0
            }
        ]
    },
    "changeFloor": {
        "11,11": {
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
        6,
        2
    ],
    "downFloor": [
        10,
        11
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}