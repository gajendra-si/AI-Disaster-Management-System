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


// Marker Colors

const getMarkerColor = (severity) => {

  if (severity === "HIGH") {

    return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";

  }

  if (severity === "MEDIUM") {

    return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";

  }

  return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";

};




function App() {


const [reports, setReports] = useState([]);

const [weather, setWeather] = useState(null);

const [userLocation, setUserLocation] = useState([28.6139,77.209]);



const [formData, setFormData] = useState({

type:"",

location:"",

latitude:"",

longitude:"",

description:"",

});




// Current User Location

useEffect(()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

setUserLocation([

position.coords.latitude,

position.coords.longitude

]);

},

(error)=>{

console.log(error);

}

);

},[]);




// Load Reports

useEffect(()=>{

fetchReports();

},[]);
const fetchReports = async () => {

  try {

    const response = await axios.get(

      "http://127.0.0.1:8000/reports"

    );

    setReports(response.data);

  }

  catch(error){

    console.log(error);

  }

};




const handleChange = (e) => {

  setFormData({

    ...formData,

    [e.target.name]: e.target.value,

  });

};





const handleSubmit = async (e) => {

  e.preventDefault();

  try{

    await axios.post(

      "http://127.0.0.1:8000/reports",

      {

        ...formData,

        latitude:Number(formData.latitude),

        longitude:Number(formData.longitude),

      }

    );

    alert("Report Saved Successfully!");

    fetchReports();



    setFormData({

      type:"",

      location:"",

      latitude:"",

      longitude:"",

      description:"",

    });

  }

  catch(error){

    console.log(error);

  }

};





const deleteReport = async(id)=>{

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






const downloadPDF = ()=>{

  const doc = new jsPDF();

  doc.setFontSize(22);

  doc.text(

    "AI Disaster Reports",

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






const pieData = [

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

"#ef4444",

"#f59e0b",

"#22c55e"

];



return(

<div

style={{

background:"#0f172a",

minHeight:"100vh",

padding:"30px",

color:"white"

}}

>
<h1

style={{

textAlign:"center",

fontSize:"42px",

marginBottom:"30px",

fontWeight:"bold"

}}

>

🌍 AI Disaster Dashboard

</h1>



<div

style={{

display:"flex",

gap:"20px",

flexWrap:"wrap",

marginBottom:"30px"

}}

>

{/* FIRE */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

flex:1,

minWidth:"220px",

boxShadow:"0 10px 25px rgba(0,0,0,.4)"

}}

>

<h2>🔥 Fire Alerts</h2>

<h1>

{

reports.filter(

r=>r.type?.trim().toLowerCase()==="fire"

).length

}

</h1>

</div>




{/* FLOOD */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

flex:1,

minWidth:"220px",

boxShadow:"0 10px 25px rgba(0,0,0,.4)"

}}

>

<h2>🌊 Flood Alerts</h2>

<h1>

{

reports.filter(

r=>r.type?.trim().toLowerCase()==="flood"

).length

}

</h1>

</div>





{/* TOTAL */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

flex:1,

minWidth:"220px",

boxShadow:"0 10px 25px rgba(0,0,0,.4)"

}}

>

<h2>📊 Total Reports</h2>

<h1>

{reports.length}

</h1>

</div>

</div>






{/* AI ANALYSIS */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px",

boxShadow:"0 10px 25px rgba(0,0,0,.4)"

}}

>

<h2>🤖 AI Risk Analysis</h2>

{

reports.length>0

?

<div>

<p>

Latest Disaster :

<b>

{" "}

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

"#ef4444"

:

reports[reports.length-1].severity==="MEDIUM"

?

"#f59e0b"

:

"#22c55e"

}}

>

{" "}

{reports[reports.length-1].severity}

</b>

</p>



<p>

Recommended Action :

{

reports[reports.length-1].severity==="HIGH"

?

" Evacuate Area Immediately"

:

" Monitor Situation"

}

</p>

</div>

:

<p>No Reports Available</p>

}

