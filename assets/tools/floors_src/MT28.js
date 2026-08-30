main.floors.MT28=
{
    "floorId": "MT28",
    "title": "魔塔 第28层",
    "name": "第 28 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  1],
    [  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  1],
    [  1,  0,  0,  0,  0,  0,  1,  0,124,  0,  1,  0,  1],
    [  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  1],
    [  1,  0,  0,  0,  0,  0,  1,  1,  0,  1,  1,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1, 87,  0,  0,  0,  0,  0,  0,  0,  0,  0, 88,  1],
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
        "8,4": [
            {
                "type": "while",
                "condition": "true",
                "data": [
                    {
                        "type": "choices",
                        "text": "\t[商人,specialTrader]我按100个金币一把的价格回收黄钥匙，你出售吗？",
                        "choices": [
                            {
                                "text": "我太需要了",
                                "action": [
                                    {
                                        "type": "if",
                                        "condition": "(item:yellowKey>=1)",
                                        "true": [
                                            {
                                                "type": "playSound",
                                                "name": "获得道具"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "item:yellowKey",
                                                "operator": "-=",
                                                "value": "1"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "status:money",
                                                "operator": "+=",
                                                "value": "100"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "flag:黄钥匙出售次数",
                                                "operator": "+=",
                                                "value": "1"
                                            }
                                        ],
                                        "false": [
                                            {
                                                "type": "tip",
                                                "text": "你没有黄钥匙"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "text": "卖5把",
                                "condition": "flag:额外功能开关",
                                "action": [
                                    {
                                        "type": "if",
                                        "condition": "(item:yellowKey>=5)",
                                        "true": [
                                            {
                                                "type": "playSound",
                                                "name": "获得道具"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "item:yellowKey",
                                                "operator": "-=",
                                                "value": "5"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "status:money",
                                                "operator": "+=",
                                                "value": "500"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "flag:黄钥匙出售次数",
                                                "operator": "+=",
                                                "value": "5"
                                            }
                                        ],
                                        "false": [
                                            {
                                                "type": "tip",
                                                "text": "黄钥匙不够"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "text": "全卖了",
                                "condition": "flag:额外功能开关",
                                "action": [
                                    {
                                        "type": "if",
                                        "condition": "(item:yellowKey>=1)",
                                        "true": [
                                            {
                                                "type": "playSound",
                                                "name": "获得道具"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "flag:当前黄钥匙数",
                                                "value": "item:yellowKey"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "item:yellowKey",
                                                "value": "0"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "status:money",
                                                "operator": "+=",
                                                "value": "100*flag:当前黄钥匙数"
                                            },
                                            {
                                                "type": "setValue",
                                                "name": "flag:黄钥匙出售次数",
                                                "operator": "+=",
                                                "value": "flag:当前黄钥匙数"
                                            }
                                        ],
                                        "false": [
                                            {
                                                "type": "tip",
                                                "text": "你没有黄钥匙"
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