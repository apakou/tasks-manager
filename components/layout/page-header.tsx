import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between space-y-2", className)}>
      {children}
    </div>
  );
}

interface PageHeaderHeadingProps {
  children: ReactNode;
  className?: string;
}

export function PageHeaderHeading({ children, className }: PageHeaderHeadingProps) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight", className)}>
      {children}
    </h1>
  );
}

interface PageHeaderDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function PageHeaderDescription({ children, className }: PageHeaderDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground", className)}>
      {children}
    </p>
  );
}

interface PageHeaderActionsProps {
  children: ReactNode;
  className?: string;
}

export function PageHeaderActions({ children, className }: PageHeaderActionsProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {children}
    </div>
  );
}