</div>
{/* DISASTER ANALYTICS */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h2>📊 Disaster Analytics</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart

data={[

{

name:"Fire",

count:reports.filter(

r=>r.type?.trim().toLowerCase()==="fire"

).length

},

{

name:"Flood",

count:reports.filter(

r=>r.type?.trim().toLowerCase()==="flood"

).length

}

]}

>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="count"/>

</BarChart>

</ResponsiveContainer>

</div>




{/* PIE CHART */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

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




{/* WEATHER */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h2>🌤 Weather Status</h2>

<p>

Current Location :

<b>

{userLocation[0].toFixed(2)}

,

{userLocation[1].toFixed(2)}

</b>

</p>

<p>

Status :

<b style={{color:"#22c55e"}}>

Normal

</b>

</p>

</div>





{/* SOS */}

<div

style={{

background:"#dc2626",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h2>🚨 Emergency SOS</h2>

<button

onClick={()=>alert("Emergency Alert Sent!")}

style={{

padding:"15px 25px",

border:"none",

borderRadius:"10px",

cursor:"pointer",

fontWeight:"bold",

fontSize:"16px"

}}

>

SEND SOS ALERT

</button>

</div>
{/* REPORT FORM */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h2>📝 Report Disaster</h2>

<form onSubmit={handleSubmit}>

<input

type="text"

name="type"

placeholder="Disaster Type"

value={formData.type}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"10px",

border:"none"

}}

/>


<input

type="text"

name="location"

placeholder="Location"

value={formData.location}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"10px",

border:"none"

}}

/>



<input

type="number"

name="latitude"

placeholder="Latitude"

value={formData.latitude}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"10px",

border:"none"

}}

/>



<input

type="number"

name="longitude"

placeholder="Longitude"

value={formData.longitude}

onChange={handleChange}

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"10px",

border:"none"

}}

/>



<textarea

name="description"

placeholder="Description"

value={formData.description}

onChange={handleChange}

rows="4"

required

style={{

width:"100%",

padding:"15px",

marginBottom:"15px",

borderRadius:"10px",

border:"none"

}}

/>



<button

type="submit"

style={{

background:"#2563eb",

color:"white",

padding:"12px 25px",

border:"none",

borderRadius:"10px",

cursor:"pointer",

fontWeight:"bold"

}}

>

Submit Report

</button>

</form>

</div>





{/* LIVE DISASTER MAP */}

<div

style={{

background:"#1e293b",

padding:"25px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h2>🗺️ Live Disaster Map</h2>



<MapContainer

center={

reports.length > 0

?

[

Number(reports[reports.length-1].latitude),

Number(reports[reports.length-1].longitude)

]

:

userLocation

}

zoom={8}

style={{

height:"450px",

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

<b>{report.type}</b>

<br/>

{report.location}

<br/>

{report.description}

<br/>

Severity :

{report.severity}

</Popup>

</Marker>

))

}




{/* USER LOCATION */}

<Marker

position={userLocation}

>

<Popup>

📍 Your Current Location

</Popup>

</Marker>



</MapContainer>

</div>
{/* DOWNLOAD PDF */}

<button

onClick={downloadPDF}

style={{

background:"#2563eb",

color:"white",

padding:"14px 25px",

border:"none",

borderRadius:"10px",

cursor:"pointer",

fontWeight:"bold",

marginBottom:"30px"

}}

>

📥 Download PDF

</button>




{/* SUBMITTED REPORTS */}

<h2>📋 Submitted Reports</h2>

{

reports.map((report)=>(

<div

key={report.id}

style={{

background:"#1e293b",

padding:"20px",

borderRadius:"15px",

marginBottom:"15px",

boxShadow:"0 10px 20px rgba(0,0,0,.3)"

}}

>

<h2>

{report.type}

</h2>

<p>

📍 {report.location}

</p>

<p>

📝 {report.description}

</p>



<p>

Severity :

<span

style={{

background:

report.severity==="HIGH"

?

"#ef4444"

:

report.severity==="MEDIUM"

?

"#f59e0b"

:

"#22c55e",

padding:"6px 12px",

borderRadius:"10px",

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

background:"#dc2626",

color:"white",

border:"none",

padding:"10px 18px",

borderRadius:"10px",

cursor:"pointer"

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