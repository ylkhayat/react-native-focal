import React, { useCallback } from 'react'
import { Animated, View, ViewProps } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur } from './ref'
import {
  TapGestureHandler,
  HandlerStateChangeEvent
} from 'react-native-gesture-handler'

type Props = ViewProps & {
  children: React.ReactNode
  onPress?: () => void
}

const Container = ({ children, onPress, ...props }: Props) => {
  const onContainerPress = useCallback(
    (_: HandlerStateChangeEvent<Record<string, unknown>>) => {
      blur()
      if (isFunction(onPress)) onPress()
    },
    [onPress]
  )

  return (
    <TapGestureHandler waitFor={Object.values(handlers.current || {}) || []} onActivated={onContainerPress}>
      <Animated.View {...props}>{children}</Animated.View>
    </TapGestureHandler>
  )
}

export default Container
