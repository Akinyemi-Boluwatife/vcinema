export default function TasteProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <div className="bg-surface-high rounded-xl border border-outline-variant/30 p-6 mb-4">
      <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">
        Your taste profile
      </p>
      <p className="text-primary text-2xl font-bold leading-tight">
        {profile.blurb}
      </p>
      {profile.decade && (
        <p className="text-on-surface-variant text-xs mt-2">
          Based on {profile.count} rated films · avg ★ {profile.avg.toFixed(1)}/10
        </p>
      )}
    </div>
  );
}
