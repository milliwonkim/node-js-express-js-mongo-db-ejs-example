const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://rldnjs9347:rldnjs12@cluster0-mn7e4.mongodb.net/test';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected To Database');

        /**we need the db variable from connection to access MongoDB
         * it means that we need to put our express request handlers into the MongoClient's 'then()' call
         */

        // change database
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.get('/', (req, res) => {
            /**res.send와 res.sendFile을 같이하면 에러 뜸 */
            // res.send('Hello World!')
            // res.sendFile(__dirname + '/index.html')

            const cursor = db.collection('quotes').find().toArray()
                .then(results => {
                    // console.log(results)
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
            console.log(cursor)
        })

        /**'/quotes'는 index.html에서 form action="/qoutes" 에서 옴*/
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        /**
         * 'upsert'는 만약에 업데이트할 document가 없다면 document를 삽입하겠다는 뜻임
         *
         * MongoDB에서는 $set, $inc, $push같은 update operator들을 쓴다
         * */
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: 'Darth Vader' }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                  return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vadar's quote`)
              })
              .catch(error => console.error(error))
        })
    })
    .catch(error => console.error(error))

const port = 3000;
app.listen(port, () => console.log(`listening on ${port}`));