const counterDOM = document.getElementById('counter');
const endDOM = document.getElementById('end');

const scene = new THREE.Scene();
let contador = 0;
const distance = 500;
const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000);

camera.rotation.x = 50 * Math.PI / 180;
camera.rotation.y = 20 * Math.PI / 180;
camera.rotation.z = 10 * Math.PI / 180;

const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance;
const initialCameraPositionX = Math.tan(camera.rotation.y) * Math.sqrt(distance ** 2 + initialCameraPositionY ** 2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance;

const zoom = 2;

const chickenSize = 15;

const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth * columns;

const stepTime = 200; // Miliseconds it takes for the chicken to take a step forward, backward, left or right

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;

const carFrontTexture = new Texture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = new Texture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = new Texture(110, 40, [{ x: 10, y: 0, w: 50, h: 30 }, { x: 70, y: 0, w: 30, h: 30 }]);
const carLeftSideTexture = new Texture(110, 40, [{ x: 10, y: 10, w: 50, h: 30 }, { x: 70, y: 10, w: 30, h: 30 }]);

const truckFrontTexture = new Texture(30, 30, [{ x: 15, y: 0, w: 10, h: 30 }]);
const truckRightSideTexture = new Texture(25, 30, [{ x: 0, y: 15, w: 10, h: 10 }]);
const truckLeftSideTexture = new Texture(25, 30, [{ x: 0, y: 5, w: 10, h: 10 }]);

const generateLanes = () => [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
    const lane = new Lane(index);
    lane.mesh.position.y = index * positionWidth * zoom;
    scene.add(lane.mesh);
    return lane;
}).filter((lane) => lane.index >= 0);

const addLane = () => {
    const index = lanes.length;
    const lane = new Lane(index);
    lane.mesh.position.y = index * positionWidth * zoom;
    scene.add(lane.mesh);
    lanes.push(lane);
}

const chicken = new Chicken();
scene.add(chicken);

hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight)

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;
dirLight.target = chicken;
scene.add(dirLight);

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;

// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
// var helper = new THREE.CameraHelper( camera );
// scene.add(helper)

backLight = new THREE.DirectionalLight(0x000000, .4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight)

const laneTypes = ['car', 'truck', 'forest'];
const laneSpeeds = [2, 2.5, 3];
const vechicleColors = [0xf2c43e, 0xB60666, 0x5e61b5];
const threeHeights = [20, 45, 60];

const initaliseValues = () => {
    lanes = generateLanes()

    currentLane = 0;
    currentColumn = Math.floor(columns / 2);

    previousTimestamp = null;

    startMoving = false;
    moves = [];
    stepStartTimestamp;

    chicken.position.x = 0;
    chicken.position.y = 0;

    camera.position.y = initialCameraPositionY;
    camera.position.x = initialCameraPositionX;

    dirLight.position.x = initialDirLightPositionX;
    dirLight.position.y = initialDirLightPositionY;
}

initaliseValues();

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function Texture(width, height, rects) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(0,0,0,0.6)";
    rects.forEach(rect => {
        context.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
    return new THREE.CanvasTexture(canvas);
}

function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12 * zoom, 33 * zoom, 12 * zoom),
        new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
    );
    wheel.position.z = 6 * zoom;
    return wheel;
}

function Car(direction) {
    const car = new THREE.Group();
    const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60 * zoom, 30 * zoom, 15 * zoom),
        new THREE.MeshPhongMaterial({ color, flatShading: true })
    );
    main.position.z = 12 * zoom;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33 * zoom, 24 * zoom, 12 * zoom), [
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carBackTexture }),
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carFrontTexture }),
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carRightSideTexture }),
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carLeftSideTexture }),
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // top
            new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }) // bottom
        ]
    );
    cabin.position.x = 6 * zoom;
    cabin.position.z = 25.5 * zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);

    const frontWheel = new Wheel();
    frontWheel.position.x = -18 * zoom;
    car.add(frontWheel);

    const backWheel = new Wheel();
    backWheel.position.x = 18 * zoom;
    car.add(backWheel);

    car.castShadow = true;
    car.receiveShadow = false;

    const logoGeometry = new THREE.BoxBufferGeometry(33 * zoom, 24 * zoom, 12 * zoom);
    const logoTexture = new THREE.TextureLoader().load('../crossy_road/img/danono-logo.jpeg');
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.wrapT = THREE.RepeatWrapping;
    logoTexture.minFilter = THREE.LinearFilter;

    const logoMaterials = [


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // back


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // front


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, }), // right side (logo)


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, }), // left side (logo)


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // top
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: logoTexture }) // bottom
    ];


    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterials);

    console.log(direction);
    logoMesh.position.x = 6 * zoom;
    logoMesh.position.z = 25.5 * zoom;
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    logoMesh.rotation.y = Math.PI;
    car.add(logoMesh);

    return car;
}

