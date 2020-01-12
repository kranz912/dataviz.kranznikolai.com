(()=>{
  let title = "Dow Jones Industrial Average Daily Percentage Change";
  let units = "Percentage";
  let breaks=[-5,-2,0,2,5];
  let colours=["#993404","#FFA07A","#EEEEEE","#00FA9A","#00FF00","#008000"];


  let cellsize = 20;
  let offsetX = 20;
  let offsetY = 100;
  let calX = 25;
  let calY = 100;

  let width = 2000;
  let height = 120;

  let parseDate = d3.time.format("%Y-%m-%d").parse;
      format = d3.time.format("%d-%m-%Y");
      toolDate = d3.time.format("%d/%b/%y");


  d3
    .json(
      '/kranzdataviz/^DJI.json',
      (err,data)=>{

          let dates = new Array();
          let values= new Array();

          const Daily = data['Time Series (Daily)'];
          data = Object.keys(Daily).map(d=>{
            return {

              "date":parseDate(d),
              "year":parseDate(d).getFullYear(),
              "value": ((parseFloat(Daily[d]['4. close']) - parseFloat(Daily[d]['1. open']))/ parseFloat(Daily[d]['1. open'])*100)
            }
          });
          console.log(data);
          var yearlyData = d3.nest()
                .key((d)=>{return d.year})
                .entries(data);
          console.log(yearlyData);


          let svg = d3.select("#DJI_History").append('svg')
            .attr("width","90%")
            .attr("viewBox","0 0 "+(offsetX+width)+" "+250*yearlyData.length+"");

            svg.append('text')
              .attr("x",offsetX)
              .attr("y",20)
              .text(title)
          let cals = svg.selectAll('g')
              .data(yearlyData)
              .enter()
              .append("g")
              .attr("id",(d)=>{return d.key})
              .attr("transform",(d,i)=>{ return "translate(0,"+(offsetY+(i*(height+calY)))+")";   });

          let labels = cals.append('text')
                .attr("class","yearLabel")
                .attr("x",offsetX)
                .attr("y",90)
                .text((d)=>{return d.key});

          let rect = cals.append('g')
              .attr("id","alldays")
              .selectAll(".day")
              .data((d)=>{
                return  d3.time.days(new Date(parseInt(d.key),0,1), new Date(parseInt(d.key)+1,0,1));
              })
              .enter().append("rect")
              .attr("id",(d)=>{
                return "_"+format(d);
              })
              .attr("class","day")
              .attr("width",cellsize)
              .attr("height",cellsize)
              .attr("x",(d)=>{
                return offsetX+calX+(d3.time.weekOfYear(d) * cellsize)
              })
              .attr("y",(d)=>{ return calY+ (d.getDay() * cellsize);})
              .datum(format)

          let days = ['Su','Mo','Tu','We','Th','FR','Sa'];
          let dayLabels = cals.append("g").attr('id',"dayLabels")
          days.forEach((d,i)=>{
            dayLabels
              .append('text')
              .attr("class","dayLabel")
              .attr("x",offsetX)
              .attr("y",(d)=>{return calY+(i*cellsize)})
              .attr("dy","0.9em")
              .text(d);
          });

          let dataRects = cals.append("g")
                .attr("id","dataDays")
                .selectAll(".dataday")
                .data((d)=>{ return d.values;})
                .enter()
                .append("rect")
                .attr("id",(d)=>{return format(d.date)+":"+d.value})
                .attr("stroke","#ccc")
                .attr("width",cellsize)
                .attr("height",cellsize)
                .attr("x",(d)=>{
                  return offsetX+calX+(d3.time.weekOfYear(d.date)*cellsize);
                })
                .attr("y", function(d) { return calY+(d.date.getDay() * cellsize); })
               .attr("fill", function(d) {
                   if (d.value<breaks[0]) {
                       return colours[0];
                   }
                   for (i=0;i<breaks.length+1;i++){
                       if (d.value>=breaks[i]&&d.value<breaks[i+1]){
                           return colours[i];
                       }
                   }
                   if (d.value>breaks.length-1){
                       return colours[breaks.length]
                   }
               });
               dataRects.append("title")
                .text(d=> { return toolDate(d.date)+":\n"+d.value+units; });
            cals.append("g")
              .attr("id","monthOutlines")
              .selectAll(".month")
              .data(function(d) {
                  return d3.time.months(new Date(parseInt(d.key), 0, 1),
                                        new Date(parseInt(d.key) + 1, 0, 1));
              })
              .enter().append("path")
        .attr("class", "month")
        .attr("transform","translate("+(offsetX+calX)+","+calY+")")
        .attr("d", monthPath);


        var BB = new Array();
        var mp = document.getElementById("monthOutlines").childNodes;
        for (var i=0;i<mp.length;i++){
            BB.push(mp[i].getBBox());
        }

        var monthX = new Array();
        BB.forEach(function(d,i){
            boxCentre = d.width/2;
            monthX.push(offsetX+calX+d.x+boxCentre);
        })


        var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        var monthLabels=cals.append("g").attr("id","monthLabels")
        months.forEach(function(d,i)    {
            monthLabels.append("text")
            .attr("class","monthLabel")
            .attr("x",monthX[i])
            .attr("y",calY/1.2)
            .text(d);
        })


        var key = svg.append("g")
            .attr("id","key")
            .attr("class","key")
            .attr("transform",function(d){
                return "translate("+offsetX+","+(offsetY-(cellsize*1.5))+")";
            });

        key.selectAll("rect")
            .data(colours)
            .enter()
            .append("rect")
            .attr("width",cellsize)
            .attr("height",cellsize)
            .attr("x",function(d,i){
                return i*130;
            })
            .attr("fill",function(d){
                return d;
            });

        key.selectAll("text")
            .data(colours)
            .enter()
            .append("text")
            .attr("x",function(d,i){
                return cellsize+5+(i*130);
            })
            .attr("y","1em")
            .text(function(d,i){
                if (i<colours.length-1){
                    return "up to "+breaks[i];
                }   else    {
                    return "over "+breaks[i-1];
                }
            });



      }
    );
    function monthPath(t0) {
     var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
         d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
         d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
     return "M" + (w0 + 1) * cellsize + "," + d0 * cellsize
         + "H" + w0 * cellsize + "V" + 7 * cellsize
         + "H" + w1 * cellsize + "V" + (d1 + 1) * cellsize
         + "H" + (w1 + 1) * cellsize + "V" + 0
         + "H" + (w0 + 1) * cellsize + "Z";
   }



})();
