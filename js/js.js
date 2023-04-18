const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const shaderCode = document.getElementById("fragShader").innerHTML;
const textureURL = "scott-rodgerson-z0MDyylvY1k-unsplash.jpg";
THREE.ImageUtils.crossOrigin = '';
const texture = THREE.ImageUtils.loadTexture(textureURL);

let speed = 0;
let uniforms = {
    speed:{type:'f', value: speed},
	mouseCoord: {type:'v3', value: new THREE.Vector3()},
	tex: { type:'t', value:texture },
	res: { type:'v2', value:new THREE.Vector2(window.innerWidth,window.innerHeight)}
};

let material = new THREE.ShaderMaterial({uniforms:uniforms, fragmentShader:shaderCode});
let geometry = new THREE.PlaneGeometry(10,10);
let sprite = new THREE.Mesh(geometry, material);

scene.add(sprite);
camera.position.z = 2;

uniforms.mouseCoord.value.z = 50;
function render() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();

function lerp(a, b, t) {
    return a + (b - a) * t;
}

let lastX = 0;
let lastY = 0;
const smoothing = 0.1;
document.addEventListener('mousemove', function(event) {
    uniforms.speed.value = speed;
    console.log('Speed:', speed);
    const x = event.clientX;
    const y = event.clientY;

    if (lastX !== 0 && lastY !== 0) {
        const newSpeed = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
        speed = lerp(speed, newSpeed, smoothing);
    }

    lastX = x;
    lastY = y;
});

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function update() {
    requestAnimationFrame(update);
    const diffX = targetX - currentX;
    const diffY = targetY - currentY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const speed = distance / 10;
    if (distance < 1.0) {
        currentX = targetX;
        currentY = targetY;
    } else {
        currentX += speed * diffX / distance;
        currentY += speed * diffY / distance;
    }
    console.log(currentX);
}
update()

document.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    uniforms.mouseCoord.value.x = currentX;
    uniforms.mouseCoord.value.y = -currentY + window.innerHeight;
});


const cursorDiv = document.createElement('div');
cursorDiv.style.position = 'fixed';
cursorDiv.style.top = '0';
cursorDiv.style.left = '0';
cursorDiv.style.width = '20px';
cursorDiv.style.height = '20px';
cursorDiv.style.backgroundColor = 'black';
cursorDiv.style.opacity = '0.5';
cursorDiv.style.borderRadius = '50%';
document.body.appendChild(cursorDiv);

let posX = 0;
let posY = 0;
let mouseX;
let mouseY;
function animate() {
    requestAnimationFrame(animate);
    const mouseX = currentX;
    const mouseY = currentY;
    posX += (mouseX - posX) * 0.5;
    posY += (mouseY - posY) * 0.5;

    cursorDiv.style.left = posX - 10 + 'px';
    cursorDiv.style.top = posY - 10 + 'px';
    uniforms.mouseCoord.value.x = currentX;
    uniforms.mouseCoord.value.y = -currentY + window.innerHeight;
}

function mousemoveHandler(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

document.addEventListener('mousemove', mousemoveHandler);

animate();