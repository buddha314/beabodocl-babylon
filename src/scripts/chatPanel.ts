import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { IScript, visibleAsNumber } from "babylonjs-editor-tools";
import {
  AdvancedDynamicTexture,
  Rectangle,
  StackPanel,
  TextBlock,
  InputText,
  Button,
  ScrollViewer,
  Control
} from "@babylonjs/gui";
import { agentApi } from '../lib/api';

/**
 * ChatPanel Script - Attaches chat interface to a mesh
 *
 * Usage in Babylon Editor:
 * 1. Create a Plane mesh (width: 4, height: 3)
 * 2. Attach this script to the mesh
 * 3. Configure properties in inspector
 * 
 * The script creates an interactive chat interface with the research agent API.
 * Supports both desktop (mouse/keyboard) and VR (controller) interaction.
 */
export default class ChatPanelScript implements IScript {
  // Editable properties in Babylon Editor Inspector
  @visibleAsNumber("Panel Width", { min: 1, max: 10 })
  private panelWidth: number = 4;

  @visibleAsNumber("Panel Height", { min: 1, max: 10 })
  private panelHeight: number = 3;

  @visibleAsNumber("Texture Width", { min: 512, max: 4096 })
  private textureWidth: number = 2048;

  @visibleAsNumber("Texture Height", { min: 512, max: 4096 })
  private textureHeight: number = 1536;

  // Private properties
  private advancedTexture!: AdvancedDynamicTexture;
  private messageContainer!: StackPanel;
  private scrollViewer!: ScrollViewer;
  private inputText!: InputText;
  private sendButton!: Button;
  private messages: Array<{ sender: string; text: string }> = [];
  private conversationId?: string;
  private isLoading: boolean = false;
  private scene!: Scene;

  /**
   * Constructor - receives the mesh this script is attached to
   */
  public constructor(public mesh: Mesh) {}

  /**
   * Called when scene starts - initialize the chat UI
   */
  public onStart(): void {
    this.scene = this.mesh.getScene();
    this.initializeChatPanel();
  }

  /**
   * Initialize the chat panel GUI
   */
  private initializeChatPanel(): void {
    console.log("[ChatPanelScript] Initializing on mesh:", this.mesh.name);

    // Set material to emit light for visibility
    const material = new StandardMaterial("chatMaterial", this.scene);
    material.emissiveColor = new Color3(0.2, 0.2, 0.2);
    this.mesh.material = material;

    // Create GUI texture with high resolution for VR
    this.advancedTexture = AdvancedDynamicTexture.CreateForMesh(
      this.mesh,
      this.textureWidth,
      this.textureHeight
    );

    this.createChatUI();
    console.log("[ChatPanelScript] Initialized successfully");
  }

  /**
   * Create the chat UI elements
   */
  private createChatUI(): void {
    // Main container
    const mainContainer = new Rectangle("mainContainer");
    mainContainer.width = "100%";
    mainContainer.height = "100%";
    mainContainer.thickness = 0;
    mainContainer.background = "rgba(20, 20, 40, 0.95)";
    mainContainer.cornerRadius = 10;
    this.advancedTexture.addControl(mainContainer);

    // Title bar
    const titleBar = new Rectangle("titleBar");
    titleBar.width = "100%";
    titleBar.height = "60px";
    titleBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleBar.thickness = 0;
    titleBar.background = "rgba(50, 100, 200, 0.9)";
    mainContainer.addControl(titleBar);

    const titleText = new TextBlock("title", "Chat with Research Agent");
    titleText.color = "white";
    titleText.fontSize = 28;  // Larger for VR readability
    titleText.fontWeight = "bold";
    titleBar.addControl(titleText);

    // Scrollable message area
    this.scrollViewer = new ScrollViewer("messageScroll");
    this.scrollViewer.width = "95%";
    this.scrollViewer.height = "1200px";
    this.scrollViewer.top = "70px";
    this.scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.scrollViewer.thickness = 1;
    this.scrollViewer.color = "rgba(100, 100, 100, 0.5)";
    mainContainer.addControl(this.scrollViewer);

    // Message container (stack panel)
    this.messageContainer = new StackPanel("messageStack");
    this.messageContainer.width = "100%";
    this.messageContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.scrollViewer.addControl(this.messageContainer);

    // Input area container
    const inputArea = new Rectangle("inputArea");
    inputArea.width = "95%";
    inputArea.height = "120px";
    inputArea.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    inputArea.top = "-10px";
    inputArea.thickness = 1;
    inputArea.color = "rgba(100, 100, 100, 0.5)";
    inputArea.background = "rgba(30, 30, 50, 0.9)";
    mainContainer.addControl(inputArea);

    // Text input
    this.inputText = new InputText("messageInput");
    this.inputText.width = "70%";
    this.inputText.height = "70px";
    this.inputText.left = "-100px";
    this.inputText.color = "white";
    this.inputText.background = "rgba(50, 50, 70, 0.9)";
    this.inputText.focusedBackground = "rgba(70, 70, 90, 0.9)";
    this.inputText.placeholderText = "Ask me about research papers...";
    this.inputText.placeholderColor = "rgba(200, 200, 200, 0.5)";
    this.inputText.fontSize = 24;  // VR-friendly size
    this.inputText.thickness = 2;
    this.inputText.autoStretchWidth = false;
    inputArea.addControl(this.inputText);

    // Send button
    this.sendButton = Button.CreateSimpleButton("sendBtn", "Send");
    this.sendButton.width = "150px";
    this.sendButton.height = "70px";
    this.sendButton.left = "140px";
    this.sendButton.color = "white";
    this.sendButton.background = "rgba(50, 150, 50, 0.9)";
    this.sendButton.fontSize = 24;
    this.sendButton.thickness = 2;
    inputArea.addControl(this.sendButton);

    // Button hover effect
    this.sendButton.onPointerEnterObservable.add(() => {
      if (!this.isLoading) {
        this.sendButton.background = "rgba(70, 180, 70, 0.9)";
      }
    });
    this.sendButton.onPointerOutObservable.add(() => {
      if (!this.isLoading) {
        this.sendButton.background = "rgba(50, 150, 50, 0.9)";
      }
    });

    // Handle send button click
    this.sendButton.onPointerClickObservable.add(() => {
      this.sendMessage();
    });

    // Handle Enter key in input
    this.inputText.onKeyboardEventProcessedObservable.add((eventData) => {
      if (eventData.key === "Enter") {
        this.sendMessage();
      }
    });

    // Add welcome message
    this.addMessage("Agent", "Hello! I'm your research assistant. Ask me anything about biomedical research papers.", "rgba(100, 50, 200, 0.3)");
  }

