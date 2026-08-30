main.floors.MT34=
{
    "floorId": "MT34",
    "title": "魔塔 第34层",
    "name": "第 34 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1, 88,  0, 31,  1,  0, 21,  0,  1, 21, 21, 28,  1],
    [  1,  0,  0,  0, 81,216,  0,227, 81,  0, 21, 31,  1],
    [  1,  0,216,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  1, 81,  1,  1,201,  1,224,  1,203,  1,225,  1],
    [  1,  0,  0,  0,  1, 81,  1, 81,  1, 81,  1, 81,  1],
    [  1,  0,330,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  1, 81,  1, 81,  1, 81,  1, 81,  1],
    [  1,  1, 81,  1,  1,212,  1,202,  1,227,  1,205,  1],
    [  1,  0,  0,212,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,224,  1,  0, 81,  0,  0,  0, 81,225,  0, 31,  1],
    [  1, 32,225,  0,  1,  0, 87,  0,  1,  0, 21, 27,  1],
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
    "events": {},
    "changeFloor": {
        "6,11": {
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
        6,
        10
    ],
    "downFloor": [
        2,
        1
    ],
    "autoEvent": {
        "2,6": {
            "0": {
                "condition": "core.getBlockCls(5,4) !== 'enemys' && core.getBlockCls(7,4) !== 'enemys' && core.getBlockCls(9,4) !== 'enemys' && core.getBlockCls(11,4) !== 'enemys' && core.getBlockCls(5,8) !== 'enemys' && core.getBlockCls(7,8) !== 'enemys' && core.getBlockCls(9,8) !== 'enemys' && core.getBlockCls(11,8) !== 'enemys' ",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "hide",
                        "loc": [
                            [
                                2,
                                6
                            ]
                        ],
                        "remove": true
                    },
                    {
                        "type": "setBlock",
                        "number": "yellowKey",
                        "loc": [
                            [
                                1,
                                5
                            ],
                            [
                                3,
                                5
                            ],
                            [
                                1,
                                7
                            ],
                            [
                                3,
                                7
                            ]
                        ],
                        "async": true
                    },
                    {
                        "type": "setBlock",
                        "number": "redKey",
                        "loc": [
                            [
                                2,
                                6
                            ]
                        ],
                        "async": true
                    },
                    {
                        "type": "waitAsync"
                    }
                ]
            },
            "1": null
        }
    },
    "beforeBattle": {},
    "cannotMoveIn": {}
}