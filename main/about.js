/*
video scraped from https://m.facebook.com/pg/olabrasilrestaurant/videos/
*/ 


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

// random
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// color scheme
class RGBA{
  static ensix(val){
    return val < 0 ? 0 : val > 255 ? 255 : val;
  }
 
  constructor(
    r,
    g,
    b,
  ){
    this.r = r;
    this.g = g;
    this.b = b;

    this.rgb = this.rgb.bind(this);
    this.rgba = this.rgba.bind(this);
  }

  rgb(dif=0){
    return `rgb(${RGBA.ensix(this.r + dif)},${RGBA.ensix(this.g + dif)},${RGBA.ensix(this.b + dif)})`
  }

  rgba(a, dif=0){
      return `rgb(${RGBA.ensix(this.r + dif)},${RGBA.ensix(this.g + dif)},${RGBA.ensix(this.b + dif)},${a})`
  }
}

// show hide
/*
element wrapper
then call element.show() and element.hide()
to alter visibility with transition
*/

class SH{
  /*
  add element method and return element
  */
  constructor(
    el, // HTMLElement
    dis, // block/flex
    appear // bool: init by (appear === true ? show : hide)
  ){
    this.el = el;
    this.dis = dis;
    this.appear = appear;
    if(appear){
      this.el.style.display = this.dis;
    }else{
      this.el.style.display = "none";
      // since effect is triggered in hiding by toggling class
      // prepare animation for removing class
      this.hide();
    }
    /* 
    manually assign el transition to
      all 500ms !important
    in style sheets
    */
    el.hide = this.hide = this.hide.bind(this);
    el.show = this.show = this.show.bind(this);
    el.turn = this.turn = this.turn.bind(this);
  }

  hide(){
    setTimeout(()=>{
      this.el.style.display = "none";
    }, 500);
    this.appear = false;
  }

  show(){
    this.el.style.display = this.dis;
    this.appear = true;
  }

  turn(){
    if(this.appear){
      this.hide();
    }else{
      this.show();
    }
  }
}

class SR extends SH{
  /*
  scale and rotate
  */
  constructor(el, dis, appear){super(el, dis, appear);}

  hide(){
    this.el.classList.add('page-rotate-trans');
    super.hide();
  }

  show(){
    super.show();
    setTimeout(()=>{
      this.el.classList.remove('page-rotate-trans');
    }, 200);
  }
}

class BS extends SH{
  /*
  border radius and scale
  */
  constructor(el, dis, appear){super(el, dis, appear);}

  hide(){
    this.el.classList.add('page-border-trans');
    this.el.classList.add('page-scale-trans');
    super.hide();
  }

  show(){
    super.show();
    setTimeout(()=>{
      this.el.classList.remove('page-scale-trans');
      this.el.classList.remove('page-border-trans');
    }, 200);
  }
}

class RT extends SH{
  /*
  right and top shrink
  */
  constructor(el, dis, appear){
    super(el, dis, appear);
    this.el.classList.add('page-pre-top-center-trans');
  }
    
  hide(){
    this.el.classList.add('page-scale-trans');
    this.el.classList.add('page-rotate-trans');
    super.hide();
  }

  show(){
    super.show();
    setTimeout(()=>{
      this.el.classList.remove('page-scale-trans');
      this.el.classList.remove('page-rotate-trans');
    }, 200);
  }
}

class ShowHide{
  constructor(el, dis, appear){
    var cls = [
      SR,
      BS,
      RT,
    ];

    // return a random effect from cls array
    return new cls[Math.floor(Math.random() * cls.length)](el, dis, appear);
  }
}

// about
function render_element(styles, el) {
  for (const [kk, vv] of Object.entries(styles)) {
    el.style[kk] = vv;
  }
}

