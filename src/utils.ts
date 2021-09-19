import { fireEvent } from '@testing-library/react-native'

const tap = (node: any) => {
  fireEvent(node, 'onResponderRelease')
}

export { tap }
