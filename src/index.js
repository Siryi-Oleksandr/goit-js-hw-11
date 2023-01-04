import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService, perPage } from './js/search-service';
import { smoothPageScrolling, up } from './js/page-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const throttle = require('lodash.throttle');

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
// refs.btnLoadMore.addEventListener('click', onLoadMore); // realized this feature too (if you want to use button - change "display: none" in css)
refs.btnUp.addEventListener('click', up);
window.addEventListener('scroll', throttle(infiniteScroll, 300)); // listener for infinite scroll

const imagesServise = new ImagesApiService(); // create new copy of the Class search-service
let gallery = new SimpleLightbox('.gallery a'); // SimpleLightbox initialization

function onSearch(e) {
  e.preventDefault();

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

  gallery.refresh(); // Destroys and reinitilized the lightbox
}

function handleLoadMore(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  const isAvailableImages = isEndOfPage(totalHits); // check available images to load
  if (isAvailableImages) return;

  showImagesList(hits);
  gallery.refresh(); // Destroys and reinitilized the lightbox

  smoothPageScrolling(); // add smooth page scrolling
}

function createMarkupImagesList(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b> ${downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');
}

function showImagesList(images) {
  const markup = createMarkupImagesList(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

// Infinite Scroll

function infiniteScroll() {
  let isAddToPage =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight;

  if (isAddToPage) {
    onLoadMore();
  }
}

function isEndOfPage(totalHits) {
  const allHits = totalHits ? totalHits : 1;
  const isAvailableImages = imagesServise.page > allHits / perPage;
  const notifyOptions = {
    position: 'center-bottom',
    distance: '50px',
    timeout: 5000,
    clickToClose: true,
    cssAnimationStyle: 'from-bottom',
  };

  if (isAvailableImages) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
    return true;
  }
  return false;
}
