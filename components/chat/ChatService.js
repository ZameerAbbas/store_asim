import { ref, set, push, onValue, off, serverTimestamp, get, update, remove } from "firebase/database"
import { database } from "./firebase"

// 🔍 Test database connection
export const testDatabaseConnection = async () => {
  try {
    const testRef = ref(database, "test/connection")
    await set(testRef, {
      timestamp: serverTimestamp(),
      test: true,
    })
    console.log("✅ Realtime Database connection successful")
    return { success: true }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return { success: false, error: error.message }
  }
}

// 🔍 Find existing chat between store and user
export const findExistingChat = async (storeId, userId) => {
  try {
    const userChatsRef = ref(database, `userChats/${userId}/${storeId}`)
    const snapshot = await get(userChatsRef)

    if (snapshot.exists()) {
      const chatIds = Object.keys(snapshot.val())
      // Filter out any old support chats and return the correct format
      const validChatId = chatIds.find((id) => id === `${storeId}_${userId}`)
      if (validChatId) {
        return validChatId
      }
    }
    return null
  } catch (error) {
    console.error("❌ Error finding existing chat:", error)
    return null
  }
}

// 🧠 Generate chat ID for store-user conversation (NO MORE SUPPORT)
export const generateChatId = (storeId, userId) => {
  return `${storeId}_${userId}`
}

// 🧱 Create a new chat room (store + user only)
export const createChat = async (storeId, userId, userDetails) => {
  try {
    const chatId = generateChatId(storeId, userId)

    // Check if chat already exists
    const chatRef = ref(database, `stores/${storeId}/chats/${chatId}`)
    const existingChat = await get(chatRef)

    if (existingChat.exists()) {
      console.log("✅ Chat already exists:", chatId)
      return { success: true, exists: true, chatId }
    }

    // Create the chat with ONLY store and user info
    await set(chatRef, {
      userId: userId,
      storeId: storeId,
      userDetails,
      createdAt: Date.now(),
      lastMessage: "",
      lastMessageTime: Date.now(),
    })

    console.log("✅ Chat created successfully:", chatId)

    // Index chat for the user only
    const updates = {}
    updates[`userChats/${userId}/${storeId}/${chatId}`] = true

    await update(ref(database), updates)

    return { success: true, exists: false, chatId }
  } catch (error) {
    console.error("❌ Error creating chat:", error)
    return { success: false, error: error.message }
  }
}

// ➕ Start or get existing chat between store and user (MAIN FUNCTION)
export const startOrGetChat = async (storeId, userId, userName) => {
  try {
    // First, try to find existing chat
    const existingChatId = await findExistingChat(storeId, userId)

    if (existingChatId) {
      console.log("✅ Found existing chat:", existingChatId)
      return { success: true, chatId: existingChatId, exists: true }
    }

    // If no existing chat, create new one
    const result = await createChat(storeId, userId, {
      uid: userId,
      name: userName,
      role: "customer",
    })

    return result
  } catch (error) {
    console.error("❌ Error starting/getting chat:", error)
    return { success: false, error: error.message }
  }
}

// 💬 Send a message (CLEANED UP)
export const sendMessage = async (storeId, chatId, text, senderId, senderName, isFromStore = false) => {
  try {
    const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
    const newMessageRef = push(messagesRef)

    const messageData = {
      _id: newMessageRef.key,
      text,
      createdAt: Date.now(),
      senderId,
      senderName,
      isRead: false,
      isfromStore: isFromStore,
    }

    const updates = {}

    // Store the message
    updates[`stores/${storeId}/chats/${chatId}/messages/${newMessageRef.key}`] = messageData

    // Update last message info
    updates[`stores/${storeId}/chats/${chatId}/lastMessage`] = text
    updates[`stores/${storeId}/chats/${chatId}/lastMessageTime`] = Date.now()

    // ONLY index for user if they're NOT the store
    if (!isFromStore) {
      updates[`userChats/${senderId}/${storeId}/${chatId}`] = true
    }

    await update(ref(database), updates)

    console.log("✅ Message sent successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ Error sending message:", error)
    return { success: false, error: error.message }
  }
}

// 👂 Listen to messages in real-time
export const listenToMessages = (storeId, chatId, callback) => {
  const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)

  const handleSnapshot = (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const messages = Object.values(data)
        .map((msg) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.senderId,
            name: msg.senderName,
            isStore: msg.isfromStore,
          },
        }))
        .sort((a, b) => b.createdAt - a.createdAt)
      callback(messages)
    } else {
      callback([])
    }
  }

  onValue(messagesRef, handleSnapshot, (error) => {
    console.error("❌ Error listening to messages:", error)
    callback([])
  })

  return () => off(messagesRef, "value", handleSnapshot)
}

