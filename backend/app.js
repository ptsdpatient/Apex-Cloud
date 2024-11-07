const express = require('express');
const pool = require('./database'); 
const svgCaptcha = require('svg-captcha');
require('dotenv').config();
const app = express();
const fileUpload = require('express-fileupload');
// const port =  process.env.PORT;
const cors = require('cors')
const jwt = require('jsonwebtoken');
const secretKey='apex_cloud_auth'
const fs = require('fs');
const path = require('path');
const https = require('https')

let index=0

const baseUploadDir = path.join(__dirname, 'uploads');


// const sslOptions = {
//     key: fs.readFileSync('/home/apex_live/Apex-Live/certificate/private.key'),
//     cert: fs.readFileSync('/home/apex_live/Apex-Live/certificate/certificate.crt'),
//     ca: fs.readFileSync('/home/apex_live/Apex-Live/certificate/ca_bundle.crt') // Optional, if you have CA bundle
// };



app.use(fileUpload());
app.use(express.json());
app.options("*",cors());
app.use(cors())


async function getFolderSize(folderName) {
    const folderPath = path.join(baseUploadDir, folderName);

    async function calculateSize(currentPath) {
        let size = 0;
        try {
            const stats = await fs.promises.stat(currentPath);
            if (stats.isDirectory()) {
                const files = await fs.promises.readdir(currentPath);
                for (const file of files) {
                    const filePath = path.join(currentPath, file);
                    size += await calculateSize(filePath);  // accumulate size within this directory
                }
            } else {
                size += stats.size;  // accumulate file size
            }
        } catch (err) {
            console.error(`Error accessing ${currentPath}:`, err);
        }
        return size;
    }

    const totalSize = await calculateSize(folderPath);

    const readableSizeInGB = (totalSize / (1024 ** 3)).toFixed(totalSize === 0 ? 0 : 2);  
    // console.log('Total size for folder:', folderPath, 'is', readableSizeInGB + ' GB');
    return readableSizeInGB;
}
  


function listFilesAndFolders(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
            if (err) {
                return reject(err);
            }
            const filesAndFolders = entries.map(entry => ({
                name: entry.name,
                isDirectory: entry.isDirectory()
            }));
            resolve(filesAndFolders);
        });
    });
}






function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];    
    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid' }); 
        }
        req.id = user.userId; 
        req.error = false;
        next(); 
    });
}

app.get('/api/authenticateToken', authenticateToken, (req, res) => {
    res.status(200).json({ 
        message: 'Token is valid', 
        error: req.error, 
        name:req.user,
        done:true,
    });
});

app.post('/api/getFiles',authenticateToken,async (req,res)=>{
    const {path,sub} = req.body
    const {rows } = await pool.query(`SELECT s.id as id, m.mountpoint as mountpoint
        FROM subscriptions s
        JOIN mountpoints m ON s.mountpoint = m.id
        WHERE s.sub_name = $1;`,[sub])

    listFilesAndFolders(`uploads/${rows[0].mountpoint}/${rows[0].id}/${path}`)
        .then(filesAndFolders => {
            res.status(200).json(filesAndFolders)
        })
        .catch(err =>{
            console.error(err)
        });
})

app.post('/api/checkout', async (req, res) => {
    const { solution,storage,name,email,mobile,upi } = req.body;
    const result = await pool.query(
        'SELECT * FROM captchas WHERE solution = $1 AND expiry > NOW() ORDER BY id DESC LIMIT 1',
        [solution]
    );

    if (result.rows.length === 0) {
        return res.status(400).send('Invalid or expired CAPTCHA');
    }
    const upiUrl = `upi://pay?pa=tanishqssg4-1@oksbi&pn=ETC-24-Tanishq%20Dhote&aid=uGICAgMDs5oWbKA&am=${storage}`;


    res.status(200).send({
        qr:"",
        payment_id:""
    });
});


app.get('/api/captcha', async (req, res) => {
    console.log("captcha")
    const captcha = svgCaptcha.create();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); 
    await pool.query(
        'INSERT INTO captchas (solution, expiry) VALUES ($1, $2);',
        [captcha.text, expiry]
    );

    res.status(200).send({captcha:captcha.data});

});


app.post('/api/upload',authenticateToken, (req, res) => {
    
    const filePath = req.body.filePath; 
    const fullUploadPath = path.join(baseUploadDir, filePath);

    fs.mkdirSync(fullUploadPath, { recursive: true });

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFiles = req.files.files; 

    if (!Array.isArray(uploadedFiles)) {
        uploadedFiles.mv(path.join(fullUploadPath, uploadedFiles.name), (err) => {
            if (err) console.log(err);
        });
    } else { 
        uploadedFiles.forEach(file => {
            file.mv(path.join(fullUploadPath, file.name), (err) => {
                if (err) console.log(err);
            });
        });
    }

    // res.status(200).json({ message: 'Files uploaded successfully' });
});


