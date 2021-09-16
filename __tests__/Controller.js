import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Pressable, View } from 'react-native'
import Container from '../src/Container'
import Controller from '../src/Controller'

describe('Controller testing suite | handling different use cases of the Controller behavior.', () => {
    test('Controller clones a single child', () => {
        const { getAllByTestId } = render(
          <Container>
            <Controller isFocusable={false}>
                <View testID='child' />
            </Controller>
          </Container>
        )
        expect(getAllByTestId('child')).toBeDefined()
    })
})
