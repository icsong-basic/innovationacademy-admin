// @flow strict
export type UserInput = {
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName: string,
  company: string,
  position: string,
  country: string
};
export type Board = { id: number, name: string, posts: Array<Post> };

export type Cancel = {
  receipt_id: string,
  remain_price: number,
  request_cancel_price: number,
  revoked_at: string,
  tid: string
};
export type CancelRequest = {
  receipt_id: string,
  name: string,
  reason: string
};
export type Coupon = {
  code: string,
  comment: string,
  createdAt: string,
  discount: number,
  id: number,
  limitedAt: string,
  quantity: number,
  updatedAt: string
};
export type File = {
  absolute: boolean,
  absoluteFile: File,
  absolutePath: string,
  canonicalFile: File,
  canonicalPath: string,
  directory: boolean,
  file: boolean,
  freeSpace: number,
  hidden: boolean,
  name: string,
  parent: string,
  parentFile: File,
  path: string,
  totalSpace: number,
  usableSpace: number
};
export type InputStream = {};
export type Item = {
  createdAt: string,
  id: number,
  price: number,
  sales: Array<Sale>,
  title: string,
  updatedAt: string
};
export type ItemInput = { title: string, price: number };
export type Order = {
  bootpay: Bootpay,
  canceledAt: string,
  createdAt: string,
  datas: Array<OrderData>,
  id: number,
  paymentAt: string,
  price: number,
  updatedAt: string,
  user: User
};
export type OrderData = {
  attachment: string,
  coupon: Coupon,
  id: number,
  order: Order,
  sale: Sale,
  user: User
};
export type OrderInput = {
  user: UserInput,
  saleId: number,
  couponCode: string,
  attachment: string
};
export type Pageable = {
  offset: number,
  pageNumber: number,
  pageSize: number,
  paged: boolean,
  sort: Sort,
  unpaged: boolean
};
export type Page<Bootpay> = {
  content: Array<Bootpay>,
  empty: boolean,
  first: boolean,
  last: boolean,
  number: number,
  numberOfElements: number,
  pageable: Pageable,
  size: number,
  sort: Sort,
  totalElements: number,
  totalPages: number
};
export type Page<Order> = {
  content: Array<Order>,
  empty: boolean,
  first: boolean,
  last: boolean,
  number: number,
  numberOfElements: number,
  pageable: Pageable,
  size: number,
  sort: Sort,
  totalElements: number,
  totalPages: number
};
export type Page<Post> = {
  content: Array<Post>,
  empty: boolean,
  first: boolean,
  last: boolean,
  number: number,
  numberOfElements: number,
  pageable: Pageable,
  size: number,
  sort: Sort,
  totalElements: number,
  totalPages: number
};
export type Post = {
  attachment: string,
  author: string,
  board: Board,
  contents: string,
  createdAt: string,
  deletedAt: string,
  id: number,
  language: string,
  link: string,
  publishedAt: string,
  thumbnail: string,
  title: string,
  updatedAt: string,
  user: User,
  writeAt: string
};
export type PostingInput = {
  language: string,
  author: string,
  title: string,
  thumbnail: string,
  contents: string,
  link: string,
  attachment: string
};
export type Receipt = {
  receipt_id: string,
  pg: string,
  pg_name: string,
  method: string,
  method_name: string,
  application_id: string,
  private_key: string,
  name: string,
  order_id: string,
  params: string,
  payment_data: {},
  price: number,
  unit: string,
  retry_count: number,
  status: number,
  requested_at: string,
  purchased_at: string,
  revoked_at: string
};
export type ReceiptResponse = {
  code: number,
  data: Receipt,
  message: string,
  status: number
};
export type Resource = {
  description: string,
  file: File,
  filename: string,
  inputStream: InputStream,
  open: boolean,
  readable: boolean,
  uri: URI,
  url: URL
};
export type Sale = {
  createdAt: string,
  id: number,
  item: Item,
  price: number,
  quantity: number,
  saleEndedAt: string,
  saleStartedAt: string,
  title: string,
  updatedAt: string
};
export type SaleInput = {
  title: string,
  price: number,
  quantity: number,
  startedAt: string,
  endedAt: string
};
export type Sort = { empty: boolean, sorted: boolean, unsorted: boolean };
export type URI = {
  absolute: boolean,
  authority: string,
  fragment: string,
  host: string,
  opaque: boolean,
  path: string,
  port: number,
  query: string,
  rawAuthority: string,
  rawFragment: string,
  rawPath: string,
  rawQuery: string,
  rawSchemeSpecificPart: string,
  rawUserInfo: string,
  scheme: string,
  schemeSpecificPart: string,
  userInfo: string
};
export type URL = {
  authority: string,
  content: {},
  defaultPort: number,
  file: string,
  host: string,
  path: string,
  port: number,
  protocol: string,
  query: string,
  ref: string,
  userInfo: string
};
export type User = {
  company: string,
  country: string,
  createdAt: string,
  email: string,
  firstName: string,
  id: number,
  lastName: string,
  name: string,
  password: string,
  position: string,
  updatedAt: string,
  username: string,
  authorities: string[]
};

export type UserLoginInput = { username: string, password: string };