function Truck(direction) {
    const truck = new THREE.Group();
    const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];

    const base = new THREE.Mesh(
        new THREE.BoxBufferGeometry(100 * zoom, 25 * zoom, 5 * zoom),
        new THREE.MeshLambertMaterial({ color: 0xb4c6fc, flatShading: true })
    );
    base.position.z = 10 * zoom;
    truck.add(base)

    const cargo = new THREE.Mesh(
        new THREE.BoxBufferGeometry(75 * zoom, 35 * zoom, 40 * zoom),
        new THREE.MeshPhongMaterial({ color: 0xb4c6fc, flatShading: true })
    );
    cargo.position.x = 15 * zoom;
    cargo.position.z = 30 * zoom;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(25 * zoom, 30 * zoom, 30 * zoom), [
            new THREE.MeshPhongMaterial({ color, flatShading: true }), // back
            new THREE.MeshPhongMaterial({ color, flatShading: true, map: truckFrontTexture }),
            new THREE.MeshPhongMaterial({ color, flatShading: true, map: truckRightSideTexture }),
            new THREE.MeshPhongMaterial({ color, flatShading: true, map: truckLeftSideTexture }),
            new THREE.MeshPhongMaterial({ color, flatShading: true }), // top
            new THREE.MeshPhongMaterial({ color, flatShading: true }) // bottom
        ]
    );
    cabin.position.x = -40 * zoom;
    cabin.position.z = 20 * zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add(cabin);

    const frontWheel = new Wheel();
    frontWheel.position.x = -38 * zoom;
    truck.add(frontWheel);

    const middleWheel = new Wheel();
    middleWheel.position.x = -10 * zoom;
    truck.add(middleWheel);

    const backWheel = new Wheel();
    backWheel.position.x = 30 * zoom;
    truck.add(backWheel);

    const logoGeometry = new THREE.BoxBufferGeometry(75 * zoom, 35 * zoom, 40 * zoom);
    const logoTexture = new THREE.TextureLoader().load('../crossy_road/img/dadone-gif.gif');
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.wrapT = THREE.RepeatWrapping;
    logoTexture.minFilter = THREE.LinearFilter;

    const logoTexture2 = new THREE.TextureLoader().load('../crossy_road/img/danono-logo.jpeg');
    logoTexture2.wrapS = THREE.RepeatWrapping;
    logoTexture2.wrapT = THREE.RepeatWrapping;
    logoTexture2.minFilter = THREE.LinearFilter;

    const logoMaterials = [


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // back


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // front


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, map: logoTexture }), // right side (logo)


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, map: logoTexture }), // left side (logo)


        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: logoTexture2 }), // top
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: logoTexture2 }) // bottom
    ];

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterials);

    logoMesh.position.x = 15 * zoom;
    logoMesh.position.z = 30 * zoom;
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    logoMesh.rotation.y = direction ? null : Math.PI;
    truck.add(logoMesh);

    return truck;
}

function Three() {
    const three = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.BoxBufferGeometry(15 * zoom, 15 * zoom, 20 * zoom),
        new THREE.MeshPhongMaterial({ color: 0x4e3a3b, flatShading: true })
    );
    trunk.position.z = 10 * zoom;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    three.add(trunk);

    height = threeHeights[Math.floor(Math.random() * threeHeights.length)];

    const crown = new THREE.Mesh(
        new THREE.BoxBufferGeometry(30 * zoom, 30 * zoom, height * zoom),
        new THREE.MeshLambertMaterial({ color: 0x429867, flatShading: true })
    );
    crown.position.z = (height / 2 + 20) * zoom;
    crown.castShadow = true;
    crown.receiveShadow = false;
    three.add(crown);

    return three;
}

