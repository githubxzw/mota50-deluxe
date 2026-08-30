main.floors.MT50=
{
    "floorId": "MT50",
    "title": "魔塔 第50层",
    "name": "第 50 层",
    "width": 13,
    "height": 13,
    "map": [
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  1,  1,  1,  1,  1,  4,  4,  4,  4],
    [  4,  4,  4,  4,  1,  0,123,  0,  1,  4,  4,  4,  4],
    [  4,  4,  4,  4,  1,  0,  0,  0,  1,  4,  4,  4,  4],
    [  4,  4,  4,  4,  1,  0,  0,  0,  1,  4,  4,  4,  4],
    [  4,  4,  4,  4,  1,  1,  1,  1,  1,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4],
    [  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4]
],
    "canFlyTo": false,
    "canFlyFrom": false,
    "canUseQuickShop": true,
    "images": [],
    "ratio": 5,
    "defaultGround": "ground",
    "bgm": null,
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "6,5": [
            {
                "type": "playBgm",
                "name": "LastFight.mp3"
            },
            "\t[hero]勇者问：“你怎会在这里！你到底是谁？”",
            "\t[小偷,thief]小偷回答：“我在这里只有一个理由，那就是...”",
            {
                "type": "hide",
                "time": 500
            },
            {
                "type": "setEnemy",
                "id": "redKing",
                "name": "hp",
                "value": "5000"
            },
            {
                "type": "setEnemy",
                "id": "redKing",
                "name": "atk",
                "value": "1580"
            },
            {
                "type": "setEnemy",
                "id": "redKing",
                "name": "def",
                "value": "190"
            },
            {
                "type": "setBlock",
                "number": "redKing"
            },
            {
                "type": "show",
                "time": 500
            },
            "\t[hero]勇者问：“啊！你就是魔王！你怎么还活着？”",
            "\t[redKing]魔王回答：“我是不会死的。以前我只是对你的能力做测试而已。”",
            "\t[hero]勇者问：“什么？你这是什么意思？你为什么要做这样的事情？”",
            "\t[redKing]魔王回答：“神圣剑 就是你装备的武器，智慧权杖 我所装备的武器。先知说过无论谁使用它们都必需要有足够的智慧，且剑只能被真正的战士使用。”",
            "\t[hero]勇者问：“如你所说我就是那个战士”",
            "\t[redKing]魔王回答：“是的，你是最合适的人选。但你刚到魔塔时，你的能力还不足以支配神圣剑。因此我在塔内安排了各类机关，让你通过战斗直到可以控制神圣剑。”",
            "\t[hero]勇者问：“很好，那么外面传说有一个公主被困在魔塔，就是为了把我骗到这里。是这样的吗？”",
            "\t[redKing]魔王回答：“是的。现在如果我们能够合作那么这场闹剧就结束了。现在让我们一起用权杖破坏神圣剑，这样伟大的时代就要降临了。”",
            "原来的游戏若想杀死魔王，就必须以你现在的条件重头再打一次，中途不能存盘，且怪物各参数都乘44倍。除了增加计算量外我觉得无意义，所以我现在就结束游戏。",
            "我玩到这里攻击力443，防御力528。所以我要求大家到这里时攻击〉10*44，防御〉10*44 生命〉500*44否则你杀不死魔王。",
            "我的程序已全参数化（剧情还得定制）若你能设计出新的地图请与我联系 czl_falsh@hotmail.com 我可以改好后发给你。",
            {
                "type": "setValue",
                "name": "flag:与50层小偷对话",
                "value": "true"
            }
        ]
    },
    "changeFloor": {},
    "afterBattle": {
        "6,5": [
            "祝贺你顺利过关，此游戏为本人的第一个falsh作品。制作的比较简陋请谅解，再次谢谢你的使用。",
            {
                "type": "if",
                "condition": "flag:addhp",
                "true": [
                    {
                        "type": "if",
                        "condition": "flag:开启特性",
                        "true": [
                            {
                                "type": "if",
                                "condition": "flag:TE",
                                "true": [
                                    {
                                        "type": "win",
                                        "reason": "特性版-疯狂加血模式-TE（最高血量）"
                                    }
                                ],
                                "false": [
                                    {
                                        "type": "win",
                                        "reason": "特性版-疯狂加血模式-NE（最高血量）"
                                    }
                                ]
                            }
                        ],
                        "false": [
                            {
                                "type": "if",
                                "condition": "flag:TE",
                                "true": [
                                    {
                                        "type": "win",
                                        "reason": "纯净版-疯狂加血模式-TE（最高血量）"
                                    }
                                ],
                                "false": [
                                    {
                                        "type": "win",
                                        "reason": "纯净版-疯狂加血模式-NE（最高血量）"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "false": []
            },
            {
                "type": "if",
                "condition": "flag:开启特性",
                "true": [
                    {
                        "type": "setValue",
                        "name": "flag:versionType",
                        "value": "\"特性版\""
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "name": "flag:versionType",
                        "value": "\"纯净版\""
                    }
                ]
            },
            {
                "type": "if",
                "condition": "flag:TE",
                "true": [
                    {
                        "type": "setValue",
                        "name": "flag:endingType",
                        "value": "\"TE\""
                    }
                ],
                "false": [
                    {
                        "type": "setValue",
                        "name": "flag:endingType",
                        "value": "\"NE\""
                    }
                ]
            },
            {
                "type": "while",
                "condition": "true",
                "data": [
                    {
                        "type": "choices",
                        "text": "\t[king]选择要提交的榜单！",
                        "choices": [
                            {
                                "text": "生命值",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"生命\""
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "攻击值（最高）",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"最高攻击\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "status:atk",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "防御值（最高）",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"最高防御\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "status:def",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "金币数量",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"金币\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "status:money",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "攻防和（最高）",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"最高攻防和\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "status:atk + status:def",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "商店加点次数（最高）",
                                "action": [
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"最高商店加点次数\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "flag:times1",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "存活怪物数量",
                                "action": [
                                    {
                                        "type": "function",
                                        "function": "function(){\nlet n = 0;\nfor (const f of core.floorIds) {\n\tn += core.searchBlockWithFilter(b => b.event.cls === 'enemys' || b.event.cls === 'enemy48', f).length;\n}\ncore.setFlag('t', n);\n}"
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "flag:rankType",
                                        "value": "\"存活怪物数量\""
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "status:hp",
                                        "value": "flag:t",
                                        "norefresh": true
                                    },
                                    {
                                        "type": "break",
                                        "n": 1
                                    }
                                ]
                            },
                            {
                                "text": "下一页",
                                "action": [
                                    {
                                        "type": "choices",
                                        "text": "\t[king]选择要提交的榜单！",
                                        "choices": [
                                            {
                                                "text": "攻击值（最低）",
                                                "action": [
                                                    {
                                                        "type": "setValue",
                                                        "name": "flag:rankType",
                                                        "value": "\"最低攻击\""
                                                    },
                                                    {
                                                        "type": "setValue",
                                                        "name": "status:hp",
                                                        "value": "status:atk + (1000000000 - 100000*status:atk)",
                                                        "norefresh": true
                                                    },
                                                    {
                                                        "type": "break",
                                                        "n": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "防御值（最低）",
                                                "action": [
                                                    {
                                                        "type": "setValue",
                                                        "name": "flag:rankType",
                                                        "value": "\"最低防御\""
                                                    },
                                                    {
                                                        "type": "setValue",
                                                        "name": "status:hp",
                                                        "value": "status:def + (1000000000 - 100000*status:def)",
                                                        "norefresh": true
                                                    },
                                                    {
                                                        "type": "break",
                                                        "n": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "攻防和（最低）",
                                                "action": [
                                                    {
                                                        "type": "setValue",
                                                        "name": "flag:rankType",
                                                        "value": "\"最低攻防和\""
                                                    },
                                                    {
                                                        "type": "setValue",
                                                        "name": "status:hp",
                                                        "value": "(status:atk + status:def) + (1000000000 - 100000*(status:atk + status:def))",
                                                        "norefresh": true
                                                    },
                                                    {
                                                        "type": "break",
                                                        "n": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "商店加点次数（最低）",
                                                "action": [
                                                    {
                                                        "type": "setValue",
                                                        "name": "flag:rankType",
                                                        "value": "\"最低商店加点次数\""
                                                    },
                                                    {
                                                        "type": "setValue",
                                                        "name": "status:hp",
                                                        "value": "100000-1000*flag:times1 + flag:times1",
                                                        "norefresh": true
                                                    },
                                                    {
                                                        "type": "break",
                                                        "n": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "下一页",
                                                "action": [
                                                    {
                                                        "type": "choices",
                                                        "text": "\t[king]选择要提交的榜单！",
                                                        "choices": [
                                                            {
                                                                "text": "黄钥匙数量",
                                                                "action": [
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "flag:rankType",
                                                                        "value": "\"黄钥匙\""
                                                                    },
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "status:hp",
                                                                        "value": "item:yellowKey",
                                                                        "norefresh": true
                                                                    },
                                                                    {
                                                                        "type": "break",
                                                                        "n": 1
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "text": "兰钥匙数量",
                                                                "action": [
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "flag:rankType",
                                                                        "value": "\"蓝钥匙\""
                                                                    },
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "status:hp",
                                                                        "value": "item:blueKey",
                                                                        "norefresh": true
                                                                    },
                                                                    {
                                                                        "type": "break",
                                                                        "n": 1
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "text": "红钥匙数量",
                                                                "action": [
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "flag:rankType",
                                                                        "value": "\"红钥匙\""
                                                                    },
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "status:hp",
                                                                        "value": "item:redKey",
                                                                        "norefresh": true
                                                                    },
                                                                    {
                                                                        "type": "break",
                                                                        "n": 1
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "text": "持有道具数量（不计钥匙）",
                                                                "action": [
                                                                    {
                                                                        "type": "setValue",
                                                                        "name": "flag:rankType",
                                                                        "value": "\"持有道具数量\""
                                                                    },
                                                                    {
                                                                        "type": "function",
                                                                        "function": "function(){\nconst keyItems = ['yellowKey', 'blueKey', 'redKey'];\n\nfunction countNonKeyItems(data) {\n\tlet t = 0;\n\tObject.values(data.constants).forEach(v => t += v);\n\tfor (const [k, v] of Object.entries(data.tools)) {\n\t\tif (!keyItems.includes(k)) t += v;\n\t}\n\tObject.values(data.equips).forEach(v => t += v);\n\treturn t;\n}\ncore.status.hero.hp = countNonKeyItems(core.status.hero.items) - 1;\n}"
                                                                    },
                                                                    {
                                                                        "type": "break",
                                                                        "n": 1
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "text": "回到第一页",
                                                                "action": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "win",
                "reason": "${flag:versionType}-${flag:endingType}（${flag:rankType}）"
            }
        ]
    },
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
    "autoEvent": {},
    "beforeBattle": {},
    "cannotMoveIn": {}
}