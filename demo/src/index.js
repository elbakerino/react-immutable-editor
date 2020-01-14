import React from 'react'
import {render} from 'react-dom'
import {OrderedMap, Seq} from "immutable";

import {ImmutableEditor, themeMaterial} from '../../src'

// helper for nested ordered map creation (if order isn't important use the included `fromJS` from `immutable`)
function fromJSOrdered(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() :
            Seq(js).map(fromJSOrdered).toOrderedMap();
}

// create your data Map somewhere
const demoData = OrderedMap(fromJSOrdered({
    headline: 'This is a demo JSON',
    desc: 'Lorem ipsum dolor sit amet, consectutor adipisci. Lorem ipsum dolor sit amet, consectutor adipisci.',
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
}));

// create or use your state/reducer component - here the map is stored and pushed to children
const Demo = () => {

    // some state is needed somewhere
    const [data, setData] = React.useState(demoData);

    return <div style={{
        height: '100vh', padding: 24,
        background: data.get('darkTheme') ? themeMaterial.base00 : themeMaterial.base06
    }}>

        {data.get('hideIntro') ? null : <DemoIntro data={data} theme={themeMaterial}/>}

        {/* initiating the editor and use the immutable in the state */}
        <ImmutableEditor
            theme={themeMaterial}
            invertTheme={!data.get('darkTheme')}

            data={data}

            onChange={(keys, val) => {
                if(data.get('logChange')) {
                    console.log(keys, val, data.setIn(keys, val));
                    console.log(data.toJS());
                }

                // here the state is updated with the new data
                setData(data.setIn(keys, val));
            }}
            getVal={keys => data.getIn(keys)}/>
    </div>
};

// Just the demo intro, no logic
const DemoIntro = ({data, theme}) => <React.Fragment>
    <h1 style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif'
    }}>react-immutable-editor</h1>
    <p style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif'
    }}>
        An editor for <a style={{color: data.get('darkTheme') ? theme.base04 : theme.base0D}} href="https://immutable-js.github.io/immutable-js/docs/#/" target={'_blank'}>immutable</a> maps in React. Check: <b>hideIntro</b>, <b>hideIntro</b>, <b>darkTheme</b>.
    </p>
    <p style={{
        color: data.get('darkTheme') ? theme.base0D : theme.base00,
        fontFamily: 'sans-serif'
    }}>
        See <a style={{color: data.get('darkTheme') ? theme.base04 : theme.base0D}} href="https://bitbucket.org/bemit_eu/react-immutable-editor/src/master/demo/src/index.js" target={'_blank'}>demo file</a> for the code.
    </p>
</React.Fragment>;

// just for styling
const demo = document.querySelector('#demo');
demo.parentNode.style.margin = 0;


render(<Demo/>, demo);
