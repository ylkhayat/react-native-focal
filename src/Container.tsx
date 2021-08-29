import React from 'react'
import { View, ViewProps } from 'react-native'
import { blurFocused } from './ref'

type Props = ViewProps & { children: React.FunctionComponentElement<any> }

const Container = ({ children, ...props }: Props) => (
  <View {...props} onTouchStart={blurFocused}>
    {children}
  </View>
)

export default Container