// 📥 Get all chats for a store
export const getChatsForStore = (storeId, callback) => {
  const chatsRef = ref(database, `stores/${storeId}/chats`)

  const handleSnapshot = (snapshot) => {
    const data = snapshot.val()
    const chats = data
      ? Object.entries(data)
          .map(([id, chat]) => ({ id, ...chat }))
          .sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0))
      : []
    callback(chats)
  }

  onValue(chatsRef, handleSnapshot, (error) => {
    console.error("❌ Error listening to store chats:", error)
    callback([])
  })

  return () => off(chatsRef)
}

// 📤 Get chats for a user across all stores
export const getChatsForUser = (userId, callback) => {
  const userChatsRef = ref(database, `userChats/${userId}`)

  const handleSnapshot = async (snapshot) => {
    if (!snapshot.exists()) {
      callback([])
      return
    }

    const stores = snapshot.val()
    const result = []

    try {
      for (const storeId of Object.keys(stores)) {
        const chatIds = Object.keys(stores[storeId])
        for (const chatId of chatIds) {
          // Skip old support chats
          if (chatId.includes("_support")) {
            continue
          }

          const chatRef = ref(database, `stores/${storeId}/chats/${chatId}`)
          const chatSnap = await get(chatRef)

          if (chatSnap.exists()) {
            const chatData = chatSnap.val()

            // Count unread messages
            const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
            const msgSnap = await get(messagesRef)

            let unreadCount = 0
            if (msgSnap.exists()) {
              msgSnap.forEach((msg) => {
                if (!msg) return
                const message = msg.val()
                if (message && message.senderId !== userId && !message.isRead) {
                  unreadCount++
                }
              })
            }

            result.push({
              id: chatId,
              storeId,
              unreadCount,
              ...chatData,
            })
          }
        }
      }

      result.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0))
      callback(result)
    } catch (error) {
      console.error("❌ Error getting user chats:", error)
      callback([])
    }
  }

  onValue(userChatsRef, handleSnapshot, (error) => {
    console.error("❌ Error listening to user chats:", error)
    callback([])
  })

  return () => off(userChatsRef)
}

// ❓ Check if chat exists
export const checkChatExists = async (storeId, userId) => {
  const chatId = generateChatId(storeId, userId)
  const chatRef = ref(database, `stores/${storeId}/chats/${chatId}`)
  const snapshot = await get(chatRef)
  return snapshot.exists()
}

