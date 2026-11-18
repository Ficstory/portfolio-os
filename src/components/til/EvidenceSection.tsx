import { Fragment } from "react";
import { parseTILInlineLinks } from "@/lib/tilInlineLinks";
import type { TILBlock } from "@/types/til";
import { TILMedia } from "./TILMedia";
import styles from "./evidence-section.module.css";

type EvidenceTable = { kind: "table"; headers: string[]; rows: string[][] };
type EvidencePart = EvidenceTable | { kind: "paragraph" | "heading"; text: string } | { kind: "media"; block: Exclude<TILBlock, { type: "paragraph" }> };

function inline(text: string) {
  return parseTILInlineLinks(text).map((part, index) => part.href
    ? <a key={index} href={part.href}>{part.text}</a>
    : <Fragment key={index}>{part.text}</Fragment>);
}

function cells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, "|"));
}

function paragraph(text: string) {
  const parts = parseTILInlineLinks(text);
  const firstSource = parts.findIndex(part => part.href);
  if (firstSource < 0) return text;
  const references = parts.slice(firstSource);
  if (references.some(part => !part.href && !/^[\s·]*$/.test(part.text))) return inline(text);
  return <>
    {parts.slice(0, firstSource).map(part => part.text).join("").trimEnd()}
    <span className={styles.sources}>{references.filter(part => part.href).map((part, index) =>
      <a href={part.href} key={index}>{part.text}</a>
    )}</span>
  </>;
}

// The journal parser preserves each Markdown line as a paragraph block. Read
// adjacent table lines together without changing that shared content contract.
function evidenceParts(blocks: TILBlock[]): EvidencePart[] {
  const lines = blocks.flatMap<TILBlock>(block => block.type === "paragraph"
    ? block.text.split("\n").filter(line => line.trim()).map(text => ({ type: "paragraph" as const, text }))
    : [block]);
  const parts: EvidencePart[] = [];
  for (let index = 0; index < lines.length; index++) {
    const block = lines[index];
    if (block.type !== "paragraph") {
      parts.push({ kind: "media", block });
      continue;
    }
    const next = lines[index + 1];
    const headers = cells(block.text);
    if (block.text.trim().startsWith("|") && headers.length > 1 && next?.type === "paragraph" &&
      cells(next.text).length === headers.length && cells(next.text).every(cell => /^:?-{3,}:?$/.test(cell))) {
      const rows: string[][] = [];
      index++;
      while (index + 1 < lines.length) {
        const candidate = lines[index + 1];
        if (candidate.type !== "paragraph" || !candidate.text.trim().startsWith("|")) break;
        const row = cells(candidate.text);
        if (row.length !== headers.length) break;
        rows.push(row);
        index++;
      }
      parts.push({ kind: "table", headers, rows });
    } else {
      const heading = /^###\s+(.+)$/.exec(block.text);
      parts.push(heading ? { kind: "heading", text: heading[1] } : { kind: "paragraph", text: block.text });
    }
  }
  return parts;
}

