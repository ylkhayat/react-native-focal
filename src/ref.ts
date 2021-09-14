import { createRef } from 'react'
import unset from 'lodash.unset'
import get from 'lodash.get'
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

export { blur, getFocused }
