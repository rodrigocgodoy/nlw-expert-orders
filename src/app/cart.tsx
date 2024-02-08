import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Alert, Linking, ScrollView, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import colors from 'tailwindcss/colors'
import { useState } from 'react'

import { formatCurrency } from '@/utils/functions/format-currency'
import { ProductCartProps, useCartStore } from '@/stores/cart-store'

import { LinkButton } from '@/components/link-button'
import { Product } from '@/components/product'
import { Button } from '@/components/button'
import { Header } from '@/components/header'
import { Input } from '@/components/input'

export default function Cart() {
  const navigation = useNavigation()
  const cartStore = useCartStore()
  const [address, setAddress] = useState('')

  const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`, [
      {
        text: 'Cancelar',
      },
      {
        text: 'Remover',
        onPress: () => cartStore.remove(product.id)
      }
    ])
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert('Pedido', 'Informe os dados da entrega.')
    }

    const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join('')

    const message = `
      \n 🍔 NOVO PEDIDO
      \n Entregar em: ${address}
      
      ${products}

      \n Total: ${total}
    `

    Linking.openURL(`https://api.whatsapp.com/send?phone=${11941073078}&text=${message}`)

    cartStore.clear()
    navigation.goBack()
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product data={product} key={product.id} onPress={() => handleProductRemove(product)} />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">
                Total:
              </Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              multiline
              textAlignVertical="top"
              placeholderTextColor={colors.slate[400]}
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
              className="h-32 bg-slate-800 rounded-md px-4 py-3 font-body text-sm text-white"
              onChangeText={setAddress}
              blurOnSubmit={true}
              returnKeyType="done"
              onSubmitEditing={handleOrder}
            />
          </View>
        </ScrollView>

        <View className="p-5 gap-5">
          <Button onPress={handleOrder}>
            <Button.Text>
              Enviar pedido
            </Button.Text>
            <Button.Icon>
              <Feather name="arrow-right-circle" size={20} />
            </Button.Icon>
          </Button>
          <LinkButton href="/">Voltar ao cardápio</LinkButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}