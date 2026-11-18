import type { Metadata } from "next";
import Image from "next/image";

import styles from "./maintenance.module.css";

const notice = "현재 포트폴리오 수정중에 있습니다.";
const returnMessage = "좋은 모습으로 찾아뵙겠습니다.";

export const metadata: Metadata = {
  title: "포트폴리오 수정 중",
  description: `${notice} ${returnMessage}`,
};

export default function MaintenancePage() {
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.message}>
          <h1>{notice}</h1>
          <p>{returnMessage}<br />감사합니다.</p>
          <p className={styles.signature}>이재호 드림</p>
        </div>
        <Image
          alt="공사 중인 공간에 놓인 노란 안전펜스와 주황색 안전 콘"
          className={styles.photo}
          src="/maintenance/under-construction.webp"
          width={1536}
          height={1024}
          preload
        />
      </div>
    </main>
  );
}
