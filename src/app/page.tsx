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
import "@babylonjs/core/Lights/hemisphericLight";
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
			console.error("❌ Canvas ref is null!");
			return;
		}

		console.log("✅ Canvas element exists");
		console.log("   Canvas size:", canvasRef.current.width, "x", canvasRef.current.height);

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

		console.log("✅ Engine created");
		console.log("   WebGL version:", engine.webGLVersion);
		console.log("   Hardware scaling:", engine.getHardwareScalingLevel());

		const scene = new Scene(engine);
		console.log("✅ Scene created");

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
			
			// FIRST: Test basic rendering before loading the scene
			console.log("🧪 BASIC RENDERING TEST - Creating simple scene...");
			const { MeshBuilder } = await import("@babylonjs/core/Meshes/meshBuilder");
			const { StandardMaterial } = await import("@babylonjs/core/Materials/standardMaterial");
			const { Color3 } = await import("@babylonjs/core/Maths/math.color");
			const { UniversalCamera } = await import("@babylonjs/core/Cameras/universalCamera");
			const { HemisphericLight } = await import("@babylonjs/core/Lights/hemisphericLight");
			
			// Create a simple camera
			const testCamera = new UniversalCamera("testCamera", new Vector3(0, 2, -10), scene);
			testCamera.setTarget(Vector3.Zero());
			scene.activeCamera = testCamera;
			testCamera.attachControl();
			console.log("✅ Test camera created at [0, 2, -10] looking at origin");
			
			// Create a simple light
			const testLight = new HemisphericLight("testLight", new Vector3(0, 1, 0), scene);
			testLight.intensity = 1;
			console.log("✅ Test light created");
			
			// Create a simple box
			const simpleBox = MeshBuilder.CreateBox("simpleBox", { size: 2 }, scene);
			simpleBox.position = new Vector3(0, 0, 0);
			const simpleMat = new StandardMaterial("simpleMat", scene);
			simpleMat.diffuseColor = new Color3(1, 0, 0); // Red
			simpleMat.emissiveColor = new Color3(1, 0, 0); // Bright red, self-lit
			simpleBox.material = simpleMat;
			console.log("✅ Simple red box created at origin");
			
			// Start rendering immediately
			console.log("🔄 Starting test render loop...");
			engine.runRenderLoop(() => {
				scene.render();
			});
			console.log("✅ Test render loop started");
			console.log("🎥 Active camera:", scene.activeCamera?.name);
			console.log("==============================================");
			console.log("⚠️ STOPPING HERE - If you see a red box, basic rendering works!");
			console.log("⚠️ Check the browser window now.");
			console.log("==============================================");
			
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