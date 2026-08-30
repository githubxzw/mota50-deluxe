main.floors.MT12=
{
    "floorId": "MT12",
    "title": "魔塔 第12层",
    "name": "第 12 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,122,  2,  0,  1, 21, 27, 21,  1,  0,  2,  3,  1],
    [  1,  1,  1,206,  1,  0,  1,  0,  1,  0,  1,  1,  1],
    [  1,  0,  0,  0,  1,218,  0,218,  1,  0,213,  0,  1],
    [  1, 81,  1,  1,  1,  1, 81,  1,  1,  1,  1,  0,  1],
    [  1,  0,218,  0, 81,  0,213,  0,  1, 31,  0,206,  1],
    [  1,  1,  1,  1,  1,  0,  0,218, 81,  0, 28,  0,  1],
    [  1, 21, 21,  0,  1,  0, 32,  0,  1, 21,  0,203,  1],
    [  1, 21, 22,  0,  1,  1,  1,  1,  1, 82,  1, 81,  1],
    [  1,  0,  0,213,  1,  7,131,  8,  1,203,  0,213,  1],
    [  1,  1,  1, 81,  1, 31,  0, 31,  1,  1,  0,  1,  1],
    [  1, 87,  0,  0,205,  0,  0,  0,205,  0,  0, 88,  1],
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
    "events": {
        "11,1": {
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
                    "condition": "switch:A",
                    "true": [
                        {
                            "type": "while",
                            "condition": "true",
                            "data": [
                                {
                                    "type": "choices",
                                    "text": "\t[商人,specialTrader]我有许多黄钥匙1000个金币一把你要吗？",
                                    "choices": [
                                        {
                                            "text": "我太需要了",
                                            "action": [
                                                {
                                                    "type": "if",
                                                    "condition": "(status:money>=1000)",
                                                    "true": [
                                                        {
                                                            "type": "setValue",
                                                            "name": "status:money",
                                                            "operator": "-=",
                                                            "value": "1000"
                                                        },
                                                        {
                                                            "type": "setValue",
                                                            "name": "item:yellowKey",
                                                            "operator": "+=",
                                                            "value": "1"
                                                        }
                                                    ],
                                                    "false": [
                                                        {
                                                            "type": "tip",
                                                            "text": "你的金币不足1000枚，无法交易！"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "下次再说",
                                            "action": [
                                                {
                                                    "type": "break",
                                                    "n": 1
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "false": [
                        {
                            "type": "playSound",
                            "name": "开关门"
                        },
                        {
                            "type": "openDoor"
                        },
                        {
                            "type": "setBlock",
                            "number": "specialTrader"
                        },
                        {
                            "type": "setValue",
                            "name": "switch:A",
                            "value": "true"
                        }
                    ]
                }
            ]
        },
        "6,9": [
            {
                "type": "setValue",
                "name": "flag:ratio",
                "value": "2"
            },
            {
                "type": "insert",
                "name": "商店"
            }
        ]
    },
    "changeFloor": {
        "1,11": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "11,11": {
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
        10,
        11
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}