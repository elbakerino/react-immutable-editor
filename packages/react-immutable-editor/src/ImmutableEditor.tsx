import { useState, useRef, useEffect, ReactNode, useMemo, CSSProperties } from 'react'
import type { Base16Theme } from 'react-base16-styling'
import { invertBase16Theme } from 'react-base16-styling'
import { JSONTree } from 'react-json-tree'
import type { KeyPath } from 'react-json-tree'

const IterableLabel = ({parentKey}) => {
    return <span>{[...parentKey].reverse().pop()}</span>
}

interface ButtonLabelProps {
    theme?: Base16Theme
    parentKey: KeyPath
    type: string
    onChange?: (keys: (string | number)[], value: any) => void
    getValue: (keys: (string | number)[]) => unknown
    iconCode?: ReactNode
}

const ButtonInputLabel = (
    {
        theme, type, parentKey, getValue, onChange,
    }: ButtonLabelProps,
) => {
    const [showType, setShow] = useState(false)
    const [multiline, setMultiline] = useState(false)
    const spanRef = useRef<HTMLSpanElement>(null)

    const relKeys = [...parentKey]
    relKeys.pop()
    relKeys.reverse()
    const multi = getValue && type === 'String' && -1 !== (getValue(relKeys) as string).indexOf('\n')
    const ownKey = [...parentKey].reverse().pop()

    useEffect(() => {
        // turns on multiline one time, does not turn it off again (can't know that here)
        setMultiline((current) => current || multi !== current)
    }, [ownKey, multi])

    const Comp: 'input' | 'textarea' = type === 'String' && multiline ? 'textarea' : 'input'

    return <span ref={spanRef} style={{display: 'flex', position: 'relative'}}>
        <button
            style={{
                display: 'block',
                cursor: 'pointer', color: 'inherit', background: 'transparent',
                border: 0, marginTop: '-0.25em', padding: '3px 4px',
                textDecoration: 'none', fontStyle: 'inherit',
            }}
            onClick={() => {
                if(showType) {
                    // currently visible, so hiding
                    if(spanRef.current?.parentNode?.parentNode?.children[1]) {
                        // @ts-ignore
                        spanRef.current.parentNode.parentNode.children[1].style.opacity = 1
                    }
                } else {
                    // currently hiding, so switch to showing
                    if(spanRef.current?.parentNode?.parentNode?.children[1]) {
                        // @ts-ignore
                        spanRef.current.parentNode.parentNode.children[1].style.opacity = 0
                    }
                }
                setShow(!showType)
            }}
        >
            {showType ?
                <i style={{position: 'absolute', top: -1, cursor: 'pointer', transform: 'translateX(-115%)', wordBreak: 'keep-all', opacity: '0.6'}}>{type}</i>
                : null}

            {[...parentKey].reverse().pop()}
        </button>

        {showType && getValue ?
            <Comp
                type={'Boolean' === type ? 'checkbox' : ('Number' === type ? 'number' : 'text')}
                value={'Boolean' === type ? undefined : getValue(relKeys) as string | number}
                checked={'Boolean' === type ? getValue(relKeys) as boolean : undefined}
                disabled={!onChange}
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    wordBreak: 'keep-all',
                    left: '100%',
                    top: 'Boolean' === type ? -3 : -4,
                    background: theme?.base00,
                    border: theme?.base02 ? '1px solid ' + theme?.base02 : undefined,
                    borderRadius: 3,
                    color: theme?.base0B,
                    padding: '2px 6px',
                }}
                // hiding on ESC or ENTER
                onKeyUp={(e) =>
                    e.key === 'Enter' || e.key === 'Escape' ?
                        ((spanRef.current?.parentNode?.parentNode?.children[1] ?
                                // @ts-ignore
                                spanRef.current.parentNode.parentNode.children[1].style.opacity = 1 : undefined)
                            && setShow(false)) :
                        undefined
                }
                onChange={(e) => {
                    if(!onChange) return
                    if('Number' === type) {
                        onChange(relKeys, Number(e.target.value))
                    } else if('Boolean' === type) {
                        onChange(relKeys, !getValue(relKeys))
                    } else {
                        onChange(relKeys, e.target.value)
                    }
                }}
            /> : null}
  </span>
}

const ButtonValue = ({raw}) => {
    const btnRef = useRef<HTMLButtonElement>(null)

    return <button
        style={{display: 'inline-block', color: 'inherit', background: 'transparent', border: 0, padding: '2px 4px', textDecoration: 'none', fontStyle: 'inherit'}}
        ref={btnRef}
        onClick={() => {
            if(
                btnRef && btnRef.current && btnRef.current.parentNode &&
                btnRef.current.parentNode.parentNode && btnRef.current.parentNode.parentNode.children
                && btnRef.current.parentNode.parentNode.children[0]
            ) {
                btnRef.current.parentNode.parentNode.children[0].querySelector('button')?.click()
            }
        }}
    >
        <em>{raw}</em>
    </button>
}

export interface EditorProps {
    theme?: Base16Theme
    invertTheme?: boolean
    data: any
    onChange?: (keys: (string | number)[], value: any) => void
    getVal: (keys: (string | number)[]) => unknown
    iconCode?: ReactNode
    className?: string
    style?: CSSProperties
}

export function ImmutableEditor(props: EditorProps) {
    const {
        theme, invertTheme = false,
        data, onChange, getVal,
        iconCode,
        className, style,
    } = props
    const [showRaw, setShowRaw] = useState(false)

    const appliedTheme = useMemo(
        () => invertTheme && theme ? invertBase16Theme(theme) : theme,
        [invertTheme, theme],
    )

    return <div
        className={className}
        style={{
            ...style,
            background: appliedTheme?.base00,
        }}
    >
        <button
            style={{
                background: 'transparent', display: 'block',
                border: 0,
                marginBottom: '-0.5em',
                cursor: 'pointer', paddingLeft: 1,
                color: appliedTheme?.base0B,
                textAlign: 'left',
                width: '100%',
            }}
            onClick={() => setShowRaw(!showRaw)}
        >
            {iconCode || '⟨ ⟩'}
        </button>
        {showRaw ?
            data && typeof data.toJS === 'function' ?
                <code style={{background: 'transparent', display: 'block', border: 0, width: '100%', color: appliedTheme?.base0D, margin: '0.5em 0'}}>
                    <pre
                        style={{margin: 0}}
                        contentEditable
                        suppressContentEditableWarning
                        // only allow copy of content with `ctrl+a` but prohibit any change
                        onCut={(e) => e.preventDefault()}
                        onKeyDown={(e) => e.ctrlKey && (e.key === 'c' || e.key === 'v') ? undefined : e.preventDefault()}
                    >{JSON.stringify(data.toJS(), null, 2)}</pre>
                </code> : 'unsupported-data' :
            <JSONTree
                data={data}
                valueRenderer={raw => <ButtonValue raw={raw}/>}
                labelRenderer={(parentKeys, type) => {
                    if(type === 'Iterable') return <IterableLabel parentKey={parentKeys}/>
                    return <ButtonInputLabel type={type} parentKey={parentKeys} onChange={onChange} getValue={getVal} theme={appliedTheme}/>
                }}
                theme={theme}
                invertTheme={invertTheme}
            />}
    </div>
}
