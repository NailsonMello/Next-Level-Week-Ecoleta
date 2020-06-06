import React, { useState, useEffect, ChangeEvent } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import apiIBGE from '../../services/apiIBGE'

import styles from './styles';
import logo from '../../assets/logo.png'
import logoBackground from '../../assets/home-background.png'

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

interface TESTE {
    [label: string]: string
}
const Home = () => {
    const navigation = useNavigation()

    const [ufs, setUfs] = useState([
        {
            label: '',
            value: ''
        }
    ])
    const [cities, setCities] = useState([{
        label: '',
        value: ''
    }])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const handleNavigateToPoints = () => {
        const uf = selectedUf
        const city = selectedCity
        navigation.navigate('Points', {
            uf,
            city
        })
    }

    useEffect(() => {
        apiIBGE.get<IBGEUFResponse[]>('localidades/estados')
            .then(res => {
                let tts: any[] = []
                res.data.map(uf => {
                    tts.push({
                        label: uf.sigla,
                        value: uf.sigla
                    })
                })
                setUfs(tts)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') return

        apiIBGE.get<IBGECityResponse[]>(`localidades/estados/${selectedUf}/municipios`)
            .then(res => {
                let tts: any[] = []
                res.data.map(city => {
                    tts.push({
                        label: city.nome,
                        value: city.nome
                    })
                })
                setCities(tts)
            })
    }, [selectedUf])

    const handleSelectUF = (event: string) => {
        setSelectedUf(event)
    }

    const handleSelectCity = (event: string) => {
        setSelectedCity(event)
    }

    return (
        <ImageBackground
            source={logoBackground}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={logo} />
                <Text style={styles.title}>
                    Seu marketplace de coleta de resíduos
                </Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
            </View>
            <View style={styles.footer}>
                <RNPickerSelect
                    placeholder={{
                        label: 'Selecione a UF...',
                        value: '',
                    }}
                    value={selectedUf}
                    style={pickerStyle}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={handleSelectUF}

                    items={ufs}
                />

                <RNPickerSelect
                    placeholder={{
                        label: 'Selecione a cidade...',
                        value: '',
                    }}
                    value={selectedCity}
                    style={pickerStyle}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={handleSelectCity}

                    items={cities}
                />

                <RectButton
                    style={styles.button}
                    onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#fff" size={24} />
                        </Text>
                    </View>
                    <Text
                        style={styles.buttonText}
                    >
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    )
}

export default Home;

const pickerStyle = {
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        color: '#c1c1c1',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        color: '#c1c1c1',
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    }
};