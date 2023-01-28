import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  // Cube Properties
  @Input() public rotationSpeedX: number = 0.05;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 200;

  // Stage Properties
  @Input() public cameraZ: number = 400;
  @Input() public fieldOfView: number = 1;
  @Input() public nearClippingPlane: number = 1;
  @Input() public farClippingPlane: number = 1000;

  private camera!: PerspectiveCamera;
  private geometry = new BoxGeometry(1, 1, 1);
  private material = new MeshBasicMaterial();
  private cube: Mesh = new Mesh(this.geometry, this.material);
  private renderer!: WebGLRenderer;
  private scene!: Scene;

  constructor() {
    // Do nothing
  }

  ngOnInit(): void {
    // Do nothing
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.createCamera();
    this.startRenderingLoop();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
    this.scene.add(this.cube);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private startRenderingLoop() {
    this.renderer = new WebGLRenderer({canvas: this.canvas});
    let component: CubeComponent = this;
    (function render() {
      if (component.resizeRendererToDisplaySize(component.renderer)) {
        const canvas = component.renderer.domElement;
        component.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        component.camera.updateProjectionMatrix();
      }
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private resizeRendererToDisplaySize(renderer: WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

}
