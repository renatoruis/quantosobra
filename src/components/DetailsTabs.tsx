import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export type TabDef = {
  id: string
  label: string
  content: ReactNode
}

type Props = {
  tabs: TabDef[]
}

export function DetailsTabs({ tabs }: Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id)
  const baseId = useId()
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeId)
    let next = -1
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    if (next === -1) return
    event.preventDefault()
    const tab = tabs[next]
    setActiveId(tab.id)
    tabRefs.current.get(tab.id)?.focus()
  }

  return (
    <div className="details-tabs">
      <div className="tablist" role="tablist" aria-label="Detalhes da simulação" onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const active = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el)
                else tabRefs.current.delete(tab.id)
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              className={`tab${active ? ' tab-active' : ''}`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="tabpanel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
