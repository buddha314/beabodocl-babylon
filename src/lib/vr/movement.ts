/**
 * VR Movement System
 * 
 * Provides smooth locomotion with full directional control (strafing)
 * using the left joystick on VR controllers.
 */

import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import { WebXRInputSource } from "@babylonjs/core/XR/webXRInputSource";

export class VRMovementSystem {
    private movementSpeed = 2.0; // meters per second
    private readonly DEADZONE = 0.15; // Joystick deadzone to prevent drift
    private isEnabled = true;

    constructor(
        private scene: Scene,
        private xr: WebXRDefaultExperience
    ) {
        this.setupMovementControls();
    }

    /**
     * Set up movement controls for VR controllers
     */
    private setupMovementControls() {
        // Listen for controllers being added
        this.xr.input.onControllerAddedObservable.add((controller) => {
            if (controller.inputSource.handedness === "left") {
                this.attachMovementToController(controller);
            }
        });
    }

    /**
     * Attach movement logic to the left controller
     */
    private attachMovementToController(controller: WebXRInputSource) {
        const motionController = controller.motionController;
        if (!motionController) {
            console.warn("Motion controller not available");
            return;
        }

        // Get thumbstick component (standard XR input)
        const thumbstick = motionController.getComponent("xr-standard-thumbstick");
        if (!thumbstick) {
            console.warn("Thumbstick component not found on left controller");
            return;
        }

        console.log("VR Movement: Left thumbstick attached");

        // Update movement every frame
        this.scene.onBeforeRenderObservable.add(() => {
            if (!this.isEnabled) return;
            
            if (thumbstick.axes) {
                const xAxis = thumbstick.axes.x; // Left/Right strafe
                const yAxis = thumbstick.axes.y; // Forward/Backward
                
                this.applyMovement(xAxis, yAxis);
            }
        });
    }

    /**
     * Apply movement based on joystick input
     * @param xInput Left/Right axis (-1 to 1)
     * @param yInput Forward/Backward axis (-1 to 1)
     */
    private applyMovement(xInput: number, yInput: number) {
        // Apply deadzone to prevent joystick drift
        if (Math.abs(xInput) < this.DEADZONE) xInput = 0;
        if (Math.abs(yInput) < this.DEADZONE) yInput = 0;

        // No movement if both inputs are zero
        if (xInput === 0 && yInput === 0) return;

        const camera = this.xr.baseExperience.camera;
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

        // Get camera forward direction (projected on XZ plane for horizontal movement)
        const forward = camera.getForwardRay().direction.clone();
        forward.y = 0; // Remove vertical component to keep movement horizontal
        forward.normalize();

        // Get camera right direction (perpendicular to forward)
        const right = Vector3.Cross(Vector3.Up(), forward).normalize();

        // Calculate movement vector combining forward/back and strafe
        const moveVector = forward.scale(-yInput) // Forward/backward (Y axis inverted)
            .add(right.scale(xInput)); // Left/right strafe (X axis)

        // Apply movement with speed scaling
        const speed = this.movementSpeed * deltaTime;
        camera.position.addInPlace(moveVector.scale(speed));
    }

    /**
     * Set the movement speed in meters per second
     */
    public setSpeed(speed: number) {
        this.movementSpeed = Math.max(0, speed);
    }

    /**
     * Get the current movement speed
     */
    public getSpeed(): number {
        return this.movementSpeed;
    }

    /**
     * Enable or disable movement
     */
    public setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    /**
     * Check if movement is enabled
     */
    public isMovementEnabled(): boolean {
        return this.isEnabled;
    }

    /**
     * Clean up resources
     */
    public dispose() {
        // Observers are automatically cleaned up with scene disposal
        this.isEnabled = false;
    }
}
