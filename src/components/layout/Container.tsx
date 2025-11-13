import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn('container mx-auto p-4', className)}>{children}</div>
  );
};
