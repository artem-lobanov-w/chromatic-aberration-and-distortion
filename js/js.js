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
let time = 0;
let uniforms = {
    time: {type:'f', value: time},
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
    time += 0.1;
    uniforms.time.value = time;
	renderer.setSize(window.innerWidth, window.innerHeight);
	requestAnimationFrame( render );
	renderer.render( scene, camera );
    console.log('time:', time);
}
render();

function lerp(a, b, t) {
    return a + (b - a) * t;
}

let lastX = 0;
let lastY = 0;
const smoothing = 0.1;
document.addEventListener('mousemove', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    
    if (lastX !== 0 && lastY !== 0) {
        const newSpeed = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
        speed = newSpeed;
    }

    lastX = x;
    lastY = y;
    uniforms.speed.value = speed;
});

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const speedFactor = 0.5;

function update() {
    requestAnimationFrame(update);
    const diffX = targetX - currentX;
    const diffY = targetY - currentY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const speed = distance * speedFactor;
    if (distance < 1.0) {
        currentX = targetX;
        currentY = targetY;
    } else {
        currentX += speed * diffX / distance;
        currentY += speed * diffY / distance;
    }
}
update()

document.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
});


function animate() {
    requestAnimationFrame(animate);
    uniforms.mouseCoord.value.x = currentX;
    uniforms.mouseCoord.value.y = -currentY + window.innerHeight;
}
animate();


let lastTouchX = 0;
let lastTouchY = 0;
const touchSmoothing = 0.1;

// Функция-обработчик для событий touchstart и touchmove
function touchHandler(event) {

const firstTouch = event.touches[0] || event.changedTouches[0];
targetX = firstTouch.clientX;
targetY = firstTouch.clientY;

// Вычисляем скорость для touch events
if (lastTouchX !== 0 && lastTouchY !== 0) {
const touchSpeed = Math.sqrt((targetX - lastTouchX) ** 2 + (targetY - lastTouchY) ** 2);
speed = lerp(speed, touchSpeed, touchSmoothing);
}

lastTouchX = targetX;
lastTouchY = targetY;
uniforms.speed.value = speed;

uniforms.mouseCoord.value.x = currentX;
uniforms.mouseCoord.value.y = -currentY + window.innerHeight;
}

// Назначаем обработчик событий
document.addEventListener('touchstart', touchHandler, false);
document.addEventListener('touchmove', touchHandler, false);
document.addEventListener('touchend', touchHandler, false);

// Объединяем обработчики событий mousemove и touchmove
document.addEventListener('mousemove', (event) => {
touchHandler(event);
});