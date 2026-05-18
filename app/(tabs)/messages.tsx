import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useListagramStore } from '../../src/store';

export default function MessagesScreen() {
  const {
    currentUser,
    users,
    conversations,
    currentConversationId,
    messageDraft,
    startConversation,
    setCurrentConversationId,
    setMessageDraft,
    sendMessage,
  } = useListagramStore();

  const activeConversation = conversations.find((item) => item.id === currentConversationId);

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setCurrentConversationId(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarPlaceholder}>
        <MaterialCommunityIcons name="account" size={24} color="#fff" />
      </View>
      <View style={styles.conversationText}>
        <Text style={styles.conversationName}>{item.participantName}</Text>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 ? (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isSentByMe = item.senderId === currentUser.id;
    return (
      <View style={[styles.messageBubble, isSentByMe ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
        <Text style={[styles.messageText, isSentByMe && styles.messageTextRight]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {!activeConversation ? (
        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Chats</Text>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderConversationItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />

          <Text style={styles.sectionTitle}>Contacts</Text>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.contactItem}
              onPress={() => startConversation(user.id)}
              activeOpacity={0.8}
            >
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={24} color="#fff" />
              </View>
              <View style={styles.conversationText}>
                <Text style={styles.conversationName}>{user.name}</Text>
                <Text style={styles.conversationPreview} numberOfLines={1}>
                  {user.bio}
                </Text>
              </View>
              <MaterialCommunityIcons name="message-plus" size={24} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setCurrentConversationId(null)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.chatHeaderTitle}>
              <Text style={styles.chatName}>{activeConversation.participantName}</Text>
              <Text style={styles.chatSubtitle}>Tap to reply</Text>
            </View>
          </View>

          <FlatList
            data={activeConversation.messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.chatMessages}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
          >
            <View style={styles.messageInputRow}>
              <TextInput
                style={styles.messageInput}
                value={messageDraft}
                onChangeText={setMessageDraft}
                placeholder="Write a message..."
                placeholderTextColor="#777"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (messageDraft.trim()) {
                    sendMessage(activeConversation.id, messageDraft.trim());
                  }
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="send" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationText: {
    flex: 1,
  },
  conversationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationPreview: {
    color: '#888',
    marginTop: 2,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3d00',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  chatHeaderTitle: {
    marginLeft: 12,
  },
  chatName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  chatSubtitle: {
    color: '#888',
    marginTop: 2,
  },
  chatMessages: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  messageBubbleLeft: {
    backgroundColor: '#222',
    alignSelf: 'flex-start',
  },
  messageBubbleRight: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
  },
  messageTextRight: {
    color: '#000',
  },
  messageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  messageInput: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#111',
    borderRadius: 24,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
