const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Işık
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

// Yıldızlar
const starGeo = new THREE.BufferGeometry();
const starCount = 9000;
const starPos = [];

for (let i = 0; i < starCount; i++) {
  starPos.push(
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000
  );
}

starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));

const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff })
);

scene.add(stars);

// Duraklar
const loader = new THREE.TextureLoader();

const stops = [
  { name: "Ay", desc: "Sessiz gri yüzey...", img: "assets/images/1.jpg", pos: [0, 0, 0] },
  { name: "Mars", desc: "Kızıl gezegeni, belki 2. evimiz..", img: "assets/images/2.png", pos: [300, 120, -200] },
  { name: "Jüpiter", desc: "Dev gaz küresi, güneş sisteminin abisi.", img: "assets/images/3.jpg", pos: [-300, -80, -400] },
  { name: "Satürn", desc: "Halkaların dansı...", img: "assets/images/4.jpg", pos: [500, 200, -700] },
  { name: "Nebula", desc: "Yıldız doğum yeri...", img: "assets/images/5.jpg", pos: [-500, 50, -900] },
  { name: "Karadelik", desc: "Işığın bile kaçamadığı, fizik kanunlarının hiçe sayıldığı o yer...", img: "assets/images/6.jpeg", pos: [200, -200, -1200] },
  { name: "Galaksi Merkezi", desc: "Her şeyin kalbi...", img: "assets/images/7.jpg", pos: [0, 0, -1600], final: true }
];

const objects = [];
let index = 0;

// Objeler
stops.forEach(s => {
  const tex = loader.load(s.img);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(45, 32, 32),
    new THREE.MeshStandardMaterial({ map: tex })
  );

  mesh.position.set(...s.pos);
  scene.add(mesh);
  objects.push(mesh);
});

camera.position.z = 500;

// START
function startJourney() {
  document.getElementById("ui").style.display = "none";
  document.getElementById("bgm").play();
  nextStop();
}

// NEXT STOP
function nextStop() {

  navigator.vibrate?.(25);

  document.body.style.filter = "brightness(2)";
  setTimeout(() => document.body.style.filter = "none", 150);

  if (index >= stops.length) return;

  const stop = stops[index];

  document.getElementById("card").style.display = "block";
  document.getElementById("title").innerText = stop.name;
  document.getElementById("desc").innerText = stop.desc;

  gsap.to(camera.position, {
    x: stop.pos[0],
    y: stop.pos[1],
    z: stop.pos[2] + 150,
    duration: 3,
    ease: "power2.inOut"
  });

  const btn = document.getElementById("nextBtn");

  if (stop.final) {
    btn.innerText = "Yolculuğu Bitir";
    btn.onclick = finishJourney;
  } else {
    btn.innerText = "Sıradaki Durak";
    btn.onclick = nextStop;
  }

  index++;
}

// FINAL
function finishJourney() {
  document.getElementById("card").innerHTML = `
    <h2>Yolculuk Bitti</h2>
    <p>Barıştık mı?</p>
    <button onclick="answer(true)">Evet</button>
    <button onclick="answer(false)">Hayır</button>
  `;
}

// ANSWER
function answer(val) {

  if (val) {

    navigator.vibrate?.(100);

    document.getElementById("card").innerHTML = `
      <h2>🚀 Güzel</h2>
      <p>Yolculuk tamamlandı.</p>
    `;

    gsap.to(camera.position, {
      z: camera.position.z - 600,
      duration: 4,
      ease: "power2.inOut"
    });

    gsap.to(stars.rotation, {
      y: 10,
      duration: 4
    });

  } else {

    navigator.vibrate?.([100, 50, 100]);

    document.getElementById("card").innerHTML = `
      <h2>...</h2>
      <p>Yolculuk sona erdi.</p>
    `;

    gsap.to(camera.position, {
      z: -2500,
      duration: 4
    });

    gsap.to(stars.material, {
      opacity: 0,
      duration: 3
    });

    gsap.to(document.body, {
      backgroundColor: "#000",
      duration: 3
    });
  }
}

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0002;

  objects.forEach(o => o.rotation.y += 0.002);

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LOADING
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 1200);
};