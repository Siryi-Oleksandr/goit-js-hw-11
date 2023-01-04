import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService } from './js/search-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  btnSearch: document.querySelector('[type="submit"]'),
  galleryContainer: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-load-more'),
};

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again.';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

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
  imagesServise.fetchImages().then(({ hits, totalHits }) => {
    showImagesList(hits);
    gallery.refresh(); // Destroys and reinitilized the lightbox

    // add smooth page scrolling
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function handleSearchResult(data) {
  const { hits, totalHits } = data;
  clearImagesContainer();
  if (hits.length === 0) {
    return Notify.failure(errorMessage);
  }
  showImagesList(hits);
  Notify.success(`Hooray! We found ${totalHits} images.`);

  gallery.refresh(); // Destroys and reinitilized the lightbox
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
