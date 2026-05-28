export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#dde7f3,#f7e7e2)] text-slate-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-slate-600">Portfolio OS</p>
        <h1 className="mt-4 text-4xl font-bold tracking-normal sm:text-6xl">
          잠금화면에서 시작하는 포트폴리오
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          감성적인 데스크톱 UI로 프로젝트, 기술 경험, 이력서를 탐색하는
          프론트엔드 포트폴리오를 준비 중입니다.
        </p>
      </section>
    </main>
  );
}
