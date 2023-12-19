import './style.css';
import * as THREE from 'three';

// import orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import GLTF loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//iport DRACOLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

//import loadingManager
import { LoadingManager } from 'three';

//import gsap
import gsap from 'gsap';

let socket= null;
socket = new WebSocket("ws://localhost:3000/primus");


const draco = new DRACOLoader();
draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//load cubeTextureLoader from /cubemap
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  '/cubemap/px.png',
  '/cubemap/nx.png',
  '/cubemap/py.png',
  '/cubemap/ny.png',
  '/cubemap/pz.png',
  '/cubemap/nz.png',
]);

//add environment map to scene
scene.background = texture;


// make new cylinder geometry
const geometry = new THREE.CylinderGeometry( 3.5, 3.5, 0.3, 32 );
const textureLoader = new THREE.TextureLoader();
const texture2 = textureLoader.load('/textures/wood_cabinet_worn_long_rough_4k.jpg');
const material = new THREE.MeshStandardMaterial( {map:texture2, metalness: 0.2, roughness: 0.5} );
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(0, -1, 0);
cylinder.castShadow = true;
cylinder.receiveShadow = true;


scene.add( cylinder );


//add texture to shoe
const texture3 = textureLoader.load('/textures/brown_leather_albedo_4k.jpg');
const texture4 = textureLoader.load('/textures/fabric_pattern_07_nor_gl_4k.jpg');
const texture5 = textureLoader.load('/textures/denim_fabric_diff_4k.jpg');
const texture6 = textureLoader.load('/textures/Pattern03_4K_VarA.png');
// make array with textures
const textures = [
  texture3,
  texture4,
  texture5,
  texture6
];





// Orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.rotateSpeed = 0.2;

const loadingManager = new THREE.LoadingManager();


const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function () {
  progressBarContainer.style.display = 'none';
};

const gltfLoader = new GLTFLoader(loadingManager);


// DRACOLoader
// const gltfLoader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
// gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setDRACOLoader(draco);







let sneaker;

//load shoe model
gltfLoader.load('/models/Shoe_compressed.glb', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, 0, 0);

  // add color to shoe
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color = new THREE.Color('#BEE2D4');
    }
  });

  //add texture
  // gltf.scene.traverse((child) => {
  //   if (child.isMesh) {
  //     child.material.map = texture3;
  //   }
  // });
  scene.add(gltf.scene);

  
  sneaker = gltf.scene.children[0];
  gltf.scene.rotateY(Math.PI / 2); // Math.PI represents 180 degrees


 


//add array with shoe parts

const laces = document.getElementById('laces');
const inside = document.getElementById('inside');
const outside_1 = document.getElementById('outside1');
const outside_2 = document.getElementById('outside2');
const outside_3 = document.getElementById('outside3');
const sole_bottom = document.getElementById('solebottom');
const sole_top = document.getElementById('soletop');

// Assuming you have an element with id 'laces' in your HTML
const shoeParts = [
  { element: laces, name: 'laces' },
  { element: inside, name: 'inside'},
  { element: outside_1, name: 'outside_1' },
  { element: outside_2, name: 'outside_2' },
  { element: outside_3, name: 'outside_3' },
  { element: sole_bottom, name: 'sole_bottom' },
  { element: sole_top, name: 'sole_top' }
];


const color1= document.getElementById('color1');
const color2= document.getElementById('color2');
const color3= document.getElementById('color3');
const color4= document.getElementById('color4');
const color5= document.getElementById('color5');
const color6= document.getElementById('color6');

const colorButtons = [
  color1,
  color2,
  color3,
  color4,
  color5,
  color6
];

const texture1= document.getElementById('texture1');
const texture2= document.getElementById('texture2');
const texture3= document.getElementById('texture3');
const texture4= document.getElementById('texture4');

const textureButtons = [

  { element: texture1, name: 'Leather Texture' },
  { element: texture2, name: 'Fabric Pattern Texture' },
  { element: texture3, name: 'Denim Fabric Texture' },
  { element: texture4, name: 'Pattern Texture' },
];





let lastClickedColor = {
  laces: { color: 'BEE2D4', texture: 'Standard' },
  inside: { color: 'BEE2D4', texture: 'Standard' },
  outside_1: { color: 'BEE2D4', texture: 'Standard' },
  outside_2: { color: 'BEE2D4', texture: 'Standard' },
  outside_3: { color: 'BEE2D4', texture: 'Standard' },
  sole_bottom: { color: 'BEE2D4', texture: 'Standard' },
  sole_top: { color: 'BEE2D4', texture: 'Standard' }


};

// Add event listener for color buttons outside the loop
colorButtons.forEach((colorButton, index) => {
  colorButton.addEventListener('click', () => {
    console.log(`Color ${index + 1} clicked!`);
    const selectedColor = colorButton.style.backgroundColor;
    console.log(selectedColor);

    // Assuming you have a selectedPart variable storing the currently selected shoe part
    if (selectedPart) {
      updateShoeColor(selectedColor, selectedPart);

      // Remove border from all color buttons
      colorButtons.forEach((btn) => {
        btn.style.border = 'white 2px solid';
      });

      // Add border to the clicked color button
      colorButton.style.border = '2px solid black';
    }
  });
});
textureButtons.forEach((textureButton, index) => {
  textureButton.element.addEventListener('click', () => {
    console.log(`Texture ${index + 1} clicked!`);
    selectedTexture = textures[index];
    if (selectedPart) {
      updateShoeTexture(selectedTexture, selectedPart, textureButton.name);
      
      // Remove border from all texture buttons
      textureButtons.forEach((btn) => {
        btn.element.style.border = '2px solid white';
      });
      
      // Add border to the clicked texture button
      textureButton.element.style.border = '2px solid black';

      // after clicking on the texture button again, remove the color of the border
      if (lastClickedColor[selectedPart].texture !== textureButton.name) {
        textureButton.element.style.border = '2px solid white';
      }




    }
  });
});


