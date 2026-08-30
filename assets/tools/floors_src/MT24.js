main.floors.MT24=
{
    "floorId": "MT24",
    "title": "魔塔 第24层",
    "name": "第 24 层",
    "width": 13,
    "height": 13,
    "map": [
    [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
    [  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
    [  1,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,  0,  1],
    [  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1],
    [  1,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  1],
    [  1,  0,  1,  1,  1,  0,  0,  0,  1,  1,  1,  0,  1],
    [  1,  0,  1,  1,  1,  0,  0,  0,  1,  1,  1,  0,  1],
    [  1,  0,  1,  1,  1,  0,  0,  0,  1,  1,  1,  0,  1],
    [  1,  0,  1,  1,  1,  1, 83,  1,  1,  1,  1,  0,  1],
    [  1,  0,  0,  1,  1,  1,  0,  1,  1,  1,  0,  0,  1],
    [  1,  0, 87,  0,  1,  1,  0,  1,  1,  0,  0,  0,  1],
    [  1, 88,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1],
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
        "6,2": [
            {
                "type": "if",
                "condition": "flag:营救公主",
                "true": [
                    {
                        "type": "setCurtain",
                        "color": [
                            0,
                            0,
                            0
                        ],
                        "time": 200,
                        "keep": true
                    },
                    {
                        "type": "for",
                        "name": "temp:A",
                        "from": "24",
                        "to": "50",
                        "step": "1",
                        "data": [
                            {
                                "type": "function",
                                "function": "function(){\ncore.ui.statusBar._update_props(core.floors[\"MT\" + core.calValue(\"temp:A\")].title)\n}"
                            },
                            {
                                "type": "sleep",
                                "time": 80
                            }
                        ]
                    },
                    {
                        "type": "changeFloor",
                        "floorId": "MT50",
                        "loc": [
                            6,
                            7
                        ],
                        "direction": "down",
                        "time": 200
                    },
                    {
                        "type": "setCurtain",
                        "time": 200
                    }
                ],
                "false": []
            }
        ]
    },
    "changeFloor": {
        "2,10": {
            "floorId": ":next",
            "stair": "downFloor",
            "time": 0
        },
        "1,11": {
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
        11
    ],
    "downFloor": [
        2,
        11
    ],
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}