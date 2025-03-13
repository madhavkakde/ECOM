// import { getProducts, createProductCards } from './home.js';
const searchKey = decodeURI(location.pathname.split('/').pop());
console.log('got the Uri')
getProducts(searchKey).then(data => createProductCards(data, searchKey, '.search-listing'));