main.floors.MT17=
{
    "floorId": "MT17",
    "title": "魔塔 第17层",
    "name": "第 17 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  1,  0, 87,  0,  1, 27,  0, 28,  1],
    [  1,  0, 37,  0,  1,  0,  0,  0,  1,  0, 32,  0,  1],
    [  1,  0,  0,  0,  1,214,  1,206,  1, 21,  0, 21,  1],
    [  1,  1, 85,  1,  1,  0,  1,  0,  1,  1, 85,  1,  1],
    [  1,221,  0,221,  1, 81,  1, 82,  1,214,  0,214,  1],
    [  1,  0,  0,  0,  1,  0,  1,  0,  1,  0,  0,  0,  1],
    [  1,  1, 85,  1,  1,213,  1,203,  1,  1, 85,  1,  1],
    [  1,221,  0,221,  1,  0,  0,  0,  1,213,  0,213,  1],
    [  1,  0,  0,  0,  1,  1,218,  1,  1,  0,  0,  0,  1],
    [  1,  1, 81,  1,  1,  0,  0,  0,  1,  1, 81,  1,  1],
    [  1, 31,  0,  0,206,  0, 88,  0,206,  0,  0, 31,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 2,
    "defaultGround": "ground",
    "bgm": "section2.mp3",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {},
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
        "1,8": [
            {
                "type": "if",
                "condition": "flag:171",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:171",
                        "value": "1"
                    }
                ]
            }
        ],
        "3,8": [
            {
                "type": "if",
                "condition": "flag:171",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:171",
                        "value": "1"
                    }
                ]
            }
        ],
        "1,5": [
            {
                "type": "if",
                "condition": "flag:172",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            4
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:172",
                        "value": "1"
                    }
                ]
            }
        ],
        "3,5": [
            {
                "type": "if",
                "condition": "flag:172",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            2,
                            4
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:172",
                        "value": "1"
                    }
                ]
            }
        ],
        "9,8": [
            {
                "type": "if",
                "condition": "flag:173",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:173",
                        "value": "1"
                    }
                ]
            }
        ],
        "11,8": [
            {
                "type": "if",
                "condition": "flag:173",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            7
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:173",
                        "value": "1"
                    }
                ]
            }
        ],
        "9,5": [
            {
                "type": "if",
                "condition": "flag:174",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            4
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:174",
                        "value": "1"
                    }
                ]
            }
        ],
        "11,5": [
            {
                "type": "if",
                "condition": "flag:174",
                "true": [
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            4
                        ]
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "operator": "+=",
                        "name": "flag:174",
                        "value": "1"
                    }
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
    "downFloor": [
        5,
        11
    ],
    "upFloor": [
        6,
        2
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}