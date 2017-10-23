import * as React from 'react'
import { Selector, SelectorContextTypes, SelectSwitchCase, Sentence, Option } from './index'
import { Field, DateField } from './sentence-autocomplete-fields'

export const Condition: React.StatelessComponent<{
    id: string,
    options: Field[]
    children: (...fields: Field[]) => React.ReactNode
}> = ({ id, options, children}, { getChoice }) => (
    <Selector required ids={[`${id}.field`,`${id}.subFieldProp`]} options={options}>{(...fields: Field[]) => {
        const field = fields[fields.length-1]
        const Input = field.Input;
        return <span>
            <Selector required ids={[`${id}.op`]} options={field.conditions}/>
            <Input id={`${id}.value`} value={getChoice(`${id}.value`)}/>
            {children(...fields)}
        </span>
    }}</Selector>
)
Condition.contextTypes = SelectorContextTypes

export const Query: React.StatelessComponent<{
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
Query.contextTypes = SelectorContextTypes

export const Alternatives: React.StatelessComponent<{
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
Alternatives.contextTypes = SelectorContextTypes

const isAllowedStack =(column: Field)=>(selected: Field)=>
    !(column.id === selected.id ||
        selected instanceof DateField)

export const Aggregator: React.StatelessComponent<{type: Field}> = ({type}) => (
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
)
Aggregator.contextTypes = SelectorContextTypes

export const ReportAutocomplete: React.StatelessComponent<{
    choices: { [x: string]: string }
    charts: Option[]
}> = ({choices, charts}) => (
    <Sentence choices={choices}>
        <Selector ids={['chart', 'type']} options={charts}>{(chart: Field, type: Field) =>
            <Alternatives id='query' options={type.options}>
                <SelectSwitchCase id='group' value='grouped by'>
                    <Aggregator type={type}/>
                </SelectSwitchCase>
            </Alternatives>
        }</Selector>
    </Sentence>
)
ReportAutocomplete.contextTypes = SelectorContextTypes

export default ReportAutocomplete