import { createRef } from 'react'
import unset from 'lodash.unset'
import get from 'lodash.get'
import set from 'lodash.set'
import isFunction from 'lodash.isfunction'

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

/**
 * Method responsible for resetting the focal object ref to an empty object.
 */
const resetFocuses = () => {
  set(focuses, ['current'], {})
}

/**
 * Gracefully `blur` the focused node via the `onBlur` method specified in the `Controller` props if it can be `blur`red.
 * @param force {boolean} flag to indicate whether to force removing the focused component logically or not.
 */
const blur = (force?: boolean) => {
  const focusedComponent = getFocused()
  if (!focusedComponent) return
  const { node, onBlur } = focusedComponent
  let removeFocus = true
  if (isFunction(onBlur)) removeFocus = onBlur(node)
  if (force || removeFocus) unset(focuses, ['current', 'focused'])
}

/**
 * Method responsible for retrieving the focused component value within the ref.
 */
const getFocused = (): TComponent => {
  const focusedComponentRef = get(focuses, ['current', 'focused'], '')
  return get(focuses, ['current', focusedComponentRef])
}

/**
 * Method responsible for retrieving the focused component id within the ref.
 */
const getFocusedId = (): string | null => {
  return get(focuses, ['current', 'focused'], null)
}

/**
 * Method responsible for retrieving the number of actual nodes in the focal object.
 */
const getLength = () => {
  return Object.keys((focuses.current as any) || {}).length
}

/**
 * Method responsible for retrieving a certain node within the focal object via index if valid.
 */
const getByIndex = (index: number) => {
  if (index >= getLength()) return null
  return Object.values((focuses.current as any) || {})[index]
}

/**
 * Ref containing the list of all the nodes within all the providers.
 */
const handlers = createRef<{ [key in string]: React.Ref<unknown> }>()

/**
 * Method responsible for subscribing the handler within the handlers ref object.
 */
const subscribeHandler = (id: string, ref: any) => {
  set(handlers, ['current', id], ref)
}

/**
 * Method responsible for unsubscribing the handler from the handlers ref object.
 */
const unsubscribeHandler = (id: string) => {
  unset(handlers, ['current', id])
}

/**
 * Method responsible for resetting the focal object ref to an empty object.
 */
const resetHandlers = () => {
  set(handlers, 'current', {})
}

/**
 * Method responsible for retrieving the handlers list.
 */
const getHandlers = () => {
  return Object.values(handlers.current || {}) || []
}

export {
  focuses,
  blur,
  resetFocuses,
  getByIndex,
  getFocused,
  getFocusedId,
  getLength,
  handlers,
  subscribeHandler,
  unsubscribeHandler,
  resetHandlers,
  getHandlers
}
