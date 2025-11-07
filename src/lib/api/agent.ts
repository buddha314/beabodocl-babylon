/**
 * Agent API Module
 * 
 * Handles AI agent chat interactions and research assistance
 */

import apiClient from './client';
import type { ChatRequest, ChatResponse, ChatMessage } from './types';

class AgentApi {
  /**
   * Send a chat message to the research agent
   * @param request - Chat request with message and optional context
   * @returns Agent's response with message and sources
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/agent/chat', request);
    return response.data;
  }

  /**
   * Send a simple message (convenience method)
   * @param message - User message
   * @param conversationId - Optional conversation ID for context
   * @returns Agent's response
   */
  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    return this.chat({
      message,
      conversation_id: conversationId,
    });
  }

  /**
   * Get conversation history
   * @param conversationId - Conversation ID
   * @returns Array of chat messages
   */
  async getHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get<{ messages: ChatMessage[] }>(
      `/agent/conversations/${conversationId}`
    );
    return response.data.messages;
  }

  /**
   * Delete a conversation
   * @param conversationId - Conversation ID to delete
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete(`/agent/conversations/${conversationId}`);
  }

  /**
   * List all conversations
   * @returns Array of conversation summaries
   */
  async listConversations(): Promise<{
    id: string;
    title: string;
    last_message: string;
    updated_at: string;
  }[]> {
    const response = await apiClient.get<{
      conversations: {
        id: string;
        title: string;
        last_message: string;
        updated_at: string;
      }[];
    }>('/agent/conversations');
    return response.data.conversations;
  }
}

// Singleton instance
export const agentApi = new AgentApi();
