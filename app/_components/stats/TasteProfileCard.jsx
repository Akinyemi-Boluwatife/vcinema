import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TasteProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <Card className="mb-4">
      <CardContent className="space-y-3 py-2">
        <p className="text-micro">Taste profile</p>
        <p
          className="font-display text-foreground"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
          }}
        >
          {profile.blurb}
        </p>
        {profile.decade && (
          <p className="text-sm text-muted-foreground">
            Based on {profile.count} rated films · avg{" "}
            <Star className="inline size-3 fill-current mb-0.5" />{" "}
            {profile.avg.toFixed(1)}/10
          </p>
        )}
      </CardContent>
    </Card>
  );
}
