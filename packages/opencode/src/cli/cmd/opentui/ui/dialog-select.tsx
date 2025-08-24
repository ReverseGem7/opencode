import { InputRenderable, TextAttributes } from "@opentui/core"
import { Theme } from "../context/theme"
import { onMount } from "solid-js"

export interface DialogSelectProps {
  title: string
}

export interface DialogSelectOption {
}

export function DialogSelect(props: DialogSelectProps) {
  let input: InputRenderable
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
              focusedBackgroundColor={Theme.backgroundPanel}
              cursorColor={Theme.primary}
              focusedTextColor={Theme.textMuted}
              ref={r => {
                input = r
                input.focus()
              }} placeholder="Enter search term" />
          </group>
        </group>
        <group paddingBottom={1}>
          <group paddingTop={1} paddingLeft={1} >
            <text fg={Theme.accent} attributes={TextAttributes.BOLD}>Recent</text>
          </group>
          <Option title="Sonic" description="opencode" active />
          <Option title="Qwen3 Coder" description="OpenRouter" />
          <Option title="Qwen 3 Coder 480B" description="Vercel AI Gateway" />
          <group paddingTop={1} paddingLeft={1} >
            <text fg={Theme.accent} attributes={TextAttributes.BOLD}>Anthropic</text>
          </group>
          <Option title="Claude 4 Sonnet" />
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
    <box flexDirection="row" backgroundColor={props.active ? Theme.primary : undefined} border={false} paddingLeft={1} paddingRight={1}>
      <text fg={props.active ? Theme.background : Theme.text} attributes={props.active ? TextAttributes.BOLD : undefined}>{props.title}</text>
      <text fg={props.active ? Theme.background : Theme.textMuted}> {props.description}</text>
    </box>
  )
}
