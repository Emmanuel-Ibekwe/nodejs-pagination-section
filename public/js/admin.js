const deleteProduct = btn => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");
  fetch(`/admin/products/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf
    }
  })
    .then(result => {
      //   console.log(result);
      return result.json();
    })
    .then(data => {
      console.log(data);
      //   This works in modern browsers except internet explorer
      //   productElement.remove();
      //   Works in all browsers regardless of whether is a modern browser or not
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });
};
