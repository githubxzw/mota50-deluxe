main.floors.MT41=
{
    "floorId": "MT41",
    "title": "魔塔 第41层",
    "name": "第 41 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 31,  1,  0, 22,  1, 88,330, 22,  0,  1, 31,  1],
    [  1, 81,220,  0,  0,  1,  0,  1,  0,  0,330, 81,  1],
    [  1, 81,  1,  0,  1,  1,  0,  1,  1,  0,  1, 81,  1],
    [  1, 81,  1, 81,  1,246,  0,246,  1, 81,  1, 81,  1],
    [  1,  0,  0,219,  1,  1,  0,  1,  1,219,  0,  0,  1],
    [  1,207,  0,  0,  0, 82,  0, 82,  0,  0,  0,207,  1],
    [  1,  0,207,  0,204,  1, 81,  1,204,  0,207,  0,  1],
    [  1, 81,  1,  1, 81,  1, 81,  1, 81,  1,  1, 81,  1],
    [  1, 81,  1, 31,  0,  1, 81,  1,  0, 31,  1, 81,  1],
    [  1, 81,  1, 21, 21,  1,  0,  1, 21, 21,  1, 81,  1],
    [  1, 32,  1, 21, 27,  1, 87,  1, 28, 21,  1, 32,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
    "canFlyTo": true,
    "canFlyFrom": true,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 5,
    "defaultGround": "ground",
    "bgm": "section5.mp3",
    "firstArrive": [
        {
            "type": "show",
            "loc": [
                [
                    6,
                    10
                ]
            ],
            "floorId": "MT42",
            "time": 0
        }
    ],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "10,2": [
            {
                "type": "if",
                "condition": "((flag:41==1 )&&(( status:x===9 )&&(( status:y===2 )&& core.hasVisitedFloor('MT42'))))",
                "true": [
                    {
                        "type": "playSound",
                        "name": "开关门"
                    },
                    {
                        "type": "sleep",
                        "time": 200
                    },
                    {
                        "type": "setBlock",
                        "number": "220",
                        "destruct": true
                    },
                    {
                        "type": "setValue",
                        "name": "flag:41",
                        "value": "2"
                    },
                    {
                        "type": "sleep",
                        "time": 200
                    }
                ],
                "false": []
            }
        ]
    },
    "changeFloor": {
        "6,11": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "6,1": {
            "floorId": ":before",
            "stair": "upFloor",
            "time": 0
        }
    },
    "afterBattle": {
        "2,2": [
            {
                "type": "setValue",
                "name": "flag:41",
                "value": "1"
            }
        ],
        "10,2": [
            {
                "type": "sleep",
                "time": 200
            },
            {
                "type": "playSound",
                "name": "开关门"
            },
            {
                "type": "setBlock",
                "number": "0",
                "loc": [
                    [
                        5,
                        6
                    ],
                    [
                        7,
                        6
                    ]
                ]
            },
            {
                "type": "closeDoor",
                "id": "yellowWall",
                "loc": [
                    5,
                    6
                ],
                "async": true
            },
            {
                "type": "closeDoor",
                "id": "yellowWall",
                "loc": [
                    6,
                    6
                ],
                "async": true
            },
            {
                "type": "closeDoor",
                "id": "yellowWall",
                "loc": [
                    7,
                    6
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    5,
                    7
                ],
                "async": true
            },
            {
                "type": "openDoor",
                "loc": [
                    7,
                    7
                ],
                "async": true
            },
            {
                "type": "waitAsync"
            },
            {
                "type": "setBlock",
                "number": "downFly",
                "loc": [
                    [
                        6,
                        5
                    ]
                ]
            },
            {
                "type": "setBlock",
                "number": "yellowWall",
                "loc": [
                    [
                        7,
                        1
                    ]
                ]
            },
            {
                "type": "tip",
                "text": "降临之翼出现了"
            },
            {
                "type": "hide",
                "remove": true,
                "time": 0
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
        6,
        10
    ],
    "downFloor": [
        6,
        2
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}