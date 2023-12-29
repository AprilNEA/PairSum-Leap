import clsx from 'clsx'
import {Component} from 'solid-js'

import {RouteSectionProps} from '@solidjs/router'

const Layout: Component<RouteSectionProps> = ({children}) => (
  <div
    class={clsx(
      'float-none mx-auto',
      'h-screen max-w-[48rem]',
      'flex items-center justify-center overflow-hidden',
    )}
  >
    <div
      class={clsx(
        'main h-[36rem] max-h-[36rem] w-full bg-white',
        'rounded-none border-[0.08333rem] border-slate-400',
      )}
    >
      {children}
    </div>
  </div>
)

export default Layout
