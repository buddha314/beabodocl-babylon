"use client";

import { useEffect, useRef, useState } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Lights/hemisphericLight";
import "@babylonjs/core/Materials/standardMaterial";

import ApiTest from "@/components/ApiTest";
import AgentChatTest from "@/components/AgentChatTest";
import { SceneErrorBoundary } from "@/components/ErrorBoundary";

// Debug mode controlled by environment variable
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

/**
 * Creates a minimal test scene for verifying basic rendering functionality.
 * Used for debugging when scene loading from Babylon Editor is disabled.
 * 
 * @param scene - The Babylon.js scene to populate
 * @returns Promise that resolves when test scene is created
 */
async function createTestScene(scene: Scene): Promise<void> {
	const { MeshBuilder } = await import("@babylonjs/core/Meshes/meshBuilder");
	const { StandardMaterial } = await import("@babylonjs/core/Materials/standardMaterial");
	const { Color3 } = await import("@babylonjs/core/Maths/math.color");
	const { UniversalCamera } = await import("@babylonjs/core/Cameras/universalCamera");
	const { HemisphericLight } = await import("@babylonjs/core/Lights/hemisphericLight");
	
	// Create camera
	const testCamera = new UniversalCamera("testCamera", new Vector3(0, 2, -10), scene);
	testCamera.setTarget(Vector3.Zero());
	scene.activeCamera = testCamera;
	testCamera.attachControl();
	
	// Create light
	const testLight = new HemisphericLight("testLight", new Vector3(0, 1, 0), scene);
	testLight.intensity = 1;
	
	// Create test mesh (red box)
	const testBox = MeshBuilder.CreateBox("testBox", { size: 2 }, scene);
	testBox.position = Vector3.Zero();
	const material = new StandardMaterial("testMaterial", scene);
	material.diffuseColor = new Color3(1, 0, 0);
	material.emissiveColor = new Color3(1, 0, 0);
	testBox.material = material;
	
	if (DEBUG_MODE) {
		console.log("✅ Test scene created: Camera at [0,2,-10], Red box at origin");
	}
}

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isInVR, setIsInVR] = useState(false);

	useEffect(() => {
		if (!canvasRef.current) {
			console.error("❌ Canvas element not found");
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
		
		if (DEBUG_MODE) {
			console.log("✅ Engine initialized (WebGL", engine.webGLVersion + ")");
		}

		handleLoad(engine, scene);

		const resizeListener = () => engine.resize();
		window.addEventListener("resize", resizeListener);

		return () => {
			scene.dispose();
			engine.dispose();
			window.removeEventListener("resize", resizeListener);
		};
	}, [canvasRef]);

	async function handleLoad(engine: Engine, scene: Scene) {
		try {
			if (DEBUG_MODE) {
				console.log("🧪 Creating test scene (scene loader disabled for debugging)");
			}
			
			// Create minimal test scene
			await createTestScene(scene);
			
			// Start render loop
			engine.runRenderLoop(() => {
				scene.render();
			});
			
			if (DEBUG_MODE) {
				console.log("✅ Test scene initialized and rendering");
			}
			
			// TODO: Re-enable scene loading from Babylon Editor
			// Uncomment the following lines when ready to debug scene loader:
			/*
			const havok = await HavokPhysics();
			await loadScene("./scene/", "config.json", scene, scriptsMap);
			scene.enablePhysics(new Vector3(0, -981, 0), new HavokPlugin(true, havok));
			if (scene.activeCamera) {
				scene.activeCamera.attachControl();
			}
			const ground = scene.getMeshByName("ground");
			const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
				floorMeshes: ground ? [ground] : [],
				optionalFeatures: true,
			});
			xrHelper.baseExperience.onStateChangedObservable.add((state) => {
				setIsInVR(state === 2);
			});
			*/
			
		} catch (error) {
			console.error("Failed to initialize scene:", error);
			throw error;
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