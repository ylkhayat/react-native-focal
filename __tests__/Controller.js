import React, { forwardRef, useImperativeHandle } from 'react'
import { render, cleanup, waitFor } from '@testing-library/react-native'
import { TextInput, View } from 'react-native'
import Container from '../src/Container'
import Controller from '../src/Controller'
import {
  getByIndex,
  getFocused,
  getFocusedId,
  getLength,
  resetFocuses,
  resetHandlers
} from '../src/ref'
import { events } from '../src/utils'

describe('Controller testing suite | handling different use cases of the Controller behavior.', () => {
  afterEach(() => {
    cleanup()
    resetFocuses()
    resetHandlers()
  })

  describe('Rendering Related', () => {
    test('Container renders a single controller child', () => {
      const { getByTestId } = render(
        <Container>
          <Controller isFocusable={false}>
            <View testID='child' />
          </Controller>
        </Container>
      )
      expect(getByTestId('child')).toBeDefined()
    })
    test('Container renders multiple controllers', () => {
      const { getByTestId } = render(
        <Container>
          <Controller isFocusable={false}>
            <View testID='child#1' />
          </Controller>
          <Controller isFocusable={false}>
            <View testID='child#2' />
          </Controller>
        </Container>
      )

      expect(getByTestId('child#1')).toBeDefined()
      expect(getByTestId('child#2')).toBeDefined()
    })
  })

  describe('Handling Presses', () => {
    test("Controller presses does not trigger Container's", () => {
      const onContainerPress = jest.fn(() => {})
      const onControllerPress = jest.fn(() => {})

      const { getByTestId } = render(
        <Container testID='cntr#1' onPress={onContainerPress}>
          <Controller
            isFocusable={false}
            testID='ctrlr#1'
            onPress={onControllerPress}
          >
            <TextInput />
          </Controller>
        </Container>
      )
      events.tap(getByTestId('ctrlr#1'))
      expect(onControllerPress).toHaveBeenCalled()
      expect(onContainerPress).toHaveBeenCalledTimes(0)
    })

    test("Container presses does not trigger Controller's", () => {
      const onContainerPress = jest.fn(() => {})
      const onControllerPress = jest.fn(() => {})

      const { getByTestId } = render(
        <Container testID='cntr#1' onPress={onContainerPress}>
          <Controller
            isFocusable={false}
            testID='ctrlr#1'
            onPress={onControllerPress}
          >
            <View />
          </Controller>
        </Container>
      )
      events.tap(getByTestId('cntr#1'))
      expect(onContainerPress).toHaveBeenCalled()
      expect(onControllerPress).toHaveBeenCalledTimes(0)
    })

    test('Controller press followed by Container press', () => {
      const onContainerPress = jest.fn(() => {})
      const onControllerPress = jest.fn(() => {})

      const { getByTestId } = render(
        <Container testID='cntr#1' onPress={onContainerPress}>
          <Controller testID='ctrlr#1' onPress={onControllerPress}>
            <View />
          </Controller>
        </Container>
      )
      events.tap(getByTestId('ctrlr#1'))
      expect(onControllerPress).toHaveBeenCalled()
      expect(onContainerPress).toHaveBeenCalledTimes(0)

      events.tap(getByTestId('cntr#1'))
      expect(onContainerPress).toHaveBeenCalled()
    })
    test('Container press followed by Controller press', () => {
      const onContainerPress = jest.fn(() => {})
      const onControllerPress = jest.fn(() => {})

      const { getByTestId } = render(
        <Container testID='cntr#1' onPress={onContainerPress}>
          <Controller testID='ctrlr#1' onPress={onControllerPress}>
            <View />
          </Controller>
        </Container>
      )
      events.tap(getByTestId('cntr#1'))
      expect(onContainerPress).toHaveBeenCalled()
      expect(onControllerPress).toHaveBeenCalledTimes(0)

      events.tap(getByTestId('ctrlr#1'))
      expect(onControllerPress).toHaveBeenCalled()
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
  test('Each controller properly handles its unmounting functionality', async () => {
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
    await waitFor(() => unmount())

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
      events.tap(getByTestId('ctrlr'))
      expect(onFocus).toHaveBeenCalled()
      expect(getFocusedId()).not.toBeNull()
      expect(getFocused()).not.toBeNull()
      expect(getFocusedId()).toBeDefined()
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
      events.tap(getByTestId('ctrlr'))
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
    events.tap(getByTestId('ctrlr'))
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
    events.tap(getByTestId('ctrlr'))
    expect(getFocused()).toBeDefined()
    events.tap(getByTestId('ctnr'))
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
    events.tap(getByTestId('ctrlr'))
    expect(getFocused()).toBeDefined()
    events.tap(getByTestId('ctnr'))
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
    events.tap(getByTestId('ctrlr#1'))
    expect(getFocused()).toBeDefined()
    const focused1 = getFocusedId()
    events.tap(getByTestId('ctrlr#2'))
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
    events.tap(getByTestId('ctrlr#1'))
    expect(getFocused()).toBeDefined()
    const focused1 = getFocusedId()
    events.tap(getByTestId('ctrlr#2'))
    expect(getFocused()).toBeDefined()
    const focused2 = getFocusedId()
    expect(focused1).not.toEqual(focused2)
  })
})
