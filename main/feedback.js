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

// feedback
function render_element(styles, el) {
  for (const [kk, vv] of Object.entries(styles)) {
    el.style[kk] = vv;
  }
}

const mouses = document.querySelectorAll('.fb-emote__smile');
const left_eyes = document.querySelectorAll('.fb-emote__eye--left');
const right_eyes = document.querySelectorAll('.fb-emote__eye--right');

const faces = document.querySelectorAll('.fb-emote');

const cover = document.querySelector('.fb-active-emote');

const bar_length = 574;

var last_face = faces[2];
// record as submission
var last_face_index = 2;

function face_cover_animate(
  position_callback,
  expression_callback,
){
  // vanish
  cover.style.animation = 'face_vanish 0.5s';
  setTimeout(()=>{
    cover.style.display = 'none';
    // callback change the relative positioning
    position_callback();
    // callback change the facial expression
    expression_callback();
    cover.style.display = 'block';
    // appear
    cover.style.animation = 'face_appear 0.5s';
    setTimeout(()=>{
      cover.style.animation = 'none';
    }, 500);
  }, 450);
}

// change active svg in absolute positioning as cover
function face_cover_expression_change(ind){
  const cover_paths = cover.querySelectorAll('path');
  cover_paths[0].setAttribute('d', left_eyes[ind].getAttribute('d'));
  cover_paths[1].setAttribute('d', right_eyes[ind].getAttribute('d'));
  cover_paths[2].setAttribute('d', mouses[ind].getAttribute('d'));
}

// grey face and font below color and size
function assign_last_face(ind){
  last_face.classList.remove('s--active');
  last_face = faces[ind];
  last_face_index = ind;
  last_face.classList.add('s--active');
}

faces[0].addEventListener('click', ()=>{
  assign_last_face(0);
  face_cover_animate(
    ()=>{cover.style.left = '-50%'},
    ()=>{face_cover_expression_change(0)}
  );
});

faces[1].addEventListener('click', ()=>{
  assign_last_face(1);
  face_cover_animate(
    ()=>{cover.style.left = '-25%'},
    ()=>{face_cover_expression_change(1)}
  );
});

faces[2].addEventListener('click', ()=>{
  assign_last_face(2);
  face_cover_animate(()=>{
    cover.style.left = '0'},
    ()=>{face_cover_expression_change(2)}
  );
});

faces[3].addEventListener('click', ()=>{
  assign_last_face(3);
  face_cover_animate(
    ()=>{cover.style.left = '25%'},
    ()=>{face_cover_expression_change(3)}
  );
});

faces[4].addEventListener('click', ()=>{
  assign_last_face(4);
  face_cover_animate(
    ()=>{cover.style.left = '50%'},
    ()=>{face_cover_expression_change(4)}
  );
});

// message
class InfoPiece{
  constructor(
    bg, 
    color,
    fontSize,
    width_percent,
    padding, 
    borderRadius,
    marginBottom,
    timeOut,
    content,
    clickCallback,
  ){
    this.bg = bg;
    this.color = color;
    this.fontSize = fontSize;
    this.width_percent = width_percent;
    this.padding = padding;
    this.borderRadius = borderRadius;
    this.marginBottom = marginBottom;
    this.timeOut = timeOut;
    this.content = content;
    this.clickCallback = clickCallback;

    [
      this.el,
      this.text_wrapper,
      this.btn_wrapper,
    ] = Array.from({length: 3}, ii=>document.createElement('div'));
    this.el.appendChild(this.text_wrapper);
    this.el.appendChild(this.btn_wrapper);
    render_element({
      color: this.color,
      padding: this.padding,
      fontSize: this.fontSize,
      marginBottom: this.marginBottom,
      left: (50 - this.width_percent / 2).toString() + '%',
      width: this.width_percent.toString() + "%",
      background: this.bg,
      zIndex: '10000000000',
      borderRadius: this.borderRadius,
      display: 'none',
      flexDirection: 'row',
      alignItems: 'center',
      opacity: '0',
      transition: 'opacity 500ms ease-out',
    }, this.el);
    render_element({
      width: `calc(100% - ${this.fontSize})`,
    }, this.text_wrapper);
    this.text_wrapper.innerHTML = this.content;
    render_element({
      width: this.fontSize,
      height: this.fontSize,
      fontSize: this.fontSize,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }, this.btn_wrapper);
    this.btn_wrapper.innerHTML = '<i class="fas fa-times-circle"></i>';
    this.dismiss_btn = this.btn_wrapper.querySelector('i');
    this.dismiss_btn.style.cursor = 'pointer';

    this.fade_in = this.fade_in.bind(this);
    this.fade_out = this.fade_out.bind(this);

    this.btn_mouseenter = this.btn_mouseenter.bind(this);
    this.btn_mouseleave = this.btn_mouseleave.bind(this);
    this.btn_click = this.btn_click.bind(this);
    this.dismiss_btn.addEventListener('mouseenter', this.btn_mouseenter);
    this.dismiss_btn.addEventListener('mouseleave', this.btn_mouseleave);
    this.dismiss_btn.addEventListener('click', this.btn_click);

    this.mouseenter = this.mouseenter.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
    this.el.addEventListener('mouseenter', this.mouseenter);
    this.el.addEventListener('mouseleave', this.mouseleave);

    this.becomeChildOf = this.becomeChildOf.bind(this);
    this.removeChildFrom = this.removeChildFrom.bind(this);
    
    this.fade_in();
    this.hovered = false;
  }

