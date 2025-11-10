"use client";

import { useEffect, useRef, useState } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import "@babylonjs/core/Cameras/universalCamera";

import "@babylonjs/core/Meshes/groundMesh";

import "@babylonjs/core/Lights/directionalLight";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/standardMaterial";

// WebXR imports
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import "@babylonjs/core/XR/features/WebXRDepthSensing";

import "@babylonjs/core/Helpers/sceneHelpers";

import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";

import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";

import "@babylonjs/core/Physics";

import "@babylonjs/materials/sky";

import { loadScene } from "babylonjs-editor-tools";

/**
 * We import the map of all scripts attached to objects in the editor.
 * This will allow the loader from `babylonjs-editor-tools` to attach the scripts to the
 * loaded objects (scene, meshes, transform nodes, lights, cameras, etc.).
 */
import { scriptsMap } from "@/scripts";
import ApiTest from "@/components/ApiTest";
import AgentChatTest from "@/components/AgentChatTest";
import { SceneErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isInVR, setIsInVR] = useState(false);

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
		try {
			console.log("==============================================");
			console.log("PHASE 4: Loading scene from Babylon Editor");
			console.log("==============================================");
			
			const havok = await HavokPhysics();
			
			// Load the scene from Babylon Editor
			// This modifies the scene object in-place
			console.log("Loading scene from ./scene/");
			console.log("Scripts map:", Object.keys(scriptsMap));
			
			await loadScene("./scene/", "config.json", scene, scriptsMap);
			
			console.log("Scene loaded successfully!");
			console.log("Cameras:", scene.cameras.map(c => `${c.name} (${c.getClassName()})`));
			console.log("Lights:", scene.lights.map(l => `${l.name} (${l.getClassName()})`));
			console.log("Meshes:", scene.meshes.map(m => m.name));
			console.log("Active Camera:", scene.activeCamera?.name || "none");
			console.log("==============================================");
			
			// Enable physics
			scene.enablePhysics(new Vector3(0, -981, 0), new HavokPlugin(true, havok));
			
			// Attach camera controls
			if (scene.activeCamera) {
				scene.activeCamera.attachControl();
				console.log("✅ Camera controls attached");
			} else {
				console.warn("⚠️ No active camera found");
			}
			
			// Get the ground mesh for WebXR floor configuration
			const ground = scene.getMeshByName("ground");
			if (ground) {
				console.log("✅ Ground mesh found for WebXR");
			} else {
				console.warn("⚠️ Ground mesh not found - WebXR may not have floor mesh");
			}

			// Initialize WebXR with default experience
			try {
				const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
					floorMeshes: ground ? [ground] : [],
					optionalFeatures: true,
				});

				console.log("WebXR initialized successfully");

				// Initialize VR Movement Script if it exists in the scene
				// The script stores itself in scene.metadata when it loads
				const vrMovementScript = scene.metadata?.vrMovementScript;
				if (vrMovementScript && typeof vrMovementScript.initializeWithXR === 'function') {
					vrMovementScript.initializeWithXR(xrHelper);
					console.log("✅ VR Movement Script initialized with WebXR");
				} else {
					console.warn("⚠️ VR Movement Script not found in scene - attach vrMovement.ts to a node in the editor");
				}

				// CRITICAL: Make sure the chat panel mesh is in the pointer selection meshes
				if (xrHelper.pointerSelection) {
					xrHelper.pointerSelection.attach();
					console.log("VR controller pointer selection enabled");
				}

				// Log when entering/exiting XR
				xrHelper.baseExperience.onStateChangedObservable.add((state) => {
					console.log("WebXR state changed:", state);
					if (state === 2) { // IN_XR
						setIsInVR(true);
						console.log("==============================================");
						console.log("ENTERED VR MODE");
						console.log("==============================================");
						console.log("Chat Panel Controls:");
						console.log("- Point controller at panel");
						console.log("- Pull trigger to click buttons/type");
						console.log("- Use virtual keyboard to type messages");
						console.log("");
						console.log("Movement Controls:");
						console.log("- Left joystick: Y-axis = Forward/Back");
						console.log("- Left joystick: X-axis = Strafe Left/Right");
						console.log("==============================================");
					} else {
						setIsInVR(false);
					}
				});
			} catch (error) {
				console.warn("WebXR not supported or failed to initialize:", error);
			}

			engine.runRenderLoop(() => {
				scene.render();
			});
		} catch (error) {
			console.error("Failed to initialize 3D scene:", error);
			throw error; // Re-throw to be caught by error boundary
		}
	}

	return (
		<main className="flex w-screen h-screen flex-col items-center justify-between">
		<SceneErrorBoundary>
			<canvas
				ref={canvasRef}
				className="w-full h-full outline-none select-none"
			/>
		</SceneErrorBoundary>
		{!isInVR && (
			<>
				<ApiTest />
				<AgentChatTest />
			</>
		)}
	</main>
	);
}