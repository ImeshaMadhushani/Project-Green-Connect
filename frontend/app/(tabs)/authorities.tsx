import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrganizationsScreen = () => {
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await fetch('https://your-backend-api.com/organizations'); // Replace with API URL
            const data = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const getRandomColor = () => {
        const colors = ['#E9F0C7', '#F0F8E6', '#FBFBEF', '#F3F3F3', '#E0EDF4', '#E9E5F3']; // some pastel shades
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: getRandomColor() }]}>
            <Text style={styles.title}>{item.name}</Text>
            {item.address && <Text style={styles.text}>Address: {item.address}</Text>}
            {item.phone && <Text style={styles.text}>Phone: {item.phone}</Text>}
            {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
            {item.website && <Text style={styles.link}>{item.website}</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={organizations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    card: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        marginBottom: 2,
    },
    link: {
        fontSize: 14,
        color: 'blue',
    },
});

export default OrganizationsScreen;