class VSlide{
  constructor(
    width_px,
    height_px,
    video_height_percent,
    padding_percent, 
    video_up, // bool
    src, // link to video source
    text, // string to display
    appear, // bool, whether to display when declared
    r,
    g,
    b,
  ){
    this.width = width_px;
    this.height = height_px;
    this.vheight = width_px * video_height_percent / 100;
    this.padding = padding_percent;
    this.vup = video_up;
    this.src = src;
    this.text = text;
    this.appear = appear;
    this.theme = new RGBA(r, g, b);

    [
      this.el,
      this.fr_up,
      this.fr_down, 
    ] = Array.from({length: 3}, ii=>document.createElement('div'));

    render_element({
      display: 'flex',
      flexDirection: 'column',
      width: this.width.toString() + 'px',
      height: this.height.toString() + 'px',
      transition: 'all 0.5s ease-in-out',
    }, this.el);
    render_element({
      width: '100%',
      height: (this.vup ? this.vheight : this.height - this.vheight).toString() + 'px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.theme.rgb(20),
    }, this.fr_up);
    render_element({
      width: '100%',
      height: (this.vup ? this.height - this.vheight : this.vheight).toString() + 'px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.theme.rgb(40),
    }, this.fr_down);

    this.el.appendChild(this.fr_up);
    this.el.appendChild(this.fr_down);

    this.sh = new ShowHide(
      this.el,
      'flex',
      this.appear,
    );

    [
      this.video_wrapper,
      this.text_wrapper,
    ] = Array.from({length: 2}, ii=>document.createElement('div'));
    this.fr_up.appendChild(this.vup ? this.video_wrapper : this.text_wrapper);
    this.fr_down.appendChild(this.vup ? this.text_wrapper : this.video_wrapper);

    render_element({
      width: (100 - this.padding).toString() + '%',
      height: (100 - this.padding).toString() + '%',
      transition: 'all 500ms ease-in-out',
      boxShadow: `-5px -10px 5px ${this.theme.rgb(-100)}, 5px 10px 5px ${this.theme.rgb(-50)}`,
    }, this.video_wrapper);

    render_element({
      width: (100 - this.padding).toString() + '%',
      height: (100 - this.padding).toString() + '%',
      transition: 'all 500ms ease-in-out',
      boxShadow: `-5px -10px 5px ${this.theme.rgb(-100)}, 5px 10px 5px ${this.theme.rgb(-50)}`,
    }, this.text_wrapper);

    this.fr_up_sh = new ShowHide(
      this.video_wrapper,
      'block',
      this.appear,
    );

    this.fr_down_sh = new ShowHide(
      this.text_wrapper,
      'block',
      this.appear,
    );

    this.video_el = document.createElement('video');
    this.video_el.setAttribute('width', '100%');
    this.video_el.setAttribute('height', '100%');
    this.video_el.controls = true;

    this.source_el = document.createElement('source');
    this.source_el.setAttribute('src', this.src);
    this.source_el.setAttribute('type', `video/${this.src.split('.').pop()}`);
    this.error_el = document.createElement('h2');
    this.error_el.innerHTML = 'Sorry, your browser does not support video tag';
    this.video_el.appendChild(this.source_el);
    this.video_el.appendChild(this.error_el);
    if(this.appear){
      this.video_wrapper.appendChild(this.video_el);
    }

    this.text_el = document.createElement('div');
    render_element({
      width: '100%',
      height: '100%',
      fontSize: '1.5em',
      textIndent: '1.5em',
      lineHeight: '1.8em',
      textShadow: '2px 2px 2px lightgray',
      fontStyle: 'italic',
      overflow: 'auto',
      background: this.theme.rgb(50),
    }, this.text_el);
    this.text_el.innerHTML = this.text;
    this.text_wrapper.appendChild(this.text_el);

    this.config = this.config.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.turn = this.turn.bind(this);
    this.becomeChildOf = this.becomeChildOf.bind(this);
  }

