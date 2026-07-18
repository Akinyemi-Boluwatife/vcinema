export const PER_PAGE = 10;

export function parsePage(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function paginate(list, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const safe = Math.min(Math.max(1, page), totalPages);
  const start = (safe - 1) * perPage;
  return list.slice(start, start + perPage);
}
