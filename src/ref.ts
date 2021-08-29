import React from 'react'
import unset from 'lodash/unset'
import get from 'lodash/get'

/**
 * Ref containing the list of all the nodes within all the providers.
 */
const focuses = React.createRef<{ [key: string]: any; focused?: string }>()
export default focuses

/**
 * Gracefully `blur` the focused node if it can be `blur`red.
 */
const blurFocused = () => {
  const focusedComponentRef = get(focuses, ['current', 'focused'], {})
  const focusedComponent = get(focuses, ['current', focusedComponentRef])
  focusedComponent?.blur?.()
  unset(focuses, ['current', 'focused'])
}

export { blurFocused }
