(this["webpackJsonpweather-app"]=this["webpackJsonpweather-app"]||[]).push([[0],{12:function(e,t,a){},14:function(e,t,a){"use strict";a.r(t);var c=a(0),s=a(1),n=a(5),r=a.n(n),i=(a(12),a(3)),j=a.n(i),o=a(6),u=a(4),l=function(){var e=Object(s.useState)(""),t=Object(u.a)(e,2),a=t[0],n=t[1],r=Object(s.useState)(""),i=Object(u.a)(r,2),l=i[0],p=i[1];Object(s.useEffect)((function(){(function(){var e=Object(o.a)(j.a.mark((function e(){var t,a,c;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="http://api.openweathermap.org/data/2.5/weather?q=".concat(l,"&units=metric&appid=8f9b5c95e274770016c9537586e353c7"),e.next=3,fetch(t);case 3:return a=e.sent,e.next=6,a.json();case 6:c=e.sent,n(c.main);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[l]);return Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)("div",{className:"box",children:[Object(c.jsx)("div",{className:"inputData",children:Object(c.jsx)("input",{type:"search",value:l,placeholder:"City",onChange:function(e){p(e.target.value)},className:"inputField"})}),a?Object(c.jsxs)("div",{children:[Object(c.jsxs)("div",{className:"info",children:[Object(c.jsxs)("h2",{className:"location",children:[Object(c.jsx)("i",{className:"fas fa-street-view"})," "," ",l]}),Object(c.jsxs)("h1",{className:"temperature",children:[a.temp,"\xb0C"]}),Object(c.jsxs)("h3",{className:"temp_min-max",children:["Min : ",a.temp_min,"\xb0C | Max : ",a.temp_max,"\xb0C"]})]}),Object(c.jsx)("div",{className:"wave -one"}),Object(c.jsx)("div",{className:"wave -two"}),Object(c.jsx)("div",{className:"wave -three"})]}):Object(c.jsx)("p",{className:"error",children:" Place not found !"})]})})},p=function(){return Object(c.jsx)(c.Fragment,{children:Object(c.jsx)(l,{})})};r.a.render(Object(c.jsx)(p,{}),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.a3ec2c8a.chunk.js.map