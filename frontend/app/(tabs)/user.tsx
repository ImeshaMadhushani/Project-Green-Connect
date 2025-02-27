import { StyleSheet, Text, View } from "react-native"

const Home=()=>{
    const ui=(
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
        </View>
    );
    return ui;
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#25292e',
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        color:'#fff'
    }
});

export default Home;