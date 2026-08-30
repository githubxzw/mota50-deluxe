main.floors.MT2=
{
    "floorId": "MT2",
    "title": "魔塔 第02层",
    "name": "第 2 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 88,  0, 82,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  1,  1,  0,222,  0,222,  0,  1,  1,  1],
    [  1,  0,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1],
    [  1,  0,  1, 21, 21,  1,  0,  0,  0,  1,  0,121,  1],
    [  1,  0,  1, 21,  0, 86,  0,  0,  0, 86,  0,  0,  1],
    [  1,  0,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1],
    [  1,  0,330,123,  0,  1,  0,  0,  0,  1,  0,124,  1],
    [  1,  0,  1,  0,  0, 86,  0,  0,  0, 86,  0,  0,  1],
    [  1,  0,330,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1],
    [  1,  0,  1, 32, 32,  1,  0,  0,  0,  1,  0,  0,  1],
    [  1, 87,  1, 32,  0, 86,  0,  0,  0, 86,123,  0,  1],
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
        "3,7": [
            "\t[小偷,thief]你清醒了吗？你到监狱时还处在昏迷中，魔法警卫把你扔到我这个房间。但你很幸运，我刚完成逃跑的暗道你就醒了，我们一起越狱吧。",
            {
                "type": "openDoor",
                "loc": [
                    2,
                    7
                ]
            },
            {
                "type": "show",
                "loc": [
                    [
                        1,
                        8
                    ]
                ],
                "time": 0
            },
            {
                "type": "move",
                "time": 200,
                "keep": true,
                "steps": [
                    "left:2",
                    "down:2"
                ]
            },
            {
                "type": "hide",
                "time": 0
            }
        ],
        "11,7": [
            {
                "type": "choices",
                "text": "\t[商人,specialTrader]谢谢你救了我，我能用祝福魔法提升你 3% 的攻击力和防御力。现在就提升吗？",
                "choices": [
                    {
                        "text": "现在提升",
                        "action": [
                            {
                                "type": "playSound",
                                "name": "获得道具"
                            },
                            {
                                "type": "setValue",
                                "name": "status:atk",
                                "operator": "+=",
                                "value": "Math.round(status:atk*0.03)"
                            },
                            {
                                "type": "setValue",
                                "name": "status:def",
                                "operator": "+=",
                                "value": "Math.round(status:def*0.03)"
                            },
                            {
                                "type": "tip",
                                "text": "你受到了祝福，攻击和防御都提升了3%"
                            },
                            {
                                "type": "hide",
                                "time": 500
                            }
                        ]
                    },
                    {
                        "text": "等会再说",
                        "action": []
                    }
                ]
            }
        ],
        "1,9": {
            "trigger": null,
            "enable": false,
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
            "data": [
                "\t[小偷,thief]我们终于逃出来了。你的剑和盾被警卫拿走了，你必须先找到武器。我知道铁剑在5楼，铁盾在9楼，你最好先取到它们。我现在有事要做没法帮你，再见。",
                {
                    "type": "move",
                    "time": 200,
                    "steps": [
                        "down:2"
                    ]
                },
                {
                    "type": "hide",
                    "time": 0
                }
            ]
        },
        "10,11": {
            "trigger": null,
            "enable": false,
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
            "data": [
                "\t[小偷,thief]哈哈，我们又见面了! 谢谢你救了我。我可以帮你在魔龙前打开一条暗道，我现在就去35楼。",
                {
                    "type": "setBlock",
                    "number": "0",
                    "loc": [
                        [
                            4,
                            9
                        ]
                    ],
                    "floorId": "MT35"
                },
                {
                    "type": "show",
                    "loc": [
                        [
                            5,
                            10
                        ]
                    ],
                    "floorId": "MT35",
                    "time": 0
                },
                {
                    "type": "hide",
                    "time": 500
                }
            ]
        }
    },
    "changeFloor": {
        "1,11": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "1,1": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {
        "6,2": [
            {
                "type": "if",
                "condition": "flag:2",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            5
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            8
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            11
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            5
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            8
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            11
                        ],
                        "async": true
                    },
                    {
                        "type": "waitAsync"
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:2",
                        "value": "1"
                    }
                ]
            }
        ],
        "8,2": [
            {
                "type": "if",
                "condition": "flag:2",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            5
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            8
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            5,
                            11
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            5
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            8
                        ],
                        "async": true
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            9,
                            11
                        ],
                        "async": true
                    },
                    {
                        "type": "waitAsync"
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:2",
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
    "upFloor": [
        1,
        10
    ],
    "downFloor": [
        1,
        2
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}