function Chicken() {
    const chicken = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxBufferGeometry(chickenSize * zoom, chickenSize * zoom, 20 * zoom),
        new THREE.MeshPhongMaterial({ color: 0x5e61b5, flatShading: true })
    );
    body.position.z = 10 * zoom;
    body.castShadow = true;
    body.receiveShadow = true;
    chicken.add(body);

    const rowel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(2 * zoom, 4 * zoom, 2 * zoom),
        new THREE.MeshLambertMaterial({ color: 0xF0619A, flatShading: true })
    );
    rowel.position.z = 21 * zoom;
    rowel.castShadow = true;
    rowel.receiveShadow = false;
    chicken.add(rowel);

    const logoGeometry = new THREE.BoxBufferGeometry(chickenSize * zoom, chickenSize * zoom, 20 * zoom);
    const logoTexture = new THREE.TextureLoader().load('../crossy_road/img/danono-logo.jpeg');
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.wrapT = THREE.RepeatWrapping;
    logoTexture.minFilter = THREE.LinearFilter;
    const logoMaterials = [


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // back


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, map: logoTexture }), // right side (logo)


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, map: logoTexture }), // left side (logo)


        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // top
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }) // bottom
    ];

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterials);


    logoMesh.position.z = 10 * zoom;
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    // logoMesh.rotation.y = direction ? null : Math.PI;
    chicken.add(logoMesh);

    return chicken;
}

function Road() {
    const road = new THREE.Group();

    const createSection = color => new THREE.Mesh(
        new THREE.PlaneBufferGeometry(boardWidth * zoom, positionWidth * zoom),
        new THREE.MeshPhongMaterial({ color })
    );

    const middle = createSection(0x454A59);
    middle.receiveShadow = true;
    road.add(middle);

    const left = createSection(0x393D49);
    left.position.x = -boardWidth * zoom;
    road.add(left);

    const right = createSection(0x393D49);
    right.position.x = boardWidth * zoom;
    road.add(right);

    return road;
}

function Grass() {
    const grass = new THREE.Group();

    const createSection = color => new THREE.Mesh(
        new THREE.BoxBufferGeometry(boardWidth * zoom, positionWidth * zoom, 3 * zoom),
        new THREE.MeshPhongMaterial({ color })
    );

    const middle = createSection(0xf2c43e);
    middle.receiveShadow = true;
    grass.add(middle);

    const left = createSection(0x5e61b5);
    left.position.x = -boardWidth * zoom;
    grass.add(left);

    const right = createSection(0x5e61b5);
    right.position.x = boardWidth * zoom;
    grass.add(right);

    grass.position.z = 1.5 * zoom;
    return grass;
}

function Lane(index) {
    this.index = index;
    this.type = index <= 0 ? 'field' : laneTypes[Math.floor(Math.random() * laneTypes.length)];

    switch (this.type) {
        case 'field':
            {
                this.type = 'field';
                this.mesh = new Grass();
                break;
            }
        case 'forest':
            {
                this.mesh = new Grass();

                this.occupiedPositions = new Set();
                this.threes = [1, 2, 3, 4].map(() => {
                    const three = new Three();
                    let position;
                    do {
                        position = Math.floor(Math.random() * columns);
                    } while (this.occupiedPositions.has(position))
                    this.occupiedPositions.add(position);
                    three.position.x = (position * positionWidth + positionWidth / 2) * zoom - boardWidth * zoom / 2;
                    this.mesh.add(three);
                    return three;
                })
                break;
            }
        case 'car':
            {
                this.mesh = new Road();
                this.direction = Math.random() >= 0.5;

                const occupiedPositions = new Set();
                this.vechicles = [1, 2, 3].map(() => {
                    const vechicle = new Car(this.direction);
                    let position;
                    do {
                        position = Math.floor(Math.random() * columns / 2);
                    } while (occupiedPositions.has(position))
                    occupiedPositions.add(position);
                    vechicle.position.x = (position * positionWidth * 2 + positionWidth / 2) * zoom - boardWidth * zoom / 2;
                    if (!this.direction) vechicle.rotation.z = Math.PI;
                    this.mesh.add(vechicle);
                    return vechicle;
                })

                this.speed = laneSpeeds[Math.floor(Math.random() * laneSpeeds.length)];
                break;
            }
        case 'truck':
            {
                this.mesh = new Road();
                this.direction = Math.random() >= 0.5;

                const occupiedPositions = new Set();
                this.vechicles = [1, 2].map(() => {
                    const vechicle = new Truck(this.direction);
                    let position;
                    do {
                        position = Math.floor(Math.random() * columns / 3);
                    } while (occupiedPositions.has(position))
                    occupiedPositions.add(position);
                    vechicle.position.x = (position * positionWidth * 3 + positionWidth / 2) * zoom - boardWidth * zoom / 2;
                    if (!this.direction) vechicle.rotation.z = Math.PI;
                    this.mesh.add(vechicle);
                    return vechicle;
                })

                this.speed = laneSpeeds[Math.floor(Math.random() * laneSpeeds.length)];
                break;
            }
    }
}

