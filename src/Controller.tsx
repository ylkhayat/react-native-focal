import set from 'lodash/set'
import React, { useRef, useCallback } from 'react'

import { View, ViewProps } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import focuses, { blurFocused } from './ref'

type TProps = ViewProps & {
  isFocusable?: boolean
  children: React.FunctionComponentElement<any>
}
const Controller = ({ children, isFocusable = true, ...props }: TProps) => {
  const childRef = useRef(null)
  const { current: privateUUID } = useRef(uuidv4())

  const refSetter = useCallback((node: any) => {
    childRef.current = node
    set(focuses, ['current', privateUUID], node)
  }, [])

  const onPress = useCallback(() => {
    if (isFocusable) set(focuses, ['current', 'focused'], privateUUID)
    else blurFocused()
  }, [isFocusable])

  return (
    <View {...props} onTouchStart={onPress}>
      {React.cloneElement(children, { ref: refSetter })}
    </View>
  )
}

export default Controller
