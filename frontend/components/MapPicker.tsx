import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapPicker = (
    { onSaveLocation, onClose }:
        { onSaveLocation: (location: { lat: number; lng: number }) => void; onClose: () => void }) => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ lat: latitude, lng: longitude });
    };
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onPress={handleMapPress}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={{
                            latitude: selectedLocation.lat,
                            longitude: selectedLocation.lng,
                        }}
                    />
                )}
            </MapView>
            <View style={styles.actions}>
                <Button title="Save Location" onPress={() => selectedLocation && onSaveLocation(selectedLocation)} />
                <Button title="Cancel" color="red" onPress={onClose} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#fff",
    },
});

export default MapPicker;
