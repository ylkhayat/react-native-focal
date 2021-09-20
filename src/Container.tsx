import React, { useCallback } from 'react'
import { View, ViewProps, GestureResponderEvent } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur } from './ref'

type Props = ViewProps & {
  children: React.ReactNode
  onPress?: () => void
}

const Container = ({ children, onPress, ...props }: Props) => {
  const onContainerPress = useCallback(
    (_: GestureResponderEvent) => {
      if (isFunction(onPress)) onPress()
      blur()
    },
    [onPress]
  )

  return (
    <View {...props} onResponderRelease={onContainerPress}>
      {children}
    </View>
  )
}

export default Container
