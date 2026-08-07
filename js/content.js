window.GIFT_CONFIG = {
  sender: "dxy",
  recipient: "tx",
  coverLine: "今天好像是你的生日，有个礼物给你",
  coverSub: "dxy 准备的一点小心思",
  date: "2026.08.08", // TODO 测试后恢复 2026.08.08
  countdown: {
    note: "dxy 的一点点小心思，8.8 那天见。",
    afterNote: "想我了？回忆一下吧"
  },
  easterEgg: {
    clicks: 5,
    message: "哈哈被你发现啦！偷偷告诉你，我改了好几遍，有些话改了又删，删了又改，就怕太肉麻。总而言之，生日快乐，tx。"
  },
  letters: [
    {
      id: "opening",
      skin: "rose",
      title: "生日快乐",
      kind: "opening",
      greeting: "给 tx：",
      body: "生日快乐！不知道要送啥你需要啥。随随便便准备了下，凑合凑合吧。",
      signature: "—— dxy"
    },
    {
      id: "stars",
      skin: "night",
      title: "二十一",
      kind: "stars",
      heading: "点亮 21 颗星星",
      final: "100字，还完了哦",
      compliments: [
        "笑起来很好看",
        "恰似皓月，干净温柔",
        "总能把气氛变好",
        "眼光不错，认识我算一件",
        "小小的身体，大大的能量",
        "善良的内心是藏不住的",
        "天生丽质难自弃",
        "走路带风，气质拿捏",
        "活泼的生命，有趣的灵魂",
        "贵人多忘事哈哈",
        "有福气的幸运的",
        "天马行空的思维",
        "穿什么都好好看",
        "心情不好和我说啊 this is order",
        "细腻的心思",
        "说话交流非常有意思",
        "全世界都该夸你，不止生日这天",
        "声音好听，唱歌好听",
        "王者的好伙伴，温柔辅助，天才中单",
        "偶尔的小脾气也很可爱",
        "21 了，永远的18哈哈"
      ]
    },
    {
      id: "flower",
      skin: "floral",
      title: "一朵花",
      kind: "flower",
      question: "哈哈来朵花吧，你想要什么？",
      options: [
        {
          id: "rose",
          name: "玫瑰",
          icon: "🌹",
          image: "assets/flowers/rose.jpg",
          message: "嘿嘿，永不凋零之花，喜欢不？"
        },
        {
          id: "sunflower",
          name: "向日葵",
          icon: "🌻",
          image: "assets/flowers/sunflower.jpg",
          message: "还要真实的？同dxy讲吧"
        },
        {
          id: "tulip",
          name: "郁金香",
          icon: "🌷",
          image: "assets/flowers/tulip.jpg",
          message: "哈哈先凑合凑合，下次给"
        },
        {
          id: "money",
          name: "有钱花",
          icon: "💰",
          image: "assets/flowers/money.jpg",
          message: "大钱花没有，有小钱花，找 dxy 兑现吧"
        }
      ]
    },
    {
      id: "memories",
      skin: "memories",
      title: "一些回忆",
      kind: "memories",
      orbit: {
        shape: "ellipse",
        radiusX: 300,
        radiusY: 110,
        rotation: -8,
        duration: 28,
        itemSize: 70,
        images: [
          "assets/photos/photo-1.jpg",
          "assets/photos/photo-2.jpg",
          "assets/photos/photo-3.jpg",
          "assets/photos/photo-4.jpg",
          "assets/photos/photo-5.jpg",
          "assets/photos/photo-6.jpg"
        ]
      },
      centerEyebrow: "一点一滴",
      centerTitle: "我们的回忆",
      centerSub: "都是宝藏",
      caption: "这回忆的漩涡 快要将我吞没 求你别离开我~",
      final: "愿所有回忆，都化作未来的勇气"
    },
    {
      id: "wish",
      skin: "cake",
      title: "愿望",
      kind: "wish",
      line1: "流程还是有的",
      line2: "噔噔！",
      prompt: "许愿吧！",
      after: "哈哈，不知道你吹了没，我帮你吹了，愿望我实现不了，但能做些力所能及的事，同dxy讲吧"
    },
    {
      id: "ending",
      skin: "gold",
      title: "一切安好",
      kind: "ending",
      greeting: "给 TX：",
      body: "要落幕了，一些关心的、祝福的、在意的话，本想一顿输出而来，但会不会有些多愁善感了，还是算了吧，千言万语汇成一句，生日快乐，TX...",
      signature: "—— dxy",
      date: "2026.08.08"
    }
  ]
};
