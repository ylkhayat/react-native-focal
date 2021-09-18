import { render, fireEvent, cleanup } from '@testing-library/react-native'
import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'
import { TextInput, View } from 'react-native'
import Container from '../src/Container'
import Controller from '../src/Controller'
import focuses, { getByIndex, getFocused, getLength, reset } from '../src/ref'

describe('Controller testing suite | handling different use cases of the Controller behavior.', () => {
  afterEach(() => {
    cleanup()
    reset()
  })

  describe('Rendering Related', () => {
    test('Container renders a single controller child', () => {
      const { getAllByTestId } = render(
        <Container>
          <Controller isFocusable={false}>
            <View testID='child' />
          </Controller>
        </Container>
      )
      expect(getAllByTestId('child')).toBeDefined()
    })
    test('Container renders multiple controllers', () => {
      const { getAllByTestId } = render(
        <Container>
          <Controller isFocusable={false}>
            <View testID='child#1' />
          </Controller>
          <Controller isFocusable={false}>
            <View testID='child#2' />
          </Controller>
        </Container>
      )
      expect(getAllByTestId('child#1')).toBeDefined()
      expect(getAllByTestId('child#2')).toBeDefined()
    })
  })

  describe('Subscription Related', () => {
    test('Each controller has a unique id and successfully subscribes to the global ref', () => {
      render(
        <Container>
          <Controller isFocusable={false}>
            <View testID='child#1' />
          </Controller>
          <Controller isFocusable={false}>
            <View testID='child#2' />
          </Controller>
        </Container>
      )
      expect(getLength()).toBe(2)
      expect(getByIndex(0)).toHaveProperty('node')
      expect(getByIndex(0)).toHaveProperty('onBlur')
      expect(getByIndex(1)).toHaveProperty('node')
      expect(getByIndex(1)).toHaveProperty('onBlur')
    })
  })
  test('Each controller properly handles its unmounting functionality', () => {
    const { unmount } = render(
      <Container>
        <Controller isFocusable={false}>
          <View testID='child#1' />
        </Controller>
        <Controller isFocusable={false}>
          <View testID='child#2' />
        </Controller>
      </Container>
    )
    expect(getLength()).toBe(2)
    expect(getByIndex(0).node).toBeDefined()
    expect(getByIndex(1).node).toBeDefined()
    unmount()
    expect(getByIndex(0).node).toBeNull()
    expect(getByIndex(1).node).toBeNull()
  })

  test('Each controller properly handles its rerendering functionality', () => {
    const { rerender } = render(
      <Container>
        <Controller isFocusable={false}>
          <View testID='child#1' />
        </Controller>
        <Controller isFocusable={false}>
          <View testID='child#2' />
        </Controller>
      </Container>
    )
    expect(getLength()).toBe(2)
    expect(getByIndex(0).node).toBeDefined()
    expect(getByIndex(1).node).toBeDefined()
    rerender()
    expect(getByIndex(0).node).toBeDefined()
    expect(getByIndex(1).node).toBeDefined()
  })

  describe('Focus/Blur Related', () => {
    test('Focusable controllers gets updated in the ref accordingly', () => {
      const onFocus = jest.fn(() => {})

      const { getByTestId } = render(
        <Container>
          <Controller testID='ctrlr' onFocus={onFocus}>
            <View />
          </Controller>
        </Container>
      )

      expect(getFocused()).toBeUndefined()
      fireEvent.press(getByTestId('ctrlr'))
      expect(onFocus).toHaveBeenCalled()
      expect(getFocused()).toBeDefined()
    })

    test("Non-Focusable controllers doesn't get updated in the ref", () => {
      const { getByTestId } = render(
        <Container>
          <Controller isFocusable={false} testID='ctrlr'>
            <View />
          </Controller>
        </Container>
      )

      expect(getFocused()).toBeUndefined()
      fireEvent.press(getByTestId('ctrlr'))
      expect(getFocused()).toBeUndefined()
    })
  })
  const onCustomTextInputFocus = jest.fn(() => {})

  const CustomTextInput = forwardRef((_, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        focus: onCustomTextInputFocus
      }),
      []
    )
    return <View />
  })
  test('Controlled TextInput components gets focused properly', () => {
    const onControllerFocus = jest.fn(() => {})
    const textInputRef = createRef()
    const { getByTestId } = render(
      // <Container>
      <Controller testID='ctrlr' onFocus={onControllerFocus}>
        <TextInput ref={textInputRef} />
      </Controller>
      // </Container>
    )
    console.log(textInputRef?.current)
    fireEvent.press(getByTestId('ctrlr'))
    expect(onControllerFocus).toHaveBeenCalled()
    expect(onCustomTextInputFocus).toHaveBeenCalled()
    expect(getFocused()).toBeDefined()
  })
})
