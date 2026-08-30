var events_c12a15a8_c380_4b28_8144_256cba95f760 = 
{
	"commonEvent": {
		"加点事件": [
			{
				"type": "comment",
				"text": "通过传参，flag:arg1 表示当前应该的加点数值"
			},
			{
				"type": "choices",
				"choices": [
					{
						"text": "攻击+${1*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:atk",
								"operator": "+=",
								"value": "1*flag:arg1"
							}
						]
					},
					{
						"text": "防御+${2*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:def",
								"operator": "+=",
								"value": "2*flag:arg1"
							}
						]
					},
					{
						"text": "生命+${200*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:hp",
								"operator": "+=",
								"value": "200*flag:arg1"
							}
						]
					}
				]
			}
		],
		"回收钥匙商店": [
			{
				"type": "comment",
				"text": "此事件在全局商店中被引用了(全局商店keyShop)"
			},
			{
				"type": "comment",
				"text": "解除引用前勿删除此事件"
			},
			{
				"type": "comment",
				"text": "玩家在快捷列表（V键）中可以使用本公共事件"
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "choices",
						"text": "\t[商人,trader]你有多余的钥匙想要出售吗？",
						"choices": [
							{
								"text": "黄钥匙（10金币）",
								"color": [
									255,
									255,
									0,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "(item:yellowKey >= 1)",
										"true": [
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
												"value": "10"
											}
										],
										"false": [
											"\t[商人,trader]你没有黄钥匙！"
										]
									}
								]
							},
							{
								"text": "蓝钥匙（50金币）",
								"color": [
									0,
									0,
									255,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "(item:blueKey >= 1)",
										"true": [
											{
												"type": "setValue",
												"name": "item:blueKey",
												"operator": "-=",
												"value": "1"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "+=",
												"value": "50"
											}
										],
										"false": [
											"\t[商人,trader]你没有蓝钥匙！"
										]
									}
								]
							},
							{
								"text": "离开",
								"action": [
									{
										"type": "exit"
									}
								]
							}
						]
					}
				]
			}
		],
		"游戏说明": [
			{
				"type": "function",
				"function": "function(){\ncore.status.route.push('help')\n}"
			},
			{
				"type": "while",
				"condition": "true",
				"data": [
					{
						"type": "choices",
						"choices": [
							{
								"text": "游戏特性",
								"norecord": true,
								"action": [
									"您游玩的当前版本，是由三原塔翻新小组按照flash版重新复刻而成。",
									"进入游戏时，玩家可选择是否开启flash原版特性。若选择开启，则本局游戏进入“特性版”，将同时启用三大原版特性：对话穿墙、偷雪花、圣水复活。若选择不开启，则本局游戏进入“纯净版”，以上三大特性均无法使用。",
									"\t[对话穿墙,yellowWall]在与会消失的NPC（例如老人或已经交易完成的商人）对话后，玩家可以选择以下一项行动：\n·停留在原地；\n·向任意方向行走一格（可以拾取道具）；\n·使用一个道具（该道具不可引发楼层切换）；\n执行上述行动后，如果玩家触碰到周围的图块",
									"\t[对话穿墙,yellowWall]且当图块满足以下条件：\n·该图块没有事件，例如墙，岩浆，商店的左右部分\n·该图块为门且对应钥匙数量为0（否则按正常方式开门）；\n·该图块为怪物且无法战胜该怪物（否则正常进入战斗）。\n则该图块会被直接摧毁。\n（确切来说，不计入录像的道具，如记事本，是可以任意使用并仍旧能对话穿墙的）",
									"\t[偷雪花,snow]flash版本的三个蓝血瓶与冰魔法均放置在魔龙身下，由于魔龙后六格可以直接通行，因此若可以接触到魔龙后六格则可直接拿取其中物品\n若关闭此特性，魔龙后六格仍旧将可通行，但是三个蓝血瓶与冰魔法变为在击败魔龙后才生成",
									"\t[圣水复活,yellowKnight]在Flash版本的32F遭遇骑士队长时，即使玩家血量降至0，实际战斗仍会继续进行（血量将保持为0）。且击败骑士队长后仍旧可以正常进行游戏，道具也能照常使用。 但玩家血量为0时，无法与任何相邻格子交互。因此必须使用圣水，才能恢复正常行动能力。",
									"\t[圣水复活,yellowKnight]复刻版已复刻这一特性，如果您在其它情况下（例如自己修改数据）后将血量降至0及以下时，也将不能与相邻格交互。\n注意，如果您无法破防骑士队长，在flash版则会一直战斗下去，复刻版改为直接战败。"
								]
							},
							{
								"text": "游戏结局",
								"norecord": true,
								"action": [
									"\t[普通结局（NE）,redKing]正常通关流程中战胜50F魔王",
									"\t[真结局（TE）,redKing]若不打49F假魔王，而是先前往50F和小偷对话，之后使用下楼器到49F触发假魔王剧情。此时封印假魔王，真魔王也将被封印为一成功力。再次从24F的通道到达50F后，战胜被封印的真魔王即可实现真结局。（TE）。"
								]
							},
							{
								"text": "游戏榜单",
								"norecord": true,
								"action": [
									"本塔可选择“纯净版”或“特性版”，也可选择打出“普通结局”或“真结局”，上述两两组合共4种情况，在每一种情况下，均设置16个榜单：最高血量、最高攻击、最高防御、最多金币、最高攻防和、最多商店加点次数、最多存活怪物数量、最低攻击、最低防御、最低攻防和、最少商店加点次数、最多黄钥匙、最多蓝钥匙、最多红钥匙、最多道具数量、最高血量（疯狂加血模式）。因此，目前版本共有4*16=64个榜单。"
								]
							},
							{
								"text": "开启额外功能",
								"color": [
									255,
									0,
									0,
									1
								],
								"condition": "!flag:额外功能开关",
								"action": [
									"\t[作者,king]选择开启额外功能后，将在游戏中添加如下功能：\n·暗墙变色\n·自动清怪、自动拾取、自动开启暗墙岩浆的自动操作开关选项。\n·可以在黄钥匙商人处一次出售多把钥匙\n·29层小偷可以直接通过\n·可以不必站在楼梯边，而是只要有可行路径时就可以使用楼传\n·开局提供的削弱后楼传",
									{
										"type": "choices",
										"text": "\t[作者,king]确定要开启吗？",
										"choices": [
											{
												"text": "我太需要了",
												"action": [
													{
														"type": "setValue",
														"name": "item:I333",
														"value": "1"
													},
													"\t[作者,king]额外功能已开启",
													{
														"type": "setValue",
														"name": "flag:额外功能开关",
														"value": "true"
													}
												]
											},
											{
												"text": "下次再说",
												"action": []
											}
										]
									}
								]
							},
							{
								"text": "关闭额外功能",
								"color": [
									255,
									0,
									0,
									1
								],
								"condition": "flag:额外功能开关",
								"action": [
									"\t[作者,king]目前版本，我们在游戏中添加了如下在flash版中并不存在的额外功能：\n·BGM（目前使用的仍是h5之前版本的bgm）\n·暗墙变色\n·自动清怪、自动拾取、自动开启暗墙岩浆的自动操作开关选项。\n·可以在黄钥匙商人处一次出售多把钥匙\n·29层小偷可以直接通过\n·可以不必站在楼梯边，而是只要有可行路径时就可以使用楼传\n·开局提供的削弱后楼传\n如果您希望体验原汁原味的flash版，可以选择“关闭额外功能”。",
									{
										"type": "choices",
										"text": "\t[作者,king]确定要关闭吗？",
										"choices": [
											{
												"text": "我太需要了",
												"action": [
													{
														"type": "setValue",
														"name": "item:I333",
														"value": "0"
													},
													"\t[作者,king]额外功能已关闭，如果您希望也关闭bgm的话，可以在设置-系统设置-音效设置中，将音乐关闭即可",
													{
														"type": "setValue",
														"name": "flag:额外功能开关",
														"value": "false"
													}
												]
											},
											{
												"text": "下次再说",
												"action": []
											}
										]
									}
								]
							},
							{
								"text": "自动操作",
								"color": [
									101,
									255,
									255,
									1
								],
								"condition": "flag:额外功能开关",
								"action": [
									{
										"type": "while",
										"condition": "1",
										"data": [
											{
												"type": "function",
												"function": "function(){\nif (!core.status.hero.flags.__auto__) core.status.hero.flags.__auto__ = { battle: false, item: false, wall: false }\n}"
											},
											{
												"type": "choices",
												"text": "选择要开启的功能",
												"choices": [
													{
														"text": "自动清零伤怪 [off]",
														"condition": "!core.status.hero.flags.__auto__.battle",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.battle = true;\n}"
															},
															{
																"type": "tip",
																"text": "自动清怪已开启"
															}
														]
													},
													{
														"text": "自动清零伤怪 [on]",
														"condition": "core.status.hero.flags.__auto__.battle",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.battle = false;\n}"
															},
															{
																"type": "tip",
																"text": "自动清怪已关闭"
															}
														]
													},
													{
														"text": "自动拾取物品 [off]",
														"condition": "!core.status.hero.flags.__auto__.item",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.item = true;\n}"
															},
															{
																"type": "tip",
																"text": "自动拾取已开启"
															}
														]
													},
													{
														"text": "自动拾取物品 [on]",
														"condition": "core.status.hero.flags.__auto__.item",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.item = false;\n}"
															},
															{
																"type": "tip",
																"text": "自动拾取已关闭"
															}
														]
													},
													{
														"text": "自动开暗墙岩浆 [off]",
														"condition": "!core.status.hero.flags.__auto__.wall",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.wall = true;\n}"
															},
															{
																"type": "tip",
																"text": "自动开暗墙岩浆已开启"
															}
														]
													},
													{
														"text": "自动开暗墙岩浆 [on]",
														"condition": "core.status.hero.flags.__auto__.wall",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.wall = false;\n}"
															},
															{
																"type": "tip",
																"text": "自动开暗墙岩浆已关闭"
															}
														]
													},
													{
														"text": "退出设置",
														"action": [
															{
																"type": "break",
																"n": 1
															}
														]
													},
													{
														"text": "拾取血瓶 [on]",
														"condition": "core.status.hero.flags.__auto__.item === true",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.item = 'nopotion';\n}"
															},
															{
																"type": "tip",
																"text": "将自动拾取，但不拾取血瓶"
															}
														]
													},
													{
														"text": "拾取血瓶 [off]",
														"condition": "core.status.hero.flags.__auto__.item === 'nopotion'",
														"action": [
															{
																"type": "function",
																"function": "function(){\ncore.status.hero.flags.__auto__.item = true;\n}"
															},
															{
																"type": "tip",
																"text": "自动拾取血瓶已恢复"
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
								"text": "交易统计",
								"color": [
									255,
									230,
									100,
									1
								],
								"norecord": true,
								"action": [
									{
										"type": "function",
										"function": "function(){\ncore.plugin.showAltarSummary()\n}"
									}
								]
							},
							{
								"text": "返回游戏",
								"action": [
									{
										"type": "break",
										"n": 1
									}
								]
							},
							{
								"text": "详细显伤[on]",
								"condition": "flag:显示详细信息",
								"action": [
									{
										"type": "setValue",
										"name": "flag:显示详细信息",
										"value": "false"
									}
								]
							},
							{
								"text": "详细显伤[off]",
								"condition": "!flag:显示详细信息",
								"action": [
									{
										"type": "setValue",
										"name": "flag:显示详细信息",
										"value": "true"
									}
								]
							}
						]
					}
				]
			}
		],
		"对话": [
			{
				"type": "setValue",
				"name": "flag:有选择的对话",
				"value": "false"
			},
			{
				"type": "switch",
				"condition": "flag:arg1",
				"caseList": [
					{
						"case": "2",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'谢谢你救了我，为了感谢你的帮助请收下这些礼物.（收到1000金币）'"
							},
							{
								"type": "setValue",
								"name": "flag:有选择的对话",
								"value": "true"
							}
						]
					},
					{
						"case": "3",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'我可以给你怪物手册. 你可以用快捷键 X 去使用它。它能预测出当前楼层各类怪物对你的伤害。'"
							},
							{
								"type": "setValue",
								"name": "flag:有选择的对话",
								"value": "true"
							}
						]
					},
					{
						"case": "4",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'有些门不能用钥匙打开，只有当你打败它的守卫后才会自动打开。'"
							}
						]
					},
					{
						"case": "6",
						"action": [
							{
								"type": "if",
								"condition": "flag:arg4 ",
								"true": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'魔塔一共50层，每10层为一个区域。如果不打败此区域的头目就不能到更高的地方。'"
									}
								],
								"false": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'你购买了礼物后再与商人对话，他会告诉你一些重要的消息。'"
									}
								]
							}
						]
					},
					{
						"case": "7",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'在商店里你最好选择提升防御，只有在攻击力低于敌人的防御力时才提升攻击力'"
							}
						]
					},
					{
						"case": "12",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'你是否注意到 5,9,14,16,18 楼有的墙与众不同？'"
							}
						]
					},
					{
						"case": "15",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'如果你持有十字架，面对兽人和吸血鬼时你的攻击力加倍。在没有十字架的情况下你不可能打败吸血鬼。十字架被藏在高于15楼的墙内。'"
							}
						]
					},
					{
						"case": "16",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'我听说在塔内有2把隐藏的红钥匙。'"
							}
						]
					},
					{
						"case": "18",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'在这区域不多次提升攻击力，就不能打败 石头人。切记前人教训！'"
							}
						]
					},
					{
						"case": "21",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'大法师住在25楼，他是魔塔的主人。以你现在的状态去攻击他简直就是自杀。 你应当在取得更高级别的道具后再去打败他。'"
							}
						]
					},
					{
						"case": "23",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'我没有什么可说的，但有一个确切的消息藏在这个楼层里。(我没有搞清楚此层在原游戏里的作用，现不找到所有的暗墙29楼暗道不开)'"
							}
						]
					},
					{
						"case": "27",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'如果你到27楼时状态为：生命1500，攻击80，防御98，拥有1兰钥匙，5黄钥匙。那么祝贺你，你前期是比较成功的。'"
							}
						]
					},
					{
						"case": "31",
						"action": [
							{
								"type": "if",
								"condition": "flag:arg4",
								"true": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'魔塔有50层高,但似乎你不能直接到50楼。'"
									}
								],
								"false": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'双手剑士的攻击力太高了，你最好到能对他一击必杀时再与他战斗。'"
									}
								]
							}
						]
					},
					{
						"case": "33",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'别匆忙，放慢速度。'"
							}
						]
					},
					{
						"case": "36",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'如果你能用好4种移动宝物，你不用与强敌作战就能上楼。'"
							}
						]
					},
					{
						"case": "37",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'你需要用 地震卷轴  取出37楼仓库内的所有宝物。'"
							}
						]
					},
					{
						"case": "38",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'存放圣剑的房间的门坏了，你必须用镐破墙而入。'"
							}
						]
					},
					{
						"case": "39",
						"action": [
							{
								"type": "if",
								"condition": "flag:arg4",
								"true": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'塔内有个 幸运金币。拥有它在打败敌人后能获得2倍的金钱。'"
									}
								],
								"false": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'谜题：“在3点，拥有传送功能的密宝 就会出现。'"
									}
								]
							}
						]
					},
					{
						"case": "42",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'巫师 会用魔法攻击路过的人，在2个 魔法警卫 间通过会使你的生命减少一半。'"
							}
						]
					},
					{
						"case": "45",
						"action": [
							{
								"type": "if",
								"condition": "flag:arg4",
								"true": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'44楼 被藏在异空间，你只能用密宝才能到达'"
									}
								],
								"false": [
									{
										"type": "setValue",
										"name": "flag:content",
										"value": "'神圣盾 能防御魔法攻击，但它被藏在异空间的楼层内。'"
									}
								]
							}
						]
					},
					{
						"case": "46",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'41楼 事实上是左右对称的。'"
							}
						]
					},
					{
						"case": "47",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'如果要打败魔龙你需要 圣剑，圣盾，屠龙匕 或更高等级的装备。'"
							}
						]
					},
					{
						"case": "48",
						"action": [
							{
								"type": "setValue",
								"name": "flag:content",
								"value": "'象骰子上5的形状是一种封印魔法，你最好记住它在你与49楼假魔王战斗时有用。'"
							}
						]
					},
					{
						"case": "default",
						"action": [
							"没有本层对话信息，请在公共事件“对话”中配置！",
							{
								"type": "break",
								"n": 1
							}
						]
					}
				]
			},
			{
				"type": "if",
				"condition": "flag:有选择的对话",
				"true": [
					{
						"type": "choices",
						"text": "\t[老人,oldman]${flag:content}",
						"choices": [
							{
								"text": "谢谢",
								"action": [
									{
										"type": "switch",
										"condition": "flag:arg1",
										"caseList": [
											{
												"case": "2",
												"action": [
													{
														"type": "playSound",
														"name": "获得道具"
													},
													{
														"type": "setValue",
														"name": "status:money",
														"operator": "+=",
														"value": "1000"
													},
													{
														"type": "tip",
														"text": "获得1000金币"
													}
												]
											},
											{
												"case": "3",
												"action": [
													{
														"type": "setValue",
														"name": "item:book",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "default",
												"action": []
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
						"type": "if",
						"condition": "flag:arg4",
						"true": [
							"\t[商人,trader]${flag:content}"
						],
						"false": [
							"\t[老人,oldman]${flag:content}"
						]
					}
				]
			},
			{
				"type": "function",
				"function": "function(){\nlet f = `对话${core.getFlag('arg1')}`;\nif (core.getFlag('arg4')) f = f + '02';\ncore.setFlag(f, true)\n}"
			},
			{
				"type": "hide",
				"loc": [
					"flag:arg2 ",
					"flag:arg3 "
				],
				"remove": true,
				"time": 500
			}
		],
		"商人": [
			{
				"type": "switch",
				"condition": "flag:arg1",
				"caseList": [
					{
						"case": "6",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "50"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有一把兰钥匙你出50个金币就卖给你。'"
							}
						]
					},
					{
						"case": "7",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "50"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有五把黄钥匙你出50个金币就卖给你。'"
							}
						]
					},
					{
						"case": "12",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "800"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有一把红钥匙你出800个金币就卖给你。'"
							}
						]
					},
					{
						"case": "15",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "200"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有一把兰钥匙你出200个金币就卖给你。'"
							}
						]
					},
					{
						"case": "31",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "1000"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有四把黄钥匙一把兰钥匙你出1000个金币就都给你。'"
							}
						]
					},
					{
						"case": "38",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "200"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有3把黄钥匙你出200个金币就都给你。'"
							}
						]
					},
					{
						"case": "39",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "2000"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'我有3把兰钥匙你出2000个金币就都给你。'"
							}
						]
					},
					{
						"case": "45",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "1000"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'给我1000个金币我就提升你的生命2000点。'"
							}
						]
					},
					{
						"case": "47",
						"action": [
							{
								"type": "setValue",
								"name": "flag:money",
								"value": "4000"
							},
							{
								"type": "setValue",
								"name": "flag:text",
								"value": "'给我4000个金币我就给你地震卷轴，它可摧毁一层楼所有的墙'"
							}
						]
					},
					{
						"case": "default",
						"action": [
							"\t[商人,woman]没有本层商人信息，请在公共事件“商人”中配置！",
							{
								"type": "break",
								"n": 1
							}
						]
					}
				]
			},
			{
				"type": "choices",
				"text": "\t[商人,trader]${flag:text}",
				"choices": [
					{
						"text": "我太需要了",
						"action": [
							{
								"type": "if",
								"condition": "(status:money >= flag:money)",
								"true": [
									{
										"type": "setValue",
										"name": "status:money",
										"operator": "-=",
										"value": "flag:money"
									},
									{
										"type": "switch",
										"condition": "flag:arg1",
										"caseList": [
											{
												"case": "6",
												"action": [
													{
														"type": "setValue",
														"name": "item:blueKey",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "7",
												"action": [
													{
														"type": "setValue",
														"name": "item:yellowKey",
														"operator": "+=",
														"value": "5"
													}
												]
											},
											{
												"case": "12",
												"action": [
													{
														"type": "setValue",
														"name": "item:redKey",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "15",
												"action": [
													{
														"type": "setValue",
														"name": "item:blueKey",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "31",
												"action": [
													{
														"type": "setValue",
														"name": "item:yellowKey",
														"operator": "+=",
														"value": "4"
													},
													{
														"type": "setValue",
														"name": "item:blueKey",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "38",
												"action": [
													{
														"type": "setValue",
														"name": "item:yellowKey",
														"operator": "+=",
														"value": "3"
													}
												]
											},
											{
												"case": "39",
												"action": [
													{
														"type": "setValue",
														"name": "item:blueKey",
														"operator": "+=",
														"value": "3"
													}
												]
											},
											{
												"case": "45",
												"action": [
													{
														"type": "playSound",
														"name": "获得道具"
													},
													{
														"type": "setValue",
														"name": "status:hp",
														"operator": "+=",
														"value": "2000"
													}
												]
											},
											{
												"case": "47",
												"action": [
													{
														"type": "setValue",
														"name": "item:earthquake",
														"operator": "+=",
														"value": "1"
													}
												]
											},
											{
												"case": "default",
												"action": []
											}
										]
									},
									{
										"type": "function",
										"function": "function(){\nvar name = core.status.floorId + '@' + core.getFlag(\"arg2\", 0) + '@' + core.getFlag(\"arg3\", 0) + '@' + 'A';\ncore.setFlag(name, 1);\n}"
									}
								],
								"false": [
									"\t[商人,woman]你的金币不够${flag:money}枚，无法交易！"
								]
							}
						]
					},
					{
						"text": "下次再说",
						"action": []
					}
				]
			},
			{
				"type": "setValue",
				"name": "flag:alt",
				"value": "0"
			}
		],
		"商店": [
			{
				"type": "while",
				"condition": "true",
				"data": [
					{
						"type": "setValue",
						"name": "flag:money1",
						"value": "20+10*(flag:times1+1)*flag:times1"
					},
					{
						"type": "choices",
						"text": "\t[祭坛,blueShop]如果供奉${flag:money1}金币, 便可以增加你的力量, 你想要什么呢…",
						"choices": [
							{
								"text": "生命+${100*(flag:times1+1)}",
								"action": [
									{
										"type": "if",
										"condition": "(status:money>=flag:money1)",
										"true": [
											{
												"type": "playSound",
												"name": "获得道具"
											},
											{
												"type": "function",
												"function": "function(){\ncore.addFlag(`${core.getFlag('ratio')}区购买hp`, 100 * (core.getFlag('times1', 0) + 1));\ncore.addFlag(`${core.getFlag('ratio')}区购买hp次数`, 1);\n}"
											},
											{
												"type": "setValue",
												"name": "status:hp",
												"operator": "+=",
												"value": "100*(flag:times1+1)"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "-=",
												"value": "flag:money1"
											},
											{
												"type": "setValue",
												"name": "flag:times1",
												"operator": "+=",
												"value": "1"
											}
										],
										"false": [
											{
												"type": "tip",
												"text": "你的金币不足${flag:money1}枚，无法供奉！"
											}
										]
									}
								]
							},
							{
								"text": "攻击+${2*flag:ratio}",
								"action": [
									{
										"type": "if",
										"condition": "(status:money>=flag:money1)",
										"true": [
											{
												"type": "playSound",
												"name": "获得道具"
											},
											{
												"type": "function",
												"function": "function(){\ncore.addFlag(`${core.getFlag('ratio')}区购买atk`, 2 * core.getFlag('ratio', 1));\ncore.addFlag(`${core.getFlag('ratio')}区购买atk次数`, 1);\n}"
											},
											{
												"type": "setValue",
												"name": "status:atk",
												"operator": "+=",
												"value": "2*flag:ratio"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "-=",
												"value": "flag:money1"
											},
											{
												"type": "setValue",
												"name": "flag:times1",
												"operator": "+=",
												"value": "1"
											}
										],
										"false": [
											{
												"type": "tip",
												"text": "你的金币不足${flag:money1}枚，无法供奉！"
											}
										]
									}
								]
							},
							{
								"text": "防御+${4*flag:ratio}",
								"action": [
									{
										"type": "if",
										"condition": "(status:money>=flag:money1)",
										"true": [
											{
												"type": "playSound",
												"name": "获得道具"
											},
											{
												"type": "function",
												"function": "function(){\ncore.addFlag(`${core.getFlag('ratio')}区购买def`, 4 * core.getFlag('ratio', 1));\ncore.addFlag(`${core.getFlag('ratio')}区购买def次数`, 1);\n}"
											},
											{
												"type": "setValue",
												"name": "status:def",
												"operator": "+=",
												"value": "4*flag:ratio"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "-=",
												"value": "flag:money1"
											},
											{
												"type": "setValue",
												"name": "flag:times1",
												"operator": "+=",
												"value": "1"
											}
										],
										"false": [
											{
												"type": "tip",
												"text": "你的金币不足${flag:money1}枚，无法供奉！"
											}
										]
									}
								]
							},
							{
								"text": "离开",
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
		"记事本": [
			{
				"type": "if",
				"condition": "(flag:翻页==0)",
				"true": [
					{
						"type": "setValue",
						"name": "flag:翻页",
						"value": "1"
					}
				]
			},
			{
				"type": "if",
				"condition": "(flag:翻页==1)",
				"true": [
					{
						"type": "while",
						"condition": "true",
						"data": [
							{
								"type": "choices",
								"text": "留言簿",
								"norecord": true,
								"choices": [
									{
										"text": "2层老人",
										"condition": "flag:对话2==1",
										"action": [
											"谢谢你救了我，为了感谢你的帮助请收下这些礼物.（收到1000金币）"
										]
									},
									{
										"text": "3层老人",
										"condition": "flag:对话3==1",
										"action": [
											"我可以给你怪物手册. 你可以用快捷键 X 去使用它。它能预测出当前楼层各类怪物对你的伤害。"
										]
									},
									{
										"text": "4层老人",
										"condition": "flag:对话4==1",
										"action": [
											"有些门不能用钥匙打开，只有当你打败它的守卫后才会自动打开。"
										]
									},
									{
										"text": "6层老人",
										"condition": "flag:对话6==1 && !flag:arg4",
										"action": [
											"你购买了礼物后再与商人对话，他会告诉你一些重要的消息。"
										]
									},
									{
										"text": "6层商人",
										"condition": "flag:对话602==1 && flag:arg4",
										"action": [
											"魔塔一共50层，每10层为一个区域。如果不打败此区域的头目就不能到更高的地方。"
										]
									},
									{
										"text": "7层商人",
										"condition": "flag:对话7==1",
										"action": [
											"在商店里你最好选择提升防御，只有在攻击力低于敌人的防御力时才提升攻击力"
										]
									},
									{
										"text": "12层商人",
										"condition": "flag:对话12==1",
										"action": [
											"你是否注意到 5,9,14,16,18 楼有的墙与众不同？"
										]
									},
									{
										"text": "15层商人",
										"condition": "flag:对话15==1",
										"action": [
											"如果你持有十字架，面对兽人和吸血鬼时你的攻击力加倍。在没有十字架的情况下你不可能打败吸血鬼。十字架被藏在高于15楼的墙内。"
										]
									},
									{
										"text": "16层老人",
										"condition": "flag:对话16==1",
										"action": [
											"我听说在塔内有2把隐藏的红钥匙。"
										]
									},
									{
										"text": "跳到尾页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "3"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "下一页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "2"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "离开",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "1"
											},
											{
												"type": "exit"
											}
										]
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
				"condition": "(flag:翻页==2)",
				"true": [
					{
						"type": "while",
						"condition": "true",
						"data": [
							{
								"type": "choices",
								"text": "留言簿",
								"norecord": true,
								"choices": [
									{
										"text": "18层老人",
										"condition": "flag:对话18==1",
										"action": [
											"在这区域不多次提升攻击力，就不能打败 石头人。切记前人教训！"
										]
									},
									{
										"text": "21层老人",
										"condition": "flag:对话21==1",
										"action": [
											"大法师住在25楼，他是魔塔的主人。以你现在的状态去攻击他简直就是自杀。 你应当在取得更高级别的道具后再去打败他。"
										]
									},
									{
										"text": "23层老人",
										"condition": "flag:对话23==1",
										"action": [
											"我没有什么可说的，但有一个确切的消息藏在这个楼层里。(我没有搞清楚此层在原游戏里的作用，现不找到所有的暗墙29楼暗道不开)"
										]
									},
									{
										"text": "27层老人",
										"condition": "flag:对话27==1",
										"action": [
											"如果你到27楼时状态为：生命1500，攻击80，防御98，拥有1兰钥匙，5黄钥匙。那么祝贺你，你前期是比较成功的。"
										]
									},
									{
										"text": "31层商人",
										"condition": "flag:对话3102==1 && flag:arg4",
										"action": [
											"魔塔有50层高,但似乎你不能直接到50楼。"
										]
									},
									{
										"text": "31层老人",
										"condition": "flag:对话31==1 && !flag:arg4",
										"action": [
											"双手剑士的攻击力太高了，你最好到能对他一击必杀时再与他战斗。"
										]
									},
									{
										"text": "33层老人",
										"condition": "flag:对话33==1",
										"action": [
											"别匆忙，放慢速度。"
										]
									},
									{
										"text": "36层老人",
										"condition": "flag:对话36==1",
										"action": [
											"如果你能用好4种移动宝物，你不用与强敌作战就能上楼。"
										]
									},
									{
										"text": "37层老人",
										"condition": "flag:对话37==1",
										"action": [
											"你需要用 地震卷轴 取出37楼仓库内的所有宝物。"
										]
									},
									{
										"text": "上一页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "1"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "下一页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "3"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "离开",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "1"
											},
											{
												"type": "exit"
											}
										]
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
				"condition": "(flag:翻页==3)",
				"true": [
					{
						"type": "while",
						"condition": "true",
						"data": [
							{
								"type": "choices",
								"text": "留言簿",
								"norecord": true,
								"choices": [
									{
										"text": "38层商人",
										"condition": "flag:对话38==1",
										"action": [
											"存放圣剑的房间的门坏了，你必须用镐破墙而入。"
										]
									},
									{
										"text": "39层商人",
										"condition": "flag:对话3902==1 && flag:arg4",
										"action": [
											"塔内有个 幸运金币。拥有它在打败敌人后能获得2倍的金钱。"
										]
									},
									{
										"text": "39层老人",
										"condition": "flag:对话39==1 && !flag:arg4",
										"action": [
											"谜题：'在3点，拥有传送功能的密宝 就会出现。'"
										]
									},
									{
										"text": "42层老人",
										"condition": "flag:对话42==1",
										"action": [
											"巫师 会用魔法攻击路过的人，在2个 魔法警卫 间通过会使你的生命减少一半。"
										]
									},
									{
										"text": "45层商人",
										"condition": "flag:对话4502==1 && flag:arg4",
										"action": [
											"44楼 被藏在异空间，你只能用密宝才能到达"
										]
									},
									{
										"text": "45层老人",
										"condition": "flag:对话45==1 && !flag:arg4",
										"action": [
											"神圣盾 能防御魔法攻击，但它被藏在异空间的楼层内。"
										]
									},
									{
										"text": "46层老人",
										"condition": "flag:对话46==1",
										"action": [
											"41楼 事实上是左右对称的。"
										]
									},
									{
										"text": "47层商人",
										"condition": "flag:对话47==1",
										"action": [
											"如果要打败魔龙你需要 圣剑，圣盾，屠龙匕 或更高等级的装备。"
										]
									},
									{
										"text": "48层老人",
										"condition": "flag:对话48==1",
										"action": [
											"象骰子上5的形状是一种封印魔法，你最好记住它在你与49楼假魔王战斗时有用。"
										]
									},
									{
										"text": "上一页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "2"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "跳到首页",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "1"
											},
											{
												"type": "insert",
												"name": "记事本"
											}
										]
									},
									{
										"text": "离开",
										"action": [
											{
												"type": "setValue",
												"name": "flag:翻页",
												"value": "1"
											},
											{
												"type": "exit"
											}
										]
									}
								]
							}
						]
					}
				],
				"false": []
			}
		],
		"关于游戏": [
			"\t[HTML5 魔塔样板] 版本：${main.__VERSION__}\n作者：艾之葵",
			"\t[最初的50层魔塔](C) 1998 - 2000 Oz & Kenichi\n(C) 1996 N.W",
			"\t[flash的50层魔塔]本塔所复刻的版本为：czl_falsh 制作的 flash 版 50 层魔塔。\n该版本与 24 层魔塔、新新魔塔并称为“三原塔”，对中国早期魔塔的发展产生了深远影响。",
			"\t[此前的复刻]（排名不分先后）\n复刻者：数码宝贝51、艾之葵、鹿间裕贵、641\n花絮：鹿间裕贵、艾之葵\n\n在此致谢诸位前辈的探索与积累，为本项目提供了重要参考与传承。",
			"\t[您所游玩的版本]复刻者：详见本塔评论区\n测试者：详见本塔评论区\n\n感谢所有参与其中的玩家与测试者，是你们让本塔不断完善。",
			"\t[还有您]如果您对 H5 魔塔产生了兴趣，甚至希望尝试成为一名创作者，欢迎加入：\nHTML5 魔塔交流群：624253557\n三原魔塔整活宇宙四群：1033598249\n\n感谢您的游玩！"
		]
	}
}