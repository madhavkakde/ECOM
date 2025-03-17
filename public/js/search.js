// search functionality
// Get the search key from the URL
const searchKey = decodeURI(location.pathname.split('/').pop());
getProducts(searchKey).then(data => createProductCards(data, searchKey, '.search-listing'));