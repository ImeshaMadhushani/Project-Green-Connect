import CardReg from "@/components/CardReg";
import { ScrollView, StyleSheet, Text, View } from "react-native"

const Home=()=>{
    const ui=(
    <ScrollView contentContainerStyle={{paddingBottom: 20,}}>
        <View style={styles.container}>
            <Text style={{fontSize:30,marginTop:10}}>Notifications</Text>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
        </View>import CardReg from "@/components/CardReg";
import { ScrollView, StyleSheet, Text, View } from "react-native"

const Home=()=>{
    const ui=(
    <ScrollView contentContainerStyle={{paddingBottom: 20,}}>
        <View style={styles.container}>
            <Text style={{fontSize:30,marginTop:10}}>Notifications</Text>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
            <CardReg heading="Heading" bgColor="#FFFDEC"
            ><Text>Content</Text></CardReg>
        </View>
    </ScrollView>
    );
    return ui;
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
    },
    
});

export default Home;
    </ScrollView>
    );
    return ui;
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
    },
    
});

export default Home;