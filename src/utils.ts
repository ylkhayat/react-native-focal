import { fireEvent } from '@testing-library/react-native'

/**
 * Simulate a `onResponderRelease` event through `fireEvent`
 * @param node
 */
const tap = (node: any) => {
  const memoizedProps = Object.keys(node._fiber.memoizedProps)
  if (memoizedProps.includes('onTouchStart')) fireEvent(node, 'onTouchStart')
  if (memoizedProps.includes('onResponderRelease'))
    fireEvent(node, 'onResponderRelease')
  if (memoizedProps.includes('onPress')) fireEvent.press(node)
}

const events = {
  tap
}

export { events }
