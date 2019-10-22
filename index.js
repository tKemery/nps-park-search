'use strict';

const API = 'PxBv40m2LmdfzkGrbNjcGfYLMVG96j6ra2FZrlJJ';
const endpoint = 'https://developer.nps.gov/api/v1/parks';

function formatQuery(params){
    const queryItems = Object.keys(params)
        .map(key => 
            `${key}=${params[key]}`)
        return queryItems.join('&');
}

function displayAddress(responseJson){
    // console.log(responseJson.results[0].formatted_address);
    $('.results-p').append(`
        <p>${responseJson.results[0].formatted_address}</p>`)
}

function getAddress(lat, long){
    const googleApi = "AIzaSyARojhKVHBjW0R-5ORXOOjdFOU04RRSLEo";
    const endpoint = "https://maps.googleapis.com/maps/api/geocode/json?";
    const url = endpoint + `latlng=${lat},${long}` + "&" + "key=" + `${googleApi}`;
    console.log(url);
    
    fetch(url).then(response => {
        if (response.ok){
            return response.json()
        }
        throw new Error(response.statusText)
        }).then(responseJson =>
            displayAddress(responseJson)).catch(err =>
                alert(`Something went wrong: ${err.message}`))
}

function convertCoords(latLong){
    if (latLong === ""){
        return "address unavailable";
    }
    else {
        const splitLatLong = latLong.split(" ");
        const strippedLat = splitLatLong[0].replace(/[^\d.-]/g, '');
        const strippedLong = splitLatLong[1].replace(/[^\d.-]/g, '');
        getAddress(strippedLat, strippedLong);
    }
    
}

function displayResults(responseJson){
    console.log(responseJson);
    $('.js-results-list').empty();
    const coordinates = responseJson.data

    for (let i = 0; i < responseJson.data.length; i++){
        $('.js-results-list').append(`
            <li>
                <h3>${responseJson.data[i].fullName}</h3>
                <p>${responseJson.data[i].description}</p>
                <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
                <p>${convertCoords(responseJson.data[i].latLong)}</p>
            </li>`)
    }

    $('results').removeClass('hidden');

}

function getParks(searchTerm, maxResults=10){
    const params = {
        stateCode: `${searchTerm}`,
        limit: `${maxResults}`,
        api_key: API
    };

    const query = formatQuery(params);
    const url = endpoint + '?' + query;

    fetch(url).then(response => {
        if (response.ok){
            return response.json()
        }
        throw new Error(response.statusText)
        }).then(responseJson =>
            displayResults(responseJson)).catch(err =>
                alert(`Something went wrong: ${err.message}`))
}

function handleSubmit(){
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getParks(searchTerm, maxResults);
    })
}

$(handleSubmit);