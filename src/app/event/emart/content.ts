// Verified store facts and bilingual event copy. See docs/emart-sinchon-sources.md.
export type Language = "ko" | "zh";
export const languageKey = "emart-demo-language";
export const floorIds = ["B1", "B2", "B3"] as const;
export type FloorId = (typeof floorIds)[number];
export const storeSource = "https://emartapp.emart.com/branch/view.do?id=1139";

type Zone = { name: string; description: string; floor: FloorId };
type Copy = {
  title: string; store: string; guide: string; eventTag: string; eventPlan: string;
  intro: string; address: string; transit: string; language: string; logoAlt: string;
  hours: string; hoursValue: string; closed: string; closedValue: string;
  nav: string; floors: string; floorHint: string; floorFacilities: string;
  facilities: string; parking: string; event: string; zoneNav: string; zones: Zone[];
  floorData: Record<FloorId, { name: string; description: string; shops: string[]; facilities: string; zone?: Zone }>;
  amenities: { id: "parking" | "restroom" | "service" | "baby"; name: string; location: string; floor?: FloorId; href?: string }[];
  facilityHint: string; parkingHours: string; parkingHoursValue: string; feeLabel: string; fee: string; freeLabel: string;
  freeRules: [string, string][]; parkingNote: string; contact: string; phone: string;
  eventTitle: string; eventDescription: string; eventLocation: string; eventNote: string;
  footer: string; source: string; checked: string; top: string;
};

const koZones: Zone[] = [
  { floor: "B1", name: "패킹존", description: "구매한 상품을 여행 가방에 담기 좋게 정리하는 공간" },
  { floor: "B3", name: "K 팔레트", description: "한국의 간식과 생활용품을 취향대로 발견하는 공간" },
];
const zhZones: Zone[] = [
  { floor: "B1", name: "打包整理区", description: "整理购买的商品，轻松装进行李箱。" },
  { floor: "B3", name: "K Palette 韩国好物区", description: "发现合心意的韩国零食与生活好物。" },
];

