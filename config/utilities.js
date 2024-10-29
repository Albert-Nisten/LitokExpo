const formatToKwanza = number =>{
    const formattedNumber = Number(number).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace(" ", '.')
    return formattedNumber
}

const dateFormat = timestamp => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const dateFormat2 = timestamp => {
    const date = new Date(timestamp);

    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneSign = timezoneOffset >= 0 ? '+' : '-';
    const timezoneHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');

    return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezoneSign}${timezoneHours}${timezoneMinutes}`;
}

const getTime = timestamp => {
    const date = new Date(timestamp);

    // const dayOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][date.getDay()];
    const dayOfWeek = ["Dom", "Seg", "Ter", "Quar", "Quin", "Sex", "Sáb"][date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"][date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneSign = timezoneOffset >= 0 ? '+' : '-';
    const timezoneHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');

    return `${dayOfWeek}, ${hours}:${minutes}`
}


export {formatToKwanza, dateFormat, dateFormat2, getTime}