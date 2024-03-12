const APIkey='f75b71c825f220ebeef7d0b1eafcfeeb';

async function search(event){
    // const input
    const inPut = document.querySelector(".input-js").value; // getting the value ( cuz "target" only return the section of code "event")
    // console.log(inPut);
    // "await" cuz fetch is a async function
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inPut}&limit=5&appid=${APIkey}`);
    const data = await response.json();
    // console.log(data);
    const insideUL = document.querySelector('form ul');
    insideUL.innerHTML = '';
    for (let i = 0; i < data.length; i++)
    {
        const {name, country, lat, lon} = data[i];
        insideUL.innerHTML += `<li style="cursor: pointer" data-name="${name}" data-lat="${lat}" data-lon="${lon}">${name}<span>${country}</span></li>`;
    };
    // or wwe can say 
    //data.forEach((item) => {insideUL.innerHTML = insideUL.innerHTML + `<li>${item.name}</li>`})
};

const debouncedSearching = _.debounce(() =>{
    search();
}, 700); // 700 milisecond = 0.7 second


document.querySelector('.input-js').addEventListener('keyup', debouncedSearching);

// accessing the location weather report

async function showWeather(lat, lon, name){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feels_like = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    // console.log(data);
    // console.log({temp, feels_like, humidity, wind,icon,description});
    document.getElementById('degrees').innerHTML = temp + '&#8451;';
    document.getElementById('city').innerHTML = name;
    document.getElementById('wind-js').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('feels-like-js').innerHTML = feels_like + '<span>&#8451;</span>';
    document.getElementById('humidity-js').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src= `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('description').innerHTML = `- ${description} -`;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';
};

document.body.addEventListener('click', (event) => {
    //console.log(event); -> you can see the a data named 'dataset' in console.log
    const li = event.target; // target the codes sections
    const {lat, lon, name} = li.dataset;
    localStorage.setItem('lat', lat); // storing 'lat' ABOVE in local storage under the variable lat
    localStorage.setItem('lon', lon); // ________'lon'__________________________________________ lon
    localStorage.setItem('name', name);// _______'name'_________________________________________ name
    if (!lat)  // do this so only element contains {lat, lon, name} can be selected 
    {          // only need to check {lat} becuz, {lat, lon, name} always comes together already
        return;
    }
    showWeather(lat, lon, name);
});

document.getElementById('change').addEventListener('click', () =>{
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';
});

// load the info has been stored in the "localStorage" to the page
document.body.onload = () => {
    if (localStorage.getItem('lat')) // check for boolean value // check xem có get được gì ko
    {
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat, lon, name);
    }
}