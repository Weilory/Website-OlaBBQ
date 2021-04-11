const ola_paths = document.querySelectorAll('#ola path');
const bbq_paths = document.querySelectorAll('#bbq path');

function hide_paths(lg) {
  lg.forEach(the_path => {
    the_path.style.animation = 'none';
    the_path.style.display = 'none';
  });
}

function show_paths_slow(lg) {
  var fs = 0;
  lg.forEach(the_path => {
    the_path.style.animation = `anime 2s ease forwards ` + fs + 's';
    fs += 0.3;
    setTimeout(() => {
      the_path.style.display = 'block';
    }, fs * 1000);
  });
}

function show_paths_fast(lg) {
  var fs = 0;
  lg.forEach(the_path => {
    the_path.style.animation = `anime 1s ease forwards ` + fs + 's';
    fs += 0.15;
    setTimeout(() => {
      the_path.style.display = 'block';
    }, fs * 500);
  });
}

window.addEventListener('load', () => {
  [ola_paths, bbq_paths].forEach(paths => {
    paths.forEach(the_path => {
      var len = the_path.getTotalLength();
      the_path.style.strokeDasharray = len;
      the_path.style.strokeDashoffset = len;
    });
  });
  hide_paths(ola_paths);
  hide_paths(bbq_paths);
  show_paths_slow(ola_paths);
  show_paths_fast(bbq_paths);
});

// grill opacity
const grill = document.querySelector('#grill');
window.addEventListener('load', () => {
  grill.style.transition = 'opacity 4s ease-in';
  grill.style.opacity = '1';
});

// nav bar
const [
  nav_about,
  nav_services,
  nav_feedback,
] = ['nav-about', 'nav-services', 'nav-feedback'].map(str=>document.getElementById(str));

// nav stripe nav animation
window.addEventListener('load', () => {
  nav_about.style.opacity = '1';
  nav_services.style.opacity = '1';
  nav_feedback.style.opacity = '1';

  nav_about.style.transform = 'skew(-20deg) translate(0, -250px)';
  nav_services.style.transform = 'skew(-20deg) translate(0, -250px)';
  nav_feedback.style.transform = 'skew(-20deg) translate(0, -250px)';

  nav_about.style.display = 'flex';
  nav_services.style.display = 'flex';
  nav_feedback.style.display = 'flex';

  setTimeout(()=>{
    nav_about.style.transform = 'skew(-20deg)';
    setTimeout(()=>{
      nav_services.style.transform = 'skew(-20deg)';
        setTimeout(()=>{
          nav_feedback.style.transform = 'skew(-20deg)';
        }, 500);
    }, 500);
  }, 0);
});

// carousel
const jpg_filenames = Array.from({length: 18}, (ii, dd)=>`bbq${dd+1}`);

var front_images, back_images;

const jpg_wrapper = filename => 'img/carousel/' + filename + '.jpg';

function assign_dummy_images(val){
  front_images = jpg_filenames.slice(0, val).map(filename=>jpg_wrapper(filename));
  back_images = jpg_filenames.slice(val, val + val).map(filename=>jpg_wrapper(filename));
}

const riding = 9;

assign_dummy_images(riding);

const carousel = document.querySelector('.slider-content');

const polySideLength = (n, radius) => Math.abs(Math.sin(Math.PI / n) * radius * 2);
const polySideDegree = n => Array.from({length: n}, (xx, ii) => ii * 360 / n);

// states are images that rotating normally
function setUpHouses(degs, radius, width){
  // remove all child from carousel
  while (carousel.firstChild) {
      carousel.firstChild.remove();
  }
  for(let ii = 0; ii < riding; ii++){
    let horse = document.createElement('div');
    horse.setAttribute('class', 'shadow');
    horse.style.transform = `rotateY(${degs[ii]}deg) translateZ(${radius}px)`;
    horse.style.width = `${width}px`;

    let horse_state = document.createElement('img');
    horse_state.src = front_images[ii];
    horse.appendChild(horse_state);

    let horse_hover_state = document.createElement('img');
    horse_hover_state.src = back_images[ii];
    horse.appendChild(horse_hover_state);

    carousel.appendChild(horse);

    horse.addEventListener('mouseenter', ()=>{
      horse_state.style.display = 'none';
      horse_hover_state.style.transform = 'scale(1.2)';
    });

    horse.addEventListener('mouseleave', ()=>{
      horse_hover_state.style.transform = 'none';
      setTimeout(()=>{
        horse_state.style.display = 'block';
      }, 600);
    });
  }
}

function loadHouse(){
  setUpHouses(
  degs=polySideDegree(riding),
  radius=1/3*window.innerWidth,
  width=0.8*polySideLength(riding, 1/3*window.innerWidth),
  );
}

window.addEventListener('load', loadHouse);
window.addEventListener('resize', loadHouse);






















