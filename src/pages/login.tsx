import clsx from 'clsx'
import { createMemo, createSignal, onMount, Show } from 'solid-js'

import { useNavigate, useSearchParams } from '@solidjs/router'

import { client, isTRPCClientError } from '../lib/trpc.ts'

const styles = {
  box: 'rounded-none border-[0.08333rem] border-black outline-none',
} as const

function Login() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isNew = createMemo(() =>
    searchParams.new ? searchParams.new === 'true' : false,
  )
  const navigate = useNavigate()

  /* User Input */
  const [username, setUsername] = createSignal('')
  const [password, setPassword] = createSignal('')

  /* Component State */
  const [error, setError] = createSignal('')

  const onSubmit = () => {
    client.user.login
      .mutate({
        username: username(),
        password: password(),
        isNew: isNew(),
      })
      .then(({ username }) => {
        localStorage.setItem('isLogin', 'true')
        localStorage.setItem('username', username)
        navigate('/')
      })
      .catch((e) => {
        if (isTRPCClientError(e)) {
          setError(e.message)
        }
      })

    setUsername('')
    setPassword('')
  }

  const onContinue = () => {
    setUsername('')
    setPassword('')
    setError('')
  }

  onMount(() => {
    if (localStorage.getItem('login') === 'true') {
      navigate('/')
    }
  })
  return (
    <div class="relative flex h-full flex-col items-center justify-center">
      <div
        class={clsx(
          'flex w-[24srem] flex-col items-center justify-center gap-3 p-6',
          'rounded-none border-[0.08333rem] border-black shadow-[2px_2px_#bbb]',
        )}
      >
        <p class="w-full text-center text-xl underline">
          <Show when={!isNew()} fallback="Register">
            Login
          </Show>
        </p>

        <Show
          when={!error()}
          fallback={
            <>
              <div class="w-3/4 text-sm">
                <p>{error()}</p>
              </div>
              <button
                class={clsx('px-auto px-2 hover:bg-slate-300', styles.box)}
                onClick={onContinue}
              >
                Continue
              </button>
            </>
          }
        >
          <div class="flex w-3/4 flex-row gap-1 text-sm">
            <div class="w-2/5">
              <p>Username:</p>
            </div>
            <div class="w-3/5">
              <input
                value={username()}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
                class={clsx('w-full px-0.5', styles.box)}
              />
            </div>
          </div>

          <div class="flex w-3/4 flex-row gap-1 text-sm">
            <div class="w-2/5">
              <p>Password:</p>
            </div>
            <div class="w-3/5">
              <input
                type="password"
                value={password()}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                class={clsx('w-full px-0.5', styles.box)}
              />
            </div>
          </div>
          <button
            class={clsx('px-auto px-2 hover:bg-slate-300', styles.box)}
            onClick={onSubmit}
          >
            Submit
          </button>
        </Show>
        <div
          class={clsx(
            'absolute bottom-0 right-0 pb-1 pr-2',
            'text-gray-500 underline hover:underline-offset-2',
          )}
          onClick={() => {
            if (isNew()) {
              setSearchParams({ new: undefined })
            } else {
              setSearchParams({ new: true })
            }
          }}
        >
          <p>Register</p>
        </div>
      </div>
    </div>
  )
}

export default Login
