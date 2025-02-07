// queries.ts
export const ordersQuery = `*[_type == "order"] {
    _id,
    name,
    email,
    phone,
    address,
    bankName,
    bankDetails,
    totalPrice,
    items[]->{
      _id,
      title,
      price,
      image
    },
    _createdAt
  } | order(_createdAt desc)`
  
  export const productsQuery = `*[_type == "products"] {
    _id,
    title,
    price,
    priceWithoutDiscount,
    badge,
    image {
      ...,
      asset->
    },
    category->{name},
    description,
    inventory,
    tags
  }`