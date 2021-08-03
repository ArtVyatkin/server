import Latex from "react-latex-next";

export default function InputEstimations(props) {
    return <div className={'tags'}>
        <div className="tag is-medium kp-container__tab__input-item">
            <input type="text" value={props.firstValue}
                   onChange={(event) => props.updateValue(event.target.value, 0)}
                   className={'input is-small'} disabled={!props.modificable}/></div>
        <div className={"tag is-medium kp-container__tab__center-item " + props.className}>
            <Latex>{props.expression}</Latex>
        </div>
        {props.estimationType === props.estimationTypes.INTERVAL &&
        <div className={'kp-container__tab__input-item tag is-medium'}>
            <input type={"text"} value={props.secondValue} className="input is-small" disabled={!props.modificable}
                   onChange={(event) => props.updateValue(event.target.value, 1)}/>
        </div>}
    </div>
}