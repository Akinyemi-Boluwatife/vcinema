export default function SearchEmptyState({ icon, title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="text-muted-foreground mb-4" aria-hidden>
                {icon}
            </div>
            <p className="text-base font-medium text-foreground mb-1">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
    );
}