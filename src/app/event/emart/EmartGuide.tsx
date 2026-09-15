"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowUp, ArrowUpRight, Baby, CarFront, ChevronRight, Clock3, Headphones, Info, MapPin, ShoppingBag, Toilet } from "lucide-react";
import { content, floorIds, languageKey, type FloorId, type Language } from "./content";
import styles from "./emart.module.css";

const changeEvent = "emart-language-change";
const icons = { parking: CarFront, restroom: Toilet, service: Headphones, baby: Baby };

function readLanguage(): Language {
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "ko" || requested === "zh") return requested;
  try { return localStorage.getItem(languageKey) === "zh" ? "zh" : "ko"; }
  catch { return "ko"; }
}

function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("popstate", callback);
  };
}

export default function EmartGuide() {
  const detectedLanguage = useSyncExternalStore(subscribe, readLanguage, () => "ko" as Language);
  // Local state also keeps the selector working when browser storage is unavailable.
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const language = selectedLanguage ?? detectedLanguage;
  const [floor, setFloor] = useState<FloorId>("B1");
  const t = content[language];
  const currentFloor = t.floorData[floor];

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    const previousTitle = document.title;
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "ko";
    document.title = t.title;
    return () => { document.documentElement.lang = previousLanguage; document.title = previousTitle; };
  }, [language, t.title]);

  function changeLanguage(next: Language) {
    const scrollPosition = window.scrollY;
    setSelectedLanguage(next);
    try { localStorage.setItem(languageKey, next); } catch { /* Selection still works in memory. */ }
    const url = new URL(window.location.href);
    // A manual choice replaces an explicit URL choice, so reload stays consistent.
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", next);
      window.history.replaceState(window.history.state, "", url);
    }
    window.dispatchEvent(new Event(changeEvent));
    requestAnimationFrame(() => window.scrollTo({ top: scrollPosition, behavior: "instant" }));
  }

  function showFacility(next: FloorId) {
    setFloor(next);
    document.getElementById("emart-floors")?.scrollIntoView({ behavior: "instant", block: "start" });
  }

  return (
    <div className={styles.page} id="emart-top" lang={language === "zh" ? "zh-Hans" : "ko"}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#emart-top" className={styles.brand} aria-label={t.store}>emart<span>{t.demo}</span></a>
          <div className={styles.languages} role="group" aria-label={t.language}>
            <button type="button" lang="ko" aria-pressed={language === "ko"} onClick={() => changeLanguage("ko")}>한국어</button>
            <button type="button" lang="zh-Hans" aria-pressed={language === "zh"} onClick={() => changeLanguage("zh")}>中文(简体)</button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="store-name">
          <p className={styles.eyebrow}><MapPin size={16} aria-hidden="true" />{t.guide}</p>
          <h1 id="store-name">{t.store}</h1>
          <p className={styles.tagline}>{t.intro}</p>
          <div className={styles.hours}>
            <div><span><Clock3 size={17} aria-hidden="true" />{t.hours} <small>{t.sample}</small></span><strong>{t.hoursValue}</strong></div>
            <div><span>{t.closed}</span><b>{t.closedValue}</b></div>
          </div>
        </section>

        <aside className={styles.notice} aria-label={t.sample}>
          <Info size={18} aria-hidden="true" />
          <div><p lang="ko">{t.noticeKo}</p><p lang="zh-Hans">{t.noticeZh}</p></div>
        </aside>

        <nav className={styles.quickNav} aria-label={t.nav}>
          <a href="#emart-floors">{t.floors}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href="#emart-facilities">{t.facilities}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href="#emart-parking">{t.parking}<ArrowUpRight size={17} aria-hidden="true" /></a>
        </nav>

        <section className={styles.section} id="emart-floors" aria-labelledby="floor-heading">
          <div className={styles.sectionHeading}><h2 id="floor-heading">{t.floors}</h2><span>{t.sample}</span></div>
          <p className={styles.hint}>{t.floorHint}</p>
          <div className={styles.floorButtons} role="group" aria-label={t.floors}>
            {floorIds.map(id => <button type="button" key={id} aria-pressed={floor === id} aria-controls="emart-floor-panel" onClick={() => setFloor(id)}>{id}</button>)}
          </div>
          <div className={styles.floorPanel} id="emart-floor-panel" aria-live="polite" aria-atomic="true">
            <div className={styles.floorTitle}><span>{floor}</span><div><h3>{currentFloor.name}</h3><p>{currentFloor.description}</p></div></div>
            <ul className={styles.shopList}>{currentFloor.shops.map((shop, i) => <li key={i}><ShoppingBag size={18} aria-hidden="true" />{shop}</li>)}</ul>
            <div className={styles.floorFacilities}><span>{t.floorFacilities}</span><p>{currentFloor.facilities}</p></div>
          </div>
        </section>

        <section className={styles.section} id="emart-facilities" aria-labelledby="facility-heading">
          <div className={styles.sectionHeading}><h2 id="facility-heading">{t.facilities}</h2></div>
          <p className={styles.hint}>{t.facilityHint}</p>
          <div className={styles.facilityGrid}>
            {t.amenities.map(item => { const Icon = icons[item.id]; return <button type="button" key={item.id} onClick={() => showFacility(item.floor)}><Icon size={26} strokeWidth={1.7} aria-hidden="true" /><strong>{item.name}</strong><span>{item.location}</span><ChevronRight className={styles.facilityArrow} size={17} aria-hidden="true" /></button>; })}
          </div>
        </section>

        <section className={styles.section} id="emart-parking" aria-labelledby="parking-heading">
          <div className={styles.sectionHeading}><h2 id="parking-heading">{t.parking}</h2><span>{t.sample}</span></div>
          <div className={styles.parkingRate}><CarFront size={27} aria-hidden="true" /><div><span>{t.feeLabel}</span><strong>{t.fee}</strong></div></div>
          <h3 className={styles.ruleTitle}>{t.freeLabel}</h3>
          <dl className={styles.parkingRules}>{t.freeRules.map(([amount, duration]) => <div key={amount}><dt>{amount}</dt><dd>{duration}</dd></div>)}</dl>
          <p className={styles.parkingNote}>{t.parkingNote}</p>
        </section>

        <section className={styles.event} aria-labelledby="event-heading">
          <span className={styles.eventBadge}>{t.event} · {t.demo}</span>
          <ShoppingBag className={styles.eventIcon} size={62} strokeWidth={1.2} aria-hidden="true" />
          <h2 id="event-heading">{t.eventTitle}</h2>
          <p>{t.eventDescription}</p>
          <strong>{t.eventLocation}</strong>
          <small>{t.eventNote}</small>
        </section>
      </main>
      <footer className={styles.footer}><p>{t.footer}</p><a href="#emart-top">{t.top}<ArrowUp size={16} aria-hidden="true" /></a></footer>
    </div>
  );
}
