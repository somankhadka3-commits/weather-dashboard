(() => {
const $=id=>document.getElementById(id);
const state={unit:'C',weather:null,place:null};
const weatherCodes={
0:['Clear sky','☀'],1:['Mainly clear','🌤'],2:['Partly cloudy','⛅'],3:['Overcast','☁'],45:['Fog','🌫'],48:['Rime fog','🌫'],51:['Light drizzle','🌦'],53:['Drizzle','🌦'],55:['Dense drizzle','🌧'],56:['Freezing drizzle','🌧'],57:['Freezing drizzle','🌧'],61:['Light rain','🌦'],63:['Rain','🌧'],65:['Heavy rain','🌧'],66:['Freezing rain','🌧'],67:['Heavy freezing rain','🌧'],71:['Light snow','🌨'],73:['Snow','🌨'],75:['Heavy snow','❄'],77:['Snow grains','🌨'],80:['Rain showers','🌦'],81:['Rain showers','🌧'],82:['Heavy showers','⛈'],85:['Snow showers','🌨'],86:['Heavy snow showers','❄'],95:['Thunderstorm','⛈'],96:['Thunderstorm with hail','⛈'],99:['Thunderstorm with hail','⛈']};
function temp(c){return Math.round(state.unit==='C'?c:c*9/5+32)+'°'}
function weather(code){return weatherCodes[code]||['Variable conditions','🌤']}
function uvLabel(n){return n<=2?'Low':n<=5?'Moderate':n<=7?'High':n<=10?'Very high':'Extreme'}
function setMessage(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error)}
function formatDate(date){return new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}
async function searchCity(name){
setMessage('Finding '+name+'…');
try{
const geo=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(name)+'&count=1&language=en&format=json');
if(!geo.ok)throw new Error('Could not reach the location service.');
const result=await geo.json();if(!result.results?.length)throw new Error('City not found. Try another spelling.');
const place=result.results[0];await loadWeather(place);
}catch(e){setMessage(e.message||'Something went wrong. Please try again.',true)}
}
async function loadWeather(place){
setMessage('Getting the latest forecast…');
const params=new URLSearchParams({latitude:place.latitude,longitude:place.longitude,current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max',timezone:'auto',forecast_days:'5'});
const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params);
if(!response.ok)throw new Error('Weather data is temporarily unavailable.');
const data=await response.json();state.weather=data;state.place=place;render();setMessage('Updated just now · Local time at '+place.name);
}
function render(){
const d=state.weather,c=d.current,day=d.daily;
const condition=weather(c.weather_code);
$('placeName').textContent=state.place.name+(state.place.admin1?', '+state.place.admin1:'')+', '+(state.place.country||'');
$('localDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:d.timezone});
$('temperature').textContent=temp(c.temperature_2m);$('condition').textContent=condition[0];$('feels').textContent='Feels like '+temp(c.apparent_temperature);
$('weatherArt').textContent=condition[1];$('highLow').textContent=temp(day.temperature_2m_max[0])+' / '+temp(day.temperature_2m_min[0]);
$('wind').textContent=Math.round(c.wind_speed_10m)+' km/h';$('humidity').textContent=c.relative_humidity_2m+'%';
$('detailHumidity').textContent=c.relative_humidity_2m+'%';$('detailWind').textContent=Math.round(c.wind_speed_10m)+' km/h';
const uv=day.uv_index_max[0];$('uv').textContent=Number(uv).toFixed(1);$('uvLabel').textContent=uvLabel(uv)+' UV today';$('detailFeels').textContent=temp(c.apparent_temperature);
$('forecast').innerHTML='';
day.time.forEach((date,i)=>{
const item=document.createElement('div');item.className='forecast-day';
const name=document.createElement('div');name.className='day';name.textContent=i===0?'Today':formatDate(date).split(',')[0];
const icon=document.createElement('div');icon.className='icon';icon.textContent=weather(day.weather_code[i])[1];
const temps=document.createElement('div');temps.className='temps';const high=document.createElement('b');high.textContent=temp(day.temperature_2m_max[i]);const low=document.createElement('span');low.textContent=temp(day.temperature_2m_min[i]);temps.append(high,low);
const rain=document.createElement('div');rain.className='rain';rain.textContent=(day.precipitation_probability_max[i]??0)+'% rain';
item.append(name,icon,temps,rain);$('forecast').append(item);
});
}
$('searchForm').addEventListener('submit',e=>{e.preventDefault();const city=$('cityInput').value.trim();if(city)searchCity(city)});
$('unitToggle').addEventListener('click',()=>{state.unit=state.unit==='C'?'F':'C';$('unitToggle').innerHTML=state.unit==='C'?'°C <span>/ °F</span>':'°F <span>/ °C</span>';if(state.weather)render()});
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(async pos=>{
try{const rev=await fetch('https://geocoding-api.open-meteo.com/v1/reverse?latitude='+pos.coords.latitude+'&longitude='+pos.coords.longitude+'&language=en&format=json');const data=await rev.json();const place=data.results?.[0];if(place){$('cityInput').value=place.name;await loadWeather(place);return}}catch{}
searchCity('Kathmandu');
},()=>searchCity('Kathmandu'),{timeout:4500});
}else searchCity('Kathmandu');
})();