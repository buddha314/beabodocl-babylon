import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { IScript, visibleAsNumber, visibleAsBoolean } from "babylonjs-editor-tools";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import { WebXRInputSource } from "@babylonjs/core/XR/webXRInputSource";

/**
 * VR Movement Script - Enables VR locomotion with strafing
 *
 * Attach to any node in the scene (can be a dummy transform node)
 * Will automatically initialize when WebXR session starts
 * 
 * Provides smooth locomotion with full directional control using the
 * left joystick on VR controllers.
 */
export default class VRMovementScript implements IScript {
  // Editable properties in Babylon Editor Inspector
  @visibleAsNumber("Movement Speed (m/s)", { min: 0, max: 10 })
  private movementSpeed: number = 2.0;

  @visibleAsNumber("Joystick Deadzone", { min: 0, max: 0.5 })
  private deadzone: number = 0.15;

  @visibleAsBoolean("Enabled")
  private enabled: boolean = true;

  // Private properties
  private scene!: Scene;
  private xrHelper?: WebXRDefaultExperience;

  /**
   * Constructor - receives the node this script is attached to
   */
  public constructor(public node: TransformNode) {}

  /**
   * Called when scene starts
   */
  public onStart(): void {
    this.scene = this.node.getScene();
    
    console.log("[VRMovementScript] Script initialized on node:", this.node.name);
    console.log("[VRMovementScript] Settings - Speed:", this.movementSpeed, "Deadzone:", this.deadzone);

    // Store a reference in scene metadata so page.tsx can initialize us with WebXR
    const metadata = this.scene.metadata || {};
    metadata.vrMovementScript = this;
    this.scene.metadata = metadata;

    console.log("[VRMovementScript] Ready, waiting for WebXR initialization");
  }

  /**
   * Initialize VR movement controls
   * Called from page.tsx after WebXR is created
   */
  public initializeWithXR(xrHelper: WebXRDefaultExperience): void {
    console.log("[VRMovementScript] Initializing with WebXR");
    this.xrHelper = xrHelper;
    this.setupMovementControls();
  }

  /**
   * Set up movement controls for VR controllers
   */
  private setupMovementControls(): void {
    if (!this.xrHelper) {
      console.error("[VRMovementScript] Cannot setup controls - XR helper not available");
      return;
    }

    // Listen for controllers being added
    this.xrHelper.input.onControllerAddedObservable.add((controller) => {
      if (controller.inputSource.handedness === "left") {
        console.log("[VRMovementScript] Left controller detected, attaching movement");
        this.attachMovementToController(controller);
      }
    });

    console.log("[VRMovementScript] Movement controls setup complete");
  }

  /**
   * Attach movement logic to the left controller
   */
  private attachMovementToController(controller: WebXRInputSource): void {
    const motionController = controller.motionController;
    if (!motionController) {
      console.warn("[VRMovementScript] Motion controller not available");
      return;
    }

    // Get thumbstick component (standard XR input)
    const thumbstick = motionController.getComponent("xr-standard-thumbstick");
    if (!thumbstick) {
      console.warn("[VRMovementScript] Thumbstick component not found on left controller");
      return;
    }

    console.log("[VRMovementScript] Left thumbstick attached successfully");

    // Update movement every frame
    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.enabled || !this.xrHelper) return;

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
  private applyMovement(xInput: number, yInput: number): void {
    // Apply deadzone to prevent joystick drift
    if (Math.abs(xInput) < this.deadzone) xInput = 0;
    if (Math.abs(yInput) < this.deadzone) yInput = 0;

    // No movement if both inputs are zero
    if (xInput === 0 && yInput === 0) return;

    if (!this.xrHelper) return;

    const camera = this.xrHelper.baseExperience.camera;
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
   * Called every frame - movement is handled via observables
   */
  public onUpdate(): void {
    // Movement is handled via scene.onBeforeRenderObservable, not in update loop
  }

  /**
   * Called when scene is disposed
   */
  public onStop(): void {
    console.log("[VRMovementScript] Stopping");
    this.enabled = false;
  }

  /**
   * Public API - Set movement speed
   */
  public setSpeed(speed: number): void {
    this.movementSpeed = Math.max(0, speed);
    console.log("[VRMovementScript] Movement speed set to:", this.movementSpeed);
  }

  /**
   * Public API - Get movement speed
   */
  public getSpeed(): number {
    return this.movementSpeed;
  }

  /**
   * Public API - Enable/disable movement
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log("[VRMovementScript] Movement enabled:", this.enabled);
  }

  /**
   * Public API - Check if movement is enabled
   */
  public isMovementEnabled(): boolean {
    return this.enabled;
  }
}
