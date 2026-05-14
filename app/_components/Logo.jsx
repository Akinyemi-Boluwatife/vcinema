import Link from "next/link";


export default function Logo() {

  return (
    <Link
      href="/"
      className="no-underline flex items-center gap-1.5 flex-shrink-0"
    >
      <span className="text-lg">🎬</span>
      <span className="font-bold text-on-surface text-base tracking-tight">
        Vcinema
      </span>
    </Link>
  );
}
