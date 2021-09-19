import { fireEvent } from '@testing-library/react-native'

const tap = (node) => {
  fireEvent(node, 'onResponderRelease')
}

export { tap }
