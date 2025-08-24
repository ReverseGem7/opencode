import { InputRenderable, TextAttributes } from "@opentui/core"
import { Theme } from "../context/theme"
import { entries, filter, flatMap, groupBy, mapValues, pipe, sortBy, take, values } from "remeda"
import { createEffect, createMemo, For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useKeyHandler } from "@opentui/solid"
import * as fuzzysort from "fuzzysort"

export interface DialogSelectProps {
  title: string
  options: DialogSelectOption[]
}

export interface DialogSelectOption {
  key: string
  title: string
  description?: string
  category?: string
}

export function DialogSelect(props: DialogSelectProps) {
  const [store, setStore] = createStore({
    selected: undefined as string | undefined,
    filter: ""
  })

  let input: InputRenderable


  const grouped = createMemo(() => {
    const needle = store.filter.toLowerCase()
    return pipe(
      props.options,
      (x) => !needle ? x : fuzzysort.go(needle, x, { keys: ["title", "description", "category"] }).map((x) => x.obj),
      sortBy((x) => x.category ?? ""),
      take(10),
      groupBy((x) => x.category ?? ""),
      mapValues((x) => x.sort((a, b) => a.title.localeCompare(b.title))),
      entries(),
      sortBy(([key]) => key === "Recent" ? 0 : key)
    )
  })

  const flat = createMemo(() => {
    return pipe(
      grouped(),
      flatMap(([_, options]) => options),
    )
  })

  createEffect(() => {
    const match = flat().find((x) => x.key === store.selected)
    if (match) return
    setStore("selected", flat()[0]?.key)
  })

  function move(direction: -1 | 1) {
    const next = flat().findIndex((x) => x.key === store.selected) + direction
    if (next < 0 || next >= flat().length) return
    setStore("selected", flat()[next].key)
  }


  useKeyHandler((evt) => {
    if (evt.name === "up") move(-1)
    if (evt.name === "down") move(1)
  })


  return (
    <group>
      <group paddingLeft={2} paddingRight={2}>
        <group paddingLeft={1} paddingRight={1}>
          <group flexDirection="row" justifyContent="space-between">
            <text attributes={TextAttributes.BOLD}>{props.title}</text>
            <text fg={Theme.textMuted}>esc</text>
          </group>
          <group paddingTop={1} paddingBottom={1}>
            <input
              onInput={(e) => setStore("filter", e)}
              focusedBackgroundColor={Theme.backgroundPanel}
              cursorColor={Theme.primary}
              focusedTextColor={Theme.textMuted}
              ref={r => {
                input = r
                input.focus()
              }} placeholder="Enter search term" />
          </group>
        </group>
        <group paddingBottom={1} >
          <For each={grouped()}>
            {([category, options]) =>
              <group paddingTop={1} flexShrink={0}  >
                <Show when={category}>
                  <group paddingLeft={1} >
                    <text fg={Theme.accent} attributes={TextAttributes.BOLD}>{category}</text>
                  </group>
                </Show>
                <For each={options}>
                  {(option) =>
                    <Option title={option.title} description={option.description} active={option.key === store.selected} />
                  }
                </For>
              </group>
            }
          </For>
        </group>
      </group>
      <box border={false} paddingRight={2} paddingLeft={3} paddingBottom={1} paddingTop={1} flexDirection="row"  >
        <text fg={Theme.text} attributes={TextAttributes.BOLD}>n</text>
        <text fg={Theme.textMuted}> new</text>
        <text fg={Theme.text} attributes={TextAttributes.BOLD}>{"   "}r</text>
        <text fg={Theme.textMuted}> rename</text>
      </box>
    </group>
  )
}

function Option(props: { title: string, description?: string, active?: boolean }) {
  return (
    <box flexDirection="row" backgroundColor={props.active ? Theme.primary : Theme.backgroundPanel} border={false} paddingLeft={1} paddingRight={1}>
      <text fg={props.active ? Theme.background : Theme.text} attributes={props.active ? TextAttributes.BOLD : undefined}>{props.title}</text>
      <text fg={props.active ? Theme.background : Theme.textMuted}> {props.description}</text>
    </box>
  )
}
