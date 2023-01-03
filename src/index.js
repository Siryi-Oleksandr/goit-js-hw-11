import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService } from './js/search-service';
const refs = {
  searchForm: document.querySelector('#search-form'),
  btnSearch: document.querySelector('[type="submit"]'),

  galleryContainer: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
// refs.btnLoadMore.addEventListener('click', onLoadMore);

// TODO start
const imagesServise = new ImagesApiService();
// TODO end

function onSearch(e) {
  e.preventDefault();

  imagesServise.query = e.currentTarget.elements.searchQuery.value;

  if (!imagesServise.query) {
    return alert('Wrong query');
  }
  imagesServise.resetPage();
  imagesServise.fetchImages().then(({ hits, totalHits }) => {
    clearImagesContainer();
    showImagesList(hits);
    console.log(hits);

    console.log(`Hooray! We found ${totalHits} images.`);
  });
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
      }) => `<div class="photo-card">
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
</div>`
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
