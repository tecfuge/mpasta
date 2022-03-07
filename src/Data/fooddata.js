export function formatPrice(price) {
  if(!price){
    return "AED "+0;
  }
  price = parseFloat(price);
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "AED",
  });
  
}

export function timeConvert(time) {   
  if(time){
    time = time.split(":").slice(0,2).join(":");

    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
  return time;
}

export function populateTime() {
   
  var hours, minutes, ampm, days = [], fh;
  for(var i = 630; i <= 1410; i += 30){
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10){
            minutes = '0' + minutes; // adding leading zero
        }
        ampm = hours % 24 < 12 ? 'AM' : 'PM';
        fh = hours;
        hours = hours % 12;
        if (hours === 0){
            hours = 12;
        }
        let tm = [hours, minutes].join(':'),
            tmv = [fh, minutes].join(':');
        days.push({"time": tmv, "label": tm+ ' ' + ampm }); 
        
  }
  return days;
}