main.floors.MT32=
{
    "floorId": "MT32",
    "title": "魔塔 第32层",
    "name": "第 32 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 28,  0, 82,  0,  0,  0,  0,  0,  0,  0, 87,  1],
    [  1,  0, 27,  1,  1,  1,321,  1,  1,  1,  0,  0,  1],
    [  1, 81,  1,  1,  0, 81,  0, 81,  0,  1,  1,  1,  1],
    [  1,225,  0,216,  0,  1,  0,  1,212,  1, 21, 32,  1],
    [  1,  0, 21,  0,216,  1,  0,  1,  0, 81,  0, 21,  1],
    [  1,  1,  1,  1,  1,  1,  0,  1,  0,  1,  1,  1,  1],
    [  1, 21, 21, 21, 21,  1,  0,  1,227,  1, 21, 22,  1],
    [  1,  0,  0,  0, 22,  1,  0,  1,  0, 81,  0, 21,  1],
    [  1,  1, 85,  1,  1,  1,321,  1,  1,  1,  1,  1,  1],
    [  1,222,  0,222,  0,  0,  0,  0,  0,  7,131,  8,  1],
    [  1,  0,  0,  0,  0, 88,  0,  1,212,  0,  0,  0,  1],
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
        "10,10": [
            {
                "type": "setValue",
                "name": "flag:ratio",
                "value": "4"
            },
            {
                "type": "insert",
                "name": "商店"
            }
        ],
        "6,10": [
            {
                "type": "setEnemy",
                "id": "yellowKnight",
                "name": "special",
                "value": "1"
            },
            {
                "type": "hide",
                "loc": [
                    [
                        6,
                        2
                    ],
                    [
                        6,
                        9
                    ]
                ],
                "remove": true
            },
            {
                "type": "setBlock",
                "number": "yellowKnight",
                "loc": [
                    [
                        10,
                        1
                    ]
                ]
            },
            {
                "type": "move",
                "loc": [
                    10,
                    1
                ],
                "time": 200,
                "keep": true,
                "steps": [
                    "left:4"
                ]
            },
            "\t[骑士队长,yellowKnight]你打败了前两个区域的头目，这表明你是个勇士。但现在游戏结束了，我将在这里亲手杀死你！",
            {
                "type": "move",
                "loc": [
                    6,
                    1
                ],
                "time": 200,
                "keep": true,
                "steps": [
                    "down:9"
                ]
            },
            {
                "type": "if",
                "condition": "core.canBattle('yellowKnight')",
                "true": [
                    {
                        "type": "battle",
                        "id": "yellowKnight"
                    }
                ],
                "false": [
                    {
                        "type": "if",
                        "condition": "((!flag:addhp) && flag:开启特性)",
                        "true": [
                            {
                                "type": "if",
                                "condition": "(status:atk>core.getEnemyInfo('yellowKnight').def)",
                                "true": [
                                    {
                                        "type": "function",
                                        "function": "function(){\ncore.status.hero.hp = 0;\ncore.afterBattle('yellowKnight', null, null, false);\n}"
                                    },
                                    {
                                        "type": "update"
                                    }
                                ],
                                "false": [
                                    {
                                        "type": "battle",
                                        "id": "yellowKnight"
                                    }
                                ]
                            }
                        ],
                        "false": [
                            {
                                "type": "battle",
                                "id": "yellowKnight"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "move",
                "loc": [
                    6,
                    10
                ],
                "time": 100,
                "keep": true,
                "steps": [
                    "up:1"
                ]
            },
            "\t[骑士队长,yellowKnight]你以为你已非常强大了吗？嘿嘿错了，只是我今天状态不佳而已。我走了，有本事到40楼与我再打一次。",
            {
                "type": "move",
                "loc": [
                    6,
                    9
                ],
                "time": 100,
                "steps": [
                    "up:8",
                    "right:5"
                ]
            },
            {
                "type": "setEnemy",
                "id": "yellowKnight",
                "name": "special",
                "value": "0"
            },
            {
                "type": "hide",
                "remove": true,
                "time": 0
            }
        ]
    },
    "changeFloor": {
        "11,1": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "5,11": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {
        "1,10": [
            {
                "type": "if",
                "condition": "flag:32",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            9
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:32",
                        "value": "1"
                    }
                ]
            }
        ],
        "3,10": [
            {
                "type": "if",
                "condition": "flag:32",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            9
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:32",
                        "value": "1"
                    }
                ]
            }
        ]
    },
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
    "downFloor": [
        6,
        11
    ],
    "upFloor": [
        10,
        1
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}