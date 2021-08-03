export default function KpPanelModifiers(props){
    return (<div className="kp-container__modifiers">
        <div className="tags kp-container__modifiers__checkbox">
            {Object.values(props.estimationTypes).map(type =>
                <div key={type}
                    className={'tag kp-container__modifiers__checkitem is-medium' + (type === props.estimationType ? ' is-active' : '')}
                    onClick={() => props.updateEstimationType(type)}>{type}</div>
            )}
        </div>
        <div className="tags has-addons kp-container__modifiers__number">
            <div className="tag is-medium kp-container__modifiers__number-action"
                 onClick={() => props.updateBaseNumber(-1)}>-
            </div>
            <div className="tag is-medium">{props.baseNumber}</div>
            <div className="tag is-medium kp-container__modifiers__number-action"
                 onClick={() => props.updateBaseNumber(+1)}>+
            </div>
        </div>
    </div>)
}