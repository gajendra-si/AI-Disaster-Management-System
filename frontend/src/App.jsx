import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell,
Legend,
} from "recharts";

import {
MapContainer,
TileLayer,
Marker,
Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

iconRetinaUrl: markerIcon2x,

iconUrl: markerIcon,

shadowUrl: markerShadow,

});



const getMarkerColor=(severity)=>{

if(severity==="HIGH"){

return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";

}

if(severity==="MEDIUM"){

return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";

}

return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";

};





function App(){


const API_KEY="ad389e10c92b706295db4d0fa2058ecb";



const [reports,setReports]=useState([]);

const [weather,setWeather]=useState(null);

const [cityName,setCityName]=useState("");

const [currentTime,setCurrentTime]=useState(

new Date().toLocaleString()

);



const [userLocation,setUserLocation]=useState([28.6139,77.2090]);



const [formData,setFormData]=useState({

type:"",

location:"",

description:""

});



// LIVE DATE TIME

useEffect(()=>{

const timer=setInterval(()=>{

setCurrentTime(

new Date().toLocaleString()

);

},1000);



return()=>clearInterval(timer);

},[]);




// WEATHER ICON

const getWeatherIcon=()=>{


if(!weather)

return "🌤";


const condition=

weather.weather[0].main.toLowerCase();



if(condition.includes("clear"))

return "☀️";


if(condition.includes("cloud"))

return "☁️";


if(condition.includes("rain"))

return "🌧️";


if(condition.includes("thunder"))

return "⛈️";


return "🌤";

};
// CURRENT USER LOCATION

useEffect(()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

setUserLocation([

position.coords.latitude,

position.coords.longitude

]);

fetchWeather(

position.coords.latitude,

position.coords.longitude

);

fetchCity(

position.coords.latitude,

position.coords.longitude

);

},

(error)=>{

console.log(error);

}

);

},[]);




// OPEN WEATHER API

const fetchWeather=async(lat,lon)=>{

try{

const response=await axios.get(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

);

setWeather(response.data);

}

catch(error){

console.log(error);

}

};




// CURRENT CITY NAME

const fetchCity=async(lat,lon)=>{

try{

const response=await axios.get(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`

);


const address=response.data.address;


setCityName(

address.city ||

address.town ||

address.village ||

address.state

);


}

catch(error){

console.log(error);

}

};




// FETCH REPORTS

useEffect(()=>{

fetchReports();

},[]);



const fetchReports=async()=>{

try{

const response=await axios.get(

"http://127.0.0.1:8000/reports"

);

setReports(response.data);

}

catch(error){

console.log(error);

}

};




// HANDLE INPUT

const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};




// AUTO LATITUDE LONGITUDE

const getCoordinates=async(city)=>{

try{

const response=await axios.get(

`https://nominatim.openstreetmap.org/search?format=json&q=${city}`

);



if(response.data.length>0){

return{

lat:Number(response.data[0].lat),

lon:Number(response.data[0].lon)

};

}

}

catch(error){

console.log(error);

}


return null;

};
// SUBMIT REPORT

const handleSubmit=async(e)=>{

e.preventDefault();

try{

const coords=await getCoordinates(

formData.location

);


if(!coords){

alert("Location Not Found");

return;

}


await axios.post(

"http://127.0.0.1:8000/reports",

{

type:formData.type,

location:formData.location,

latitude:coords.lat,

longitude:coords.lon,

description:formData.description

}

);


alert("✅ Report Saved Successfully");


fetchReports();


setFormData({

type:"",

location:"",

description:""

});

}

catch(error){

console.log(error);

}

};




// DELETE REPORT

const deleteReport=async(id)=>{

try{

await axios.delete(

`http://127.0.0.1:8000/reports/${id}`

);

fetchReports();

}

catch(error){

console.log(error);

}

};




// DOWNLOAD PDF

const downloadPDF=()=>{


const doc=new jsPDF();


doc.setFontSize(24);

doc.text(

"AI Disaster Management Report",

20,

20

);



let y=40;


reports.forEach((report)=>{


doc.setFontSize(14);


doc.text(

`Type : ${report.type}`,

20,

y

);

y+=10;


doc.text(

`Location : ${report.location}`,

20,

y

);

y+=10;


doc.text(

`Description : ${report.description}`,

20,

y

);

y+=10;


doc.text(

`Severity : ${report.severity}`,

20,

y

);

y+=20;


});


doc.save("DisasterReports.pdf");


};




// PIE CHART DATA

const pieData=[

{

name:"HIGH",

value:reports.filter(

r=>r.severity==="HIGH"

).length

},

{

name:"MEDIUM",

value:reports.filter(

r=>r.severity==="MEDIUM"

).length

},

{

name:"LOW",

value:reports.filter(

r=>r.severity==="LOW"

).length

}

];