  config(
    width_px,
    height_px,
    video_height_percent,
    padding_percent,
  ){
    this.width = width_px;
    this.height = height_px;
    this.vheight = width_px * video_height_percent / 100;
    this.padding = padding_percent;
    this.el.style.width = this.width.toString() + 'px';
    this.el.style.height = this.height.toString() + 'px';
    this.fr_up.style.height = (this.vup ? this.vheight : this.height - this.vheight).toString() + 'px';
    this.fr_down.style.height = (this.vup ? this.height - this.vheight : this.vheight).toString() + 'px';
    this.video_wrapper.width = (100 - this.padding).toString() + '%';
    this.video_wrapper.height = (100 - this.padding).toString() + '%';
    this.text_wrapper.width = (100 - this.padding).toString() + '%';
    this.text_wrapper.height = (100 - this.padding).toString() + '%';
  }

  show(){
    this.sh.show();
    setTimeout(()=>{
      this.fr_up_sh.show();
      this.fr_down_sh.show();
      // IOS video support
      this.video_wrapper.appendChild(this.video_el);
    }, 500);
    this.appear = true;
  }

  hide(){
    this.video_wrapper.removeChild(this.video_el);
    this.fr_up_sh.hide();
    this.fr_down_sh.hide();
    setTimeout(()=>{
      this.sh.hide();
      // IOS video support
    }, 500);
    this.appear = false;
  }

  turn(){
    if(this.appear){
      this.hide();
    }else{
      this.show();
    }
  }

  becomeChildOf(parent_el){
    this.parent_el = parent_el;
    this.parent_el.appendChild(this.el);
  }
}

class HSlide{
  constructor(
    width_px,
    height_px,
    video_width_percent,
    padding_percent, 
    video_left, // bool
    src, // link to video source
    text, // string to display
    appear, // bool, whether to display when declared
    r,
    g,
    b,
  ){
    this.width = width_px;
    this.height = height_px;
    this.vwidth = height_px * video_width_percent / 100;
    this.padding = padding_percent;
    this.vleft = video_left;
    this.src = src;
    this.text = text;
    this.appear = appear;
    this.theme = new RGBA(r, g, b);

    [
      this.el,
      this.fr_left,
      this.fr_right, 
    ] = Array.from({length: 3}, ii=>document.createElement('div'));

    render_element({
      display: 'flex',
      flexDirection: 'row',
      width: this.width.toString() + 'px',
      height: this.height.toString() + 'px',
      transition: 'all 0.5s ease-in-out',
    }, this.el);
    render_element({
      width: (this.vleft ? this.vwidth : this.width - this.vwidth).toString() + 'px',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.theme.rgb(20),
    }, this.fr_left);
    render_element({
      width: (this.vleft ? this.width - this.vwidth : this.vwidth).toString() + 'px',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.theme.rgb(40),
    }, this.fr_right);

    this.el.appendChild(this.fr_left);
    this.el.appendChild(this.fr_right);

    this.sh = new ShowHide(
      this.el,
      'flex',
      this.appear,
    );

    [
      this.video_wrapper,
      this.text_wrapper,
    ] = Array.from({length: 2}, ii=>document.createElement('div'));
    this.fr_left.appendChild(this.vleft ? this.video_wrapper : this.text_wrapper);
    this.fr_right.appendChild(this.vleft ? this.text_wrapper : this.video_wrapper);

    render_element({
      width: (100 - this.padding).toString() + '%',
      height: (100 - this.padding).toString() + '%',
      transition: 'all 500ms ease-in-out',
      boxShadow: `-10px -5px 10px ${this.theme.rgb(-100)}, 10px 5px 10px ${this.theme.rgb(-50)}`,
    }, this.video_wrapper);

    render_element({
      width: (100 - this.padding).toString() + '%',
      height: (100 - this.padding).toString() + '%',
      transition: 'all 500ms ease-in-out',
      boxShadow: `-10px -5px 10px ${this.theme.rgb(-100)}, 10px 5px 10px ${this.theme.rgb(-50)}`,
    }, this.text_wrapper);

    this.fr_left_sh = new ShowHide(
      this.video_wrapper,
      'block',
      this.appear,
    );

    this.fr_right_sh = new ShowHide(
      this.text_wrapper,
      'block',
      this.appear,
    );

    this.video_el = document.createElement('video');
    this.video_el.setAttribute('width', '100%');
    this.video_el.setAttribute('height', '100%');
    this.video_el.controls = true;
    this.source_el = document.createElement('source');
    this.source_el.setAttribute('src', this.src);
    this.source_el.setAttribute('type', `video/${this.src.split('.').pop()}`);
    this.error_el = document.createElement('h2');
    this.error_el.innerHTML = 'Sorry, your browser does not support video tag';
    this.video_el.appendChild(this.source_el);
    this.video_el.appendChild(this.error_el);
    if(this.appear){
      this.video_wrapper.appendChild(this.video_el);
    }

    this.text_el = document.createElement('div');
    render_element({
      width: '100%',
      height: '100%',
      fontSize: '1.5em',
      textIndent: '1.5em',
      lineHeight: '1.8em',
      textShadow: '2px 2px 2px lightgray',
      fontStyle: 'italic',
      overflow: 'auto',
      background: this.theme.rgb(50),
    }, this.text_el);
    this.text_el.innerHTML = this.text;
    this.text_wrapper.appendChild(this.text_el);

    this.config = this.config.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.turn = this.turn.bind(this);
    this.becomeChildOf = this.becomeChildOf.bind(this);
  }