let selectedPart = null;
let selectedPartElement = null;
let selectedTexture = null;


shoeParts.forEach((part) => {
  part.element.addEventListener('click', () => {
    console.log(`${part.name} clicked!`);
    if (selectedPartElement) {
      selectedPartElement.style.color = 'black';
    }
    selectedPart = part.name; // Update the selectedPart variable
    
    part.element.style.color = '#64F243'; // Change the color of the selected part text
    selectedPartElement = part.element; // Update the selectedPartElement variable
    if(selectedPart==="laces"){
      
      gsap.to(camera.position, {
        duration: 1, 
        x: 2, 
        y: 2.5, 
        z: 0
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = selectedPart;
      // change selected part text to color green
      
    }
    if(selectedPart==="inside"){
      gsap.to(camera.position, {
        duration: 1, 
        x: -1, 
        y: 3, 
        z: 0
      });

      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = selectedPart;
      
      
    }
    if(selectedPart==="outside_1"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 2, 
        z: 2.5
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = "outside 1";
    }
    if(selectedPart==="outside_2"){
      gsap.to(camera.position, {
        duration: 1, 
        x: -2, 
        y: 1.5, 
        z: 2
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = "outside 2";
    }
    if(selectedPart==="outside_3"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 2.5, 
        y: 2.5, 
        z: 0
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = "outside 3";
    }
    if(selectedPart==="sole_bottom"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 0, 
        z: 2
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = "sole bottom";
    }
    if(selectedPart==="sole_top"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 0.5, 
        z: 2
      });
      document.getElementById("colorOptions").style.display = "flex";
      document.getElementById("partShoe").innerHTML = "sole top";
    }
  });
});

function updateShoeColor(color, partName) {
  console.log(color, partName);
  sneaker.traverse((child) => {
    if (child.isMesh && child.name === partName) {
      const newColor = new THREE.Color(color);
      child.material.color.copy(newColor);
      
      // Store last clicked color of every shoe part in an object$
      //change rgb to hex
      const hexColor = newColor.getHexString();
      console.log(hexColor);
      lastClickedColor[partName].color = hexColor;
      console.log(lastClickedColor);
    }
  });
}

function updateShoeTexture(selectedTexture, selectedPart, textureName) {
  console.log(selectedTexture, selectedPart, textureName);
  sneaker.traverse((child) => {
    if (child.isMesh && child.name === selectedPart) {
      const currentTexture = child.material.map;
      
      // If the current texture is the same as the selected one, remove the texture
      if (currentTexture && currentTexture === selectedTexture) {
        child.material.map = null;
        child.material.needsUpdate = true;
        lastClickedColor[selectedPart].texture = 'Standard';
        console.log(lastClickedColor);
        // change color of border to white
      } else {
        // Otherwise, set the selected texture
        child.material.map = selectedTexture;
        child.material.needsUpdate = true;
        lastClickedColor[selectedPart].texture = textureName;
        console.log(lastClickedColor);
      }
    }
  });
}


 
 document.querySelector(".btnTitle").addEventListener("click", async function(){
  try{
    //fetch request to send data to server
    let orderData = {
      "laces_color": lastClickedColor.laces.color,
      "inside_color": lastClickedColor.inside.color,
      "outside_1_color": lastClickedColor.outside_1.color,
      "outside_2_color": lastClickedColor.outside_2.color,
      "outside_3_color": lastClickedColor.outside_3.color,
      "sole_bottom_color": lastClickedColor.sole_bottom.color,
      "sole_top_color": lastClickedColor.sole_top.color,

      "laces_material": lastClickedColor.laces.texture,
      "inside_material": lastClickedColor.inside.texture,
      "outside_1_material": lastClickedColor.outside_1.texture,
      "outside_2_material": lastClickedColor.outside_2.texture,
      "outside_3_material": lastClickedColor.outside_3.texture,
      "sole_bottom_material": lastClickedColor.sole_bottom.texture,
      "sole_top_material": lastClickedColor.sole_top.texture,

      "status": 'Ordered',
      "user": 'user1',
      "size": 42,
      "price": 100,
      
    };

    const response= await fetch('http://localhost:3000/api/v1/shoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    if(response.ok){
      
      let data = await response.json();
      console.log(data.data[0].id);
      orderData.action="add";
      orderData._id=data.data[0].id;
      socket.send(JSON.stringify(orderData));

      document.querySelector(".error").innerHTML = "Order placed";

    }else{
      document.querySelector(".error").innerHTML = "Order error";
    }
    
  } catch(error){
    console.log(error);

  }
 });


  sneaker.traverse((child) => {
    child.castShadow = true;
  });

  animate();

});


  //add light to shoe
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  ambientLight.position.set(0, 2, 0).normalize();
  scene.add(ambientLight);

  //add point light to shoe
  const pointLight = new THREE.PointLight(0xffffff, 8);
  pointLight.position.set(0, 5, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
  

camera.position.z = 3;
camera.position.y = 1.5;
camera.position.x = 0;

// dont be able to look under the cylinder
const minHeight = cylinder.position.y + cylinder.geometry.parameters.height / 2;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = minHeight + 1;
controls.maxDistance = 10;
controls.enablePan = false;
controls.enableDamping = true;

// add clock
const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );


  // sneaker.position.y = Math.sin(Date.now() * 0.0001) * 0.1;
  const elapsedTime = clock.getElapsedTime();
  sneaker.position.y = Math.sin(elapsedTime) * 0.03;
  

  camera.lookAt(sneaker.position);

  controls.update();

	renderer.render( scene, camera );
}  