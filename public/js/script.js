// @ bootstrap code 
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
      .forEach(function (form) {
      form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          }

          form.classList.add('was-validated')
      }, false)
      })
})()


//@ for ratings reviews

const radioButtons = document.querySelectorAll('input[type="radio"]');
const starLabels = document.querySelectorAll('.ratings-stars label');

radioButtons.forEach((radio, index) => {
    radio.addEventListener('click', () => {
        resetStarsColor();
        highlightStars(index);
    });
});

function resetStarsColor() {
    starLabels.forEach((label) => {
        label.classList.remove('active');
    });
}

function highlightStars(index) {
    for (let i = 0; i <= index; i++) {
        starLabels[i].classList.add('active');
    }
}

// @ index tax switch

let taxSwitch = document.getElementById("flexSwitchCheckDefault");

taxSwitch.addEventListener("click", () => {
    let taxPrcnt = document.getElementsByClassName("tax-prcnt");
    let realPrice = document.getElementsByClassName("real-price");
    for (let tax of taxPrcnt) {
        tax.classList.toggle("active");
    }
    for (let price of realPrice) {
        price.classList.toggle("active");
    }
});

// @ index icons logic

let selectedCategory = "";

function handleCategoryClick(category) {
    let listings = document.querySelectorAll(".card.index-card");
    const noResult = document.querySelector(".noSearch");
    let resultFound = false;
    listings.forEach(listing => {
        let listingCategory = listing.querySelector(".listing-categories").textContent;
        if (listingCategory.includes(category) || category === "") {
            listing.closest('a').style.display = "block";
            resultFound = true;
        } else {
            listing.closest('a').style.display = "none";
        }
    });
    if (!resultFound) {
        noResult.classList.add("active");
    } else {
        noResult.classList.remove("active");
    }
    selectedCategory = category;
}

let icons = document.querySelectorAll(".icons-name");
icons.forEach(icon => {
    icon.addEventListener("click", () => {
        let categoryText = icon.querySelector("p").textContent.trim();
        if (categoryText === selectedCategory) {
            handleCategoryClick("");
            icon.classList.remove("active");
        } else {
            handleCategoryClick(categoryText);
            icons.forEach(otherIcon => {
                if (otherIcon !== icon) {
                    otherIcon.classList.remove("active");
                }
            });
            icon.classList.add("active");
        }
    });
});

handleCategoryClick("");

// @ search bar

function filterListings() {
    const searchTerm = searchInput.value.toLowerCase();
    const allListings = document.querySelectorAll('.card.index-card');
    const noResult = document.querySelector(".noSearch");
    let resultFound = false;

    allListings.forEach((listing) => {
        const title = listing.querySelector('.card-text').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            listing.closest('a').style.display = "block";
            resultFound = true;
        } else {
            listing.closest('a').style.display = "none";
        }
    });

    if (!resultFound) {
        noResult.classList.add("active");
    } else {
        noResult.classList.remove("active");
    }
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', filterListings);

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    filterListings();
});


// @ index icons scrolling
const rightBtn = document.querySelector('#right-button');
const leftBtn = document.querySelector('#left-button');

rightBtn.addEventListener("click", function(event) {
    const conent = document.querySelector('.all-icons');
    conent.scrollBy({
        top: 0,
        left: +200,
        behavior: 'smooth'
    });
    event.preventDefault();
});

leftBtn.addEventListener("click", function(event) {
    const conent = document.querySelector('.all-icons');
    conent.scrollBy({
        top: 0,
        left: -200,
        behavior: 'smooth'
    });
    event.preventDefault();
});

