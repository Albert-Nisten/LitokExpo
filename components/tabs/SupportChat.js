import React, { useContext, useEffect, useState } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { api } from '../../config';
import { Context, socket } from '../Context';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import RequireAuth from '../router/RequireAuth';

export default function ChatScreen() {

  const {user} = useContext(Context)
  const [messages, setMessages] = useState([]);
  const [agentId, setAgentId] = useState(null)

  const { colors } = useTheme() 

  const addSystemMessage = text => {
    let systemMessage = {
      _id: Math.random().toString(36).substring(7),
      text,
      createdAt: new Date(),
      system: true
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, [systemMessage]));
  }

  const addMessage = message => {
    let newMessage = {
      _id: message.id,
      text: message.message,
      ...message,
      user: {
        _id: message.from === 'user' ? user.id: null,
        name: "support"
      },
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
  }

  const sendMessage = data => {
    api.post('/support/message', data)
    .then(resp => {
      let data = resp.data;
      console.log(data)
      if(data.message === "sucesso"){
        let message = data.newMessage
        addMessage(message)
        if(agentId > 0){
          let socketMessage = {userId: agentId, message}
          sendSocketMessage(socketMessage)
        }
      }
    })
    .catch(err => console.log(err.message))
  }

  const handleMessage = (message) => {
    console.log(message[0])
    //setMessages(GiftedChat.append(messages, newMessages));
    let chatData = {
      userId: user.id, 
      latest_message: message[0].text,
      type: "low"
    }

    api.post("/support/chat", chatData)
    .then(resp => {
      let data = resp.data;
      console.log(data)
      if(data.message === "sucesso"){
        sendMessage({
          chatId: data.chat.id,
          message: message[0].text,
          from: "user"
        })
      }
    })
    .catch(err => console.log(err.message))
  };

  const getOpenChat = () => {
    api.get(`/support/chat/open/${user.id}`)
    .then(resp => {
      let data = resp.data
      console.log(data)
      if(data.message === "sucesso"){
        let messages = data.chat.support_messages
        setMessages([])
        messages.forEach(row => {
          addMessage(row)
        })
        // console.log(resp.data)
        socket.emit('open_chat', {from: "user", chatId: data.chat.id})
      }else{
        addSystemMessage("Aguarde a resposta de um agente. Se houver um histórico de conversas anterior, ele será carregado automaticamente.")
      }
    })
    .catch(err => console.log(err))
  }

  const sendSocketMessage = ({userId, message}) => {
      socket.emit("message", {userId, message})
  }

  useEffect(() => {
    if(user){
      getOpenChat()
    }

    socket.on('message', data => {
      setAgentId(data.agentId)
      addMessage(data)
      console.log(data)
    })

    return () => {
      socket.off("message")
    }
  }, [])

  const renderSystemMessage = (props) => (
    <View style={styles.systemMessageContainer}>
      <Text style={styles.systemMessageText}>{props.currentMessage.text}</Text>
    </View>
  );

  const renderAvatar = (props) => {
    return (
      <Avatar.Icon 
        size={40} // Tamanho do ícone
        
        icon= {() => <MaterialIcons color={"white"} size={24} name="support-agent"/>} // Ícone personalizado do React Native Paper
      />
    );
  };

  // Função para personalizar o balão de mensagens
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary, // Cor personalizada para mensagens do usuário atual (lado direito)
          },
          
        }}
        textStyle={{
          right: {
            color: colors.onPrimary, // Cor do texto para mensagens do usuário
          },
        }}
      />
    );
  };

  const renderSend = props => {
    return (
      <IconButton 
        size={24} 
        iconColor={colors.primary} 
        icon={'send'}
        onPress={() => props.onSend({text: props.text}, true)}
        disabled={!props.text || props.text.trim().length === 0}
      />
    )
  }

  if(!user){
    return <RequireAuth/>
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={message => handleMessage(message)}
      user={{
        _id: user.id,
      }}
      renderSystemMessage={renderSystemMessage}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      renderSend={renderSend}
      placeholder='Escrever Mensagem...'
    />
  );
}

const styles = StyleSheet.create({
  systemMessageContainer: {
    padding: 10,
  },
  systemMessageText: {
    textAlign: "center",
    color: "gray"
  }
})
