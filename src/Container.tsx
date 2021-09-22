import React, { useCallback } from 'react'
import { View, ViewProps } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur } from './ref'
import {
  TapGestureHandler,
  HandlerStateChangeEvent
} from 'react-native-gesture-handler'
import { HandlerContext, useHandlers } from 'context'

type Props = ViewProps & {
  children: React.ReactNode
  onPress?: () => void
}

const Container = ({ children, onPress, ...props }: Props) => {
  const handlersUtils = useHandlers()
  const { refs } = handlersUtils
  const onContainerPress = useCallback(
    (_: HandlerStateChangeEvent<Record<string, unknown>>) => {
      blur()
      if (isFunction(onPress)) onPress()
    },
    [onPress]
  )

  return (
    <HandlerContext.Provider value={handlersUtils}>
      <TapGestureHandler waitFor={refs} onActivated={onContainerPress}>
        <View {...props}>{children}</View>
      </TapGestureHandler>
    </HandlerContext.Provider>
  )
}

export default Container
