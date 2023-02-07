const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const effect = document.querySelector(".effect-partciples");
const canvasHandler = document.querySelector(".photo");
canvas.width = canvasHandler.offsetWidth;
canvas.height = canvasHandler.offsetHeight;

let prevMouse = {
  x: effect.offsetWidth / 2,
  y: effect.offsetHeight / 2,
};


const particles = [];

class Particle {
  constructor(x, y, velocity, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

function outOfBounds(particle) {
  return (
    particle.x > canvas.width + particle.radius ||
    particle.x < -particle.radius ||
    particle.y > canvas.height + particle.radius ||
    particle.y < -particle.radius
  );
}

function calcNumber() {
  switch (true) {
    case window.innerWidth < 576:
      return 40;
    case window.innerWidth < 768:
      return 50;
    case window.innerWidth < 992:
      return 60;
    default:
      return 90;
  }
}

let settings = {
  particles: {
    draw: true,
    number: calcNumber(),
    size: 2,
    speed: 0.6,
    color: "rgba(255,255,255,0.25)",
    effects: {
      followMouse: {
        active: true,
        followBy: 0.12  ,
      },
    },
  },
  line: {
    draw: true,
    size: 2,
    radius: 100,
    color: "rgba(255,255,255,0.25)",
  },
};

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  settings.particles.effects.followMouse.active = false;
}

window.addEventListener("resize", () => {
  canvas.width = canvasHandler.offsetWidth;
  canvas.height = canvasHandler.offsetHeight;
  settings.particles.number = calcNumber();
  if (particles.length > settings.particles.number) {
    particles.splice(
      settings.particles.number,
      particles.length - settings.particles.number
    );
  } else if (particles.length < settings.particles.number) {
    addParticles(settings.particles.number - particles.length);
  }
});



function addParticles(particlesNumber) {
  for (var i = 0; i < particlesNumber; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    const velocity = {
      x: (Math.random() * (1 + 1) - 1) * settings.particles.speed,
      y: (Math.random() * (1 + 1) - 1) * settings.particles.speed,
    };
    particles.push(
      new Particle(
        x,
        y,
        velocity,
        settings.particles.size,
        settings.particles.color
      )
    );
  }
}
function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
   
    if (outOfBounds(particles[i])) {
      particles.splice(i, 1);
      addParticles(1);
    }

    if (particles[i].x > canvas.width || particles[i].x < 0) {
      particles[i].velocity.x = -particles[i].velocity.x;
    }
    if (particles[i].y > canvas.height || particles[i].y < 0) {
      particles[i].velocity.y = -particles[i].velocity.y;
    }
    if (settings.line.draw) {
      for (let j = i; j < particles.length; j++) {
        let dist = Math.hypot(
          particles[i].x - particles[j].x,
          particles[i].y - particles[j].y
        );
        if (
          dist - particles[i].radius - particles[j].radius <
          settings.line.radius
        ) {
          ctx.strokeStyle = settings.line.color;
          ctx.lineWidth = settings.line.size;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }
  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {

  if(settings.particles.effects.followMouse.active )

  setTimeout(() => {
    moving = true;

    let dx = e.clientX - prevMouse.x;
    let dy = e.clientY - prevMouse.y;
  
    particles.forEach((particle) => {
      particle.x =
        particle.x + dx * settings.particles.effects.followMouse.followBy;
      particle.y =
        particle.y + dy * settings.particles.effects.followMouse.followBy;
    });
  
    prevMouse = {
      x: e.clientX,
      y: e.clientY,
    };
  }, 100);
  }
);


addParticles(settings.particles.number);
animate();

