var rest = require('../API/restClient');
var builder = require('botbuilder');

exports.displayStockCard = function getStockData(companyCode, session){
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+companyCode+"&interval=1min&apikey=GNTXMYFTOGOOWD20"
    rest.getStockData(url, session, companyCode, getClosePrice)
}

function getClosePrice(message, companyCode, session){
    //Parses Json
    var objList = JSON.parse(message);
    //Grabs the name of second top level key
    var dataKey = Object.keys(objList)[1];
    //Grabs the name of the first object in dataKey
    var currentPrices = Object.keys(objList[dataKey])[0];
    //Grabs the name of the first object in dataKey
    var closePrice = Object.keys(objList[dataKey][currentPrices])[3];

    //Stores the value of the price at the start of the minute
    var value = objList[dataKey][currentPrices][closePrice];
    session.send("%s\'s stock value is currently US$%s", companyCode.toUpperCase(), value);
}