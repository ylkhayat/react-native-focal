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
export default focuses

/**
 * Method responsible for resetting the focal object ref to an empty object.
 */
const reset = () => {
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

export { blur, reset, getByIndex, getFocused, getFocusedId, getLength }
