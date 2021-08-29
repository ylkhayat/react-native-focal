# react-native-focal 👓

[![NPM](https://img.shields.io/npm/v/form.svg)](https://www.npmjs.com/package/yousseftarekkh/react-native-focal)

Roses are red.\
Violets are blue.\
Inputs aint bluring.\
But I know what to do. 🔥

After carefully monitoring the community's struggle with non blurring `TextInput`s. This package is a simple solution for anyone seeking quick `focus`ing & `blur`ring over their components. Let's dig into the docs, shall we?

## 🍏 Motivation

React Native's `TextInput` is a wonderful component, yet it sometimes triggers several nerves to get blurred properly upon tapping outside of the component or clicking on another component. The struggle is real and is well heard. Thus, the methodology here is pretty simple and implies determining a focal component set correspondingly once a component is pressed or focused. Once the ref of that component is obtained, logic is applied to track your presses and blur the component accordingly.

## 🛫 Installation

Let's get down to business first, use your intimate npm package manager.

```bash
$ yarn add react-native-focal
```

or

```bash
$ npm install --save react-native-focal
```

## 🗞️ API

### `Container`

Component responsible to wrap your screen with a tappable View that detects when a touch is pressed outside a component.

##### Props

Same as `ViewProps`

### `Controller`

Component responsible to wrap your desired component that is subject to some action, ie: `TextInput`, `Text`, `Button`.
Once you wrap the component with this `Controller`, you can modify how this controller will interact with the focal component and shape its experience.

##### Props

| Name          | Description                                                                              | Default |
| ------------- | ---------------------------------------------------------------------------------------- | ------- |
| `isFocusable` | boolean indicating whether the wrapped component behaves as a focusable component or not | `true`  |

### Methods

#### `blurFocused`

Function responsible for getting the focused component upon execution and if any tries to `blur` it.

```ts
import { blurFocused } from 'react-native-focal'

const onPress = () => {
  blurFocused()
}
```

### Example

```tsx
import { Container, Controller, blurFocused } from 'react-native-focal'
import { TextInput, Button } from 'react-native'

const Screen = () => {
  return (
    <Container>
      {/* your screen */}
      <Controller>
        <TextInput />
      </Controller>
      {/* Button handles blur onPress internally*/}
      <Controller isFocusable={false}>
        <Button />
      </Controller>
      {/* Button handles blur onPress externally */}
      <Button onPress={blurFocused} />
    </Container>
  )
}
```

## License

MIT © [yousseftarekkh](https://github.com/yousseftarekkh)
