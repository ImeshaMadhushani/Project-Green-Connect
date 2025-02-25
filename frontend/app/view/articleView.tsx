import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Avatar, Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
const defaultImage = require("../../assets/images/default-image.png");

const fetchArticle = async (articleId) => {
    // This will be replaced with actual API call
    return {
      id: articleId,
      title: 'Beach Cleanup: Taking Action to Protect Our Oceans',
      authorName: 'Hazel Kris',
      authorAvatar: null, // Will store image URL from backend
      publishedAt: '3hr ago',
      imageUrl: null, // Will store image URL from backend
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consequat convallis bibendum. Curabitur efficitur orci turpis, et accumsan urna tempus non. Praesent pharetra suscipit dictum. Fusce vel aliquam ligula. Donec scelerisque massa sem, non elementum libero tincidunt in. Donec id orci eget mi vestibulum varius. Sed ut purus congue, imperdiet lacus in, viverra lectus. Etiam quis malesuada leo. Sed euismod ligula consequat, tempor ligula id, eleifend nibh.
  Etiam at dolor a mauris pellentesque lacinia. tristique interdum sollicitudin in, viverra euismod est. Aliquam erat volutpat. Quisque et tortor luctus erat porta ullamcorper finibus et nisl. Duis ac odio laoreet, rhoncus sem et, commodo risus. Praesent orci mi, luctus nec ornare eget, porttitor eu magna. Fusce non malesuada metus. Cras molestie nisi a neque mattis ornare. Curabitur a tortor non dui sollicitudin ullamcorper.`,
      commentCount: 4,
      likeCount: 0,
      isLiked: false,
    };
  };

  
const ArticleView = () => {

    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <StatusBar style="auto" />
          <ScrollView contentContainerStyle={styles.scrollContent}>

            {/* Hero Image */}
        <Card elevation={2} style={styles.imageCard}>
          <Card.Cover
            source={article.imageUrl ? { uri: article.imageUrl } : defaultImage}
            style={styles.coverImage}
          />
        </Card>
          </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 24,
    },
    coverImage: {
        height: 220,
      },
});

export default ArticleView;