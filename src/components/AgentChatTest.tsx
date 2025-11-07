"use client";

import React, { useState } from 'react';
import { agentApi } from '@/lib/api';

/**
 * Simple test component to verify agent API integration
 * This can be added temporarily to test the chat functionality
 */
export default function AgentChatTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await agentApi.sendMessage(message, conversationId);
      setResponse(result.message);
      
      if (result.conversation_id) {
        setConversationId(result.conversation_id);
      }

      // Log sources if available
      if (result.sources && result.sources.length > 0) {
        console.log('Sources:', result.sources);
      }

      // Log metadata if available
      if (result.metadata) {
        console.log('Metadata:', result.metadata);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to send message: ${errorMessage}`);
      console.error('Agent API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      padding: '20px',
      backgroundColor: 'rgba(30, 30, 50, 0.95)',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000,
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Agent API Test</h3>
      
      {conversationId && (
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          Conversation ID: {conversationId.substring(0, 8)}...
        </p>
      )}

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        />
      </div>

      <button
        onClick={handleSendMessage}
        disabled={isLoading || !message.trim()}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isLoading ? '#555' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          marginBottom: '10px',
        }}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderRadius: '5px',
          marginBottom: '10px',
          fontSize: '13px',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{
          padding: '10px',
          backgroundColor: 'rgba(0, 100, 255, 0.2)',
          borderRadius: '5px',
          fontSize: '13px',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          <strong>Response:</strong>
          <p style={{ marginTop: '5px', marginBottom: 0 }}>{response}</p>
        </div>
      )}
    </div>
  );
}
