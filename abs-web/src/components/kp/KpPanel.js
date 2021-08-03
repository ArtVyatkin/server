import {useState} from 'react';
import KpPanelModifiers from "components/kp/KpPanelModifiers";
import InputEstimations from "./InputEstimations";
import requestInconsistencyChecking from "utils/httputils";
import {variablesEvaluation} from "components/kp/KP";
import {properties} from "properties";


export const estimationTypes = {
    INTERVAL: 'Interval',
    SCALAR: 'Scalar'
}

const requestStatus = {
    NON_REQUESTED: 0,
    WAITING: 1,
    ERROR: 2,
    SUCCESS_CONSISTENCY: 3,
    SUCCESS_INCONSISTENCY: 4
}

const getDefaultFields = (kpType, kpTypes) => {
    return kpType === kpTypes.QUANTS ? {} : {
        [0]: {
            value: {
                [0]: 1,
                [1]: 1
            },
            valid: true,
            className: 'is-success'
        }
    }
}

export const isVisibleInput = (index, kpType, kpTypes) => {
    return kpType === kpTypes.QUANTS || (index !== 0);
}

export default function KpPanel(props) {
    const [estimationType, setEstimationType] = useState(estimationTypes.INTERVAL);
    const [baseNumber, setBaseNumber] = useState(3);
    const [status, setStatus] = useState(requestStatus.NON_REQUESTED);
    const [fields, setFields] = useState(getDefaultFields(props.kpType, props.kpTypes));
    const [validForm, setValidForm] = useState(false);
    const normalizeNumber = (number) => Number.parseFloat(String(number).replaceAll(',', '.'));
    const checkFieldValue = (value) => {
        const regexpTest = /^[0-9]+(([.,])[0-9]+)?$/.test(value);
        if (!regexpTest)
            return false;
        value = normalizeNumber(value);
        if (0 > value || value > 1.0)
            return false;
        return true
    }
    const checkIntervalValue = (firstValue, secondValue, type = estimationType) => {
        return normalizeNumber(secondValue) - normalizeNumber(firstValue) >= 0;
    }
    const updateValid = (valid) => {
        if (valid !== validForm)
            setValidForm(valid);
    }
    const validateForm = (__fields, __baseNumber = baseNumber) => {
        if (!__fields || (Object.keys(__fields).length < (1 << __baseNumber)))
            updateValid(false);

        for (let i = 0; i < 1 << __baseNumber; i++)
            if (!__fields[i] || !__fields[i].valid) {
                updateValid(false);
                return;
            }
        updateValid(true);
    }
    const getValueObject = (firstValue, secondValue, type = estimationType, index) => {
        if (index === 0 && props.kpType !== props.kpTypes.QUANTS)
            return {[0]: 1, [1]: 1};
        return {
            [0]: firstValue,
            [1]: type === estimationTypes.INTERVAL ? secondValue : firstValue
        }
    }
    const isValidFields = (firstValue, secondValue, type = estimationType) => {
        return checkFieldValue(firstValue) && checkFieldValue(secondValue) && checkIntervalValue(firstValue, secondValue);
    }
    const getClassName = (firstValue, secondValue, type = estimationType) => {
        if (isValidFields(firstValue, secondValue, type))
            return 'is-success';
        else if (!firstValue || (!secondValue && type === estimationTypes.INTERVAL))
            return 'is-dark';
        else
            return 'is-danger';
    }
    const normalizeValue = (value) => (
        Object.entries(value).reduce((prev, [key, value]) => ({...prev, [key]: normalizeNumber(value)}), {}))
    const updateValue = (fieldValue, num, index) => {
        const firstValue = (num === 0) ? fieldValue : (fields[index] ? fields[index].value[0] : '');
        const secondValue = (num === 1) ? fieldValue : (fields[index] ? fields[index].value[1] : '');
        const value = getValueObject(firstValue, secondValue, estimationType, index);
        const valid = isValidFields(value[0], value[1]);
        const className = getClassName(value[0], value[1]);
        const __fields = {...fields, [index]: {value, valid, className}};
        setFields(__fields);
        validateForm(__fields);
    }
    const updateBaseNumber = (update) => {
        if (status !== requestStatus.NON_REQUESTED)
            return
        let __baseNumber = baseNumber + update;
        __baseNumber = Math.max(__baseNumber, 1);
        __baseNumber = Math.min(__baseNumber, 10);
        setBaseNumber(__baseNumber);
        const __fields = Object.keys(fields).splice(0, 1 << __baseNumber).reduce(
            (prevFields, key) => {
                return {...prevFields, [key]: fields[key]}
            }, getDefaultFields(props.kpType, props.kpTypes));
        setFields(__fields);
        validateForm(__fields, __baseNumber);
    }
    const updateEstimationType = (type) => {
        const __fields = Object.keys(fields).reduce((prevFields, key) => {
            const value = getValueObject(fields[key].value[0], fields[key].value[1], type, Number.parseInt(key));
            const valid = isValidFields(value[0], value[1], type);
            const className = getClassName(value[0], value[1], type);
            return {...prevFields, [key]: {value, valid, className}}
        }, getDefaultFields(props.kpType, props.kpTypes));
        setEstimationType(type);
        setFields(__fields);
        validateForm(__fields);
    }
    const updateReconciliationHistory = (fields, type, estimationType, baseNumber, status, statusText) => {
        const oldHistory = JSON.parse(localStorage.getItem(properties.reconciliationHistory)) || [];
        const item = {
            data: Object.entries(fields).reduce((prev, [key, value]) => ({...prev, [key]: value.value}), {}),
            date: new Date().toLocaleString(),
            type: type.charAt(0).toUpperCase() + type.slice(1),
            status,
            statusText,
            estimationType,
            baseNumber
        }
        const newHistory = [item, ...oldHistory];
        localStorage.setItem(properties.reconciliationHistory, JSON.stringify(newHistory));
        props.setItems(newHistory);
    }
    const reconcile = () => {
        validateForm(fields);
        if (!validForm || !(status === requestStatus.NON_REQUESTED || status === requestStatus.ERROR))
            return
        const __baseNumber = baseNumber;
        const data = {}
        data.data = Object.keys(fields).slice(0, 1 << baseNumber).reduce((prevData, key) => (
            {...prevData, [key]: normalizeValue(fields[key].value)}
        ), {});
        data.type = props.kpType.toLowerCase();
        data.estimationType = estimationType.toLowerCase();
        setStatus(requestStatus.WAITING);
        requestInconsistencyChecking(data,
            (result) => {
                if (result.consistent) {
                    setStatus(requestStatus.SUCCESS_CONSISTENCY);
                    const __fields = Object.entries(fields).reduce((prev, [key, value]) => (
                            {
                                ...prev, [key]: {
                                    ...value, value: {
                                        [0]: result.data[key][0],
                                        [1]: result.data[key][1]
                                    }
                                }
                            }
                        ),
                        getDefaultFields(props.kpType, props.kpTypes))
                    setFields(__fields);
                    updateReconciliationHistory(__fields, data.type, estimationType, __baseNumber, true, 'Consistent');
                } else {
                    setStatus(requestStatus.SUCCESS_INCONSISTENCY);
                    const __fields = Object.entries(fields).reduce((prev, [key, value]) => ({
                            ...prev, [key]: {...value, className: 'is-danger', valid: false}
                        }),
                        getDefaultFields(props.kpType, props.kpTypes));
                    setFields(__fields);
                    updateReconciliationHistory(__fields, data.type, estimationType, __baseNumber, false, 'Inconsistent');
                }
            },
            (error) => {
                setStatus(requestStatus.ERROR);
                updateReconciliationHistory(fields, data.type, estimationType, __baseNumber, false, 'Server error');
            })
    }
    const cleanState = () => {
        setStatus(requestStatus.NON_REQUESTED);
        setFields(getDefaultFields(props.kpType, props.kpTypes));
        validateForm({});
    }
    const modifyState = () => {
        setStatus(requestStatus.NON_REQUESTED);
        validateForm(fields)
    }
    return <>
        <KpPanelModifiers estimationTypes={estimationTypes} estimationType={estimationType}
                          updateEstimationType={updateEstimationType}
                          baseNumber={baseNumber} updateBaseNumber={updateBaseNumber}/>
        <div className={'kp-container__tab'}>
            {[...Array((1 << baseNumber)).keys()].map(index => {
                const variables = variablesEvaluation[props.kpType](baseNumber, index);
                const expression = '$p_{' + variables + '}$';
                return (isVisibleInput(index, props.kpType, props.kpTypes) &&
                    <InputEstimations expression={expression} key={index} estimationType={estimationType}
                                      estimationTypes={estimationTypes}
                                      modificable={status === requestStatus.NON_REQUESTED}
                                      updateValue={(value, num) => updateValue(value, num, index)}
                                      firstValue={(fields[index] && fields[index].value[0]) ? fields[index].value[0] : ''}
                                      secondValue={(fields[index] && fields[index].value[1]) ? fields[index].value[1] : ''}
                                      className={fields[index] ? fields[index].className : 'is-dark'}/>);
            })}
        </div>
        <div className="kp-container__validate level">
            <div className="level-left">
                <div
                    className={"button kp-container__validate__submit " + (validForm && (status === requestStatus.NON_REQUESTED || status === requestStatus.ERROR)
                        ? 'is-purple' : 'is-inactive')}
                    onClick={() => reconcile()}>Reconcile
                </div>
            </div>
            <div className="level-right">
                <div className="kp-container__result">
                    {status === requestStatus.WAITING && <progress className="progress is-small is-primary"/>}
                    {status === requestStatus.ERROR && <p className="has-text-danger">Server error</p>}
                    {status === requestStatus.SUCCESS_CONSISTENCY &&
                    <p className="has-text-success">Data is consistent!</p>}
                    {status === requestStatus.SUCCESS_INCONSISTENCY &&
                    <p className="has-text-danger-dark">Data is inconsistent!</p>}
                </div>
                {(status !== requestStatus.NON_REQUESTED && status !== requestStatus.WAITING) &&
                <div className="kp-container__requested">
                    <div className="button is-purple-light kp-container__requested__state-changer"
                         onClick={() => cleanState()}>Clean
                    </div>
                    <div className="button is-purple kp-container__requested__state-changer"
                         onClick={() => modifyState()}>Modify
                    </div>
                </div>}
            </div>
        </div>
    </>
}