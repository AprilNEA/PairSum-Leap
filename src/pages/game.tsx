import clsx from 'clsx'
import Cookies from 'js-cookie'
import { createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js'

import { client } from '../lib/trpc.ts'

const styles = {
  underline: 'underline hover:underline-offset-2',
} as const

function Game() {
  const [number, setNumber] = createSignal<number>()
  const [numbers, setNumbers] = createSignal<number[]>([])
  const [sum, setSum] = createSignal(0)

  const [answer, setAnswer] = createSignal('')
  const [score, setScore] = createSignal(0)
  const isLogin = createMemo(() => localStorage.getItem('isLogin') === 'true')

  const updateNumber = () => {
    if (isLogin()) {
      client.game.answer
        .mutate({
          answer: answer(),
        })
        .then((data) => {
          setNumber(data.number)
          setScore(data.score)
          console.log(data)
        })
    } else {
      const newNumber = Math.round(Math.random() * 99)
      const newNumbers = setNumbers((prev) => {
        if (prev.length >= 4) {
          return [newNumber, ...prev.slice(0, 3)]
        }
        return [newNumber, ...prev]
      })

      if (newNumbers.length >= 4) {
        const newSum = setSum(newNumbers[1] + newNumbers[3])

        if (answer() !== '' && parseInt(answer()) === newSum) {
          setScore((prev) => prev + 1)
        } else {
          setScore(0)
        }
      }
    }

    setAnswer('')
  }
  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.code === 'Space' ||
      event.code === 'ArrowDown' ||
      event.code === 'Enter'
    ) {
      updateNumber()
    } else if (/^Digit[0-9]$/.test(event.code)) {
      if (isLogin() || numbers().length >= 3) {
        setAnswer((prev) => prev + event.key)
      }
    } else if (event.code === 'Backspace') {
      setAnswer((prev) => prev.slice(0, -1))
    }
  }

  onMount(() => {
    updateNumber()
    window.addEventListener('keydown', handleKeyDown)
  })

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div
      class={clsx('relative flex h-full flex-col justify-between px-2 py-1')}
      onClick={updateNumber}
    >
      <div
        class={clsx('absolute left-0 top-0 pl-2 pt-1', 'text-gray-500')}
        onClick={stopPropagation}
      >
        <Show
          when={isLogin()}
          fallback={
            <a href="login" class={styles.underline}>
              <p>Login</p>
            </a>
          }
        >
          <a>
            <p class={styles.underline}>{localStorage.getItem('username')}</p>
          </a>
        </Show>

        <select
          class={clsx(
            'appearance-none border-none outline-none',
            styles.underline,
          )}
        >
          <option>Medium</option>
          <option>Easy</option>
          <option>Hard</option>
        </select>
      </div>
      <div
        class={clsx('absolute right-0 top-0 pr-2 pt-1', 'text-gray-500')}
        onClick={stopPropagation}
      >
        <div>
          <a href="rank">
            <p class={styles.underline}>Rank</p>
          </a>
          <a href="history">
            <p class={styles.underline}>History</p>
          </a>
        </div>
      </div>
      <div></div>
      <div class="mt-0 select-none text-center text-9xl">
        {isLogin() ? number() : numbers()[0]}
      </div>
      <div
        class={clsx(
          'flex flex-row items-center justify-between',
          'text-md text-gray-500',
        )}
        onClick={stopPropagation}
      >
        <div>Score: {score()}</div>
        <div>{answer()}</div>
        <div>LA: {!!sum() && sum()}</div>
      </div>
    </div>
  )
}

export default Game