  config(
    width_px,
    height_px,
    video_width_percent,
    padding_percent,
  ){
    this.width = width_px;
    this.height = height_px;
    this.vwidth = height_px * video_width_percent / 100;
    this.padding = padding_percent;
    this.el.style.width = this.width.toString() + 'px';
    this.el.style.height = this.height.toString() + 'px';
    this.fr_up.style.height = (this.vleft ? this.vwidth : this.width - this.vwidth).toString() + 'px';
    this.fr_down.style.height = (this.vleft ? this.width - this.vwidth : this.vwidth).toString() + 'px';
    this.video_wrapper.width = (100 - this.padding).toString() + '%';
    this.video_wrapper.height = (100 - this.padding).toString() + '%';
    this.text_wrapper.width = (100 - this.padding).toString() + '%';
    this.text_wrapper.height = (100 - this.padding).toString() + '%';
  }

  show(){
    this.sh.show();
    setTimeout(()=>{
      this.fr_left_sh.show();
      this.fr_right_sh.show();
        this.video_wrapper.appendChild(this.video_el);
    }, 500);
    this.appear = true;
  }

  hide(){
    this.video_wrapper.removeChild(this.video_el);
    this.fr_left_sh.hide();
    this.fr_right_sh.hide();
    setTimeout(()=>{
      this.sh.hide();
    }, 500);
    this.appear = false;
  }

  turn(){
    if(this.appear){
      this.hide();
    }else{
      this.show();
    }
  }

  becomeChildOf(parent_el){
    this.parent_el = parent_el;
    this.parent_el.appendChild(this.el);
  }
}

class Bullet{
  constructor(
    width_px,
    active,
  ){
    this.width = width_px;
    this.active = active;
    this.callbackIns = [];
    this.callbackOuts = [];

    this.el = document.createElement('div');
    render_element({
      width: this.width.toString() + 'px',
      height: this.width.toString() + 'px',
      borderRadius: '100%',
      cursor: 'pointer',
    }, this.el);

    this.mouseenter = this.mouseenter.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
    this.el.addEventListener('mouseenter', this.mouseenter);
    this.el.addEventListener('mouseleave', this.mouseleave);

    if(this.active){
      this.el.style.background = 'magenta';
      this.el.style.border = (this.width / 2).toString() + 'px solid gold';
    }else{
      this.el.style.background = 'cyan';
      this.el.style.border = (this.width / 2).toString() + 'px solid green';
    }

    this.becomeChildOf = this.becomeChildOf.bind(this);
    this.removeChildFrom = this.removeChildFrom.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.addCallbackIn = this.addCallbackIn.bind(this);
    this.addCallbackOut = this.addCallbackOut.bind(this);

    this.el.addEventListener('click', this.activate);
  }

