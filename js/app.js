'use strict';

// Global variables

var CLICK_LIMIT = 25;
var NUM_TO_DISPLAY = 3;
var list_of_products = [];
var displayed_images = [];
var image_container = document.getElementById('survey_images');

// Helper functions

var _randInt = function (a, b) { // exclusive of max
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  return Math.floor(Math.random() * (max - min) + min);
};

// -----------------------------------------------------------------------------
// Object constructor

var Product = function(prod_id, url, caption) {
  this.prod_id = prod_id;
  this.url = url;
  this.clicked_count = 0;
  this.displayed_count = 0;
  this.caption = caption || prod_id;

  list_of_products.push(this);
};

Product.prototype.render_img = function(target) {
  target.src = this.url;
  target.name = this.prod_id;
  this.displayed_count++;
};

// -----------------------------------------------------------------------------
// Global function definitions

// render displayed_products array
var render_displayed_products = function() {
  // display current set of images
  var target;
  for (var i = 0, j = displayed_images.length; i < j; i++) {
    target = document.getElementById(`image${i}`);
    displayed_images[i].render_img(target);
  }
};

// pick 3 random images
var pick_new_products = function() {
  var idx;
  var max = list_of_products.length;
  var current = displayed_images;
  displayed_images = [];

  do {
    // get a new random number
    idx = _randInt(0, max);

    // check if the displayed_images array contains that random product
    // also check if it already existed before
    if (displayed_images.indexOf(list_of_products[idx]) === -1 && current.indexOf(list_of_products[idx]) === -1) {
      // if not, push the element onto the list
      displayed_images.push(list_of_products[idx]);
    }
  } while (displayed_images.length < NUM_TO_DISPLAY);
};

var render_results = function() {
  // remove hidden class from results
  var target = document.getElementById('results');
  target.className = '';

  var chart_type = 'bar';
  var chart_labels = [];
  var clicked = [];
  var displayed = [];
  var ctx = document.getElementById('results_canvas').getContext('2d');

  for (var i = 0, j = list_of_products.length; i < j; i++) {
    chart_labels.push(list_of_products[i].caption);
    clicked.push(list_of_products[i].clicked_count);
    displayed.push(list_of_products[i].displayed_count);
  }

  var colors_bg = ctx.createLinearGradient(0, 0, 1280, 0);
  colors_bg.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
  colors_bg.addColorStop(.25, 'rgba(54, 162, 235, 0.5)');
  colors_bg.addColorStop(.5, 'rgba(255, 206, 86, 0.5)');
  colors_bg.addColorStop(.75, 'rgba(75, 192, 192, 0.5)');
  colors_bg.addColorStop(1, 'rgba(153, 102, 255, 0.5)');

  var colors_fg = ctx.createLinearGradient(0, 0, 1280, 0);
  colors_fg.addColorStop(0, 'rgba(255, 99, 132, 0.9');
  colors_fg.addColorStop(.25, 'rgba(54, 162, 235, 0.9)');
  colors_fg.addColorStop(.5, 'rgba(255, 206, 86, 0.9');
  colors_fg.addColorStop(.75, 'rgba(75, 192, 192, 0.9');
  colors_fg.addColorStop(1, 'rgba(153, 102, 255, 0.9)');

  var results_chart = new Chart(ctx, {
    type: chart_type,
    data: {
      labels: chart_labels,
      datasets: [{
        label: '# of total clicks',
        data: clicked,
        backgroundColor: colors_bg,
        borderColor: colors_fg,
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

};

// -----------------------------------------------------------------------------
// click handler callback

var handle_click = function(event) {
  if (event.target.tagName !== 'IMG') return;
  CLICK_LIMIT--;

  var max = list_of_products.length;
  var clicked_prod_id = event.target.name;
  var prod_ids = [];

  for (var i = 0; i < max; i++) {
    prod_ids.push(list_of_products[i].prod_id);
  }

  var idx = prod_ids.indexOf(clicked_prod_id);
  list_of_products[idx].clicked_count++;

  if (CLICK_LIMIT <= 0) {
    image_container.removeEventListener('click', handle_click);

    //render list
    render_results();
    return;
  }
  pick_new_products();

  render_displayed_products();

};

var init = function() {
  // create the objects

  new Product('bagdroid', './img/bag.jpg', 'R2-D2 Luggage');
  new Product('bananaslicer', './img/banana.jpg', 'Banana Slicer');
  new Product('bathroom', './img/bathroom.jpg', 'iPad / TP Holder');
  new Product('boots', './img/boots.jpg', 'Open-Toe Rain Boots');
  new Product('breakfast', './img/breakfast.jpg', 'Breakfast Cooker');
  new Product('bubblegum', './img/bubblegum.jpg', 'Meatball Bubblegum');
  new Product('chair', './img/chair.jpg', 'Dome-Shaped Chair');
  new Product('cthulhu', './img/cthulhu.jpg', 'C\'thulhu Figure');
  new Product('dog-duck', './img/dog-duck.jpg', 'Duck Bill for Dog');
  new Product('dragon', './img/dragon.jpg', 'Dragon Meat');
  new Product('pen', './img/pen.jpg', 'Pen Cap Utensils');
  new Product('pet-sweep', './img/pet-sweep.jpg', 'Pet Sweep Paw Boots');
  new Product('scissors', './img/scissors.jpg', 'Pizza Slice Scissors');
  new Product('shark', './img/shark.jpg', 'Shark Sleeping Bag');
  new Product('sweep', './img/sweep.png', 'Sweeper Baby Pajamas');
  new Product('tauntaun', './img/tauntaun.jpg', 'Tauntaun Sleeping Bag');
  new Product('unicorn', './img/unicorn.jpg', 'Unicorn Meat');
  new Product('usb', './img/usb.gif', 'Tentacle USB Flash Drive');
  new Product('water-can', './img/water-can.jpg', 'Backwards Watering Can');
  new Product('wine-glass', '/img/wine-glass.jpg', 'Anti-Splash Wine Glass');

  pick_new_products();

  render_displayed_products();

  // listen
  image_container.addEventListener('click', handle_click);

};

// run the program;
init();
