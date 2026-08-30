main.floors.MT10=
{
    "floorId": "MT10",
    "title": "魔塔 第10层",
    "name": "第 10 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  0,209,  0,  1,  1, 17,  1,  1,  0,  0,  0,  1],
    [  1,  0,210,  0, 85, 17,211, 17, 85,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1, 17,  0, 17,  1,  1,  1,  1,  1],
    [  1,209, 28,209,  1,330,  0,330,  1,209, 27,209,  1],
    [  1,  0,210,  0,  1,  1,  0,  1,  1,  0,210,  0,  1],
    [  1,  0,  0,  0,  1,  1,  0,  1,  1,  0,  0,  0,  1],
    [  1, 81,  1, 81,  1,  1, 83,  1,  1, 81,  1, 81,  1],
    [  1,  0,  1,  0,  1,  0,  0,  0,  1,  0,  1,  0,  1],
    [  1, 88,  1,  0,217,  0, 87,  0,217,  0,  1, 32,  1],
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
        "6,11": {
            "trigger": null,
            "enable": false,
            "noPass": null,
            "displayDamage": true,
            "data": []
        },
        "6,2": [
            "\t[骷髅队长,skeletonCaptain]你怎能杀出重围？我是决不会让你通过的，来吧，我要与你决斗!",
            {
                "type": "hide",
                "remove": true,
                "time": 0
            }
        ],
        "6,9": [
            {
                "type": "if",
                "condition": "flag:10f战胜骷髅队长",
                "true": [
                    {
                        "type": "generateMove",
                        "loc": [
                            1,
                            11
                        ],
                        "id": "thief",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 500,
                        "zIndex": 100,
                        "steps": [
                            "up:3",
                            "right:2",
                            "down:3",
                            "right:2",
                            "up:1",
                            "right:1"
                        ]
                    },
                    "\t[小偷,thief]嘿！我们又见面了！非常感谢你打败了此区域的头目。我正苦恼于如何到更高的楼层，现在我终于可以上去了。 我听说银盾在11楼，银剑在17楼，这消息不知道对你是否有用。",
                    {
                        "type": "move",
                        "loc": [
                            6,
                            10
                        ],
                        "time": 200,
                        "steps": [
                            "down:1"
                        ]
                    },
                    {
                        "type": "hide",
                        "remove": true,
                        "time": 0
                    }
                ],
                "false": []
            }
        ],
        "6,1": [
            {
                "type": "if",
                "condition": "flag:10f机关",
                "true": [],
                "false": [
                    "\t[骷髅队长,skeletonCaptain]不,这是不可能的， 你怎会打败我！ 你别太得意，后面还有许多强大的对手和机关存在，你稍有疏忽就必死无疑。",
                    {
                        "type": "playSound",
                        "name": "开关门",
                        "stop": true
                    },
                    {
                        "type": "setBlock",
                        "number": "27",
                        "loc": [
                            [
                                1,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "27",
                        "loc": [
                            [
                                2,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "27",
                        "loc": [
                            [
                                3,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "28",
                        "loc": [
                            [
                                9,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "28",
                        "loc": [
                            [
                                10,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "28",
                        "loc": [
                            [
                                11,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "32",
                        "loc": [
                            [
                                1,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "32",
                        "loc": [
                            [
                                2,
                                4
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
                        "number": "21",
                        "loc": [
                            [
                                9,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "21",
                        "loc": [
                            [
                                10,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "21",
                        "loc": [
                            [
                                11,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "0",
                        "loc": [
                            [
                                6,
                                9
                            ]
                        ]
                    },
                    {
                        "type": "show",
                        "loc": [
                            [
                                6,
                                9
                            ]
                        ],
                        "time": 0
                    },
                    {
                        "type": "show",
                        "loc": [
                            [
                                6,
                                11
                            ]
                        ],
                        "time": 0
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            4,
                            4
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            6,
                            7
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            8,
                            4
                        ],
                        "async": true
                    },
                    {
                        "type": "waitAsync"
                    },
                    {
                        "type": "setValue",
                        "name": "flag:10f战胜骷髅队长",
                        "value": "true"
                    },
                    {
                        "type": "hide",
                        "remove": true,
                        "destruct": true
                    }
                ]
            }
        ],
        "6,5": [
            {
                "type": "closeDoor",
                "id": "specialDoor",
                "loc": [
                    6,
                    7
                ],
                "async": true
            },
            {
                "type": "playBgm",
                "name": "10F.mp3"
            },
            {
                "type": "openDoor",
                "loc": [
                    4,
                    4
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    8,
                    4
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    5,
                    6
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    7,
                    6
                ],
                "async": true
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "setBlock",
                "number": "0",
                "loc": [
                    [
                        5,
                        4
                    ],
                    [
                        6,
                        3
                    ],
                    [
                        7,
                        4
                    ],
                    [
                        5,
                        5
                    ],
                    [
                        7,
                        5
                    ]
                ]
            },
            "\t[skeletonCaptain]哈哈哈, 你是如此的幸运能安全到达这里。 但现在好运离你而去了，你中埋伏了，弟兄们给我上。",
            {
                "type": "if",
                "condition": "(blockId:6,4==='skeletonCaptain')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            6,
                            4
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "up:3"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "generateMove",
                        "loc": [
                            6,
                            4
                        ],
                        "id": "skeletonCaptain",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "up:3"
                        ]
                    }
                ]
            },
            {
                "type": "if",
                "condition": "(blockId:2,4==='skeletonSoldier')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            2,
                            4
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "right:3",
                            "down:2",
                            "right:1"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                2,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            2,
                            4
                        ],
                        "id": "skeletonSoldier",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "right:3",
                            "down:2",
                            "right:1"
                        ]
                    }
                ]
            },
            {
                "type": "if",
                "condition": "(blockId:10,4==='skeletonSoldier')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            10,
                            4
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "left:4"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                10,
                                4
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            10,
                            4
                        ],
                        "id": "skeletonSoldier",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "left:4"
                        ]
                    }
                ]
            },
            {
                "type": "sleep",
                "time": 600
            },
            {
                "type": "closeDoor",
                "id": "specialDoor",
                "loc": [
                    6,
                    3
                ],
                "async": true
            },
            {
                "type": "if",
                "condition": "(blockId:3,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            3,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:2",
                            "down:2"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                3,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            3,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:2",
                            "down:2"
                        ]
                    }
                ]
            },
            {
                "type": "if",
                "condition": "(blockId:9,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            9,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:2",
                            "down:2"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                9,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            9,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:2",
                            "down:2"
                        ]
                    }
                ]
            },
            {
                "type": "sleep",
                "time": 200
            },
            {
                "type": "if",
                "condition": "(blockId:2,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            2,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:3",
                            "down:1"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                2,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            2,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:3",
                            "down:1"
                        ]
                    }
                ]
            },
            {
                "type": "if",
                "condition": "(blockId:10,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            10,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:3",
                            "down:1"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                10,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            10,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:3",
                            "down:1"
                        ]
                    }
                ]
            },
            {
                "type": "sleep",
                "time": 200
            },
            {
                "type": "if",
                "condition": "(blockId:1,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            1,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:4"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                1,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            1,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "right:4"
                        ]
                    }
                ]
            },
            {
                "type": "if",
                "condition": "(blockId:11,3==='skeleton')",
                "true": [
                    {
                        "type": "move",
                        "loc": [
                            11,
                            3
                        ],
                        "time": 200,
                        "keep": true,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:4"
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setBgFgBlock",
                        "name": "bg",
                        "number": "0",
                        "loc": [
                            [
                                11,
                                3
                            ]
                        ]
                    },
                    {
                        "type": "generateMove",
                        "loc": [
                            11,
                            3
                        ],
                        "id": "skeleton",
                        "time": 200,
                        "keep": true,
                        "fadeInTime": 0,
                        "zIndex": 100,
                        "async": true,
                        "steps": [
                            "down:1",
                            "left:4"
                        ]
                    }
                ]
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "closeDoor",
                "id": "specialDoor",
                "loc": [
                    4,
                    4
                ],
                "async": true
            },
            {
                "type": "closeDoor",
                "id": "specialDoor",
                "loc": [
                    8,
                    4
                ],
                "async": true
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "setValue",
                "name": "switch:A",
                "value": "true"
            },
            {
                "type": "setValue",
                "name": "flag:10f机关",
                "value": "true"
            },
            {
                "type": "hide",
                "remove": true
            }
        ]
    },
    "changeFloor": {
        "6,11": {
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
    "afterBattle": {
        "6,1": [
            "\t[骷髅队长,skeletonCaptain]不,这是不可能的， 你怎会打败我！ 你别太得意，后面还有许多强大的对手和机关存在，你稍有疏忽就必死无疑。",
            {
                "type": "playSound",
                "name": "开关门",
                "stop": true
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        1,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        2,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "27",
                "loc": [
                    [
                        3,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        9,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        10,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "28",
                "loc": [
                    [
                        11,
                        3
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        1,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "32",
                "loc": [
                    [
                        2,
                        4
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
                "number": "21",
                "loc": [
                    [
                        9,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        10,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "21",
                "loc": [
                    [
                        11,
                        4
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "0",
                "loc": [
                    [
                        6,
                        9
                    ]
                ]
            },
            {
                "type": "show",
                "loc": [
                    [
                        6,
                        9
                    ]
                ],
                "time": 0
            },
            {
                "type": "show",
                "loc": [
                    [
                        6,
                        11
                    ]
                ],
                "time": 0
            },
            {
                "type": "openDoor",
                "loc": [
                    4,
                    4
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    6,
                    7
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    8,
                    4
                ],
                "async": true
            },
            {
                "type": "setValue",
                "name": "flag:10f战胜骷髅队长",
                "value": "true"
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
    [ 17,209,  0,209,  0,  0,  0,  0,  0,209,209,209, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,210,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17],
    [ 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
],
    "upFloor": [
        6,
        10
    ],
    "downFloor": [
        1,
        10
    ],
    "autoEvent": {
        "6,3": {
            "0": {
                "condition": "flag:10f机关 && core.getBlockId(5,4) === null && core.getBlockId(6,4) === null && core.getBlockId(7,4) === null && core.getBlockId(5,5) === null && core.getBlockId(7,5) === null && core.getBlockId(5,6) === null && core.getBlockId(6,6) === null && core.getBlockId(7,6) === null",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "openDoor"
                    }
                ]
            },
            "1": null
        }
    },
    "beforeBattle": {},
    "cannotMoveIn": {}
}