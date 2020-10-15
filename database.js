const mongoose = require('mongoose');
require('dotenv/config');
const RiddleModel = require('./model');
const promise = require('promise');


class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(process.env.DB_CONNECTION, { 'useNewUrlParser':true, 'useUnifiedTopology': true })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }



async getRiddle(numRiddles){
  const agg = await RiddleModel.aggregate([{
            $sample: { size: 100 }
        }, {
            $group: {
                _id: "$_id",
                document: { $push: "$$ROOT" }
            }
        }, {
            $limit: numRiddles
        }, {
            $unwind: "$document"
        }]);
  return agg;
  }

}




module.exports = new Database();






//console.log(await res);


// setInterval(function(){
//    scraper();},500); 

