import {useContext, useState} from "react";
import {ApplicationContext} from "components/ABSApplication";
import {properties} from "properties";
import InputEstimations from "components/kp/InputEstimations";
import {estimationTypes, isVisibleInput} from "components/kp/KpPanel";
import {knowledgePatternTypes, variablesEvaluation} from "components/kp/KP";

export default function ReconciliationHistory(props) {
    const {context, updateContext} = useContext(ApplicationContext);
    const [page, setPage] = useState(0);
    const itemsSize = props.items ? props.items.length : 0;
    const openHistoryItem = (data, type, baseNumber, estimationType, status) => {
        const modal = {
            active: true,
            title: type,
            content: <div className={'kp-container__tab'}>
                {Object.keys(data).map(index => {
                    const variables = variablesEvaluation[type](baseNumber, index);
                    const expression = '$p_{' + variables + '}$';
                    const visible = isVisibleInput(Number.parseInt(index), type, knowledgePatternTypes);
                    return (visible &&
                        <InputEstimations expression={expression} key={index} estimationType={estimationType}
                                          estimationTypes={estimationTypes}
                                          modificable={false}
                                          updateValue={() => {
                                          }}
                                          firstValue={data[index][0]}
                                          secondValue={data[index][1]}
                                          className={status ? 'is-success' : 'is-danger'}/>);
                })}
            </div>
        }
        updateContext({...context, modal});
    }
    const deleteHistoryItem = (e, index) => {
        e.stopPropagation();
        const length = Object.values(props.items).length;
        const __items = props.items.splice(0, index).concat(index === length - 1 ? [] : props.items.splice(index + 1, length - 1));
        props.setItems(__items);
        localStorage.setItem(properties.reconciliationHistory, JSON.stringify(__items));
    }
    return (itemsSize > 0 && <div className={'rhistory'}>
        <div className="rhistory__title subtitle">
            History
        </div>
        {Object.values(props.items).splice(0, Math.min(itemsSize, (page + 1) * properties.historySize)).map((item, i) =>
            <div key={i} className="rhistory__items"
                 onClick={() => openHistoryItem(item.data, item.type, item.baseNumber, item.estimationType, item.status)}>
                <div className="rhistory__item level">
                    <div className="level-left">
                        <div className="level-item rhistory__item__number">
                            {i + 1}
                        </div>
                        <div className="level-item rhistory__item__type is-purple">
                            {item.type}
                        </div>
                        <div className="level-item is-purple">
                            {item.date}
                        </div>
                    </div>
                    <div className="level-right">
                        <div
                            className={"level-item rhistory__item__status " + (item.status ? 'has-text-success' : 'has-text-danger')}>
                            {item.statusText}
                        </div>
                        <div className="level-item delete" onClick={(e) => deleteHistoryItem(e, i)}/>
                    </div>
                </div>
            </div>
        )}
        {Math.min(itemsSize, (page + 1) * properties.historySize) < itemsSize && <div className="rhistory__more">
            <div className="button is-rounded is-dark" onClick={() => setPage(page+1)}>More</div>
        </div>}
    </div>)
}