function Comparison({ table }: { table: EvidenceTable }) {
  return <div className={styles.comparison}>
    <table aria-label={table.headers.join(" · ")}>
      <thead><tr>{table.headers.map((header, index) => <th key={index} scope="col">{inline(header)}</th>)}</tr></thead>
      <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>
        {row.map((cell, cellIndex) => cellIndex === 0
          ? <th key={cellIndex} scope="row">{inline(cell)}</th>
          : <td key={cellIndex}>{inline(cell)}</td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}

function Reactions({ table }: { table: EvidenceTable }) {
  return <figure className={styles.reactions} aria-label={table.headers.join(" · ")}>
    <figcaption className={styles.srOnly}>{table.headers.join(" · ")}</figcaption>
    <ul>{table.rows.map(([label, count, description], index) => <li key={index}>
      <strong className={styles.reactionLabel}>{inline(label)}</strong>
      <div className={styles.reactionQuantity}>
        <span className={styles.reactionCount}>{count}<span>건</span></span>
        <span className={styles.dots} aria-hidden="true">{Array.from({ length: Number(count) }, (_, dot) => <i key={dot} />)}</span>
      </div>
      <p>{inline(description)}</p>
    </li>)}</ul>
  </figure>;
}

function Journey({ table }: { table: EvidenceTable }) {
  return <ol className={styles.journey} aria-label={table.headers.join(" · ")}>
    {table.rows.map(([step, evidence], index) => <li key={index} data-picker={table.headers[0] === "배송 단계" && step === "매장 집품" || undefined}>
      <span className={styles.journeyNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><strong>{inline(step)}</strong><p>{inline(evidence)}</p></div>
    </li>)}
  </ol>;
}

function DispatchRoutes({ table }: { table: EvidenceTable }) {
  return <div className={styles.routes} role="group" aria-label="배송 방식별 주문부터 출고까지">
    {table.rows.map(([service, ...steps]) => <div key={service} className={styles.route}>
      <h4>{service}</h4>
      <ol aria-label={service}>{steps.map((step, index) =>
        <li key={index}><small>{table.headers[index + 1]}</small><span>{inline(step)}</span></li>
      )}</ol>
    </div>)}
  </div>;
}

function Receipt({ table }: { table: EvidenceTable }) {
  return <dl className={styles.receipt} aria-label={table.headers.join(" · ")}>
    {table.rows.map(([label, amount, explanation], index) => <div key={index} data-total={index === table.rows.length - 1}>
      <dt>{inline(label)}</dt>
      <dd className={styles.amount}>{inline(amount)}</dd>
      <dd className={styles.receiptNote}>{inline(explanation)}</dd>
    </div>)}
  </dl>;
}

function IngredientKey({ table }: { table: EvidenceTable }) {
  return <dl className={styles.ingredients} aria-label={table.headers.join(" · ")}>
    {table.rows.map(([ingredient, amount], index) => <div key={index}>
      <dt>{inline(ingredient)}</dt><dd>{inline(amount)}</dd>
    </div>)}
  </dl>;
}

function Table({ table }: { table: EvidenceTable }) {
  if (table.headers[0] === "반응" && table.headers.length === 3 && table.rows.every(row => /^\d+$/.test(row[1]) && Number(row[1]) <= 200)) return <Reactions table={table} />;
  if (["고객여정", "배송 단계"].includes(table.headers[0]) && table.headers.length === 2) return <Journey table={table} />;
  if (table.headers[0] === "배송 방식" && table.headers.length === 4) return <DispatchRoutes table={table} />;
  if (table.headers[0] === "손익 항목" && table.headers.length === 3) return <Receipt table={table} />;
  return <Comparison table={table} />;
}

export function EvidenceSection({ blocks, sectionIndex }: { blocks: TILBlock[]; sectionIndex: number }) {
  const parts = evidenceParts(blocks);
  return <div className={styles.evidence} data-section={sectionIndex}>
    {parts.map((part, index) => {
      const previous = parts[index - 1];
      const next = parts[index + 1];
      if (sectionIndex === 3 && part.kind === "table" && part.headers[0] === "속재료" && part.headers.length === 2 && previous?.kind === "media" && previous.block.type === "image") return null;
      if (part.kind === "media") {
        if (sectionIndex === 3 && part.block.type === "image" && next?.kind === "table" && next.headers[0] === "속재료" && next.headers.length === 2) {
          return <div key={index} className={styles.snapshot} role="group" aria-label={part.block.alt}>
            <TILMedia block={part.block} /><IngredientKey table={next} />
          </div>;
        }
        return <TILMedia key={index} block={part.block} />;
      }
      if (part.kind === "table") return <Table key={index} table={part} />;
      if (part.kind === "heading") return <h3 key={index}>{inline(part.text)}</h3>;
      return <p key={index} className={sectionIndex > 0 && index === parts.length - 1 ? styles.decision : undefined}>{paragraph(part.text)}</p>;
    })}
  </div>;
}
