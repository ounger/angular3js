import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineLoop,
  Object3D,
  Path,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit, AfterViewInit {

  private readonly red = 0xff0000;
  private readonly green = 0x00ff00;
  private readonly blue = 0x0000ff;

  @ViewChild("canvas")
  private canvasRef!: ElementRef;

  // Cube Properties
  @Input() public rotationSpeedX: number = 0.01;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 200;

  // Stage Properties
  @Input() public cameraZ: number = 25;
  @Input() public fieldOfView: number = 90;
  @Input() public nearClippingPlane: number = 1;
  @Input() public farClippingPlane: number = 1000;

  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private objects = new Array<Object3D>();

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
    this.scene.background = new Color(0xAAAAAA);
    this.scene.rotation.z += Math.PI / 4;
    this.addBlochSphere();
    this.addAxes();
    this.addLightning();
  }

  private addBlochSphere() {
    // We construct it simply with 3 circles
    // Check properties here: https://threejs.org/docs/#api/en/geometries/CircleGeometry
    this.addXCircle();
    this.addYCircle();
    this.addZCircle();
  }

  private addXCircle() {
    const mesh = new LineLoop(this.createCircleGeometry(), this.createLineBasicMaterial());
    mesh.rotation.y += Math.PI / 2;
    this.addObject(0, 0, mesh);
  }

  private addYCircle() {
    const mesh = new LineLoop(this.createCircleGeometry(), this.createLineBasicMaterial());
    mesh.rotation.x += Math.PI / 2;
    this.addObject(0, 0, mesh);
  }

  private addZCircle() {
    const mesh = new LineLoop(this.createCircleGeometry(), this.createLineBasicMaterial());
    this.addObject(0, 0, mesh);
  }

  private createCircleGeometry(): BufferGeometry {
    return new BufferGeometry().setFromPoints(
      new Path().absarc(0, 0, 10, 0, Math.PI * 2, true)
        .getSpacedPoints(64)
    );
  }

  private addAxes() {
    this.addXAxis();
    this.addYAxis();
    this.addZAxis();
  }

  private addXAxis() {
    this.createAxis("x");
  }

  private addYAxis() {
    this.createAxis("y");
  }

  private addZAxis() {
    this.createAxis("z");
  }

  private createAxis(axis: "x" | "y" | "z") {
    const length = 12;
    const x = axis === "x" ? length : 0;
    const y = axis === "y" ? length : 0;
    const z = axis === "z" ? length : 0;
    const points = [];
    points.push(new Vector3(x, y, z));
    points.push(new Vector3(-x, -y, -z));

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineDashedMaterial({
      color: axis === "x" ? this.red : axis === "y" ? this.green : this.blue,
      dashSize: 2, gapSize: 1, linewidth: 1
    });
    const line = new Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
  }

  private addObject(x: number, y: number, obj: Object3D) {
    obj.position.x = x;
    obj.position.y = y;

    this.scene.add(obj);
    this.objects.push(obj);
  }

  private createLineBasicMaterial(): LineBasicMaterial {
    return new LineBasicMaterial({color: 0xffffff});
  }

  private addLightning() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
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
      component.animateBlochSphere();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private animateBlochSphere() {
    this.scene.rotation.x += this.rotationSpeedX;
    // this.scene.rotation.y += this.rotationSpeedY;
    this.objects.forEach(obj => {
      // obj.rotation.x += this.rotationSpeedX;
      // obj.rotation.y += this.rotationSpeedY;
    });
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
