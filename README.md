# react-native-focal 👓

[![NPM](https://img.shields.io/npm/v/react-native-focal.svg)](https://www.npmjs.com/package/react-native-focal)

_Roses are red._\
_Violets are blue._\
_Inputs aint blurring._\
_But I know what to do._

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

| Name      | Description                                                               | Default     |
| --------- | ------------------------------------------------------------------------- | ----------- |
| `onPress` | extra function to be executed upon clicking anywhere inside the container | `undefined` |

### `Controller`

Component responsible to wrap your desired component that is subject to some action, ie: `TextInput`, `Text`, `Button`.
Once you wrap the component with this `Controller`, you can modify how this controller will interact with the focal component and shape its experience.

##### Props

| Name          | Description                                                                                                                                                                                                                                                                                                                                                         | Default                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `isFocusable` | boolean indicating whether the wrapped component behaves as a focusable component or not                                                                                                                                                                                                                                                                            | `true`                                     |
| `onBlur`      | function responsible to shape the component blurring experience through a passed method expecting as input the node (component ref) itself to properly handle the blurring effect. Also expecting as a return a boolean to whether remove the component from the focus or not. `true` to remove the component, `false` to keep the component **logically** focused. | (node) => { node?.blur?.(); return true; } |

#### ⚔️ Samurai Tip

This is a generic component! Yes! sir! it! is!\
Let me elaborate... The `Controller` allows you to provide a generic type of the component you're controlling, and this is mainly to offer better suggestions when using `onBlur` if your component is strictly typed. You can easily use this feature as follows.

```tsx
<Controller<TextInput>
  onBlur={(node) => {
    node.😍();
    node.🥰();
  }}
>
  <TextInput />
</Controller>
```

### Methods

#### `blur`

Function responsible for getting the focused component upon execution and if any tries to `blur` it. Keep in mind it's not necessarily blur the component if the Controller's `onBlur` is set to something different. Calling this method will execute whatever `onBlur` holds for the controlled component.

```ts
import { blur } from 'react-native-focal'

const onPress = () => {
  blur()
}
```

#### `getFocused`

Function responsible for getting the focused component. Returned object has a `node` for the actual ref and `onBlur` which is the string passed through `onBlur`

```ts
import { getFocused } from 'react-native-focal'

const { node, onBlur } = getFocused()
```

### Example

```tsx
import { Container, Controller, blur } from 'react-native-focal'
import { TextInput, Button } from 'react-native'

const Screen = () => (
  <Container>
    {/* TextInput handled by the default `onBlur` */}
    <Controller>
      <TextInput />
    </Controller>

    {/* TextInput handled by the passed `onBlur` with a signal to not remove the node from the focus */}
    <Controller
      onBlur={(node) => {
        node.clear()
        return false
      }}
    >
      <TextInput />
    </Controller>

    {/* Button handles blur onPress internally*/}
    <Controller isFocusable={false}>
      <Button />
    </Controller>

    {/* Button handles blur onPress externally */}
    <Button onPress={blur} />
  </Container>
)
```

## 🌟 Encouragement

Kindly stargaze ⭐ this repository if it helped you achieve anything good!

## 👏 Contribute

This package is free of charge for the only purpose to help the community with the related concerns. Thus, any helping hand is more than welcome to evolve the package if it is proven to be worth evolving.

Check [CONTRIBUTING.md](CONTRIBUTING.md) for some contribution guidelines.

## License

MIT © [yousseftarekkh](https://github.com/yousseftarekkh)
