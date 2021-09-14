import React, { useCallback } from 'react'
import { View, TouchableWithoutFeedback, ViewProps } from 'react-native'
import isFunction from 'lodash.isfunction'
import { blur } from './ref'

type Props = ViewProps & {
  children: React.FunctionComponentElement<any>
  onPress?: () => void
}

const Container = ({ children, onPress, ...props }: Props) => {
  const onContainerPress = useCallback(() => {
    if (isFunction(onPress)) onPress()
    blur()
  }, [onPress])

  return (
    <TouchableWithoutFeedback onPress={onContainerPress}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

export default Container
