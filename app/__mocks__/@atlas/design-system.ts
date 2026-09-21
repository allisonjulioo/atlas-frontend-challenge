import { defineComponent, h, type VNode } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

const stub = (name: string, tag: string, props: string[] = []) => defineComponent({
  name,
  props,

  setup: (_props, { slots }) => () => h(
    tag,
    Object.values(slots).reduce<VNode[]>((nodes, slot) => [...nodes, ...(slot?.() ?? [])], []),
  ),
})

export const AtlasAvatar = stub('AtlasAvatar', 'span', ['src', 'name', 'size'])

export const AtlasBackToTop = stub('AtlasBackToTop', 'button')

export const AtlasBadge = stub('AtlasBadge', 'span', ['tone'])

export const AtlasButton = stub('AtlasButton', 'button', ['variant', 'size', 'block'])

export const AtlasCarousel = stub('AtlasCarousel', 'ul', ['label'])

export const AtlasChip = stub('AtlasChip', 'button', ['removable', 'active'])

export const AtlasDropdown = stub('AtlasDropdown', 'div', ['id', 'label', 'placeholder', 'options', 'modelValue'])

export const AtlasEmptyState = stub('AtlasEmptyState', 'div', ['title', 'description'])

export const AtlasPriceTag = stub('AtlasPriceTag', 'span', ['value', 'size'])

export const AtlasProfessionalGrid = stub('AtlasProfessionalGrid', 'div', [
  'items',
  'favorites',
  'basePath',
  'pending',
  'priorityCount',
  'skeletonCount',
])

export const AtlasRating = stub('AtlasRating', 'span', ['value', 'count', 'variant'])

export const AtlasSearchField = stub('AtlasSearchField', 'div', ['id', 'label', 'placeholder', 'maxlength', 'modelValue'])

export const AtlasSlider = stub('AtlasSlider', 'div', ['id', 'label', 'value', 'min', 'max', 'step', 'hint'])
