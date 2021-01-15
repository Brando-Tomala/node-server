/*
 * Puerto 
 */
process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV !== 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://Brando_T:y3vIJtkfDPE9upoD@cluster0.mbmhh.mongodb.net/cafe'
}


process.env.URL_DB = urlDB
    //'

/*
user: Brando_T
pass: y3vIJtkfDPE9upoD
url_conection: mongodb+srv://Brando_T:y3vIJtkfDPE9upoD@cluster0.mbmhh.mongodb.net/cafe
*/