import { cmd } from "../cmd"
import { render, useKeyHandler, useRenderer, useTerminalDimensions } from "@opentui/solid"
import { TextAttributes } from "@opentui/core"
import { RouteProvider, useRoute } from "./context/route"
import { Home } from "./home"
import { Switch, Match } from "solid-js"
import { Theme } from "./context/theme"
import { Installation } from "../../../installation"
import { Global } from "../../../global"
import { DialogProvider, useDialog } from "./ui/dialog"
import { DialogSelect } from "./ui/dialog-select"
import { entries, flatMap, map, pipe } from "remeda"
import { bootstrap } from "../../bootstrap"
import { SDKProvider } from "./context/sdk"
import { SyncProvider, useSync } from "./context/sync"

export const OpentuiCommand = cmd({
  command: "opentui",
  describe: "print hello",
  handler: async () => {
    await bootstrap({ cwd: process.cwd() }, async () => {
      await render(() => (
        <RouteProvider>
          <DialogProvider>
            <SDKProvider>
              <SyncProvider>
                <App />
              </SyncProvider>
            </SDKProvider>
          </DialogProvider>
        </RouteProvider>
      ), {
        targetFps: 60,
        gatherStats: false,
      })
    })
  },
})

function App() {
  const route = useRoute()
  const dimensions = useTerminalDimensions()
  const renderer = useRenderer()
  const dialog = useDialog()
  const sync = useSync()

  useKeyHandler(async (evt) => {
    if (evt.meta && evt.name === "d") {
      renderer.console.toggle()
      return
    }
    if (evt.meta && evt.name === "m") {
      const options = pipe(
        sync.data.provider,
        flatMap((provider) => pipe(
          provider.models,
          entries(),
          map(([model, info]) => ({
            key: `${provider.id}/${model}`,
            title: info.name ?? model,
            description: provider.name,
            category: provider.name,
          })),
        )),
      )
      dialog.replace(<DialogSelect title="Select model" options={options} />)
      return
    }
  })

  return (
    <box border={false} width={dimensions().width} height={dimensions().height} backgroundColor={Theme.background}>
      <group flexDirection="column" flexGrow={1}>
        <Switch>
          <Match when={route.route.type === "home"}>
            <Home />
          </Match>
        </Switch>
      </group>
      <box border={false} height={1} backgroundColor={Theme.backgroundPanel} flexDirection="row" justifyContent="space-between">
        <group flexDirection="row">
          <box border={false} flexDirection="row" backgroundColor={Theme.backgroundElement} paddingLeft={1} paddingRight={1}>
            <text fg={Theme.textMuted}>open</text>
            <text attributes={TextAttributes.BOLD}>code{" "}</text>
            <text fg={Theme.textMuted}>v{Installation.VERSION}</text>
          </box>
          <group paddingLeft={1} paddingRight={1}>
            <text fg={Theme.textMuted}>{process.cwd().replace(Global.Path.home, "~")}</text>
          </group>
        </group>
        <group flexDirection="row">
          <text paddingRight={1} fg={Theme.textMuted}>tab</text>
          <text fg={Theme.secondary}>┃</text>
          <box border={false} backgroundColor={Theme.secondary} paddingLeft={1} paddingRight={1} flexDirection="row" >
            <text fg={Theme.background} attributes={TextAttributes.BOLD}>BUILD </text>
            <text fg={Theme.background}>AGENT</text>
          </box>
        </group>
      </box>
    </box>
  )
}
