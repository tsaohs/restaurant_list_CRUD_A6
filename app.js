// 載入 express 並建構應用程式伺服器
const express = require('express')
// 引用 body-parser
const bodyParser = require('body-parser')
//express-handlebars
const exphbs = require('express-handlebars')
// method override
const methodOverride = require('method-override')
// 引用路由器
const routes = require('./routes/index')
//use mongoDB
require('./config/mongoose')

const app = express()
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// 將 request 導入路由器
app.use(routes)

// 設定 port 3000
app.listen(3000, () => {
  console.log('Restaurant List CRUD is running on http://localhost:3000')
})