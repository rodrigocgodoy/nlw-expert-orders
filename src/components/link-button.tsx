import { Link, LinkProps } from 'expo-router'
import { ReactNode } from 'react'

type LinkButton = LinkProps<string> & {
  children: ReactNode
}

export function LinkButton({ children, ...rest }: LinkButton) {
  return (
    <Link className="text-slate-300 text-center text-base font-body" {...rest}>
      {children}
    </Link>
  )
}