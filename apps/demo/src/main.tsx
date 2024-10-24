import React from 'react'
import { createRoot } from 'react-dom/client'
import { OrderedMap, Seq } from 'immutable'
import { ImmutableEditor, themeMaterial } from 'react-immutable-editor'

// helper for nested ordered map creation (if order isn't important use the included `fromJS` from `immutable`)
function fromJSOrdered(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() :
            Seq(js).map(fromJSOrdered).toOrderedMap()
}

// create your data Map somewhere
const demoData = OrderedMap(fromJSOrdered({
    headline: 'This is a demo JSON',
    desc: 'Lorem ipsum dolor sit amet, consectutor adipisci. Lorem ipsum dolor sit amet, consectutor adipisci.',
    comment: 'Lorem ipsum dolor sit amet,\n\nconsectutor adipisci.\n\nLorem ipsum dolor sit amet,\n\nconsectutor adipisci.',
    numbers: {
        no1: 1,
        no2: 5,
        no3: 100,
        no4: 10000,
        no5: 10000000,
    },
    nameList: [
        'Max',
        'Maria',
    ],
    isTrue: true,
    isFalse: false,
    hideIntro: false,
    logChange: false,
    darkTheme: true,
}))

// create or use your state/reducer component - here the map is stored and pushed to children
const Demo = () => {

    // some state is needed somewhere
    const [data, setData] = React.useState(demoData)

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: '100vh', padding: 24,
        background: data.get('darkTheme') ? themeMaterial.base00 : themeMaterial.base06,
    }}>

        {data.get('hideIntro') ? null : <DemoIntro data={data} theme={themeMaterial}/>}

        {/* initiating the editor and use the immutable in the state */}
        <ImmutableEditor
            theme={themeMaterial}
            invertTheme={!data.get('darkTheme')}

            data={data}

            onChange={(keys, val) => {
                if(data.get('logChange')) {
                    console.log(keys, val, data.setIn(keys, val))
                    console.log(data.toJS())
                }

                // here the state is updated with the new data
                setData(data.setIn(keys, val))
            }}
            getVal={keys => data.getIn(keys)}/>
    </div>
}

// Just the demo intro, no logic
const DemoIntro = ({data, theme}) => <React.Fragment>
    <h1 style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif',
    }}>react-immutable-editor</h1>
    <p style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif',
    }}>
        An editor for <a style={{color: data.get('darkTheme') ? theme.base04 : theme.base0D}} href="https://immutable-js.github.io/immutable-js/docs/#/" target={'_blank'} rel="noreferrer">immutable</a> maps in React. Check: <b>hideIntro</b>, <b>hideIntro</b>, <b>darkTheme</b>.
    </p>
    <p style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif',
    }}>
        See <a style={{color: data.get('darkTheme') ? theme.base04 : theme.base0D}} href="https://github.com/elbakerino/react-immutable-editor/blob/main/demo/src/main.ts" target={'_blank'} rel="noreferrer">demo file</a> for the code.
    </p>
</React.Fragment>

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Demo/>
    </React.StrictMode>,
)
