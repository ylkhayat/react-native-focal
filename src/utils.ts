import { fireEvent } from '@testing-library/react-native'

/**
 * Simulate a `onResponderRelease` event through `fireEvent`
 * @param node
 */
const tap = (node: any) => {
  const memoizedProps = Object.keys(node._fiber.memoizedProps)
  if (memoizedProps.includes('onPress')) fireEvent.press(node)
  else fireEvent(node, 'onActivated')
}

const events = {
  tap
}

export { events }