// 🚀 Get all chats by senderId
export const getChatsBySenderId = async (senderId) => {
  try {
    const userChatsRef = ref(database, `userChats/${senderId}`)
    const snapshot = await get(userChatsRef)

    if (!snapshot.exists()) {
      return []
    }

    const stores = snapshot.val()
    const result = []

    for (const storeId of Object.keys(stores)) {
      const chatIds = Object.keys(stores[storeId])
      for (const chatId of chatIds) {
        // Skip old support chats
        if (chatId.includes("_support")) {
          continue
        }

        const chatRef = ref(database, `stores/${storeId}/chats/${chatId}`)
        const chatSnap = await get(chatRef)

        if (chatSnap.exists()) {
          const chatData = chatSnap.val()

          // Count unread messages
          const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
          const msgSnap = await get(messagesRef)

          let unreadCount = 0
          if (msgSnap.exists()) {
            msgSnap.forEach((msg) => {
              if (!msg) return
              const message = msg.val()
              if (message && message.senderId !== senderId && !message.isRead) {
                unreadCount++
              }
            })
          }

          result.push({
            id: chatId,
            storeId,
            unreadCount,
            ...chatData,
          })
        }
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error fetching chats by senderId:", error)
    return []
  }
}

// 🧹 Clean up old support chats (UTILITY FUNCTION)
export const cleanupOldSupportChats = async (userId) => {
  try {
    const userChatsRef = ref(database, `userChats/${userId}`)
    const snapshot = await get(userChatsRef)

    if (!snapshot.exists()) return

    const stores = snapshot.val()
    const updates = {}

    for (const storeId of Object.keys(stores)) {
      const chatIds = Object.keys(stores[storeId])
      for (const chatId of chatIds) {
        // Remove old support chats
        if (chatId.includes("_support")) {
          updates[`userChats/${userId}/${storeId}/${chatId}`] = null
          console.log("🧹 Cleaning up old support chat:", chatId)
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await update(ref(database), updates)
      console.log("✅ Cleaned up old support chats")
    }
  } catch (error) {
    console.error("❌ Error cleaning up old chats:", error)
  }
}

export const markMessagesAsRead = async (storeId, chatId, currentUserId) => {
  const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
  const snapshot = await get(messagesRef)

  if (!snapshot.exists()) return

  const updates = {}

  snapshot.forEach((child) => {
    const msg = child.val()
    const msgId = child.key

    if (msg.senderId !== currentUserId && !msg.isRead) {
      updates[`stores/${storeId}/chats/${chatId}/messages/${msgId}/isRead`] = true
    }
  })

  if (Object.keys(updates).length > 0) {
    await update(ref(database), updates)
    console.log("✅ Messages marked as read")
  }
}

export const deleteMessage = async (storeId, chatId, messageId, currentUserId = null) => {
  try {
    const messageRef = ref(database, `stores/${storeId}/chats/${chatId}/messages/${messageId}`)
    const msgSnap = await get(messageRef)

    if (!msgSnap.exists()) {
      throw new Error("Message does not exist")
    }

    const messageToDelete = msgSnap.val()

    if (currentUserId && messageToDelete.senderId !== currentUserId) {
      throw new Error("You can only delete your own messages")
    }

    const updates = {
      [`stores/${storeId}/chats/${chatId}/messages/${messageId}`]: null,
    }

    await update(ref(database), updates)
    console.log("✅ Message deleted:", messageId)

    // Update last message
    const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
    const allMsgsSnap = await get(messagesRef)

    let latestMsg = null
    allMsgsSnap.forEach((childSnap) => {
      const msg = childSnap.val()
      if (!latestMsg || msg.createdAt > latestMsg.createdAt) {
        latestMsg = msg
      }
    })

    const lastMessageUpdates = {}

    if (latestMsg) {
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessage`] = latestMsg.text
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessageTime`] = latestMsg.createdAt
    } else {
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessage`] = ""
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessageTime`] = Date.now()
    }

    await update(ref(database), lastMessageUpdates)

    return { success: true }
  } catch (error) {
    console.error("❌ Error deleting message:", error)
    return { success: false, error: error.message }
  }
}

export const editMessage = async (storeId, chatId, messageId, newText, currentUserId = null) => {
  try {
    const messageRef = ref(database, `stores/${storeId}/chats/${chatId}/messages/${messageId}`)

    const snapshot = await get(messageRef)
    if (!snapshot.exists()) {
      throw new Error("Message does not exist")
    }

    const message = snapshot.val()

    if (currentUserId && message.senderId !== currentUserId) {
      throw new Error("You can only edit your own messages")
    }

    const newTimestamp = Date.now()

    await update(messageRef, {
      text: newText,
      editedAt: newTimestamp,
    })

    console.log("✅ Message edited successfully")

    // Update last message if this was the latest
    const messagesRef = ref(database, `stores/${storeId}/chats/${chatId}/messages`)
    const allMsgsSnap = await get(messagesRef)

    let latestMsg = null
    allMsgsSnap.forEach((childSnap) => {
      const msg = childSnap.val()
      if (!latestMsg || msg.createdAt > latestMsg.createdAt) {
        latestMsg = msg
      }
    })

    const lastMessageUpdates = {}

    if (latestMsg) {
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessage`] = latestMsg.text
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessageTime`] = latestMsg.createdAt
    } else {
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessage`] = ""
      lastMessageUpdates[`stores/${storeId}/chats/${chatId}/lastMessageTime`] = newTimestamp
    }

    await update(ref(database), lastMessageUpdates)

    return { success: true }
  } catch (error) {
    console.error("❌ Error editing message:", error)
    return { success: false, error: error.message }
  }
}

export const deleteMessageForUserOnly = async (userId, storeId, chatId) => {
  try {
    const userChatRef = ref(database, `userChats/${userId}/${storeId}/${chatId}`)
    await remove(userChatRef)
    console.log("✅ Chat removed for user")
    return { success: true }
  } catch (error) {
    console.error("❌ Error deleting chat for user:", error)
    return { success: false, error: error.message }
  }
}

// 🔄 Keep backward compatibility but remove support logic
export const startNewChat = startOrGetChat
