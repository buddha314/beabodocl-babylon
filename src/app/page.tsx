"use client";

import { useEffect, useRef } from "react";

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";

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
			scene.clearColor = new Color4(0.2, 0.2, 0.3, 1);

			// Create camera at VR eye height
			console.log("� [CAMERA] Creating camera...");
			const camera = new UniversalCamera("camera", new Vector3(0, 1.6, -5), scene);
			camera.setTarget(new Vector3(0, 1.6, 0));
			camera.attachControl();
			camera.speed = 0.5;
			camera.minZ = 0.1;
			camera.maxZ = 1000;
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
			groundMat.diffuseColor = new Color3(0.3, 0.4, 0.3);
			groundMat.specularColor = new Color3(0.1, 0.1, 0.1);
			ground.material = groundMat;
			ground.receiveShadows = true;
			
			// Add physics to ground
			ground.physicsImpostor = new (await import("@babylonjs/core/Physics/physicsImpostor")).PhysicsImpostor(
				ground,
				(await import("@babylonjs/core/Physics/physicsImpostor")).PhysicsImpostor.BoxImpostor,
				{ mass: 0, restitution: 0.5 },
				scene
			);
			console.log("✅ [GROUND] Ground created with physics");

			// Create a simple box for reference
			console.log("� [OBJECTS] Creating reference objects...");
			const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
			box.position = new Vector3(0, 2, 0);
			
			const boxMat = new StandardMaterial("boxMat", scene);
			boxMat.diffuseColor = new Color3(0.8, 0.2, 0.2);
			box.material = boxMat;
			
			// Add physics to box
			box.physicsImpostor = new (await import("@babylonjs/core/Physics/physicsImpostor")).PhysicsImpostor(
				box,
				(await import("@babylonjs/core/Physics/physicsImpostor")).PhysicsImpostor.BoxImpostor,
				{ mass: 1, restitution: 0.5 },
				scene
			);
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
