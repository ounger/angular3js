import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  LineLoop,
  Object3D,
  Path,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  Texture,
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
    // this.scene.rotation.z += Math.PI / 4;  // TODO Reset start position
    this.addBlochSphere();
    this.addAxes();
    this.addLabels();
    this.addLightning();
  }

  private addBlochSphere() {
    // We construct it simply with 3 circles
    // Check properties here: https://threejs.org/docs/#api/en/geometries/CircleGeometry
    const blochSphere = new Group();
    blochSphere.add(this.createCircle("x"));
    blochSphere.add(this.createCircle("y"));
    blochSphere.add(this.createCircle("z"));
    this.scene.add(blochSphere);
    this.objects.push(blochSphere);
  }

  private createCircle(axis: "x" | "y" | "z"): LineLoop {
    const circle = new LineLoop(this.createCircleGeometry(), this.createLineBasicMaterial());
    if (axis === "x") {
      circle.rotation.y += Math.PI / 2;
    } else if (axis === "y") {
      circle.rotation.x += Math.PI / 2;
    }
    return circle;
  }

  private createCircleGeometry(): BufferGeometry {
    return new BufferGeometry().setFromPoints(
      new Path().absarc(0, 0, 10, 0, Math.PI * 2, true)
        .getSpacedPoints(64)
    );
  }

  private addAxes() {
    const axes = new Group();
    axes.add(this.createAxis("x"));
    axes.add(this.createAxis("y"));
    axes.add(this.createAxis("z"));
    this.scene.add(axes);
    this.objects.push(axes);
  }

  private createAxis(axis: "x" | "y" | "z"): Line {
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
    return line;
  }

  private addLabels() {
    const labels = new Group();

    // labels.add(this.createLabel("x", "positive"));
    // labels.add(this.createLabel("x", "negative"));
    //
    labels.add(this.createLabel("y", "positive"));
    // labels.add(this.createLabel("y", "negative"));
    //
    // labels.add(this.createLabel("z", "positive"));
    // labels.add(this.createLabel("z", "negative"));

    this.scene.add(labels);
    this.objects.push(labels);
  }

  private createLabel(axis: "x" | "y" | "z", position: "positive" | "negative"): Sprite {
    const label = this.createTextSprite(
      axis, {fontsize: 24, borderColor: {r: 255, g: 0, b: 0, a: 1.0}, backgroundColor: {r: 255, g: 100, b: 100, a: 0.8}}
    );
    const dist = 12;
    const x = axis === "x" ? (position === "positive" ? dist : dist * -1) : 0;
    const y = axis === "y" ? (position === "positive" ? dist : dist * -1) : 0;
    const z = axis === "z" ? (position === "positive" ? dist : dist * -1) : 0;
    label.position.set(x, y, z);
    return label;
  }

  createTextSprite(message: string, parameters: any): Sprite {
    if (parameters === undefined) parameters = {};
    let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    let borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};
    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
      r: 255,
      g: 255,
      b: 255,
      a: 1.0
    };
    let textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {r: 0, g: 0, b: 0, a: 1.0};

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context!.font = "Bold " + fontsize + "px " + fontface;
    let metrics = context!.measureText(message);
    let textWidth = metrics.width;

    context!.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context!.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context!.lineWidth = borderThickness;
    this.roundRect(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context!.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context!.fillText(message, borderThickness, fontsize + borderThickness);

    let texture = new Texture(canvas);
    texture.needsUpdate = true;

    let spriteMaterial = new SpriteMaterial({map: texture});
    let sprite = new Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
  }

  roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
    }());
  }

  private animateBlochSphere() {
    this.objects.forEach(obj => {
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.01;
      obj.rotation.z += 0.01;
    });
  }

  private resizeRendererToDisplaySize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const needResize = this.canvas.width !== width || this.canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
    return needResize;
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

}
