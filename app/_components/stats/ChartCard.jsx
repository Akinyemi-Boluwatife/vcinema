import { Card, CardContent } from "@/components/ui/card";

export default function ChartCard({ title, subtitle, children }) {
  return (
    <Card className="mb-4">
      <CardContent>
        <div className="mb-4">
          <p className="text-base font-medium text-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-full h-64">{children}</div>
      </CardContent>
    </Card>
  );
}
