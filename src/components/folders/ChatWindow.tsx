"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const exampleQuestions = [
  "대표 프로젝트에서 맡은 역할은 무엇인가요?",
  "주로 사용하는 프론트엔드 기술은 무엇인가요?",
  "문제 해결 경험을 요약해줘.",
  "이 지원자의 강점을 알려줘.",
] as const;

export function ChatWindow() {
  const [draft, setDraft] = useState("");

  return (
    <section
      aria-labelledby="chat-window-heading"
      className="flex min-h-full flex-col gap-5"
    >
      <header className="flex items-start gap-4 rounded-lg border border-slate-200/80 bg-white/56 p-4 dark:border-white/12 dark:bg-slate-950/28">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#dcebff] text-slate-800 dark:bg-white/10 dark:text-slate-100">
          <Bot aria-hidden="true" size={24} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-200">
            Local model ready slot
          </p>
          <h3
            className="text-xl font-bold text-slate-950 dark:text-white"
            id="chat-window-heading"
          >
            Portfolio AI
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            안녕하세요. 이 포트폴리오의 프로젝트, 기술 스택, 이력 정보를 바탕으로
            답변할 준비를 하고 있어요. 현재는 로컬 모델 연결 전 상태입니다.
          </p>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles
            aria-hidden="true"
            className="text-sky-700 dark:text-sky-200"
            size={17}
            strokeWidth={2.2}
          />
          <h4 className="text-sm font-bold text-slate-950 dark:text-white">
            예시 질문
          </h4>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {exampleQuestions.map((question) => (
            <button
              className="min-h-12 rounded-lg border border-slate-200/80 bg-white/58 px-3 py-2 text-left text-sm font-semibold leading-5 text-slate-800 transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:border-white/12 dark:bg-white/8 dark:text-slate-100 dark:hover:bg-white/14"
              key={question}
              onClick={() => setDraft(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-dashed border-slate-300/80 bg-white/42 p-4 dark:border-white/16 dark:bg-slate-950/20">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          로컬 모델 API가 연결되면 이 입력값을 채팅 endpoint로 전송하고 응답을 이
          창 안에 표시합니다. 지금은 메시지를 보내지 않는 준비 화면입니다.
        </p>
      </div>

      <form
        aria-label="AI Chat message composer"
        className="flex flex-col gap-3 rounded-lg border border-slate-200/80 bg-white/64 p-3 dark:border-white/12 dark:bg-slate-950/30"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="portfolio-ai-message">
          AI Chat 질문 입력
        </label>
        <textarea
          className="min-h-24 resize-none rounded-md border border-slate-200/80 bg-white/80 px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-[#4f8fd9] focus:ring-4 focus:ring-[#4f8fd9]/18 dark:border-white/12 dark:bg-white/8 dark:text-slate-50 dark:placeholder:text-slate-400"
          id="portfolio-ai-message"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="포트폴리오에 대해 질문해보세요."
          value={draft}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-muted">
            currently preparing local model connection
          </p>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white opacity-55 dark:bg-white dark:text-slate-950"
            disabled
            title="로컬 모델 API 연결 후 활성화됩니다."
            type="submit"
          >
            <Send aria-hidden="true" size={16} strokeWidth={2.2} />
            전송
          </button>
        </div>
      </form>
    </section>
  );
}
