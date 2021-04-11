class Backend{
  static backend_missing_error(){
    new Info().addInfo(
      'error',
      "Sorry, the backend of this app is still in developing",
    );
  }

  // static backend wrapper
  static place_an_order(arr){
    /* backend should take an array as param
    fit in the type of
    [
      {
        name: ...
        number: ...
        price: ...
      }
      ...
    ]
    */
    Backend.backend_missing_error();
  }
}

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

function render_element(styles, el) {
  for (const [kk, vv] of Object.entries(styles)) {
    el.style[kk] = vv;
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
    fetch(this.json_path.forward('products.json').url())
      .then(res => res.json())
      .then(products => {
        this.products = products;
      });
    Database._instance = this;
  }
}

new Database();

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
    this.el.addEventListener('click', function(){this.clickCallback();this.btn_click()}.bind(this));
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
      left: '0',
      left: "15%",
      width: '70%',
      zIndex: '1000000',
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


// shopping cart frontend
class Trolley{
	constructor(
		width_px,
		callback, // click handler
	){
		if(Trolley._instance)return Trolley._instance;
		this.width_px = width_px;
		this.callback = callback;
		this.wrapper = document.createElement('div');
		render_element({
			position: 'fixed',
			zIndex: '1000000000',
			right: '0',
			bottom: '0',
			width: this.width_px.toString() + 'px',
			height: this.width_px.toString() + 'px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			color: 'orange',
			border: '1px solid orange',
			fontSize: '3em',
			cursor: 'pointer',
		}, this.wrapper);
		this.wrapper_up = document.createElement('div');
		this.wrapper_down = document.createElement('div');
		render_element({
			width: this.width_px.toString() + 'px',
			height: (this.width_px * 0.4).toString() + 'px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '20px',
		}, this.wrapper_up);
		render_element({
			width: this.width_px.toString() + 'px',
			height: (this.width_px * 0.6).toString() + 'px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}, this.wrapper_down);
		this.wrapper.appendChild(this.wrapper_up);
		this.wrapper.appendChild(this.wrapper_down);
		this.indicate_el = document.createElement('div');
		render_element({
			width: (this.width_px * 0.3).toString() + 'px',
			height: (this.width_px * 0.3).toString() + 'px',
			borderRadius: (this.width_px * 0.3).toString() + 'px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			background: 'red',
			color: 'white',
			display: 'none',
		}, this.indicate_el);
		this.wrapper_up.appendChild(this.indicate_el);
		this.wrapper_down.innerHTML = '<i class="fas fa-shopping-cart"></i>';
		this.el = this.wrapper.querySelector('i');
		document.body.appendChild(this.wrapper);

		this.mouseenter = this.mouseenter.bind(this);
		this.mouseleave = this.mouseleave.bind(this);
		this.click = this.click.bind(this);

		this.wrapper.addEventListener('mouseenter', this.mouseenter);
		this.wrapper.addEventListener('mouseleave', this.mouseleave);
		this.wrapper.addEventListener('click', this.click);

		this.amount = 0;
		this.change = this.change.bind(this);
		this.to = this.to.bind(this);
		Trolley._instance = this;
	}

	mouseenter(){
		this.indicate_el.style.opacity = '0.75';
		this.wrapper.style.color = 'gold';
		this.wrapper.style.border = '1px solid gold';
	}

	mouseleave(){
		this.indicate_el.style.opacity = '1';
		this.wrapper.style.color = 'orange';
		this.wrapper.style.border = '1px solid orange';
	}

	click(){
		this.callback();
	}

	change(
		amount, // integer
	){
		this.amount += amount;
		if(this.amount !== 0){
			this.indicate_el.style.display = 'flex';
			this.indicate_el.innerHTML = this.amount.toString();
		}else{
			this.indicate_el.style.display = 'none';
		}
	}

	to(
		amount, // integer
	){
		this.amount = amount;
		if(this.amount !== 0){
			this.indicate_el.style.display = 'flex';
			this.indicate_el.innerHTML = this.amount.toString();
		}else{
			this.indicate_el.style.display = 'none';
		}
	}
}

// dismiss button widget
class ButtonDismiss{
	constructor(
		parent_el, 
		callback=null,
		width='30px',
		margin='2px',
	){
		this.parent_el = parent_el;
		this.callback = callback;
		this.width = width;
		this.margin = margin;

		this.el = document.createElement('div');
		render_element({
			position: 'absolute',
			zIndex: '1000000000',
			width: this.width,
			height: this.width,
			right: '0',
			display: 'inline-block',
			borderRadius: this.width,
			background: 'white',
			margin: this.margin,
			cursor: 'pointer',
		}, this.el);

		this.click = this.click.bind(this);
		this.mouseenter = this.mouseenter.bind(this);
		this.mouseleave = this.mouseleave.bind(this);
		this.el.addEventListener('click', this.click);
		this.el.addEventListener('mouseenter', this.mouseenter);
		this.el.addEventListener('mouseleave', this.mouseleave);

		this.parent_el.appendChild(this.el);
	}

	mouseenter(){
		this.el.style.background = 'red';
	}

	mouseleave(){
		this.el.style.background = 'white';
	}

	click(){
		if(this.callback){
			this.callback();
		}else{
			this.el.style.display = 'none';
		}
	}
}


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

class PanelMain{
  // panel main will be decalred in page<singleton>
	// singleton
	constructor(
		appear=false, // appear -> bool: true: show panel; false: hide panel;
	){
		if(PanelMain._instance)return PanelMain._instance;
		this.appear = appear;
		this.el = document.createElement('div');
		render_element({
			position: 'fixed',
			display: 'flex',
			zIndex: '100000000',
			borderRadius: '20px',
			boxShadow: '8px 14px 7px darkgray',
			border: '10px solid #eee',
			fontFamily: "'Roboto', Arial, Helvetica, Sans-serif, Verdana",
			background: '#dee1e3',
			overflow: 'auto',
			left: 'calc(50vw - 384px)',
			top: '30vh',
			width: '768px',
			height: '40vh',
			transition: 'all 500ms',
		}, this.el);
		document.body.appendChild(this.el);
		this.panel = new ShowHide(
			this.el,
			'flex',
			this.appear,
		);
		this.show = this.panel.show;
		this.hide = this.panel.hide;
		this.turn = this.panel.turn;
		this.dismiss_btn = new ButtonDismiss(this.el, this.hide, '40px');
		new Trolley(100, function(){
			this.turn();
			this.tag_bbq_click();
		}.bind(this));

		// content
		this.bbq_scheme = new RGBA(250, 140, 130);
		this.beverage_scheme = new RGBA(140, 130, 255);
		this.dessert_scheme = new RGBA(130, 255, 140);

		render_element({
			display: 'flex',
			flexDirection: 'column',
		}, this.el);

		[
			this.top_wrapper,
			this.middle_wrapper,
			this.bottom_wrapper,
			this.bbq_tag,
			this.beverage_tag,
			this.dessert_tag,
		] = Array.from({length: 6}, ii => document.createElement('div'));

		this.top_wrapper = document.createElement('div');
		this.middle_wrapper = document.createElement('div');
		render_element({
			width: '100%',
			height: '50px',
			display: 'flex',
			flexDirection: 'row',
			border: '1px solid',
		}, this.top_wrapper);
		render_element({
			width: '100%',
			height: 'calc(100% - 100px)',
			overflow: 'auto',
			border: '1px solid',
		}, this.middle_wrapper);
		render_element({
			width: '100%',
			height: '50px',
			display: 'flex',
			flexDirection: 'row',
			border: '1px solid', 
		}, this.bottom_wrapper);
		this.el.appendChild(this.top_wrapper);
		this.el.appendChild(this.middle_wrapper);
		this.el.appendChild(this.bottom_wrapper);
		render_element({
			background: this.bbq_scheme.rgb(),
			color: '',
		}, this.bbq_tag);
		this.bbq_tag.innerHTML = 'BBQ';
		render_element({
			background: this.beverage_scheme.rgb(),
			color: '',
		}, this.beverage_tag);
		this.beverage_tag.innerHTML = 'Beverage';
		render_element({
			background: this.dessert_scheme.rgb(),
			color: '',
		}, this.dessert_tag);
		this.dessert_tag.innerHTML = 'Dessert';
		[
			this.bbq_tag,
			this.beverage_tag,
			this.dessert_tag,
		].forEach(tag=>{
			render_element({
				width: '33.3%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: '2em',
				fontFamily: "'Brush Script MT', cursive",
				cursor: 'pointer',
			}, tag);
			tag.addEventListener('click', function(){this.tag_turn(tag)}.bind(this));
			this.top_wrapper.appendChild(tag);
		});

		this.tag_bbq_mouseenter = this.tag_bbq_mouseenter.bind(this);
		this.tag_beverage_mouseenter = this.tag_beverage_mouseenter.bind(this);
		this.tag_dessert_mouseenter = this.tag_dessert_mouseenter.bind(this);
		this.tag_bbq_mouseleave = this.tag_bbq_mouseleave.bind(this);
		this.tag_beverage_mouseleave = this.tag_beverage_mouseleave.bind(this);
		this.tag_dessert_mouseleave = this.tag_dessert_mouseleave.bind(this);
		this.tag_bbq_click = this.tag_bbq_click.bind(this);
		this.tag_beverage_click = this.tag_beverage_click.bind(this);
		this.tag_dessert_click = this.tag_dessert_click.bind(this);

		this.bbq_tag.addEventListener('mouseenter', this.tag_bbq_mouseenter);
		this.bbq_tag.addEventListener('mouseleave', this.tag_bbq_mouseleave);
		this.beverage_tag.addEventListener('mouseenter', this.tag_beverage_mouseenter);
		this.beverage_tag.addEventListener('mouseleave', this.tag_beverage_mouseleave);
		this.dessert_tag.addEventListener('mouseenter', this.tag_dessert_mouseenter);
		this.dessert_tag.addEventListener('mouseleave', this.tag_dessert_mouseleave);
		this.bbq_tag.addEventListener('click', this.tag_bbq_click);
		this.beverage_tag.addEventListener('click', this.tag_beverage_click);
		this.dessert_tag.addEventListener('click', this.tag_dessert_click);

		this.tag_active = this.tag_active.bind(this);
		this.tag_deactive = this.tag_deactive.bind(this);
		this.tag_turn = this.tag_turn.bind(this);
		this.config = this.config.bind(this);

    // footer
    this.order_button = document.createElement('div');
    render_element({
      width: '100%',
      height: '100%',
      background: "linear-gradient(45deg, orange, yellow, wheat, gold)",
      display: 'flex',
      flexDirection: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2em',
      color: 'gray',
      cursor: 'pointer',
      transition: 'all 500ms ease-out',
    }, this.order_button);
    this.bottom_wrapper.appendChild(this.order_button);
    this.order_button.innerHTML = '<i class="fas fa-shopping-basket"></i>&emsp;Place an order';
    this.order_icon = this.order_button.querySelector('i');
    this.mouseenter_order = this.mouseenter_order.bind(this);
    this.mouseleave_order = this.mouseleave_order.bind(this);
    this.click_order = this.click_order.bind(this);
    this.order_button.addEventListener('mouseenter', this.mouseenter_order);
    this.order_button.addEventListener('mouseleave', this.mouseleave_order);
    this.order_button.addEventListener('click', this.click_order);

		// default to bbq tag
		this.tag_turn(this.bbq_tag);
		PanelMain._instance = this;
	}

  mouseenter_order(){
    render_element({
      opacity: '0.8',
      color: 'black',
      background: "linear-gradient(45deg, aqua, lightgreen)",
    }, this.order_button);
  }

  mouseleave_order(){
    render_element({
      opacity: '1',
      color: 'gray',
      background: "linear-gradient(45deg, orange, yellow, wheat, gold)",
    }, this.order_button);
  }

  click_order(){
    new Cart().order(Backend.place_an_order);
  }

	tag_bbq_mouseenter(){
		this.bbq_tag.style.opacity = '0.7';
		this.bbq_tag.style.color = 'white';
	}

	tag_beverage_mouseenter(){
		this.beverage_tag.style.opacity = '0.7';
		this.beverage_tag.style.color = 'white';
	}

	tag_dessert_mouseenter(){
		this.dessert_tag.style.opacity = '0.7';
		this.dessert_tag.style.color = 'white';
	}

	tag_bbq_mouseleave(){
		this.bbq_tag.style.opacity = '1';
		this.bbq_tag.style.color = 'black';
	}

	tag_beverage_mouseleave(){
		this.beverage_tag.style.opacity = '1';
		this.beverage_tag.style.color = 'black';
	}

	tag_dessert_mouseleave(){
		this.dessert_tag.style.opacity = '1';
		this.dessert_tag.style.color = 'black';
	}

	tag_active(tag){
		tag.style.textDecoration = 'underline';
		tag.style.textShadow = '2px 2px 2px red';
	}

	tag_deactive(tag){
		tag.style.textDecoration = 'initial';
		tag.style.textShadow = 'none';
	}

	tag_turn(tag){
		[
			this.bbq_tag,
			this.beverage_tag,
			this.dessert_tag,
		].forEach(tg=>{
			if(tg !== tag){
				this.tag_deactive(tg);
			}else{
				this.tag_active(tg);
			}
		});
	}

	// config panel with records
	config(itm, num){
		// Item object and num integer
		this.middle_wrapper.innerHTML = '';
		this.items = itm.map((tem, ii)=>{
			var cb = new CartBBQItem(
				tem.bgPath,
				tem.name, 
				tem.price,
				num[ii],
			);
			cb.becomeChildOf(this.middle_wrapper);
			cb.quantity.associate(tem.quantity, true);
			return cb;
		});
	}

	tag_bbq_click(){
		this.tag_turn(this.bbq_tag);
		this.config(...new Cart().getBBQItems());
	}

	tag_beverage_click(){
		this.tag_turn(this.beverage_tag);
		this.config(...new Cart().getBeverageItems());
	}

	tag_dessert_click(){
		this.tag_turn(this.dessert_tag);
		this.config(...new Cart().getDessertItems());
	}
}

class Quantity{
	constructor(
		parent_el,
		// callbacks take a quantity instance as param which is this
		callback,
		width_px=150,
		height_px=30,
	){
		this.parent_el = parent_el;
		this.callback = callback;
		this.width_px = width_px;
		this.height_px = height_px;
		this.assoc_func = () => {};

		this.el = document.createElement('div');
		render_element({
			width: this.width_px.toString() + 'px',
			height: this.height_px.toString() + 'px',
			fontSize: this.height_px.toString() + 'px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		}, this.el);
		this.el.innerHTML = `
			<i class="fas fa-minus-square"></i>
			<input type="number" min="0" />
			<i class="fas fa-plus-square"></i>
		`;
		[
			this.minus_el,
			this.plus_el,
		] = this.el.querySelectorAll('i');
		this.minus_el.style.cursor = 'pointer';
		this.plus_el.style.cursor = 'pointer';
		this.middle_el = this.el.querySelector('input');
		render_element({
			width: (this.width_px - 2.5 * this.height_px).toString() + 'px',
			height: '100%',
			fontSize: this.height_px.toString() + 'px',
			border: '3px double skyblue',
			color: 'red',
		}, this.middle_el);

		this.minus_mouseenter = this.minus_mouseenter.bind(this);
		this.minus_mouseleave = this.minus_mouseleave.bind(this);
		this.minus_click = this.minus_click.bind(this);
		this.plus_mouseenter = this.plus_mouseenter.bind(this);
		this.plus_mouseleave = this.plus_mouseleave.bind(this);
		this.plus_click = this.plus_click.bind(this);
		this.minus_el.addEventListener('mouseenter', this.minus_mouseenter);
		this.minus_el.addEventListener('mouseleave', this.minus_mouseleave);
		this.minus_el.addEventListener('click', this.minus_click);
		this.plus_el.addEventListener('mouseenter', this.plus_mouseenter);
		this.plus_el.addEventListener('mouseleave', this.plus_mouseleave);
		this.plus_el.addEventListener('click', this.plus_click);
		this.minus_mouseleave();
		this.plus_mouseleave();
		this.parent_el.appendChild(this.el);

		this.value = 0;
		this.middle_el.value = 0;
		this.setValue = this.setValue.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.middle_el.addEventListener('blur', this.updateValue);
		this.associate = this.associate.bind(this);
	}

	minus_mouseenter(){
		this.minus_el.style.color = '#a83271';
	}

	minus_mouseleave(){
		this.minus_el.style.color = '#de318d';
	}

	plus_mouseenter(){
		this.plus_el.style.color = '#2a6592';
	}

	plus_mouseleave(){
		this.plus_el.style.color = '#8ec3eb';
	}

	updateValue(val){
		var er = false;
		if(this.middle_el.value){
			if(this.middle_el.value < 0){
				// error
				er = true;
			}
		}else{
			// error
			er = true;
		}
		if(er){
			new Info().addInfo(
				'warn',
				'Please entry a valid number',
				function(){this.setValue(0)}.bind(this),
			);
		}else{
			this.setValue(this.middle_el.value);
			this.callback(this);
		}
	}

	setValue(val){
		var ed = parseInt(val < 0 ? 0 : val);
		this.value = ed;
		this.middle_el.value = ed;
		this.assoc_func();
	}

	minus_click(){
		this.setValue(this.value - 1);
		this.callback(this);
	}

	plus_click(){
		this.setValue(this.value + 1);
		this.callback(this);
	}

	/* sync 
	true: populate host value: ins.value = host.value
	false: populate instance value: host.value = ins.value
	*/
	associate(quan, sync){
		this.quan = quan;
		quan.quan = this;
		this.assoc_func = function(){
			this.quan.value = this.value;
			this.quan.middle_el.value = this.value;
			this.quan.callback(this);
		}.bind(this);

		this.quan.quan = this;
		this.quan.assoc_func = function(){
			this.quan.value = this.value;
			this.quan.middle_el.value = this.value;
			this.quan.callback(this);
		}.bind(this.quan);

		if(sync === true){
			this.assoc_func();
		}else if(sync === false){
			this.quan.assoc_func();
		}
	}
}

class Cart{
	/* methods: delete, assign, sum */
	constructor(){
		// singleton
		if(Cart._instance)return Cart._instance;
		// kk => Item instance
		// vv => quantity in integer
		this.indices = [];
		this.items = [];
		this.numbers = [];

		this.remove = this.remove.bind(this);
		this.assign = this.assign.bind(this);
    this.order = this.order.bind(this);
		this.sum = this.sum.bind(this);
		this.getItems = this.getItems.bind(this);
		this.getBBQItems = this.getBBQItems.bind(this);
		this.getBeverageItems = this.getBeverageItems.bind(this);
		this.getDessertItems = this.getDessertItems.bind(this);
		Cart._instance = this;
	}

	remove(kk){
		var ind = this.items.indexOf(kk);
		this.indices.splice(ind, 1);
		this.indices = this.indices.map(num=>num >= ind ? num - 1 : num);
		this.items.splice(ind, 1);
		this.numbers.splice(ind, 1);
	}

  order(backend){
    /* backend should take an array as param
    fit in the type of
    [
      {
        name: ...
        number: ...
        price: ...
      }
      ...
    ]
    */
    var arr = [];
    for(let ii = 0; ii < this.items.length; ii++){
      // obj[this.items[ii].name] = this.numbers[ii];
      arr.push({
        name: this.items[ii].name,
        number: this.numbers[ii],
        price: this.items[ii].price,
      });
    }
    backend(arr);
  }


	assign(itm, num){
		if(this.items.includes(itm)){
			this.numbers[this.items.indexOf(itm)] = num;
		}else{
			this.indices.push(this.indices.length);
			this.items.push(itm);
			this.numbers.push(num);
		}
	}

	sum(){
		if(this.numbers.length >= 2){
			return this.numbers.reduce((a, b)=>a + b);
		}else if(this.numbers.length === 1){
			return this.numbers[0];
		}else{
			return 0;
		}
	}

	getItems(cls){
		var ins = [];
		var qua = [];
		for(let ii = 0; ii < this.indices.length; ii++){
			if(this.items[ii] instanceof cls){
				ins.push(this.items[ii]);
				qua.push(this.numbers[ii]);
			}
		}
		return [ins, qua];
	}

	getBBQItems(){
		return this.getItems(BBQItem);
	}

	getBeverageItems(){
		return this.getItems(BeverageItem);
	}

	getDessertItems(){
		return this.getItems(DessertItem);
	}
}

var item_config = {
	width: 350,
	height: 200,
	borderRadius: 20,
}

class ItemBase{
	constructor(
		name, 
		bgPath,
		price,
	){
		this.name = name;
		this.bgPath = bgPath;
		this.price = price;

		this.el = document.createElement('div');
		render_element({
			position: 'relative',
			width: item_config.width.toString() + 'px',
			height: item_config.height.toString() + 'px',
			borderRadius: item_config.toString() + 'px',
		}, this.el);
		this.img_el = document.createElement('img');
		this.content_el = document.createElement('div');
		render_element({
			position: 'absolute',
			width: '100%',
			height: '100%',
			borderRadius: '20px',
			zIndex: '-100',
			opacity: '0.5',
		}, this.img_el);
		render_element({
			position: 'absolute',
			width: '100%',
			height: '100%',
			borderRadius: '20px',
			zIndex: '100',
			opacity: '0.8',

			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
		}, this.content_el);
		this.img_el.setAttribute('src', bgPath);
		this.el.appendChild(this.img_el);
		this.el.appendChild(this.content_el);

		this.header_el = document.createElement('div');
		this.footer_el = document.createElement('div');
		render_element({
			width: '100%',
			height: '20%',
			borderRadius: '20px 20px 0 0',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '1.5em',
			fontFamily: 'Helvetica',
			fontWeight: 'bold',
		}, this.header_el);
		render_element({
			width: '100%',
			height: '20%',
			borderRadius: '0 0 20px 20px',
			display: 'flex',
			flexDirection: 'row',
			background: '#ddd',
		}, this.footer_el);
		this.header_el.innerHTML = this.name;
		this.content_el.appendChild(this.header_el);
		this.content_el.appendChild(this.footer_el);

		this.footer_left_el = document.createElement('div');
		this.footer_right_el = document.createElement('div');
		this.footer_left_el.style.width = '30%';
		this.footer_left_el.style.height = '100%';
		render_element({
			width: '50%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '2em',
			textDecoration: 'underline',
		}, this.footer_left_el);
		render_element({
			width: '50%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}, this.footer_right_el);
		this.footer_left_el.innerHTML = '$' + this.price.toString();
		this.footer_el.appendChild(this.footer_left_el);
		this.footer_el.appendChild(this.footer_right_el);
		this.quantity = new Quantity(
			this.footer_right_el,
			// associate quantity to shopping car when change is triggered 
			function(quan){
				// associate quantity and shopping cart
				if(quan.value === 0){
					new Cart().remove(this);
				}else{
					new Cart().assign(this, quan.value);
				}

				// associate quantity and trolley
				new Trolley().to(new Cart().sum());
			}.bind(this),
		);

		this.becomeChildOf = this.becomeChildOf.bind(this);
	}

	becomeChildOf(parent_el){
		this.parent_el = parent_el;
		this.parent_el.appendChild(this.el);
	}
}

class BBQItem extends ItemBase{
	constructor(
		name,
		bgPath,
		price,
	){
		super(name, 'img/products/bbq/' +  bgPath, price);
	}
}

class BeverageItem extends ItemBase{
	constructor(
		name,
		bgPath,
		price,
	){
		super(name, 'img/products/beverage/' +  bgPath, price);
	}
}

class DessertItem extends ItemBase{
	constructor(
		name,
		bgPath,
		price,
	){
		super(name, 'img/products/dessert/' +  bgPath, price);
	}
}


class CartItemBase{
	constructor(
		bgPath,
		name,
		price,
		number,
		bg,
		bgHover, 
	){
		this.bgPath = bgPath;
		this.name = name;
		this.price = price;
		this.number = number;
		this.bg = bg;
		this.bgHover = bgHover;

		this.height_px = 100;
		this.img_width_px = 150;
		this.quan_width_px = 150;
		this.price_width_px = 100;
		this.lanel_fontSize = '1.5em';
		this.price_fontSize = '2em';

		this.el = document.createElement('div');
		this.img_el = document.createElement('img');
		this.img_el.setAttribute('src', this.bgPath);
		this.container = document.createElement('div');
		render_element({
			width: '100%',
			height: this.height_px.toString() + 'px', 
			display: 'flex',
			flexDirection: 'row',
			border: '1px solid',
		}, this.el);
		render_element({
			width: this.img_width_px.toString() + 'px',
			height: '100%',
		}, this.img_el);
		render_element({
			width: `calc(100% - ${this.img_width_px}px)`,
			height: '100%',
			display: 'flex',
			flexDirection: 'row',
		}, this.container);
		this.el.appendChild(this.img_el);
		this.el.appendChild(this.container);

		this.label_el = document.createElement('div');
		render_element({
			width: `calc(100% - ${this.quan_width_px + this.price_width_px}px)`,
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: this.lanel_fontSize,
			textDecoration: 'underline',
			fontStyle: 'italic',
			color: 'white',
			fontFamily: 'Verdana',
		}, this.label_el);
		this.label_el.innerHTML = this.name;
		this.price_el = document.createElement('div');
		render_element({
			width: this.price_width_px.toString() + 'px',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			fontSize: this.price_fontSize,
		}, this.price_el);
		this.quan_el = document.createElement('div');
		render_element({
			width: this.quan_width_px.toString() + 'px',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}, this.quan_el);
		this.demolish = this.demolish.bind(this);
		this.quantity = new Quantity(
			this.quan_el, // parent_el,
			// callback; take a quantity instance as param which is this
			function(quan){
				this.number = quan.value;
				this.updateTotalCost();
				if(this.number === 0)this.demolish();
			}.bind(this), 
			this.quan_width_px, // width_px=150,
			// height_px=30,
		);
		this.quantity.setValue(this.number);

		this.container.appendChild(this.label_el);
		this.container.appendChild(this.price_el);
		this.container.appendChild(this.quan_el);
		this.updateTotalCost();

		this.updateTotalCost = this.updateTotalCost.bind(this);
		this.becomeChildOf = this.becomeChildOf.bind(this);
		this.mouseenter = this.mouseenter.bind(this);
		this.mouseleave = this.mouseleave.bind(this);
		this.el.addEventListener('mouseenter', this.mouseenter);
		this.el.addEventListener('mouseleave', this.mouseleave);
		this.mouseleave();
	}

	mouseenter(){
		render_element({
			opacity: '0.8',
			background: this.bg,
		}, this.el);	
	}

	mouseleave(){
		render_element({
			opacity: '1',
			background: this.bgHover,
		}, this.el);
	}

	demolish(){
		this.parent_el.removeChild(this.el);
	}

	updateTotalCost(){
		this.price_el.innerHTML = '$' + (this.price * this.number).toString();
	}

	becomeChildOf(parent_el){
		this.parent_el = parent_el;
		this.parent_el.appendChild(this.el);
	}
}

class CartBBQItem extends CartItemBase{
	constructor(bgPath, name, price, number){
		super(
			bgPath, name, price, number, 
			"linear-gradient(45deg, magenta, cyan)",
			"linear-gradient(45deg, red, blue)",
		)
	}
}

class CartBeverageItem extends CartItemBase{
	constructor(bgPath, name, price, number){
		super(
			bgPath, name, price, number, 
			"linear-gradient(45deg, #ffff00, #ff5050)",
			"linear-gradient(45deg, #cc9900, #cc0000)",
		)
	}
}

class CartDessertItem extends CartItemBase{
	constructor(bgPath, name, price, number){
		super(
			bgPath, name, price, number, 
			"linear-gradient(45deg, #9933ff, #00cc00)",
			"linear-gradient(45deg, #6600cc, #006600)",
		)
	}
}

class Shelf{
	constructor(
		col,
		pageStyle,
		rowStyle,
	){
		this.col = col;
		this.counter = col;
		this.rowStyle = rowStyle;

		this.el = document.createElement('div');
		render_element(Object.assign({
			width: '100vw',
		}, pageStyle), this.el);
		
    this.els = [];
		this.row_els = [];
		this.row_mapper = {};

    this.config = this.config.bind(this);
		this.appendChild = this.appendChild.bind(this);
		this.becomeChildOf = this.becomeChildOf.bind(this);
    this.removeChildFrom = this.removeChildFrom.bind(this);
		this.demolish = this.demolish.bind(this);
	}

  config(col){
    if(this.col === col)return;
    this.row_els.forEach(el=>{
      this.el.removeChild(el);
    });
    this.col = col;
    this.counter = col;
    this.row_mapper = {};
    this.subs = this.els.map(el=>el);
    this.els = [];
    this.row_els = [];
    this.subs.forEach(el=>{
      this.appendChild(el);
    });
  }

	appendChild(element){
		this.counter++;
    this.els.push(element);
		if(this.counter >= this.col){
			var row_el = document.createElement('div');
			render_element(Object.assign({
				display: 'flex',
				width: '100vw',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}, this.rowStyle), row_el);
			this.row_els.push(row_el);
			this.el.appendChild(row_el);
			this.row_mapper[this.row_els.length] = [];
			this.counter = 0;
    }
		this.row_mapper[this.row_els.length].push(element);
		this.row_els[this.row_els.length - 1].appendChild(element);
	}

	becomeChildOf(parent_el){
		this.parent_el = parent_el;
		this.parent_el.appendChild(this.el)
	}

  removeChildFrom(){
    this.parent_el.removeChild(this.el);
    this.parent_el = null;
  }

	demolish(){
    this.row_els.forEach(el=>{
      this.el.removeChild(el);
    });
		this.parent_el = null;
	}
}

class Page{
	constructor(
		sepPx,
	){
    // singleton
		if(Page._instance)return Page._instance;
    new PanelMain(false); // panel main is declared in Page

		this.sepPx = sepPx;
    [
      this.el,
      this.header_el,
      this.main_el,
      this.bottom_el,
    ] = Array.from({length: 5}, ii=>document.createElement('div'));
    document.body.appendChild(this.el);
    this.el.appendChild(this.header_el);
    this.el.appendChild(this.main_el);
    this.el.appendChild(this.bottom_el);

    // header
    render_element({
      position: 'relative',
      width: '100%',
      height: '150px',
    }, this.header_el);

    [
      this.header_bl1,
      this.header_bl2,
    ] = Array.from({length: 2}, ii=>{
      var el = document.createElement('div');
      render_element({
        width: '100%',
        height: '100%',
        position: 'absolute',
        // opacity: '0.5',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }, el);
      this.header_el.appendChild(el);
      return el;
    });

    // blend1 for icon
    this.sunny_icon = document.createElement('div');
    this.sunny_icon.setAttribute('class', 'sunny');
    this.header_bl1.appendChild(this.sunny_icon);

    this.rainbow_icon = document.createElement('div');
    this.rainbow_icon.setAttribute('class', 'rainbow');
    this.header_bl1.appendChild(this.rainbow_icon);

    this.stormy_icon = document.createElement('div');
    this.stormy_icon.setAttribute('class', 'stormy');
    this.header_bl1.appendChild(this.stormy_icon); 

    // blend2 for text
    this.sunny_text_h2 = document.createElement('h2');
    this.sunny_text_h2.setAttribute('class', 'neon-out neon-orange');
    this.sunny_text_p = document.createElement('p');
    this.sunny_text_p.setAttribute('class', 'neon-in');
    this.sunny_text_p.innerHTML = 'BBQ';
    this.sunny_text_h2.appendChild(this.sunny_text_p);
    this.header_bl2.appendChild(this.sunny_text_h2);  

    this.rainbow_text_h2 = document.createElement('h2');
    this.rainbow_text_h2.setAttribute('class', 'neon-out neon-blue');
    this.rainbow_text_p = document.createElement('p');
    this.rainbow_text_p.setAttribute('class', 'neon-in');
    this.rainbow_text_p.innerHTML = 'beverage';
    this.rainbow_text_h2.appendChild(this.rainbow_text_p);
    this.header_bl2.appendChild(this.rainbow_text_h2);

    this.stormy_text_h2 = document.createElement('h2');
    this.stormy_text_h2.setAttribute('class', 'neon-out neon-violet');
    this.stormy_text_p = document.createElement('p');
    this.stormy_text_p.setAttribute('class', 'neon-in');
    this.stormy_text_p.innerHTML = 'dessert';
    this.stormy_text_h2.appendChild(this.stormy_text_p);
    this.header_bl2.appendChild(this.stormy_text_h2);

    // load cards
    this.init_fit = this.init_fit.bind(this);
    this.auto_fit = this.auto_fit.bind(this);
    this.itembases = [];
    window.addEventListener('resize', this.auto_fit);

    // click nav to switch content
    this.nav_at = null; 
    /*
    bbq: sunny
    beverage: rainbow
    stormy: dessert
    */
    this.load_bbq = this.load_bbq.bind(this);
    this.load_beverage = this.load_beverage.bind(this);
    this.load_dessert = this.load_dessert.bind(this);
    this.init_fit();
    this.load_bbq();

    this.sunny_text_h2.addEventListener('click', this.load_bbq);
    this.rainbow_text_h2.addEventListener('click', this.load_beverage);
    this.stormy_text_h2.addEventListener('click', this.load_dessert);
		Page._instance = this;
	}

  init_fit(){
    this.shelf_bbq = new Shelf(
      Math.floor(window.innerWidth / item_config.width), 
      {
        marginTop: '50px',
      },
      {
        marginBottom: this.sepPx.toString() + 'px',
      },
    );
    new Database().products.bbq.forEach(obj=>{
      this.shelf_bbq.appendChild(new BBQItem(
        obj.name,
        obj.bgPath,
        obj.price,
      ).el);
    });

    this.shelf_beverage = new Shelf(
      Math.floor(window.innerWidth / item_config.width), 
      {
        marginTop: '50px',
      },
      {
        marginBottom: this.sepPx.toString() + 'px',
      },
    );
    new Database().products.beverage.forEach(obj=>{
      this.shelf_beverage.appendChild(new BeverageItem(
        obj.name,
        obj.bgPath,
        obj.price,
      ).el);
    });

    this.shelf_dessert = new Shelf(
      Math.floor(window.innerWidth / item_config.width), 
      {
        marginTop: '50px',
      },
      {
        marginBottom: this.sepPx.toString() + 'px',
      },
    );
    new Database().products.dessert.forEach(obj=>{
      this.shelf_dessert.appendChild(new DessertItem(
        obj.name,
        obj.bgPath,
        obj.price,
      ).el);
    });
  }

	auto_fit(){
    // ensure positive
    this.shelf_bbq.config(Math.floor(window.innerWidth / item_config.width));
    this.shelf_beverage.config(Math.floor(window.innerWidth / item_config.width));
    this.shelf_dessert.config(Math.floor(window.innerWidth / item_config.width));
	}

  load_bbq(){
    if(this.nav_at === 'bbq')return;
    if(this.nav_at === 'beverage'){
      this.shelf_beverage.removeChildFrom();
    }else if(this.nav_at === 'dessert'){
      this.shelf_dessert.removeChildFrom();
    }
    this.shelf_bbq.becomeChildOf(this.main_el);
    this.auto_fit();
    this.nav_at = 'bbq';
  }  

  load_beverage(){
    if(this.nav_at === 'beverage')return;
    if(this.nav_at === 'bbq'){
      this.shelf_bbq.removeChildFrom();
    }else if(this.nav_at === 'dessert'){
      this.shelf_dessert.removeChildFrom();
    }
    this.shelf_beverage.becomeChildOf(this.main_el);
    this.auto_fit();
    this.nav_at = 'beverage';
  }

  load_dessert(){
    if(this.nav_at === 'dessert')return;
    if(this.nav_at === 'bbq'){
      this.shelf_bbq.removeChildFrom();
    }else if(this.nav_at === 'beverage'){
      this.shelf_beverage.removeChildFrom();
    }
    this.shelf_dessert.becomeChildOf(this.main_el);
    this.auto_fit();
    this.nav_at = 'dessert';
  }
}

const dummy_block = function(){
  var el = document.createElement('div');
  render_element({
    width: '200px',
    height: '200px',
    background: 'red',
  }, el);
  return el;
}

// var pg = new Page(
//   10,
// );

// pg.appendChild(dummy_block());
// pg.appendChild(dummy_block());
// pg.appendChild(dummy_block());
// pg.appendChild(dummy_block());

setTimeout(()=>{
  new Page(50);
}, 500);


// setTimeout(()=>{
// 	new PanelMain(false);
//   new Page(50);
// 	new Database().products.bbq.forEach(obj=>{
// 		new Page().appendChild(new BBQItem(
// 			obj.name,
// 			obj.bgPath,
// 			obj.price,
// 		).el);
// 	});
// }, 500);















