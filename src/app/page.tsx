import type { Metadata } from "next";
import Image from "next/image";

import styles from "./maintenance.module.css";

export const metadata: Metadata = {
  title: "포트폴리오 수정 중",
  description: "현재 포트폴리오 수정 중에 있습니다. 좋은 모습으로 다시 찾아뵙겠습니다.",
};

export default function MaintenancePage() {
  return (
    <main className={styles.page}>
      <Image
        alt=""
        className={styles.photo}
        src="/maintenance/under-construction.webp"
        fill
        sizes="100vw"
        preload
      />
      <div className={styles.message}>
        <h1>현재 포트폴리오 <span className={styles.highlight}>수정 중</span>에 있습니다.</h1>
        <p>좋은 모습으로 다시 찾아뵙겠습니다.<br />감사합니다.</p>
        <p className={styles.signature}>이재호 드림</p>
      </div>
    </main>
  );
}
