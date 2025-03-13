const getProducts_of_products_tab = async () => {
    try {
        const response = await fetch('/all-products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Call the function
getProducts_of_products_tab().then(data => createProductCards(data, "Products", '.all-products'));