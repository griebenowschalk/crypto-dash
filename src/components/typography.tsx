import { cn } from '@/lib/utils'
import { type HTMLAttributes, type ReactNode } from 'react'

type TypographyProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  className?: string
}

// Headings
export function H1({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className, ...props }: TypographyProps) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

// Body text
export function P({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function Lead({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props}>
      {children}
    </p>
  )
}

export function Large({ children, className, ...props }: TypographyProps) {
  return (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  )
}

export function Small({ children, className, ...props }: TypographyProps) {
  return (
    <small
      className={cn('text-sm leading-none font-medium', className)}
      {...props}
    >
      {children}
    </small>
  )
}

export function Muted({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}

// Specialized text
export function Blockquote({ children, className, ...props }: TypographyProps) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export function Code({ children, className, ...props }: TypographyProps) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function Pre({ children, className, ...props }: TypographyProps) {
  return (
    <pre
      className={cn(
        'bg-muted overflow-x-auto rounded-lg p-4 [&>code]:bg-transparent',
        className
      )}
      {...props}
    >
      {children}
    </pre>
  )
}

// Lists
export function List({ children, className, ...props }: TypographyProps) {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  )
}

export function ListItem({ children, className, ...props }: TypographyProps) {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  )
}

// Inline elements
export function InlineCode({ children, className, ...props }: TypographyProps) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function Strong({ children, className, ...props }: TypographyProps) {
  return (
    <strong className={cn('font-semibold', className)} {...props}>
      {children}
    </strong>
  )
}

export function Em({ children, className, ...props }: TypographyProps) {
  return (
    <em className={cn('italic', className)} {...props}>
      {children}
    </em>
  )
}

// Utility components
export function TextBalance({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <div className={cn('text-balance', className)} {...props}>
      {children}
    </div>
  )
}

export function TextGradient({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <span
      className={cn(
        'from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