  mouseenter(){
    if(!this.active){
      this.el.style.background = 'magenta';
      this.el.style.border = (this.width / 2).toString() + 'px solid gold';
    }
  }

  mouseleave(){
    if(!this.active){
      this.el.style.background = 'cyan';
      this.el.style.border = (this.width / 2).toString() + 'px solid green';
    }
  }

  becomeChildOf(parent_el){
    this.parent_el = parent_el;
    this.parent_el.appendChild(this.el);
  }

  removeChildFrom(){
    this.parent_el.removeChild(this.el);
    this.parent_el = null;
  }

  activate(){
    this.active = true;
    this.el.style.color = 'red';
    this.el.style.background = 'magenta';
    this.el.style.border = (this.width / 2).toString() + 'px solid gold';
    this.callbackIns.forEach(cb=>cb());
  }

  deactivate(){
    this.active = false;
    this.el.style.background = 'cyan';
    this.el.style.border = (this.width / 2).toString() + 'px solid green';
    this.callbackOuts.forEach(cb=>cb());
  }

  addCallbackIn(cb){
    this.callbackIns.push(cb);
  }

  addCallbackOut(cb){
    this.callbackOuts.push(cb);
  }
}

class Page{
  constructor(

  ){
    if(Page._instance)return Page._instance;

    this.bullets = [];
    this.shs = [];

    // static
    this.el = document.createElement('div');
    document.body.appendChild(this.el);
    [
      this.left_el,
      this.middle_el, 
      this.right_el, 
    ] = Array.from({length: 3}, ii=>{
      var el = document.createElement('div');
      this.el.appendChild(el);
      return el;
    });
    render_element({
      width: '100vw',
      height: '80vh',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    }, this.el);
    [
      this.left_el,
      this.right_el,
    ].forEach(el=>{
      render_element({
        width: '10%',
        height: '80%',
        fontSize: '4em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }, el);
    });
    this.left_el.style.background = '#b2c2bf';
    this.right_el.style.background = '#c0ded9';
    render_element({
      width: '70%',
      height: '90%',
    }, this.middle_el);

    this.left_el.innerHTML = '<i class="fas fa-arrow-alt-circle-left"></i>';
    this.right_el.innerHTML = '<i class="fas fa-arrow-alt-circle-right"></i>';
    this.left_icon = this.left_el.querySelector('i');
    this.right_icon = this.right_el.querySelector('i');
    [
      this.up_el,
      this.down_el, 
    ] = Array.from({length: 2}, ii=>{
      var el = document.createElement('div');
      this.middle_el.appendChild(el);
      return el;
    });
    render_element({
      width: '100%',
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#eaece5',
      overflow: 'hidden',
    }, this.up_el);
    render_element({
      width: '100%',
      height: '10%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: '#3b3a30',
    }, this.down_el);

    // interaction
    this.left_icon.style.cursor = 'pointer';
    this.mouseenter_left_icon = this.mouseenter_left_icon.bind(this);
    this.mouseleave_left_icon = this.mouseleave_left_icon.bind(this);
    this.left_icon.addEventListener('mouseenter', this.mouseenter_left_icon);
    this.left_icon.addEventListener('mouseleave', this.mouseleave_left_icon);

    this.right_icon.style.cursor = 'pointer';
    this.mouseenter_right_icon = this.mouseenter_right_icon.bind(this);
    this.mouseleave_right_icon = this.mouseleave_right_icon.bind(this);
    this.right_icon.addEventListener('mouseenter', this.mouseenter_right_icon);
    this.right_icon.addEventListener('mouseleave', this.mouseleave_right_icon);

    this.mouseleave_left_icon();
    this.mouseleave_right_icon();

    this.addBullet = this.addBullet.bind(this);
    this.addContent = this.addContent.bind(this);

    this.click_left = this.click_left.bind(this);
    this.click_right = this.click_right.bind(this);
    this.left_icon.addEventListener('click', this.click_left);
    this.right_icon.addEventListener('click', this.click_right);

    Page._instance = this;
  }

  mouseenter_left_icon(){
    this.left_icon.style.color = 'orchid';
  }

  mouseleave_left_icon(){
    this.left_icon.style.color = 'blue';
  }

  mouseenter_right_icon(){
    this.right_icon.style.color = 'darkorchid';
  }

  mouseleave_right_icon(){
    this.right_icon.style.color = 'red';
  }

  click_left(){
    for(let ii = 0; ii < this.bullets.length; ii++){
      if(this.bullets[ii].active){
        this.bullets[ii - 1 === -1 ? this.bullets.length - 1 : ii - 1].activate();
        return;
      }
    }
  }

  click_right(){
    for(let ii = 0; ii < this.bullets.length; ii++){
      if(this.bullets[ii].active){
        this.bullets[ii + 1 === this.bullets.length ? 0 : ii + 1].activate();
        return;
      }
    }
  }

  addBullet(
    sh, // for ShowHide object
  ){
    var bullet = new Bullet(15, this.bullets.length === 0 ? true : false);
    bullet.addCallbackIn(function(){
      if(this.active_sh !== sh){
        this.active_sh.hide();
        this.active_bullet.deactivate();
        setTimeout(()=>{
          sh.show();
        }, 1000);
        this.active_sh = sh;
        this.active_bullet = bullet;
      }
    }.bind(this));
    bullet.addCallbackOut(function(){
      if(this.active_sh !== sh){
        sh.hide();
        bullet.deactivate();
        setTimeout(()=>{
          this.active_sh.show();
        }, 500);
      }
    }.bind(this));
    bullet.becomeChildOf(this.down_el);
    this.bullets.push(bullet);
  }

  addContent(
    video_src,
    text, 
    up_down, // bool    
  ){
    var sh = new (up_down ? VSlide : HSlide)(
      550,
      650,
      50,
      20,
      Math.random() < 0.5,
      video_src,
      text,
      this.shs.length === 0 ? true : false,
      getRandomInt(180, 230),
      getRandomInt(180, 230),
      getRandomInt(180, 230),
    );
    this.addBullet(sh);
    if(this.shs.length === 0){
      this.active_bullet = this.bullets[this.bullets.length - 1];
      this.active_sh = sh;
    }
    this.shs.push(sh);
    sh.becomeChildOf(this.up_el);
  }
}

// path
class Path {
  constructor(path) {
    this.arr = path.split('/');
  }

  url() {
    return this.arr.join('/');
  }

  concat() {
    return new Path(this.arr.join('/'));
  }

  backward(n) {
    var np = this.concat();
    for (let ii = 0; ii < n; ii++) {
      np.arr.pop();
    }
    return np;
  }

  forward(arr_or_str) {
    var np = this.concat();
    if (arr_or_str instanceof Array) {
      arr_or_str.forEach(st => {
        np.arr.push(st);
      });
    } else {
      // string
      np.arr.push(arr_or_str);
    }
    return np;
  }
}

// db parsed json
class Database {
  constructor() {
    if (Database._instance) return Database._instance;
    this.abs_path = new Path(window.location.href).backward(1);
    this.json_path = this.abs_path.forward('json');

    // load products
    fetch(this.json_path.forward('about.json').url())
      .then(res => res.json())
      .then(about => {
        this.about = about;
      });
    Database._instance = this;
  }
}

new Database();

var pg = new Page();

setTimeout(()=>{
  new Database().about.forEach(obj=>{
    pg.addContent(
      "media/" + obj.src,
      obj.text,
      obj.vertical,
    );
  });
}, 1000);






























