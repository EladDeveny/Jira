

module.exports.dateTo = (data) =>{
    return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`

};

module.exports.getDate = (time) =>{
    let datee = new Date();
    if (time === "Night")
    {
        datee = new Date(datee.getFullYear(), datee.getMonth() , datee.getDate(), 23, 0, 0);
        datee = new Date(datee.setDate(datee.getDate()-1))
    }
    else
    {
        if (time === "Morning")
        {
            datee = new Date(datee.getFullYear(), datee.getMonth() , datee.getDate(), 7, 0, 0);
        }
        else if (time === "Evening")
        {
            datee = new Date(datee.getFullYear(), datee.getMonth() , datee.getDate(), 15, 0, 0);
        }
    }
    return datee;
} 