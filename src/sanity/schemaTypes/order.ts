// schemas/order.ts
const orderSchema = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'bankName',
      title: 'Bank Name',
      type: 'string',
    },
    {
      name: 'bankDetails',
      title: 'Bank Details',
      type: 'string',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'products' }] }], // Update to 'products'
    },
  ],
};

export default orderSchema;