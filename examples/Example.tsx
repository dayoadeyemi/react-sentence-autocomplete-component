import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Field,
    BooleanField,
    DateField,
    MultiChoiceField,
    NestedField,
} from '../src/sentence-autocomplete-fields';
import ReportAutocomplete from '../src/report-autocomplete-components';

function parse(a: string[]) {
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

function group(o: { [x: string]: string }){
    const m = new Map();
    const b = {};
    for (const i in o) {
        const p=i.replace('.', '\x01').split('\x01')
        if (p.length == 2) {
            let sub = m.get(p[0])
            const isArray = /\d+/.test(p[0])
            if (!sub) {
                sub = isArray ? [] : {}
                m.set(p[0], sub)
            }
            sub[p[1]] = o[i]
        } else {
            b[i] = o[i];
        }
    }
    m.forEach(([obj, key]) => {
        b[key] = group(obj)
    })
    return b;
}

const companyIdField = new MultiChoiceField('companyId', 'Company', [
    { id: 'company1', value: 'Company One'},
    { id: 'company2', value: 'Company Two'},
    { id: 'company3', value: 'Company Three'},
    { id: 'company4', value: 'Company Four'},
])

const users = new Field('users', 'Users', [
    companyIdField,
    new DateField('createdAt', 'Created'),
    new DateField('updatedAt', 'Updated'),
    new BooleanField('credentials.verified', 'Whether Verified'),
    new MultiChoiceField('role', 'Access Level', [
        {id:'admin', value: 'Admin'},
        {id:'restricted', value: 'Restricted'},
        {id:'team_member', value: 'Team Member'},
        {id:'limited', value: 'Limited'},
    ]),
]);

const companies = new Field('companies', 'Companies', [
    new DateField('created_at', 'Created'),
    new Field('plan.inherit', 'Base Plan'),
]);
const contacts = new Field('contacts', 'Contacts', [
    new Field('type', 'Type'),
    companyIdField,
    new NestedField('vacancies', 'Vacancy', [
        new Field('value', 'Name'),
        new Field('stage.value', 'Stage'),
    ]),
    new Field('status.value', 'Status'),
    new Field('creationSource.value', 'Creation Source'),
    new DateField('createdAt', 'Created'),
    new DateField('updatedAt', 'Updated'),
]);

const activities = new Field('activities', 'Activities', [
    companyIdField,
    new Field('eventType', 'Event Type'),
    new DateField('published', 'Occurrence'),
]);

const count =  new Field('count','Count',[ users, companies, contacts, activities ])

const choices = parse(window.location.search.substr(1).split('&'));
class Example extends React.Component {
    render() {
        return (
            <form>
                <ReportAutocomplete choices={choices} charts={[ count ]}/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Example;