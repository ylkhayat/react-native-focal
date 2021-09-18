import { createRef } from 'react'
import unset from 'lodash.unset'
import get from 'lodash.get'
import set from 'lodash.set'
import isFunction from 'lodash.isfunction'
import uniqueId from 'lodash.uniqueid'

type TComponent = {
  node: any
  onBlur: (node: any) => boolean
}
/**
 * Ref containing the list of all the nodes within all the providers.
 */
const focuses = createRef<
  {
    [key: string]: TComponent
  } & {
    focused?: string
  }
>()
export default focuses

type TSubscribePayload = {
  ref: React.MutableRefObject<any>
  onBlur: any
}
/**
 * Function responsible for subscribing a component to the focuses.
 */
const subscribe = ({ ref, onBlur }: TSubscribePayload) => {
  const id = uniqueId()
  return {
    subscriber: (node: any) => {
      set(ref, 'current', node)
      set(focuses, ['current', id], {
        node,
        onBlur
      })
    },
    id
  }
}

const reset = () => {
  set(focuses, ['current'], {})
}

/**
 * Gracefully `blur` the focused node via the `onBlur` method specified in the `Controller` props if it can be `blur`red.
 */
const blur = () => {
  const focusedComponent = getFocused()
  if (!focusedComponent) return
  const { node, onBlur } = focusedComponent
  let removeFocus = true
  if (isFunction(onBlur)) removeFocus = onBlur(node)
  if (removeFocus) unset(focuses, ['current', 'focused'])
}

/**
 * Method responsible for retrieving the focused component value within the ref.
 */
const getFocused = (): TComponent => {
  const focusedComponentRef = get(focuses, ['current', 'focused'], {})
  return get(focuses, ['current', focusedComponentRef])
}

const getLength = () => {
  return Object.keys((focuses.current as any) || {}).length
}

const getByIndex = (index: number) => {
  if (index >= getLength()) return null
  return Object.values((focuses.current as any) || {})[index]
}

export { blur, reset, subscribe, getByIndex, getFocused, getLength }
