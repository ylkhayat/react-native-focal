import React, { useRef, useCallback } from 'react'

import { View, ViewProps } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import set from 'lodash/set'
import focuses, { blur } from './ref'

type TControllerProps<C> = {
  /**
   * Prop responsible to categorize the controlled component as a focusable one or not. Focusable component as `TextInput`, non focusable component as `Button`.
   */
  isFocusable?: boolean
  /**
   * Prop responsible for a customized handling of the `onBlur` action, expects a `boolean` as a return. `true` to remove the focus, `false` to keep in focus.
   */
  onBlur?: (node: C) => boolean
}

type TProps<C> = ViewProps &
  TControllerProps<C> & {
    children: any
  }

const DEFAULT_BLUR_METHOD = (node: any) => {
  node?.blur?.()
  return true
}

function Controller<C>({
  children,
  isFocusable = true,
  onBlur = DEFAULT_BLUR_METHOD,
  ...props
}: TProps<C>) {
  const childRef = useRef<typeof children>(null)
  const { current: privateUUID } = useRef(uuidv4())

  const refSetter = useCallback(
    (node: any) => {
      set(childRef, 'current', node)
      set(focuses, ['current', privateUUID], {
        node,
        onBlur
      })
    },
    [onBlur]
  )

  const onPress = useCallback(() => {
    if (isFocusable) set(focuses, ['current', 'focused'], privateUUID)
    else blur()
  }, [isFocusable])

  return (
    <View {...props} onTouchStart={onPress}>
      {React.cloneElement(children as any, { ref: refSetter })}
    </View>
  )
}

export default Controller
