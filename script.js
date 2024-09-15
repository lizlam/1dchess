import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('canvas.webgl');

const sizes = {
  width: 800,
  height: 600
}

const scene = new THREE.Scene();

// Environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

class Box extends THREE.Mesh {
  constructor({ width, height, depth, texture, color = 'green', position = { x: 0, y: 0, z: 0 }}) {
    super(
      new THREE.BoxGeometry(width, height, depth, 4, 4),
      new THREE.MeshStandardMaterial({
        color,
        map: texture,
        flatShading: true,
        side: THREE.DoubleSide
      })
    )

    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    this.originalColor = color;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.highlighted = false;
  }

   
    highlight() {
      this.material.color.set('yellow');
      this.highlighted = true;
    }

    unhighlight() {
      this.material.color.set(this.originalColor);
      this.highlighted = false;
    }
 
    update() {
      this.bottom = this.position.y - this.height / 2;
      this.top = this.position.y + this.height / 2;
    }
}

const loader = new GLTFLoader();

function loadModel({
  model, 
  scene, 
  scaleX, 
  scaleY,
  scaleZ,
  x,
  y,
  z,
  color,
  rotateX = 0, rotateY = 0, rotateZ = 0
}) {
  loader.load(
    model,
    (gltf) => {
      gltf.scene.scale.set(scaleX, scaleY, scaleZ);
      gltf.scene.position.x = x;
      gltf.scene.position.y = y;
      gltf.scene.position.z = z;
      gltf.scene.rotation.x = rotateX;
      gltf.scene.rotation.y = rotateY;
      gltf.scene.rotation.z = rotateZ;
      if (color) {
        gltf.scene.children[0].children[0].material.color = new THREE.Color(color);
      }
      console.log(gltf.scene);
      scene.add(gltf.scene);	
    },
    (xhr) => {
      console.log((xhr.loaded/xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.log("Error loading model", error);
    },
  )
}

const rook1 = {
  model: "rook.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: -.7,
  y: -1,
  z: -1.1,
  color: 'black'
}

loadModel(rook1);

const knight1 = {
  model: "knight.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: .1,
  y: -1,
  z: -.8,
  color: 'black'
}

loadModel(knight1);

const king1 = {
  model: "king.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: -4.3,
  y: -1,
  z: -.8,
  color: 'black'
}

loadModel(king1);

const knight2 = {
  model: "knight.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: -1,
  y: -1,
  z: .8,
  color: 'green',
  rotateY: Math.PI
}

loadModel(knight2);

const king2 = {
  model: "king.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: 2.7,
  y: -1,
  z: -.8,
  color: 'green'
}

loadModel(king2);

const rook2 = {
  model: "rook.glb",
  scene,
  scaleX: .07,
  scaleY: .07,
  scaleZ: .07,
  x: 2.3,
  y: -1,
  z: -1.1,
  color: 'green'
}

loadModel(rook2);

// width, height, depth, width segments, height segments
const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4);
const material = new THREE.MeshPhongMaterial({ 
  color: 0xff0000, 
  flatShading: true,
});

// Make the board
const odd = {
  width: 1,
  height: .1,
  depth: 1,
  color: '#d2b48c'
}

const even = {
  width: 1,
  height: .1,
  depth: 1,
  color: '#5c4033'
}

const one = new Box({ position: { x: -4, y: -1, z: 0 },...odd});
one.position.y = -1;
one.position.x = -4;
one.receiveShadow = true;
scene.add(one);

const two = new Box(even);
two.position.y = -1;
two.position.x = -3;
two.receiveShadow = true;
scene.add(two);

const three = new Box(odd);
three.position.y = -1;
three.position.x = -2;
three.receiveShadow = true;
scene.add(three);

const four = new Box(even);
four.position.y = -1;
four.position.x = -1;
four.receiveShadow = true;
scene.add(four);

const five = new Box(odd);
five.position.y = -1;
five.position.x = 0;
five.receiveShadow = true;
scene.add(five);

const six = new Box(even);
six.position.y = -1;
six.position.x = 1;
six.receiveShadow = true;
scene.add(six);

const seven = new Box(odd);
seven.position.y = -1;
seven.position.x = 2;
seven.receiveShadow = true;
scene.add(seven);

const eight = new Box(even);
eight.position.y = -1;
eight.position.x = 3;
eight.receiveShadow = true;
scene.add(eight);

const array = [one, two, three, four, five, six, seven, eight];

const light = new THREE.DirectionalLight(0xffffff, 0.9);
light.position.z = 5;
light.position.x = 6;
light.position.y = 6;
light.castShadow = true;
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 0;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,  
});

renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
let index = 0;
let from = undefined;
let to = undefined;
let selectedIndex = undefined;
const ground = [one, two, three, four, five, six, seven, eight];

renderer.setSize(sizes.width, sizes.height);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

