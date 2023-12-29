import { nanoid } from 'nanoid'
import { createSignal, onCleanup, onMount } from 'solid-js'

import { client } from '../lib/trpc.ts'

function Rank() {
  /* User Input */
  const [answer, setAnswer] = createSignal('')

  /* Server Response*/
  const [number, setNumber] = createSignal<number>()
  const [score, setScore] = createSignal(0)

  const updateNumber = () => {
    client.game.answer
      .mutate({
        answer: answer(),
      })
      .then((data) => {
        setNumber(data.number)
        setScore(data.score)
        console.log(data)
      })

    setAnswer('')
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.code === 'Space' ||
      event.code === 'ArrowDown' ||
      event.code === 'Enter'
    ) {
      updateNumber()
    } else if (/^Digit[0-9]$/.test(event.code)) {
      setAnswer((prev) => prev + event.key)
    } else if (event.code === 'Backspace') {
      setAnswer((prev) => prev.slice(0, -1))
    }
  }

  onMount(() => {
    if (!localStorage.getItem('id')) {
      localStorage.setItem('id', nanoid())
    }
    updateNumber()
    window.addEventListener('keydown', handleKeyDown)
  })

  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div class="flex h-screen flex-col justify-between" onClick={updateNumber}>
      <div class="mt-0 text-center text-9xl">{number()}</div>
      <div class="mt-0 text-center text-5xl">{answer()}</div>
      <div class="mb-0 ml-0 text-left text-xl">{score()}</div>
    </div>
  )
}

export default Rank
