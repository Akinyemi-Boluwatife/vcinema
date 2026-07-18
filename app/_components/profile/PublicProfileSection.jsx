export default function PublicProfileSection({ title, subtitle, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
