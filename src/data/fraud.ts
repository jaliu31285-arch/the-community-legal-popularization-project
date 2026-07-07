import { KnowledgeItem, CaseItem } from './index';

export interface FraudType {
  id: string;
  title: string;
  icon: string;
  description: string;
  tips: string[];
}

export const fraudTypes: FraudType[] = [
  {
    id: '1',
    title: '免费皮肤/装备诈骗',
    icon: 'Gamepad2',
    description: '以"免费领取游戏皮肤""限时送装备"为诱饵，诱导点击钓鱼链接或扫码转账。',
    tips: [
      '天上不会掉馅饼，免费皮肤要警惕',
      '不点击陌生链接，不扫来源不明的二维码',
      '官方活动请通过游戏内渠道参与',
    ],
  },
  {
    id: '2',
    title: '虚假中奖诈骗',
    icon: 'Gift',
    description: '通过弹窗、私信告知"恭喜你中奖了"，要求缴纳手续费、税费才能领奖。',
    tips: [
      '收到中奖信息先核实，不急于操作',
      '正规中奖不会让你先交钱',
      '索要银行卡、验证码的都是诈骗',
    ],
  },
  {
    id: '3',
    title: '冒充熟人诈骗',
    icon: 'UserCheck',
    description: '盗用同学、亲友账号，以"急需用钱""充值游戏"等理由要求转账。',
    tips: [
      '遇到好友借钱，务必电话或视频核实',
      '不轻易向陌生账号转账',
      '账号被盗及时通知亲友',
    ],
  },
  {
    id: '4',
    title: '游戏交易诈骗',
    icon: 'ShoppingCart',
    description: '在游戏中低价出售账号、装备、金币，诱导私下交易后拉黑消失。',
    tips: [
      '游戏交易走官方平台，拒绝私下交易',
      "价格远低于市场价的肯定有诈",
      '不下载对方发来的交易软件',
    ],
  },
  {
    id: '5',
    title: '刷单返利诈骗',
    icon: 'RefreshCw',
    description: '以"轻松赚钱""日赚百元"为噱头，先给小额返利，再诱导大额投入后卷款跑路。',
    tips: [
      '刷单本身就是违法行为',
      '先小返利后大坑，千万不要信',
      '不下载刷单APP，不加入刷单群',
    ],
  },
  {
    id: '6',
    title: '虚假网课诈骗',
    icon: 'GraduationCap',
    description: '冒充培训机构老师，以"特价课程""限时优惠"诱导家长扫码付款。',
    tips: [
      '报课通过官方渠道，不私下转账',
      '核实机构资质和老师身份',
      '保留付款凭证和聊天记录',
    ],
  },
];

export const fraudScripts: { title: string; script: string; reveal: string }[] = [
  {
    title: '"客服"退款话术',
    script: '"您好，您购买的商品质量有问题，我们要给您退款，请点击链接填写银行卡信息..."',
    reveal: '正规商家退款会通过原支付渠道返回，不会要求你提供银行卡密码或验证码！',
  },
  {
    title: '"老师"收费话术',
    script: '"家长您好，我是孩子的班主任，学校要收一笔资料费，请转到这个账号..."',
    reveal: '老师不会通过私人微信/QQ收取费用，收费会有学校正式通知，请打电话核实！',
  },
  {
    title: '"明星"粉丝话术',
    script: '"XX明星粉丝群招募啦，加入就能获得签名照，只需要交50元会费..."',
    reveal: '明星官方粉丝团不会收取费用，索要钱财的都是诈骗，切勿上当！',
  },
];

export const antiFraudSteps: { step: number; title: string; description: string; icon: string }[] = [
  { step: 1, title: '保持冷静', description: '发现被骗后不要慌张，也不要因为害怕被骂而隐瞒', icon: 'Wind' },
  { step: 2, title: '保存证据', description: '保存好聊天记录、转账凭证、对方账号等所有证据', icon: 'Camera' },
  { step: 3, title: '立即报警', description: '第一时间拨打110报警，或向家长、老师求助', icon: 'Phone' },
  { step: 4, title: '冻结账户', description: '如果是银行卡转账，立即联系银行冻结对方账户', icon: 'Lock' },
  { step: 5, title: '举报平台', description: '在相关平台举报诈骗账号，防止更多人受骗', icon: 'Flag' },
];

export const antiFraudMotto = [
  '未知链接不点击，陌生来电不轻信',
  '个人信息不透露，转账汇款多核实',
  '天上不会掉馅饼，免费午餐是陷阱',
  '遇到诈骗不要慌，告诉家长找警察',
];

export const fraudCases: CaseItem[] = [
  {
    id: '1',
    title: '游戏皮肤被骗记',
    category: '游戏诈骗',
    summary: '小学生小宇看到"免费领王者皮肤"的广告，扫码后被骗走2000元...',
    content: '小学生小宇在刷短视频时，看到一条"免费领王者荣耀限定皮肤"的广告。他扫码添加了对方QQ，对方说需要支付50元激活费就能领皮肤。小宇转账后，对方又说需要200元保证金、500元解封费...就这样一步步被骗走了2000元压岁钱。直到对方拉黑他，小宇才意识到被骗，哭着告诉了妈妈。妈妈立即报警，警方介入调查。',
    tags: ['游戏皮肤', '扫码诈骗', '小学生'],
  },
  {
    id: '2',
    title: '假班主任真骗钱',
    category: '冒充诈骗',
    summary: '骗子混入家长群冒充班主任，收取"资料费"骗走上万元...',
    content: '某中学家长群里，一个头像和昵称都和班主任一模一样的人发通知："各位家长好，学校要收取下学期资料费380元，请扫码支付。"不少家长没多想就转了账。直到真正的班主任出来辟谣，大家才发现被骗。短短半小时就有30多位家长转账，损失上万元。警方提醒：家长群收费务必电话核实！',
    tags: ['家长群', '冒充老师', '扫码支付'],
  },
];
