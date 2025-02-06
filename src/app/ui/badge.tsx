// src/app/ui/badge.tsx
import React from "react";

export const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <span className={`inline-block ${className}`}>
      {children}
    </span>
  );
};