export const content: Record<Language, Copy> = {
  ko: {
    title: "이마트 신촌점 · K 팔레트 & 패킹존", store: "이마트 신촌점", guide: "신촌에서 만나는 K 쇼핑", eventTag: "이벤트", eventPlan: "행사 기획 공간", logoAlt: "이마트",
    intro: "K 쇼핑의 발견부터, 여행 가방에 담기까지.", address: "서울 마포구 신촌로 94 · 그랜드플라자", transit: "2호선 신촌역 7·8번 출구 바로 연결", language: "언어 선택",
    hours: "영업시간", hoursValue: "10:00–22:30", closed: "예정 휴점일", closedValue: "9/27(일) · 10/11(일) · 10/25(일)",
    nav: "빠른 안내", floors: "층별 안내", floorHint: "신촌점 B1–B3, 원하는 층을 선택하세요.", floorFacilities: "이 층의 안내", facilities: "편의시설", parking: "주차 안내", event: "행사 안내", zoneNav: "행사 공간 바로가기", zones: koZones,
    floorData: {
      B1: { name: "신선식품 · 고객서비스", description: "신선한 장보기와 쇼핑 마무리를 한 층에서.", shops: ["농산 · 수산조리 · 축산", "고객만족센터 · 근거리배송", "상품권샵 · 상품권 키오스크"], facilities: "화장실 · 고객만족센터", zone: koZones[0] },
      B2: { name: "식품 · 음료", description: "냉장·냉동식품부터 다양한 음료까지.", shops: ["가공식품 · 냉장 · 냉동", "조미료 · 주류 · 음료", "벌크커피 · 안경진정성"], facilities: "벌크커피 · 안경진정성 10:00–21:00" },
      B3: { name: "간식 · 생활용품", description: "한국의 맛과 일상을 장바구니에 담아보세요.", shops: ["노브랜드 · 5K Price · 와우", "과자 · 라면 · 대용식", "커피 · 차 · 생활용품"], facilities: "간식 · 생활용품 쇼핑", zone: koZones[1] },
    },
    amenities: [
      { id: "parking", name: "주차장", location: "이용시간 10:00–21:00", href: "#emart-parking" },
      { id: "restroom", name: "화장실", location: "B1 · 지하 1층", floor: "B1" },
      { id: "service", name: "고객만족센터", location: "B1 · 지하 1층", floor: "B1" },
      { id: "baby", name: "수유실 문의", location: "이용 가능 여부는 매장에 문의", href: "tel:0262881234" },
    ],
    facilityHint: "시설 위치와 이용 안내를 바로 확인하세요.", parkingHours: "주차장 이용시간", parkingHoursValue: "10:00–21:00", feeLabel: "기본·초과 주차요금", fee: "현장 요금표 확인", freeLabel: "구매 금액별 무료 주차",
    freeRules: [["3만원 이상", "1시간"], ["5만원 이상", "2시간"], ["8만원 이상", "3시간"]], parkingNote: "구매 고객 1일 최대 3시간 무료. 주차장 이용시간은 매장 영업시간과 다릅니다.", contact: "매장 문의", phone: "02-6288-1234",
    eventTitle: "발견은 K 팔레트에서, 마무리는 패킹존에서.", eventDescription: "B3에서 마음에 드는 한국의 맛과 생활용품을 고르고, B1 패킹존에서 여행 짐을 정리해 보세요.", eventLocation: "B3 K 팔레트 → B1 패킹존", eventNote: "패킹존과 K 팔레트는 이번 행사 기획에 추가한 공간입니다.",
    footer: "매장 정보는 이마트 공식 안내 기준이며, 행사 공간은 기획 구성입니다.", source: "신촌점 공식 안내", checked: "매장 정보 확인: 2026.09.15 · 휴점일은 공식 안내에서 확인해 주세요.", top: "맨 위로",
  },
  zh: {
    title: "易买得新村店 · K Palette & 打包整理区", store: "易买得新村店", guide: "新村韩国好物指南", eventTag: "活动", eventPlan: "活动规划区", logoAlt: "易买得",
    intro: "发现韩国好物，轻松装进行李。", address: "首尔麻浦区新村路94号 · Grand Plaza", transit: "直通地铁2号线新村站7、8号出口", language: "选择语言",
    hours: "营业时间", hoursValue: "10:00–22:30", closed: "近期休息日", closedValue: "9月27日 · 10月11日 · 10月25日（周日）",
    nav: "快捷导航", floors: "楼层指南", floorHint: "新村店位于地下1至3层，点击楼层查看。", floorFacilities: "本层信息", facilities: "便民设施", parking: "停车指南", event: "活动信息", zoneNav: "活动区域快捷入口", zones: zhZones,
    floorData: {
      B1: { name: "生鲜 · 顾客服务", description: "选购新鲜食材，轻松完成购物。", shops: ["果蔬 · 水产熟食 · 肉类", "客服中心 · 周边配送服务", "礼品卡柜台 · 礼品卡自助机"], facilities: "洗手间 · 客服中心", zone: zhZones[0] },
      B2: { name: "食品 · 饮品", description: "冷藏冷冻食品与各类饮品，一站选购。", shops: ["包装食品 · 冷藏 · 冷冻", "调味料 · 酒类 · 饮料", "BULK COFFEE · 眼镜店（안경진정성）"], facilities: "BULK COFFEE、眼镜店营业时间 10:00–21:00" },
      B3: { name: "零食 · 日用品", description: "把韩国的美味与生活好物带回家。", shops: ["No Brand · 5K Price · WOW", "零食 · 方便面 · 代餐食品", "咖啡 · 茶 · 日用品"], facilities: "零食 · 生活好物选购", zone: zhZones[1] },
    },
    amenities: [
      { id: "parking", name: "停车场", location: "开放时间 10:00–21:00", href: "#emart-parking" },
      { id: "restroom", name: "洗手间", location: "B1 · 地下一层", floor: "B1" },
      { id: "service", name: "客服中心", location: "B1 · 地下一层", floor: "B1" },
      { id: "baby", name: "母婴室咨询", location: "请向门店确认是否可使用", href: "tel:0262881234" },
    ],
    facilityHint: "点击查看设施位置或使用信息。", parkingHours: "停车场开放时间", parkingHoursValue: "10:00–21:00", feeLabel: "基本及超时停车费", fee: "请查看现场收费标准", freeLabel: "购物免费停车标准",
    freeRules: [["满3万韩元", "1小时"], ["满5万韩元", "2小时"], ["满8万韩元", "3小时"]], parkingNote: "购物顾客每日最多免费停车3小时。停车场开放时间与门店营业时间不同。", contact: "联系门店", phone: "02-6288-1234",
    eventTitle: "K Palette 发现好物，打包区整理行李。", eventDescription: "在B3挑选喜欢的韩国食品和日用品，再到B1打包整理区收拾旅行购物成果。", eventLocation: "B3 K Palette → B1 打包整理区", eventNote: "打包整理区与K Palette为本次活动规划的新增区域。",
    footer: "门店信息参考易买得官方指南，活动区域为策划方案。", source: "新村店官方指南", checked: "门店信息核对：2026.09.15；休息日请以官方最新公告为准。", top: "返回顶部",
  },
};
