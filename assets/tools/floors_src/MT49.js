main.floors.MT49=
{
    "floorId": "MT49",
    "title": "魔塔 第49层",
    "name": "第 49 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,330,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1],
    [  1,  1,  1,  0,  0,  0, 17,  0,  0,  0,  1,  1,  1],
    [  1,  1,  0,  0,  0, 17,321, 17,  0,  0,  0,  1,  1],
    [  1,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  1],
    [  1,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  1],
    [  1,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  1],
    [  1,  0,  1,  0,  1,  1, 85,  1,  1,  0,  1,  0,  1],
    [  1,  0,  1,  0,  1,228,  0,228,  1,  0,  1,  0,  1],
    [  1,  0,  0,  0,  1,  1, 85,  1,  1,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1,220,  0,220,  1,  1,  1,  1,  1],
    [  1, 88,  0, 83,  0,  0,  0,  0,  0,  0,  0,  0,  1],
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
        "6,6": [
            {
                "type": "setBlock",
                "number": "specialDoor",
                "loc": [
                    [
                        6,
                        7
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "redKing",
                "loc": [
                    [
                        6,
                        3
                    ]
                ],
                "time": 500
            },
            "\t[魔王,redKing]你终于来了，我很想与你立刻决斗，但我的部下不同意。",
            {
                "type": "playBgm",
                "name": "Zeno.mp3"
            },
            {
                "type": "setBlock",
                "number": "0",
                "loc": [
                    [
                        5,
                        3
                    ],
                    [
                        6,
                        2
                    ],
                    [
                        7,
                        3
                    ],
                    [
                        6,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "whiteKing",
                "loc": [
                    [
                        5,
                        2
                    ],
                    [
                        5,
                        3
                    ],
                    [
                        5,
                        4
                    ],
                    [
                        6,
                        4
                    ],
                    [
                        7,
                        4
                    ],
                    [
                        7,
                        3
                    ],
                    [
                        7,
                        2
                    ],
                    [
                        6,
                        2
                    ]
                ],
                "time": 500
            },
            {
                "type": "hide",
                "time": 0
            }
        ]
    },
    "changeFloor": {
        "1,11": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {
        "5,10": [
            {
                "type": "if",
                "condition": "flag:491",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            6,
                            9
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:491",
                        "value": "1"
                    }
                ]
            }
        ],
        "7,10": [
            {
                "type": "if",
                "condition": "flag:491",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            6,
                            9
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:491",
                        "value": "1"
                    }
                ]
            }
        ],
        "5,8": [
            {
                "type": "if",
                "condition": "flag:492",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            6,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:492",
                        "value": "1"
                    }
                ]
            }
        ],
        "7,8": [
            {
                "type": "if",
                "condition": "flag:492",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            6,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:492",
                        "value": "1"
                    }
                ]
            }
        ],
        "6,3": [
            "\t[魔王,redKing]哈哈哈，很好，你是个合格的战士。",
            {
                "type": "hide",
                "loc": [
                    [
                        5,
                        2
                    ],
                    [
                        6,
                        2
                    ],
                    [
                        7,
                        2
                    ],
                    [
                        5,
                        3
                    ],
                    [
                        6,
                        3
                    ],
                    [
                        7,
                        3
                    ],
                    [
                        5,
                        4
                    ],
                    [
                        6,
                        4
                    ],
                    [
                        7,
                        4
                    ]
                ],
                "time": 0
            },
            {
                "type": "setBlock",
                "number": "23",
                "loc": [
                    [
                        5,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "62",
                "loc": [
                    [
                        7,
                        2
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        2,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        3,
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
                "number": "28",
                "loc": [
                    [
                        10,
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
                        5
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        6,
                        5
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        7,
                        5
                    ]
                ]
            },
            {
                "type": "show",
                "loc": [
                    [
                        5,
                        2
                    ],
                    [
                        7,
                        2
                    ]
                ],
                "time": 0
            },
            {
                "type": "openDoor",
                "loc": [
                    6,
                    7
                ]
            },
            {
                "type": "openDoor",
                "loc": [
                    6,
                    9
                ]
            }
        ],
        "6,4": [],
        "7,4": [],
        "7,2": [],
        "5,2": [],
        "6,2": [],
        "7,3": [],
        "5,3": [],
        "5,4": []
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
        2,
        11
    ],
    "autoEvent": {
        "1,1": {
            "0": {
                "condition": "core.getBlockId(5,2) === 'whiteKing' && core.getBlockId(6,2) === null && core.getBlockId(7,2) === 'whiteKing' && core.getBlockId(5,3) === null && core.getBlockId(7,3) === null && \ncore.getBlockId(5,4) === 'whiteKing' && core.getBlockId(6,4) === null && core.getBlockId(7,4) === 'whiteKing'",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "if",
                        "condition": "flag:与50层小偷对话",
                        "true": [
                            {
                                "type": "setValue",
                                "name": "flag:TE",
                                "value": "true"
                            }
                        ],
                        "false": []
                    },
                    {
                        "type": "setEnemy",
                        "id": "redKing",
                        "name": "hp",
                        "operator": "/=",
                        "value": "10"
                    },
                    {
                        "type": "setEnemy",
                        "id": "redKing",
                        "name": "atk",
                        "operator": "/=",
                        "value": "10"
                    },
                    {
                        "type": "setEnemy",
                        "id": "redKing",
                        "name": "def",
                        "operator": "/=",
                        "value": "10"
                    },
                    {
                        "type": "update"
                    },
                    "\t[redKing]啊！，我怎么被封印了，我只剩下一成的功力了！！！"
                ]
            },
            "1": null
        }
    },
    "beforeBattle": {},
    "cannotMoveIn": {}
}