import React, {useCallback, useState, useEffect} from "react"
import {
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Modal,
    Image,
    FlatList,
    Dimensions,
    SafeAreaView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "expo-router"

type PhotoItem = {
    uri: string;
}
const {width, height} = Dimensions.get("window");
const itemSize = width * 0.3;

export default function Detail() {
    const [capturedPhotos, setCapturedPhotos] = useState<PhotoItem[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
    const navigation = useNavigation();

    const loadSavedPhotos = useCallback(async () => {
        try {
            const savedPhotos = await AsyncStorage.getItem("capturedPhotos");
            if(savedPhotos){
                setCapturedPhotos(JSON.parse(savedPhotos));
            }
        } catch (error) {
            console.error("Failed to load saved photos", error);
        }
    }, []); 
        useEffect (() => {
            const unsubscribe = navigation.addListener("focus", () => {
                loadSavedPhotos();
        });

        return unsubscribe;
    }, [navigation, loadSavedPhotos]);


        const openPhoto = (item: PhotoItem) => {
            setSelectedPhoto(item);
        };

        const closePhoto = () => {
            setSelectedPhoto(null);
        };

        const renderItem = ({item}: {item: PhotoItem}) => {
            return (
                <TouchableOpacity style={styles.item} onPress={() => openPhoto(item)}>
                    <Image source={{uri: item.uri}} style={styles.photo} />
                </TouchableOpacity>
            );

        const renderFullScreenPhoto = () => {
            return (
            <Modal
            visible={selectedPhoto !== null}
            transparent={false}
            animationType="fade"
            >
                <SafeAreaView
                style={styles.fullScreenContainer}
                >
                    <TouchableOpacity style = {styles.closeButton} onPress={closePhoto}>
                        <Text style={styles.closeButtonText}>x</Text>            
                    </TouchableOpacity>
                    < Image 
                    source={{uri: selectedPhoto?.uri}} 
                    style={styles.fullScreenPhoto} 
                    resizeMode="contain"/>

                </SafeAreaView>
            </Modal>
            );  
        };   

        return (
            <View style = {styles.container} >{capturedPhotos.length > 0 ? (
                <FlatList
                data={capturedPhotos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                />
            ) : (
                <Text style={styles.noPhotoText}>No photos captured</Text>
            )}
            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "fff",
    }, 
    item: {
        width: itemSize,
        height: itemSize,
        padding: 2,
    },
    photo: {
        width: "100%",
        height: "100%",
    },
    noPhotoText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    fullScreenPhoto: {
        width: width,
        height: height,
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 35,
        color: "white",
    },
});