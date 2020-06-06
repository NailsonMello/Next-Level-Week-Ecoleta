import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';

const Loading = () => {
    const [animation, setAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 5040,
            duration: 10000
        }).start()
    }
    useEffect(() => {
        startAnimation()
    }, [])

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "-360deg"]
    })

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }]
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.box, animatedStyle]}>
                <Image source={require('../../assets/ecoleta.png')} style={{ width: 100, height: 100 }} />
            </Animated.View>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 5,
        padding: 32,
        paddingTop: 20,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    box: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#fff',
        fontSize: 25
    }
})

export default Loading