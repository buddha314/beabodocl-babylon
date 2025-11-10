import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { IScript, visibleAsNumber, visibleAsBoolean } from "babylonjs-editor-tools";
import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

/**
 * NavMesh Script - Creates navigation mesh for collision detection
 *
 * Attach to a mesh that defines the walkable area (typically ground or floor mesh)
 * Generates a navigation mesh that VR movement can use for collision detection
 * 
 * Usage in Babylon Editor:
 * 1. Create or select your ground/floor mesh
 * 2. Attach this script to the mesh
 * 3. Configure cell size and other parameters in inspector
 * 4. NavMesh will be generated on scene start
 */
export default class NavMeshScript implements IScript {
  // Editable properties in Babylon Editor Inspector
  @visibleAsNumber("Cell Size", { min: 0.1, max: 2.0 })
  private cellSize: number = 0.2;

  @visibleAsNumber("Cell Height", { min: 0.1, max: 2.0 })
  private cellHeight: number = 0.2;

  @visibleAsNumber("Agent Height", { min: 0.5, max: 3.0 })
  private agentHeight: number = 1.7;

  @visibleAsNumber("Agent Radius", { min: 0.1, max: 1.0 })
  private agentRadius: number = 0.4;

  @visibleAsNumber("Agent Max Slope (degrees)", { min: 0, max: 60 })
  private agentMaxSlope: number = 45;

  @visibleAsBoolean("Debug Visualization")
  private showDebug: boolean = false;

  // Private properties
  private scene!: Scene;
  private navigationPlugin?: RecastJSPlugin;
  private debugMesh?: Mesh;

  /**
   * Constructor - receives the mesh this script is attached to
   */
  public constructor(public mesh: Mesh) {}

  /**
   * Called when scene starts
   */
  public async onStart(): Promise<void> {
    this.scene = this.mesh.getScene();
    
    console.log("[NavMeshScript] Initializing navigation mesh on:", this.mesh.name);

    try {
      await this.initializeNavMesh();
      console.log("[NavMeshScript] Navigation mesh ready");
    } catch (error) {
      console.error("[NavMeshScript] Failed to initialize navigation mesh:", error);
    }
  }

  /**
   * Initialize the navigation mesh
   */
  private async initializeNavMesh(): Promise<void> {
    // Import Recast.js WASM module
    const Recast = await import("recast-detour");
    
    // Create navigation plugin
    this.navigationPlugin = new RecastJSPlugin(Recast);

    // Create navigation mesh parameters
    const parameters = {
      cs: this.cellSize,
      ch: this.cellHeight,
      walkableSlopeAngle: this.agentMaxSlope,
      walkableHeight: this.agentHeight,
      walkableClimb: 0.3,
      walkableRadius: this.agentRadius,
      maxEdgeLen: 12,
      maxSimplificationError: 1.3,
      minRegionArea: 8,
      mergeRegionArea: 20,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 1
    };

    console.log("[NavMeshScript] Creating nav mesh with parameters:", parameters);

    // Get all meshes to include in navigation (ground and obstacles)
    const meshes = this.getMeshesForNavigation();
    
    // Create navigation mesh
    this.navigationPlugin.createNavMesh(meshes, parameters);

    // Store reference in scene metadata for VR movement to find
    const metadata = this.scene.metadata || {};
    metadata.navigationPlugin = this.navigationPlugin;
    this.scene.metadata = metadata;

    // Show debug visualization if enabled
    if (this.showDebug) {
      this.showDebugVisualization();
    }

    console.log("[NavMeshScript] Navigation mesh created successfully");
  }

  /**
   * Get meshes to include in navigation calculation
   */
  private getMeshesForNavigation(): Mesh[] {
    const meshes: Mesh[] = [];

    // Always include the mesh this script is attached to
    meshes.push(this.mesh);

    // Include meshes tagged as "obstacle" or "ground"
    this.scene.meshes.forEach((mesh) => {
      if (!(mesh instanceof Mesh)) return;
      if (mesh === this.mesh) return; // Already added

      const tags = mesh.metadata?.tags || [];
      if (tags.includes("obstacle") || tags.includes("ground") || tags.includes("navmesh")) {
        meshes.push(mesh as Mesh);
        console.log("[NavMeshScript] Including mesh in navigation:", mesh.name);
      }
    });

    return meshes;
  }

  /**
   * Show debug visualization of the navigation mesh
   */
  private showDebugVisualization(): void {
    if (!this.navigationPlugin) return;

    // Remove existing debug mesh
    if (this.debugMesh) {
      this.debugMesh.dispose();
    }

    // Create debug mesh
    this.debugMesh = this.navigationPlugin.createDebugNavMesh(this.scene);
    if (this.debugMesh) {
      this.debugMesh.position.y += 0.01; // Slightly above ground to prevent z-fighting
      console.log("[NavMeshScript] Debug visualization enabled");
    }
  }

  /**
   * Get the closest point on the navigation mesh
   */
  public getClosestPoint(position: Vector3): Vector3 | null {
    if (!this.navigationPlugin) {
      console.warn("[NavMeshScript] Navigation plugin not initialized");
      return null;
    }

    return this.navigationPlugin.getClosestPoint(position);
  }

  /**
   * Check if a point is on the navigation mesh
   */
  public isPointOnNavMesh(position: Vector3, maxDistance: number = 0.5): boolean {
    const closest = this.getClosestPoint(position);
    if (!closest) return false;

    const distance = Vector3.Distance(position, closest);
    return distance <= maxDistance;
  }

  /**
   * Get navigation plugin for external use
   */
  public getNavigationPlugin(): RecastJSPlugin | undefined {
    return this.navigationPlugin;
  }

  /**
   * Called every frame
   */
  public onUpdate(): void {
    // Navigation mesh is static, no per-frame updates needed
  }

  /**
   * Called when scene is disposed
   */
  public onStop(): void {
    console.log("[NavMeshScript] Disposing navigation mesh");
    
    if (this.debugMesh) {
      this.debugMesh.dispose();
      this.debugMesh = undefined;
    }

    if (this.navigationPlugin) {
      this.navigationPlugin.dispose();
      this.navigationPlugin = undefined;
    }
  }
}
