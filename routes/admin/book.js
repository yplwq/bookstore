const express = require("express");
const db = require('../../my_modules/db');
const check = require('../../my_modules/check');
// 获取显示的页数，最多5页
function getPages(page, pageCount) {
    var pages = [page];
    var left = page - 1;
    var right = page + 1;
    // 左右两边各加1个页码,直到页码够5个或左边到1 右边到总页数
    while (pages.length < 5 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--);
        if (right <= pageCount) pages.push(right++);
    }
    return pages;
}
var router = express.Router()

// 书籍列表
router.get('/list/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    var order = { 'bookName': 1 };
    var pageSize = 10;

    db.Book.find().count((err, total) => {
        if (err) {
            console.log(err)
        } else {
            var pageCount = Math.ceil(total / pageSize);
            page = page > pageCount ? pageCount : page
            page = page < 1 ? 1 : page;
            // select对数据属性进行筛选，属性名之间用空格分隔
            db.Book.find().sort(order).skip((page - 1) * pageSize).limit(pageSize).exec((err, data) => {
                res.render('back/book/list.html', {
                    page, pageCount, pageSize, order, pages: getPages(page, pageCount),
                    books: data
                })
            })
        }
    })
})
// 添加书籍
router.get('/add', (req, res) => {
    res.render('back/book/add.html')
})
router.post('/add', (req, res) => {
    new db.Book(req.body).save(err => {
        if (err) {
            if (err.code == 11000) {
                res.json({ code: 0, msg: '此书已存在' })
            } else {
                res.json({ code: 0, msg: '添加失败,系统出错' })
            }
        } else {
            res.json({ code: 1, msg: '添加成功' })
        }
    })
})
// 编辑书籍
router.get('/edit/:id', (req, res) => {
    db.Book.findById(req.params.id, (err, data) => {
        if (err) {

        } else {
            res.render('back/book/edit.html', { book: data })
        }
    })
})
router.post('/edit/:id', (req, res) => {
    db.Book.findByIdAndUpdate(req.params.id, req.body, err => {
        if (err) {
            res.json({ code: 0, msg: '系统错误' });
        }
        else {
            res.json({ code: 1, msg: '更新成功！' });
        }
    })
})
// 删除书籍
router.get('/del/:id', (req, res) => {
    db.Book.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.json({ code: 0, msg: '系统错误' });
        }
        else {
            res.json({ code: 1, msg: '删除成功！' });
        }
    })
})
module.exports = router;