  /**
   * Send message to agent API
   */
  private async sendMessage(): Promise<void> {
    const message = this.inputText.text.trim();
    if (!message || this.isLoading) return;

    // Add user message
    this.addMessage("You", message, "rgba(50, 100, 200, 0.3)");

    // Clear input
    this.inputText.text = "";

    // Set loading state
    this.isLoading = true;
    this.sendButton.textBlock!.text = "...";
    this.sendButton.background = "rgba(100, 100, 100, 0.7)";
    this.inputText.isEnabled = false;

    try {
      console.log("[ChatPanelScript] Sending message:", message);
      
      // Call the real agent API
      const response = await agentApi.sendMessage(message, this.conversationId);
      
      console.log("[ChatPanelScript] Received response:", response);

      // Store conversation ID for context
      if (response.conversation_id) {
        this.conversationId = response.conversation_id;
      }

      // Add agent response
      this.addMessage("Agent", response.message, "rgba(100, 50, 200, 0.3)");

      // Add sources if available
      if (response.sources && response.sources.length > 0) {
        const sourcesText = "\n\nSources:\n" + 
          response.sources
            .map((s, i) => `${i + 1}. ${s.title} (relevance: ${(s.relevance_score * 100).toFixed(0)}%)`)
            .join("\n");
        this.addMessage("Agent", sourcesText, "rgba(80, 40, 160, 0.2)");
      }

      // Log metadata in development
      if (response.metadata && process.env.NODE_ENV === "development") {
        console.log("[ChatPanelScript] Response metadata:", response.metadata);
      }
    } catch (error) {
      console.error("[ChatPanelScript] Error sending message:", error);
      
      // Show error message to user
      const errorMessage = error instanceof Error 
        ? `Sorry, I encountered an error: ${error.message}. Please try again.`
        : "Sorry, I couldn't process your request. Please check if the backend is running and try again.";
      
      this.addMessage("Agent", errorMessage, "rgba(200, 50, 50, 0.3)");
    } finally {
      // Reset loading state
      this.isLoading = false;
      this.sendButton.textBlock!.text = "Send";
      this.sendButton.background = "rgba(50, 150, 50, 0.9)";
      this.inputText.isEnabled = true;
    }
  }

  /**
   * Add a message to the chat panel
   * @param sender - "You" or "Agent"
   * @param text - Message text
   * @param bgColor - Background color for the message bubble
   */
  private addMessage(sender: string, text: string, bgColor: string = "rgba(50, 50, 70, 0.5)"): void {
    const messageContainer = new Rectangle("msg-" + Date.now());
    messageContainer.width = "95%";
    messageContainer.height = "auto";
    messageContainer.thickness = 1;
    messageContainer.color = "rgba(100, 100, 100, 0.3)";
    messageContainer.background = bgColor;
    messageContainer.cornerRadius = 5;
    messageContainer.paddingTop = "15px";
    messageContainer.paddingBottom = "15px";
    messageContainer.paddingLeft = "15px";
    messageContainer.paddingRight = "15px";
    messageContainer.adaptHeightToChildren = true;

    const messageStack = new StackPanel();
    messageStack.width = "100%";
    messageStack.adaptHeightToChildren = true;
    messageContainer.addControl(messageStack);

    // Sender name
    const senderText = new TextBlock("sender", sender);
    senderText.height = "30px";
    senderText.color = "rgba(200, 200, 255, 1)";
    senderText.fontSize = 20;
    senderText.fontWeight = "bold";
    senderText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    messageStack.addControl(senderText);

    // Message text (word wrap enabled)
    const messageText = new TextBlock("text", text);
    messageText.color = "white";
    messageText.fontSize = 24;  // VR-friendly size
    messageText.textWrapping = true;
    messageText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    messageText.resizeToFit = true;
    messageText.lineSpacing = "5px";
    messageStack.addControl(messageText);

    this.messageContainer.addControl(messageContainer);

    // Store message
    this.messages.push({ sender, text });

    // Auto-scroll to bottom
    setTimeout(() => {
      this.scrollViewer.verticalBar.value = 1;
    }, 100);
  }

  /**
   * Called every frame - can be used for updates if needed
   */
  public onUpdate(): void {
    // Currently not needed for chat panel
    // Could be used for animations or status updates
  }

  /**
   * Called when scene is disposed
   */
  public onStop(): void {
    console.log("[ChatPanelScript] Stopping and cleaning up");
    
    // Clean up resources
    if (this.advancedTexture) {
      this.advancedTexture.dispose();
    }
  }

  /**
   * Public API - get the mesh this script is attached to
   */
  public getMesh(): Mesh {
    return this.mesh;
  }
}
