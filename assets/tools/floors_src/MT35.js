main.floors.MT35=
{
    "floorId": "MT35",
    "title": "魔塔 第35层",
    "name": "第 35 层",
    "width": 13,
    "height": 13,
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
        "5,10": {
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
                "\t[小偷,thief]你好，暗道已挖好，你可用它绕过魔龙。",
                "\t[小偷,thief]我听说骑士队长（本区的头目）实力差又爱吹牛，所以被魔法警卫们讨厌。",
                "\t[小偷,thief]这魔塔太危险了，我可不想再次被抓，我要离塔回去了，再见。",
                {
                    "type": "move",
                    "time": 300,
                    "steps": [
                        "down:1",
                        "right:1"
                    ]
                },
                {
                    "type": "hide",
                    "remove": true,
                    "time": 500
                }
            ]
        }
    },
    "changeFloor": {
        "11,1": {
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
        "6,7": [
            {
                "type": "openDoor",
                "loc": [
                    6,
                    3
                ]
            },
            {
                "type": "hide",
                "loc": [
                    [
                        5,
                        7
                    ],
                    [
                        7,
                        7
                    ]
                ],
                "remove": true
            },
            {
                "type": "if",
                "condition": "flag:开启特性",
                "true": [],
                "false": [
                    {
                        "type": "setBlock",
                        "number": "bluePotion",
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
                            ]
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "snow",
                        "loc": [
                            [
                                6,
                                6
                            ]
                        ]
                    }
                ]
            }
        ]
    },
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0, 87,  1],
    [  1,  2,  2,  2,  2,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  2,  1,  1,  1,  1, 85,  1,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1, 32, 32, 32,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1,  0, 54,  0,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1, 17,257, 17,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1,  0,  0,  0,  1,  1,  1,  1,  1],
    [  1,  2,  1,  2,  1,123,  0,  0,  1,  1,  1,  1,  1],
    [  1,  2,  2,  2,  1,  0, 88,  0,  1,  1,  1,  1,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
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
    "fgmap": [

],
    "downFloor": [
        6,
        10
    ],
    "upFloor": [
        10,
        1
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}