app.get('/api/getSubscriptions',authenticateToken,async (req,res)=>{
    // console.log('getting subscriptions for : ',req.id)
    try{
        const { rows } = await pool.query('SELECT id, sub_name, mountpoint, storage FROM subscriptions WHERE user_id = $1;',[req.id]);
        
        const response = await Promise.all(rows.map(async row => {
            const { rows: mountPointRows } = await pool.query('SELECT mountpoint FROM mountpoints WHERE id = $1;', [row.mountpoint]);
            const mountpoint = mountPointRows.length > 0 ? mountPointRows[0].mountpoint : 'Unknown';
            return {
                sub_name: row.sub_name,
                storage: row.storage,
                usage: await getFolderSize(`/${mountpoint}/${row.id}/`)
            };
        }));

        res.status(200).json(response);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})




app.get('/api/',(req,res)=>{
    console.log(`[${index}] port is working`)
    index++
    res.send('endpoint is working!')
})

app.post('/api/myCameraList', authenticateToken, async (req, res) => {
    const { operator } = req.body;
    console.log(operator)
    try {

        const operatorResult = await pool.query(`
            SELECT id FROM employees WHERE full_name = $1;
        `, [operator.trim()]);


        if (operatorResult.rowCount === 0) {
            console.log("employee not found")
            return res.status(404).json({ message: "Employee not found" });
        }

        const operatorId = operatorResult.rows[0].id;
        

        const { rows } = await pool.query(`
            SELECT 
                cameras.id AS "camera_id",
                cameras.serial_number AS "serial_number",
                polling_stations.polling_station_name AS "polling_station_name",
                polling_stations.polling_address AS "polling_address",
                polling_stations.id AS "polling_id",
                supervisor_employee.full_name AS "supervisor_name",
                supervisor_employee.phone_number AS "supervisor_phone",
                operator_employee.full_name AS "operator_name",
                operator_employee.phone_number AS "operator_phone",
                constituencies.ac_name AS "ac_name",
                constituencies.ac_number AS "ac_number"
            FROM cameras
            LEFT JOIN polling_stations ON cameras.PS = polling_stations.id
            LEFT JOIN employees AS supervisor_employee ON polling_stations.supervisor = supervisor_employee.id  
            LEFT JOIN employees AS operator_employee ON cameras.operator = operator_employee.id  
            LEFT JOIN constituencies ON polling_stations.constituency = constituencies.id
            WHERE 
                polling_stations.supervisor = $1 
                OR cameras.operator = $1;
        `, [operatorId]);


        res.status(200).json(rows);

    } catch (err) {
        console.log("error occurred : "+err)
        return res.status(500).json({ message: "Error occurred: " + err });
    }
});


app.get('/api/getPollingStation',authenticateToken,async (req,res)=>{
    // console.log("getting ps")
    try{
        const query = `         
                        SELECT
                        ps.id AS polling_station_id,
                        ps.polling_station_name,
                        ps.polling_address,
                        t.taluka AS taluka_name,
                        e.full_name AS supervisor_name,
                        e.phone_number AS supervisor_phone,
                        c.ac_number,
                        c.ac_name,
                        c.taluka AS constituency_taluka_id
                        FROM
                            polling_stations ps
                        LEFT JOIN
                            constituencies c ON ps.constituency = c.id
                        LEFT JOIN
                            taluka t ON c.taluka = t.id
                        LEFT JOIN
                            employees e ON ps.supervisor = e.id;
                    `;

       
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.get('/api/getConstituencies',authenticateToken,async (req,res)=>{
    // console.log("getting constituency")
    try{
        const query = `        
                    SELECT
                    c.id AS constituency_id,
                    c.ac_number,
                    c.ac_name,
                    t.taluka AS taluka_name
                    FROM
                        constituencies c
                    LEFT JOIN
                        taluka t ON c.taluka = t.id                  
        `;
        const { rows } = await pool.query(query);
        // console.log(rows)

        res.status(200).json(rows);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/api/registerConstituency',authenticateToken,async (req,res)=>{
    const {number,name,taluka} = req.body
    try{
        const taluka_id = await pool.query('SELECT id FROM taluka WHERE taluka = $1',[taluka])
        const result = await pool.query(
            'INSERT INTO constituencies (ac_number, ac_name, taluka) VALUES ($1, $2, $3) RETURNING ac_name',
            [number,name,taluka_id.rows[0].id]
        );
        const ac_name = result.rows[0].ac_name;
        res.status(200).json({ message: 'Employee registered successfully.', name: ac_name,done:true });
        console.log("$ Constituency registered with AC name : " + ac_name)
    }catch(e){
        console.log("error occured : "+e)
        res.status(201).json({ message: 'Constituency not registered.',done:false });

    }
})

app.post('/api/registerPollingStation',authenticateToken,async (req,res)=>{
    const {name,supervisor,address,constituency} = req.body
    try{

        const supervisor_id = await pool.query('SELECT id FROM employees WHERE full_name = $1',[supervisor])
        const constituency_id = await pool.query('SELECT id FROM constituencies WHERE ac_name = $1',[constituency])
       
        const result = await pool.query(
            'INSERT INTO polling_stations (polling_station_name, polling_address, constituency, supervisor) VALUES ($1, $2, $3, $4) RETURNING polling_station_name',
            [name,address,constituency_id.rows[0].id,supervisor_id.rows[0].id]
        );

        const PS_address = result.rows[0].polling_station_name;
        res.status(200).json({ message: 'Polling Station registered successfully.', name: PS_address,done:true });
        console.log("$ Polling Station registered with PS name : " + PS_address)
    }catch(e){
        console.log("error occured : "+e)
        res.status(201).json({ message: 'Polling Station not registered.',done:false });

    }
})


app.post('/api/registerCamera',authenticateToken,async (req,res)=>{
    console.log("camera request received")
    const {number,poll_station,operator} = req.body
    if (!number || !poll_station ||!operator) {
        console.log("reg error")
        return res.status(401).json({ message: 'Camera not registered.', done: false });
    }

    const trimmed_poll_station = poll_station.trim(); 
    const trimmed_operator= operator.trim()

    try{
        const operator_id = await pool.query('SELECT id FROM employees WHERE full_name = $1',[trimmed_operator])
        const poll_id = await pool.query('SELECT id FROM polling_stations WHERE polling_station_name = $1',[trimmed_poll_station])
        
        console.log("pol id got")

       if (poll_id.rowCount === 0) {
        console.log(`-> Polling station "${poll_station}" not found.`);
        return res.status(404).json({ message: 'Polling station not found', done: false });
        }

        const result = await pool.query(
            `INSERT INTO cameras (serial_number, PS,operator, is_active) VALUES ($1, $2, $3,$4) ON CONFLICT (serial_number) DO NOTHING RETURNING serial_number`,
            [number,poll_id.rows[0].id,operator_id.rows[0].id ,false]
        );
        if(result.rows.length > 0){
            const serial_number = result.rows[0].serial_number;
            res.status(200).json({ message: 'Camera registered successfully.', name: serial_number,done:true });
            console.log("$ Camera registered with model name : " + serial_number)
        }else res.status(404).json({done:false})
    }catch(e){
        console.log("error occured : "+e)
        res.status(401).json({ message: 'Camera not registered.',done:false });

    }
})


app.post('/api/registerEmployee',authenticateToken,async (req,res)=>{
    const {name,password,number,isAdmin} = req.body
    
    try{

        const result = await pool.query(
            'INSERT INTO employees (full_name, pass, is_admin, phone_number) VALUES ($1, $2, $3, $4) RETURNING full_name',
            [name, password, isAdmin ? 1 : 0, number]
        );

        const employeeName = result.rows[0].full_name;
        res.status(200).json({ message: 'Employee registered successfully.', name: employeeName,done:true });
        console.log("$ User registered with employee name : " + employeeName)
    }catch(e){
        console.log("error occured : "+e)
        res.status(201).json({ message: 'Employee not registered.',done:false });

    }
})


app.post('/api/registerTaluka',authenticateToken,async (req,res)=>{
    const {name} = req.body
    
    try{

        const result = await pool.query(
            'INSERT INTO taluka (taluka) VALUES ($1) RETURNING taluka',
            [name]
        );

        const talukaName = result.rows[0].taluka;
        res.status(200).json({ message: 'Employee registered successfully.', name: talukaName,done:true });
        console.log("[+] Taluka registered with name : " + talukaName)
    }catch(e){
        console.log("error occured : "+e)
        res.status(201).json({ message: 'Employee not registered.',done:false });

    }
})


app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        console.log('-> Missing name or password');
        return res.status(400).json({ error: 'name and password are required' });
    }

    try {
        const { rows } = await pool.query('SELECT id, pass FROM users WHERE username = $1', [name]);

        if (rows.length === 0) {
            console.log('-> User not found with:', name);
            return res.status(401).json({ error: 'Invalid name or password' });
        }

        const storedPassword = rows[0].pass;

        if (password === storedPassword) {
            const token = jwt.sign({
                    userId: rows[0].id, 
                    name:name,
                }, 
                 secretKey, { expiresIn: '6h' }
                );
            console.log('-> Login request successful with:', name);
            return res.status(200).json({
                user: {
                    id: rows[0].id,
                    isAdmin: rows[0].is_admin !== 0,
                },
                full_name: name,
                token:token,
            });
        } else {
            return res.status(401).json({ error: 'Invalid name or password' });
        }
    } catch (err) {
        console.error('Error occurred:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(2000,'0.0.0.0',()=>{
    console.log(`\n\n\t\t\x1b[37m[+] Apex Cloud server has started on \x1b[36mhttp://0.0.0.0:${2000}\n\x1b[37m`);
})

// https.createServer(sslOptions, app).listen(port,'0.0.0.0', () => {
//     console.log(`\n\n\t\t\x1b[37m[+] Apex Live admin server has started on \x1b[36mhttps://0.0.0.0:${port}\n\x1b[37m`);
// });