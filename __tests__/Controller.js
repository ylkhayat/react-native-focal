import React, { forwardRef, useImperativeHandle } from 'react'
import { render, cleanup } from '@testing-library/react-native'
import { View } from 'react-native'
import Container from '../src/Container'
import Controller from '../src/Controller'
import {
  getByIndex,
  getFocused,
  getFocusedId,
  getLength,
  reset
} from '../src/ref'
import { tap } from '../src/utils'

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
      tap(getByTestId('ctrlr'))
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
      tap(getByTestId('ctrlr'))
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
    const onContainerPress = jest.fn(() => {})
    const { getByTestId } = render(
      <Container onPress={onContainerPress}>
        <Controller testID='ctrlr' onFocus={onControllerFocus}>
          <CustomTextInput />
        </Controller>
      </Container>
    )
    expect(getFocused()).toBeUndefined()
    tap(getByTestId('ctrlr'))
    expect(onContainerPress).toHaveBeenCalledTimes(0)
    expect(onControllerFocus).toHaveBeenCalled()
    expect(onCustomTextInputFocus).toHaveBeenCalled()
    expect(getFocused()).toBeDefined()
  })

  test('Focused Controller gets blurred properly once clicking on the Container when onBlur returns true', () => {
    const { getByTestId } = render(
      <Container testID='ctnr'>
        <Controller testID='ctrlr'>
          <View />
        </Controller>
      </Container>
    )
    tap(getByTestId('ctrlr'))
    expect(getFocused()).toBeDefined()
    tap(getByTestId('ctnr'))
    expect(getFocused()).toBeUndefined()
  })

  test('Focused Controller does not get blurred once clicking on the Container when onBlur returns false', () => {
    const { getByTestId } = render(
      <Container testID='ctnr'>
        <Controller
          testID='ctrlr'
          onBlur={() => {
            return false
          }}
        >
          <View />
        </Controller>
      </Container>
    )
    tap(getByTestId('ctrlr'))
    expect(getFocused()).toBeDefined()
    tap(getByTestId('ctnr'))
    expect(getFocused()).toBeDefined()
  })
  test('Focused Controller gets blurred properly once clicking on another Controller when onBlur returns true', () => {
    const { getByTestId } = render(
      <Container>
        <Controller
          testID='ctrlr#1'
          onBlur={() => {
            return true
          }}
        >
          <View />
        </Controller>
        <Controller testID='ctrlr#2'>
          <View />
        </Controller>
      </Container>
    )
    tap(getByTestId('ctrlr#1'))
    expect(getFocused()).toBeDefined()
    const focused1 = getFocusedId()
    tap(getByTestId('ctrlr#2'))
    expect(getFocused()).toBeDefined()
    const focused2 = getFocusedId()
    expect(focused1).not.toEqual(focused2)
  })
  test('Focused Controller gets blurred properly once clicking on another Controller when onBlur returns false', () => {
    const { getByTestId } = render(
      <Container>
        <Controller
          testID='ctrlr#1'
          onBlur={() => {
            return false
          }}
        >
          <View />
        </Controller>
        <Controller testID='ctrlr#2'>
          <View />
        </Controller>
      </Container>
    )
    tap(getByTestId('ctrlr#1'))
    expect(getFocused()).toBeDefined()
    const focused1 = getFocusedId()
    tap(getByTestId('ctrlr#2'))
    expect(getFocused()).toBeDefined()
    const focused2 = getFocusedId()
    expect(focused1).not.toEqual(focused2)
  })
})
