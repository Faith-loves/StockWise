export function Table({ columns, data, renderActions, emptyMessage = "No records found." }) {
  return (
    <div>
      <div className="hidden overflow-x-auto app-scrollbar md:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
            ))}
            {renderActions && <th className="px-4 py-3 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length ? (
            data.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderActions && <td className="px-4 py-3">{renderActions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length + (renderActions ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <div className="space-y-3 p-4 md:hidden">
        {data.length ? (
          data.map((row) => (
            <div key={row.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold uppercase text-slate-500">{column.label}</span>
                    <span className="text-right text-sm font-medium text-slate-800">
                      {column.render ? column.render(row) : row[column.key]}
                    </span>
                  </div>
                ))}
              </div>
              {renderActions && <div className="mt-4 border-t border-slate-100 pt-3">{renderActions(row)}</div>}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  )
}