  fade_in(){
    this.el.style.display = 'flex';
    setTimeout(()=>{
      this.el.style.opacity = '1';
    }, 0);
  }

  fade_out(){
    this.el.style.opacity = '0';
    setTimeout(()=>{
      this.el.style.display = 'none';
    }, 350);
  }

  btn_mouseenter(){
    this.dismiss_btn.style.color = 'black';
  }

  btn_mouseleave(){
    this.dismiss_btn.style.color = 'white';
  }

  btn_click(){
    this.fade_out();
    this.clickCallback();
  }

  mouseenter(){
    this.hovered = true;
    this.el.style.opacity = '0.75';
  }

  mouseleave(){
    this.el.style.opacity = '1';
  }

  becomeChildOf(parent_el){
    this.parent_el = parent_el;
    this.parent_el.appendChild(this.el);

    setTimeout(()=>{
      if(!this.hovered)new Info().removeInfo(this);
    }, this.timeOut);
  }

  removeChildFrom(){
    this.parent_el.removeChild(this.el);
    this.parent_el = null;
  }
}

var info_config = {
  fontSize: '1.5em',
  width_percent: 100,
  padding: '10px',
  borderRadius: '15px',
  marginBottom: '15px',
  timeOut: 5000,
};

class InfoWarn extends InfoPiece{
  constructor(content, click){
    super("orange", "white", info_config.fontSize, info_config.width_percent, info_config.padding, info_config.borderRadius, info_config.marginBottom, info_config.timeOut, content, click);
  }
}

class InfoError extends InfoPiece{
  constructor(content, click){
    super("pink", "black", info_config.fontSize, info_config.width_percent, info_config.padding, info_config.borderRadius, info_config.marginBottom, info_config.timeOut, content, click);
  }
}

class InfoMessage extends InfoPiece{
  constructor(content, click){
    super("skyblue", "black", info_config.fontSize, info_config.width_percent, info_config.padding, info_config.borderRadius, info_config.marginBottom, info_config.timeOut, content, click);
  }
}

class InfoNotice extends InfoPiece{
  constructor(content, click){
    super("green", "white", info_config.fontSize, info_config.width_percent, info_config.padding, info_config.borderRadius, info_config.marginBottom, info_config.timeOut, content, click);
  }
}

class Info{
  constructor(){
    if(Info._instance)return Info._instance;
    this.info = [];
    this.el = document.createElement('div');
    render_element({
      position: 'fixed',
      top: '0',
      left: "15%",
      width: '70%',
      zIndex: '2000000000000',
    }, this.el);
    document.body.appendChild(this.el);
    this.addInfo = this.addInfo.bind(this);
    this.popInfo = this.popInfo.bind(this);
    this.removeInfo = this.removeInfo.bind(this);
    Info._instance = this;
  }

  addInfo(category, content, callback){
    switch(category){
      case "warn":
        this.info.push(new InfoWarn(content, callback));
      break;

      case "error":
        this.info.push(new InfoError(content, callback));
      break;

      case "message":
        this.info.push(new InfoMessage(content, callback));
      break;

      case "notice":
        this.info.push(new InfoNotice(content, callback));
      break;
    }
    this.info[this.info.length - 1].becomeChildOf(this.el);
  }

  popInfo(ind=null){
    var info = this.info.splice(ind == null ? this.info.length - 1 : ind, 1)[0];
    info.fade_out();
    setTimeout(()=>{
      info.removeChildFrom();
    }, 400);
  }

  removeInfo(info){
    this.popInfo(this.info.indexOf(info));
  }
}

const feedback_submit_btn = document.querySelector('#feedback-submit');
const feedback_textarea = document.querySelector("#feedback-texarea");

feedback_submit_btn.addEventListener('click', ()=>{
  try{
    var attitude = last_face_index;
    var json_data = {
      attitude: attitude,
      satisfaction: ['Terrible', 'Bad', 'Okay', 'Good', 'Great'][attitude],
      feedback: feedback_textarea.value,
    };
    // backend
    throw new Error('Sorry, there is no database connection to this application yet');
  }catch(e){
    new Info().addInfo(
      'error',
      e.message,
      ()=>{},
    );
  }
});

// new Info().addInfo(
//   'warn',
//   "Failed to load resource: the server responded with a status of 404 (Not Found)", // content
//   ()=>{},
// );

// setTimeout(()=>{
//   new Info().addInfo(
//     'message',
//     "Failed to load resource: the server responded with a status of 404 (Not Found)", // content
//     ()=>{},
//   );

//   setTimeout(()=>{
//     new Info().addInfo(
//       'error',
//       "Failed to load resource: the server responded with a status of 404 (Not Found)", // content
//       ()=>{},
//     );

//     setTimeout(()=>{
//       new Info().addInfo(
//         'notice',
//         "Failed to load resource: the server responded with a status of 404 (Not Found)", // content
//         ()=>{},
//       );
//     }, 500);
//   }, 500);
// }, 500);