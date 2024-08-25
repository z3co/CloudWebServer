const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');



const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

const upload = multer({ 
    dest: 'uploads/',
    // Preserve the original filename and extension
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname); // Use original filename
        }
    }),
});

// read users from file
function readUsersFromFile() {
    try {
        const usersData = fs.readFileSync('users.json');
        return JSON.parse(usersData);
    } catch (error) {
        return[];
    }
}

function writeUsersToFile(users) {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}



function authenticate(req, res, next) {
    

    console.log('loggedIn Cookie Value:', req.cookies && req.cookies.loggedIn);
console.log('Request Cookies:', req.cookies);
    // Middleware to check authentication

    // Check if req.cookies is defined and loggedIn cookie is set to 'true'
    if (req.cookies && req.cookies.loggedIn === 'true') {
        // User is authenticated, proceed to the next middleware/route handler
        next();
    } else {
        // User is not authenticated, send a 401 Unauthorized response
        res.status(401).send('Unauthorized: Please log in first');
    }
}




// route to register accounts
app.post('/register', authenticate, async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = readUsersFromFile();

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        users.push({ username, password: hashedPassword });

        writeUsersToFile(users);

        res.redirect('loginPage.html');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = readUsersFromFile();

        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(401).send('Invalid Username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        res.cookie('loggedIn', true); 

        res.redirect('uploadPage.html');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    res.redirect('uploadSuccesfull.html');
});

app.get('/download/:filename', authenticate, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
        const contentType = getContentType(filename);
        

    if (contentType) {
        res.setHeader('Content-disposition', 'attachments; filename=' + filename);
        res.setHeader('Content-type', contentType);
    } else {
        res.setHeader('Content-type', 'application/octet-stream');
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    } else {
        res.status(404).send('File Not Found');
    }

    
});

function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.pdf':
            return 'application/pdf';
        case '.mp4':
            return 'video/mp4';
        case '.wmv':
            return 'video/x-ms-wmv';
        case '.mp3':
            return 'audio/mpeg';
        case '.zip':
            return 'application/zip';

        default:
            return null;
    }
}


app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading upload directory');
        }
        res.json(files);
    });
});

app.get('/check-auth', authenticate, (req, res) => {
    // If the middleware checkAuth passes, it means the user is authenticated
    res.sendStatus(200);
});

app.get('/upload-page', authenticate, (req, res) => {
    res.redirect('uploadPage');
});

// Route for logging out
app.post('/logout', (req, res) => {
    // Clear the authentication token or session data
    
    res.clearCookie('loggedIn'); 
    
    // Redirect the user to the login page or send a response confirming logout
    res.redirect('loginPage.html'); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});