import { useRef } from 'react';
import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ButtonSuccess = ({ label, onPress, style }: Props) => {
  return (
    <View style={[styles.buttonContainer, style]}>
      <Pressable onPress={onPress} style={styles.button}>
        <LinearGradient
            colors={['#0D7C66', '#1BA37D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
            >
            <Text style={styles.buttonLabel}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    height: 70,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 15,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D7C66',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
});

export default ButtonSuccess;
