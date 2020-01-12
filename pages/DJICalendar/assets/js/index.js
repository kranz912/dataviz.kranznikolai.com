(()=>{
  let title = "Dow Jones Industrial Average Daily Percentage Change";
  let units = "Percentage";
  let cellsize = 20;
  let offsetX = 20;
  let offsetY = 20;
  let calX = 25;
  let calY = 50;

  let width = 960;
  let height = 1000;

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
            .attr("viewBox","0 0 "+(offsetX+width)+" 540");

            svg.append('text')
              .attr("x",offsetX)
              .attr("y",20)
              .text(title)
          let cals = svg.selectAll('g')
              .data(yearlyData)
              .enter()
              .append("g")
              .attr("id",(d)=>{return d.key})
              .attr("transform",(d,i)=>{ return "translate(0"+(offsetY+(i*(height+calY)))+")" });

          let labels = cals.append('text')
                .attr("class","yearLabel")
                .attr("x",offsetX)
                .attr("y",15)
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
              .attr("y",(d)=>{ return calY})


      }
    );



})();
