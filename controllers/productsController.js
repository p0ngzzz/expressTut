// products api controller
// normally set logic of api in controller

const data = {
  products: require("../model/products.json"),
  setProducts: function (data) {
    this.products = data;
  },
};

const getAllProducts = (req, res) => {
  res.json(data.products);
};

const createProducts = (req, res) => {
  const newProducts = {
    productID: data.products[data.products.length - 1].productID + 1 || 1,
    productName: req.body.productName,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  if(!newProducts.productName || !newProducts.price || !newProducts.quantity) {
    res.status(400).json({message: 'productName, price, quantity is required'})
  }else {
    const newProductList = [...data.products, newProducts]
    data.setProducts(newProductList)

    res.status(201).json(data.products)
  }
};

const updateProducts = (req, res) => {
    const findProduct = data.products.find((product) => product.productID === parseInt(req.body.productID))
    if(!findProduct) {
        res.status(400).json({'message': `productID ${req.body.productID} is not existed`})
    }
    console.log('find product')
    if(findProduct.productName) findProduct.productName = req.body.productName
    if(findProduct.price) findProduct.price = req.body.price
    if(findProduct.quantity) findProduct.quantity = req.body.quantity

    const otherProductList = data.products.filter(product => product.productID !== parseInt(req.body.productID))
    console.log("otherProductList: ", otherProductList)
    const productsList = [...otherProductList, findProduct]
    const sortProductList = productsList.sort((a,b) => a.productID - b.productID)
    data.setProducts(sortProductList)
    res.status(200).json(data.products)
}

const removeProduct = (req, res) => {
    const findProduct = data.products.find(product => product.productID === parseInt(req.body.productID))
    if(!findProduct) {
        res.status(400).json({'message': `productID ${req.body.productID} is not existed`})
    }else {
        const filterProduct = data.products.filter(product => product.productID !== parseInt(req.body.productID))
        data.setProducts(filterProduct)
        res.status(200).json(data.products)
    }
}

const getProduct = (req, res) => {
    console.log(req.params.productID)
    const findProduct = data.products.find(product => product.productID === parseInt(req.params.productID))
    if(!findProduct) {
        res.status(400).json({'message': `productID ${req.params.productID} is not existed`})
    }else {
        res.status(200).json(findProduct)
    }
}
module.exports = { getAllProducts, createProducts, updateProducts, removeProduct, getProduct };