const COLORS=[

"#ff1744",

"#ff9100",

"#00e676"

];
return(

<div style={{

minHeight:"100vh",

padding:"25px",

background:"linear-gradient(135deg,#0f172a,#1e293b,#312e81)",

color:"white",

fontFamily:"Poppins"

}}>



<h1 style={{

textAlign:"center",

fontSize:"45px",

marginBottom:"35px",

fontWeight:"bold",

textShadow:"0 0 20px cyan"

}}>

🌍 AI Disaster Dashboard

</h1>




{/* TOP DASHBOARD CARDS */}



<div style={{

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",

gap:"20px",

marginBottom:"30px"

}}>




<div style={{

background:"linear-gradient(135deg,#ff416c,#ff4b2b)",

padding:"25px",

borderRadius:"25px",

boxShadow:"0 10px 30px rgba(255,0,0,.3)"

}}>

<h2>🔥 Fire Alerts</h2>

<h1>

{

reports.filter(

r=>r.type?.toLowerCase()==="fire"

).length

}

</h1>

</div>





<div style={{

background:"linear-gradient(135deg,#00c6ff,#0072ff)",

padding:"25px",

borderRadius:"25px",

boxShadow:"0 10px 30px rgba(0,150,255,.3)"

}}>

<h2>🌊 Flood Alerts</h2>

<h1>

{

reports.filter(

r=>r.type?.toLowerCase()==="flood"

).length

}

</h1>

</div>





<div style={{

background:"linear-gradient(135deg,#7f00ff,#e100ff)",

padding:"25px",

borderRadius:"25px",

boxShadow:"0 10px 30px rgba(150,0,255,.3)"

}}>

<h2>📊 Total Reports</h2>

<h1>

{reports.length}

</h1>

</div>


</div>





{/* AI RISK */}



<div style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"30px",

borderRadius:"25px",

marginBottom:"30px"

}}>


<h2>🤖 AI Risk Analysis</h2>



{

reports.length>0

?

<>

<p>

Latest Disaster :

<b>

{reports[reports.length-1].type}

</b>

</p>


<p>

Severity :

<b

style={{

color:

reports[reports.length-1].severity==="HIGH"

?

"#ff1744"

:

reports[reports.length-1].severity==="MEDIUM"

?

"#ff9100"

:

"#00e676"

}}

>

{reports[reports.length-1].severity}

</b>

</p>



<p>

Recommended Action :

{

reports[reports.length-1].severity==="HIGH"

?

"🚨 Evacuate Area Immediately"

:

"⚠ Monitor Situation"

}

</p>

</>

:

<p>

No Reports Available

</p>

}

</div>





{/* BAR CHART */}


<div style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"25px",

borderRadius:"25px",

marginBottom:"30px"

}}>



<h2>📊 Disaster Analytics</h2>


<ResponsiveContainer width="100%" height={300}>


<BarChart

data={[

{

name:"Fire",

count:

reports.filter(

r=>r.type?.toLowerCase()==="fire"

).length

},

{

name:"Flood",

count:

reports.filter(

r=>r.type?.toLowerCase()==="flood"

).length

}

]}

>


<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>


<Bar

dataKey="count"

fill="#00e5ff"

/>


</BarChart>

</ResponsiveContainer>


</div>
{/* PIE CHART */}

<div style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"25px",

borderRadius:"25px",

marginBottom:"30px"

}}>

<h2>🥧 Severity Distribution</h2>

<PieChart width={400} height={300}>

<Pie

data={pieData}

dataKey="value"

nameKey="name"

cx="50%"

cy="50%"

outerRadius={100}

>

{

pieData.map((entry,index)=>(

<Cell

key={index}

fill={COLORS[index]}

/>

))

}

</Pie>

<Tooltip/>

<Legend/>

</PieChart>

</div>




{/* PREMIUM WEATHER CARD */}


<div style={{

background:"linear-gradient(135deg,#00c6ff,#0072ff)",

padding:"30px",

borderRadius:"25px",

marginBottom:"30px",

boxShadow:"0 15px 35px rgba(0,150,255,.4)"

}}>



<h2 style={{

fontSize:"32px"

}}>

{getWeatherIcon()}

Live Weather

</h2>



{

weather && weather.main ?

<>

<p>

📍 Current Location :

<b>

{cityName}

</b>

</p>



<p>

🕒

{currentTime}

</p>



<p>

🌡 Temperature :

<b>

{weather.main.temp}°C

</b>

</p>



<p>

💧 Humidity :

<b>

{weather.main.humidity}%

</b>

</p>



<p>

💨 Wind :

<b>

{weather.wind.speed} m/s

</b>

</p>



<p>

☁ Condition :

<b>

{weather.weather[0].description}

</b>

</p>

</>

:

<p>

Loading Weather...

</p>

}

</div>




{/* PREMIUM SOS */}



