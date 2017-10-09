import * as React from 'react'

const style: React.CSSProperties = {
    border: '1px',
    width: 'auto',
    background: 'transparent',
    color: '#000',
    display: 'inline-block',
}

export class PropsSelector extends React.Component<{
    id?: string,
    properties: Field[]
    children?: (field: Field) => React.ReactNode
    required?: boolean
    choices: { [x: string]: string }
    filter?: (field: Field) => boolean
    map?: (field: Field) => Field
    pre?: (field: Field) => React.ReactNode
    placeholder?: string
}, { [x: string]: string }> {
    hiddenOption: HTMLOptionElement
    hiddenSelect: HTMLSelectElement
    constructor(props){
        super(props)
        this.state = props.choices
    }
    resize = (ele: HTMLSelectElement) => {
        if (!this.hiddenSelect || !this.hiddenOption || !ele.options[ele.selectedIndex]) return
        this.hiddenOption.innerText = ele.options[ele.selectedIndex].text;
        ele.style.width = this.hiddenSelect.getBoundingClientRect().width + 'px'
        this.setState({ [this.props.id]: ele.value })
    }
    onChange: React.EventHandler<React.SyntheticEvent<HTMLSelectElement>> = e => {
        this.resize(e.target as HTMLSelectElement)
    }
    render(){
        const { filter=$=>true, map=$=>$ } = this.props
        const selected = this.props.properties.filter(filter).map(map).find(({ id }) => id === this.state[this.props.id])
        return (
            <span>
                {selected && this.props.pre && this.props.pre(selected)}
                <select ref={$ => this.hiddenSelect=$} style={{
                    position: 'absolute',
                    visibility: 'hidden'
                }}>
                    <option ref={$ => this.hiddenOption=$}></option>
                </select>
                <select
                style={style}
                ref={this.resize}
                onLoad={this.onChange}
                onChange={this.onChange}
                onBlur={this.onChange}
                name={this.props.id}
                id={this.props.id}
                value={this.state[this.props.id] ||''}>
                    {!this.props.required && <option value="">{this.props.placeholder || ''}</option>}
                    {this.props.properties.filter(filter).map(map).map(({ id, value }) => 
                        <option key={id} value={id}>{value}</option>)}
                </select>
                {selected && this.props.children && this.props.children(selected)}
            </span>
        )
    }
}

export class DynamicInput extends React.Component<React.InputHTMLAttributes<HTMLInputElement>> {
    hiddenSpan: HTMLSpanElement
    resize = (ele: HTMLInputElement) => {
        if (!this.hiddenSpan) return
        this.hiddenSpan.innerText = ele.value || ele.placeholder;
        ele.style.width = (this.hiddenSpan.getBoundingClientRect().width) + 'px'
    }
    render(){
        return (
            <span>
                <span  ref={$ => this.hiddenSpan = $} style={{
                    minWidth: '20px',
                    position: 'absolute',
                    visibility: 'hidden'
                }}></span>
                <input {...this.props } style={style} ref={this.resize} onKeyPress={e => this.resize(e.target as HTMLInputElement)}/>
            </span>
        )
    }
}

export class Field {
    get conditions(){ return [new Field('eq', 'is'), new Field('neq','is not')] }
    constructor(public id: string, public value: string, public properties: Field[] = []){}
    type: 'string'
    Input = props =>  <DynamicInput placeholder='<blank>' id={props.id} name={props.id} defaultValue={props.value} />
}

export class NumberField extends Field {
    Input = props => <DynamicInput style={style} id={props.id} name={props.id} defaultValue={props.value} type='number'/>
}

export class DateField extends Field {
    get conditions(){ return [new Field('gt', 'after'), new Field('lt','before')] }
    Input = props =>  <input  style={style} id={props.id} name={props.id} defaultValue={props.value} type='date'/>
}
export class BooleanField extends Field {
    Input = props => (
        <select
            style={style}
            name={props.id}
            id={props.id}
            defaultValue={props.value}>
            <option value='true'>True</option>
            <option value='false'>False</option>
        </select>
    )
}

export const SelectSwitchCase: React.StatelessComponent<{ id: string, value:string, children?: React.ReactNode }> =(props) => null
export const SelectSwitch: React.StatelessComponent<{
    id: string
    choices: { [x: string]: string }
}> =({ id, choices, children }) => (
    <PropsSelector
    choices={choices}
    id={id}
    properties={
        React.Children.toArray(children)
        .filter((child: React.ReactElement<Field>) => child && child.type === SelectSwitchCase)
        .map((child: React.ReactElement<Field>) => child.props)
    }>{(field : Field & { children: React.ReactNode}) =>
        field.children
    }</PropsSelector>
)
