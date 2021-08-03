import {useContext} from "react";
import {ApplicationContext} from "components/ABSApplication";

export const openModal = (context, updateContext) => {
    updateContext({...context, modal: {...context.modal, active: true}});
}

export const closeModal = (context, updateContext) => {
    updateContext({...context, modal: {...context.modal, active: false}});
}

export default function Modal() {
    const {context, updateContext} = useContext(ApplicationContext);
    return (<div className={"modal" + (context.modal.active ? ' is-active' : '')}>
        <div className="modal-background"
             onClick={() => closeModal(context, updateContext)}></div>
        <div className="modal-card">
            <div className="modal-card-head">
                {context.modal.title}
            </div>
            <div className="modal-card-body">
                {context.modal.content}
            </div>
            {context.modal.footer && <div className="modal-card-foot">{context.modal.footer}</div>}
        </div>
        <button className="modal-close is-large" aria-label="close"
                onClick={() => closeModal(context, updateContext)}></button>
    </div>)
}