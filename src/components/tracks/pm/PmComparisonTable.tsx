import { pmComparisonRows } from "@/components/tracks/pm/pmLandingContent";

export function PmComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <caption className="sr-only">PM 방식 적용 전후 비교</caption>
        <thead className="bg-slate-950 text-white">
          <tr>
            {["기준", "기존 상태", "PM으로 정리한 방식", "기대/확인된 효과"].map(
              (header) => (
                <th
                  className="px-4 py-3 text-xs font-bold uppercase tracking-normal"
                  key={header}
                  scope="col"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {pmComparisonRows.map((row) => (
            <tr className="border-t border-slate-200" key={row.criteria}>
              <th
                className="w-[18%] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950"
                scope="row"
              >
                {row.criteria}
              </th>
              <td className="px-4 py-4 text-sm leading-6 text-slate-700">
                {row.before}
              </td>
              <td className="px-4 py-4 text-sm leading-6 text-slate-700">
                {row.after}
              </td>
              <td className="px-4 py-4 text-sm leading-6 text-slate-700">
                {row.effect}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
