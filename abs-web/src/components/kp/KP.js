import {useContext, useState} from 'react';
import KpPanel from "components/kp/KpPanel";
import {ApplicationContext} from "components/ABSApplication";
import ReconciliationHistory from "./ReconciliationHistory";
import {properties} from "properties";

export const knowledgePatternTypes = {
    CONJUNCTS: 'Conjuncts',
    DISJUNCTS: 'Disjuncts',
    QUANTS: 'Quants'
}

export const variablesEvaluation = {
    [knowledgePatternTypes.CONJUNCTS]: (baseNumber, index) => [...Array(baseNumber).keys()].map(
        j => ((1 << j) & index) ? 'x_{' + (j + 1) + '}' : '')
        .reduce((a, b) => a + b) || '\\emptyset',
    [knowledgePatternTypes.DISJUNCTS]: (baseNumber, index) => [...Array(baseNumber).keys()]
        .map((j => ((1 << j) & index) ? 'x_{' + (j + 1) + '}\\lor ' : ''))
        .reduce((a, b) => a + b).slice(0, -'\\lor '.length) || '\\emptyset',
    [knowledgePatternTypes.QUANTS]: (baseNumber, index) => [...Array(baseNumber).keys()]
        .map(j => (((1 << j) & index) ? '' : '\\bar ') + 'x_{' + (j + 1) + '}')
        .reduce((a, b) => a + b)
}

export default function KP() {
    const [items, setItems] = useState(JSON.parse(localStorage.getItem(properties.reconciliationHistory)));
    const [kpType, setKpType] = useState(knowledgePatternTypes.CONJUNCTS);
    return (<div className={'kp-container'}>
            <h1 className={'kp-container__title title'}>
                Reconciliation
            </h1>
            <div className="kp-container__tab-links tabs">
                <ul>
                    {Object.values(knowledgePatternTypes).map(type =>
                        <li key={type} className={kpType === type ? ' is-active' : ''}>
                            <a href={'#'}
                               className={"panel__tab-link"}
                               onClick={() => setKpType(type)}>{type}</a>
                        </li>
                    )}
                </ul>
            </div>
            {Object.values(knowledgePatternTypes).map(type => (type === kpType && <KpPanel key={type} kpType={type}
                                                                                           kpTypes={knowledgePatternTypes} items={items} setItems={setItems}/>))}
            <ReconciliationHistory items={items} setItems={setItems}/>
        </div>
    );
}