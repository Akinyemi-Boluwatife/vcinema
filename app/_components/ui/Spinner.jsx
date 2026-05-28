const sizes = {
  sm: "size-4 border-2",
  md: "size-7 border-[2.5px]",
  lg: "size-10 border-[3px]",
};

export default function Spinner({ size = "md" }) {
  return (
    <output
      aria-label="Loading"
      className={`${sizes[size]} border-border border-t-primary rounded-full animate-spin`}
    />
  );
}
