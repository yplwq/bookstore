//导入mongoose模块
const mongoose = require('mongoose')

//设置数据库连接地址
mongoose.connect('mongodb://localhost:27017/bookstore')

//连接数据库
var db = mongoose.connection;

// 数据库连接失败的提示
db.on('error', err => console.error('数据库连接错误：', err));
// 数据库连接成功的提示
db.once('open', () => console.log('数据库连接成功'));

var Schema = mongoose.Schema;

// 用户
var UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    petname: String,
    email: String,
    phone: String,
    address: String,
    isAdmin: Boolean
});
var User = mongoose.model('user', UserSchema);

// 书籍
var BookSchema = new Schema({
    bookName: { type: String, unique: true },
    author: String,
    price: String,
    publisher: String,
    ISBN: String,
    score: Number,
    time: String,
    introduction: String,
    type: String,
    picture: String
});
var Book = mongoose.model('book', BookSchema);

// 购物车
var CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    book: { type: Schema.Types.ObjectId, ref: "book" }
});
var Cart = mongoose.model('cart', CartSchema)

// 订单
var OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    product: [
        {
            book: { type: Schema.Types.ObjectId, ref: "book" },
            count: Number,
            total: Number
        }
    ],
    address: String,
    createTime: Date,
    price: Number
});
var Order = mongoose.model('order', OrderSchema);

// 导出User模块
module.exports = { User, Book, Cart, Order };