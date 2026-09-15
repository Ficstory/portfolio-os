// All visitor-facing copy and sample store data live here. These are fictional values.
export type Language = "ko" | "zh";
export const languageKey = "emart-demo-language";
export const floorIds = ["B2", "B1", "1F", "2F"] as const;
export type FloorId = (typeof floorIds)[number];

type Copy = {
  title: string; store: string; guide: string; demo: string; sample: string;
  intro: string; noticeKo: string; noticeZh: string; language: string;
  hours: string; hoursValue: string; closed: string; closedValue: string;
  nav: string; floors: string; floorHint: string; floorFacilities: string;
  facilities: string; parking: string; event: string;
  floorData: Record<FloorId, { name: string; description: string; shops: string[]; facilities: string }>;
  amenities: { id: "parking" | "restroom" | "service" | "baby"; name: string; location: string; floor: FloorId }[];
  facilityHint: string; feeLabel: string; fee: string; freeLabel: string;
  freeRules: [string, string][]; parkingNote: string;
  eventTitle: string; eventDescription: string; eventLocation: string; eventNote: string;
  footer: string; top: string;
};

const notices = {
  noticeKo: "가상 지점의 시연용 예시입니다. 실제 이마트의 운영·요금·행사 정보가 아닙니다.",
  noticeZh: "本页面为虚构门店演示，营业时间、停车收费和活动均为示例，并非易买得实际信息。",
};

export const content: Record<Language, Copy> = {
  ko: {
    ...notices,
    title: "이마트 샘플점 · 매장 안내 데모", store: "이마트 샘플점", guide: "매장 안내", demo: "데모", sample: "시연용 예시",
    intro: "필요한 매장 정보를, 한눈에.", language: "언어 선택", hours: "영업시간", hoursValue: "10:00–22:00", closed: "휴무일", closedValue: "매월 둘째·넷째 일요일",
    nav: "빠른 안내", floors: "층별 안내", floorHint: "층을 눌러 매장과 시설을 확인하세요.", floorFacilities: "이 층의 편의시설",
    facilities: "편의시설", parking: "주차 안내", event: "행사 안내",
    floorData: {
      B2: { name: "주차장", description: "주차 후 엘리베이터로 매장에 올라오세요.", shops: ["일반 주차 구역", "교통약자 우선 주차 구역", "사전 정산기"], facilities: "엘리베이터 · 주차 정산기" },
      B1: { name: "식품 · 일상 장보기", description: "신선한 먹거리부터 오늘의 식탁까지.", shops: ["신선식품 · 과일 · 채소", "정육 · 수산 · 냉장식품", "베이커리 · 간편식"], facilities: "고객센터 · 화장실 · 엘리베이터" },
      "1F": { name: "생활 · 패션", description: "매일 쓰는 생활용품과 가족의 옷을 만나보세요.", shops: ["생활용품 · 주방용품", "의류 · 잡화", "뷰티 · 건강용품"], facilities: "수유실 · 화장실 · 엘리베이터" },
      "2F": { name: "식사 · 휴식", description: "장보기 사이, 편하게 쉬어 가세요.", shops: ["푸드코트", "카페", "가전 · 인테리어"], facilities: "화장실 · 휴게 공간 · 엘리베이터" },
    },
    amenities: [
      { id: "parking", name: "주차장", location: "B2 · 지하 2층", floor: "B2" },
      { id: "restroom", name: "화장실", location: "B1 · 1F · 2F", floor: "B1" },
      { id: "service", name: "고객센터", location: "B1 · 계산대 옆", floor: "B1" },
      { id: "baby", name: "수유실", location: "1F · 엘리베이터 옆", floor: "1F" },
    ],
    facilityHint: "시설을 누르면 해당 층으로 이동합니다.", feeLabel: "기본요금", fee: "10분당 1,000원", freeLabel: "구매 금액별 무료 주차",
    freeRules: [["3만원 이상", "1시간"], ["5만원 이상", "2시간"], ["10만원 이상", "3시간"]],
    parkingNote: "당일 영수증으로 사전 정산 · 최대 3시간 · 무료 시간 초과 시 기본요금 적용 (모두 예시)",
    eventTitle: "장바구니에 담는 작은 실천", eventDescription: "장바구니를 가져오면 재사용 스티커 1장을 드려요.", eventLocation: "B1 고객센터 · 시연용 행사", eventNote: "실제로 진행하는 행사가 아니며, 혜택은 제공되지 않습니다.",
    footer: "이마트와 무관한 비공식 시연 페이지입니다.", top: "맨 위로",
  },
  zh: {
    ...notices,
    title: "易买得示例店 · 门店指南演示", store: "易买得示例店", guide: "门店指南", demo: "演示", sample: "演示信息",
    intro: "逛店所需，一目了然。", language: "选择语言", hours: "营业时间", hoursValue: "10:00–22:00", closed: "休息日", closedValue: "每月第二、第四个周日",
    nav: "快捷导航", floors: "楼层指南", floorHint: "点击楼层，查看商品区和设施。", floorFacilities: "本层设施",
    facilities: "便民设施", parking: "停车指南", event: "活动信息",
    floorData: {
      B2: { name: "停车场", description: "停车后，可乘电梯前往购物楼层。", shops: ["普通停车区", "无障碍优先停车区", "自助缴费机"], facilities: "电梯 · 自助缴费机" },
      B1: { name: "食品 · 生鲜", description: "从新鲜食材到便捷美食，一站购齐。", shops: ["生鲜 · 水果 · 蔬菜", "肉类 · 水产 · 冷藏食品", "烘焙 · 即食食品"], facilities: "客服中心 · 洗手间 · 电梯" },
      "1F": { name: "日用 · 服饰", description: "选购日用好物，为全家添置新衣。", shops: ["日用品 · 厨房用品", "服装 · 配饰", "美妆 · 健康用品"], facilities: "母婴室 · 洗手间 · 电梯" },
      "2F": { name: "餐饮 · 休闲", description: "逛累了，来这里吃点东西、歇歇脚。", shops: ["美食广场", "咖啡店", "家电 · 家居"], facilities: "洗手间 · 休息区 · 电梯" },
    },
    amenities: [
      { id: "parking", name: "停车场", location: "B2 · 地下二层", floor: "B2" },
      { id: "restroom", name: "洗手间", location: "B1 · 1F · 2F", floor: "B1" },
      { id: "service", name: "客服中心", location: "B1 · 收银台旁", floor: "B1" },
      { id: "baby", name: "母婴室", location: "1F · 电梯旁", floor: "1F" },
    ],
    facilityHint: "点击设施，可跳转至对应楼层。", feeLabel: "基本收费", fee: "每10分钟 1,000韩元", freeLabel: "购物免费停车标准",
    freeRules: [["满3万韩元", "1小时"], ["满5万韩元", "2小时"], ["满10万韩元", "3小时"]],
    parkingNote: "凭当日购物小票自助缴费，最多免费3小时；超时按基本收费标准计费。（以上均为示例）",
    eventTitle: "自带购物袋，环保多一点", eventDescription: "带上购物袋，即可领取一张环保贴纸。", eventLocation: "B1 客服中心 · 活动示例", eventNote: "本活动仅用于演示，不实际举办，也不提供赠品。",
    footer: "本页面为非官方演示，与易买得无关联。", top: "返回顶部",
  },
};
