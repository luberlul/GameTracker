import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function ChartCard({ title, icon: Icon, children }: ChartCardProps) {
  return (
    <Card glass>
      <div className="flex items-center gap-2 mb-6">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </Card>
  );
}
