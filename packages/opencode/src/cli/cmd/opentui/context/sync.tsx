import type { Provider } from "@opencode-ai/sdk"
import { createStore } from "solid-js/store"
import { useSDK } from "./sdk"
import { createContext, onMount, useContext, type ParentProps } from "solid-js"


function init() {
  const [store, setStore] = createStore<{
    provider: Provider[]
  }>({
    provider: [],
  })

  const sdk = useSDK()

  onMount(async () => {
    const events = await sdk.event.subscribe()
  })

  sdk.config.providers().then((x) => setStore("provider", x.data!.providers))

  return {
    data: store,
    set: setStore,
  }
}

type SyncContext = ReturnType<typeof init>

const ctx = createContext<SyncContext>()

export function SyncProvider(props: ParentProps) {
  const value = init()
  return <ctx.Provider value={value}>{props.children}</ctx.Provider>
}

export function useSync() {
  const value = useContext(ctx)
  if (!value) {
    throw new Error("useSync must be used within a SyncProvider")
  }
  return value
}
