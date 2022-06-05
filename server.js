const jsonServer = require('json-server');
const path = require('path');
const multer = require('multer');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: function (req, file, cb) {
        const extIndex = file.originalname.lastIndexOf('.');
        const filename = file.originalname.slice(0, extIndex)
            + '-' + Date.now()
            + file.originalname.slice(extIndex);
        cb(null, filename);
    }
});
const upload = multer({ storage });

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use('/posts', upload.single('image'), (req, res, next) => {
    const isNew = req.method === 'POST';
    const isEdit = req.method === 'PATCH';

    if (isNew)
        req.body.ts = Date.now();

    if ((isNew || isEdit) && req.file)
        req.body.image = req.file.filename;

    next();
});

server.use(router);
server.listen(3010, () => {
    console.log('Diary Server is running')
});