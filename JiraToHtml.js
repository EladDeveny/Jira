const dateModifier = require('./Dates.js');

module.exports.GetEvents = (data) => {
    let htmlData='';
    for(var issue of data){
        htmlData += 
        `<tr> 
        <td>${issue.key}</td>
        <td> ${issue.fields.status.name}</td>
        <td> ${issue.fields.priority.name}</td>
        <td> ${issue.fields.summary}</td>
        <td> ${new Date(issue.fields.customfield_15801).toLocaleString()}</td>
        <td> ${new Date(issue.fields.customfield_15802).toLocaleString()}</td>
        </tr>`;
    }
    return htmlData;
}

module.exports.GetInProgress = (data,shiftDate) => {
    let htmlData='';
    let handelDate;
    let handeled='';
    let created;
    let updated;
    for(var issue of data){
        handeled ="";
        handelDate = new Date(issue.fields.updated )
        if(handelDate >shiftDate){
            handeled ="V";
        }
        created = dateModifier.dateTo(new Date(issue.fields.created));
        updated = dateModifier.dateTo(new Date(issue.fields.updated));
        htmlData += 
        `<tr> 
        <td>${issue.key}</td>
        <td> ${issue.fields.status.name}</td>
        <td> ${issue.fields.priority.name}</td>
        <td> ${issue.fields.summary}</td>
        <td> ${created}</td>
        <td> ${updated}</td>
        <td> ${issue.fields.duedate}</td> 
        <td> ${issue.fields.assignee.name}</td>
        <td> ${handeled}</td>
        </tr>`;
    }
    return htmlData;
}

module.exports.GetResolveds = (data) => {
    let htmlData='';
    let created;
    let updated;
    for(var issue of data){
        created = dateModifier.dateTo(new Date(issue.fields.created));
        updated = dateModifier.dateTo(new Date(issue.fields.updated));
        htmlData += 
        `<tr>
        <td>${issue.key}</td>
        <td> ${issue.fields.status.name}</td>
        <td> ${issue.fields.priority.name}</td>
        <td> ${issue.fields.summary}</td>
        <td> ${created}</td>
        <td> ${updated}</td>
        <td> ${issue.fields.assignee.name}</td>
        <td> ${issue.fields.customfield_16405.value}</td>
        </tr>`;
    }
    return htmlData;
}

module.exports.GetKBs = (data) => {
    let htmlData='';
    for(var kb of data){
        htmlData += 
        `<tr> 
        <td>${kb.Created}</td>
        <td> ${kb.Ticket}</td>
        <td> ${kb.Subject} </td>
        <td> ${kb.Description} </td>
        <td> ${kb.Links}</td>
        </tr>`;
    }
    return htmlData;
}

module.exports.GetImportantUpdates = (data) => {
    let htmlData='';
    for(var imprtant of data){
        htmlData += 
        `<tr> 
        <td> ${imprtant.description}</td>
        </tr>`;
    }
    return htmlData;
}
