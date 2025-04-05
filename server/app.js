const express = require('express');
const cors = require('cors');
//const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const { Pool } = require('pg');
//const secretkey = "myusersecretkey";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
});

const TOTAL_SLOTS = 10;
let k = 0;

/*const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, secretkey, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid Token" });
      next();
    });
};*/

app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    const result = await pool.query(
        `SELECT userid FROM userstable
         WHERE userid=$1 AND password=$2;`,
         [userId, password]
    );
    if (result.rowCount===1) {
        //let token = jwt.sign({ id: userId }, secretkey, { expiresIn: "1h" });
        res.json({ success: true, });
            //token: token });
    } else {
        res.json({ success: false });
    }
});

app.post('/register', async (req, res) => {
    const { userId, password } = req.body;
    try{
    await pool.query(
        `INSERT INTO userstable (userid, password) 
        VALUES ($1, $2);`,
        [userId, password]
    );
}catch(e){
    res.json({ message: "Please enter a different id"});
}
    res.json({ message: "Registration successful" });
})

/*app.get("/checkuser", verifyToken, (req, res) => {
    res.json({ message: "success" });
});*/

app.post('/adlogin', async (req, res) => {
    const { userId, password } = req.body;
    if(userId==='admin' && password==='adpassword')
        res.json({ success: true });
    else {
        res.json({ success: false });
    }
});

app.post('/check-availability', async (req, res) => {
    const { carmodel, date, timein, timeout } = req.body;
    let d= new Date(date);
    d=d.toLocaleDateString();
    let tin= new Date(timein);
    tin= tin.toLocaleTimeString();
    let tout= new Date(timeout);
    tout=tout.toLocaleTimeString();

    try {
        const query = `SELECT slot_number FROM bookingstable
                        WHERE date = $1
                        AND (
                            ($2 BETWEEN time_in AND time_out) OR  -- TimeIn falls within booked range
                            ($3 BETWEEN time_in AND time_out) OR  -- TimeOut falls within booked range
                            (time_in BETWEEN $2 AND $3) OR  -- Existing booking starts inside the new time range
                            (time_out BETWEEN $2 AND $3)  -- Existing booking ends inside the new time range
                        )
                    `;

        const result = await pool.query(query, [d, tin, tout]);

        const bookedSlots = result.rows.map(row => row.slot_number);

        for (let i = 1; i <= TOTAL_SLOTS; i++) {
            if (!bookedSlots.includes(i)) {
                k=i;
                break;
            }
        }

        if(k > 0) {
            res.json({ available: true, slotNumber: k });
        } else {
            res.json({ available: false });
        }

    } catch(e) {
        console.log(e);
    }

    /*try {
        const query = `
            SELECT slot_number FROM bookingstable 
            WHERE date = $1 
            AND (
                (time_in <= $3 AND time_out > $2) OR
                (time_in < $3 AND time_out >= $2)
            )
        `;
        const result = await pool.query(query, [d, tin, tout]);

        const bookedSlots = result.rows.map(row => row.slot_number);

        let availableSlot = null;
        for (let i = 1; i <= TOTAL_SLOTS; i++) {
            if (!bookedSlots.includes(i)) {
                availableSlot = i;
                break;
            }
        }

        if (availableSlot) {
            res.json({ available: true, slotNumber: availableSlot });
        } else {
            res.json({ available: false });
        }

    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }*/
});

app.post('/generate-qrcode', async (req, res) => {
    const { param1, param2, param3, param4, param5 } = req.body;

    if (!param2 || !param3 || !param4) {
        return res.status(400).json({ error: "Missing booking details" });
    }

    let d= new Date(param2);
    d=d.toLocaleDateString();
    let tin= new Date(param3);
    tin= tin.toLocaleTimeString();
    let tout= new Date(param4);
    tout=tout.toLocaleTimeString();
    const p='Paid';
    let mod=param1;
    try {
        /*const slotResult = await pool.query(
            `SELECT slot_number FROM generate_series(1, 10) AS slot_number
            WHERE slot_number NOT IN (
                SELECT slot_number FROM bookingstable
                WHERE date = $1
                AND (
                    ($2 BETWEEN time_in AND time_out) OR  -- TimeIn falls within booked range
                    ($3 BETWEEN time_in AND time_out) OR  -- TimeOut falls within booked range
                    (time_in BETWEEN $2 AND $3) OR  -- Existing booking starts inside the new time range
                    (time_out BETWEEN $2 AND $3)  -- Existing booking ends inside the new time range
                )
            )
            LIMIT 1;`,
            [d, tin, tout]
        );

        if (slotResult.rows.length === 0) {
            return res.status(400).json({ error: "No available slots"});
        }

        const slotNumber = slotResult.rows[0].slot_number;*/

        if(k === 0)
            return res.status(400).json({ error: "No available slots"});

        await pool.query(
            `INSERT INTO bookingstable (date, time_in, time_out, model, paystatus, slot_number, car_owner) 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [d, tin, tout, mod, p, k, param5]
        );

        const bookingData = `Date: ${d}, Time-In: ${tin}, Time-Out: ${tout}, Slot: ${k}, Booking_person: ${param5}`;
        const qrCodeDataURL = await QRCode.toDataURL(bookingData);

        res.json({ qrCode: qrCodeDataURL, slot: k });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process booking" });
    } finally {
        k = 0;
    }
});

app.get('/getusers', async (req, res) => {
    const userquery = await pool.query(
        `SELECT userid, password FROM userstable`
    );
    const allusers = userquery.rows.map(row => row);
    res.json({userdata: allusers});
})

app.get('/getbookingdata', async (req, res)=> {
    const bookquery = await pool.query(
        `SELECT date, time_in, time_out, model, paystatus, slot_number, car_owner FROM bookingstable`
    );
    const allbookings = bookquery.rows.map(row => row);
    res.json({bookingdata: allbookings});
})

app.post('/deleteuser', async (req, res) => {
    const { id }= req.body;
    try{
        const q = await pool.query(
            `DELETE FROM userstable WHERE userid=$1;`,
            [id]
        );
        res.json({message:"success"});
    } catch(e) {
        console.log("Failed to delete: "+e);
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