document.querySelector("#retry").addEventListener("click", () => {
    lanes.forEach(lane => scene.remove(lane.mesh));
    initaliseValues();
    endDOM.style.visibility = 'hidden';
    contador = 0;
});

document.getElementById('forward').addEventListener("click", () => move('forward'));

document.getElementById('backward').addEventListener("click", () => move('backward'));

document.getElementById('left').addEventListener("click", () => move('left'));

document.getElementById('right').addEventListener("click", () => move('right'));

window.addEventListener("keydown", event => {
    if (event.keyCode == '38') {
        // up arrow
        move('forward');
    } else if (event.keyCode == '40') {
        // down arrow
        move('backward');
    } else if (event.keyCode == '37') {
        // left arrow
        move('left');
    } else if (event.keyCode == '39') {
        // right arrow
        move('right');
    }
});

function move(direction) {
    const finalPositions = moves.reduce((position, move) => {
        if (move === 'forward') return { lane: position.lane + 1, column: position.column };
        if (move === 'backward') return { lane: position.lane - 1, column: position.column };
        if (move === 'left') return { lane: position.lane, column: position.column - 1 };
        if (move === 'right') return { lane: position.lane, column: position.column + 1 };
    }, { lane: currentLane, column: currentColumn })

    if (direction === 'forward') {
        if (lanes[finalPositions.lane + 1].type === 'forest' && lanes[finalPositions.lane + 1].occupiedPositions.has(finalPositions.column)) return;
        if (!stepStartTimestamp) startMoving = true;
        addLane();
    } else if (direction === 'backward') {
        if (finalPositions.lane === 0) return;
        if (lanes[finalPositions.lane - 1].type === 'forest' && lanes[finalPositions.lane - 1].occupiedPositions.has(finalPositions.column)) return;
        if (!stepStartTimestamp) startMoving = true;
    } else if (direction === 'left') {
        if (finalPositions.column === 0) return;
        if (lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column - 1)) return;
        if (!stepStartTimestamp) startMoving = true;
    } else if (direction === 'right') {
        if (finalPositions.column === columns - 1) return;
        if (lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column + 1)) return;
        if (!stepStartTimestamp) startMoving = true;
    }
    moves.push(direction);
}

