main.floors.MT33=
{
    "floorId": "MT33",
    "title": "魔塔 第33层",
    "name": "第 33 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 87,  0, 81,214,  0,216, 81,  0,  0,  0, 88,  1],
    [  1,  0,  0,  1,  0, 31,  0,  1, 81,  1,  1,  1,  1],
    [  1, 82,  1,  1,121,  0, 21,  1,  0,  0,  0, 32,  1],
    [  1,  0, 31,  1,  1, 81,  1,  1,  1,  1,  0,330,  1],
    [  1,216,  0,  1,  0,  0,214,  0,  1,212,  0,212,  1],
    [  1,  0,  0,  1,224,  1,  1, 81,  1,  0,  0,  0,  1],
    [  1,  0,216, 81,  0,  0,212,  0,  1,225,  0,225,  1],
    [  1, 81,  1,  1,  1,  1,  1,  1,  1,  1,  0,  1,  1],
    [  1,  0,  0,214,  1,  0,225,  0,  1,  0,  0,  0,  1],
    [  1,224,  1,  0,  1, 21,  1,216,168,  0, 39,  0,  1],
    [  1, 21,225,  0, 82,  0, 81,  0,  1,  0,  0,  0,  1],
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
],
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
        "10,5": [
            {
                "type": "setBlock",
                "number": "yellowWall",
                "loc": [
                    [
                        11,
                        4
                    ]
                ]
            },
            {
                "type": "if",
                "condition": "((core.getBlockCls(9,5) !== 'enemys' )&&(( core.getBlockCls(11,5) !== 'enemys' )&&(( core.getBlockCls(9,7) !== 'enemys' )&&( core.getBlockCls(11,7) !== 'enemys'))))",
                "true": [
                    {
                        "type": "hide",
                        "remove": true,
                        "time": 0,
                        "destruct": true
                    }
                ],
                "false": [
                    {
                        "type": "setBlock",
                        "number": "specialDoor",
                        "loc": [
                            [
                                10,
                                4
                            ],
                            [
                                10,
                                8
                            ]
                        ]
                    },
                    {
                        "type": "setValue",
                        "name": "flag:骑士剑机关",
                        "value": "true"
                    },
                    {
                        "type": "hide",
                        "remove": true,
                        "time": 0,
                        "destruct": true
                    }
                ]
            }
        ]
    },
    "changeFloor": {
        "1,1": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "11,1": {
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
        2,
        1
    ],
    "downFloor": [
        10,
        1
    ],
    "autoEvent": {
        "11,4": {
            "0": {
                "condition": "flag:骑士剑机关 && core.getBlockCls(9,5) !== 'enemys' && core.getBlockCls(11,5) !== 'enemys' && core.getBlockCls(9,7) !== 'enemys' && core.getBlockCls(11,7) !== 'enemys'",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            4
                        ]
                    },
                    {
                        "type": "openDoor",
                        "loc": [
                            10,
                            8
                        ]
                    }
                ]
            },
            "1": null
        }
    },
    "beforeBattle": {},
    "cannotMoveIn": {}
}