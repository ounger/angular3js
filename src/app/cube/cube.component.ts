import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  LineLoop,
  Object3D,
  Path,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";

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

  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
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
    this.addAxis("x");
    this.addLabels("x");
  }

  private addYAxis() {
    this.addAxis("y");
    this.addLabels("y");
  }

  private addZAxis() {
    this.addAxis("z");
    this.addLabels("z");
  }

  private addAxis(axis: "x" | "y" | "z") {
    const length = 12;
    const x = axis === "x" ? length : 0;
    const y = axis === "y" ? length : 0;
    const z = axis === "z" ? length : 0;
    const points = [];
    points.push(new Vector3(x, y, z));
    points.push(new Vector3(-x, -y, -z));

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
      color: axis === "x" ? this.red : axis === "y" ? this.green : this.blue
    });
    const line = new Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = 'Hello World';
    label.style.marginTop = '-1em';
    const labelObj = new CSS2DObject(label);
    labelObj.position.set(0, 0, 0);
    this.objects.push(labelObj);
    line.add(labelObj);
  }

  private addLabels(axis: "x" | "y" | "z") {


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
    this.camera = new PerspectiveCamera(
      90,
      2,
      1,
      1000
    );
    this.camera.position.z = 25;
  }

  private startRenderingLoop() {
    this.renderer = new WebGLRenderer({canvas: this.canvas, antialias: true});

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    document.body.appendChild(this.labelRenderer.domElement);

    let component: CubeComponent = this;
    (function render() {
      if (component.resizeRendererToDisplaySize()) {
        const canvas = component.renderer.domElement;
        component.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        component.camera.updateProjectionMatrix();
      }
      requestAnimationFrame(render);
      component.animateBlochSphere();
      component.renderer.render(component.scene, component.camera);
      component.labelRenderer.render(component.scene, component.camera);
    }());
  }

  private animateBlochSphere() {
    this.scene.rotation.x += 0.01;
    this.scene.rotation.y += 0.01;
    this.objects[3].position.x += this.objects[0].position.x;
    this.objects[3].position.y += this.objects[0].position.y;
    this.objects[3].position.z += this.objects[0].position.z;
  }

  private resizeRendererToDisplaySize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const needResize = this.canvas.width !== width || this.canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
      this.labelRenderer.setSize(width, height);
    }
    return needResize;
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

}
