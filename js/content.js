window.GIFT_CONFIG = {
  sender: "dxy",
  recipient: "tx",
  coverLine: "........................",
  coverSub: ".....................",
  date: "2026.08.08", // TODO 测试后恢复 2026.08.08
  countdown: {
    note: "....................",
    afterNote: "......................."
  },
  easterEgg: {
    clicks: 5,
    message: "................................................................"
  },
  letters: [
    {
      id: "opening",
      skin: "rose",
      title: "..............",
      kind: "opening",
      greeting: "............",
      body: "..............................................",
      signature: "—— dxy"
    },
    {
      id: "stars",
      skin: "night",
      title: "..................",
      kind: "stars",
      heading: ".....................",
      final: "......................",
      compliments: [
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................",
        "......................"
      ]
    },
    {
      id: "flower",
      skin: "floral",
      title: "...........",
      kind: "flower",
      question: "......................",
      options: [
        {
          id: "rose",
          name: "玫瑰",
          icon: "🌹",
          image: "assets/flowers/rose.jpg",
          message: "......................？"
        },
        {
          id: "sunflower",
          name: "向日葵",
          icon: "🌻",
          image: "assets/flowers/sunflower.jpg",
          message: "......................"
        },
        {
          id: "tulip",
          name: "郁金香",
          icon: "🌷",
          image: "assets/flowers/tulip.jpg",
          message: "......................"
        },
        {
          id: "money",
          name: "有钱花",
          icon: "💰",
          image: "assets/flowers/money.jpg",
          message: "......................"
        }
      ]
    },
    {
      id: "memories",
      skin: "memories",
      title: "...........",
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
      centerEyebrow: "..........",
      centerTitle: "................",
      centerSub: "...........",
      caption: "...........................",
      final: "..................."
    },
    {
      id: "wish",
      skin: "cake",
      title: "..........",
      kind: "wish",
      line1: "..............",
      line2: ".........",
      prompt: "................",
      after: "....................................."
    },
    {
      id: "ending",
      skin: "gold",
      title: "...............",
      kind: "ending",
      greeting: "..............",
      body: "我不会在意了",
      signature: "—— dxy",
      date: "2026.08.08"
    }
  ]
};
