/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'

import { Route, Router } from '@solidjs/router'

import Layout from './layout'
import Game from './pages/game.tsx'
import Login from './pages/login.tsx'
import Rank from './pages/rank'

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Game} />
      <Route path="/login" component={Login} />
      <Route path="/rank" component={Rank} />
    </Router>
  ),
  document.getElementById('root')!,
)
