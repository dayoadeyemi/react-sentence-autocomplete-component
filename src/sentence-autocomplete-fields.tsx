import * as React from 'react'
import { Selector } from './index'
export class DynamicInput extends React.PureComponent<React.InputHTMLAttributes<HTMLInputElement>> {
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
                <input {...this.props } ref={this.resize} onKeyPress={e => this.resize(e.target as HTMLInputElement)}/>
            </span>
        )
    }
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

export class DateField extends Field {
 Prefix({ id }: { id: string }){
        return <Selector required ids={[id]} options={[
            new Field('year', 'Year'),
            new Field('month', 'Month'),
            new Field('day', 'Day'),
            new Field('hour', 'Hour'),
            new Field('minutes', 'Minute'),
            new Field('seconds', 'Second'),
            new Field('milliseconds', 'Millisecond'),
        ]} />
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