var shoppingApp = angular.module('shoppingApp', []);

        shoppingApp.controller('ShoppingController', function ($scope, $http) {
            var productsUrl = 'http://localhost:3000/products';

            $scope.products = [];

            // Load products from URL
            $http.get(productsUrl)
                .then(function(response) {
                    $scope.products = response.data;
                })
                .catch(function(error) {
                    console.error('Error loading products:', error);
                });

            $scope.cart = []; // Initialize cart

            // Function to add a product to the cart
            $scope.addToCart = function(product) {
                var found = false;
                for (var i = 0; i < $scope.cart.length; i++) {
                    if ($scope.cart[i].product.id === product.id) {
                        $scope.cart[i].quantity++;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.cart.push({ product: product, quantity: 1 });
                }
            };

            // Function to remove a product from the cart
            $scope.removeFromCart = function(item) {
                var index = $scope.cart.indexOf(item);
                if (index !== -1) {
                    $scope.cart.splice(index, 1);
                }
            };

            // Function to calculate total cost
            $scope.getTotal = function() {
                var total = 0;
                for (var i = 0; i < $scope.cart.length; i++) {
                    total += $scope.cart[i].product.unitCost * $scope.cart[i].quantity;
                }
                return total;
            };

            // Function to add a new product
            $scope.addProduct = function() {
                if (!$scope.newProduct.name || !$scope.newProduct.unitCost) {
                    alert('Product Name and Unit Cost are mandatory.');
                    return;
                }

                // Create a new product object
                var newProduct = {
                    name: $scope.newProduct.name,
                    unitCost: $scope.newProduct.unitCost
                };

                // Send a POST request to add the new product to the backend
                $http.post(productsUrl, newProduct)
                    .then(function(response) {
                        $scope.products.push(response.data);
                        // Clear the input fields
                        $scope.newProduct.name = '';
                        $scope.newProduct.unitCost = '';
                        alert('Product added successfully.');
                    })
                    .catch(function(error) {
                        console.error('Error adding product:', error);
                        alert('Failed to add product. Please try again.');
                    });
            };
        });