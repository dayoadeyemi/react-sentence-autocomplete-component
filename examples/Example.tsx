import * as React from 'react';
import PropTypes from 'prop-types';

import {
    DynamicInput,
    SelectComponent,
    SelectSwitchCase,
    Sentence,
    Selector,
    Option,
} from '../src/index';

interface FieldSelectProps {
    id: string,
    choices: { [x: string]: string },
    children?: (field: Field) => React.ReactNode,
    required?: boolean
}
export class Field {
    Prefix(props?: any){
        return null
    }
    get conditions(){ return [new Field('eq', 'is'), new Field('neq','is not')] }
    constructor(public id: string, public value: string, public options?: Field[]){}
    type: 'string'
    Input = props => (
        <DynamicInput placeholder='<blank>' id={props.id} name={props.id} defaultValue={props.value} />
    )
}
export class NumberField extends Field {
    Input = props => <DynamicInput id={props.id} name={props.id} defaultValue={props.value} type='number'/>
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
export class DateField extends Field {
 Prefix({ id }: { id: string }){
        return <Selector required ids={[id]} options={intervals} />
    }
    get conditions(){ return [new Field('gt', 'after'), new Field('lt','before')] }
    Input = props =>  <input id={props.id} name={props.id} defaultValue={props.value} type='date'/>
}

export class NestedField extends Field {
    Input = props => (
        <Selector
            ids={[props.id]}
            options={this.options} />
    )
}

export class MultiChoiceField extends Field {
    constructor(
        id: string,
        value: string,
        public values: {id:string, value:string}[]
    ){
        super(id, value)
    }
    Input = props =>  (
        <Selector required ids={[props.id]} options={this.values}/>
    )
}
export class BooleanField extends MultiChoiceField {
    constructor(id: string, value: string){
        super(id, value, [{
            id: 'true',
            value: 'True'
        }, {
            id: 'false',
            value: 'False'
        }])
    }
}

const Condition: React.StatelessComponent<{
    id: string,
    options: Field[]
    children: (...fields: Field[]) => React.ReactNode
}> = ({ id, options, children}) => (
    <Selector required ids={[`${id}.field`,`${id}.subFieldProp`]} options={options}>{(...fields: Field[]) => {
        const field = fields[fields.length-1]
        const Input = field.Input;
        return <span>
            <Selector required ids={[`${id}.op`]} options={field.conditions}/>
            <Input id={`${id}.value`} value={choices[`${id}.value`]}/>
            {children(...fields)}
        </span>
    }}</Selector>
)
Condition.contextTypes = {
    setChoice: PropTypes.func,
    getChoice: PropTypes.func
}

const Query: React.StatelessComponent<{
    id: string
    idx?: number
    options: Field[]
}> = ({ id, idx = 0, options, children }) => (
    <Condition id={`${id}.${idx}`} options={options}>{selected =>{
        const filteredOptions = options.filter(f => f.id !== selected.id)
        return <Selector ids={[`${id}.${idx+1}.option`]}>
            {filteredOptions.length && <SelectSwitchCase id='where' value=', and'>
                <Query
                id={id}
                options={filteredOptions}
                idx={idx+1}>
                    {children}
                </Query>
            </SelectSwitchCase>}
            {children}
        </Selector>
    }
    }</Condition>
)
Query.contextTypes = {
    setChoice: PropTypes.func,
    getChoice: PropTypes.func
}

const Alternatives: React.StatelessComponent<{
    id: string
    idx?: number
    options: Field[]
}> = ({ id, idx = 0, options, children }) => {
    const alt = (
        <Query id={`${id}.${idx}`} options={options}>
            <SelectSwitchCase id='or' value='; or'>
                <Alternatives id={id} idx={idx+1} options={options}>
                    {children}
                </Alternatives>
            </SelectSwitchCase>
            {children}
        </Query>
        )
    return idx ? alt : (
    <Selector ids={[`${id}.${idx}.option`]}>
        <SelectSwitchCase id='where' value={idx ? 'and' : 'where'}>
            {alt}
        </SelectSwitchCase>
        {children}
    </Selector>
    )
}
Alternatives.contextTypes = {
    setChoice: PropTypes.func,
    getChoice: PropTypes.func
}

const users = new Field('users', 'Users', [
    new Field('companyId', 'Company'),
    new DateField('createdAt', 'Created'),
    new DateField('updatedAt', 'Updated'),
    new BooleanField('credentials.verified', 'Whether Verified'),
    new MultiChoiceField('role', 'Access Level', [
        new Field('admin', 'Admin'),
        new Field('restricted', 'Restricted'),
        new Field('team_member', 'Team Member'),
        new Field('limited', 'Limited'),
    ]),
]);


const companies = new Field('companies', 'Companies', [
    new DateField('created_at', 'Created'),
    new Field('plan.inherit', 'Base Plan'),
]);

const contacts = new Field('contacts', 'Contacts', [
    new Field('type', 'Type'),
    new Field('companyId', 'Company'),
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
    new Field('companyId', 'Company'),
    new Field('eventType', 'Event Type'),
    new DateField('published', 'Occurrence'),
]);

const count =  new Field('count','Count',[ users, companies, contacts, activities ])

const charts = [ count ]

interface Choices {
    [x: string]: string
    chart?: 'count'
    type?: 'users'|'companies'|'contacts'|'activities'
    columns?: string
    interval?: string
    stacks?: string
}

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

const isAllowedStack =(column: Field)=>(selected: Field)=>
    !(column.id === selected.id ||
        selected instanceof DateField)
class Example extends React.Component {
    render() {
        return (
            <form>
                <Sentence choices={choices}>
                    <Selector ids={['chart', 'type']} options={charts}>{(chart: Field, type: Field) =>
                        <Alternatives id='query' options={type.options}>
                            <SelectSwitchCase id='group' value='grouped by'>
                                <Selector
                                required
                                ids={['group.fieldId', 'group.subFieldId']}
                                pre={(option: Field)=>
                                    option.Prefix({id: 'columns.interval'})}
                                options={type.options}>{(column: Field, subColumn: Field) =>
                                    <Selector ids={['do_split']}>
                                        <SelectSwitchCase id='split' value='split by'>
                                            <Selector
                                                ids={['split.fieldId', 'split.subFieldId']}
                                                filter={isAllowedStack(column)}
                                                options={type.options}/>
                                        </SelectSwitchCase>
                                    </Selector>
                                }</Selector>
                            </SelectSwitchCase>
                        </Alternatives>
                    }</Selector>
                </Sentence>
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

export default Example;