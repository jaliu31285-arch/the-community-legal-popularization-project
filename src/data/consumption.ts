import { KnowledgeItem, CaseItem } from './index';

export const consumptionTraps: { title: string; icon: string; description: string; examples: string[] }[] = [
  {
    title: '不良行为识别',
    icon: 'Cpu',
    description: '未成年人常见的不良行为包括：逃学旷课、夜不归宿、打架斗殴、偷窃、赌博、网络成瘾等。这些行为不仅影响学习，还可能触犯法律，对个人成长造成严重危害。',
    examples: ['逃学旷课', '夜不归宿', '打架斗殴', '偷窃行为'],
  },
  {
    title: '网络成瘾危害',
    icon: 'Gift',
    description: '过度沉迷网络会导致学习成绩下降、视力受损、社交能力退化、身心健康受损，甚至诱发违法犯罪行为。要合理控制上网时间，培养健康的生活习惯。',
    examples: ['沉迷游戏', '熬夜刷视频', '忽视现实社交'],
  },
  {
    title: '未成年人权益',
    icon: 'Coins',
    description: '未成年人享有受教育权、生命健康权、人身自由权、隐私权、财产权等合法权益，任何组织和个人不得侵犯。要学会认识和保护自己的合法权益。',
    examples: ['受教育权', '生命健康权', '隐私权', '财产权'],
  },
  {
    title: '自我保护技巧',
    icon: 'Sparkles',
    description: '面对不良诱惑和侵害时，要学会拒绝、求助、报警，保护自己的人身安全和合法权益。遇到危险时，生命安全永远是第一位的。',
    examples: ['拒绝不良诱惑', '及时告诉家长', '拨打110报警'],
  },
  {
    title: '法律责任意识',
    icon: 'Layers',
    description: '未成年人虽然受法律特殊保护，但实施违法犯罪行为同样要承担相应的法律责任。要从小树立法治观念，知法、懂法、守法。',
    examples: ['违法必究', '承担责任', '依法办事'],
  },
];

export const rationalConsumptionTips: KnowledgeItem[] = [
  {
    id: '1',
    title: '认清不良行为',
    icon: 'HelpCircle',
    content: '了解哪些行为是不良行为，认识其危害和后果。逃学、打架、偷窃、沉迷网络等行为都会影响你的成长，甚至触犯法律。要坚决抵制不良诱惑，选择正确的道路。',
  },
  {
    id: '2',
    title: '学会自我约束',
    icon: 'Wallet',
    content: '面对诱惑时要学会控制自己，不要因为一时冲动做出错误的决定。培养自律能力，养成良好的生活习惯。制定合理的学习和娱乐计划，平衡好时间分配。',
  },
  {
    id: '3',
    title: '懂得求助',
    icon: 'Users',
    content: '遇到困难或受到侵害时，不要独自承受，要及时告诉家长、老师或拨打110报警。求助不是软弱，而是智慧。记住：你不是一个人在战斗，有人会帮助你。',
  },
  {
    id: '4',
    title: '保护自身权益',
    icon: 'Shield',
    content: '了解自己的合法权益，当权益受到侵害时要勇敢维权。未成年人受法律特殊保护，要学会用法律武器保护自己。同时也要尊重他人的合法权益。',
  },
];

export const screenFreeActivities: { title: string; icon: string; description: string; ideas: string[] }[] = [
  {
    title: '法治学习',
    icon: 'BookOpen',
    description: '学习法律知识，增强法治观念',
    ideas: ['阅读普法书籍', '观看法治教育片', '参加法治讲座'],
  },
  {
    title: '户外运动',
    icon: 'Sun',
    description: '走到户外，感受阳光和新鲜空气',
    ideas: ['骑自行车', '打篮球', '跳绳', '跑步', '爬山'],
  },
  {
    title: '兴趣培养',
    icon: 'Palette',
    description: '发展一项自己真正热爱的特长',
    ideas: ['画画', '做手工', '学乐器', '书法', '摄影'],
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
    title: '社会实践',
    icon: 'Music',
    description: '参与公益活动，服务社区',
    ideas: ['社区志愿服务', '普法宣传', '参观学习'],
  },
];

export const consumptionCases: CaseItem[] = [
  {
    id: '1',
    title: '不良行为的代价',
    category: '不良行为',
    summary: '初中生小强参与打架斗殴，造成他人伤害...',
    content: '初中生小强因为一点小事与同学发生争执，随后纠集几名同学对对方进行殴打，造成对方轻伤。小强的行为已经构成故意伤害，警方介入调查后，小强被行政拘留并承担了医疗赔偿责任。学校也对其进行了记过处分。这次经历让小强深刻认识到，冲动和暴力解决不了问题，只会带来严重的后果。',
    tags: ['打架斗殴', '法律责任', '未成年人'],
  },
  {
    id: '2',
    title: '网络成瘾的危害',
    category: '网络成瘾',
    summary: '小学生沉迷网络游戏，荒废学业...',
    content: '小学生小明迷上了一款网络游戏，每天放学后就抱着电脑玩，作业也不做，成绩一落千丈。父母多次劝说无效后，小明开始逃课去网吧，甚至偷拿家里的钱充值游戏。后来父母带小明去看心理医生，通过心理疏导和家庭干预，小明逐渐摆脱了游戏成瘾，重新回到了正常的学习生活中。',
    tags: ['网络游戏', '网络成瘾', '心理健康'],
  },
];
