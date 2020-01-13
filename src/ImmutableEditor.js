import React from "react";
import JSONTree from 'react-json-tree';

const IcCode = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || '24'} height={props.size || '24'} fill={props.fill || '#000000'} style={props.style} className={props.className} viewBox="0 0 24 24">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
</svg>;

const ButtonInputLabel = ({theme, type, parentKey, getVal, onChange}) => {
    const [showType, setShow] = React.useState(false);
    const spanRef = React.useRef(null);

    if('Iterable' === type) return <span>{[...parentKey].reverse().pop()}</span>;

    let relKeys = [...parentKey];
    relKeys.pop();
    relKeys.reverse();

    return <span ref={spanRef} style={{display: 'flex', position: 'relative',}}><button
        style={{display: 'block', cursor: 'pointer', color: 'inherit', background: 'transparent', border: 0, marginTop: '-0.25em', padding: '3px 4px', textDecoration: 'none', fontStyle: 'inherit'}}
        onClick={() => {
            if(showType) {
                // currently visible, so hiding
                if(spanRef.current.parentNode.parentNode.children[1]) {
                    spanRef.current.parentNode.parentNode.children[1].style.opacity = 1;
                }
            } else {
                // currently hiding, so switch to showing
                if(spanRef.current.parentNode.parentNode.children[1]) {
                    spanRef.current.parentNode.parentNode.children[1].style.opacity = 0;
                }
            }
            setShow(!showType)
        }}
    >
  {showType ? <i style={{position: 'absolute', top: -1, cursor: 'pointer', transform: 'translateX(-115%)', wordBreak: 'keep-all', opacity: '0.6'}}>{type}</i> : null}
        {[...parentKey].reverse().pop()}
  </button>
        {showType && onChange && getVal ?
            <input
                type={'Boolean' === type ? 'checkbox' : ('Number' === type ? 'number' : 'text')}
                value={getVal(relKeys)}
                checked={'Boolean' === type ? getVal(relKeys) : undefined}
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    wordBreak: 'keep-all',
                    left: '100%',
                    top: 'Boolean' === type ? -3 : -4,
                    background: theme.base00,
                    border: '1px solid ' + (theme.type === 'dark' ? theme.base06 : theme.base02),
                    color: theme.base0B,
                    padding: '2px 6px',
                }}
                // hiding on ESC
                onKeyUp={(e) => (e.which === 27) ? ((spanRef.current.parentNode.parentNode.children[1] ?
                    spanRef.current.parentNode.parentNode.children[1].style.opacity = 1 : undefined)
                    && setShow(false)) : undefined}
                onChange={(e) => {
                    if('Number' === type) {
                        onChange(relKeys, e.target.value * 1)
                        // todo: add bool?
                    } else if('Boolean' === type) {
                        onChange(relKeys, !getVal(relKeys))
                    } else {
                        onChange(relKeys, e.target.value)
                    }
                }}/>
            : null}
  </span>;
};

const ButtonValue = ({raw}) => {
    const spanRef = React.useRef(null);

    return <button
        style={{display: 'inline-block', color: 'inherit', background: 'transparent', border: 0, padding: '2px 4px', textDecoration: 'none', fontStyle: 'inherit'}}
        ref={spanRef}
        onClick={() => {
            if(
                spanRef && spanRef.current && spanRef.current.parentNode &&
                spanRef.current.parentNode.parentNode && spanRef.current.parentNode.parentNode.children
                && spanRef.current.parentNode.parentNode.children[0]
            ) {
                let btn = spanRef.current.parentNode.parentNode.children[0].querySelector('button');
                btn ? btn.click() : null
            }
        }}
    >
        <em>{raw}</em>
    </button>;
};

const Editor = ({theme, invertTheme = false, data, onChange, getVal}) => {
    const [showRaw, setShowRaw] = React.useState(false);

    return <React.Fragment>
        <button
            style={{background: 'transparent', display: 'block', border: 0, marginBottom: '-0.5em', cursor: 'pointer', marginLeft: -8, paddingLeft: 1, color: theme.base0B}}
            onClick={() => setShowRaw(!showRaw)}>
            <IcCode style={{display: 'block'}} fill={theme.base0D} size={16}/>
        </button>
        {showRaw ?
            data && typeof data.toJS === 'function' ? <code style={{background: 'transparent', display: 'block', border: 0, width: '100%', color: theme.base0D}}>
    <pre
        contentEditable
        suppressContentEditableWarning
        // only allow copy of content with `ctrl+a` but prohibit any change
        onCut={(e) => e.preventDefault()}
        onKeyDown={(e) => e.ctrlKey && (e.which === 65 || e.which === 67) ? undefined : e.preventDefault()}
    >{JSON.stringify(data.toJS(), null, 2)}</pre>
            </code> : 'unsupported-data'
            : <JSONTree
                data={data}
                valueRenderer={raw => <ButtonValue raw={raw}/>}
                labelRenderer={(parentKeys, type,) => {
                    return <ButtonInputLabel type={type} parentKey={parentKeys} onChange={onChange} getVal={getVal} theme={theme}/>
                }}
                theme={theme}
                invertTheme={invertTheme}/>}
    </React.Fragment>
};

const ImmutableEditor = (props) => <Editor {...props} theme={props.theme || {}} invertTheme={typeof props.invertTheme === 'undefined' ? false : props.invertTheme}/>;

export {ImmutableEditor};