function animate(timestamp) {
    requestAnimationFrame(animate);

    if (!previousTimestamp) previousTimestamp = timestamp;
    const delta = timestamp - previousTimestamp;
    previousTimestamp = timestamp;

    // Animate cars and trucks moving on the lane
    lanes.forEach(lane => {
        if (lane.type === 'car' || lane.type === 'truck') {
            const aBitBeforeTheBeginingOfLane = -boardWidth * zoom / 2 - positionWidth * 2 * zoom;
            const aBitAfterTheEndOFLane = boardWidth * zoom / 2 + positionWidth * 2 * zoom;
            lane.vechicles.forEach(vechicle => {
                if (lane.direction) {
                    vechicle.position.x = vechicle.position.x < aBitBeforeTheBeginingOfLane ? aBitAfterTheEndOFLane : vechicle.position.x -= lane.speed / 16 * delta;
                } else {
                    vechicle.position.x = vechicle.position.x > aBitAfterTheEndOFLane ? aBitBeforeTheBeginingOfLane : vechicle.position.x += lane.speed / 16 * delta;
                }
            });
        }
    });

    if (startMoving) {
        stepStartTimestamp = timestamp;
        startMoving = false;
    }

    if (stepStartTimestamp) {
        const moveDeltaTime = timestamp - stepStartTimestamp;
        const moveDeltaDistance = Math.min(moveDeltaTime / stepTime, 1) * positionWidth * zoom;
        const jumpDeltaDistance = Math.sin(Math.min(moveDeltaTime / stepTime, 1) * Math.PI) * 8 * zoom;
        switch (moves[0]) {
            case 'forward':
                {
                    const positionY = currentLane * positionWidth * zoom + moveDeltaDistance;
                    camera.position.y = initialCameraPositionY + positionY;
                    dirLight.position.y = initialDirLightPositionY + positionY;
                    chicken.position.y = positionY; // initial chicken position is 0

                    chicken.position.z = jumpDeltaDistance;
                    break;
                }
            case 'backward':
                {
                    positionY = currentLane * positionWidth * zoom - moveDeltaDistance
                    camera.position.y = initialCameraPositionY + positionY;
                    dirLight.position.y = initialDirLightPositionY + positionY;
                    chicken.position.y = positionY;

                    chicken.position.z = jumpDeltaDistance;
                    break;
                }
            case 'left':
                {
                    const positionX = (currentColumn * positionWidth + positionWidth / 2) * zoom - boardWidth * zoom / 2 - moveDeltaDistance;
                    camera.position.x = initialCameraPositionX + positionX;
                    dirLight.position.x = initialDirLightPositionX + positionX;
                    chicken.position.x = positionX; // initial chicken position is 0
                    chicken.position.z = jumpDeltaDistance;
                    break;
                }
            case 'right':
                {
                    const positionX = (currentColumn * positionWidth + positionWidth / 2) * zoom - boardWidth * zoom / 2 + moveDeltaDistance;
                    camera.position.x = initialCameraPositionX + positionX;
                    dirLight.position.x = initialDirLightPositionX + positionX;
                    chicken.position.x = positionX;

                    chicken.position.z = jumpDeltaDistance;
                    break;
                }
        }
        // Once a step has ended
        if (moveDeltaTime > stepTime) {
            switch (moves[0]) {
                case 'forward':
                    {
                        currentLane++;
                        counterDOM.innerHTML = currentLane;
                        break;
                    }
                case 'backward':
                    {
                        currentLane--;
                        counterDOM.innerHTML = currentLane;
                        break;
                    }
                case 'left':
                    {
                        currentColumn--;
                        break;
                    }
                case 'right':
                    {
                        currentColumn++;
                        break;
                    }
            }
            moves.shift();
            // If more steps are to be taken then restart counter otherwise stop stepping
            stepStartTimestamp = moves.length === 0 ? null : timestamp;
        }
    }

    // Hit test
    if (lanes[currentLane].type === 'car' || lanes[currentLane].type === 'truck') {
        const chickenMinX = chicken.position.x - chickenSize * zoom / 2;
        const chickenMaxX = chicken.position.x + chickenSize * zoom / 2;
        const vechicleLength = { car: 60, truck: 105 }[lanes[currentLane].type];
        lanes[currentLane].vechicles.forEach(vechicle => {
            const carMinX = vechicle.position.x - vechicleLength * zoom / 2;
            const carMaxX = vechicle.position.x + vechicleLength * zoom / 2;
            if (chickenMaxX > carMinX && chickenMinX < carMaxX) {
                contador = contador + 1;
                endDOM.style.visibility = 'visible';
                if (contador == 1) {
                    puntos = currentLane;
                    firebase.auth().onAuthStateChanged((user) => {
                        const game = {
                            nombre: user.displayName,
                            email: user.email,
                            foto: user.photoURL,
                            puntos: parseInt(puntos),
                        }
                        verificarExistenciaDelJugador(game);
                    });

                }
            }
        });

    }

    const verificarExistenciaDelJugador = (game) => {

        const buscarJuego = db.collection('col-crossy-road')
            .doc(game.email);

        buscarJuego.get().then((doc) => {
            if (!doc.exists) {
                registrarScore(game);
            } else {
                actualizarScore(doc.id)
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    function registrarScore(game) {

        return new Promise((resolve, reject) => {
            db.collection('col-crossy-road').doc(game.email).set(game)
                .then(function(docRef) {
                    resolve(game)
                    Swal.fire({
                        icon: 'success',
                        title: 'Echo',
                        html: `Se han guardado <strong>${game.puntos}</strong> puntos en la lista de scores`,
                        confirmButtonText: 'Aceptar',
                    });
                })
                .catch(function(error) {
                    reject(error)
                })
        });
    }

    function actualizarScore(id) {
        puntos = currentLane;
        game = db.collection("col-crossy-road").doc(id)

        game.get().then((doc) => {
            if (doc.exists) {
                if (parseInt(puntos) > doc.data().puntos) {
                    game.set({
                        puntos: parseInt(puntos),
                    }, { merge: true });
                    Swal.fire({
                        icon: 'success',
                        title: 'Echo',
                        html: `Se han guardado <strong>${puntos}</strong> puntos en la lista de scores`,
                        confirmButtonText: 'Aceptar',
                    });
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);