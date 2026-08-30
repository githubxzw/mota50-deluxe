main.floors.MT20=
{
    "floorId": "MT20",
    "title": "魔塔 第20层",
    "name": "第 20 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0, 87,  0,  0,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  1,  1,  1,  1,  1, 85,  1,  1,  1,  1,  1,  1],
    [  1, 27, 28,  1,  0,  0,  0,  0,  0,  1, 31, 32,  1],
    [  1, 21,  0,  1,  0,321,206,  0,  0,  1,  0, 21,  1],
    [  1,  1, 82,  1,  0,  0,  0,  0,  0,  1, 82,  1,  1],
    [  1,205,  0,  1,  0,  0,  0,  0,  0,  1,  0,205,  1],
    [  1,  0,205,  1,  0,  0,  0,  0,  0,  1,205,  0,  1],
    [  1, 81,  1,  1,  1,  1, 83,  1,  1,  1,  1, 81,  1],
    [  1,  0,215,  0,  1,  0,  0,  0,  1,  0,215,  0,  1],
    [  1, 31,  0,  0,218,  0, 88,  0,218,  0,  0, 31,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 2,
    "defaultGround": "ground",
    "bgm": "section2.mp3",
    "firstArrive": [
        {
            "type": "setValue",
            "name": "flag:20",
            "value": "0"
        }
    ],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "6,8": [
            {
                "type": "setBlock",
                "number": "specialDoor",
                "loc": [
                    [
                        6,
                        9
                    ]
                ]
            },
            {
                "type": "playSound",
                "name": "20F.mp3"
            },
            {
                "type": "setBgFgBlock",
                "name": "bg",
                "number": "0",
                "loc": [
                    [
                        5,
                        5
                    ],
                    [
                        6,
                        5
                    ],
                    [
                        7,
                        5
                    ],
                    [
                        5,
                        6
                    ],
                    [
                        7,
                        6
                    ],
                    [
                        5,
                        7
                    ],
                    [
                        6,
                        7
                    ],
                    [
                        7,
                        7
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "bigBat",
                "loc": [
                    [
                        5,
                        5
                    ],
                    [
                        6,
                        5
                    ],
                    [
                        7,
                        5
                    ],
                    [
                        5,
                        6
                    ],
                    [
                        7,
                        6
                    ],
                    [
                        5,
                        7
                    ],
                    [
                        6,
                        7
                    ],
                    [
                        7,
                        7
                    ]
                ]
            },
            {
                "type": "move",
                "loc": [
                    5,
                    5
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "rightdown:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    6,
                    5
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "down:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    7,
                    5
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "leftdown:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    5,
                    6
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "right:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    7,
                    6
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "left:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    5,
                    7
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "rightup:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    6,
                    7
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "up:1"
                ]
            },
            {
                "type": "move",
                "loc": [
                    7,
                    7
                ],
                "time": 1000,
                "async": true,
                "steps": [
                    "leftup:1"
                ]
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "setBlock",
                "number": "vampire",
                "loc": [
                    [
                        6,
                        6
                    ]
                ],
                "time": 500
            },
            "\t[吸血鬼,vampire]很好, 你打败了骷髅族，但别想象藐视骷髅人那样藐视我。我对于你就象是神一样，是不可战胜的。呵呵, 来吧!",
            {
                "type": "hide",
                "loc": [
                    [
                        6,
                        8
                    ]
                ],
                "remove": true,
                "destruct": true
            }
        ]
    },
    "changeFloor": {
        "6,1": {
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
    "afterBattle": {
        "6,6": [
            "\t[吸血鬼,vampire]上帝阿!我做梦也没想到我会被别人打败。毫无疑问你是比我强。但以你现在的状态对于大法师来说又太弱了，你仅仅取得了一个暂时的胜利。",
            {
                "type": "playSound",
                "name": "开关门",
                "stop": true
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        5,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        6,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        7,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        4,
                        5
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        4,
                        6
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        4,
                        7
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        8,
                        5
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        8,
                        6
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        8,
                        7
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        5,
                        8
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        6,
                        8
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        7,
                        8
                    ]
                ]
            },
            {
                "type": "openDoor",
                "loc": [
                    6,
                    3
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    6,
                    9
                ],
                "async": true
            },
            {
                "type": "waitAsync"
            }
        ]
    },
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "fgmap": [

],
    "bgmap": [
    [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,206,  0,206,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,206,  0,206,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,206,206,206,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
],
    "downFloor": [
        6,
        10
    ],
    "upFloor": [
        6,
        2
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}