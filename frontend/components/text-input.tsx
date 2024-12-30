import React, { forwardRef, useState } from "react";
import { TextInput, TextInputProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = TextInputProps & {
  value?: string;
  text?: string;
  password?: boolean;
};

const TextInputStyled = forwardRef<TextInput, Props>(({ password = false, placeholder, text, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
    <>
    <Text style={{textAlign:'left',fontSize:15,width:"100%"}}>{text}</Text>
    <View style={styles.inputContainer}>
      <TextInput 
        ref={ref}
        placeholder={placeholder}
        secureTextEntry={password && !showPassword}
        {...props}  
        style={styles.input}
      />
      {password && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          <Text>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      )}
    </View>
    </>
  );
});

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
      },
      input: {
        flex: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 2,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10, 
        fontSize: 18,
        width: "100%"
      },
      iconContainer: {
        paddingRight: 10,
      }
});

export default TextInputStyled;
