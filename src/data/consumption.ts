import { KnowledgeItem, CaseItem } from './index';

export const consumptionTraps: { title: string; icon: string; description: string; examples: string[] }[] = [
  {
    title: '算法推荐陷阱',
    icon: 'Cpu',
    description: 'APP通过算法分析你的喜好，不断推送你感兴趣的内容，让你越刷越想刷，不知不觉浪费大量时间。',
    examples: ['短视频自动播放下一个', '购物APP"猜你喜欢"', '游戏首充优惠、连续签到'],
  },
  {
    title: '信息茧房效应',
    icon: 'Layers',
    description: '算法只给你看你喜欢的内容，让你以为世界就是你看到的样子，逐渐失去独立思考能力。',
    examples: ['只刷同类视频', '关注相似观点', '拒绝不同声音'],
  },
  {
    title: '直播打赏陷阱',
    icon: 'Gift',
    description: '主播用各种话术鼓动粉丝刷礼物，设置等级、榜单、PK等机制，诱导攀比性消费。',
    examples: ['"榜一"位置争夺', '主播PK求礼物', '粉丝团等级攀比'],
  },
  {
    title: '游戏充值套路',
    icon: 'Coins',
    description: '游戏设置首充、月卡、战令、抽奖等机制，利用赌博心理让玩家不断投入金钱。',
    examples: ['6元首充大礼包', '抽卡/开箱机制', '限定皮肤限时出售'],
  },
  {
    title: '虚假福利诱导',
    icon: 'Sparkles',
    description: '用"免费""0元""秒杀"等字眼吸引点击，实际暗藏消费陷阱或个人信息泄露风险。',
    examples: ['0元领手机（邮费自理）', '助力砍价免费拿', '新人专享大礼包'],
  },
];

export const rationalConsumptionTips: KnowledgeItem[] = [
  {
    id: '1',
    title: '消费前问自己三个问题',
    icon: 'HelpCircle',
    content: '1. 这是我真正需要的吗？还是只是想要？\n2. 不买会怎么样？买了会用多久？\n3. 这个价钱值得吗？有没有更便宜的选择？\n\n想清楚再决定，不要被"限时""秒杀"冲昏头脑。',
  },
  {
    id: '2',
    title: '设立消费预算',
    icon: 'Wallet',
    content: '每个月和家长一起制定零花钱计划：\n- 必要支出：学习用品、交通费\n- 可选支出：零食、娱乐\n- 储蓄目标：想买的大件\n\n养成记账的好习惯，知道钱花在哪里。',
  },
  {
    id: '3',
    title: '警惕从众心理',
    icon: 'Users',
    content: '同学们都有，我也一定要有吗？\n- 思考自己是否真的需要，而不是攀比\n- 每个人的家庭情况不同，不用比较\n- 真正的友谊不靠物质维持\n- 内在品质比外在物品更重要',
  },
  {
    id: '4',
    title: '保护个人信息和财产',
    icon: 'Shield',
    content: '1. 不告诉任何人支付密码、验证码\n2. 不随意绑定银行卡、开通免密支付\n3. 充值、打赏前一定要经过家长同意\n4. 发现被扣费立即告诉家长并报警',
  },
];

export const screenFreeActivities: { title: string; icon: string; description: string; ideas: string[] }[] = [
  {
    title: '户外运动',
    icon: 'Sun',
    description: '走到户外，感受阳光和新鲜空气',
    ideas: ['骑自行车', '打篮球', '跳绳', '跑步', '爬山'],
  },
  {
    title: '手工创作',
    icon: 'Palette',
    description: '用双手创造属于自己的作品',
    ideas: ['折纸', '画画', '做手工', '乐高', '拼图'],
  },
  {
    title: '阅读时光',
    icon: 'BookOpen',
    description: '在书本中探索广阔的世界',
    ideas: ['故事书', '科普读物', '漫画书', '历史传记', '诗歌散文'],
  },
  {
    title: '家务劳动',
    icon: 'Home',
    description: '帮家人分担家务，学会独立生活',
    ideas: ['整理房间', '学做菜', '洗碗', '扫地拖地', '浇花'],
  },
  {
    title: '社交互动',
    icon: 'Users',
    description: '和家人朋友面对面交流玩耍',
    ideas: ['和爸妈聊天', '找同学玩', '下棋打牌', '玩桌游', '一起运动'],
  },
  {
    title: '兴趣培养',
    icon: 'Music',
    description: '发展一项自己真正热爱的特长',
    ideas: ['学乐器', '跳舞', '书法', '摄影', '编程'],
  },
];

export const consumptionCases: CaseItem[] = [
  {
    id: '1',
    title: '直播打赏的教训',
    category: '直播打赏',
    summary: '初中生小华沉迷某主播，两个月打赏花光积蓄...',
    content: '初中生小华很喜欢看某游戏主播的直播。主播经常说"榜一粉丝加好友""刷礼物就一起玩游戏"。小华为了引起主播注意，开始用零花钱打赏，从几块钱到几十块，越刷越多。两个月下来，他花光了攒了三年的5000多元压岁钱，还偷拿了家里的钱。直到家长发现银行卡异常，事情才暴露。小华非常后悔，在家长帮助下联系平台追回了部分钱款。',
    tags: ['直播打赏', '攀比心理', '未成年人'],
  },
  {
    id: '2',
    title: '游戏抽卡的无底洞',
    category: '游戏充值',
    summary: '小学生沉迷抽卡游戏，为一张"稀有卡"充值上千元...',
    content: '小学生阿杰迷上了一款卡牌收集游戏。游戏里有"稀有卡""限定卡"，抽中概率很低。阿杰总想抽到最稀有的那张，一次又一次充值，心里想着"再抽一次肯定中"。短短一个月，他偷偷用妈妈的手机充值了3000多元，却始终没抽到想要的卡。妈妈发现后非常生气，带着阿杰一起学习了理性消费知识，还一起制定了零花钱使用计划。',
    tags: ['游戏抽卡', '赌博心理', '非理性消费'],
  },
];
