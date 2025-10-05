import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Input, VStack, HStack, Text, Container, Heading, Flex, IconButton } from '@chakra-ui/react';
import { IoMdSend, IoMdChatbubbles } from 'react-icons/io';
import { FiUser, FiMic, FiSquare, FiPlay, FiPause } from 'react-icons/fi';
import { ReactMediaRecorder } from 'react-media-recorder';
import io from 'socket.io-client';

// --- Configuración de Conexión ---
const SERVER_IP = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
const SECRET_KEY = 'my-super-secret-chat-key';

const socket = io(SERVER_IP, {
  auth: { token: SECRET_KEY },
  transports: ['websocket'],
});

// --- Componente: Reproductor de Audio ---
const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <HStack>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
      <IconButton
        icon={isPlaying ? <FiPause /> : <FiPlay />}
        onClick={togglePlay}
        aria-label="Play/Pause audio"
        isRound
        colorScheme="teal"
      />
      <Text fontSize="sm">Nota de voz</Text>
    </HStack>
  );
};


// --- Componente: Burbuja de Mensaje ---
const MessageBubble = ({ msg }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: msg.fromMe ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      maxWidth: '75%',
      alignSelf: msg.fromMe ? 'flex-end' : 'flex-start'
    }}>
      {!msg.fromMe && (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#319795',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          marginRight: '8px',
          flexShrink: 0
        }}>
          {msg.user.charAt(0).toUpperCase()}
        </div>
      )}
      
      <div style={{
        backgroundColor: msg.fromMe ? '#319795' : '#4A5568',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '16px',
        maxWidth: '300px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {!msg.fromMe && (
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#81E6D9',
            marginBottom: '4px'
          }}>
            {msg.user}
          </div>
        )}
        
        {msg.type === 'audio' ? (
          <AudioPlayer src={msg.audioURL} />
        ) : (
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
            {msg.text}
          </div>
        )}
        
        {msg.fromMe && (
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#81E6D9',
            marginBottom: '4px',
            textAlign: 'right'
          }}>
            {msg.user}
          </div>
        )}
        <div style={{ 
          fontSize: '11px', 
          opacity: 0.7, 
          textAlign: msg.fromMe ? 'right' : 'left',
          marginTop: '4px'
        }}>
          {msg.timestamp}
        </div>
      </div>
      
      {msg.fromMe && (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#319795',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          marginLeft: '8px',
          flexShrink: 0
        }}>
          {msg.user.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

// --- Componente: Grabador de Voz ---
const VoiceNoteRecorder = ({ onStop }) => (
  <ReactMediaRecorder
    audio
    onStop={onStop}
    render={({ status, startRecording, stopRecording }) => (
      <Box>
        {status === 'recording' ? (
          <IconButton
            icon={<FiSquare />}
            onClick={stopRecording}
            aria-label="Stop recording"
            colorScheme="red"
            isRound
          />
        ) : (
          <IconButton
            icon={<FiMic />}
            onClick={startRecording}
            aria-label="Start recording"
            colorScheme="teal"
            isRound
          />
        )}
      </Box>
    )}
  />
);

// --- Componente: Pantalla de Login ---
const randomNames = ['León', 'Tigre', 'Oso', 'Águila', 'Lobo', 'Zorro'];

const LoginScreen = ({ handleLogin }) => (
  <Box 
    minH="100vh" 
    bg="gray.900"
    display="flex" 
    alignItems="center" 
    justifyContent="center"
  >
    <Container position="relative" zIndex={1}>
      <VStack spacing={8}>
        <VStack spacing={4}>
          <Box 
            p={4} 
            borderRadius="full" 
            bg="whiteAlpha.200" 
            backdropFilter="blur(20px)"
            boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          >
            <IoMdChatbubbles size={48} color="white" />
          </Box>
          <Heading color="white" fontSize="4xl" fontWeight="bold" textAlign="center">
            ChatFlow
          </Heading>
          <Text color="whiteAlpha.800" fontSize="lg" textAlign="center">
            Conecta y conversa en tiempo real
          </Text>
        </VStack>
        
        <Box
          bg="whiteAlpha.100"
          backdropFilter="blur(20px)"
          p={8}
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          w="full"
          maxW="400px"
        >
          <VStack spacing={6}>
            <VStack spacing={2}>
              <FiUser size={24} color="white" />
              <Text color="white" fontSize="lg" fontWeight="medium">
                Elige tu nombre
              </Text>
            </VStack>
            
            <VStack spacing={3} w="full">
              {randomNames.map(name => (
                <Button 
                  key={name}
                  onClick={() => handleLogin(name)} 
                  size="lg"
                  w="full"
                  bg="teal.500"
                  color="white"
                  _hover={{ 
                    bg: "teal.400",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(0, 128, 128, 0.4)'
                  }}
                  _active={{ transform: 'translateY(0px)' }}
                  transition="all 0.3s ease"
                  borderRadius="xl"
                  fontWeight="bold"
                >
                  {name}
                </Button>
              ))}
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  </Box>
);

// --- Componente Principal: App ---
function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleChatMessage = (msg) => {
      let finalMsg = { ...msg };

      if (msg.type === 'audio' && msg.audioBuffer) {
        const blob = new Blob([msg.audioBuffer], { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);
        finalMsg.audioURL = audioURL;
      }

      finalMsg.fromMe = msg.user === username;

      // Evitar duplicados
      if (msg.user !== username) {
        setMessages((prev) => [...prev, finalMsg]);
      }
    };

    socket.on('chat history', (history) => {
      setMessages(history.map(msg => ({ ...msg, fromMe: msg.user === username })) || []);
    });

    socket.on('chat message', handleChatMessage);

    return () => {
      socket.off('chat message', handleChatMessage);
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (selectedUsername) => {
    if (selectedUsername) {
      setUsername(selectedUsername);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && isLoggedIn) {
      const message = {
        user: username,
        text: inputValue,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      const msgWithFromMe = { ...message, fromMe: true };
      setMessages((prev) => [...prev, msgWithFromMe]);

      socket.emit('chat message', message);
      setInputValue('');
    }
  };

  const handleSendAudio = (audioURL, blob) => {
    if (blob && isLoggedIn) {
      const message = {
        user: username,
        audioBuffer: blob,
        type: 'audio',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const localMessage = {
        ...message,
        audioURL: URL.createObjectURL(blob),
        fromMe: true,
      };
      setMessages((prev) => [...prev, localMessage]);

      socket.emit('chat message', message);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen handleLogin={handleLogin} />;
  }

  return (
    <Box 
      minH="100vh" 
      bg="gray.900"
    >
      <Container maxW="container.md" h="100vh" position="relative" zIndex={1}>
        <Flex direction="column" h="full" py={4}>
          {/* Header */}
          <Box 
            bg="whiteAlpha.100" 
            backdropFilter="blur(20px)"
            p={4} 
            borderRadius="2xl" 
            boxShadow="0 8px 32px rgba(0,0,0,0.1)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            mb={4}
          >
            <HStack justify="space-between" align="center">
              <HStack>
                <IoMdChatbubbles size={24} color="white" />
                <Heading color="white" fontSize="xl" fontWeight="bold">
                  ChatFlow
                </Heading>
              </HStack>
              <Text color="whiteAlpha.700" fontSize="sm">
                Conectado como {username}
              </Text>
            </HStack>
          </Box>

          {/* Messages Area */}
          <Box
            flex="1"
            bg="whiteAlpha.50"
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            p={4}
            mb={4}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { 
                background: 'rgba(255,255,255,0.3)', 
                borderRadius: '24px' 
              },
            }}
          >
            <VStack spacing={3} align="stretch">
              {messages.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    ¡Envía tu primer mensaje para comenzar la conversación!
                  </Text>
                </Box>
              )}
              {messages.map((msg, index) => (
                <MessageBubble key={index} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Input Area */}
          <Box 
            as="form" 
            onSubmit={handleSendMessage}
            bg="whiteAlpha.100"
            backdropFilter="blur(20px)"
            p={4}
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          >
            <HStack spacing={3}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                color="white"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{ borderColor: 'whiteAlpha.500', bg: 'whiteAlpha.200' }}
                _focus={{ 
                  borderColor: 'white', 
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                  bg: 'whiteAlpha.200'
                }}
                _placeholder={{ color: 'whiteAlpha.600' }}
                size="lg"
                borderRadius="xl"
                flex="1"
              />
              
              {/* <VoiceNoteRecorder onStop={handleSendAudio} /> */}

              <button
                type="submit"
                style={{
                  backgroundColor: "#319795",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  transition: "all 0.3s ease",
                  minWidth: "48px",
                  minHeight: "48px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2C7A7B";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#319795";
                  e.target.style.transform = "scale(1)";
                }}
                aria-label="Enviar mensaje"
              >
                <IoMdSend />
              </button>
            </HStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
