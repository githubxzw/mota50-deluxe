main.floors.MT43=
{
    "floorId": "MT43",
    "title": "魔塔 第43层",
    "name": "第 43 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 88,  0, 81,  0,204,  0, 81, 81,246,  0,  0,  1],
    [  1,  0,  0,  1,  1,  1,  0,  1,330,  0,330,  0,  1],
    [  1,  0,  0, 81,  0,  1,228,  1,  0,  0,  1,  0,  1],
    [  1, 82,  1,  1,220,  1,  0,228,  0, 42,  1,  0,  1],
    [  1,  0,204,  0,  0,  1,  1,  1,  1,  1,  1, 81,  1],
    [  1,  0,  1, 81,  1,  1, 32,  0, 81,  0,  0,  0,  1],
    [  1,  0,  1,  0,  0,204,  0,  0,  1,219,  0, 31,  1],
    [  1, 81,  1,  1,  1,  1,  1,  1,  1,  0, 21,  0,  1],
    [  1,  0,207,  1, 32,  0,228,  0,  1,  1,  1, 81,  1],
    [  1,  0,  0,  1, 32,  1,  1,  0, 81,  0,207,  0,  1],
    [  1, 87,  0,  1, 32,  0, 82,  0,  1,  0,  0, 22,  1],
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
        "8,1": {
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
            "data": [
                {
                    "type": "if",
                    "condition": "(blockId:8,1==='yellowDoor')",
                    "true": [
                        {
                            "type": "if",
                            "condition": "(item:yellowKey>=1)",
                            "true": [
                                {
                                    "type": "openDoor",
                                    "loc": [
                                        8,
                                        1
                                    ],
                                    "needKey": true
                                },
                                {
                                    "type": "setBlock",
                                    "number": "0",
                                    "loc": [
                                        [
                                            8,
                                            1
                                        ]
                                    ]
                                },
                                {
                                    "type": "show"
                                }
                            ],
                            "false": [
                                {
                                    "type": "tip",
                                    "text": "你没有黄钥匙！！"
                                }
                            ]
                        }
                    ],
                    "false": [
                        {
                            "type": "if",
                            "condition": "(blockId:9,1==='whiteKing')",
                            "true": [
                                {
                                    "type": "setBlock",
                                    "number": "yellowWall",
                                    "loc": [
                                        [
                                            8,
                                            2
                                        ],
                                        [
                                            10,
                                            2
                                        ]
                                    ]
                                },
                                {
                                    "type": "playSound",
                                    "name": "开关门"
                                },
                                {
                                    "type": "closeDoor",
                                    "id": "yellowWall",
                                    "loc": [
                                        7,
                                        1
                                    ],
                                    "async": true
                                },
                                {
                                    "type": "move",
                                    "loc": [
                                        9,
                                        1
                                    ],
                                    "time": 200,
                                    "keep": true,
                                    "steps": [
                                        "right:2"
                                    ]
                                },
                                {
                                    "type": "waitAsync"
                                },
                                {
                                    "type": "playSound",
                                    "name": "开关门"
                                },
                                {
                                    "type": "closeDoor",
                                    "id": "yellowWall",
                                    "loc": [
                                        10,
                                        1
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
                    ]
                }
            ]
        }
    },
    "changeFloor": {
        "1,11": {
            "floorId": ":next",
            "stair": "downFloor"
        },
        "1,1": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {
        "9,1": [
            {
                "type": "setBlock",
                "number": "yellowWall",
                "loc": [
                    [
                        8,
                        2
                    ],
                    [
                        10,
                        2
                    ]
                ]
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