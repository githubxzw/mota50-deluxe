main.floors.MT14=
{
    "floorId": "MT14",
    "title": "魔塔 第14层",
    "name": "第 14 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,214,  0,214,  1, 28, 21, 31,  1, 21, 21, 21,  1],
    [  1,  0,214,  0,  1,203,  1,214,  1,  0,  0, 21,  1],
    [  1,330,  0,  0,  1,  0,  1,  0,  1,  1, 81,  1,  1],
    [  1,  1, 82,  1,  1, 82,  1, 81,  1,  0,214,  0,  1],
    [  1, 31,  0,  0,206,  0,215,  0,206,  0,  0,  0,  1],
    [  1,  0,203,  0,  1,  1, 81,  1,  1, 31,  0,213,  1],
    [  1, 81,  1, 81,  1,  0,  0,  0,  1,  1,  1, 81,  1],
    [  1,  0,  1,  0,213,  0, 81,  0,203,  0,203,  0,  1],
    [  1,218,  1,218,  1,  1,  2,  1,  1, 81,  1,  1,  1],
    [  1,  0,  1,  0,  1, 31,  0,  0,  1,  0,  0,  0,  1],
    [  1, 22,  1,  0, 81,  0, 87,  0,  1,  0,  0, 88,  1],
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
        "6,11": {
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
        6,
        10
    ],
    "downFloor": [
        11,
        10
    ],
    "autoEvent": {
        "1,3": {
            "0": {
                "condition": "core.getBlockCls(1,1) !== 'enemys' && core.getBlockCls(3,1) !== 'enemys' && core.getBlockCls(2,2) !== 'enemys' ",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "openDoor",
                        "loc": [
                            1,
                            3
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "redKey",
                        "loc": [
                            [
                                1,
                                3
                            ]
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