import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitFeedback = async () => {
    if (rating === 0 || comment.trim() === '') {
      Alert.alert('Error', 'Please provide a rating and comment.');
      return;
    }

    const feedbackData = { rating, comment };
//backend connect url
    try {
      const response = await fetch('https://your-backend.com/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your feedback!');
        setRating(0);
        setComment('');
      } else {
        Alert.alert('Error', 'Failed to submit feedback.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Rate Our App</Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Ionicons
              name={num <= rating ? 'star' : 'star-outline'}
              size={30}
              color={num <= rating ? '#FFD700' : '#ccc'}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Write your feedback..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={{
          height: 100,
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />

      <TouchableOpacity
        onPress={submitFeedback}
        style={{
          backgroundColor: '#0D986A',
          padding: 15,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackScreen;
