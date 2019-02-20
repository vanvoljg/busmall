'use strict';

/*

need globals:
CLICK_LIMIT
image array
state array/object
event on image section

*/

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
  // hide survey first
  var target = document.getElementById('survey');
  target.className = 'hidden';

  // remove hidden class from results
  target = document.getElementById('results');
  target.className = '';

  var chart_labels = [];
  var clicked = [];
  var displayed = [];

  for (var i = 0, j = list_of_products.length; i < j; i++) {
    chart_labels.push(list_of_products[i].caption);
    clicked.push(list_of_products[i].clicked_count);
    displayed.push(list_of_products[i].displayed_count);
  }

  var ctx = document.getElementById('results_canvas').getContext('2d');
  var results_chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chart_labels,
      datasets: [{
        label: '# of total clicks',
        data: clicked,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1.0)',
          'rgba(54, 162, 235, 1.0)',
          'rgba(255, 206, 86, 1.0)',
          'rgba(75, 192, 192, 1.0)',
          'rgba(153, 102, 255, 1.0)',
          'rgba(255, 159, 64, 1.0)'
        ],
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

// var ul_el = document.createElement('ul');
// var li_el = document.createElement('li');

// li_el.textContent = 'Results';
// ul_el.appendChild(li_el);

// for (var i = 0, j = list_of_products.length; i < j; i++) {
//   li_el = document.createElement('li');
//   li_el.textContent = list_of_products[i].clicked_count;

//   if (list_of_products[i].clicked_count === 1) li_el.textContent += ' vote ';
//   else li_el.textContent += ' votes ';

//   li_el.textContent += `for the ${list_of_products[i].caption}`;
//   ul_el.appendChild(li_el);
// }

// target.appendChild(ul_el);

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

  pick_new_products();

  render_displayed_products();

  if (CLICK_LIMIT <= 0) {
    image_container.removeEventListener('click', handle_click);

    // hide survey, show results


    //render list
    render_results();

  }
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
