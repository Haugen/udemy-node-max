const products = [];

exports.getAddProduct = (req, res) => {
  res.render('pages/add-product', {
    title: 'Add product',
    path: '/admin/add'
  });
};

exports.postAddProduct = (req, res) => {
  products.push(req.body.title);
  res.redirect('/');
};

exports.getFrontpage = (req, res) => {
  res.render('pages/shop', {
    title: 'Welcome to my shop',
    products: products,
    path: '/'
  });
};
