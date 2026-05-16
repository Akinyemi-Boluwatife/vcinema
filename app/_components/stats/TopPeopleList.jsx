export default function TopPeopleList({ title, people }) {
  return (
    <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-4 flex-1">
      <p className="text-on-surface text-sm font-semibold mb-3">{title}</p>
      {people.length === 0 ? (
        <p className="text-on-surface-variant text-xs">No data yet.</p>
      ) : (
        <ol className="flex flex-col gap-2 list-none p-0 m-0">
          {people.map((p, i) => (
            <li
              key={p.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-on-surface-variant text-xs w-5 shrink-0">
                  {i + 1}.
                </span>
                <span className="text-on-surface truncate">{p.name}</span>
              </span>
              <span className="bg-primary-container text-on-primary-container text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
                {p.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
