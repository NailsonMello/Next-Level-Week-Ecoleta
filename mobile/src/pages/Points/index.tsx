import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
    Animated
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import api from '../../services/api'
import * as Location from 'expo-location'

import styles from './styles';

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface Point {
    id: number
    image: string
    image_url: string
    name: string
    latitude: number
    longitude: number
}

interface Params {
    uf: string
    city: string
}

const Points = () => {
    const navigation = useNavigation()

    const [items, setItems] = useState<Item[]>([])
    const [points, setPoints] = useState<Point[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [animation, setAnimation] = useState(new Animated.Value(0))
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const route = useRoute()

    const { uf, city } = route.params as Params
    console.log("points", uf, city);

    useEffect(() => {
        loadPositions()
    }, [])

    const loadPositions = async () => {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Oooops...', 'Precisamos de sua localização para obter a localização.')
            return
        }

        const location = await Location.getCurrentPositionAsync()
        const { latitude, longitude } = location.coords
        setInitialPosition([latitude, longitude])
    }
    useEffect(() => {
        api.get('/items')
            .then(res => {
                setItems(res.data)
            })
    }, [])

    useEffect(() => {
        api.get('/points', {
            params: {
                city: city,
                uf: uf,
                items: selectedItems
            }
        }).then(res => {
            setPoints(res.data)
        })
    }, [selectedItems])

    const handleNavigateToDetail = (id: number) => {
        navigation.navigate('Detail', { id })
    }

    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        }
        else
            setSelectedItems([...selectedItems, id])
    }

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 5040,
            duration: 10000
        }).start()
    }

    useEffect(() => {
        if (initialPosition[0] === 0)
            startAnimation()
    }, [initialPosition])
    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "-360deg"]
    })

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }]
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" color="#34cb79" size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>😃 Bem vindo.</Text>
                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta.
            </Text>
                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 ?
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                            {points.map(point => (
                                <Marker
                                    key={String(point.id)}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>
                                            {point.name}
                                        </Text>
                                    </View>
                                    <View style={styles.mapMakerArrow}>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                        :
                        <Animated.View style={[styles.box, animatedStyle]}>
                            <Image source={require('../../assets/ecoleta.png')} style={{width: 100, height: 100}}/>
                        </Animated.View>

                    }
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {items.map(item => (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            key={String(item.id)}
                            style={[styles.item, selectedItems.includes(item.id) && styles.selectedItem]}
                            onPress={() => handleSelectItem(item.id)}
                        >
                            <SvgUri
                                width={42}
                                height={42}
                                uri={item.image_url}
                            />
                            <Text style={styles.itemTitle}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Points;