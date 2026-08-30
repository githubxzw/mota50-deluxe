main.floors.MT26=
{
    "floorId": "MT26",
    "title": "魔塔 第26层",
    "name": "第 26 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,  0,  1],
    [  1,  0,  0,  1,  1,  1,330,  1,  1,  1,  0,  0,  1],
    [  1,  0,  1,  1,  1,  5,  5,  5,  1,  1,  1,  0,  1],
    [  1,  0,  1,  1,  5,  5,  5,  5,  5,  1,  1,  0,  1],
    [  1,  0,  1,  1,  5,  5,132,  5,  5,  1,  1,  0,  1],
    [  1,  0,  1,  1,  5,  5,  5,  5,  5,  1,  1,  0,  1],
    [  1,  0,  1,  1,  1,  5, 83,  5,  1,  1,  1,  0,  1],
    [  1,  0,  0,  1,  1,  1, 83,  1,  1,  1,  0,  0,  1],
    [  1,  0, 87,  0,  1,  1, 83,  1,  1,  0,  0,  0,  1],
    [  1, 88,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 3,
    "defaultGround": "ground",
    "bgm": "section3.mp3",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "6,6": [
            {
                "type": "if",
                "condition": "flag:营救公主",
                "true": [
                    "\t[洋娃娃,princess]时间到了，你已被命运选中。如果你不怕死亡,你最终将通过时空来到我这里。",
                    "\t[hero]哦! 什么? 这只是个洋娃娃!"
                ],
                "false": [
                    "\t[洋娃娃,princess]时间到了，你已被命运选中。如果你不怕死亡,你最终将通过时空来到我这里。",
                    "\t[hero]哦! 什么? 这只是个洋娃娃!",
                    {
                        "type": "setBlock",
                        "number": "whiteWall2",
                        "loc": [
                            [
                                6,
                                1
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "setBlock",
                        "number": "1",
                        "loc": [
                            [
                                5,
                                1
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "setBlock",
                        "number": "1",
                        "loc": [
                            [
                                7,
                                1
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "setBlock",
                        "number": "0",
                        "loc": [
                            [
                                6,
                                2
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "setBlock",
                        "number": "0",
                        "loc": [
                            [
                                6,
                                3
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "setBlock",
                        "number": "0",
                        "loc": [
                            [
                                6,
                                4
                            ]
                        ],
                        "floorId": "MT24"
                    },
                    {
                        "type": "show",
                        "loc": [
                            [
                                6,
                                2
                            ]
                        ],
                        "floorId": "MT24",
                        "time": 0
                    },
                    {
                        "type": "setValue",
                        "name": "flag:营救公主",
                        "value": "true"
                    },
                    {
                        "type": "playBgm",
                        "name": "Princess.mp3",
                        "keep": true
                    }
                ]
            }
        ]
    },
    "changeFloor": {
        "2,10": {
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
    "fgmap": [

],
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
    "upFloor": [
        2,
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