import * as React from 'react'
import PropTypes from 'prop-types';

const style: React.CSSProperties = {
    border: '1px',
    width: 'auto',
    background: 'transparent',
    color: '#000',
    display: 'inline-block',
}

export interface Option {
    id?: string
    value: string
    children?: React.ReactChildren
    options?: Option[]
}

const SelectComponent = <T extends Option>  (props: {
    id?: string
    name?: string
    value?: string
    options: T[]
    onValueChange?: (value:string) => void
}) => {
    let select: HTMLSelectElement
    let hiddenSelect: HTMLSelectElement
    let hiddenOption: HTMLOptionElement
    const onValueChange = props.onValueChange || ($=>$)
    const options = props.options || [];

    const resize = () => {
        if (!select || !hiddenSelect || !hiddenOption || !select.options[select.selectedIndex]) return;
        hiddenOption.innerText = select.options[select.selectedIndex].text;
        select.style.width = hiddenSelect.getBoundingClientRect().width + 'px'
    }

    return <span>
        <select ref={$=>{hiddenSelect=$;resize()}} style={{
            position: 'absolute',
            visibility: 'hidden'
        }}>
            <option ref={$=>{hiddenOption=$;resize()}}></option>
        </select>
        <select
            id={props.id}
            value={props.value}
            name={props.name}
            ref={$=>{select=$;resize()}}
            onChange={e =>{onValueChange(e.target.value)}}
            onBlur={e =>{onValueChange((e.target as HTMLSelectElement).value)}}
            style={style}>
            {options.map(({id, value}) =>
                <option key={id} value={id}>{value}</option>
            )}
        </select>
    </span>
}

export interface SelectorProps {
    ids: string[]
    placeholder?: string
    required?: boolean
    filter?: (option: Option) => boolean
    pre?: (...options: Option[]) => React.ReactNode
    options?: Option[]
    children?: React.ReactNode | ((...options: Option[]) => React.ReactNode)
}

export type Selector = React.StatelessComponent<SelectorProps>
export const Selector: React.StatelessComponent<SelectorProps> = (props, {
    getChoice,
    setChoice
}: {
    setChoice: (id: string, value: string) => void,
    getChoice: (id: string) => string
}) => {
    const {
        filter=$=>true,
        ids=[],
        pre=()=>null,
        children,
        required=false,
        placeholder= '',
        options=React.Children.toArray(props.children)
        .filter((child: React.ReactElement<Option>) =>
            child && child.type === SelectSwitchCase)
        .map((child: React.ReactElement<Option>) => child.props)
    } = props

    let availableOptions = (required ? [] : [{value: placeholder} as Option])
    .concat(options)
        .filter(filter)

    const components = [
    ] as React.ReactNode[]

    const selections = []

    let selected = false
    for (var i = 0; i < ids.length; i++) {
        if (!availableOptions) break
        let id = ids[i]
        selected = false
        components.push(
            <SelectComponent
            key={id}
            onValueChange={value=>setChoice(id, value)}
            name={id}
            id={id}
            value={getChoice(id)}
            options={availableOptions} />)

        let selection = availableOptions.find(option => option.id === getChoice(id))
        if (selection && selection.id) {
            selections.push(selection)
            selected = true
            availableOptions = selection && selection.options
        } else {
            break
        }
    }

    const prefix = selected && pre(...selections)
    const rest = selected && (selections[0].children ||
        typeof children === 'function' && children(...selections))

    return <span>
        {prefix}
        {components}
        {rest}
    </span>
}
export const SelectorContextTypes = {
    setChoice: PropTypes.func,
    getChoice: PropTypes.func
}
Selector.contextTypes = SelectorContextTypes
export class Sentence extends React.Component<{
    choices?: { [x: string]: string }
}, { [x: string]: string }> {
    constructor(props){
        super(props)
        this.state = props.choices || {}
    }
    static childContextTypes = {
        setChoice: PropTypes.func,
        getChoice: PropTypes.func
    }
    getChildContext() {
      return {
          setChoice: (id: string, value: string) => this.setState({[id]: value}),
          getChoice: (id: string) => this.state[id]
        };
    }
    render(){
        return this.props.children as any
    }
}

export const SelectSwitchCase: React.StatelessComponent<{ id: string, value:string, children?: React.ReactNode }> =(props) => null