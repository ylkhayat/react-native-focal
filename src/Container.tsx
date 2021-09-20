import React, { useCallback, useMemo } from 'react'
import { View, ViewProps, GestureResponderEvent, Platform } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur } from './ref'

type Props = ViewProps & {
  children: React.ReactNode
  onPress?: () => void
}

const Container = ({ children, onPress, ...props }: Props) => {
  const onContainerPress = useCallback(
    (_: GestureResponderEvent) => {
      blur()
      if (isFunction(onPress)) onPress()
    },
    [onPress]
  )

  const responderHandler = useMemo(
    () =>
      Platform.select({
        default: { onTouchStart: onContainerPress },
        web: { onResponderRelease: onContainerPress }
      }),
    [onContainerPress]
  )
  return (
    <View {...props} {...responderHandler}>
      {children}
    </View>
  )
}

export default Container
