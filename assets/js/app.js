(()=>{
  let DJI_History =  null;

  window.addEventListener('DOMContentLoaded', (event) => {
    renderCalendar();
  });

  const renderCalendar = () => {
    fetch(
      '../kranzdataviz/DJI.json'
      ,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response)=>{
      return response.json();
    })
    .then((json)=>{
      DJI_History = json;
      google.charts.load("current", {packages:["calendar"]});
      google.charts.setOnLoadCallback(drawChart);
    });
  }


  const drawChart = () =>{
    const Daily = DJI_History['Time Series (Daily)'];
    const Dates = Object.keys(Daily).map(d=>{
      return [
        moment(d)._d,
        ((parseFloat(Daily[d]['4. close']) - parseFloat(Daily[d]['1. open']))/ parseFloat(Daily[d]['1. open'])*100)
      ]

      });
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({type: 'date', id:'Date'});
    dataTable.addColumn({type: 'number', id: 'High'});
    console.log([Dates])
    dataTable.addRows(Dates);

    var chart = new google.visualization.Calendar(document.getElementById('DJI_History'));
    var options = {
      
      title: "DOW JONES Stock Percent Change",
      height: 5000,
    };
    chart.draw(dataTable, options);
  }

})();
