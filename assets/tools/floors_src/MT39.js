main.floors.MT39=
{
    "floorId": "MT39",
    "title": "魔塔 第39层",
    "name": "第 39 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0, 88,  1],
    [  1,  0, 81,  0, 81,  0, 81,  0,  1,122,  0,  0,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0, 21,  1],
    [  1,  0, 81,  0, 81,  0, 81,  0,330,  1, 81,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,225,  1],
    [  1,  0, 81,  0, 81,  0, 81,  0,  1,216,  1, 27,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,212,  1],
    [  1,  1, 82,  1,  1,  1,  1,  1,  1,  1, 81,  1,  1],
    [  1,  0,  0,212,  1,224, 28,227,  1,  0,227,  0,  1],
    [  1,  1,212,  0, 81,  0,  1,  0, 81,  0,  0,  0,  1],
    [  1,121,  0, 21,  1,  0,216,  0,  1, 31,  0, 87,  1],
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
        "11,11": {
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
        11,
        10
    ],
    "downFloor": [
        11,
        2
    ],
    "autoEvent": {
        "8,4": {
            "0": {
                "condition": "core.getBlock(2,2) !== null && core.getBlock(4,2) === null && core.getBlock(6,2) !== null && core.getBlock(2,4) !== null && core.getBlock(4,4) !== null && core.getBlock(6,4) === null && \ncore.getBlock(2,6) !== null && core.getBlock(4,6) !== null && core.getBlock(6,6) !== null",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "openDoor",
                        "loc": [
                            4,
                            4
                        ]
                    },
                    {
                        "type": "setBlock",
                        "number": "centerFly3",
                        "loc": [
                            [
                                4,
                                4
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