import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Path,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";

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
  private scene!: Scene;
  private objects = new Array<Object3D>();
  private font!: Font;

  constructor() {
    // Do nothing
  }

  ngOnInit(): void {
    // Do nothing
  }

  ngAfterViewInit(): void {
    const loader = new FontLoader();

    let component: CubeComponent = this;
    loader.load('assets/helvetiker_regular.typeface.json', function (response) {
      component.font = response;
    });
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
  }

  private addLabels(axis: "x" | "y" | "z") {
    console.log(this.font);
    let geom = new TextGeometry("A", {
      font: this.font,
      size: 5,
      height: 2,
      curveSegments: 4,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: true
    });

    let textMesh1 = new Mesh(geom, [
      new MeshPhongMaterial({color: 0xffffff, flatShading: true}), // front
      new MeshPhongMaterial({color: 0xffffff}) // side
    ]);
    textMesh1.position.x = 0;
    textMesh1.position.y = 0;
    textMesh1.position.z = 13;

    this.scene.add(textMesh1);
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
    this.scene.rotation.x += 0.01;
    this.scene.rotation.y += 0.01;
    this.objects.forEach(obj => {
      // obj.rotation.x += 0.01;
      // obj.rotation.y += 0.01;
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

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

}
