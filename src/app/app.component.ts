import {AfterViewInit, Component} from '@angular/core';
import {BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
    let renderer = new WebGLRenderer({canvas});

    let scene = new Scene();
    let camera = new PerspectiveCamera(75, 2, 0.1, 1000);

    let geometry = new BoxGeometry(1, 1, 1);
    let material = new MeshPhongMaterial({color: 0x00ff00});
    let cube = new Mesh(geometry, material);
    scene.add(cube);

    // Add lightning
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    camera.position.z = 5;

    let animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }

}
