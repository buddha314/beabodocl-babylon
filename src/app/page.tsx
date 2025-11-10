"use client";

import { useEffect, useRef } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { InputText } from "@babylonjs/gui/2D/controls/inputText";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { StackPanel } from "@babylonjs/gui/2D/controls/stackPanel";
import { ScrollViewer } from "@babylonjs/gui/2D/controls/scrollViewers/scrollViewer";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Physics";

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const engine = new Engine(canvasRef.current, true, {
			stencil: true,
			antialias: true,
			audioEngine: true,
			adaptToDeviceRatio: true,
			disableWebGL2Support: false,
			useHighPrecisionFloats: true,
			powerPreference: "high-performance",
			failIfMajorPerformanceCaveat: false,
		});

		const scene = new Scene(engine);

		handleLoad(engine, scene);

		let listener: () => void;
		window.addEventListener("resize", listener = () => {
			engine.resize();
		});

		return () => {
			scene.dispose();
			engine.dispose();

			window.removeEventListener("resize", listener);
		};
	}, [canvasRef]);

	async function handleLoad(engine: Engine, scene: Scene) {
		console.log("🚀 [INIT] Starting programmatic scene creation...");
		
		try {
			// Initialize physics
			console.log("⚙️ [PHYSICS] Loading Havok physics engine...");
			const havok = await HavokPhysics();
			scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havok));
			console.log("✅ [PHYSICS] Havok physics enabled");

			// Set background color
			scene.clearColor = new Color4(0.05, 0.08, 0.12, 1); // Dark cyberpunk blue

			// Create camera at VR eye height
			console.log("📷 [CAMERA] Creating camera...");
			const camera = new UniversalCamera("camera", new Vector3(0, 1.6, 0), scene); // Start at center
			camera.setTarget(new Vector3(0, 1.6, -5)); // Look toward chat panel (negative Z)
			camera.attachControl(engine.getRenderingCanvas(), true);
			camera.speed = 0.5;
			camera.minZ = 0.1;
			camera.maxZ = 1000;
			camera.keysUp = [87]; // W
			camera.keysDown = [83]; // S
			camera.keysLeft = [65]; // A
			camera.keysRight = [68]; // D
			console.log("✅ [CAMERA] Camera created at VR eye height");

			// Create lighting
			console.log("� [LIGHTS] Creating lights...");
			const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
			light.intensity = 0.7;
			console.log("✅ [LIGHTS] Hemispheric light created");

			// Create ground
			console.log("🌍 [GROUND] Creating ground...");
			const ground = MeshBuilder.CreateGround("ground", {
				width: 100,
				height: 100,
				subdivisions: 10
			}, scene);
			
			const groundMat = new StandardMaterial("groundMat", scene);
			groundMat.diffuseColor = new Color3(0.15, 0.15, 0.2); // Darker cyberpunk floor
			groundMat.specularColor = new Color3(0.1, 0.1, 0.1);
			ground.material = groundMat;
			ground.receiveShadows = true;
			
			// Add physics to ground (Physics v2)
			new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0.5 }, scene);
			console.log("✅ [GROUND] Ground created with physics");

			// Create hexagonal room
			console.log("🏠 [ROOM] Creating hexagonal room...");
			const roomRadius = 15; // Distance from center to each vertex
			const wallHeight = 6;
			const wallThickness = 0.3;
			
			// Create 6 walls in hexagon pattern
			const wallMaterial = new StandardMaterial("wallMat", scene);
			wallMaterial.diffuseColor = new Color3(0.2, 0.25, 0.35); // Cyberpunk blue-grey
			wallMaterial.specularColor = new Color3(0.3, 0.4, 0.5);
			wallMaterial.emissiveColor = new Color3(0.05, 0.08, 0.12); // Slight glow
			
			const walls = [];
			
			// Create hexagon vertices (6 corners)
			// Start with vertex at top (negative Z), go clockwise
			const vertices = [];
			for (let i = 0; i < 6; i++) {
				const angle = (Math.PI / 3) * i - (Math.PI / 2); // Start at top (-Z), rotate clockwise
				vertices.push({
					x: Math.cos(angle) * roomRadius,
					z: Math.sin(angle) * roomRadius
				});
			}
			
			// Create walls between consecutive vertices
			for (let i = 0; i < 6; i++) {
				const v1 = vertices[i];
				const v2 = vertices[(i + 1) % 6]; // Next vertex (wrap around)
				
				// Calculate wall center position
				const centerX = (v1.x + v2.x) / 2;
				const centerZ = (v1.z + v2.z) / 2;
				
				// Calculate wall length
				const wallLength = Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.z - v1.z, 2));
				
				// Calculate wall rotation (angle from v1 to v2)
				const wallAngle = Math.atan2(v2.z - v1.z, v2.x - v1.x) + Math.PI / 2;
				
				// Create wall
				const wall = MeshBuilder.CreateBox(`wall${i}`, {
					width: wallLength,
					height: wallHeight,
					depth: wallThickness
				}, scene);
				
				wall.position = new Vector3(centerX, wallHeight / 2, centerZ);
				wall.rotation.y = wallAngle;
				wall.material = wallMaterial;
				
				// Add physics collider (Physics v2)
				new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3 }, scene);
				
				walls.push(wall);
				
				console.log(`  Wall ${i}: pos=(${centerX.toFixed(2)}, ${centerZ.toFixed(2)}), length=${wallLength.toFixed(2)}, angle=${(wallAngle * 180 / Math.PI).toFixed(1)}°`);
			}
			
			// Create ceiling
			const ceiling = MeshBuilder.CreateDisc("ceiling", {
				radius: roomRadius * 1.1,
				tessellation: 6 // Hexagonal
			}, scene);
			ceiling.position.y = wallHeight;
			ceiling.rotation.x = Math.PI / 2; // Face downward
			
			const ceilingMat = new StandardMaterial("ceilingMat", scene);
			ceilingMat.diffuseColor = new Color3(0.1, 0.12, 0.18);
			ceilingMat.emissiveColor = new Color3(0.02, 0.03, 0.05);
			ceiling.material = ceilingMat;
			
			console.log("✅ [ROOM] Hexagonal room created with 6 walls and ceiling");

			// Create chat panel on one wall
			console.log("💬 [CHAT] Creating chat panel...");
			
			// Position chat panel directly in front of camera (negative Z)
			const chatPanelDistance = 7; // A few feet in front of user
			
			const chatPanel = MeshBuilder.CreatePlane("chatPanel", {
				width: 6,
				height: 4
			}, scene);
			
			chatPanel.position = new Vector3(
				0,
				2.5, // Eye level
				-chatPanelDistance
			);
			chatPanel.rotation.y = Math.PI; // Rotate 180 degrees to face camera (positive Z direction)
			
			// Create chat UI texture
			const chatTexture = AdvancedDynamicTexture.CreateForMesh(chatPanel, 1024, 768);
			
			// Background
			const background = new StackPanel();
			background.width = "100%";
			background.height = "100%";
			background.background = "rgba(10, 15, 25, 0.95)";
			background.paddingTop = "20px";
			background.paddingBottom = "20px";
			background.paddingLeft = "20px";
			background.paddingRight = "20px";
			chatTexture.addControl(background);
			
			// Title
			const title = new TextBlock();
			title.text = "AI Chat Interface";
			title.color = "#00ffff";
			title.fontSize = 48;
			title.height = "60px";
			title.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
			title.paddingBottom = "10px";
			background.addControl(title);
			
			// Chat messages area (scrollable)
			const messagesScroller = new ScrollViewer();
			messagesScroller.width = "100%";
			messagesScroller.height = "500px";
			messagesScroller.thickness = 2;
			messagesScroller.color = "#00ffff";
			messagesScroller.background = "rgba(5, 8, 15, 0.8)";
			messagesScroller.paddingTop = "10px";
			messagesScroller.paddingBottom = "10px";
			background.addControl(messagesScroller);
			
			const messagesPanel = new StackPanel();
			messagesPanel.width = "100%";
			messagesPanel.paddingLeft = "10px";
			messagesPanel.paddingRight = "10px";
			messagesScroller.addControl(messagesPanel);
			
			// Welcome message
			const welcomeMsg = new TextBlock();
			welcomeMsg.text = "Welcome to the AI Assistant!\nEnter a message below to start chatting.";
			welcomeMsg.color = "#88ccff";
			welcomeMsg.fontSize = 24;
			welcomeMsg.height = "80px";
			welcomeMsg.textWrapping = true;
			welcomeMsg.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
			welcomeMsg.paddingBottom = "10px";
			messagesPanel.addControl(welcomeMsg);
			
			// Input area
			const inputPanel = new StackPanel();
			inputPanel.width = "100%";
			inputPanel.height = "180px";
			inputPanel.isVertical = true; // Stack vertically, not horizontally
			inputPanel.paddingTop = "10px";
			background.addControl(inputPanel);
			
			// Text input
			const input = new InputText();
			input.width = "100%";
			input.height = "70px";
			input.color = "#ffffff";
			input.background = "rgba(20, 30, 45, 0.9)";
			input.focusedBackground = "rgba(30, 45, 70, 0.9)";
			input.placeholderText = "Type your message...";
			input.placeholderColor = "#666";
			input.fontSize = 24;
			input.thickness = 2;
			input.paddingLeft = "10px";
			input.paddingRight = "10px";
			input.paddingBottom = "10px";
			inputPanel.addControl(input);
			
			// Send button
			const sendButton = Button.CreateSimpleButton("sendBtn", "Send");
			sendButton.width = "100%";
			sendButton.height = "70px";
			sendButton.color = "#00ffff";
			sendButton.background = "rgba(0, 100, 150, 0.8)";
			sendButton.fontSize = 28;
			sendButton.thickness = 2;
			sendButton.onPointerEnterObservable.add(() => {
				sendButton.background = "rgba(0, 150, 200, 0.9)";
			});
			sendButton.onPointerOutObservable.add(() => {
				sendButton.background = "rgba(0, 100, 150, 0.8)";
			});
			sendButton.onPointerClickObservable.add(async () => {
				const message = input.text.trim();
				if (message) {
					// Add user message to chat
					const userMsg = new TextBlock();
					userMsg.text = `You: ${message}`;
					userMsg.color = "#00ff88";
					userMsg.fontSize = 22;
					userMsg.height = "40px";
					userMsg.textWrapping = true;
					userMsg.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
					userMsg.paddingTop = "5px";
					userMsg.paddingBottom = "5px";
					messagesPanel.addControl(userMsg);
					
					// Clear input
					input.text = "";
					
					// TODO: Send to backend API
					console.log("📤 [CHAT] Message sent:", message);
					
					// Simulate AI response (placeholder)
					setTimeout(() => {
						const aiMsg = new TextBlock();
						aiMsg.text = `AI: I received your message: "${message}"\n(Backend integration pending)`;
						aiMsg.color = "#00ccff";
						aiMsg.fontSize = 22;
						aiMsg.height = "60px";
						aiMsg.textWrapping = true;
						aiMsg.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
						aiMsg.paddingTop = "5px";
						aiMsg.paddingBottom = "10px";
						messagesPanel.addControl(aiMsg);
						
						// Auto-scroll to bottom
						messagesScroller.verticalBar.value = 1;
					}, 500);
				}
			});
			inputPanel.addControl(sendButton);
			
			console.log("✅ [CHAT] Chat panel created with UI");

			// Create a simple box for reference
			console.log("� [OBJECTS] Creating reference objects...");
			const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
			box.position = new Vector3(0, 2, 0);
			
			const boxMat = new StandardMaterial("boxMat", scene);
			boxMat.diffuseColor = new Color3(0.8, 0.2, 0.2);
			box.material = boxMat;
			
			// Add physics to box (Physics v2)
			new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1, restitution: 0.5 }, scene);
			console.log("✅ [OBJECTS] Reference box created");

			// Initialize WebXR
			console.log("🥽 [VR] Initializing WebXR...");
			try {
				const xr = await WebXRDefaultExperience.CreateAsync(scene, {
					floorMeshes: [ground]
				});
				console.log("✅ [VR] WebXR initialized successfully");
			} catch (error) {
				console.warn("⚠️ [VR] WebXR not available (requires HTTPS or localhost):", error);
			}

			// Log scene summary
			console.log("📊 [SCENE] Scene summary:");
			console.log("  - Cameras:", scene.cameras.length, scene.cameras.map(c => `${c.name} (${c.getClassName()})`));
			console.log("  - Meshes:", scene.meshes.length, "meshes");
			console.log("  - Lights:", scene.lights.length, scene.lights.map(l => l.name));
			console.log("  - Materials:", scene.materials.length, "materials");
			console.log("  - Active camera:", scene.activeCamera?.name || "NONE");

			// Enable Babylon.js Inspector for manual editing
			// Press Ctrl+Alt+I (Windows) or Cmd+Alt+I (Mac) to open
			console.log("🔧 [INSPECTOR] Press Ctrl+Alt+I to open Babylon.js Inspector for manual scene editing");
			window.addEventListener("keydown", (event) => {
				if (event.ctrlKey && event.altKey && event.key === "i") {
					if (scene.debugLayer.isVisible()) {
						scene.debugLayer.hide();
					} else {
						scene.debugLayer.show();
					}
				}
			});

			// Start render loop
			console.log("🎬 [RENDER] Starting render loop...");
			let frameCount = 0;
			engine.runRenderLoop(() => {
				scene.render();
				
				// Log first few frames for debugging
				if (frameCount < 3) {
					frameCount++;
					console.log(`🎬 [RENDER] Frame ${frameCount} rendered`);
				}
			});
			
			console.log("✅ [INIT] Scene creation complete!");
			
		} catch (error) {
			console.error("❌ [ERROR] Failed to create scene:", error);
			if (error instanceof Error) {
				console.error("❌ [ERROR] Message:", error.message);
				console.error("❌ [ERROR] Stack:", error.stack);
			}
		}
	}

	return (
		<main className="flex w-screen h-screen flex-col items-center justify-between">
			<canvas
				ref={canvasRef}
				className="w-full h-full outline-none select-none"
			/>
		</main>
	);
}
