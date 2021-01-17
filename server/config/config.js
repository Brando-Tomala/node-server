//PUERTO
process.env.PORT = process.env.PORT || 3000;

//TIEMPO CADUCIDAD TOKEN
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED TOKEN
process.env.SEED = process.env.SEED || 'seed-desa';


//MONGODB
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URL_DB = urlDB