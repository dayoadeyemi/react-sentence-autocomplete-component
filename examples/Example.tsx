import * as React from 'react';

import {
    BooleanField,
    DateField,
    DynamicInput,
    Field,
    NumberField,
    PropsSelector,
    SelectSwitch,
    SelectSwitchCase
} from '../src/index';


const Query = ({ id, idx = 0, properties, choices, children }: {
    id: string
    idx?: number
    choices: { [x: string]: string }
    properties: Field[]
    children?: React.ReactNode
}) => (
    <PropsSelector required choices={choices} id={`${id}.${idx}.fieldId`} properties={properties}>{field => <span>
        <PropsSelector required choices={choices} id={`${id}.${idx}.op`} properties={field.conditions}/>
        <field.Input id={`${id}.${idx}.value`} value={choices[`${id}.${idx}.value`]}/>
        <SelectSwitch choices={choices} id={`${id}.${idx+1}`}>
            <SelectSwitchCase id='where' value=', and'>
                <Query id={id}
                properties={properties.filter(({ id }) => id !== field.id)}
                idx={idx+1}
                choices={choices}>
                    {children}
                </ Query>
            </SelectSwitchCase>
            {children}
        </SelectSwitch>
    </span>}</PropsSelector>
)
const Alternatives = ({ id, idx = 0, properties, choices, children}: {
    id: string
    idx?: number
    choices: { [x: string]: string }
    properties: Field[]
    children?: React.ReactNode
}) => {
    const alt = (
        <Query id={`${id}.${idx}`} properties={properties} choices={choices}>
        <SelectSwitchCase id='or' value='; or'>
            <Alternatives id={id} properties={properties} idx={idx+1} choices={choices} >
                {children}
            </Alternatives>
        </SelectSwitchCase>
        {children}
    </Query>
    )
    return idx ? alt : (
    <SelectSwitch choices={choices} id={`${id}.${idx}`}>
        <SelectSwitchCase id='where' value={idx ? 'and' : 'where'}>
            {alt}
        </SelectSwitchCase>
        {children}
    </SelectSwitch>
    )
}

const intervals = [
    new Field('year', 'Year'),
    new Field('month', 'Month'),
    new Field('day', 'Day'),
    new Field('hour', 'Hour'),
    new Field('minutes', 'Minute'),
    new Field('seconds', 'Second'),
    new Field('milliseconds', 'Millisecond'),
]

const users = new Field('users', 'Users', [
    new Field('companyId', 'Company'),
    new DateField('createdAt', 'Created'),
    new DateField('updatedAt', 'Updated'),
    new BooleanField('credentials.verified', 'Whether Verified'),
    new Field('role', 'Access Level'),
]);


const companies = new Field('companies', 'Companies', [
    new DateField('created_at', 'Created'),
    new Field('plan.inherit', 'Base Plan'),
]);

const contacts = new Field('contacts', 'Contacts', [
    new Field('type', 'Type'),
    new Field('companyId', 'Company'),
    new Field('status.value', 'Status'),
    new Field('creationSource.value', 'Creation Source'),
    new DateField('createdAt', 'Created'),
    new DateField('updatedAt', 'Updated'),
]);

const activities = new Field('activities', 'Activities', [
    new Field('companyId', 'Company'),
    new Field('eventType', 'Event Type'),
    new DateField('published', 'Occurences'),
]);

const count =  new Field('count','Count',[ users, companies, contacts, activities ])

const charts = new Field('charts','Charts', [ count ])

interface Choices {
    [x: string]: string
    chart?: 'count'
    type?: 'users'|'companies'|'contacts'|'activities'
    columns?: string
    interval?: string
    stacks?: string
}

const ReportSelector = ({ choices }: { choices: Choices }) =>
    <PropsSelector choices={choices} id='chart' properties={charts.properties}>{chart =>
        <PropsSelector choices={choices} id='type' properties={chart.properties}>{type => (
            <Alternatives id='alternatives' properties={type.properties} choices={choices}>
                <SelectSwitchCase id='group' value='grouped by'>
                    <PropsSelector choices={choices} id='columns' properties={type.properties}
                    pre={column => column instanceof DateField && (
                        <PropsSelector required choices={choices} id='interval' properties={intervals} />
                    )}>{column => (
                        <PropsSelector choices={choices} id='split' properties={[new Field('split','split by')]}>{field =>
                            <PropsSelector
                                choices={choices}
                                id='stacks'
                                properties={type.properties}
                                filter={field => !(field instanceof DateField) && field.id !== column.id} />}
                        </PropsSelector>
                    )}</PropsSelector>
                </SelectSwitchCase>
            </Alternatives>
        )}</PropsSelector>
    }</PropsSelector>

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

const choices = parse(window.location.search.substr(1).split('&'));


class Example extends React.Component {
    render() {
        return (
            <form>
                <ReportSelector choices={choices}/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Example;