<div style={{

background:"linear-gradient(135deg,#ff0844,#ffb199)",

padding:"30px",

borderRadius:"25px",

textAlign:"center",

marginBottom:"30px",

boxShadow:"0 10px 30px rgba(255,0,0,.3)"

}}>



<h1>

🚨 Emergency SOS

</h1>



<h2>

📞 Emergency : 112

</h2>



<h2>

☎ Disaster Helpline : 1078

</h2>



<button

onClick={()=>alert(

"Emergency Alert Sent Successfully!"

)}

style={{

padding:"18px 35px",

background:"white",

color:"#ff0844",

border:"none",

borderRadius:"15px",

fontWeight:"bold",

fontSize:"18px",

cursor:"pointer",

marginTop:"15px"

}}

>

SEND SOS ALERT

</button>


</div>





{/* REPORT FORM */}


<div style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"30px",

borderRadius:"25px",

marginBottom:"30px"

}}>


<h2>

📝 Report Disaster

</h2>



<form onSubmit={handleSubmit}>


<input

type="text"

name="type"

placeholder="Disaster Type (Fire/Flood)"

value={formData.type}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"15px",

border:"none",

fontSize:"16px"

}}

/>



<input

type="text"

name="location"

placeholder="Enter City Name"

value={formData.location}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"15px",

border:"none",

fontSize:"16px"

}}

/>



<textarea

name="description"

placeholder="Describe Disaster"

value={formData.description}

onChange={handleChange}

rows="4"

required

style={{

width:"100%",

padding:"15px",

borderRadius:"15px",

border:"none",

marginBottom:"15px"

}}

/>



<button

type="submit"

style={{

background:"linear-gradient(135deg,#11998e,#38ef7d)",

color:"white",

padding:"15px 30px",

border:"none",

borderRadius:"15px",

fontWeight:"bold",

cursor:"pointer",

fontSize:"17px"

}}

>

Submit Report

</button>


</form>

</div>
{/* LIVE DISASTER MAP */}

<div style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"25px",

borderRadius:"25px",

marginBottom:"30px"

}}>

<h2>🗺️ Live Disaster Map</h2>

<MapContainer

center={

reports.length>0

?

[

Number(reports[reports.length-1].latitude),

Number(reports[reports.length-1].longitude)

]

:

userLocation

}

zoom={6}

style={{

height:"500px",

width:"100%",

borderRadius:"20px"

}}

>


<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>




{

reports.map((report)=>(

<Marker

key={report.id}

position={[

Number(report.latitude),

Number(report.longitude)

]}

icon={L.icon({

iconUrl:getMarkerColor(

report.severity

),

shadowUrl:markerShadow,

iconSize:[25,41],

iconAnchor:[12,41],

popupAnchor:[1,-34]

})}

>

<Popup>

<h3>

{report.type}

</h3>

<p>

📍 {report.location}

</p>

<p>

📝 {report.description}

</p>

<p>

Severity :

<b>

{report.severity}

</b>

</p>

</Popup>

</Marker>

))

}




<Marker position={userLocation}>

<Popup>

📍 Your Current Location

</Popup>

</Marker>


</MapContainer>

</div>





{/* PDF BUTTON */}



<div

style={{

textAlign:"center",

marginBottom:"30px"

}}

>


<button

onClick={downloadPDF}

style={{

background:"linear-gradient(135deg,#00b09b,#96c93d)",

padding:"18px 35px",

border:"none",

borderRadius:"18px",

fontWeight:"bold",

fontSize:"18px",

color:"white",

cursor:"pointer",

boxShadow:"0 10px 30px rgba(0,255,150,.3)"

}}

>

📥 Download PDF Report

</button>

</div>





{/* SUBMITTED REPORTS */}



<h2

style={{

marginBottom:"20px",

fontSize:"35px"

}}

>

📋 Submitted Reports

</h2>





{

reports.map((report)=>(

<div

key={report.id}

style={{

background:"rgba(255,255,255,.08)",

backdropFilter:"blur(15px)",

padding:"25px",

borderRadius:"25px",

marginBottom:"20px",

boxShadow:"0 10px 30px rgba(0,0,0,.3)"

}}

>

<h2>

{report.type}

</h2>



<p>

📍

{report.location}

</p>



<p>

📝

{report.description}

</p>



<p>

Severity :

<span

style={{

background:

report.severity==="HIGH"

?

"#ff1744"

:

report.severity==="MEDIUM"

?

"#ff9100"

:

"#00e676",

padding:"7px 15px",

borderRadius:"15px",

marginLeft:"10px",

fontWeight:"bold"

}}

>

{report.severity}

</span>

</p>




<button

onClick={()=>deleteReport(report.id)}

style={{

background:"#ff1744",

color:"white",

padding:"12px 20px",

border:"none",

borderRadius:"12px",

cursor:"pointer",

fontWeight:"bold"

}}

>

🗑 Delete

</button>



</div>

))

}




</div>

);

}



export default App;