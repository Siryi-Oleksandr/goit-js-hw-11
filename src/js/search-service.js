import axios from 'axios';

const API_KEY = '32551916-52acd45cb85fdadfb1e78d261';
const URL = `https://pixabay.com/api/`;

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const axiosParams = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    };

    return axios
      .get(URL, {
        params: axiosParams,
      })
      .then(response => {
        this.incrementPage();
        return { hits: response.data.hits, totalHits: response.data.totalHits };
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
