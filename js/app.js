'use strict';

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Global function definitions

// render a specific image
// need a target container --> id = 'survey_images'
// need which image to render - base on goat object, so pass............
// either the goat or the prod_id... prod_id will be easier in the end, but
// for now, just pass the goat and target, target being the image and h2 itself
var render_product = function(goat, target_img, target_h2) {
  target_img.src = goat.url;
  target_img.name = goat.prod_id;
  target_img.setAttribute('alt', goat.prod_id);
  target_h2.textContent = goat.caption;
  goat.displayed_count++;
};

// render displayed_products array
var render_displayed_products = function() {
  // display current set of images
  var target_img, target_h2;
  for (var i = 0, j = displayed_images.length; i < j; i++) {
    target_img = document.getElementById(`image${i}`);
    target_h2 = document.getElementById(`img${i}_h2`);
    render_product(displayed_images[i], target_img, target_h2);
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

// data handler: retrieves and stores data, returns updated data set object
var create_data = function() {
  // handle the data object: if exists in local storage, retrieve and add current
  // data to totals, then save data to storage again
  // if not exists, create data store and save to local storage
  // we're assuming no new products are created. if there are a different
  // number of products than data points, then we need to recreate the datastore.
  // return the data object
  var data;

  if (localStorage.getItem('datastore') &&
    list_of_products.length === JSON.parse(localStorage.getItem('datastore')).labels.length) {
    // if exists, retrieve and concatenate
    data = JSON.parse(localStorage.getItem('datastore'));

    // create data, labels, # times displayed
    for (var i = 0, j = list_of_products.length; i < j; i++) {
      // data.labels.push(list_of_products[i].caption);
      data.clicked[i] += list_of_products[i].clicked_count;
      data.displayed[i] += list_of_products[i].displayed_count;
    }
    // save the updated data
    localStorage.setItem('datastore', JSON.stringify(data));
    console.log('updated data saved to local storage');
  } else {
    // does not exist or is malformed, so create new datastore with current set
    data = {
      title: '# of total clicks',
      chart_type: 'horizontalBar',
      labels: [],
      clicked: [],
      displayed: []
    };
    // create data, labels, # times displayed
    for (var k = 0, l = list_of_products.length; k < l; k++) {
      data.labels.push(list_of_products[k].caption);
      data.clicked.push(list_of_products[k].clicked_count);
      data.displayed.push(list_of_products[k].displayed_count);
    }
    // save data to datastore
    localStorage.setItem('datastore', JSON.stringify(data));
    console.log('data saved to local storage');
  }
  return data;
};

// chart rendering function
var render_results = function(data, ctx) {

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

  var results_chart = new Chart(ctx, { //eslint-disable-line no-undef,no-unused-vars
    type: data.chart_type,
    data: {
      labels: data.labels,
      datasets: [{
        label: data.title,
        data: data.clicked,
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

// takes a specific goat prod_id and increments clicked_count for that goat
var increment_count = function(goat_prod_id) {
  var max = list_of_products.length;
  var prod_ids = [];

  for (var i = 0; i < max; i++) {
    prod_ids.push(list_of_products[i].prod_id);
  }

  var idx = prod_ids.indexOf(goat_prod_id);
  list_of_products[idx].clicked_count++;
};

// -----------------------------------------------------------------------------
// click handler callback

var handle_click = function(event) {
  if (event.target.tagName !== 'IMG') return;
  CLICK_LIMIT--;

  increment_count(event.target.name);

  if (CLICK_LIMIT <= 0) {
    // remove listener
    image_container.removeEventListener('click', handle_click);

    // remove hidden class from results
    var target = document.getElementById('results');
    target.className = '';

    //render list
    var ctx = document.getElementById('results_canvas').getContext('2d');
    var data = create_data();
    render_results(data, ctx);

    return;
  }
  pick_new_products();

  render_displayed_products();

};

// -----------------------------------------------------------------------------
// main app init

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
