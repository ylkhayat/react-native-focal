import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Pressable, View } from 'react-native'
import Container from '../src/Container'
import { events } from '../src/utils'

describe("Container testing suite | handling different use cases of the Container's behavior.", () => {
  test('Container renders a single child', () => {
    const { getAllByTestId } = render(
      <Container>
        <View testID='child' />
      </Container>
    )
    expect(getAllByTestId('child')).toBeDefined()
  })

  test('Container renders multiple children', () => {
    const { getAllByTestId } = render(
      <Container>
        <View testID='child#1' />
        <View testID='child#2' />
      </Container>
    )

    expect(getAllByTestId('child#1')).toBeDefined()
    expect(getAllByTestId('child#2')).toBeDefined()
  })

  test('Container calls `onPress`', () => {
    const onPress = jest.fn(() => {})

    const { getByTestId } = render(
      <Container testID='container' onPress={onPress}>
        <View />
      </Container>
    )
    events.tap(getByTestId('container'))
    expect(onPress).toHaveBeenCalled()
  })

  test('Container does not call `onPress` if child was pressed', () => {
    const onPressContainer = jest.fn(() => {})
    const onPressPressable = jest.fn(() => {})

    const { getByTestId } = render(
      <Container testID='container' onPress={onPressContainer}>
        <Pressable testID='pressable' onPress={onPressPressable} />
      </Container>
    )

    fireEvent.press(getByTestId('pressable'))
    expect(onPressContainer).toHaveBeenCalledTimes(0)
    expect(onPressPressable).toHaveBeenCalled()
  })
})
