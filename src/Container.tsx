import React, { useCallback } from 'react'
import { View, ViewProps } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur, getHandlers } from './ref'
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
    <TapGestureHandler waitFor={getHandlers()} onActivated={onContainerPress}>
      <View {...props}>{children}</View>
    </TapGestureHandler>
  )
}

export default Container
