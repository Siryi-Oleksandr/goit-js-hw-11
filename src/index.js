import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService, perPage } from './js/search-service';
import { smoothPageScrolling, up } from './js/page-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const throttle = require('lodash.throttle');
import { createMarkupImagesList } from './js/card-markup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  btnSearch: document.querySelector('[type="submit"]'),
  galleryContainer: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-load-more'),
  btnUp: document.querySelector('#back-top'),
};

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again.';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore); // realized this feature too (if you want to use button - change "display: none" in css)
refs.btnUp.addEventListener('click', up);

const imagesServise = new ImagesApiService(); // create new copy of the Class search-service
let gallery = new SimpleLightbox('.gallery a'); // SimpleLightbox initialization

function onSearch(e) {
  e.preventDefault();

  refs.btnLoadMore.classList.add('visually-hidden');

  imagesServise.query = e.currentTarget.elements.searchQuery.value;

  if (!imagesServise.query) {
    return Notify.failure(errorMessage);
  }

  imagesServise.resetPage();
  // handle search result
  imagesServise.fetchImages().then(handleSearchResult);
}

function onLoadMore() {
  imagesServise.fetchImages().then(handleLoadMore);
}

function handleSearchResult(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  clearImagesContainer();
  if (hits.length === 0) {
    return Notify.failure(errorMessage);
  }
  showImagesList(hits);
  Notify.success(`Hooray! We found ${totalHits} images.`);

  isEndOfPage(totalHits); // check last page and hide button

  gallery.refresh(); // Destroys and reinitilized the lightbox
}

function handleLoadMore(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  showImagesList(hits);
  gallery.refresh(); // Destroys and reinitilized the lightbox

  isEndOfPage(totalHits); // check last page and hide button

  smoothPageScrolling(); // add smooth page scrolling (disabled for infinite scroll) this feature actual for button Load More
}

function showImagesList(images) {
  const markup = createMarkupImagesList(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function isEndOfPage(totalHits) {
  const notifyOptions = {
    position: 'center-bottom',
    distance: '50px',
    timeout: 4000,
    clickToClose: true,
    cssAnimationStyle: 'from-bottom',
    showOnlyTheLastOne: true,
  };

  const showBtn = imagesServise.page - 1 < Math.ceil(totalHits / perPage);
  if (showBtn) {
    refs.btnLoadMore.classList.remove('visually-hidden');
  } else {
    refs.btnLoadMore.classList.add('visually-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
  }
}

// Infinite Scroll (leave for me)

// function infiniteScroll() {
//   let isAddToPage =
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight - 400;

//   if (isAddToPage) {
//     onLoadMore();
//   }
// }
