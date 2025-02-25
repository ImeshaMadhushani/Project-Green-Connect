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


const ArticleView = ({ route }) => {

    const theme = useTheme();
    const articleId = route?.params?.articleId || '1';
    const [article, setArticle] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { width } = useWindowDimensions();

    React.useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await fetchArticle(articleId);
                setArticle(data);
            } catch (error) {
                console.error('Failed to load article:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [articleId]);

    const handleLike = async () => {
        setArticle((prev) => ({
            ...prev,
            likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
            isLiked: !prev.isLiked,
        }));
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={styles.loadingText}>Loading article...</Text>
            </SafeAreaView>
        );
    }

    if (!article) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={styles.errorText}>Article not found</Text>
            </SafeAreaView>
        );
    }

    const paragraphs = article.content.split('\n\n');

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

                {/* Article Header */}
                <Card style={styles.contentCard}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.title}>
                            {article.title}
                        </Text>

                        <View style={styles.authorRow}>
                            <View style={styles.authorInfo}>
                                <Avatar.Image
                                    size={48}
                                    source={article.authorAvatar ? { uri: article.authorAvatar } : user}
                                />
                                <Text variant="bodyMedium" style={styles.authorName}>
                                    By {article.authorName}
                                </Text>
                            </View>
                            <Text variant="bodySmall" style={styles.publishDate}>
                                {article.publishedAt}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.engagementRow}>
                            <View style={styles.engagementItem}>
                                <IconButton
                                    icon="comment-outline"
                                    size={20}
                                    onPress={() => {/* Navigate to comments */ }}
                                />
                                <Text variant="bodyMedium">{article.commentCount} comments</Text>
                            </View>

                            <View style={styles.engagementItem}>
                                <IconButton
                                    icon={article.isLiked ? "heart" : "heart-outline"}
                                    size={20}
                                    iconColor={article.isLiked ? theme.colors.error : theme.colors.onSurface}
                                    onPress={handleLike}
                                />
                                <Text variant="bodyMedium">{article.likeCount} likes</Text>
                            </View>

                            <View style={styles.engagementItem}>
                                <IconButton
                                    icon="share-variant-outline"
                                    size={20}
                                    onPress={handleShare}
                                />
                                <Text variant="bodyMedium">Share</Text>
                            </View>
                        </View>
                        <Divider style={styles.divider} />

                        {paragraphs.map((paragraph, index) => (
                            <Text key={index} style={styles.paragraph}>
                                {paragraph}
                            </Text>
                        ))}
                    </Card.Content>
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
    loadingText: {
        padding: 16,
        textAlign: 'center',
    },
    errorText: {
        padding: 16,
        textAlign: 'center',
        color: 'red',
    },
    imageCard: {
        marginBottom: 0,
        borderRadius: 0,
    },
    contentCard: {
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    authorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    authorName: {
        fontWeight: '500',
    },
    publishDate: {
        opacity: 0.7,
    },
    engagementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        marginVertical: 8,
    },
    articleContent: {
        paddingVertical: 16,
    },
    paragraph: {
        marginBottom: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
    relatedCard: {
        marginHorizontal: 12,
        marginTop: 8,
        borderRadius: 8,
    },
});

export default ArticleView;