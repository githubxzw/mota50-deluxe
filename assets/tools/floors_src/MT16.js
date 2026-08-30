main.floors.MT16=
{
    "floorId": "MT16",
    "title": "魔塔 第16层",
    "name": "第 16 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 21,206,  0,  1,  0, 88,  0,  1,  0,  0,206,  1],
    [  1, 21,218,  0, 81,  0,  0,  0, 81,203,  0,  0,  1],
    [  1, 21,206,  0,  1,213,  0, 21,  1,  0,  0, 31,  1],
    [  1,  1,  1,  1,  1,  1, 82,  1,  1,  1, 81,  1,  1],
    [  1, 27, 21,  0,  1, 31,  0,  0,  1,  0,213,  0,  1],
    [  1, 31,  0,215, 81,  0,214,  0,  1,  0,  0,  0,  1],
    [  1, 28, 21,  0,  1,  0,  0, 21,  1,206,  0, 22,  1],
    [  1,  1,  2,  1,  1,  1, 81,  1,  1,  1, 81,  1,  1],
    [  1,  0,203,  0,  1,206,  0,206,  1,  0,218,  0,  1],
    [  1,  0,  0,  0, 81,  0,  0,  0, 81,  0,  1,  1,  1],
    [  1,121,  0,  0,  1,  0, 87,  0,  1,216,  2,  3,  1],
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
        "11,11": {
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
                            "type": "choices",
                            "text": "\t[老人,oldman]很好，你居然找到了我，做为奖励我将给你一瓶圣水。喝了它将按你的攻击和防御力的总和增加你的生命点数，你越晚用它效果越好。",
                            "choices": [
                                {
                                    "text": "谢谢",
                                    "action": [
                                        {
                                            "type": "setValue",
                                            "name": "item:superPotion",
                                            "operator": "+=",
                                            "value": "1"
                                        },
                                        {
                                            "type": "hide",
                                            "remove": true,
                                            "time": 500
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
                            "number": "oldman"
                        },
                        {
                            "type": "setValue",
                            "name": "switch:A",
                            "value": "true"
                        }
                    ]
                }
            ]
        }
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
    "afterBattle": {},
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