(()=>{
  fetch(
    'https://dataviz.kranznikolai.com/kranzdataviz/DJI.json'
    ,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then((response)=>{
    return response;
  })
  .then((json)=>{
    console.log(json)
  });


})();
