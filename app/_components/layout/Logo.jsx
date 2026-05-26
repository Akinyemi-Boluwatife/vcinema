import Link from "next/link";

export default function Logo({ size = 22 }) {
  return (
    <Link
      href="/"
      className="no-underline flex-shrink-0 v-logo"
      style={{ fontSize: size }}
      aria-label="Vcinema home"
    >
      <span className="v">V</span>cinema
    </Link>
  );
}
