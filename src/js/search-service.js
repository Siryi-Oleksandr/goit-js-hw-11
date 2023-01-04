import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '32551916-52acd45cb85fdadfb1e78d261';
const URL = `https://pixabay.com/api/`;

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const axiosParams = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    };

    try {
      const response = await axios.get(URL, {
        params: axiosParams,
        validateStatus: function (status) {
          return status < 500 || status !== 404; // validateStatus config option, you can define HTTP code(s) that should throw an error.
        },
      });
      return { hits: response.data.hits, totalHits: response.data.totalHits };
    } catch (error) {
      console.log('Error', error.message);
      return Notify.failure(`${error.message}`);
    }

    // if (!response.ok) {
    //   throw new Error(response.statusText);
    // }
    // const responseData = await response.then(response => {
    //   this.incrementPage();
    //   return { hits: response.data.hits, totalHits: response.data.totalHits };
    // });
    // return responseData;
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
