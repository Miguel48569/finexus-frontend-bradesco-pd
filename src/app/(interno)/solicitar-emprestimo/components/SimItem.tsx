import { ReactElementType } from "react";

interface SimItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

export default function SimItem({ icon: Icon, label, value }: SimItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-violet-600" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
