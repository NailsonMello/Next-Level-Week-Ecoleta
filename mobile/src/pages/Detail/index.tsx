import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView,
    Linking
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import * as MailComposer from "expo-mail-composer";
import Loading from '../../components/Loading'

import styles from './styles';

interface Params {
    id: number
}

interface Data {
    point: {
        image: string
        image_url: string
        name: string
        email: string
        whatsapp: string
        city: string
        uf: string
    }
    items: {
        title: string
    }[]
}
const Detail = () => {
    const navigation = useNavigation()
    const route = useRoute()

    const [data, setData] = useState<Data>({} as Data)

    const { id } = route.params as Params

    useEffect(() => {
        api.get(`/points/${id}`)
            .then(res => {
                setData(res.data)

            })
    }, [])

    const handleWhatsApp = () => {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre a coleta de resíduos.`)
    }

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.point.email]
        })
    }

    if (!data.point) return <Loading />
        
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" color="#34cb79" size={20} />
                </TouchableOpacity>
                <Image
                    style={styles.pointImage}
                    source={{ uri: data.point.image_url }}
                />
                <Text style={styles.pointName}>
                    {data.point.name}
                </Text>
                <Text style={styles.pointItems}>
                    {data.items.map(item => item.title).join(', ')}
                </Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>
                        Endereço
                </Text>
                    <Text style={styles.addressContent}>
                        {`${data.point.city}, ${data.point.uf}`}
                    </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton
                    style={styles.button}
                    onPress={handleWhatsApp}
                >
                    <FontAwesome name="whatsapp" color="#fff" size={20} />
                    <Text style={styles.buttonText}>
                        WhatsApp
                    </Text>
                </RectButton>

                <RectButton
                    style={styles.button}
                    onPress={handleComposeMail}
                >
                    <Icon name="mail" color="#fff" size={20} />
                    <Text style={styles.buttonText}>
                        E-mail
                    </Text>
                </RectButton>
            </View>
        </ SafeAreaView>
    )
}

export default Detail;