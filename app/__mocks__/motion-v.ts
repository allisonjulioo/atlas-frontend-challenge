import { defineComponent, h, type Component, type VNode } from 'vue'

const cache = new Map<string, Component>()

const tagComponent = (tag: string) => {
  const cached = cache.get(tag)

  if (cached) {
    return cached
  }

  const component = defineComponent({
    name: `Motion${tag}`,
    props: ['initial', 'animate', 'exit', 'transition'],
    setup: (_props, { slots }) => () => h(tag, slots.default?.()),
  })

  cache.set(tag, component)

  return component
}

export const motion = new Proxy({} as Record<string, Component>, {
  get: (_target, key) => (typeof key === 'string' ? tagComponent(key) : undefined),
})

export const AnimatePresence = defineComponent({
  name: 'AnimatePresence',
  setup: (_props, { slots }) => () => (slots.default?.() ?? []) as VNode[],
})
