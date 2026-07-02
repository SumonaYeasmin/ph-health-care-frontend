import * as Icons from "lucide-react";
import React from "react";

export const getIconComponent = (iconName: string): React.ComponentType<any> => {
  return (Icons as any)[iconName] || Icons.HelpCircle;
};
